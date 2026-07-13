/**
 * Servidor: envío Web Push (RFC 8291 aes128gcm) usando exclusivamente Web Crypto.
 * Compatible con Cloudflare workerd, sin dependencias Node-only.
 *
 * Referencias:
 * - RFC 8291 (Message Encryption for Web Push)
 * - RFC 8292 (VAPID)
 */

const enc = new TextEncoder();

function b64urlToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const len = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(len);
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

/** Importa la clave privada VAPID (32B raw scalar) + pública (65B uncompressed) como CryptoKey ECDSA P-256. */
async function importVapidPrivateKey(): Promise<CryptoKey> {
  const priv = process.env.VAPID_PRIVATE_KEY;
  const pub = process.env.VAPID_PUBLIC_KEY;
  if (!priv || !pub) throw new Error("VAPID keys not configured");
  const pubBytes = b64urlToBytes(pub);
  if (pubBytes.length !== 65 || pubBytes[0] !== 0x04) {
    throw new Error("VAPID_PUBLIC_KEY must be 65-byte uncompressed P-256");
  }
  const x = bytesToB64url(pubBytes.slice(1, 33));
  const y = bytesToB64url(pubBytes.slice(33, 65));
  const jwk: JsonWebKey = { kty: "EC", crv: "P-256", d: priv, x, y, ext: true };
  return crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, [
    "sign",
  ]);
}

/** Firma JWT ES256 para VAPID. */
async function signVapidJwt(audience: string): Promise<string> {
  const subject = process.env.VAPID_SUBJECT;
  if (!subject) throw new Error("VAPID_SUBJECT not configured");
  const header = { typ: "JWT", alg: "ES256" };
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
    sub: subject,
  };
  const encodeSeg = (o: unknown) => bytesToB64url(enc.encode(JSON.stringify(o)));
  const signingInput = `${encodeSeg(header)}.${encodeSeg(payload)}`;
  const key = await importVapidPrivateKey();
  const sig = new Uint8Array(
    await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      key,
      enc.encode(signingInput),
    ),
  );
  return `${signingInput}.${bytesToB64url(sig)}`;
}

/** Fuerza un ArrayBuffer real (no SharedArrayBuffer) para satisfacer los tipos estrictos de Web Crypto. */
function ab(u: Uint8Array): ArrayBuffer {
  return u.buffer.slice(u.byteOffset, u.byteOffset + u.byteLength) as ArrayBuffer;
}

/** HKDF-SHA256 → derivar N bytes. */
async function hkdf(
  ikm: Uint8Array,
  salt: Uint8Array,
  info: Uint8Array,
  length: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", ab(ikm), "HKDF", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: ab(salt), info: ab(info) },
    key,
    length * 8,
  );
  return new Uint8Array(bits);
}

/** Codifica cuerpo cifrado aes128gcm según RFC 8291. */
async function encryptPayload(
  subscription: PushSubscriptionRecord,
  payloadBytes: Uint8Array,
): Promise<Uint8Array> {
  // 1. Ephemeral P-256 keypair del emisor.
  const ephemeral = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  );
  const asPublicSpki = new Uint8Array(
    await crypto.subtle.exportKey("raw", ephemeral.publicKey),
  ); // 65 bytes uncompressed

  // 2. Importar clave pública del UA.
  const uaPublicBytes = b64urlToBytes(subscription.p256dh);
  const uaPublicKey = await crypto.subtle.importKey(
    "raw",
    ab(uaPublicBytes),
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );

  // 3. ECDH shared secret (32B).
  const shared = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "ECDH", public: uaPublicKey },
      ephemeral.privateKey,
      256,
    ),
  );

  // 4. auth_secret (16B) desde la suscripción.
  const authSecret = b64urlToBytes(subscription.auth);

  // 5. PRK_key = HKDF(salt=authSecret, ikm=shared, info="WebPush: info\0" || ua_pub || as_pub, 32B).
  const keyInfo = concat(enc.encode("WebPush: info\0"), uaPublicBytes, asPublicSpki);
  const prkKey = await hkdf(shared, authSecret, keyInfo, 32);

  // 6. Salt aleatoria (16B).
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // 7. CEK = HKDF(salt, prkKey, "Content-Encoding: aes128gcm\0", 16).
  const cek = await hkdf(prkKey, salt, enc.encode("Content-Encoding: aes128gcm\0"), 16);

  // 8. Nonce = HKDF(salt, prkKey, "Content-Encoding: nonce\0", 12).
  const nonce = await hkdf(prkKey, salt, enc.encode("Content-Encoding: nonce\0"), 12);

  // 9. Padding: append 0x02 (último registro) sin bytes extra.
  const padded = concat(payloadBytes, new Uint8Array([0x02]));

  // 10. AES-128-GCM.
  const cekKey = await crypto.subtle.importKey("raw", ab(cek), { name: "AES-GCM" }, false, [
    "encrypt",
  ]);
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: ab(nonce) }, cekKey, ab(padded)),
  );

  // 11. Header binario RFC 8188: salt(16) || rs=4096(u32be) || idlen=65(u8) || keyid(as_pub 65) || ct.
  const rs = new Uint8Array([0x00, 0x00, 0x10, 0x00]);
  const idlen = new Uint8Array([asPublicSpki.length]);
  return concat(salt, rs, idlen, asPublicSpki, ct);
}


export interface PushSubscriptionRecord {
  endpoint: string;
  p256dh: string; // base64url raw 65B
  auth: string; // base64url raw 16B
}

export interface PushMessage {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
  data?: Record<string, unknown>;
}

export interface PushSendResult {
  ok: boolean;
  status: number;
  bodyText?: string;
  /** Cuando true, la suscripción está muerta: 404 o 410. */
  gone: boolean;
}

/** Envía un push al endpoint del proveedor. No lanza; retorna resultado estructurado. */
export async function sendWebPush(
  subscription: PushSubscriptionRecord,
  message: PushMessage,
  opts: { ttlSeconds?: number; urgency?: "very-low" | "low" | "normal" | "high" } = {},
): Promise<PushSendResult> {
  const audience = new URL(subscription.endpoint).origin;
  const jwt = await signVapidJwt(audience);
  const vapidPub = process.env.VAPID_PUBLIC_KEY!;
  const payload = enc.encode(JSON.stringify(message));
  const body = await encryptPayload(subscription, payload);

  const resp = await fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
      "Content-Length": String(body.byteLength),
      TTL: String(opts.ttlSeconds ?? 60 * 60 * 24),
      Urgency: opts.urgency ?? "normal",
      Authorization: `vapid t=${jwt}, k=${vapidPub}`,
    },
    body,
  });

  const gone = resp.status === 404 || resp.status === 410;
  let bodyText: string | undefined;
  if (!resp.ok) {
    try {
      bodyText = await resp.text();
    } catch (_) {
      /* ignore */
    }
  }
  return { ok: resp.ok, status: resp.status, bodyText, gone };
}

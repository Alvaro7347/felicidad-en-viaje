// Respuesta oficial del Equipo SoundKeleles. Sin identidad personal.
import { B } from "@/features/archipielago/data/brand";
import type { LessonDiscussionReply } from "../types";
import { formatDiscussionDate } from "./formatDate";

type Props = { reply: LessonDiscussionReply };

export function DiscussionReplyItem({ reply }: Props) {
  return (
    <div
      style={{
        marginTop: 12,
        marginLeft: 12,
        borderLeft: `3px solid ${B.green}`,
        background: B.greenLight,
        borderRadius: 12,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 6,
        }}
      >
        <span style={{ fontWeight: 800, color: B.dark, fontSize: 14 }}>
          Equipo SoundKeleles
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: B.greenDark,
            background: B.white,
            border: `1px solid ${B.grayBorder}`,
            padding: "2px 8px",
            borderRadius: 999,
          }}
        >
          Respuesta oficial
        </span>
        <span style={{ fontSize: 12, color: B.grayText, marginLeft: "auto" }}>
          {formatDiscussionDate(reply.createdAt)}
        </span>
      </div>
      <p
        style={{
          margin: 0,
          color: B.dark,
          fontSize: 14,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {reply.content}
      </p>
    </div>
  );
}

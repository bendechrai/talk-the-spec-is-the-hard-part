import receipts from "@/lib/receipts.json";

type Msg = { who: string; when: string; text: string };
const all = receipts as Record<string, Msg[]>;

export default function Receipt({ id, title }: { id: string; title?: string }) {
  const msgs = all[id] ?? [];
  return (
    <div className="receipt">
      {title && <p className="receipt-title">{title}</p>}
      <div className="receipt-card">
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.who}`}>
            <div className="meta">
              <span className="who">{m.who === "ben" ? "Ben" : m.who === "agent" ? "Agent" : "Claude"}</span>
              {m.when && <span className="when">{m.when}</span>}
            </div>
            <p>{m.text}</p>
          </div>
        ))}
        <div className="receipt-foot">paraphrased from the transcript</div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

type Entry = { t: number; dir: "→" | "←" | "!"; text: string };

function isDebug() {
  const env = import.meta.env as { DEV?: boolean; VITE_DEBUG_API?: string };
  return !!env.DEV || env.VITE_DEBUG_API === "1";
}

export default function ApiDebugOverlay() {
  const [items, setItems] = useState<Entry[]>([]);
  useEffect(() => {
    if (!isDebug()) return;
    const id = setInterval(() => {
      const logs = (globalThis as unknown as { __API_LOGS__?: Entry[] })
        .__API_LOGS__;
      if (Array.isArray(logs)) setItems([...logs]);
    }, 500);
    return () => clearInterval(id);
  }, []);
  if (!isDebug()) return null;
  return (
    <div className="fixed bottom-2 right-2 max-h-[40vh] w-[420px] overflow-auto bg-black/80 text-gray-100 text-xs p-2 rounded shadow-lg z-50">
      <div className="flex justify-between items-center mb-1">
        <strong className="text-[11px]">API Logs</strong>
        <span className="opacity-70">{items.length}</span>
      </div>
      <ul className="space-y-1">
        {items.map((e, i) => (
          <li key={i} className="whitespace-pre-wrap break-words">
            <span className="mr-1">
              {e.dir === "→" ? "🟦" : e.dir === "←" ? "🟩" : "🟨"}
            </span>
            <span className="opacity-70 mr-1">
              {new Date(e.t).toLocaleTimeString()}
            </span>
            <span>{e.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

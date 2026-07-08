import { useEffect, useRef, useState } from 'react';

interface LogLine {
  message: string;
  ts: number;
  id: number;
}

// Detect pattern tag and return color
function getLineColor(msg: string): string {
  if (msg.includes('[Singleton]')) return '#f59e0b';
  if (msg.includes('[Builder]')) return '#10b981';
  if (msg.includes('[AbstractFactory') || msg.includes('Factory]')) return '#8b5cf6';
  if (msg.includes('[Strategy')) return '#06b6d4';
  if (msg.includes('[State')) return '#ef4444';
  if (msg.includes('[Facade]') || msg.includes('[SSE]')) return '#f97316';
  if (msg.includes('✅') || msg.includes('running')) return '#34d399';
  if (msg.includes('❌') || msg.includes('Error') || msg.includes('error')) return '#f87171';
  return '#94a3b8';
}

function getTagLabel(msg: string): string | null {
  if (msg.includes('[Singleton]')) return 'SINGLETON';
  if (msg.includes('[Builder]')) return 'BUILDER';
  if (msg.includes('[AbstractFactory')) return 'FACTORY';
  if (msg.includes('[Strategy')) return 'STRATEGY';
  if (msg.includes('[State')) return 'STATE';
  if (msg.includes('[Facade]')) return 'FACADE';
  if (msg.includes('[SSE]')) return 'SSE';
  return null;
}

const TAG_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  SINGLETON: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', text: '#f59e0b' },
  BUILDER: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', text: '#10b981' },
  FACTORY: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.35)', text: '#8b5cf6' },
  STRATEGY: { bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.35)', text: '#06b6d4' },
  STATE: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)', text: '#ef4444' },
  FACADE: { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.35)', text: '#f97316' },
  SSE: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.12)', text: '#94a3b8' },
};

let lineId = 0;

interface Props {
  open: boolean;
  onToggle: () => void;
}

export default function TerminalLog({ open, onToggle }: Props) {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [connected, setConnected] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource('http://localhost:3001/api/logs/stream');
    esRef.current = es;
    es.onopen = () => setConnected(true);
    es.onmessage = (e) => {
      try {
        const { message, ts } = JSON.parse(e.data);
        setLogs(prev => [...prev.slice(-200), { message, ts, id: ++lineId }]);
      } catch (_) { }
    };
    es.onerror = () => setConnected(false);

    return () => {
      es.close();
    };
  }, []);

  // Auto-scroll to bottom whenever new logs arrive (only when open)
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, open]);

  const clear = () => setLogs([]);

  return (
    <>
      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          right: open ? '0' : '-450px', // slide out of view
          top: 0,
          height: '100vh',
          width: '450px',
          zIndex: 9999,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          background: '#020617', // Very dark blue/black
          boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
          borderLeft: '1px solid #1e293b',
          transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: '#0f172a',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '0.9rem', flex: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚙️ Backend Terminal
            <span style={{ color: connected ? '#22c55e' : '#ef4444', fontSize: '1.2rem', lineHeight: 0.5 }} title={connected ? "Connected to SSE" : "Disconnected"}>•</span>
          </span>

          <button
            onClick={clear}
            style={{ background: 'none', border: '1px solid #334155', borderRadius: '4px', color: '#94a3b8', padding: '0.3rem 0.8rem', fontSize: '0.75rem', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#1e293b'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            Clear
          </button>

          <button
            onClick={onToggle}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.5rem' }}
          >
            ✕
          </button>
        </div>


        {/* ── Log Body ── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0.75rem 1.25rem',
            scrollbarWidth: 'thin',
            scrollbarColor: '#1e293b transparent',
          }}
        >
          {logs.length === 0 && (
            <div style={{ color: '#475569', fontSize: '0.85rem', paddingTop: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
              Listening to backend events...
            </div>
          )}

          {logs.map(line => {
            const tag = getTagLabel(line.message);
            const color = getLineColor(line.message);
            const tagColors = tag ? TAG_COLORS[tag] : null;
            const time = new Date(line.ts).toLocaleTimeString('en-US', {
              hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
            });

            return (
              <div key={line.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', marginBottom: '0.6rem', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {/* Timestamp */}
                <span style={{ color: '#475569', flexShrink: 0 }}>{time}</span>
                {/* Pattern tag badge */}
                {tag ? (
                  <span style={{ background: tagColors?.bg || '#ffffff10', color: tagColors?.text || color, border: tagColors?.border ? `1px solid ${tagColors.border}` : `1px solid ${color}44`, borderRadius: '4px', padding: '0.1rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, minWidth: '6rem', textAlign: 'center' }}>
                    {tag}
                  </span>
                ) : (
                  <span style={{ minWidth: '6rem', flexShrink: 0 }} />
                )}

                {/* Message */}
                <span style={{ color, wordBreak: 'break-word', flex: 1 }}>
                  {line.message}
                </span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';

const API = 'http://localhost:3001';

// Color & icon config per pattern
const PATTERNS = [
  {
    id: 'singleton',
    name: 'Singleton',
    type: 'Creational',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
    icon: '🔒',
    description: 'Only ONE GameCatalog instance exists globally. Every call returns the same object.',
    what: 'Calls GET /api/games — the backend logs show the catalog was created only once at startup.',
    async run() {
      const r = await fetch(`${API}/api/games`);
      const d = await r.json();
      return {
        label: `✅ Singleton returned ${d.games?.length} games`,
        note: 'Check backend terminal: "[Singleton] GameCatalog instance created" appears only ONCE at startup.',
        data: d.games?.map((g: any) => `${g.name} (${g.gameCode})`),
      };
    },
  },
  {
    id: 'builder',
    name: 'Builder',
    type: 'Creational',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.3)',
    icon: '🔧',
    description: 'OrderBuilder constructs a TopUpOrder step-by-step: setGameCode → setPlayer → setPackage → applyPromoCode → build()',
    what: 'Calls POST /api/order/pay which internally runs OrderBuilder chain.',
    async run() {
      const r = await fetch(`${API}/api/order/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameCode: 'MLBB', playerId: '12345678', zoneId: '2001',
          packageId: 'DIA_250', amount: 250, basePrice: 4.99,
          discountPercentage: 10, finalPrice: 4.49, paymentMethod: 'ABA',
        }),
      });
      const d = await r.json();
      return {
        label: `✅ Builder created Order: ${d.orderId}`,
        note: 'Check backend terminal: "[Builder] Order built: ORD_..."',
        data: [`Order ID: ${d.orderId}`, `State: ${d.state}`, `Receipt: ${d.receipt?.receiptId}`],
      };
    },
  },
  {
    id: 'abstract-factory',
    name: 'Abstract Factory',
    type: 'Creational',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.3)',
    icon: '🏭',
    description: 'ABAPayFactory and ACLEDAPayFactory each produce a matching payment handler + receipt generator pair.',
    what: 'Calls /api/order/pay twice — once with ABA, once with ACLEDA — and compares receipts.',
    async run() {
      const [r1, r2] = await Promise.all([
        fetch(`${API}/api/order/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameCode: 'PUBG', playerId: '5522113344', zoneId: '', packageId: 'PKG_300', amount: 300, basePrice: 4.99, discountPercentage: 0, finalPrice: 4.99, paymentMethod: 'ABA' }),
        }),
        fetch(`${API}/api/order/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameCode: 'COC', playerId: 'COC_112233', zoneId: '', packageId: 'GEM_500', amount: 500, basePrice: 4.99, discountPercentage: 0, finalPrice: 4.99, paymentMethod: 'ACLEDA' }),
        }),
      ]);
      const d1 = await r1.json();
      const d2 = await r2.json();
      return {
        label: '✅ Two factories created matching handler+receipt pairs',
        note: 'Check backend terminal for "[AbstractFactory: ABAPayFactory]" and "[AbstractFactory: ACLEDAPayFactory]"',
        data: [
          `ABA Receipt ID: ${d1.receipt?.receiptId} | Format: ${d1.receipt?.format}`,
          `ACLEDA Receipt ID: ${d2.receipt?.receiptId} | Format: ${d2.receipt?.format}`,
        ],
      };
    },
  },
  {
    id: 'strategy',
    name: 'Strategy',
    type: 'Behavioral',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.3)',
    icon: '🎯',
    description: 'PaymentProcessor holds a PaymentStrategy. Swapping ABA ↔ ACLEDA changes behavior without changing the context.',
    what: 'Shows ABAPayStrategy vs ACLEDAPayStrategy producing different gateway names.',
    async run() {
      const r = await fetch(`${API}/api/order/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameCode: 'VALORANT', playerId: 'VAL_445566', zoneId: '', packageId: 'VP_1000', amount: 1000, basePrice: 9.99, discountPercentage: 25, finalPrice: 7.49, paymentMethod: 'ACLEDA' }),
      });
      const d = await r.json();
      return {
        label: `✅ Strategy: ${d.receipt?.gateway} processed payment`,
        note: 'Check backend: "[Strategy: ACLEDAPayStrategy] Initiating ACLEDA payment..."',
        data: [
          `Gateway used: ${d.receipt?.gateway}`,
          `Receipt format: ${d.receipt?.format}`,
          `Order state: ${d.state}`,
        ],
      };
    },
  },
  {
    id: 'state',
    name: 'State',
    type: 'Behavioral',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.3)',
    icon: '🔄',
    description: 'Orders transition: Pending → Paid → Completed/Failed. Each state controls what operations are valid.',
    what: 'Creates an order (Pending→Paid→Completed) and checks /api/history for state.',
    async run() {
      await fetch(`${API}/api/order/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameCode: 'GENSHIN', playerId: '700123456', zoneId: 'os_asia', packageId: 'CRYSTAL_300', amount: 300, basePrice: 4.99, discountPercentage: 0, finalPrice: 4.99, paymentMethod: 'ABA' }),
      });
      const r2 = await fetch(`${API}/api/history`);
      const history = await r2.json();
      const orders = history.orders || [];
      return {
        label: `✅ State machine: ${orders.length} orders in history`,
        note: 'Backend logs: "[State: Pending] Processing payment..." → "[State: Paid] Attempting delivery..."',
        data: orders.slice(-3).map((o: any) => `${o.id} | State: ${o.state} | Game: ${o.gameCode}`),
      };
    },
  },
  {
    id: 'facade',
    name: 'Facade',
    type: 'Structural',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.3)',
    icon: '🎭',
    description: 'PublisherFacade hides 8 different publisher APIs (Moonton, Tencent, HoYoverse, etc.) behind 2 simple methods.',
    what: 'Tests verify for 3 different games — each routes to a different hidden publisher API.',
    async run() {
      const tests = [
        { gameCode: 'MLBB',     playerId: '12345678', zoneId: '2001' },
        { gameCode: 'PUBG',     playerId: '5522113344', zoneId: '' },
        { gameCode: 'GENSHIN',  playerId: '700123456', zoneId: 'os_asia' },
      ];
      const results = await Promise.all(tests.map(t =>
        fetch(`${API}/api/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t),
        }).then(r => r.json())
      ));
      return {
        label: '✅ Facade routed 3 games to different publisher APIs',
        note: 'Backend logs show: MoontonAPI, TencentAPI, HoYoverseAPI — all called via ONE Facade interface.',
        data: results.map((r, i) => `${tests[i].gameCode}: ${r.username} (${r.isValid ? '✓ Valid' : '✗ Invalid'})`),
      };
    },
  },
];

interface PatternResult {
  label: string;
  note: string;
  data?: string[];
}

export default function PatternsDemo() {
  const [results, setResults] = useState<Record<string, PatternResult | 'loading' | 'error'>>({});

  const runTest = async (pattern: typeof PATTERNS[0]) => {
    setResults(r => ({ ...r, [pattern.id]: 'loading' }));
    try {
      const result = await pattern.run();
      setResults(r => ({ ...r, [pattern.id]: result }));
    } catch (e) {
      setResults(r => ({ ...r, [pattern.id]: 'error' }));
    }
  };

  const runAll = async () => {
    for (const p of PATTERNS) {
      await runTest(p);
      await new Promise(res => setTimeout(res, 300));
    }
  };

  const typeColor = (type: string) => {
    if (type === 'Creational') return '#f59e0b';
    if (type === 'Behavioral') return '#06b6d4';
    return '#f97316';
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-block', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '999px', padding: '0.4rem 1.2rem', color: '#f97316', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          LIVE API TESTING
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #f97316, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
          Design Pattern Demo
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '0.75rem', fontSize: '1.05rem' }}>
          Click each card to call the backend API and prove the pattern is working in real-time
        </p>
        <button
          onClick={runAll}
          style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.85rem 2.5rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 24px rgba(249,115,22,0.4)', transition: 'transform 0.15s' }}
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          🚀 Run All 6 Pattern Tests
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['Creational', 'Behavioral', 'Structural'].map(t => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: typeColor(t), display: 'inline-block' }} />
            {t}
          </span>
        ))}
      </div>

      {/* Pattern Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {PATTERNS.map(p => {
          const result = results[p.id];
          const isLoading = result === 'loading';
          const isError = result === 'error';
          const isSuccess = result && result !== 'loading' && result !== 'error';

          return (
            <div key={p.id} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: '16px', padding: '1.75rem', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden' }}
              onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${p.color}22`; }}
              onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
              {/* Accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${p.color}, transparent)`, borderRadius: '16px 16px 0 0' }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>{p.icon}</span>
                  <div>
                    <div style={{ color: p.color, fontWeight: 800, fontSize: '1.1rem' }}>{p.name}</div>
                    <div style={{ color: typeColor(p.type), fontSize: '0.75rem', fontWeight: 600, opacity: 0.9 }}>{p.type} Pattern</div>
                  </div>
                </div>
                <button
                  onClick={() => runTest(p)}
                  disabled={isLoading}
                  style={{ background: p.color, color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', fontWeight: 700, fontSize: '0.85rem', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}
                >
                  {isLoading ? '⏳ Testing...' : '▶ Run Test'}
                </button>
              </div>

              {/* Description */}
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 0.75rem' }}>
                {p.description}
              </p>

              {/* What it tests */}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1rem' }}>
                <strong style={{ color: p.color }}>Tests: </strong>{p.what}
              </div>

              {/* Result */}
              {isError && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '1rem', color: '#fca5a5', fontSize: '0.85rem' }}>
                  ❌ Backend not responding — make sure <code>npm run dev</code> is running on port 3001
                </div>
              )}
              {isSuccess && (
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {(result as PatternResult).label}
                  </div>
                  <div style={{ color: '#6ee7b7', fontSize: '0.78rem', marginBottom: '0.75rem', opacity: 0.9 }}>
                    💡 {(result as PatternResult).note}
                  </div>
                  {(result as PatternResult).data && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {(result as PatternResult).data!.map((line, i) => (
                        <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', padding: '0.35rem 0.6rem' }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!result && (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px', padding: '1rem', textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>
                  Click "Run Test" to call the backend API
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: '2.5rem', textAlign: 'center', color: '#475569', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
        All tests call <code style={{ color: '#94a3b8' }}>http://localhost:3001</code> — watch the backend terminal to see each pattern's console.log output
      </div>
    </div>
  );
}

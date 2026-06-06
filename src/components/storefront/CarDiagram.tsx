'use client';

import { useEffect, useState } from 'react';

type ServiceType = 'maintenance' | 'malfunction' | '';

export default function CarDiagram({ serviceType }: { serviceType: ServiceType }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 40);
    return () => clearInterval(id);
  }, []);

  const engineGlow = serviceType === 'maintenance';
  const faultGlow = serviceType === 'malfunction';
  const angle = tick * 4;

  const spoke = (cx: number, cy: number, r1: number, r2: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return (
      <line
        x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
        x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
        stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round"
      />
    );
  };

  const Wheel = ({ cx, cy }: { cx: number; cy: number }) => (
    <g>
      {/* Outer tyre */}
      <circle cx={cx} cy={cy} r="32" fill="#0a0a0a" stroke="#333" strokeWidth="2" />
      {/* Tyre sidewall highlight */}
      <circle cx={cx} cy={cy} r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeDasharray="12 8" />
      {/* Rim */}
      <circle cx={cx} cy={cy} r="22" fill="#111827" stroke="#ea580c" strokeWidth="1.5" />
      {/* Spokes */}
      <g transform={`rotate(${angle}, ${cx}, ${cy})`}>
        {[0, 60, 120, 180, 240, 300].map(d => spoke(cx, cy, 6, 20, d))}
      </g>
      {/* Centre */}
      <circle cx={cx} cy={cy} r="6" fill="#ea580c" />
      <circle cx={cx} cy={cy} r="3" fill="white" opacity="0.5" />
      {/* Brake disc hint */}
      <circle cx={cx} cy={cy} r="14" fill="none" stroke="rgba(234,88,12,0.2)" strokeWidth="1" strokeDasharray="3 3" />
    </g>
  );

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 select-none">
      <svg viewBox="0 0 640 260" className="w-full max-w-2xl">
        <defs>
          <filter id="glow-orange">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a2744" />
            <stop offset="100%" stopColor="#0f1a33" />
          </linearGradient>
          <linearGradient id="windshieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a1628" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* ── GROUND REFLECTION ── */}
        <ellipse cx="320" cy="248" rx="260" ry="7" fill="rgba(234,88,12,0.08)" />
        <line x1="50" y1="246" x2="590" y2="246" stroke="rgba(234,88,12,0.12)" strokeWidth="1" />

        {/* ── BODY ── */}
        {/* Rocker panel / lower body */}
        <path d="M 100 188 Q 100 202 112 202 L 528 202 Q 540 202 540 188 L 540 175 L 100 175 Z"
          fill="url(#bodyGrad)" stroke="rgba(234,88,12,0.3)" strokeWidth="1" />

        {/* Main body */}
        <path d="M 100 175 L 100 142 Q 100 135 108 132 L 168 126 Q 192 98 230 84 L 390 82 Q 432 82 458 104 L 512 128 Q 534 132 540 142 L 540 175 Z"
          fill="url(#bodyGrad)" stroke="rgba(234,88,12,0.4)" strokeWidth="1.5" />

        {/* ── ROOF / CABIN ── */}
        <path d="M 175 126 Q 188 84 228 70 L 390 68 Q 428 68 452 90 L 472 126 Z"
          fill="url(#roofGrad)" stroke="#ea580c" strokeWidth="1.5"
          filter="url(#glow-orange)" opacity="0.9" />

        {/* Roof edge highlight */}
        <path d="M 195 126 Q 207 88 232 74 L 388 72 Q 422 72 444 92 L 460 126"
          fill="none" stroke="rgba(234,88,12,0.25)" strokeWidth="1" />

        {/* ── WINDSHIELD ── */}
        <path d="M 188 124 Q 200 88 232 74 L 275 72 L 275 124 Z"
          fill="url(#windshieldGrad)" stroke="#38bdf8" strokeWidth="1.2"
          filter="url(#glow-blue)" />
        {/* Wiper */}
        <line x1="208" y1="120" x2="265" y2="84"
          stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Windshield reflection */}
        <path d="M 200 118 Q 215 90 235 78" fill="none"
          stroke="rgba(255,255,255,0.12)" strokeWidth="5" strokeLinecap="round" />

        {/* ── REAR WINDOW ── */}
        <path d="M 288 72 L 390 70 Q 424 70 446 90 L 462 124 L 288 124 Z"
          fill="url(#windshieldGrad)" stroke="#38bdf8" strokeWidth="1.2"
          filter="url(#glow-blue)" />
        {/* Rear window reflection */}
        <path d="M 310 72 L 310 120" fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />

        {/* ── B-PILLAR ── */}
        <rect x="276" y="70" width="10" height="54" fill="#0a0f1e" />
        <line x1="281" y1="70" x2="281" y2="124"
          stroke="rgba(234,88,12,0.2)" strokeWidth="1" />

        {/* ── DOOR LINES ── */}
        <line x1="285" y1="124" x2="285" y2="200"
          stroke="rgba(234,88,12,0.2)" strokeWidth="1.5" />
        {/* Door handles — modern flush style */}
        <rect x="312" y="155" width="26" height="7" rx="3.5"
          fill="#1e293b" stroke="rgba(234,88,12,0.5)" strokeWidth="1" />
        <rect x="190" y="155" width="26" height="7" rx="3.5"
          fill="#1e293b" stroke="rgba(234,88,12,0.5)" strokeWidth="1" />

        {/* ── HOOD ── */}
        <path d="M 458 106 L 512 130 L 540 142 L 540 175 L 458 175 Z"
          fill="#131c2e" stroke="rgba(234,88,12,0.3)" strokeWidth="1.2" />
        {/* Hood scoop / crease line */}
        <path d="M 462 110 Q 500 125 536 148"
          fill="none" stroke="rgba(234,88,12,0.15)" strokeWidth="1.5" />
        <path d="M 468 116 Q 505 130 538 152"
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />

        {/* ── TRUNK ── */}
        <path d="M 100 142 L 100 175 L 162 175 L 168 126 Z"
          fill="#131c2e" stroke="rgba(234,88,12,0.3)" strokeWidth="1.2" />

        {/* ── FRONT BUMPER ── */}
        <path d="M 536 182 L 572 182 Q 582 182 582 192 L 582 202 L 536 202 Z"
          fill="#0d1117" stroke="#1e293b" strokeWidth="1" />
        {/* Grill slats */}
        {[185, 190, 195].map((y, i) => (
          <rect key={i} x="540" y={y} width="36" height="2.5" rx="1"
            fill="rgba(234,88,12,0.4)" />
        ))}
        {/* Fog light */}
        <rect x="541" y="198" width="12" height="3" rx="1.5"
          fill={engineGlow || faultGlow ? '#fbbf24' : '#334155'}
          style={{ transition: 'fill 0.3s' }} />

        {/* ── REAR BUMPER ── */}
        <path d="M 100 182 L 64 182 Q 54 182 54 192 L 54 202 L 100 202 Z"
          fill="#0d1117" stroke="#1e293b" strokeWidth="1" />
        {/* Exhaust */}
        <rect x="62" y="197" width="14" height="5" rx="2"
          fill="#1e293b" stroke="#333" strokeWidth="1" />
        <ellipse cx="76" cy="199.5" rx="2" ry="2.5" fill="#111" />

        {/* ── FRONT HEADLIGHT — thin LED style ── */}
        <path d="M 536 132 L 578 138 L 578 162 L 536 158 Z"
          fill="#0a0e1a" stroke="#1e293b" strokeWidth="1" />
        {/* DRL strip */}
        <path d="M 538 135 L 576 140"
          stroke={engineGlow || faultGlow ? '#fde68a' : '#1e3a5f'}
          strokeWidth="4" strokeLinecap="round"
          filter={engineGlow || faultGlow ? 'url(#glow-orange)' : ''}
          style={{ transition: 'all 0.3s' }} />
        {/* Main beam */}
        <rect x="540" y="148" width="34" height="8" rx="2"
          fill={engineGlow || faultGlow ? 'rgba(253,230,138,0.25)' : '#0f1c2e'}
          style={{ transition: 'all 0.3s' }} />
        {/* Beam rays */}
        {(engineGlow || faultGlow) && (
          <>
            <path d="M 578 138 L 625 125 L 625 170 L 578 162 Z"
              fill="rgba(253,230,138,0.04)" />
            <line x1="578" y1="140" x2="622" y2="130" stroke="rgba(253,230,138,0.15)" strokeWidth="1" />
            <line x1="578" y1="150" x2="625" y2="148" stroke="rgba(253,230,138,0.15)" strokeWidth="1" />
            <line x1="578" y1="158" x2="622" y2="165" stroke="rgba(253,230,138,0.15)" strokeWidth="1" />
          </>
        )}

        {/* ── REAR TAILLIGHT — LED bar ── */}
        <path d="M 60 132 L 100 128 L 100 158 L 60 154 Z"
          fill="#0a0e1a" stroke="#1e293b" strokeWidth="1" />
        {/* LED bar */}
        <path d="M 62 136 L 98 132"
          stroke={faultGlow ? '#f87171' : '#4a0a0a'}
          strokeWidth="5" strokeLinecap="round"
          filter={faultGlow ? 'url(#glow-red)' : ''}
          style={{ transition: 'all 0.3s' }} />
        <rect x="63" y="145" width="33" height="7" rx="2"
          fill={faultGlow ? 'rgba(248,113,113,0.3)' : '#1a0808'}
          style={{ transition: 'all 0.3s' }} />

        {/* ── WING MIRRORS ── */}
        <path d="M 468 120 L 480 116 L 484 124 L 470 127 Z"
          fill="#1e293b" stroke="rgba(234,88,12,0.3)" strokeWidth="1" />

        {/* ══ WHEELS ══ */}
        <Wheel cx={168} cy={214} />
        <Wheel cx={472} cy={214} />

        {/* Wheel arch lips */}
        <path d="M 136 180 Q 168 168 200 180"
          fill="none" stroke="rgba(234,88,12,0.35)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 440 180 Q 472 168 504 180"
          fill="none" stroke="rgba(234,88,12,0.35)" strokeWidth="2" strokeLinecap="round" />

        {/* ══════════════════════════
            SERVICE OVERLAYS
        ══════════════════════════ */}

        {/* MAINTENANCE ENGINE OVERLAY */}
        {engineGlow && (
          <g filter="url(#glow-orange)">
            {/* Pulsing engine box */}
            <rect x="462" y="138" width="68" height="34" rx="5"
              fill="rgba(234,88,12,0.08)" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="4 2">
              <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
            </rect>
            {/* Engine icon — simplified */}
            <rect x="472" y="146" width="10" height="6" rx="1" fill="none" stroke="#ea580c" strokeWidth="1.2" />
            <rect x="486" y="146" width="10" height="6" rx="1" fill="none" stroke="#ea580c" strokeWidth="1.2" />
            <rect x="500" y="146" width="10" height="6" rx="1" fill="none" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="477" y1="152" x2="477" y2="160" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="482" y1="152" x2="482" y2="160" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="491" y1="152" x2="491" y2="160" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="496" y1="152" x2="496" y2="160" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="505" y1="152" x2="505" y2="160" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="510" y1="152" x2="510" y2="160" stroke="#ea580c" strokeWidth="1.2" />
            <text x="496" y="170" textAnchor="middle" fontSize="7" fill="#ea580c"
              fontWeight="bold" letterSpacing="1.5">ENGINE</text>
            {/* Oil drop */}
            <path d="M 476 174 Q 476 180 480 180 Q 484 180 484 174 L 480 168 Z"
              fill="#ea580c" opacity="0.7" />
          </g>
        )}

        {/* MALFUNCTION OVERLAY */}
        {faultGlow && (
          <g>
            {/* Sweep scan line */}
            <line x1="100" y1="175" x2="540" y2="175"
              stroke="rgba(239,68,68,0.2)" strokeWidth="1.5">
              <animate attributeName="y1" values="140;200;140" dur="2s" repeatCount="indefinite" />
              <animate attributeName="y2" values="140;200;140" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" />
            </line>
            {/* Warning triangle on bonnet */}
            <g filter="url(#glow-red)">
              <polygon points="320,92 340,128 300,128"
                fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="2">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="0.6s" repeatCount="indefinite" />
              </polygon>
              <text x="320" y="122" textAnchor="middle" fontSize="16"
                fill="#ef4444" fontWeight="bold">!</text>
            </g>
            {/* Fault nodes */}
            {[
              { cx: 168, cy: 210 },
              { cx: 230, cy: 168 },
              { cx: 320, cy: 155 },
              { cx: 410, cy: 168 },
              { cx: 472, cy: 210 },
            ].map(({ cx, cy }, i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="5" fill="#ef4444" opacity="0.9"
                  filter="url(#glow-red)">
                  <animate attributeName="r" values="3;6;3" dur="0.8s"
                    begin={`${i * 0.15}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;1;0.2" dur="0.8s"
                    begin={`${i * 0.15}s`} repeatCount="indefinite" />
                </circle>
                {/* Connector lines between nodes */}
                {i < 4 && (
                  <line
                    x1={cx} y1={cy}
                    x2={[230,320,410,472][i]}
                    y2={[168,155,168,210][i]}
                    stroke="rgba(239,68,68,0.2)" strokeWidth="1" strokeDasharray="3 3">
                    <animate attributeName="opacity" values="0;0.6;0" dur="0.8s"
                      begin={`${i * 0.15}s`} repeatCount="indefinite" />
                  </line>
                )}
              </g>
            ))}
            {/* OBD code text */}
            <text x="320" y="240" textAnchor="middle" fontSize="8"
              fill="rgba(239,68,68,0.5)" fontFamily="monospace" letterSpacing="2">
              P0300 · P0420 · SCANNING...
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
            </text>
          </g>
        )}

        {/* IDLE PARTICLES */}
        {!serviceType && (
          <g>
            {[
              { cx: 280, y: 52, dur: '2.1s', r: 2.5 },
              { cx: 310, y: 48, dur: '2.7s', r: 2 },
              { cx: 340, y: 55, dur: '1.9s', r: 2 },
              { cx: 255, y: 58, dur: '3.2s', r: 1.5 },
              { cx: 365, y: 50, dur: '2.4s', r: 1.5 },
            ].map(({ cx, y, dur, r }, i) => (
              <circle key={i} cx={cx} cy={y} r={r} fill="#ea580c" opacity="0.5">
                <animate attributeName="cy" values={`${y};${y-12};${y}`} dur={dur} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.15;0.6;0.15" dur={dur} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        )}

      </svg>

      {/* Status pill */}
      <div className="mt-2 h-7 flex items-center justify-center">
        {serviceType && (
          <div className="flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full"
            style={{
              background: serviceType === 'maintenance'
                ? 'rgba(234,88,12,0.12)' : 'rgba(239,68,68,0.12)',
              color: serviceType === 'maintenance' ? '#fb923c' : '#f87171',
              border: `1px solid ${serviceType === 'maintenance'
                ? 'rgba(234,88,12,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: serviceType === 'maintenance' ? '#ea580c' : '#ef4444',
              display: 'inline-block',
              boxShadow: `0 0 6px ${serviceType === 'maintenance' ? '#ea580c' : '#ef4444'}`,
            }} />
            {serviceType === 'maintenance'
              ? '🔧 وضع الصيانة الدورية'
              : '⚠️ وضع تشخيص الأعطال'}
          </div>
        )}
      </div>
    </div>
  );
}

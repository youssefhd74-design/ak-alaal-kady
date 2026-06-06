'use client';

import { useEffect, useState } from 'react';

type ServiceType = 'maintenance' | 'malfunction' | '';

export default function CarDiagram({ serviceType }: { serviceType: ServiceType }) {
  const [tick, setTick] = useState(0);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const wheelAngle = tick * 3;
  const engineGlow = serviceType === 'maintenance';
  const faultGlow = serviceType === 'malfunction';

  // Which parts to highlight based on service
  const activeParts = engineGlow
    ? ['engine', 'oilFilter', 'airFilter', 'exhaust']
    : faultGlow
    ? ['battery', 'alternator', 'brakes', 'suspension']
    : [];

  const isActive = (part: string) => activeParts.includes(part);

  const spoke = (cx: number, cy: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return (
      <line
        x1={cx + 7 * Math.cos(rad)} y1={cy + 7 * Math.sin(rad)}
        x2={cx + 21 * Math.cos(rad)} y2={cy + 21 * Math.sin(rad)}
        stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"
      />
    );
  };

  const Wheel = ({ cx, cy }: { cx: number; cy: number }) => (
    <g>
      {/* Tyre */}
      <circle cx={cx} cy={cy} r="30" fill="#1e293b" stroke="#334155" strokeWidth="3" />
      {/* Rim */}
      <circle cx={cx} cy={cy} r="21" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
      {/* Brake disc — red when fault */}
      <circle cx={cx} cy={cy} r="16"
        fill={isActive('brakes') ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)'}
        stroke={isActive('brakes') ? '#ef4444' : '#334155'}
        strokeWidth="1.5"
        style={{ transition: 'all 0.4s' }} />
      {/* Brake caliper */}
      <rect x={cx - 4} y={cy - 20} width="8" height="6" rx="1"
        fill={isActive('brakes') ? '#ef4444' : '#475569'}
        style={{ transition: 'fill 0.4s' }} />
      {/* Spokes */}
      <g transform={`rotate(${wheelAngle}, ${cx}, ${cy})`}>
        {[0, 60, 120, 180, 240, 300].map(d => spoke(cx, cy, d))}
      </g>
      {/* Centre cap */}
      <circle cx={cx} cy={cy} r="6" fill="#475569" stroke="#64748b" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="3" fill="#94a3b8" />
    </g>
  );

  return (
    <div className="w-full flex flex-col items-center py-4 select-none">
      <svg viewBox="0 0 680 280" className="w-full max-w-2xl">
        <defs>
          <filter id="glow-o" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-r" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-y" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-b" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Glass gradient for body */}
          <linearGradient id="shellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.18"/>
            <stop offset="60%" stopColor="#64748b" stopOpacity="0.10"/>
            <stop offset="100%" stopColor="#334155" stopOpacity="0.20"/>
          </linearGradient>
          <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.08"/>
          </linearGradient>
          <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="30%" stopColor="rgba(234,88,12,0.15)"/>
            <stop offset="70%" stopColor="rgba(234,88,12,0.15)"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>

        {/* Ground */}
        <ellipse cx="340" cy="262" rx="280" ry="8" fill="url(#groundGrad)" />

        {/* ══════════════════════════════════
            INTERNALS — drawn UNDER the shell
        ══════════════════════════════════ */}

        {/* SUSPENSION — front */}
        <g opacity={isActive('suspension') ? 1 : 0.5} style={{ transition: 'opacity 0.4s' }}>
          <line x1="490" y1="190" x2="490" y2="230" stroke={isActive('suspension') ? '#f59e0b' : '#475569'} strokeWidth="3" strokeLinecap="round" filter={isActive('suspension') ? 'url(#glow-y)' : ''} />
          <line x1="475" y1="210" x2="510" y2="210" stroke={isActive('suspension') ? '#f59e0b' : '#475569'} strokeWidth="2" />
          <circle cx="490" cy="195" r="6" fill={isActive('suspension') ? '#f59e0b' : '#334155'} stroke={isActive('suspension') ? '#fbbf24' : '#475569'} strokeWidth="1.5" filter={isActive('suspension') ? 'url(#glow-y)' : ''} />
          {/* Spring coils */}
          {[0,1,2,3,4].map(i => (
            <path key={i} d={`M ${478 + (i%2)*6} ${215 + i*4} Q 490 ${217 + i*4} ${484 + (i%2)*8} ${219 + i*4}`}
              fill="none" stroke={isActive('suspension') ? '#f59e0b' : '#475569'} strokeWidth="1.5" />
          ))}
        </g>

        {/* SUSPENSION — rear */}
        <g opacity={isActive('suspension') ? 1 : 0.5} style={{ transition: 'opacity 0.4s' }}>
          <line x1="185" y1="190" x2="185" y2="230" stroke={isActive('suspension') ? '#f59e0b' : '#475569'} strokeWidth="3" strokeLinecap="round" filter={isActive('suspension') ? 'url(#glow-y)' : ''} />
          <line x1="170" y1="210" x2="205" y2="210" stroke={isActive('suspension') ? '#f59e0b' : '#475569'} strokeWidth="2" />
          <circle cx="185" cy="195" r="6" fill={isActive('suspension') ? '#f59e0b' : '#334155'} stroke={isActive('suspension') ? '#fbbf24' : '#475569'} strokeWidth="1.5" filter={isActive('suspension') ? 'url(#glow-y)' : ''} />
          {[0,1,2,3,4].map(i => (
            <path key={i} d={`M ${173 + (i%2)*6} ${215 + i*4} Q 185 ${217 + i*4} ${179 + (i%2)*8} ${219 + i*4}`}
              fill="none" stroke={isActive('suspension') ? '#f59e0b' : '#475569'} strokeWidth="1.5" />
          ))}
        </g>

        {/* DRIVETRAIN / AXLE */}
        <line x1="185" y1="232" x2="490" y2="232"
          stroke="#334155" strokeWidth="4" strokeLinecap="round"
          style={{ transition: 'all 0.4s' }} />
        <line x1="300" y1="232" x2="370" y2="232"
          stroke={isActive('engine') ? '#ea580c' : '#1e293b'}
          strokeWidth="6"
          filter={isActive('engine') ? 'url(#glow-o)' : ''}
          style={{ transition: 'all 0.4s' }} />

        {/* ENGINE BLOCK */}
        <g filter={isActive('engine') ? 'url(#glow-o)' : ''}>
          <rect x="440" y="148" width="80" height="55" rx="6"
            fill={isActive('engine') ? 'rgba(234,88,12,0.2)' : 'rgba(51,65,85,0.8)'}
            stroke={isActive('engine') ? '#ea580c' : '#475569'}
            strokeWidth={isActive('engine') ? 2 : 1.5}
            style={{ transition: 'all 0.4s' }} />
          {/* Cylinder heads */}
          {[0,1,2,3].map(i => (
            <g key={i}>
              <rect x={447 + i*18} y="140" width="12" height="12" rx="2"
                fill={isActive('engine') ? '#ea580c' : '#334155'}
                stroke={isActive('engine') ? '#fb923c' : '#475569'}
                strokeWidth="1.2"
                style={{ transition: 'all 0.4s' }} />
              {/* Piston animation */}
              {isActive('engine') && (
                <rect x={449 + i*18} y="152" width="8" height="6" rx="1"
                  fill="#fb923c" opacity="0.6">
                  <animate attributeName="y" values="150;155;150" dur={`${0.3 + i*0.1}s`} repeatCount="indefinite" />
                </rect>
              )}
            </g>
          ))}
          {/* Engine label */}
          <text x="480" y="192" textAnchor="middle" fontSize="8"
            fill={isActive('engine') ? '#fb923c' : '#64748b'}
            fontWeight="bold" letterSpacing="1"
            style={{ transition: 'fill 0.4s' }}>ENGINE</text>
        </g>

        {/* EXHAUST SYSTEM */}
        <g opacity={isActive('exhaust') ? 1 : 0.4} style={{ transition: 'opacity 0.4s' }}>
          <path d="M 440 185 Q 380 195 320 192 Q 260 190 200 195 Q 160 198 130 200"
            fill="none" stroke={isActive('exhaust') ? '#ea580c' : '#374151'}
            strokeWidth="5" strokeLinecap="round"
            filter={isActive('exhaust') ? 'url(#glow-o)' : ''} />
          {/* Exhaust tip */}
          <ellipse cx="128" cy="200" rx="6" ry="4"
            fill={isActive('exhaust') ? '#ea580c' : '#1f2937'}
            stroke={isActive('exhaust') ? '#fb923c' : '#374151'} strokeWidth="1.5" />
          {/* Exhaust smoke when maintenance */}
          {isActive('exhaust') && (
            <g opacity="0.6">
              {[0,1,2].map(i => (
                <circle key={i} cx={115 - i*10} cy={195} r={3 + i*2}
                  fill="rgba(234,88,12,0.2)">
                  <animate attributeName="cx" values={`${115 - i*10};${105 - i*10}`} dur={`${0.8 + i*0.3}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0" dur={`${0.8 + i*0.3}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}
        </g>

        {/* AIR FILTER */}
        <g filter={isActive('airFilter') ? 'url(#glow-o)' : ''}>
          <ellipse cx="530" cy="148" rx="18" ry="12"
            fill={isActive('airFilter') ? 'rgba(234,88,12,0.2)' : 'rgba(30,41,59,0.8)'}
            stroke={isActive('airFilter') ? '#ea580c' : '#475569'}
            strokeWidth={isActive('airFilter') ? 2 : 1.5}
            style={{ transition: 'all 0.4s' }} />
          <text x="530" y="152" textAnchor="middle" fontSize="6"
            fill={isActive('airFilter') ? '#fb923c' : '#64748b'}
            fontWeight="bold">AIR</text>
        </g>

        {/* OIL FILTER */}
        <g filter={isActive('oilFilter') ? 'url(#glow-o)' : ''}>
          <rect x="455" y="200" width="30" height="18" rx="4"
            fill={isActive('oilFilter') ? 'rgba(234,88,12,0.25)' : 'rgba(30,41,59,0.8)'}
            stroke={isActive('oilFilter') ? '#ea580c' : '#475569'}
            strokeWidth={isActive('oilFilter') ? 2 : 1.5}
            style={{ transition: 'all 0.4s' }} />
          <text x="470" y="213" textAnchor="middle" fontSize="6"
            fill={isActive('oilFilter') ? '#fb923c' : '#64748b'}
            fontWeight="bold">OIL</text>
          {/* Oil drip */}
          {isActive('oilFilter') && (
            <path d="M 470 218 Q 470 226 474 226 Q 478 226 478 218"
              fill="#ea580c" opacity="0.5">
              <animate attributeName="opacity" values="0;0.6;0" dur="1s" repeatCount="indefinite" />
            </path>
          )}
        </g>

        {/* BATTERY */}
        <g filter={isActive('battery') ? 'url(#glow-y)' : ''}>
          <rect x="385" y="148" width="48" height="32" rx="4"
            fill={isActive('battery') ? 'rgba(234,179,8,0.2)' : 'rgba(30,41,59,0.8)'}
            stroke={isActive('battery') ? '#eab308' : '#475569'}
            strokeWidth={isActive('battery') ? 2 : 1.5}
            style={{ transition: 'all 0.4s' }} />
          {/* +/- terminals */}
          <rect x="391" y="144" width="8" height="6" rx="1"
            fill={isActive('battery') ? '#eab308' : '#475569'}
            style={{ transition: 'fill 0.4s' }} />
          <rect x="418" y="144" width="8" height="6" rx="1"
            fill={isActive('battery') ? '#eab308' : '#475569'}
            style={{ transition: 'fill 0.4s' }} />
          <text x="393" y="147" fontSize="6" fill={isActive('battery') ? '#fbbf24' : '#64748b'} fontWeight="bold">+</text>
          <text x="420" y="147" fontSize="6" fill={isActive('battery') ? '#fbbf24' : '#64748b'} fontWeight="bold">−</text>
          {/* Battery cells */}
          {[0,1,2,3].map(i => (
            <line key={i} x1={391 + i*10} y1="154" x2={391 + i*10} y2="172"
              stroke={isActive('battery') ? 'rgba(234,179,8,0.5)' : '#334155'}
              strokeWidth="1.5"
              style={{ transition: 'stroke 0.4s' }} />
          ))}
          <text x="409" y="176" textAnchor="middle" fontSize="7"
            fill={isActive('battery') ? '#fbbf24' : '#64748b'}
            fontWeight="bold" style={{ transition: 'fill 0.4s' }}>BATTERY</text>
          {/* Charge lightning */}
          {isActive('battery') && (
            <text x="409" y="165" textAnchor="middle" fontSize="14" fill="#fbbf24"
              filter="url(#glow-y)">
              ⚡
              <animate attributeName="opacity" values="0.4;1;0.4" dur="0.6s" repeatCount="indefinite" />
            </text>
          )}
        </g>

        {/* ALTERNATOR */}
        <g filter={isActive('alternator') ? 'url(#glow-y)' : ''}>
          <circle cx="375" cy="195" r="16"
            fill={isActive('alternator') ? 'rgba(234,179,8,0.15)' : 'rgba(30,41,59,0.8)'}
            stroke={isActive('alternator') ? '#eab308' : '#475569'}
            strokeWidth={isActive('alternator') ? 2 : 1.5}
            style={{ transition: 'all 0.4s' }} />
          {/* Rotor lines */}
          {[0,45,90,135].map(d => (
            <line key={d}
              x1={375 + 5 * Math.cos(d * Math.PI/180)}
              y1={195 + 5 * Math.sin(d * Math.PI/180)}
              x2={375 + 13 * Math.cos(d * Math.PI/180)}
              y2={195 + 13 * Math.sin(d * Math.PI/180)}
              stroke={isActive('alternator') ? '#fbbf24' : '#475569'}
              strokeWidth="2" strokeLinecap="round"
              style={{ transition: 'stroke 0.4s' }}>
              {isActive('alternator') && (
                <animateTransform attributeName="transform" type="rotate"
                  from={`0 375 195`} to={`360 375 195`} dur="1s" repeatCount="indefinite" />
              )}
            </line>
          ))}
          <text x="375" y="213" textAnchor="middle" fontSize="6"
            fill={isActive('alternator') ? '#fbbf24' : '#64748b'}
            fontWeight="bold">ALT</text>
        </g>

        {/* RADIATOR / COOLING */}
        <g>
          <rect x="556" y="150" width="20" height="48" rx="3"
            fill="rgba(30,41,59,0.8)" stroke="#475569" strokeWidth="1.5" />
          {[0,1,2,3,4,5].map(i => (
            <line key={i} x1="558" y1={157 + i*7} x2="574" y2={157 + i*7}
              stroke="#334155" strokeWidth="1" />
          ))}
          <text x="566" y="206" textAnchor="middle" fontSize="6"
            fill="#64748b" fontWeight="bold">RAD</text>
        </g>

        {/* FUEL TANK */}
        <g>
          <rect x="220" y="195" width="55" height="28" rx="5"
            fill="rgba(30,41,59,0.7)" stroke="#475569" strokeWidth="1.5" />
          <text x="247" y="213" textAnchor="middle" fontSize="7"
            fill="#64748b" fontWeight="bold">FUEL</text>
          {/* Fuel level */}
          <rect x="224" y="208" width={faultGlow ? 15 : 42} height="8" rx="2"
            fill={faultGlow ? '#ef4444' : '#22c55e'} opacity="0.5"
            style={{ transition: 'width 1s, fill 0.4s' }} />
        </g>

        {/* STEERING */}
        <g>
          <line x1="430" y1="165" x2="400" y2="175"
            stroke="#374151" strokeWidth="3" strokeLinecap="round" />
          <circle cx="430" cy="163" r="5" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        </g>

        {/* ══════════════════════════════════
            TRANSPARENT CAR SHELL
        ══════════════════════════════════ */}

        {/* Lower body */}
        <path d="M 105 190 Q 105 210 118 210 L 562 210 Q 575 210 575 190 L 575 170 L 105 170 Z"
          fill="url(#shellGrad)" stroke="rgba(148,163,184,0.35)" strokeWidth="1.5" />

        {/* Main body */}
        <path d="M 108 170 L 108 138 Q 108 130 116 127 L 178 120 Q 205 92 248 76 L 408 74 Q 452 74 478 98 L 538 124 Q 562 128 568 140 L 568 170 Z"
          fill="url(#shellGrad)" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />

        {/* Roof */}
        <path d="M 184 120 Q 200 78 248 62 L 408 60 Q 448 60 474 82 L 498 120 Z"
          fill="url(#roofGrad)" stroke="rgba(203,213,225,0.4)" strokeWidth="1.5" />

        {/* Windshield */}
        <path d="M 196 118 Q 210 80 250 66 L 290 64 L 290 118 Z"
          fill="rgba(147,197,253,0.08)" stroke="rgba(147,197,253,0.5)" strokeWidth="1.2" />
        {/* Windshield reflection */}
        <path d="M 208 114 Q 224 82 254 70"
          fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" strokeLinecap="round" />

        {/* Rear window */}
        <path d="M 304 64 L 408 62 Q 444 62 466 82 L 490 118 L 304 118 Z"
          fill="rgba(147,197,253,0.08)" stroke="rgba(147,197,253,0.5)" strokeWidth="1.2" />

        {/* B-pillar */}
        <rect x="291" y="62" width="11" height="56"
          fill="rgba(15,23,42,0.6)" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />

        {/* Door line */}
        <line x1="302" y1="118" x2="302" y2="205"
          stroke="rgba(148,163,184,0.25)" strokeWidth="1.5" />

        {/* Door handles */}
        <rect x="326" y="152" width="28" height="7" rx="3.5"
          fill="rgba(30,41,59,0.8)" stroke="rgba(148,163,184,0.4)" strokeWidth="1" />
        <rect x="196" y="152" width="28" height="7" rx="3.5"
          fill="rgba(30,41,59,0.8)" stroke="rgba(148,163,184,0.4)" strokeWidth="1" />

        {/* Hood outline */}
        <path d="M 478 100 L 538 126 L 568 140 L 568 170 L 478 170 Z"
          fill="rgba(148,163,184,0.05)" stroke="rgba(148,163,184,0.3)" strokeWidth="1.2" />
        {/* Hood crease */}
        <path d="M 482 106 Q 522 128 566 148"
          fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="2" />

        {/* Trunk */}
        <path d="M 108 138 L 108 170 L 172 170 L 178 120 Z"
          fill="rgba(148,163,184,0.05)" stroke="rgba(148,163,184,0.3)" strokeWidth="1.2" />

        {/* Front bumper */}
        <path d="M 564 178 L 598 178 Q 610 178 610 190 L 610 210 L 564 210 Z"
          fill="rgba(30,41,59,0.9)" stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
        {/* Grill */}
        {[182,188,194,200].map((y, i) => (
          <rect key={i} x="568" y={y} width="36" height="2.5" rx="1"
            fill="rgba(234,88,12,0.35)" />
        ))}

        {/* Rear bumper */}
        <path d="M 108 178 L 74 178 Q 62 178 62 190 L 62 210 L 108 210 Z"
          fill="rgba(30,41,59,0.9)" stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
        {/* Exhaust outlets */}
        <ellipse cx="78" cy="205" rx="7" ry="4"
          fill="#0f172a" stroke="#334155" strokeWidth="1" />
        <ellipse cx="92" cy="205" rx="7" ry="4"
          fill="#0f172a" stroke="#334155" strokeWidth="1" />

        {/* ── HEADLIGHT ── */}
        <path d="M 564 132 L 606 138 L 606 168 L 564 164 Z"
          fill="#0a0e1a" stroke="#1e293b" strokeWidth="1" />
        <path d="M 566 136 L 604 141"
          stroke={serviceType ? '#fde68a' : '#1e3a5f'}
          strokeWidth="4" strokeLinecap="round"
          filter={serviceType ? 'url(#glow-y)' : ''}
          style={{ transition: 'all 0.3s' }} />
        <rect x="567" y="150" width="35" height="9" rx="2"
          fill={serviceType ? 'rgba(253,230,138,0.2)' : '#0f1c2e'}
          style={{ transition: 'all 0.3s' }} />
        {serviceType && (
          <path d="M 606 138 L 650 124 L 650 172 L 606 168 Z"
            fill="rgba(253,230,138,0.05)" />
        )}

        {/* ── TAILLIGHT ── */}
        <path d="M 68 132 L 108 128 L 108 164 L 68 160 Z"
          fill="#0a0e1a" stroke="#1e293b" strokeWidth="1" />
        <path d="M 70 136 L 106 132"
          stroke={faultGlow ? '#f87171' : '#4a0a0a'}
          strokeWidth="5" strokeLinecap="round"
          filter={faultGlow ? 'url(#glow-r)' : ''}
          style={{ transition: 'all 0.3s' }} />
        <rect x="71" y="148" width="33" height="9" rx="2"
          fill={faultGlow ? 'rgba(248,113,113,0.3)' : '#1a0808'}
          style={{ transition: 'all 0.3s' }} />

        {/* Wing mirror */}
        <path d="M 490 114 L 504 110 L 508 120 L 492 122 Z"
          fill="rgba(30,41,59,0.9)" stroke="rgba(148,163,184,0.3)" strokeWidth="1" />

        {/* ══ WHEELS (on top of body) ══ */}
        <Wheel cx={185} cy={224} />
        <Wheel cx={490} cy={224} />

        {/* Wheel arch highlights */}
        <path d="M 152 178 Q 185 166 218 178"
          fill="none" stroke="rgba(234,88,12,0.3)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 457 178 Q 490 166 523 178"
          fill="none" stroke="rgba(234,88,12,0.3)" strokeWidth="2" strokeLinecap="round" />

        {/* ══ FAULT SCAN OVERLAY ══ */}
        {faultGlow && (
          <g>
            <line x1="108" y1="150" x2="564" y2="150"
              stroke="rgba(239,68,68,0.15)" strokeWidth="2">
              <animate attributeName="y1" values="120;210;120" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="y2" values="120;210;120" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.6;0" dur="2.5s" repeatCount="indefinite" />
            </line>
            <text x="340" y="258" textAnchor="middle" fontSize="8"
              fill="rgba(239,68,68,0.6)" fontFamily="monospace" letterSpacing="2">
              DIAGNOSTIC SCAN · P0300 · P0562
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
            </text>
          </g>
        )}

        {/* ══ IDLE PARTICLES ══ */}
        {!serviceType && (
          <g>
            {[
              { cx: 300, y: 44, dur: '2.2s' },
              { cx: 340, y: 40, dur: '2.8s' },
              { cx: 270, y: 48, dur: '1.9s' },
              { cx: 370, y: 46, dur: '3.1s' },
              { cx: 320, y: 38, dur: '2.5s' },
            ].map(({ cx, y, dur }, i) => (
              <circle key={i} cx={cx} cy={y} r="2" fill="#ea580c">
                <animate attributeName="cy" values={`${y};${y-14};${y}`} dur={dur} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.1;0.5;0.1" dur={dur} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        )}

      </svg>

      {/* Status pill */}
      <div className="mt-1 h-7 flex items-center justify-center">
        {serviceType && (
          <div className="flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full"
            style={{
              background: engineGlow ? 'rgba(234,88,12,0.12)' : 'rgba(239,68,68,0.12)',
              color: engineGlow ? '#fb923c' : '#f87171',
              border: `1px solid ${engineGlow ? 'rgba(234,88,12,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: engineGlow ? '#ea580c' : '#ef4444',
              display: 'inline-block',
              boxShadow: `0 0 6px ${engineGlow ? '#ea580c' : '#ef4444'}`,
            }} />
            {engineGlow ? '🔧 وضع الصيانة — المحرك، الزيت، الفلاتر' : '⚠️ وضع الأعطال — البطارية، الفرامل، التعليق'}
          </div>
        )}
      </div>
    </div>
  );
}

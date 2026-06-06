'use client';

import { useEffect, useState } from 'react';

type ServiceType = 'maintenance' | 'malfunction' | '';

export default function CarDiagram({ serviceType }: { serviceType: ServiceType }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const engineGlow = serviceType === 'maintenance';
  const faultGlow   = serviceType === 'malfunction';

  // Wheel spin angle
  const wheelAngle = tick * 3;

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-4 select-none">
      <svg viewBox="0 0 600 240" className="w-full max-w-2xl">

        {/* ── GROUND ── */}
        <ellipse cx="300" cy="228" rx="240" ry="7" fill="rgba(255,255,255,0.04)" />
        <line x1="60" y1="228" x2="540" y2="228" stroke="rgba(234,88,12,0.15)" strokeWidth="1" />

        {/* ══════════════════════════════════════════
            BODY — modern sedan silhouette
        ══════════════════════════════════════════ */}

        {/* Lower body / sill */}
        <path d="
          M 85 175
          L 85 195
          Q 85 205 95 205
          L 505 205
          Q 515 205 515 195
          L 515 175
          Z
        " fill="#1c1c2e" stroke="#2a2a3e" strokeWidth="1" />

        {/* Main body shell */}
        <path d="
          M 90 175
          L 90 145
          Q 90 138 98 135
          L 155 130
          Q 175 105 210 90
          L 370 88
          Q 415 88 445 108
          L 490 130
          Q 510 133 515 145
          L 515 175
          Z
        " fill="#1e1e30" stroke="#2e2e42" strokeWidth="1.5" />

        {/* Roof — sleek low arch */}
        <path d="
          M 168 130
          Q 178 88 210 76
          L 368 74
          Q 400 74 422 90
          L 452 130
          Z
        " fill="#16162a" stroke="#2a2a3e" strokeWidth="1.5" />

        {/* ── WINDOWS ── */}
        {/* Windshield */}
        <path d="
          M 178 128
          Q 188 92 212 80
          L 258 78
          L 258 128
          Z
        " fill="#0d1b3e" stroke="rgba(234,88,12,0.5)" strokeWidth="1" opacity="0.95" />

        {/* Rear window */}
        <path d="
          M 272 78
          L 366 78
          Q 392 80 410 96
          L 442 128
          L 272 128
          Z
        " fill="#0d1b3e" stroke="rgba(234,88,12,0.5)" strokeWidth="1" opacity="0.95" />

        {/* B-pillar */}
        <rect x="260" y="78" width="10" height="50" fill="#111" />

        {/* Window reflections */}
        <line x1="193" y1="120" x2="210" y2="86" stroke="rgba(255,255,255,0.06)" strokeWidth="6" strokeLinecap="round" />
        <line x1="295" y1="82" x2="295" y2="126" stroke="rgba(255,255,255,0.04)" strokeWidth="8" strokeLinecap="round" />

        {/* ── DOOR LINES ── */}
        <line x1="270" y1="128" x2="270" y2="200" stroke="#2a2a42" strokeWidth="1.5" />
        {/* Door handles */}
        <rect x="300" y="160" width="22" height="6" rx="3" fill="#2a2a3e" stroke="rgba(234,88,12,0.4)" strokeWidth="1" />
        <rect x="180" y="160" width="22" height="6" rx="3" fill="#2a2a3e" stroke="rgba(234,88,12,0.4)" strokeWidth="1" />

        {/* ── HOOD ── */}
        <path d="
          M 450 133
          L 515 145
          L 515 175
          L 450 175
          Z
        " fill="#1a1a2c" stroke="#2a2a3e" strokeWidth="1" />
        {/* Hood crease */}
        <line x1="452" y1="138" x2="514" y2="150" stroke="rgba(234,88,12,0.15)" strokeWidth="1" />

        {/* ── TRUNK ── */}
        <path d="
          M 90 145
          L 90 175
          L 150 175
          L 155 130
          Z
        " fill="#1a1a2c" stroke="#2a2a3e" strokeWidth="1" />

        {/* ── FRONT BUMPER ── */}
        <path d="
          M 510 190
          L 540 190
          Q 548 190 548 197
          L 548 205
          L 510 205
          Z
        " fill="#111122" stroke="#222233" strokeWidth="1" />
        {/* Lower grill strip */}
        <rect x="514" y="196" width="30" height="4" rx="2" fill="#ea580c" opacity="0.6" />

        {/* ── REAR BUMPER ── */}
        <path d="
          M 90 190
          L 60 190
          Q 52 190 52 197
          L 52 205
          L 90 205
          Z
        " fill="#111122" stroke="#222233" strokeWidth="1" />

        {/* ── FRONT LED HEADLIGHT ── */}
        {/* Main housing */}
        <path d="M 510 138 L 545 143 L 545 162 L 510 160 Z"
          fill="#0a0a1a" stroke="#333" strokeWidth="1" />
        {/* LED strip — daytime running */}
        <path d="M 512 141 L 542 145"
          stroke={engineGlow || faultGlow ? '#fbbf24' : '#334155'}
          strokeWidth="3" strokeLinecap="round"
          style={{ filter: engineGlow || faultGlow ? 'drop-shadow(0 0 4px #fbbf24)' : 'none', transition: 'all 0.4s' }}
        />
        {/* Low beam */}
        <rect x="512" y="150" width="28" height="7" rx="2"
          fill={engineGlow || faultGlow ? 'rgba(251,191,36,0.3)' : '#1e293b'}
          style={{ transition: 'all 0.4s' }}
        />
        {/* Light beam */}
        {(engineGlow || faultGlow) && (
          <path d="M 545 143 L 595 130 L 595 168 L 545 162 Z"
            fill="rgba(251,191,36,0.06)" />
        )}

        {/* ── REAR LED TAILLIGHT ── */}
        <path d="M 55 138 L 90 133 L 90 162 L 55 158 Z"
          fill="#0a0a1a" stroke="#333" strokeWidth="1" />
        {/* LED strip */}
        <path d="M 58 141 L 88 137"
          stroke={faultGlow ? '#ef4444' : '#4a1010'}
          strokeWidth="3" strokeLinecap="round"
          style={{ filter: faultGlow ? 'drop-shadow(0 0 5px #ef4444)' : 'none', transition: 'all 0.4s' }}
        />
        <rect x="58" y="149" width="28" height="7" rx="2"
          fill={faultGlow ? 'rgba(239,68,68,0.3)' : '#1a0808'}
          style={{ transition: 'all 0.4s' }}
        />

        {/* ══════════════════════════════════════════
            WHEELS — modern low-profile
        ══════════════════════════════════════════ */}

        {/* REAR WHEEL */}
        <g transform={`rotate(${wheelAngle}, 148, 205)`}>
          {[0,45,90,135,180,225,270,315].map((deg) => (
            <line key={deg}
              x1={148 + 14 * Math.cos(deg * Math.PI/180)}
              y1={205 + 14 * Math.sin(deg * Math.PI/180)}
              x2={148 + 22 * Math.cos(deg * Math.PI/180)}
              y2={205 + 22 * Math.sin(deg * Math.PI/180)}
              stroke="#ea580c" strokeWidth="2" strokeLinecap="round"
            />
          ))}
        </g>
        {/* Tyre */}
        <circle cx="148" cy="205" r="28" fill="none" stroke="#111" strokeWidth="10" />
        <circle cx="148" cy="205" r="28" fill="none" stroke="#222" strokeWidth="8" />
        {/* Rim */}
        <circle cx="148" cy="205" r="22" fill="#1a1a2a" stroke="#2a2a3a" strokeWidth="1.5" />
        {/* Centre cap */}
        <circle cx="148" cy="205" r="6" fill="#ea580c" opacity="0.9" />
        <circle cx="148" cy="205" r="3" fill="#fff" opacity="0.3" />

        {/* FRONT WHEEL */}
        <g transform={`rotate(${wheelAngle}, 452, 205)`}>
          {[0,45,90,135,180,225,270,315].map((deg) => (
            <line key={deg}
              x1={452 + 14 * Math.cos(deg * Math.PI/180)}
              y1={205 + 14 * Math.sin(deg * Math.PI/180)}
              x2={452 + 22 * Math.cos(deg * Math.PI/180)}
              y2={205 + 22 * Math.sin(deg * Math.PI/180)}
              stroke="#ea580c" strokeWidth="2" strokeLinecap="round"
            />
          ))}
        </g>
        <circle cx="452" cy="205" r="28" fill="none" stroke="#111" strokeWidth="10" />
        <circle cx="452" cy="205" r="28" fill="none" stroke="#222" strokeWidth="8" />
        <circle cx="452" cy="205" r="22" fill="#1a1a2a" stroke="#2a2a3a" strokeWidth="1.5" />
        <circle cx="452" cy="205" r="6" fill="#ea580c" opacity="0.9" />
        <circle cx="452" cy="205" r="3" fill="#fff" opacity="0.3" />

        {/* Wheel arch highlights */}
        <path d="M 120 178 Q 148 168 176 178" fill="none" stroke="rgba(234,88,12,0.2)" strokeWidth="2" />
        <path d="M 424 178 Q 452 168 480 178" fill="none" stroke="rgba(234,88,12,0.2)" strokeWidth="2" />

        {/* ══════════════════════════════════════════
            SERVICE OVERLAYS
        ══════════════════════════════════════════ */}

        {/* MAINTENANCE — engine glow */}
        {engineGlow && (
          <g>
            <rect x="455" y="138" width="55" height="35" rx="4"
              fill="rgba(234,88,12,0.1)" stroke="#ea580c" strokeWidth="1"
              strokeDasharray="3 2">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite" />
            </rect>
            {/* Engine icon lines */}
            <rect x="466" y="146" width="8" height="5" rx="1" fill="none" stroke="#ea580c" strokeWidth="1.2" />
            <rect x="478" y="146" width="8" height="5" rx="1" fill="none" stroke="#ea580c" strokeWidth="1.2" />
            <rect x="490" y="146" width="8" height="5" rx="1" fill="none" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="466" y1="151" x2="466" y2="158" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="474" y1="151" x2="474" y2="158" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="478" y1="151" x2="478" y2="158" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="486" y1="151" x2="486" y2="158" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="490" y1="151" x2="490" y2="158" stroke="#ea580c" strokeWidth="1.2" />
            <line x1="498" y1="151" x2="498" y2="158" stroke="#ea580c" strokeWidth="1.2" />
            <text x="482" y="168" textAnchor="middle" fontSize="7" fill="#ea580c" fontWeight="bold" letterSpacing="1">ENGINE</text>
          </g>
        )}

        {/* MALFUNCTION — warning system */}
        {faultGlow && (
          <g>
            {/* OBD scan line */}
            <line x1="90" y1="168" x2="510" y2="168"
              stroke="rgba(239,68,68,0.3)" strokeWidth="1" strokeDasharray="4 3">
              <animate attributeName="x2" values="90;510;90" dur="1.5s" repeatCount="indefinite" />
            </line>
            {/* Warning triangle */}
            <g>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="0.7s" repeatCount="indefinite" />
              <polygon points="300,95 318,128 282,128"
                fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1.5" />
              <text x="300" y="121" textAnchor="middle" fontSize="14" fill="#ef4444" fontWeight="bold">!</text>
            </g>
            {/* Fault dots at key positions */}
            {[
              { cx: 148, cy: 200, delay: '0s' },
              { cx: 220, cy: 168, delay: '0.15s' },
              { cx: 300, cy: 160, delay: '0.3s' },
              { cx: 380, cy: 168, delay: '0.45s' },
              { cx: 452, cy: 200, delay: '0.6s' },
            ].map(({ cx, cy, delay }, i) => (
              <circle key={i} cx={cx} cy={cy} r="4"
                fill="#ef4444" opacity="0.8">
                <animate attributeName="opacity" values="0.1;1;0.1" dur="0.9s" begin={delay} repeatCount="indefinite" />
                <animate attributeName="r" values="3;5;3" dur="0.9s" begin={delay} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        )}

        {/* IDLE — subtle floating particles */}
        {!serviceType && (
          <g opacity="0.5">
            {[
              { cx: 260, baseY: 55, dur: '2.2s' },
              { cx: 230, baseY: 60, dur: '2.8s' },
              { cx: 290, baseY: 58, dur: '1.9s' },
              { cx: 310, baseY: 62, dur: '3.1s' },
            ].map(({ cx, baseY, dur }, i) => (
              <circle key={i} cx={cx} cy={baseY} r="2" fill="#ea580c">
                <animate attributeName="cy" values={`${baseY};${baseY-10};${baseY}`} dur={dur} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur={dur} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        )}

      </svg>

      {/* Status pill */}
      <div className="mt-1 h-6 flex items-center justify-center">
        {serviceType && (
          <span className="text-xs font-semibold px-4 py-1 rounded-full"
            style={{
              background: serviceType === 'maintenance' ? 'rgba(234,88,12,0.15)' : 'rgba(239,68,68,0.15)',
              color: serviceType === 'maintenance' ? '#ea580c' : '#ef4444',
              border: `1px solid ${serviceType === 'maintenance' ? 'rgba(234,88,12,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
            {serviceType === 'maintenance' ? '🔧 وضع الصيانة الدورية' : '⚠️ وضع تشخيص الأعطال'}
          </span>
        )}
      </div>
    </div>
  );
}

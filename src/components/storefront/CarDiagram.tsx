'use client';

import { useEffect, useState } from 'react';

type ServiceType = 'maintenance' | 'malfunction' | '';

interface Props {
  serviceType: ServiceType;
}

export default function CarDiagram({ serviceType }: Props) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!serviceType) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [serviceType]);

  const engineGlow = serviceType === 'maintenance';
  const malfunctionGlow = serviceType === 'malfunction';
  const idle = !serviceType;

  return (
    <div className="relative w-full flex items-center justify-center py-6 select-none">
      <svg
        viewBox="0 0 520 220"
        className="w-full max-w-lg"
        style={{
          filter: serviceType ? 'drop-shadow(0 0 18px rgba(234,88,12,0.25))' : 'none',
          transition: 'filter 0.5s ease',
        }}
      >
        {/* === GROUND SHADOW === */}
        <ellipse cx="260" cy="210" rx="200" ry="8" fill="rgba(0,0,0,0.08)" />

        {/* === CAR BODY === */}
        {/* Main body lower */}
        <rect x="60" y="130" width="400" height="55" rx="12"
          fill="#1a1a2e" stroke="#ea580c" strokeWidth="1.5"
          style={{ transition: 'all 0.4s' }}
        />

        {/* Cabin/roof */}
        <path d="M 130 130 Q 145 75 185 65 L 340 65 Q 375 75 390 130 Z"
          fill="#16213e" stroke="#ea580c" strokeWidth="1.5"
          style={{ transition: 'all 0.4s' }}
        />

        {/* === WINDOWS === */}
        {/* Windshield */}
        <path d="M 200 68 Q 210 80 215 125 L 255 125 L 255 68 Z"
          fill="#0f3460" stroke="#ea580c" strokeWidth="1" opacity="0.9"
        />
        {/* Rear window */}
        <path d="M 270 68 L 270 125 L 310 125 Q 315 80 325 68 Z"
          fill="#0f3460" stroke="#ea580c" strokeWidth="1" opacity="0.9"
        />
        {/* Side windows */}
        <rect x="220" y="72" width="45" height="48" rx="3"
          fill="#0f3460" stroke="#ea580c" strokeWidth="0.8" opacity="0.85"
        />
        <rect x="270" y="72" width="45" height="48" rx="3"
          fill="#0f3460" stroke="#ea580c" strokeWidth="0.8" opacity="0.85"
        />

        {/* === WHEELS === */}
        {/* Rear wheel */}
        <circle cx="140" cy="185" r="30" fill="#111" stroke="#333" strokeWidth="3" />
        <circle cx="140" cy="185" r="20" fill="#222" stroke="#ea580c" strokeWidth="1.5" />
        <circle cx="140" cy="185" r="8" fill="#ea580c" opacity="0.9" />
        {/* Rear wheel spokes */}
        {[0,60,120,180,240,300].map((deg) => (
          <line key={deg}
            x1={140 + 10 * Math.cos(deg * Math.PI/180)}
            y1={185 + 10 * Math.sin(deg * Math.PI/180)}
            x2={140 + 19 * Math.cos(deg * Math.PI/180)}
            y2={185 + 19 * Math.sin(deg * Math.PI/180)}
            stroke="#ea580c" strokeWidth="1.5"
          />
        ))}

        {/* Front wheel */}
        <circle cx="375" cy="185" r="30" fill="#111" stroke="#333" strokeWidth="3" />
        <circle cx="375" cy="185" r="20" fill="#222" stroke="#ea580c" strokeWidth="1.5" />
        <circle cx="375" cy="185" r="8" fill="#ea580c" opacity="0.9" />
        {[0,60,120,180,240,300].map((deg) => (
          <line key={deg}
            x1={375 + 10 * Math.cos(deg * Math.PI/180)}
            y1={185 + 10 * Math.sin(deg * Math.PI/180)}
            x2={375 + 19 * Math.cos(deg * Math.PI/180)}
            y2={185 + 19 * Math.sin(deg * Math.PI/180)}
            stroke="#ea580c" strokeWidth="1.5"
          />
        ))}

        {/* === HEADLIGHTS === */}
        {/* Front */}
        <rect x="445" y="140" width="22" height="10" rx="3"
          fill={serviceType ? '#fbbf24' : '#555'}
          style={{ transition: 'fill 0.4s' }}
        />
        <rect x="447" y="153" width="16" height="6" rx="2"
          fill={serviceType ? '#fbbf24' : '#444'}
          style={{ transition: 'fill 0.4s' }}
          opacity="0.7"
        />
        {/* Light beam */}
        {serviceType && (
          <path d="M 467 143 L 510 135 L 510 155 L 467 150 Z"
            fill="rgba(251,191,36,0.12)"
          />
        )}

        {/* Rear lights */}
        <rect x="53" y="140" width="16" height="10" rx="3"
          fill={malfunctionGlow ? '#ef4444' : '#7f1d1d'}
          style={{ transition: 'fill 0.4s' }}
        />

        {/* === ENGINE AREA HIGHLIGHT (maintenance) === */}
        {engineGlow && (
          <>
            <rect x="400" y="128" width="60" height="40" rx="6"
              fill="rgba(234,88,12,0.15)"
              stroke="#ea580c"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            >
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
            </rect>
            <text x="430" y="153" textAnchor="middle" fontSize="10" fill="#ea580c" fontWeight="bold">
              ENGINE
            </text>
          </>
        )}

        {/* === MALFUNCTION WARNING === */}
        {malfunctionGlow && (
          <>
            {/* Warning triangle on hood */}
            <polygon points="260,90 275,118 245,118"
              fill="rgba(239,68,68,0.2)"
              stroke="#ef4444"
              strokeWidth="2"
            >
              <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
            </polygon>
            <text x="260" y="113" textAnchor="middle" fontSize="11" fill="#ef4444" fontWeight="bold">!</text>
            {/* Diagnostic dots */}
            {[120, 200, 300, 380].map((x, i) => (
              <circle key={i} cx={x} cy="160" r="3" fill="#ef4444" opacity="0.7">
                <animate attributeName="opacity" values="0.2;0.9;0.2" dur="1s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </>
        )}

        {/* === IDLE FLOAT DOTS === */}
        {idle && (
          <>
            <circle cx="260" cy="40" r="3" fill="#ea580c" opacity="0.4">
              <animate attributeName="cy" values="40;32;40" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="240" cy="35" r="2" fill="#ea580c" opacity="0.3">
              <animate attributeName="cy" values="35;27;35" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="280" cy="38" r="2" fill="#ea580c" opacity="0.3">
              <animate attributeName="cy" values="38;30;38" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* === DETAILS === */}
        {/* Door line */}
        <line x1="255" y1="130" x2="255" y2="183" stroke="#ea580c" strokeWidth="0.8" opacity="0.5" />
        {/* Door handle front */}
        <rect x="295" y="150" width="18" height="5" rx="2.5" fill="#333" stroke="#ea580c" strokeWidth="0.8" />
        {/* Door handle rear */}
        <rect x="175" y="150" width="18" height="5" rx="2.5" fill="#333" stroke="#ea580c" strokeWidth="0.8" />
        {/* Roof line detail */}
        <line x1="190" y1="90" x2="335" y2="90" stroke="#ea580c" strokeWidth="0.5" opacity="0.3" />
        {/* Bumpers */}
        <rect x="455" y="158" width="15" height="18" rx="4" fill="#222" stroke="#555" strokeWidth="1" />
        <rect x="50" y="158" width="15" height="18" rx="4" fill="#222" stroke="#555" strokeWidth="1" />
        {/* Grill */}
        {[0,1,2,3].map((i) => (
          <rect key={i} x={458} y={163 + i*3} width="10" height="1.5" rx="0.5"
            fill="#ea580c" opacity="0.6"
          />
        ))}
      </svg>

      {/* Status label */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-medium px-3 py-1 rounded-full"
        style={{
          background: serviceType === 'maintenance' ? 'rgba(234,88,12,0.1)' :
                      serviceType === 'malfunction' ? 'rgba(239,68,68,0.1)' : 'transparent',
          color: serviceType === 'maintenance' ? '#ea580c' :
                 serviceType === 'malfunction' ? '#ef4444' : 'transparent',
          transition: 'all 0.4s',
        }}
      >
        {serviceType === 'maintenance' ? '🔧 وضع الصيانة الدورية' :
         serviceType === 'malfunction' ? '⚠️ وضع تشخيص الأعطال' : ''}
      </div>
    </div>
  );
}

import React from 'react';
import { Ruler, Sparkles, Compass } from 'lucide-react';

/**
 * Procedural authentic SVG footprint visualizer for Spoor.
 * Renders biologically accurate animal tracks with field scale and substrate texture.
 */
export function FootprintDisplay({ animal }) {
  if (!animal || !animal.footprint) return null;

  const { type, dimensions, description, features, trackNotes } = animal.footprint;

  // Render authentic vector tracks based on biological footprint type
  const renderTrackSvg = () => {
    const trackColor = '#3e2723'; // Rich organic field mud pigment
    const secondaryColor = '#5d4037';
    const highlight = 'rgba(255, 255, 255, 0.08)';

    switch (type) {
      case 'canid':
        // Four symmetrical oval toes with distinct claw marks, single triangular heel pad
        return (
          <g transform="translate(100, 100)">
            {/* Claws */}
            <line x1="-12" y1="-50" x2="-14" y2="-62" stroke={trackColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="12" y1="-50" x2="14" y2="-62" stroke={trackColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="-36" y1="-28" x2="-44" y2="-38" stroke={trackColor} strokeWidth="3" strokeLinecap="round" />
            <line x1="36" y1="-28" x2="44" y2="-38" stroke={trackColor} strokeWidth="3" strokeLinecap="round" />
            {/* 4 Symmetrical Digital Pads */}
            <ellipse cx="-12" cy="-36" rx="9" ry="14" fill={trackColor} />
            <ellipse cx="12" cy="-36" rx="9" ry="14" fill={trackColor} />
            <ellipse cx="-34" cy="-18" rx="8.5" ry="13" transform="rotate(-15 -34 -18)" fill={trackColor} />
            <ellipse cx="34" cy="-18" rx="8.5" ry="13" transform="rotate(15 34 -18)" fill={trackColor} />
            {/* Triangular Heel Pad with concave base */}
            <path d="M-28,8 C-28,8 -14,-14 0,-14 C14,-14 28,8 28,8 C28,26 16,34 0,30 C-16,34 -28,26 -28,8 Z" fill={trackColor} />
          </g>
        );

      case 'felid':
        // Four asymmetrical round toes, NO claws, 3-lobed heel pad
        return (
          <g transform="translate(100, 100)">
            {/* Asymmetrical Toes: Leading toe on left/right */}
            <circle cx="-16" cy="-40" r="11" fill={trackColor} />
            <circle cx="10" cy="-46" r="11.5" fill={trackColor} /> {/* leading toe higher */}
            <circle cx="-38" cy="-22" r="10.5" fill={trackColor} />
            <circle cx="34" cy="-24" r="10.5" fill={trackColor} />
            {/* Classic 3-lobed feline heel pad */}
            <path d="M-32,6 C-32,-10 -16,-16 0,-16 C16,-16 32,-10 32,6 C34,26 24,36 12,32 C5,30 -5,30 -12,32 C-24,36 -34,26 -32,6 Z" fill={trackColor} />
          </g>
        );

      case 'ursid':
      case 'ursid_mustelid':
        // Five rounded toes in gentle arc, long claw marks, wide plantigrade sole
        return (
          <g transform="translate(100, 105)">
            {/* 5 Long Claws */}
            {[-44, -22, 0, 22, 44].map((x, i) => (
              <line key={i} x1={x} y1="-50" x2={x * 1.15} y2="-68" stroke={trackColor} strokeWidth="3.5" strokeLinecap="round" />
            ))}
            {/* 5 Distinct Toe Pads */}
            <circle cx="-42" cy="-40" r="8" fill={trackColor} />
            <circle cx="-21" cy="-44" r="8.5" fill={trackColor} />
            <circle cx="0" cy="-46" r="9" fill={trackColor} />
            <circle cx="21" cy="-44" r="8.5" fill={trackColor} />
            <circle cx="42" cy="-40" r="8" fill={trackColor} />
            {/* Broad Plantigrade Palm Sole */}
            <path d="M-45,-20 C-30,-28 30,-28 45,-20 C52,6 38,32 24,42 C10,50 -10,50 -24,42 C-38,32 -52,6 -45,-20 Z" fill={trackColor} />
          </g>
        );

      case 'cloven':
        // Split two-toed teardrop hooves
        return (
          <g transform="translate(100, 100)">
            {/* Left Cleat */}
            <path d="M-4,-50 C-18,-42 -30,-15 -28,15 C-26,26 -16,28 -6,28 C-4,28 -2,10 -2,-45 Z" fill={trackColor} />
            {/* Right Cleat */}
            <path d="M4,-50 C18,-42 30,-15 28,15 C26,26 16,28 6,28 C4,28 2,10 2,-45 Z" fill={trackColor} />
            {/* Dew claws behind */}
            <circle cx="-22" cy="46" r="5" fill={secondaryColor} />
            <circle cx="22" cy="46" r="5" fill={secondaryColor} />
          </g>
        );

      case 'solid_hoof':
        // Single solid round hoof with triangular central frog
        return (
          <g transform="translate(100, 100)">
            {/* Outer Hoof Wall */}
            <path d="M-36,25 C-42,-15 -30,-48 0,-50 C30,-48 42,-15 36,25 C32,32 18,28 14,24 C10,18 20,-8 0,-10 C-20,-8 -10,18 -14,24 C-18,28 -32,32 -36,25 Z" fill={trackColor} />
            {/* Central Triangular Frog */}
            <polygon points="0,-16 -12,28 12,28" fill={secondaryColor} />
          </g>
        );

      case 'elephant':
        // Massive round track with perimeter nail marks and cracked sole pattern
        return (
          <g transform="translate(100, 100)">
            <ellipse cx="0" cy="0" rx="55" ry="50" fill={trackColor} />
            {/* Flat Nail Impressions around front rim */}
            {[-38, -19, 0, 19, 38].map((x, idx) => (
              <rect key={idx} x={x - 6} y="-56" width="12" height="8" rx="3" fill={secondaryColor} />
            ))}
            {/* Internal crinkled skin lines */}
            <path d="M-30,-20 Q0,-5 30,-25 M-35,10 Q0,20 35,5 M-10,-35 Q-15,0 -5,35 M15,-35 Q10,5 20,35" stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" fill="none" />
          </g>
        );

      case 'rhino':
        // Three distinct rounded hoof-like toes (trefoil cloverleaf)
        return (
          <g transform="translate(100, 100)">
            <ellipse cx="0" cy="-35" rx="18" ry="16" fill={trackColor} />
            <ellipse cx="-34" cy="12" rx="16" ry="16" fill={trackColor} />
            <ellipse cx="34" cy="12" rx="16" ry="16" fill={trackColor} />
            <circle cx="0" cy="0" r="24" fill={trackColor} />
          </g>
        );

      case 'hippo':
        // Four splayed symmetrical rounded toes
        return (
          <g transform="translate(100, 100)">
            <ellipse cx="-16" cy="-36" rx="13" ry="16" fill={trackColor} />
            <ellipse cx="16" cy="-36" rx="13" ry="16" fill={trackColor} />
            <ellipse cx="-40" cy="10" rx="12" ry="15" transform="rotate(-20 -40 10)" fill={trackColor} />
            <ellipse cx="40" cy="10" rx="12" ry="15" transform="rotate(20 40 10)" fill={trackColor} />
            <circle cx="0" cy="5" r="26" fill={trackColor} />
          </g>
        );

      case 'macropod':
        // Kangaroo: long central 4th toe, sharp claw, small 5th outer toe
        return (
          <g transform="translate(100, 100)">
            {/* Huge long central 4th toe and talon claw */}
            <path d="M-6,-68 L0,-82 L6,-68 L8,30 C8,45 -8,45 -8,30 Z" fill={trackColor} />
            {/* Small 5th outer toe */}
            <path d="M12,-25 L16,-38 L20,-25 L18,15 L10,15 Z" fill={trackColor} />
            {/* Small inner remnant 2nd/3rd syndactylous pad */}
            <ellipse cx="-14" cy="0" rx="3.5" ry="8" fill={trackColor} />
          </g>
        );

      case 'primate':
        // Human/ape hand/foot with divergent opposable thumb/big toe
        return (
          <g transform="translate(100, 100)">
            {/* Four forward slender toes */}
            <ellipse cx="-18" cy="-45" rx="6" ry="11" fill={trackColor} />
            <ellipse cx="-5" cy="-52" rx="6.5" ry="12" fill={trackColor} />
            <ellipse cx="8" cy="-48" rx="6" ry="11" fill={trackColor} />
            <ellipse cx="20" cy="-42" rx="5.5" ry="10" fill={trackColor} />
            {/* Opposable big toe pointing outward */}
            <ellipse cx="-42" cy="-8" rx="8" ry="14" transform="rotate(-50 -42 -8)" fill={trackColor} />
            {/* Long Palm/Sole */}
            <path d="M-30,-20 C-10,-28 20,-24 26,-15 C30,15 20,40 5,45 C-15,48 -25,35 -28,10 Z" fill={trackColor} />
          </g>
        );

      case 'avian_talon':
      case 'passerine':
        // Anisodactyl: 3 forward talons + 1 rear hallux with sharp needle tips
        return (
          <g transform="translate(100, 100)">
            {/* Forward Middle Talon */}
            <path d="M-4,-55 L0,-72 L4,-55 L3,0 L-3,0 Z" fill={trackColor} />
            {/* Forward Left Talon */}
            <path d="M-42,-36 L-56,-46 L-40,-28 L0,0 Z" fill={trackColor} />
            {/* Forward Right Talon */}
            <path d="M42,-36 L56,-46 L40,-28 L0,0 Z" fill={trackColor} />
            {/* Rear Hallux Talon */}
            <path d="M-3,10 L0,50 L3,10 Z" fill={trackColor} />
            {/* Central pad knot */}
            <circle cx="0" cy="0" r="7" fill={trackColor} />
          </g>
        );

      case 'avian_webbed':
        // Three forward toes joined by distinct interdigital webbing arcs
        return (
          <g transform="translate(100, 100)">
            {/* Webbing membrane */}
            <path d="M-44,-36 Q-22,-24 0,-60 Q22,-24 44,-36 L0,22 Z" fill="rgba(62, 39, 35, 0.4)" stroke={trackColor} strokeWidth="1.5" />
            {/* Toe Bones & Claws */}
            <line x1="0" y1="20" x2="0" y2="-62" stroke={trackColor} strokeWidth="6" strokeLinecap="round" />
            <line x1="0" y1="20" x2="-44" y2="-38" stroke={trackColor} strokeWidth="5.5" strokeLinecap="round" />
            <line x1="0" y1="20" x2="44" y2="-38" stroke={trackColor} strokeWidth="5.5" strokeLinecap="round" />
            {/* Heel point */}
            <circle cx="0" cy="20" r="7" fill={trackColor} />
          </g>
        );

      case 'ostrich':
        // Didactyl: only two toes with massive inner claw
        return (
          <g transform="translate(100, 100)">
            {/* Massive main toe with 7 cm heavy claw */}
            <path d="M-8,-65 L0,-85 L8,-65 L12,20 C12,30 -10,30 -10,20 Z" fill={trackColor} />
            {/* Smaller outer clawless toe */}
            <path d="M14,-10 L35,-25 L38,-15 L20,15 Z" fill={secondaryColor} />
          </g>
        );

      case 'ratite_tridactyl':
      case 'gallinaceous':
        // Emu / gamebird: 3 stout forward toes
        return (
          <g transform="translate(100, 100)">
            <line x1="0" y1="20" x2="0" y2="-65" stroke={trackColor} strokeWidth="9" strokeLinecap="round" />
            <line x1="0" y1="20" x2="-48" y2="-32" stroke={trackColor} strokeWidth="8" strokeLinecap="round" />
            <line x1="0" y1="20" x2="48" y2="-32" stroke={trackColor} strokeWidth="8" strokeLinecap="round" />
            <circle cx="0" cy="20" r="9" fill={trackColor} />
          </g>
        );

      case 'zygodactyl':
      case 'zygodactyl_reptile':
        // Two toes forward, two backward ("X" shape)
        return (
          <g transform="translate(100, 100)">
            <line x1="-35" y1="-45" x2="35" y2="45" stroke={trackColor} strokeWidth="6" strokeLinecap="round" />
            <line x1="35" y1="-45" x2="-35" y2="45" stroke={trackColor} strokeWidth="6" strokeLinecap="round" />
            <circle cx="0" cy="0" r="8" fill={trackColor} />
          </g>
        );

      case 'reptile_splay':
        // 5 clawed radiating toes with central wavy tail furrow
        return (
          <g transform="translate(100, 100)">
            {/* Central Sinuous Tail Drag */}
            <path d="M-60,50 Q-20,0 -40,-50 Q-60,-100 -30,-140" stroke="rgba(62, 39, 35, 0.45)" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Footprint */}
            <g transform="translate(25, 0)">
              {[-30, -15, 0, 15, 30].map((deg, i) => (
                <line key={i} x1="0" y1="0" x2={Math.sin(deg * Math.PI / 180) * 38} y2={-Math.cos(deg * Math.PI / 180) * 38} stroke={trackColor} strokeWidth="4" strokeLinecap="round" />
              ))}
              <circle cx="0" cy="0" r="7" fill={trackColor} />
            </g>
          </g>
        );

      case 'crocodylian':
        // Crocodilian: wide belly sweep & 4/5 clawed webbed toes
        return (
          <g transform="translate(100, 100)">
            {/* Wide belly slide trough */}
            <rect x="-70" y="-80" width="140" height="160" rx="40" fill="rgba(62, 39, 35, 0.15)" />
            {/* Heavy central tail furrow */}
            <line x1="0" y1="-90" x2="0" y2="90" stroke="rgba(62, 39, 35, 0.6)" strokeWidth="8" />
            {/* Left Footprint */}
            <g transform="translate(-45, -20) scale(0.6)">
              {[-40, -20, 0, 20, 40].map((deg, i) => (
                <line key={i} x1="0" y1="0" x2={Math.sin(deg * Math.PI / 180) * 45} y2={-Math.cos(deg * Math.PI / 180) * 45} stroke={trackColor} strokeWidth="6" strokeLinecap="round" />
              ))}
              <circle cx="0" cy="0" r="10" fill={trackColor} />
            </g>
          </g>
        );

      case 'serpentine':
      case 'rectilinear_serpentine':
        // Sinuous wave compression trough with sand push ridges
        return (
          <g transform="translate(100, 100)">
            <path d="M-80,-70 Q-10,-40 -50,0 Q-90,40 -20,70 Q50,100 20,140" stroke={trackColor} strokeWidth="16" fill="none" strokeLinecap="round" />
            <path d="M-80,-70 Q-10,-40 -50,0 Q-90,40 -20,70 Q50,100 20,140" stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="none" />
          </g>
        );

      case 'amphibian':
      case 'amphibian_jumping':
      case 'arboreal_frog':
        // 4 front digits, 5 hind with suction discs
        return (
          <g transform="translate(100, 100)">
            {[-45, -22, 0, 22, 45].map((deg, i) => {
              const x = Math.sin(deg * Math.PI / 180) * 36;
              const y = -Math.cos(deg * Math.PI / 180) * 36;
              return (
                <g key={i}>
                  <line x1="0" y1="0" x2={x} y2={y} stroke={trackColor} strokeWidth="3" />
                  <circle cx={x} cy={y} r="5.5" fill={trackColor} />
                </g>
              );
            })}
            <circle cx="0" cy="0" r="6" fill={trackColor} />
          </g>
        );

      case 'cephalopod':
        // Circular suction cups in seabed silt
        return (
          <g transform="translate(100, 100)">
            {[-40, -15, 15, 40].map((y, idx) => (
              <g key={idx}>
                <circle cx="-25" cy={y} r="14" stroke={trackColor} strokeWidth="4" fill="none" />
                <circle cx="-25" cy={y} r="6" fill={trackColor} />
                <circle cx="25" cy={y + 12} r="14" stroke={trackColor} strokeWidth="4" fill="none" />
                <circle cx="25" cy={y + 12} r="6" fill={trackColor} />
              </g>
            ))}
          </g>
        );

      case 'arachnid_track':
      case 'insect_track':
        // Parallel stipple rows of tiny walking leg points
        return (
          <g transform="translate(100, 100)">
            {[-50, -25, 0, 25, 50].map((y, i) => (
              <g key={i}>
                <circle cx="-35" cy={y} r="4.5" fill={trackColor} />
                <line x1="-35" y1={y} x2="-45" y2={y - 4} stroke={trackColor} strokeWidth="2" />
                <circle cx="35" cy={y + 12} r="4.5" fill={trackColor} />
                <line x1="35" y1={y + 12} x2="45" y2={y + 8} stroke={trackColor} strokeWidth="2" />
              </g>
            ))}
            {/* Center stinger drag */}
            <line x1="0" y1="-60" x2="0" y2="70" stroke="rgba(62,39,35,0.3)" strokeWidth="2" strokeDasharray="3 3" />
          </g>
        );

      default:
        // Default realistic wildlife track representation
        return (
          <g transform="translate(100, 100)">
            {[-30, -10, 10, 30].map((deg, i) => (
              <ellipse key={i} cx={deg} cy="-35" rx="7" ry="12" fill={trackColor} />
            ))}
            <circle cx="0" cy="5" r="22" fill={trackColor} />
          </g>
        );
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Substrate Canvas Box with natural earth/sand texture */}
      <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-inner border-2 border-journal-300 dark:border-stone-700/60 bg-[#e7d9c6] dark:bg-[#1a2521] flex items-center justify-center p-4">
        {/* Subtle geological texture overlays */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, transparent 20%, rgba(120, 53, 15, 0.15) 100%),
              radial-gradient(rgba(80, 50, 30, 0.1) 1.5px, transparent 0)`,
            backgroundSize: '100% 100%, 14px 14px',
          }}
        />

        {/* Compass watermark in background */}
        <Compass className="absolute -bottom-6 -right-6 w-32 h-32 text-amber-900/10 dark:text-emerald-500/10 pointer-events-none" />

        {/* The Track Vector */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-w-[240px] max-h-[240px] drop-shadow-md z-10 transition-transform duration-300 hover:scale-105"
        >
          {renderTrackSvg()}
        </svg>

        {/* Physical Scale Ruler Indicator */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20 bg-journal-100/90 dark:bg-stone-900/85 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-journal-300/80 dark:border-stone-700 text-xs font-mono text-stone-700 dark:text-stone-300 shadow-sm">
          <span className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-400">
            <Ruler className="w-3.5 h-3.5" />
            Field Dimension:
          </span>
          <span className="font-bold tracking-tight">{dimensions}</span>
        </div>
      </div>

      {/* Biological Features Badges */}
      {features && features.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-3 max-w-md">
          {features.map((feat, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-journal-200/80 text-journal-900 dark:bg-field-900/60 dark:text-emerald-200 dark:border dark:border-field-700/50"
            >
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              {feat}
            </span>
          ))}
        </div>
      )}

      {/* Field Tracking Description */}
      <div className="mt-3 text-sm text-stone-700 dark:text-stone-300 text-center max-w-md bg-journal-100/60 dark:bg-stone-900/40 p-3 rounded-xl border border-journal-200 dark:border-stone-800/80">
        <p className="leading-relaxed italic">"{description}"</p>
        {trackNotes && (
          <p className="mt-1.5 text-xs text-amber-800 dark:text-amber-400/90 font-medium">
            🧭 <strong>Field Sign:</strong> {trackNotes}
          </p>
        )}
      </div>
    </div>
  );
}

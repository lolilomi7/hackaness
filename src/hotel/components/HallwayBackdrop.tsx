const WALL = '#efe4ff';
const PANEL_LINE = '#c9a8f0';
const RUG = '#9b6fd1';
const RUG_EDGE = '#c9a465';
const SCONCE = '#c9a465';
const GLOW = '#fff4d6';

export default function HallwayBackdrop() {
  return (
    <svg
      viewBox="0 0 300 170"
      preserveAspectRatio="none"
      className="absolute inset-0 -z-10 h-full w-full rounded-2xl"
    >
      <rect x="0" y="0" width="300" height="170" fill={WALL} />
      {[40, 100, 160, 220, 260].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="170" stroke={PANEL_LINE} strokeWidth="2" />
      ))}

      {[60, 150, 240].map((x) => (
        <g key={x}>
          <circle cx={x} cy="28" r="10" fill={GLOW} opacity="0.6" />
          <circle cx={x} cy="28" r="5" fill={SCONCE} />
          <rect x={x - 1.5} y="32" width="3" height="10" fill={SCONCE} />
        </g>
      ))}

      <rect x="0" y="150" width="300" height="20" fill={RUG} />
      <rect x="0" y="150" width="300" height="3" fill={RUG_EDGE} />
    </svg>
  );
}

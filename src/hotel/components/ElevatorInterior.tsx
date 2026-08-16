const WALL = '#efe4ff';
const PANEL_LINE = '#c9a8f0';
const RAIL = '#c9a465';
const PLANT_POT = '#a985c9';
const LEAF = '#6b9b6e';

export default function ElevatorInterior() {
  return (
    <svg
      viewBox="0 0 200 170"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      <rect x="0" y="0" width="200" height="170" fill={WALL} />
      {[30, 70, 130, 170].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="170" stroke={PANEL_LINE} strokeWidth="2" />
      ))}
      <rect x="20" y="90" width="160" height="6" rx="3" fill={RAIL} />
      <ellipse cx="100" cy="8" rx="30" ry="8" fill="#ffffff" opacity="0.35" />

      {/* small potted plant, bottom-left corner */}
      <rect x="14" y="140" width="18" height="16" rx="2" fill={PLANT_POT} />
      <path d="M23 140c-8-6-6-18 0-22 6 4 8 16 0 22z" fill={LEAF} />
      <path d="M23 140c6-8 4-20-2-24-6 6-6 18 2 24z" fill={LEAF} opacity="0.85" />
    </svg>
  );
}

import { HOTEL_COLORS } from '../theme';

interface RoomDoorProps {
  roomNumber: number;
}

export default function RoomDoor({ roomNumber }: RoomDoorProps) {
  return (
    <div
      className="relative flex h-28 w-24 shrink-0 flex-col items-center gap-1 pt-3"
      style={{
        background: 'linear-gradient(180deg, #c9a8f0, #9b6fd1)',
        borderTopLeftRadius: '50% 40px',
        borderTopRightRadius: '50% 40px',
        border: `2px solid ${HOTEL_COLORS.brass}`,
      }}
    >
      <span
        className="rounded px-2 py-0.5 text-xs"
        style={{ background: HOTEL_COLORS.brass, color: HOTEL_COLORS.parchment }}
      >
        {roomNumber}
      </span>
      <span
        className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
        style={{ background: HOTEL_COLORS.brass }}
      />
    </div>
  );
}

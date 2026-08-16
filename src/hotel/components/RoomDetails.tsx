import type { Recommendation } from '../../types';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';

interface RoomDetailsProps {
  roomNumber: number;
  recommendation: Recommendation;
}

// Renders 5 direct grid items (no wrapping div) so a subgrid parent can
// align each field's row across all 3 suggestion columns.
export default function RoomDetails({ roomNumber, recommendation }: RoomDetailsProps) {
  return (
    <>
      <span
        className={`${HOTEL_SERIF} text-center text-xs uppercase tracking-[0.2em]`}
        style={{ color: HOTEL_COLORS.brass }}
      >
        Room {roomNumber}
      </span>
      <h3 className={`${HOTEL_SERIF} text-center text-lg`} style={{ color: HOTEL_COLORS.parchment }}>
        {recommendation.title}
      </h3>
      <p className="text-center text-sm" style={{ color: HOTEL_COLORS.parchmentDim }}>
        {recommendation.whyThisFits}
      </p>
      <p className="text-center text-sm" style={{ color: HOTEL_COLORS.parchment }}>
        <span className="italic">First: </span>
        {recommendation.firstStep}
      </p>
      <p className="text-center text-xs" style={{ color: HOTEL_COLORS.brass }}>
        {recommendation.durationMinutes} minutes
      </p>
    </>
  );
}

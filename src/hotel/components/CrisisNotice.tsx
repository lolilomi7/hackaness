import { HOTEL_COLORS } from '../theme';

export default function CrisisNotice() {
  return (
    <p className="text-xs" style={{ color: HOTEL_COLORS.parchmentDim }}>
      If this feels like more than a low moment, you deserve support beyond this app. In the
      US, call or text 988, or reach out to a local crisis line or someone you trust.
    </p>
  );
}

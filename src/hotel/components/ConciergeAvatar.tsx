import { motion } from 'motion/react';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';

interface ConciergeAvatarProps {
  bob: string | number;
}

const FUR = '#fff8ef';
const CHEEK = '#f5b8c4';
const CAP = '#7a2e2e';
const CAP_BAND = '#c9a465';
const JACKET = '#6b2530';
const INK = '#3a2a1c';
const DESK = '#4a3421';
const DESK_TOP = '#5c4229';

export default function ConciergeAvatar({ bob }: ConciergeAvatarProps) {
  return (
    <div className="flex w-full flex-col items-center">
      <motion.svg
        key={bob}
        viewBox="0 -55 200 225"
        className="h-auto w-full max-w-xs"
        initial={{ rotate: -3, y: -4 }}
        animate={{ rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
      >
        {/* wide, upright ears held close together, bottom edge fixed at the
            same y=46 base used for the head attachment */}
        <ellipse cx="88" cy="14" rx="15" ry="32" fill={FUR} transform="rotate(-6 88 46)" />
        <ellipse cx="88" cy="14" rx="8" ry="22" fill={CHEEK} opacity="0.6" transform="rotate(-6 88 46)" />
        <ellipse cx="112" cy="14" rx="15" ry="32" fill={FUR} transform="rotate(6 112 46)" />
        <ellipse cx="112" cy="14" rx="8" ry="22" fill={CHEEK} opacity="0.6" transform="rotate(6 112 46)" />

        {/* double-breasted jacket */}
        <path d="M30 152C33 105 54 80 100 80C146 80 167 105 170 152" fill={JACKET} />
        <rect x="93" y="94" width="14" height="3" rx="1.5" fill={CAP_BAND} />
        {[112, 124, 136].map((y) => (
          <circle key={`l${y}`} cx="90" cy={y} r="3" fill={CAP_BAND} />
        ))}
        {[112, 124, 136].map((y) => (
          <circle key={`r${y}`} cx="110" cy={y} r="3" fill={CAP_BAND} />
        ))}

        <rect x="90" y="78" width="20" height="10" fill={FUR} />
        <circle cx="100" cy="56" r="28" fill={FUR} />

        <circle cx="82" cy="63" r="7" fill={CHEEK} opacity="0.6" />
        <circle cx="118" cy="63" r="7" fill={CHEEK} opacity="0.6" />

        <ellipse cx="88" cy="52" rx="4" ry="5" fill={INK} />
        <ellipse cx="112" cy="52" rx="4" ry="5" fill={INK} />
        <ellipse cx="100" cy="60" rx="2.4" ry="2" fill={INK} />
        <path d="M94 63c2 3 10 3 12 0" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />

        <path d="M72 35a28 19 0 0 1 56 0z" fill={CAP} />
        <rect x="69" y="33" width="62" height="7" rx="3.5" fill={CAP_BAND} />
        <circle cx="100" cy="17" r="3.5" fill={CAP_BAND} />

        {/* desk, drawn last so it hides him from the chest down */}
        <rect x="0" y="118" width="200" height="52" fill={DESK} />
        <rect x="0" y="118" width="200" height="7" fill={DESK_TOP} />
        <ellipse cx="164" cy="112" rx="9" ry="7" fill={CAP_BAND} />
        <rect x="160" y="118" width="8" height="4" fill={CAP_BAND} />
        <text
          x="100"
          y="150"
          textAnchor="middle"
          fontFamily="serif"
          fontStyle="italic"
          fontSize="13"
          letterSpacing="2"
          fill={HOTEL_COLORS.parchmentDim}
        >
          CONCIERGE
        </text>
      </motion.svg>
      <p className={`${HOTEL_SERIF} text-sm italic`} style={{ color: HOTEL_COLORS.parchmentDim }}>
        Bunny, your concierge
      </p>
    </div>
  );
}

import { motion } from 'motion/react';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';

interface ConciergeAvatarProps {
  bob: string | number;
}

const FUR = '#f1e4d3';
const CHEEK = '#e8967a';
const CAP = '#7a2e2e';
const CAP_BAND = '#c9a465';
const JACKET = '#2b3a4a';
const INK = '#2b2018';
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
        {/* long bunny ears, drawn first so the cap sits on top of their base */}
        <ellipse cx="82" cy="0" rx="11" ry="46" fill={FUR} transform="rotate(-12 82 46)" />
        <ellipse cx="82" cy="0" rx="6" ry="36" fill={CHEEK} opacity="0.5" transform="rotate(-12 82 46)" />
        <ellipse cx="118" cy="0" rx="11" ry="46" fill={FUR} transform="rotate(12 118 46)" />
        <ellipse cx="118" cy="0" rx="6" ry="36" fill={CHEEK} opacity="0.5" transform="rotate(12 118 46)" />

        {/* character */}
        <path d="M30 152C33 105 54 80 100 80C146 80 167 105 170 152" fill={JACKET} />
        <circle cx="100" cy="128" r="3.5" fill={CAP_BAND} />
        <circle cx="100" cy="140" r="3.5" fill={CAP_BAND} />

        <rect x="90" y="78" width="20" height="10" fill={FUR} />
        <circle cx="100" cy="56" r="28" fill={FUR} />

        <circle cx="82" cy="63" r="6" fill={CHEEK} opacity="0.4" />
        <circle cx="118" cy="63" r="6" fill={CHEEK} opacity="0.4" />

        <ellipse cx="88" cy="52" rx="4" ry="5" fill={INK} />
        <ellipse cx="112" cy="52" rx="4" ry="5" fill={INK} />
        <circle cx="86.5" cy="50" r="1.2" fill="#fff" />
        <circle cx="110.5" cy="50" r="1.2" fill="#fff" />

        <path d="M96 58 L104 58 L100 63 Z" fill={CHEEK} />
        <rect x="97" y="63" width="3" height="5" rx="1" fill="#fff" stroke={INK} strokeWidth="0.5" />
        <rect x="100" y="63" width="3" height="5" rx="1" fill="#fff" stroke={INK} strokeWidth="0.5" />

        <path d="M76 60h-20M76 64h-22M76 68h-20" stroke={INK} strokeWidth="1" strokeLinecap="round" />
        <path d="M124 60h20M124 64h22M124 68h20" stroke={INK} strokeWidth="1" strokeLinecap="round" />

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
        Étienne, your concierge
      </p>
    </div>
  );
}

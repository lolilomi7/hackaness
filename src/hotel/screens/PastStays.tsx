import { useEffect, useMemo, useState } from 'react';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';
import { listStays, type Stay } from '../../lib/stays';
import { getRealUserId } from '../../lib/auth';
import StayEntry from '../components/StayEntry';

interface PastStaysProps {
  onBack: () => void;
}

type LoadState = 'loading' | 'signed-out' | 'empty' | 'error' | 'loaded';

const PAGE_SIZE = 5;

function matchesQuery(stay: Stay, query: string): boolean {
  const haystack = [
    stay.recommendationTitle,
    stay.recommendationFirstStep,
    stay.notes ?? '',
    stay.moodBefore,
    stay.moodAfter ?? '',
    stay.environment,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export default function PastStays({ onBack }: PastStaysProps) {
  const [stays, setStays] = useState<Stay[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const userId = await getRealUserId();
      if (cancelled) return;
      if (!userId) {
        setState('signed-out');
        return;
      }
      const result = await listStays();
      if (cancelled) return;
      if (result.error) {
        setState('error');
      } else {
        setStays(result.stays);
        setState(result.stays.length === 0 ? 'empty' : 'loaded');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredStays = useMemo(
    () => (query.trim() ? stays.filter((stay) => matchesQuery(stay, query.trim())) : stays),
    [stays, query],
  );
  const visibleStays = expanded ? filteredStays : filteredStays.slice(0, PAGE_SIZE);
  const hiddenCount = filteredStays.length - visibleStays.length;

  return (
    <div
      className="flex min-h-svh flex-col items-center gap-6 p-6"
      style={{
        background: `radial-gradient(120% 100% at 50% 0%, ${HOTEL_COLORS.panel}, ${HOTEL_COLORS.panelDeep})`,
      }}
    >
      <div className="flex w-full max-w-sm items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm"
          style={{ color: HOTEL_COLORS.brass }}
        >
          &larr; Front desk
        </button>
        <p
          className={`${HOTEL_SERIF} text-xs uppercase tracking-[0.3em]`}
          style={{ color: HOTEL_COLORS.brass }}
        >
          Guest Book
        </p>
      </div>

      <h1 className={`${HOTEL_SERIF} text-2xl`} style={{ color: HOTEL_COLORS.parchment }}>
        Past Stays
      </h1>

      {state === 'loading' && (
        <p className="text-sm" style={{ color: HOTEL_COLORS.parchmentDim }}>
          Checking the ledger&hellip;
        </p>
      )}

      {state === 'signed-out' && (
        <div
          className="flex max-w-sm flex-col items-center gap-2 rounded-2xl border px-6 py-8 text-center"
          style={{ borderColor: HOTEL_COLORS.brassDim, background: HOTEL_COLORS.panel }}
        >
          <p className={`${HOTEL_SERIF} text-sm`} style={{ color: HOTEL_COLORS.parchment }}>
            Nothing here yet
          </p>
          <p className="max-w-xs text-sm" style={{ color: HOTEL_COLORS.parchmentDim }}>
            Sign in when you choose a room and it'll start showing up here.
          </p>
        </div>
      )}

      {state === 'empty' && (
        <div
          className="flex max-w-sm flex-col items-center gap-2 rounded-2xl border px-6 py-8 text-center"
          style={{ borderColor: HOTEL_COLORS.brassDim, background: HOTEL_COLORS.panel }}
        >
          <p className={`${HOTEL_SERIF} text-sm`} style={{ color: HOTEL_COLORS.parchment }}>
            No stays yet
          </p>
          <p className="max-w-xs text-sm" style={{ color: HOTEL_COLORS.parchmentDim }}>
            Once you pick a room, it'll show up here, a quiet record of what you tried.
          </p>
        </div>
      )}

      {state === 'error' && (
        <div
          className="flex max-w-sm flex-col items-center gap-2 rounded-2xl border px-6 py-8 text-center"
          style={{ borderColor: HOTEL_COLORS.brassDim, background: HOTEL_COLORS.panel }}
        >
          <p className={`${HOTEL_SERIF} text-sm`} style={{ color: HOTEL_COLORS.parchment }}>
            Couldn't load your journal
          </p>
          <p className="max-w-xs text-sm" style={{ color: HOTEL_COLORS.parchmentDim }}>
            Something went wrong reaching the guest book. Try again in a moment.
          </p>
        </div>
      )}

      {state === 'loaded' && (
        <div className="flex w-full max-w-sm flex-col gap-3 pb-6">
          {stays.length > PAGE_SIZE && (
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setExpanded(false);
              }}
              placeholder="Search your stays…"
              className="rounded-full border bg-transparent px-4 py-2 text-sm"
              style={{ borderColor: HOTEL_COLORS.brassDim, color: HOTEL_COLORS.parchment }}
            />
          )}

          {filteredStays.length === 0 ? (
            <p className="text-center text-sm" style={{ color: HOTEL_COLORS.parchmentDim }}>
              Nothing matches "{query.trim()}".
            </p>
          ) : (
            <>
              {visibleStays.map((stay) => (
                <StayEntry key={stay.id} stay={stay} />
              ))}
              {hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="self-center rounded-full border px-4 py-1.5 text-xs"
                  style={{ borderColor: HOTEL_COLORS.brass, color: HOTEL_COLORS.parchment }}
                >
                  Show {hiddenCount} more
                </button>
              )}
              {expanded && filteredStays.length > PAGE_SIZE && (
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="self-center rounded-full border px-4 py-1.5 text-xs"
                  style={{ borderColor: HOTEL_COLORS.brass, color: HOTEL_COLORS.parchment }}
                >
                  Show fewer
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

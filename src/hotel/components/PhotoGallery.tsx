import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HOTEL_COLORS } from '../theme';
import { resolvePhotoUrls } from '../../lib/photos';

interface PhotoGalleryProps {
  paths: string[];
  variant?: 'grid' | 'strip' | 'lead';
}

export default function PhotoGallery({ paths, variant = 'grid' }: PhotoGalleryProps) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathsKey = paths.join('|');

  useEffect(() => {
    let cancelled = false;
    if (paths.length === 0) {
      setUrls({});
      return;
    }
    resolvePhotoUrls(paths).then((resolved) => {
      if (!cancelled) setUrls(resolved);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathsKey]);

  if (paths.length === 0) return null;

  const leadPath = variant === 'lead' ? paths[0] : null;
  const stripPaths = variant === 'lead' ? [] : paths;
  const isStrip = variant === 'strip';

  return (
    <>
      {leadPath ? (
        <button
          type="button"
          onClick={() => urls[leadPath] && setOpenPath(leadPath)}
          className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-lg"
          style={{ border: `1px solid ${HOTEL_COLORS.brassDim}` }}
        >
          {urls[leadPath] ? (
            <img src={urls[leadPath]} alt="" className="h-full w-full object-cover" />
          ) : (
            <div
              className="h-full w-full animate-pulse"
              style={{ background: HOTEL_COLORS.brassDim, opacity: 0.3 }}
            />
          )}
          {paths.length > 1 && (
            <span
              className="absolute bottom-0.5 right-0.5 rounded-full px-1 text-[9px]"
              style={{ background: HOTEL_COLORS.panel, color: HOTEL_COLORS.parchment }}
            >
              +{paths.length - 1}
            </span>
          )}
        </button>
      ) : (
        <div className={isStrip ? 'flex gap-2 overflow-x-auto pb-1' : 'grid grid-cols-2 gap-2'}>
          {stripPaths.map((path) =>
            urls[path] ? (
              <button
                key={path}
                type="button"
                onClick={() => setOpenPath(path)}
                className={
                  isStrip
                    ? 'aspect-square w-16 shrink-0 overflow-hidden rounded-lg'
                    : 'aspect-square w-full overflow-hidden rounded-lg'
                }
                style={{ border: `1px solid ${HOTEL_COLORS.brassDim}` }}
              >
                <img src={urls[path]} alt="" className="h-full w-full object-cover" />
              </button>
            ) : (
              <div
                key={path}
                className={
                  isStrip
                    ? 'aspect-square w-16 shrink-0 animate-pulse rounded-lg'
                    : 'aspect-square w-full animate-pulse rounded-lg'
                }
                style={{ background: HOTEL_COLORS.brassDim, opacity: 0.3 }}
              />
            ),
          )}
        </div>
      )}

      <AnimatePresence>
        {openPath && urls[openPath] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenPath(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(20, 12, 32, 0.85)' }}
          >
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={urls[openPath]}
              alt=""
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
              style={{ border: `1px solid ${HOTEL_COLORS.brassDim}` }}
            />
            <button
              type="button"
              onClick={() => setOpenPath(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-lg"
              style={{ background: HOTEL_COLORS.panel, color: HOTEL_COLORS.parchment }}
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

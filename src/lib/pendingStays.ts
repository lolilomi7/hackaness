import { saveStay, type SaveStayInput } from './stays';

const STORAGE_KEY = 'hackaness_pending_stays';

export interface PendingStay extends SaveStayInput {
  localId: string;
}

function readPending(): PendingStay[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PendingStay[]) : [];
  } catch {
    return [];
  }
}

function writePending(items: PendingStay[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Private browsing / full quota — the queue just won't survive a reload.
  }
}

// Called when a room is chosen but no real sign-in exists yet, so the save
// can be completed automatically once the person finishes signing in
// (possibly after leaving the app to click a magic-link email).
export function queuePendingStay(input: SaveStayInput): PendingStay {
  const item: PendingStay = { ...input, localId: crypto.randomUUID() };
  writePending([...readPending(), item]);
  return item;
}

export function hasPendingStays(): boolean {
  return readPending().length > 0;
}

// Saves every queued stay now that a real sign-in exists. Reports each
// outcome so the caller can show a toast, or re-queue on failure.
export async function flushPendingStays(): Promise<
  { localId: string; result: Awaited<ReturnType<typeof saveStay>> }[]
> {
  const pending = readPending();
  if (pending.length === 0) return [];

  const outcomes: { localId: string; result: Awaited<ReturnType<typeof saveStay>> }[] = [];
  const stillPending: PendingStay[] = [];
  for (const item of pending) {
    const { localId, ...input } = item;
    const result = await saveStay(input);
    outcomes.push({ localId, result });
    if (result.status !== 'saved') stillPending.push(item);
  }
  writePending(stillPending);
  return outcomes;
}

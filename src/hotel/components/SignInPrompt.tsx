import { useState, type FormEvent } from 'react';
import { HOTEL_COLORS, HOTEL_SERIF } from '../theme';
import { sendMagicLink } from '../../lib/auth';

interface SignInPromptProps {
  roomCount: number;
  onSent: () => void;
}

export default function SignInPrompt({ roomCount, onSent }: SignInPromptProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus('sending');
    setError(null);
    const result = await sendMagicLink(trimmed);
    if (result.error) {
      setStatus('error');
      setError(result.error);
      return;
    }
    setStatus('sent');
    onSent();
  };

  if (status === 'sent') {
    return (
      <div
        className="flex w-full max-w-sm flex-col gap-1 rounded-2xl border p-4 text-center"
        style={{ borderColor: HOTEL_COLORS.brassDim, background: HOTEL_COLORS.panel }}
      >
        <p className={`${HOTEL_SERIF} text-sm`} style={{ color: HOTEL_COLORS.parchment }}>
          Check your email
        </p>
        <p className="text-xs" style={{ color: HOTEL_COLORS.parchmentDim }}>
          Tap the link we sent to {email.trim()} and{' '}
          {roomCount > 1 ? `all ${roomCount} rooms will save` : 'this will save'} to your journal.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex w-full max-w-sm flex-col gap-2 rounded-2xl border p-4"
      style={{ borderColor: HOTEL_COLORS.brassDim, background: HOTEL_COLORS.panel }}
    >
      <p className={`${HOTEL_SERIF} text-sm`} style={{ color: HOTEL_COLORS.parchment }}>
        {roomCount > 1
          ? `Sign in to save these ${roomCount} rooms to your journal`
          : 'Sign in to save this to your journal'}
      </p>
      <p className="text-xs" style={{ color: HOTEL_COLORS.parchmentDim }}>
        We'll email you a link, no password needed.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg border bg-transparent px-3 py-2 text-sm"
          style={{ borderColor: HOTEL_COLORS.brassDim, color: HOTEL_COLORS.parchment }}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="shrink-0 rounded-lg border px-3 py-2 text-sm"
          style={{
            borderColor: HOTEL_COLORS.brass,
            color: HOTEL_COLORS.parchment,
            opacity: status === 'sending' ? 0.6 : 1,
          }}
        >
          {status === 'sending' ? 'Sending…' : 'Email me a link'}
        </button>
      </div>
      {status === 'error' && error && (
        <p className="text-xs" style={{ color: '#a54848' }}>
          {error}
        </p>
      )}
    </form>
  );
}

import { supabase } from './supabase';

// Browsing never creates a session at all — only a real, emailed-in sign-in
// counts as "signed in" for journal purposes.
function isRealUser(user: { is_anonymous?: boolean } | null | undefined): boolean {
  return !!user && !user.is_anonymous;
}

export async function getRealUserId(): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    return isRealUser(user) ? user!.id : null;
  } catch (error) {
    console.error('auth: getSession failed', error);
    return null;
  }
}

export async function sendMagicLink(email: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Sign-in is unavailable right now.' };
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('auth: sendMagicLink failed', error);
    return { error: 'Could not send that link. Check the address and try again.' };
  }
}

// Fires whenever a real (non-anonymous) sign-in completes, including after
// returning from a magic-link email — callers use this to flush anything
// that was waiting on authentication.
export function onRealSignIn(callback: (userId: string) => void): () => void {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user;
    if (isRealUser(user)) callback(user!.id);
  });
  return () => data.subscription.unsubscribe();
}

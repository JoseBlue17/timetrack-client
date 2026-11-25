// This module has no HTTP/React dependency. Only AppProvider listens to events.
export const SESSION_INVALIDATED_EVENT = 'timetrack:session-invalidated';
const PINNED_TOKEN = 'timetrack:remembered-token';
const BLOCKED = 'timetrack:auth-blocked';
let generation = 0;
let blockedSharedToken: string | null = null;

export function getSessionGeneration(): number {
  return generation;
}

export function isCurrentSession(value: number): boolean {
  // Public auth starts with a blocked session. Compare its shared-token snapshot
  // without adopting another tab's token or dispatching invalidation repeatedly.
  if (sessionStorage.getItem(BLOCKED) && !sessionStorage.getItem('token')?.trim()) {
    return value === generation && localStorage.getItem('token') === blockedSharedToken;
  }
  // Reconcile queued cross-tab changes before accepting a response/callback.
  getAuthToken();
  return value === generation;
}

export function getAuthToken(): string | null {
  const privateToken = sessionStorage.getItem('token');
  if (privateToken?.trim()) return privateToken;
  if (sessionStorage.getItem(BLOCKED)) return null;
  const token = localStorage.getItem('token');
  const pinned = sessionStorage.getItem(PINNED_TOKEN);
  if (pinned && pinned !== token) {
    invalidateSession();
    return null;
  }
  if (!token?.trim()) return null;
  sessionStorage.setItem(PINNED_TOKEN, token);
  return token;
}

export function invalidateSession(): void {
  generation += 1;
  const pinned = sessionStorage.getItem(PINNED_TOKEN);
  // Never erase credentials belonging to another account/tab.
  if (!sessionStorage.getItem('token') && pinned && localStorage.getItem('token') === pinned) {
    localStorage.removeItem('token');
  }
  sessionStorage.removeItem('token');
  sessionStorage.removeItem(PINNED_TOKEN);
  sessionStorage.setItem(BLOCKED, '1');
  // Snapshot after removing our own remembered token, before notifying React.
  blockedSharedToken = localStorage.getItem('token');
  window.dispatchEvent(new Event(SESSION_INVALIDATED_EVENT));
}

export function storeAuthToken(token: string, rememberMe = true): void {
  invalidateSession();
  sessionStorage.removeItem(BLOCKED);
  if (rememberMe) {
    localStorage.setItem('token', token);
    sessionStorage.setItem(PINNED_TOKEN, token);
  } else {
    sessionStorage.setItem('token', token);
  }
}

export function handleAuthStorageEvent(event: StorageEvent): void {
  if (event.storageArea !== localStorage || (event.key !== 'token' && event.key !== null)) return;
  // Storage events are queued; a newer login may already have superseded one.
  if (event.newValue !== localStorage.getItem('token')) return;
  // Tab-only sessions can coexist with a different remembered account.
  if (sessionStorage.getItem('token')) return;
  if (event.key === 'token' && event.oldValue === event.newValue) return;
  invalidateSession();
}

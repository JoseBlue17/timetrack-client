import {
  act,
  cleanup,
  renderHook,
  waitFor,
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import AppProvider from '@/contexts/app-provider';
import { useHourlyRate } from './use-hourly-rate';
import { useSelectedSupervisor } from './use-selected-supervisor';
import { useUpdateProfile } from './use-update-profile';
import { useVerifyToken } from './use-verify-token';
import { useAuth } from './use-auth';
import useLoggedUser from './use-logged-user';
import {
  invalidateSession,
  getAuthToken,
  getSessionGeneration,
  isCurrentSession,
} from '@/helpers/auth-session';
import type { IUser } from '@/interfaces';

import { AxiosError } from 'axios';
import { PublicHttp, Http } from '@/config/http';
import { useSignUp } from '@/modules/sign-up/hooks/use-sign-up';
import { useLocation } from 'react-router-dom';
import { useSignIn } from '@/modules/sign-in/hooks/use-sign-in';

import { SignInForm } from '@/modules/sign-in/components/sign-in-form';

const user = { id: 'a', _id: 'a', profile: { firstName: 'Alice' } } as IUser;
let client: QueryClient;
function Wrapper({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={client}>
      <AppProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});
afterEach(() => {
  cleanup();
  client.clear();
  vi.restoreAllMocks();
});

it('does not allow a captured login callback to resurrect a logged-out session', async () => {
  const { result } = renderHook(() => ({ ...useAuth(), ...useLoggedUser() }), { wrapper: Wrapper });
  const pendingLogin = result.current.onLogin;
  await act(async () => {
    await result.current.onLogout();
  });
  act(() => {
    pendingLogin({ token: 'late-token', user });
  });
  expect(result.current.loggedUser).toBeNull();
  expect(localStorage.getItem('token')).toBeNull();
});

it('clears context and query cache when the current request emits session invalidation', () => {
  const { result } = renderHook(() => ({ ...useAuth(), ...useLoggedUser() }), { wrapper: Wrapper });
  act(() => {
    result.current.onLogin({ token: 'current', user });
  });
  client.setQueryData(['private-data'], { secret: 'sentinel' });
  act(() => {
    invalidateSession();
  });
  expect(result.current.loggedUser).toBeNull();
  expect(result.current.token).toBeNull();
  expect(client.getQueryData(['private-data'])).toBeUndefined();
  expect(getAuthToken()).toBeNull();
});

it('rejects a successful sign-in response without a nonempty bearer token', async () => {
  vi.spyOn(PublicHttp, 'post').mockResolvedValueOnce({ data: { user } });
  const { result } = renderHook(() => ({ ...useSignIn(), ...useLoggedUser() }), {
    wrapper: Wrapper,
  });
  act(() => {
    result.current.signIn({ email: 'a@example.test', password: 'sentinel', rememberMe: false });
  });
  await waitFor(() => expect(result.current.isPending).toBe(false));
  expect(result.current.loggedUser).toBeNull();
  expect(getAuthToken()).toBeNull();
});

it('ignores a pending sign-in that resolves after logout and a rerender', async () => {
  let resolve!: (response: unknown) => void;
  vi.spyOn(PublicHttp, 'post').mockImplementationOnce(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  const { result } = renderHook(() => ({ ...useSignIn(), ...useAuth(), ...useLoggedUser() }), {
    wrapper: Wrapper,
  });
  act(() => {
    result.current.signIn({ email: 'a@example.test', password: 'sentinel', rememberMe: false });
  });
  await waitFor(() => expect(result.current.isPending).toBe(true));
  await act(async () => {
    await result.current.onLogout();
  });
  await act(async () => {
    resolve({ data: { token: 'late', user } });
  });
  await waitFor(() => expect(result.current.isPending).toBe(false));
  expect(result.current.loggedUser).toBeNull();
  expect(getAuthToken()).toBeNull();
});

it.each(['remembered sign-in', 'tab-only sign-in', 'signup'] as const)(
  'ignores pending %s when another tab replaces the shared token before its storage event',
  async (operation) => {
    let resolve!: (response: unknown) => void;
    const post = vi.spyOn(PublicHttp, 'post').mockImplementationOnce(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    const { result } = renderHook(
      () => ({
        signIn: useSignIn(),
        signUp: useSignUp(),
        ...useAuth(),
        ...useLoggedUser(),
      }),
      { wrapper: Wrapper },
    );
    act(() => {
      result.current.onLogin({ token: 'account-a', user });
    });
    act(() => {
      if (operation === 'signup') {
        result.current.signUp.signUp({
          email: 'a@example.test',
          password: 'sentinel',
          confirmPassword: 'sentinel',
          firstName: 'Alice',
          lastName: 'Test',
        });
      } else {
        result.current.signIn.signIn({
          email: 'a@example.test',
          password: 'sentinel',
          rememberMe: operation === 'remembered sign-in',
        });
      }
    });
    await waitFor(() => expect(post).toHaveBeenCalledOnce());
    expect(result.current.loggedUser).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    const generation = getSessionGeneration();

    // Another tab writes immediately; its storage event has not arrived here.
    localStorage.setItem('token', 'account-b');
    const dispatch = vi.spyOn(window, 'dispatchEvent');
    expect(getSessionGeneration()).toBe(generation);
    expect(isCurrentSession(generation)).toBe(false);
    expect(isCurrentSession(generation)).toBe(false);
    expect(getSessionGeneration()).toBe(generation);
    expect(dispatch).not.toHaveBeenCalled();
    expect(getAuthToken()).toBeNull();
    await act(async () => {
      resolve({ data: { token: 'late-account-a', user } });
    });
    await waitFor(() => {
      expect(result.current.signIn.isPending).toBe(false);
      expect(result.current.signUp.isPending).toBe(false);
    });
    expect(result.current.loggedUser).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('token')).toBe('account-b');
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(getAuthToken()).toBeNull();
  },
);

it.each([false, true])('submits the actual remember-me selection (%s)', async (rememberMe) => {
  const submit = vi.fn();
  render(<SignInForm onSubmit={submit} isPending={false} />, { wrapper: Wrapper });
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: 'a@example.test' },
  });
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Sentinel123!' } });
  if (rememberMe) fireEvent.click(screen.getByRole('checkbox', { name: 'Recordarme' }));
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith({
      email: 'a@example.test',
      password: 'Sentinel123!',
      rememberMe,
    }),
  );
});

it('ignores pending signup credentials and navigation after logout', async () => {
  let resolve!: (response: unknown) => void;
  vi.spyOn(PublicHttp, 'post').mockImplementationOnce(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  const { result } = renderHook(
    () => ({ ...useSignUp(), ...useAuth(), ...useLoggedUser(), path: useLocation().pathname }),
    { wrapper: Wrapper },
  );
  act(() => {
    result.current.signUp({
      email: 'a@example.test',
      password: 'sentinel',
      confirmPassword: 'sentinel',
      firstName: 'Alice',
      lastName: 'Test',
    });
  });
  await waitFor(() => expect(result.current.isPending).toBe(true));
  await act(async () => {
    await result.current.onLogout();
  });
  await act(async () => {
    resolve({ data: { token: 'late', user } });
  });
  await waitFor(() => expect(result.current.isPending).toBe(false));
  expect(result.current.loggedUser).toBeNull();
  expect(result.current.path).toBe('/sign-in');
  expect(getAuthToken()).toBeNull();
});

it('does not restore a user from verification completing after logout', async () => {
  localStorage.setItem('token', 'initial');
  let resolve!: (response: unknown) => void;
  vi.spyOn(Http, 'get').mockImplementationOnce(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  const { result } = renderHook(() => ({ ...useVerifyToken(), ...useAuth(), ...useLoggedUser() }), {
    wrapper: Wrapper,
  });
  await act(async () => {
    await result.current.onLogout();
  });
  await act(async () => {
    resolve({ data: { user } });
  });
  expect(result.current.isVerifyingToken).toBe(false);
  expect(result.current.loggedUser).toBeNull();
  expect(result.current.token).toBeNull();
});

it('does not apply a pending profile mutation after switching accounts', async () => {
  let resolve!: (response: unknown) => void;
  vi.spyOn(Http, 'patch').mockImplementationOnce(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  const { result } = renderHook(
    () => ({ ...useUpdateProfile(), ...useAuth(), ...useLoggedUser() }),
    { wrapper: Wrapper },
  );
  act(() => {
    result.current.onLogin({ token: 'first', user });
  });
  act(() => {
    result.current.updateProfile({ firstName: 'Updated', lastName: 'Test' });
  });
  await waitFor(() => expect(result.current.isUpdatingProfile).toBe(true));
  const second = { ...user, id: 'b', _id: 'b' };
  act(() => {
    result.current.onLogin({ token: 'second', user: second });
  });
  await act(async () => {
    resolve({ data: { user: { ...user, profile: { firstName: 'Updated' } } } });
  });
  await waitFor(() => expect(result.current.isUpdatingProfile).toBe(false));
  expect(result.current.loggedUser?.id).toBe('b');
  expect(getAuthToken()).toBe('second');
});

it('isolates supervisor and hourly-rate preferences across accounts without remounting', () => {
  const { result } = renderHook(
    () => ({ ...useAuth(), ...useHourlyRate(), ...useSelectedSupervisor() }),
    { wrapper: Wrapper },
  );
  act(() => {
    result.current.onLogin({ token: 'a', user });
  });
  act(() => {
    result.current.setHourlyRate(75);
    result.current.setSelectedSupervisorId('supervisor-a');
  });
  expect(result.current.hourlyRate).toBe(75);
  act(() => {
    result.current.onLogin({ token: 'b', user: { ...user, id: 'b', _id: 'b' } });
  });
  expect(result.current.hourlyRate).toBe(0);
  expect(result.current.selectedSupervisorId).toBeNull();
  act(() => {
    result.current.onLogin({ token: 'a2', user });
  });
  expect(result.current.hourlyRate).toBe(75);
  expect(result.current.selectedSupervisorId).toBe('supervisor-a');
});

it('ignores delayed storage events from before a newer local login', () => {
  const { result } = renderHook(() => ({ ...useAuth(), ...useLoggedUser() }), { wrapper: Wrapper });
  act(() => {
    result.current.onLogin({ token: 'new-login', user });
  });
  const generation = getSessionGeneration();
  act(() => {
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'token',
        oldValue: 'old',
        newValue: null,
        storageArea: localStorage,
      }),
    );
  });
  expect(result.current.loggedUser).toEqual(user);
  expect(localStorage.getItem('token')).toBe('new-login');
  expect(isCurrentSession(generation)).toBe(true);
});

it('invalidates a remembered account before reading an externally replaced token even before its storage event', () => {
  const { result } = renderHook(() => ({ ...useAuth(), ...useLoggedUser() }), { wrapper: Wrapper });
  act(() => {
    result.current.onLogin({ token: 'account-a', user });
  });
  const generation = getSessionGeneration();
  localStorage.setItem('token', 'account-b');
  act(() => {
    expect(getAuthToken()).toBeNull();
  });
  expect(result.current.loggedUser).toBeNull();
  expect(result.current.token).toBeNull();
  expect(isCurrentSession(generation)).toBe(false);
  expect(localStorage.getItem('token')).toBe('account-b');
});

it('offers an awaitable profile update that settles even after its component unmounts', async () => {
  let resolve!: (response: unknown) => void;
  vi.spyOn(Http, 'patch').mockImplementationOnce(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  const { result, unmount } = renderHook(() => useUpdateProfile(), { wrapper: Wrapper });
  let pending!: Promise<{ user: IUser }>;
  act(() => {
    pending = result.current.updateProfileAsync({ firstName: 'Alice', lastName: 'Test' });
  });
  await waitFor(() => expect(result.current.isUpdatingProfile).toBe(true));
  unmount();
  resolve({ data: { user } });
  await expect(pending).resolves.toEqual({ user });
});

it('checks externally changed credentials before accepting an asynchronous callback', () => {
  const { result } = renderHook(() => ({ ...useAuth(), ...useLoggedUser() }), { wrapper: Wrapper });
  act(() => {
    result.current.onLogin({ token: 'account-a', user });
  });
  const generation = getSessionGeneration();
  localStorage.setItem('token', 'account-b');
  act(() => {
    expect(isCurrentSession(generation)).toBe(false);
  });
  expect(result.current.loggedUser).toBeNull();
  expect(localStorage.getItem('token')).toBe('account-b');
});

it.each([false, true])(
  'stores sign-in bearer according to rememberMe=%s without sending it to the API',
  async (rememberMe) => {
    const post = vi
      .spyOn(PublicHttp, 'post')
      .mockResolvedValueOnce({ data: { token: 'opaque-bearer', user } });
    const { result } = renderHook(() => ({ ...useSignIn(), ...useLoggedUser() }), {
      wrapper: Wrapper,
    });
    const initialGeneration = getSessionGeneration();
    act(() => {
      result.current.signIn({ email: 'a@example.test', password: 'sentinel', rememberMe });
    });
    expect(getSessionGeneration()).toBeGreaterThan(initialGeneration);
    await waitFor(() => expect(result.current.loggedUser).toEqual(user));
    expect(post).toHaveBeenLastCalledWith('/users/sign-in', {
      email: 'a@example.test',
      password: 'sentinel',
    });
    expect(localStorage.getItem('token')).toBe(rememberMe ? 'opaque-bearer' : null);
    expect(sessionStorage.getItem('token')).toBe(rememberMe ? null : 'opaque-bearer');
    expect(getAuthToken()).toBe('opaque-bearer');
  },
);

it('clears remembered-session UI on a cross-tab account switch without adopting or deleting the other account', () => {
  const { result, unmount } = renderHook(() => ({ ...useAuth(), ...useLoggedUser() }), {
    wrapper: Wrapper,
  });
  act(() => {
    result.current.onLogin({ token: 'account-a', user });
  });
  client.setQueryData(['private-data'], 'a');
  const generation = getSessionGeneration();
  localStorage.setItem('token', 'account-b');
  act(() => {
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'token',
        oldValue: 'account-a',
        newValue: 'account-b',
        storageArea: localStorage,
      }),
    );
  });
  expect(result.current.loggedUser).toBeNull();
  expect(client.getQueryData(['private-data'])).toBeUndefined();
  expect(isCurrentSession(generation)).toBe(false);
  expect(localStorage.getItem('token')).toBe('account-b');
  expect(getAuthToken()).toBeNull();
  unmount();
  renderHook(useLoggedUser, { wrapper: Wrapper });
  expect(getAuthToken()).toBeNull();
});

it('does not replace or log out a tab-only account when another tab logs in or out', async () => {
  const { result } = renderHook(() => ({ ...useAuth(), ...useLoggedUser() }), { wrapper: Wrapper });
  act(() => {
    result.current.onLogin({ token: 'private-a', user }, false);
  });
  const generation = getSessionGeneration();
  localStorage.setItem('token', 'shared-b');
  act(() => {
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'token',
        newValue: 'shared-b',
        storageArea: localStorage,
      }),
    );
  });
  expect(result.current.loggedUser).toEqual(user);
  expect(getAuthToken()).toBe('private-a');
  expect(isCurrentSession(generation)).toBe(true);
  await act(async () => {
    await result.current.onLogout();
  });
  expect(localStorage.getItem('token')).toBe('shared-b');
  expect(getAuthToken()).toBeNull();
});

it('does not verify a missing bearer token', async () => {
  const get = vi.spyOn(Http, 'get');
  const { result } = renderHook(useVerifyToken, { wrapper: Wrapper });
  await waitFor(() => expect(result.current.isVerifyingToken).toBe(false));
  expect(get).not.toHaveBeenCalled();
});

it('keeps the actual bearer after server verification rather than manufacturing a token', async () => {
  localStorage.setItem('token', 'opaque-token');
  vi.spyOn(Http, 'get').mockResolvedValueOnce({ data: { user } });
  const { result } = renderHook(() => ({ ...useVerifyToken(), ...useLoggedUser() }), {
    wrapper: Wrapper,
  });
  await waitFor(() => expect(result.current.isVerifyingToken).toBe(false));
  expect(result.current.loggedUser).toEqual(user);
  expect(result.current.token).toBe('opaque-token');
});

it('handles a real private-client 401 invalidation through the provider without a network request', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const { result } = renderHook(() => ({ ...useAuth(), ...useLoggedUser() }), { wrapper: Wrapper });
  act(() => {
    result.current.onLogin({ token: 'current-bearer', user }, false);
  });
  client.setQueryData(['private-data'], 'sentinel');
  await act(async () => {
    await expect(
      Http.get('/local-test-only', {
        adapter: async (config) => {
          throw new AxiosError('unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
            status: 401,
            statusText: 'Unauthorized',
            data: {},
            headers: {},
            config,
          });
        },
      }),
    ).rejects.toBeInstanceOf(AxiosError);
  });
  expect(result.current.loggedUser).toBeNull();
  expect(result.current.token).toBeNull();
  expect(getAuthToken()).toBeNull();
  expect(client.getQueryData(['private-data'])).toBeUndefined();
});

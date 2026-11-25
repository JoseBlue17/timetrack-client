import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import type { AxiosAdapter } from 'axios';

import AppProvider from '@/contexts/app-provider';
import { Http } from '@/config/http';
import type { IUser } from '@/interfaces';
import { useAuth } from './use-auth';
import useLoggedUser from './use-logged-user';
import { useUpdateProfile } from './use-update-profile';

const initialAdapter = Http.defaults.adapter;
const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
const accountA = {
  id: 'account-a',
  _id: 'account-a',
  profile: { firstName: 'Alice', lastName: 'A' },
} as IUser;
const accountB = {
  id: 'account-b',
  _id: 'account-b',
  profile: { firstName: 'Bob', lastName: 'B' },
} as IUser;

function Wrapper({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={client}>
      <AppProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

afterEach(() => {
  cleanup();
  Http.defaults.adapter = initialAdapter;
  client.clear();
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

it('does not send a queued profile edit using the next account credentials', async () => {
  const dispatch = vi.fn<AxiosAdapter>(async (config) => ({
    data: { user: accountA },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }));
  Http.defaults.adapter = dispatch;
  const { result } = renderHook(
    () => ({ ...useAuth(), ...useLoggedUser(), ...useUpdateProfile() }),
    { wrapper: Wrapper },
  );
  act(() => {
    result.current.onLogin({ token: 'TOKEN_A', user: accountA });
  });
  act(() => {
    result.current.updateProfile({ firstName: 'Alice edit', lastName: 'A' });
    result.current.onLogin({ token: 'TOKEN_B', user: accountB });
  });
  await waitFor(() => expect(result.current.isUpdatingProfile).toBe(false));
  expect(dispatch).not.toHaveBeenCalled();
  expect(result.current.loggedUser?.id).toBe('account-b');
});

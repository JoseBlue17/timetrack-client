import { afterEach, describe, expect, it, vi } from 'vitest';
import axios, { AxiosError } from 'axios';
import type { AxiosAdapter } from 'axios';

import { Http, PublicHttp } from './index';
import {
  getAuthToken,
  getSessionGeneration,
  invalidateSession,
  storeAuthToken,
} from '@/helpers/auth-session';

const failingAdapter: AxiosAdapter = async (config) => {
  throw new AxiosError('SENSITIVE_SERVER_MESSAGE', 'ERR_BAD_REQUEST', config, undefined, {
    data: { message: 'SENSITIVE_RESPONSE' },
    status: 401,
    statusText: 'Unauthorized',
    headers: {},
    config,
  });
};

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

describe('HTTP diagnostic safety', () => {
  it.each([
    ['public', PublicHttp],
    ['private', Http],
  ] as const)(
    'does not log credentials or response payloads for %s requests',
    async (_, client) => {
      const log = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('token', 'SENSITIVE_TOKEN');

      await expect(
        client.post(
          'https://SENSITIVE_USER:SENSITIVE_PASS@example.invalid/SENSITIVE_PATH?secret=SENSITIVE_QUERY',
          { password: 'SENSITIVE_PASSWORD' },
          { adapter: failingAdapter },
        ),
      ).rejects.toBeInstanceOf(AxiosError);

      expect(log).toHaveBeenCalledWith('HTTP request failed', { method: 'POST', status: 401 });
      expect(JSON.stringify(log.mock.calls)).not.toContain('SENSITIVE');
    },
  );

  it('keeps Axios errors available to existing domain error handlers', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = await PublicHttp.get('/users/sign-in', { adapter: failingAdapter }).catch(
      (failure: unknown) => failure,
    );
    expect(axios.isAxiosError(error)).toBe(true);
    if (axios.isAxiosError(error)) expect(error.response?.status).toBe(401);
  });
});

describe('HTTP session boundaries', () => {
  const successfulAdapter: AxiosAdapter = async (config) => ({
    data: { ok: true },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  });

  it('does not attach existing credentials to public requests', async () => {
    storeAuthToken('PRIVATE_TOKEN');
    const response = await PublicHttp.post('/users/sign-in', {}, { adapter: successfulAdapter });
    expect(response.config.headers.Authorization).toBeUndefined();
    expect(response.config.withCredentials).toBe(false);
  });

  it('reads tab-only bearer credentials for private requests', async () => {
    storeAuthToken('TAB_TOKEN', false);
    const response = await Http.get('/users/me', { adapter: successfulAdapter });
    expect(response.config.headers.Authorization).toBe('Bearer TAB_TOKEN');
    expect(response.config.withCredentials).toBe(false);
  });

  it('ends the current session on a private 401', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    storeAuthToken('CURRENT_TOKEN');
    await expect(Http.get('/users/me', { adapter: failingAdapter })).rejects.toBeInstanceOf(
      AxiosError,
    );
    expect(getAuthToken()).toBeNull();
  });

  it('does not end the current session on a public 401', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    storeAuthToken('CURRENT_TOKEN');
    await expect(
      PublicHttp.post('/users/sign-in', {}, { adapter: failingAdapter }),
    ).rejects.toBeInstanceOf(AxiosError);
    expect(getAuthToken()).toBe('CURRENT_TOKEN');
  });

  it('does not end the current session on a permission denial', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    storeAuthToken('CURRENT_TOKEN');
    await expect(
      Http.get('/payments', {
        adapter: async (config) => {
          throw new AxiosError('Forbidden', 'ERR_BAD_REQUEST', config, undefined, {
            data: {},
            status: 403,
            statusText: 'Forbidden',
            headers: {},
            config,
          });
        },
      }),
    ).rejects.toBeInstanceOf(AxiosError);
    expect(getAuthToken()).toBe('CURRENT_TOKEN');
  });

  it('ignores a 401 received for a previous account', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    storeAuthToken('PREVIOUS_TOKEN');
    await expect(
      Http.get('/users/me', {
        adapter: async (config) => {
          storeAuthToken('NEW_TOKEN');
          return failingAdapter(config);
        },
      }),
    ).rejects.toBeInstanceOf(AxiosError);
    expect(getAuthToken()).toBe('NEW_TOKEN');
  });

  it('does not substitute the next account token before the adapter starts', async () => {
    storeAuthToken('ACCOUNT_A');
    const sent: string[] = [];
    const pending = Http.patch(
      '/users/me',
      { firstName: 'Account A edit' },
      {
        adapter: async (config) => {
          sent.push(String(config.headers.Authorization));
          return successfulAdapter(config);
        },
      },
    );
    storeAuthToken('ACCOUNT_B');
    await pending.catch(() => {});
    expect(sent).toEqual(['Bearer ACCOUNT_A']);
    expect(getAuthToken()).toBe('ACCOUNT_B');
  });

  it('does not dispatch a private operation after its originating generation closes', async () => {
    storeAuthToken('ACCOUNT_A');
    const generation = getSessionGeneration();
    storeAuthToken('ACCOUNT_B');
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const adapter = vi.fn(successfulAdapter);
    await expect(
      Http.patch(
        '/users/me',
        { firstName: 'Account A edit' },
        {
          expectedSessionGeneration: generation,
          adapter,
        },
      ),
    ).rejects.toSatisfy(axios.isCancel);
    expect(adapter).not.toHaveBeenCalled();
    expect(log).not.toHaveBeenCalled();
    expect(getAuthToken()).toBe('ACCOUNT_B');
  });

  it('rejects successful private responses belonging to a closed session', async () => {
    storeAuthToken('PREVIOUS_TOKEN');
    const pending = Http.get('/users/me', {
      adapter: async (config) => {
        invalidateSession();
        return successfulAdapter(config);
      },
    });
    await expect(pending).rejects.toSatisfy(axios.isCancel);
  });
});

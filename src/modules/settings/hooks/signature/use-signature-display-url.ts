import { useQuery } from '@tanstack/react-query';

import { Http } from '@/config/http';
import { SIGNATURE_URL_QUERY_KEY } from '@/query-keys';

interface IGetSignatureResponse {
  signatureUrl: string | null;
}

export function useSignatureDisplayUrl(signatureUrl: string | null): string | null {
  const { data } = useQuery<IGetSignatureResponse>({
    queryKey: [...SIGNATURE_URL_QUERY_KEY, signatureUrl],
    queryFn: () => Http.get<IGetSignatureResponse>('/users/me/signature').then(({ data }) => data),
    enabled: Boolean(signatureUrl),
    staleTime: 30 * 60 * 1000,
  });

  if (!signatureUrl) return null;

  return data?.signatureUrl ?? null;
}

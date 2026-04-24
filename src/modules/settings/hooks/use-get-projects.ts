import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IProject } from '../project.interface';

export const PROJECTS_QUERY_KEY = ['PROJECTS'];

export function useGetProjects() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: () => Http.get<IProject[]>('/projects').then((r) => r.data),
  });

  const invalidateProjects = () => {
    queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
  };

  return { ...query, invalidateProjects };
}

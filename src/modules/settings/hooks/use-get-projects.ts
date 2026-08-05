import { useQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IProject } from '../project.interface';
import { useInvalidateProjects } from '@/hooks';
import { PROJECTS_QUERY_KEY } from '@/query-keys';

export function useGetProjects() {
  const { data: projects = [], ...rest } = useQuery<IProject[]>({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: () => Http.get('/projects').then(({ data }) => data),
  });

  const invalidateProjects = useInvalidateProjects();

  return { ...rest, projects, invalidateProjects };
}

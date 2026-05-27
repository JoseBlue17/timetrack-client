import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IProject } from '../project.interface';

export function useGetProjects() {
  const queryClient = useQueryClient();

  const { data: projects = [], ...rest } = useQuery<IProject[]>({
    queryKey: ['PROJECTS'],
    queryFn: () => Http.get('/projects').then(({ data }) => data),
  });

  const invalidateProjects = () => {
    queryClient.invalidateQueries({ queryKey: ['PROJECTS'] });
  };

  return { ...rest, projects, invalidateProjects };
}

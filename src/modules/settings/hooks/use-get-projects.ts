import { useInfiniteQuery } from '@tanstack/react-query';
import { Http } from '@/config/http';
import type { IProject, IProjectsResponse } from '../project.interface';
import { useInvalidateProjects } from '@/hooks';
import { PROJECTS_QUERY_KEY } from '@/query-keys';

export function useGetProjects() {
  const { data: projects = [], ...rest } = useInfiniteQuery<
    IProjectsResponse,
    Error,
    IProject[],
    typeof PROJECTS_QUERY_KEY,
    string | undefined
  >({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: ({ pageParam }) =>
      Http.get<IProjectsResponse>('/projects', {
        params: pageParam ? { cursor: pageParam } : undefined,
      }).then(({ data }) => data),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.data),
  });

  const invalidateProjects = useInvalidateProjects();

  return { ...rest, projects, invalidateProjects };
}

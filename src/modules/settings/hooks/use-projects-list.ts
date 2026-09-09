import { useState } from 'react';
import { useGetProjects } from './use-get-projects';
import { useDeleteProject } from './use-delete-project';
import { useScrollLoadMore } from '@/hooks/use-scroll-load-more';
import type { IProject } from '../project.interface';

export function useProjectsList() {
  const {
    projects = [],
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetProjects();

  useScrollLoadMore({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<IProject | undefined>(undefined);

  const openEdit = (project: IProject) => {
    setSelected(project);
    setModalOpen(true);
  };

  const openCreate = () => {
    setSelected(undefined);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return {
    projects,
    isLoading,
    isDeleting,
    deleteProject,
    modalOpen,
    selected,
    openEdit,
    openCreate,
    closeModal,
  };
}

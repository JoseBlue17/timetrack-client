import { useState } from 'react';
import { Button, Popconfirm, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, FolderAddOutlined } from '@ant-design/icons';
import { useGetProjects } from '../hooks/use-get-projects';
import { useDeleteProject } from '../hooks/use-delete-project';
import { ProjectFormModal } from './project-form-modal';
import type { IProject } from '../project.interface';

export function ProjectsList() {
  const { data: projects = [], isLoading } = useGetProjects();
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

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Gestión de proyectos</h2>
          <p className="text-sm text-gray-500 mt-1">
            Administra los proyectos en los que trabajas para usarlos en tus timesheets
          </p>
        </div>
        <Button
          type="primary"
          icon={<FolderAddOutlined />}
          onClick={openCreate}
          size="large"
          className="rounded-lg! bg-indigo-500! border-indigo-500! hover:bg-indigo-600! hover:border-indigo-600!"
        >
          Agregar proyecto
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <FolderAddOutlined className="text-[40px] mb-3" />
          <p className="text-base">No tienes proyectos aún</p>
          <p className="text-sm mt-1">Agrega tu primer proyecto para comenzar</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`flex items-center gap-4 px-6 py-4 ${
                index < projects.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <FolderAddOutlined className="text-indigo-500 text-[18px]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{project.name}</p>
                {project.description && (
                  <p className="text-gray-400 text-sm truncate">{project.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  type="text"
                  icon={<EditOutlined className="text-gray-400" />}
                  onClick={() => openEdit(project)}
                />
                <Popconfirm
                  title="¿Eliminar este proyecto?"
                  onConfirm={() => deleteProject(project.id)}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined className="text-gray-400" />}
                    loading={isDeleting}
                  />
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectFormModal open={modalOpen} onClose={() => setModalOpen(false)} project={selected} />
    </>
  );
}

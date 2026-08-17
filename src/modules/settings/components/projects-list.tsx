import { useState } from 'react';
import { Button, Popconfirm, Spin } from 'antd';
import { LuPencil, LuTrash2, LuFolderPlus } from 'react-icons/lu';

import { useGetProjects } from '../hooks/use-get-projects';
import { useDeleteProject } from '../hooks/use-delete-project';
import { ProjectFormModal } from './project-form-modal';
import { SignatureUpload } from './signature-upload';
import { HourlyRateSection } from './hourly-rate-section';

import type { IProject } from '../project.interface';
import { useSignature, useCanEditConfiguration } from '@/hooks';
import { cn } from '@/tools';

export function ProjectsList() {
  const { signatureDataUrl, setSignatureDataUrl } = useSignature();
  const isAdmin = useCanEditConfiguration();

  const { projects = [], isLoading } = useGetProjects();

  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const [modalOpen, setModalOpen] = useState(false);

  const [selected, setSelected] = useState<IProject | undefined>(undefined);

  const cardStyles = 'bg-white p-6 rounded-2xl border border-gray-200 overflow-y-auto';

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
      <div className="mb-2 mt-4 bg-white p-6 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-gray-800">Gestión de proyectos</h2>
            <p className="text-sm text-gray-500">
              Administra los proyectos en los que trabajas para usarlos en tus timesheets
            </p>
          </div>

          <Button
            type="primary"
            icon={<LuFolderPlus />}
            onClick={openCreate}
            size="large"
            className="rounded-lg! bg-indigo-500! border-indigo-500! hover:bg-indigo-600! hover:border-indigo-600! shrink-0"
          >
            Agregar proyecto
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <LuFolderPlus className="text-[40px] mb-3" />

          <p className="text-base">No tienes proyectos aún</p>

          <p className="text-sm mt-1">Agrega tu primer proyecto para comenzar</p>
        </div>
      ) : (
        <div className={`${cardStyles} mb-6`}>
          <section className="mb-2"></section>

          <div>
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={index < projects.length - 1 ? 'border-b border-gray-100' : ''}
              >
                <div className="flex items-center gap-4 px-2 py-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <LuFolderPlus className="text-indigo-500 text-[18px]" />
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
                      icon={<LuPencil className="text-gray-400" />}
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
                        icon={<LuTrash2 className={cn('[&_.bg-gray-200]:hover:bg-red-500')} />}
                        loading={isDeleting}
                      />
                    </Popconfirm>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProjectFormModal open={modalOpen} onClose={() => setModalOpen(false)} project={selected} />

      <HourlyRateSection />
      {!isAdmin && (
        <div className="mb-4 mt-4">
          <SignatureUpload
            title="Firma digital"
            description="Sube tu firma para agilizar el cierre de reportes"
            signatureDataUrl={signatureDataUrl}
            onChange={setSignatureDataUrl}
          />
        </div>
      )}
    </>
  );
}

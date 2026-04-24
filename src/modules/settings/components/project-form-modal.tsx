import { useMemo } from 'react';
import { Modal, Input, Button } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { IProject } from '../project.interface';
import { useCreateProject } from '../hooks/use-create-project';
import { useUpdateProject } from '../hooks/use-update-project';

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  project?: IProject;
}

const validationSchema = Yup.object({
  name: Yup.string().max(100, 'Máximo 100 caracteres').required('El nombre es requerido'),
  description: Yup.string().max(500, 'Máximo 500 caracteres').optional(),
});

export function ProjectFormModal({ open, onClose, project }: ProjectFormModalProps) {
  const isEditing = !!project;

  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject(project?.id ?? '');
  const isPending = isCreating || isUpdating;

  const initialValues = useMemo(
    () => ({ name: project?.name ?? '', description: project?.description ?? '' }),
    [project?.description, project?.name],
  );

  const handleSubmit = (values: typeof initialValues, helpers: { resetForm: () => void }) => {
    const onSuccess = () => {
      helpers.resetForm();
      onClose();
    };

    if (isEditing) {
      updateProject(values, { onSuccess });
    } else {
      createProject(values, { onSuccess });
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={
        <span className="text-base font-semibold text-gray-800">
          {isEditing ? 'Editar proyecto' : 'Agregar proyecto'}
        </span>
      }
      footer={null}
      destroyOnClose
      width={480}
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500 mr-1">*</span>Nombre
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Ej. Proyecto Alpha"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            status={formik.touched.name && formik.errors.name ? 'error' : ''}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <Input.TextArea
            id="description"
            name="description"
            placeholder="Ej. Desarrollo de API REST"
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            status={formik.touched.description && formik.errors.description ? 'error' : ''}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <Button block onClick={handleClose} disabled={isPending} className="rounded-lg!">
            Cancelar
          </Button>
          <Button
            block
            type="primary"
            htmlType="submit"
            loading={isPending}
            className="rounded-lg! bg-indigo-500! border-indigo-500! hover:bg-indigo-600! hover:border-indigo-600!"
          >
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

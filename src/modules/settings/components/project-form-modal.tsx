import { Modal, Form, Input, Button } from 'antd';
import { useCreateProject } from '../hooks/use-create-project';
import { useUpdateProject } from '../hooks/use-update-project';
import type { IProjectFormModalProps, ICreateProjectValues } from '../project.interface';

export function ProjectFormModal({ open, onClose, project }: IProjectFormModalProps) {
  const isEditing = !!project;

  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject(project?.id ?? '');
  const isPending = isCreating || isUpdating;

  const handleSubmit = (values: ICreateProjectValues) => {
    const onSuccess = () => onClose();

    if (isEditing) {
      updateProject(values, { onSuccess });
      return;
    }

    createProject(values, { onSuccess });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <span className="text-base font-semibold text-gray-800">
          {isEditing ? 'Editar proyecto' : 'Agregar proyecto'}
        </span>
      }
      footer={null}
      destroyOnHidden
      width={480}
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: project?.name ?? '',
          description: project?.description ?? '',
        }}
        className="flex flex-col gap-2 mt-4"
      >
        <Form.Item
          label="Nombre"
          name="name"
          rules={[
            { required: true, message: 'El nombre es requerido' },
            { max: 100, message: 'Máximo 100 caracteres' },
          ]}
        >
          <Input placeholder="Ej. Proyecto Alpha" />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ max: 500, message: 'Máximo 500 caracteres' }]}
        >
          <Input.TextArea placeholder="Ej. Desarrollo de API REST" rows={3} />
        </Form.Item>

        <div className="flex gap-3 mt-2">
          <Button block onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isPending}
            className="font-semibold"
          >
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

import { Modal, Form, Input, InputNumber, DatePicker, Button, Select } from 'antd';
import { LuPlus } from 'react-icons/lu';
import type { ITimesheetFormModalProps } from './timesheet.interface';
import { useCreateTimesheet } from '../hooks/use-create-timesheet';
import { useUpdateTimesheet } from '../hooks/use-update-timesheet';
import { useTimesheetFormSubmit } from '../hooks/use-timesheet-form-submit';
import { useGetProjects } from '@/modules/settings/hooks/use-get-projects';
import { useHourlyRate } from '@/hooks';
import { filterOptionByLabel } from '@/helpers/filter-option-by-label';
import {
  getTimesheetFormInitialValues,
  createEmptyEntry,
  validateTimesheetEntries,
} from './timesheet-form.utils';

export function TimesheetFormModal({ open, onClose, timesheet }: ITimesheetFormModalProps) {
  const isEditing = !!timesheet;
  const [form] = Form.useForm();

  const { mutate: createTimesheet, isPending: isCreating } = useCreateTimesheet();
  const { mutate: updateTimesheet, isPending: isUpdating } = useUpdateTimesheet(
    timesheet?.id ?? '',
  );
  const isPending = isCreating || isUpdating;

  const { projects = [] } = useGetProjects();
  const { hourlyRate } = useHourlyRate();

  const projectOptions = projects.map((project) => ({ value: project.name, label: project.name }));

  const initialValues = getTimesheetFormInitialValues(timesheet);

  const handleSubmit = useTimesheetFormSubmit({
    form,
    timesheet,
    hourlyRate,
    createTimesheet,
    updateTimesheet,
    onClose,
  });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <span className="text-lg font-semibold text-gray-800">
          {isEditing ? 'Editar registro de tiempo' : 'Agregar registro de tiempo'}
        </span>
      }
      footer={null}
      destroyOnHidden
      width={560}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        className="flex flex-col gap-2 mt-4"
      >
        <Form.Item
          label="Fecha"
          name="date"
          rules={[{ required: true, message: 'La fecha es requerida' }]}
        >
          <DatePicker className="w-full" format="DD/MM/YYYY" />
        </Form.Item>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Proyectos trabajados</p>
          <p className="text-indigo-500 text-sm mb-4">
            Agrega todos los proyectos en los que trabajaste este día
          </p>

          <Form.List name="entries" rules={[{ validator: validateTimesheetEntries }]}>
            {(fields, { add, remove }) => (
              <div className="flex flex-col gap-4">
                {fields.map((field) => (
                  <div key={field.key} className="bg-indigo-50 rounded-xl p-4 flex flex-col gap-3">
                    <Form.Item
                      {...field}
                      label="Proyecto"
                      name={[field.name, 'project']}
                      rules={[{ required: true, message: 'Requerido' }]}
                    >
                      <Select
                        className="w-full"
                        placeholder="Selecciona un proyecto"
                        options={projectOptions}
                        showSearch
                        filterOption={filterOptionByLabel}
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Descripción"
                      name={[field.name, 'description']}
                      rules={[{ required: true, message: 'Requerido' }]}
                    >
                      <Input.TextArea rows={3} placeholder="¿Qué hiciste en este proyecto?" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Horas"
                      name={[field.name, 'hours']}
                      rules={[{ required: true, message: 'Requerido' }]}
                    >
                      <InputNumber
                        className="w-full"
                        placeholder="8"
                        min={0.25}
                        max={24}
                        step={0.25}
                        addonAfter="horas"
                      />
                    </Form.Item>

                    {fields.length > 1 && !isEditing && (
                      <Button type="link" danger onClick={() => remove(field.name)}>
                        Eliminar proyecto
                      </Button>
                    )}
                  </div>
                ))}

                {!isEditing && (
                  <Button
                    type="dashed"
                    onClick={() => add(createEmptyEntry())}
                    block
                    icon={<LuPlus />}
                  >
                    Agregar otro proyecto
                  </Button>
                )}
              </div>
            )}
          </Form.List>
        </div>

        <div className="flex gap-3 mt-1">
          <Button block size="large" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={isPending}
            className="font-semibold"
          >
            {isEditing ? 'Actualizar registro' : 'Guardar registro'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

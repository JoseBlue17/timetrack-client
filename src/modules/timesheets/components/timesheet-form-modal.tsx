import { useMemo } from 'react';
import { Modal, Input, InputNumber, DatePicker, Button, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import type { ITimesheetEntry, ITimesheetFormModalProps } from './timesheet.interface';
import { useCreateTimesheet } from '../hooks/use-create-timesheet';
import { useUpdateTimesheet } from '../hooks/use-update-timesheet';
import { useGetProjects } from '@/modules/settings/hooks/use-get-projects';
import { timesheetFormSchema } from './validations';
import {
  createEmptyEntry,
  getTimesheetFormInitialValues,
} from './timesheet-form-modal.initial-values';
import { createTimesheetFormSubmit } from './timesheet-form-modal.submit';
import { getTimesheetEntryError } from './timesheet-form-modal.errors';

export function TimesheetFormModal({ open, onClose, timesheet }: ITimesheetFormModalProps) {
  const isEditing = !!timesheet;

  const { mutate: createTimesheet, isPending: isCreating } = useCreateTimesheet();
  const { mutate: updateTimesheet, isPending: isUpdating } = useUpdateTimesheet(
    timesheet?.id ?? '',
  );
  const isPending = isCreating || isUpdating;

  const { data: projects = [] } = useGetProjects();

  const projectOptions = projects.map((project) => ({ value: project.name, label: project.name }));

  const initialValues = useMemo(() => getTimesheetFormInitialValues(timesheet), [timesheet]);

  const formik = useFormik({
    initialValues,
    validationSchema: timesheetFormSchema,
    enableReinitialize: true,
    onSubmit: createTimesheetFormSubmit({
      isEditing,
      createTimesheet,
      updateTimesheet,
      onClose,
      createEmptyEntry,
    }),
  });

  const showErrors = formik.submitCount > 0;
  const dateError =
    showErrors && typeof formik.errors.date === 'string' ? String(formik.errors.date) : '';

  const updateEntry = (
    entryIndex: number,
    field: keyof ITimesheetEntry,
    value: string | number | null,
  ) => {
    formik.setFieldValue(
      'entries',
      formik.values.entries.map((previousEntry, previousIndex) =>
        previousIndex === entryIndex ? { ...previousEntry, [field]: value } : previousEntry,
      ),
    );
  };

  const addEntry = () => {
    formik.setFieldValue('entries', [...formik.values.entries, createEmptyEntry()]);
  };

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={
        <span className="text-lg font-semibold text-gray-800">
          {isEditing ? 'Editar registro de tiempo' : 'Agregar registro de tiempo'}
        </span>
      }
      footer={null}
      destroyOnClose
      width={560}
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500 mr-1">*</span>Fecha
          </label>
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY"
            value={formik.values.date ? dayjs(formik.values.date) : null}
            onChange={(selectedDate) => {
              formik.setFieldValue('date', selectedDate ? selectedDate.format('YYYY-MM-DD') : '');
            }}
            status={dateError ? 'error' : ''}
          />
          {dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-1">Proyectos trabajados</p>
          <p className="text-indigo-500 text-sm mb-4">
            Agrega todos los proyectos en los que trabajaste este día
          </p>

          <div className="flex flex-col gap-4">
            {formik.values.entries.map((entry, entryIndex) => {
              const projectError = getTimesheetEntryError({
                showErrors,
                errors: formik.errors,
                entryIndex,
                field: 'project',
              });

              const descriptionError = getTimesheetEntryError({
                showErrors,
                errors: formik.errors,
                entryIndex,
                field: 'description',
              });

              const hoursError = getTimesheetEntryError({
                showErrors,
                errors: formik.errors,
                entryIndex,
                field: 'hours',
              });

              return (
                <div key={entryIndex} className="bg-indigo-50 rounded-xl p-4 flex flex-col gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500 mr-1">*</span>Proyecto
                    </label>
                    <Select
                      className="w-full"
                      placeholder="Selecciona un proyecto"
                      value={entry.project || undefined}
                      onChange={(selectedProject: string) =>
                        updateEntry(entryIndex, 'project', selectedProject)
                      }
                      status={projectError ? 'error' : ''}
                      showSearch
                      filterOption={(inputText, option) =>
                        String(option?.label ?? '')
                          .toLowerCase()
                          .includes(inputText.toLowerCase())
                      }
                      options={projectOptions}
                    />
                    {projectError && <p className="text-red-500 text-xs mt-1">{projectError}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500 mr-1">*</span>Descripción
                    </label>
                    <Input.TextArea
                      rows={3}
                      placeholder="¿Qué hiciste en este proyecto?"
                      value={entry.description}
                      onChange={(event) =>
                        updateEntry(entryIndex, 'description', event.target.value)
                      }
                      status={descriptionError ? 'error' : ''}
                    />
                    {descriptionError && (
                      <p className="text-red-500 text-xs mt-1">{descriptionError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500 mr-1">*</span>Horas
                    </label>
                    <InputNumber
                      className="w-full"
                      placeholder="8"
                      min={0.25}
                      max={24}
                      step={0.25}
                      value={entry.hours}
                      onChange={(selectedHours) => updateEntry(entryIndex, 'hours', selectedHours)}
                      addonAfter="horas"
                      status={hoursError ? 'error' : ''}
                    />
                    {hoursError && <p className="text-red-500 text-xs mt-1">{hoursError}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={addEntry}
              className="mt-3 w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg py-3 text-gray-600 text-sm hover:border-indigo-400 hover:text-indigo-600 transition-colors bg-white"
            >
              <PlusCircleOutlined />
              Agregar otro proyecto
            </button>
          )}
        </div>

        <div className="flex gap-3 mt-1">
          <Button
            block
            size="large"
            htmlType="button"
            onClick={handleClose}
            disabled={isPending}
            className="rounded-lg!"
          >
            Cancelar
          </Button>
          <Button
            block
            size="large"
            type="primary"
            loading={isPending}
            htmlType="submit"
            className="rounded-lg! bg-indigo-500! border-indigo-500! hover:bg-indigo-600! hover:border-indigo-600!"
          >
            {isEditing ? 'Actualizar registro' : 'Guardar registro'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

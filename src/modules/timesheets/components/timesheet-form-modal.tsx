import { useState } from 'react';
import { Modal, Input, InputNumber, DatePicker, Button, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import type { ITimesheet } from '../timesheet.interface';
import { useCreateTimesheet } from '../hooks/use-create-timesheet';
import { useUpdateTimesheet } from '../hooks/use-update-timesheet';
import { useGetProjects } from '@/modules/settings/hooks/use-get-projects';

interface ProjectEntry {
  project: string;
  description: string;
  hours: number | null;
}

interface ProjectEntryError {
  project?: string;
  description?: string;
  hours?: string;
}

const emptyEntry = (): ProjectEntry => ({ project: '', description: '', hours: null });

const entrySchema = Yup.object({
  project: Yup.string().max(100).required('Requerido'),
  description: Yup.string().max(500).required('Requerido'),
  hours: Yup.number().min(0.25).max(24).nullable().required('Requerido'),
});

interface TimesheetFormModalProps {
  open: boolean;
  onClose: () => void;
  timesheet?: ITimesheet;
}

export function TimesheetFormModal({ open, onClose, timesheet }: TimesheetFormModalProps) {
  const isEditing = !!timesheet;

  const [date, setDate] = useState<string>(() =>
    timesheet ? timesheet.date.slice(0, 10) : dayjs().format('YYYY-MM-DD'),
  );
  const [dateError, setDateError] = useState('');
  const [entries, setEntries] = useState<ProjectEntry[]>(() =>
    timesheet
      ? [{ project: timesheet.project, description: timesheet.description, hours: timesheet.hours }]
      : [emptyEntry()],
  );
  const [entryErrors, setEntryErrors] = useState<ProjectEntryError[]>([{}]);

  const { mutate: createTimesheet, isPending: isCreating } = useCreateTimesheet();
  const { mutate: updateTimesheet, isPending: isUpdating } = useUpdateTimesheet(
    timesheet?.id ?? '',
  );
  const isPending = isCreating || isUpdating;

  const { data: projects = [] } = useGetProjects();

  const projectOptions = projects.map((p) => ({ value: p.name, label: p.name }));

  const updateEntry = (index: number, field: keyof ProjectEntry, value: string | number | null) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
    setEntryErrors((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: undefined } : e)));
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, emptyEntry()]);
    setEntryErrors((prev) => [...prev, {}]);
  };

  const validate = async (): Promise<boolean> => {
    let valid = true;

    if (!date) {
      setDateError('La fecha es requerida');
      valid = false;
    } else {
      setDateError('');
    }

    const newErrors: ProjectEntryError[] = await Promise.all(
      entries.map(async (entry) => {
        try {
          await entrySchema.validate(entry, { abortEarly: false });
          return {};
        } catch (err) {
          if (err instanceof Yup.ValidationError) {
            const errors: ProjectEntryError = {};
            for (const e of err.inner) {
              if (e.path) (errors as Record<string, string>)[e.path] = e.message;
            }
            valid = false;
            return errors;
          }
          return {};
        }
      }),
    );

    setEntryErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!(await validate())) return;

    if (isEditing) {
      const entry = entries[0];
      updateTimesheet(
        { date, project: entry.project, description: entry.description, hours: entry.hours ?? 0 },
        { onSuccess: onClose },
      );
    } else {
      let completed = 0;
      for (const entry of entries) {
        createTimesheet(
          {
            date,
            project: entry.project,
            description: entry.description,
            hours: entry.hours ?? 0,
            hourlyRate: 0,
          },
          {
            onSuccess: () => {
              completed++;
              if (completed === entries.length) onClose();
            },
          },
        );
      }
    }
  };

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
      destroyOnClose
      width={560}
    >
      <div className="flex flex-col gap-5 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <span className="text-red-500 mr-1">*</span>Fecha
          </label>
          <DatePicker
            className="w-full"
            format="DD/MM/YYYY"
            value={date ? dayjs(date) : null}
            onChange={(val) => {
              setDate(val ? val.format('YYYY-MM-DD') : '');
              setDateError('');
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
            {entries.map((entry, i) => (
              <div key={i} className="bg-indigo-50 rounded-xl p-4 flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500 mr-1">*</span>Proyecto
                  </label>
                  <Select
                    className="w-full"
                    placeholder="Selecciona un proyecto"
                    value={entry.project || undefined}
                    onChange={(val: string) => updateEntry(i, 'project', val)}
                    status={entryErrors[i]?.project ? 'error' : ''}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.label ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={projectOptions}
                  />
                  {entryErrors[i]?.project && (
                    <p className="text-red-500 text-xs mt-1">{entryErrors[i].project}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500 mr-1">*</span>Descripción
                  </label>
                  <Input.TextArea
                    rows={3}
                    placeholder="¿Qué hiciste en este proyecto?"
                    value={entry.description}
                    onChange={(e) => updateEntry(i, 'description', e.target.value)}
                    status={entryErrors[i]?.description ? 'error' : ''}
                  />
                  {entryErrors[i]?.description && (
                    <p className="text-red-500 text-xs mt-1">{entryErrors[i].description}</p>
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
                    onChange={(val) => updateEntry(i, 'hours', val)}
                    addonAfter="horas"
                    status={entryErrors[i]?.hours ? 'error' : ''}
                  />
                  {entryErrors[i]?.hours && (
                    <p className="text-red-500 text-xs mt-1">{entryErrors[i].hours}</p>
                  )}
                </div>
              </div>
            ))}
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
          <Button block size="large" onClick={onClose} disabled={isPending} className="rounded-lg!">
            Cancelar
          </Button>
          <Button
            block
            size="large"
            type="primary"
            loading={isPending}
            onClick={handleSubmit}
            className="rounded-lg! bg-indigo-500! border-indigo-500! hover:bg-indigo-600! hover:border-indigo-600!"
          >
            {isEditing ? 'Actualizar registro' : 'Guardar registro'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

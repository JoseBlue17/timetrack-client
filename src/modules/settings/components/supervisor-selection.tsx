import { useState } from 'react';
import { Button, Select } from 'antd';
import { LuUserCheck, LuSave } from 'react-icons/lu';
import { useGetSupervisors } from '../hooks/use-get-supervisors';
import { useSelectedSupervisor, useShowSuccess } from '@/hooks';

export function SupervisorSelection() {
  const { data: supervisors = [], isLoading } = useGetSupervisors();
  const { selectedSupervisorId, setSelectedSupervisorId } = useSelectedSupervisor();
  const { showSuccess } = useShowSuccess();

  const [pendingSupervisorId, setPendingSupervisorId] = useState<string | null>(
    selectedSupervisorId,
  );

  const options = supervisors.map((supervisor) => ({
    value: supervisor.id,
    label: `${supervisor.profile.firstName} ${supervisor.profile.lastName}`.trim(),
  }));

  const hasChanges = pendingSupervisorId !== selectedSupervisorId;

  const handleSave = () => {
    setSelectedSupervisorId(pendingSupervisorId);
    showSuccess({
      title: 'Cambios guardados',
      description: 'El supervisor de revisión ha sido actualizado correctamente.',
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200">
      <section>
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          <LuUserCheck
            size={20}
            className="text-indigo-500 text-2xl rounded inline align-text-bottom mr-2"
          />
          Supervisor de revisión
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          Selecciona el supervisor que revisará y aprobará tus reportes mensuales. Presiona Guardar
          cambios para aplicar la selección.
        </p>

        <Select
          placeholder="Selecciona un supervisor"
          loading={isLoading}
          value={pendingSupervisorId ?? undefined}
          onChange={setPendingSupervisorId}
          options={options}
          allowClear
          className="w-full max-w-md"
        />

        <div className="mt-4">
          <Button
            type="primary"
            icon={<LuSave size={16} />}
            onClick={handleSave}
            disabled={!hasChanges}
            className="font-semibold"
          >
            Guardar cambios
          </Button>
        </div>
      </section>
    </div>
  );
}

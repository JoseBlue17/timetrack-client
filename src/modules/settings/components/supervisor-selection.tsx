import { Select } from 'antd';
import { LuUserCheck } from 'react-icons/lu';
import { useGetSupervisors } from '../hooks/use-get-supervisors';
import { useSelectedSupervisor } from '@/hooks';

export function SupervisorSelection() {
  const { data: supervisors = [], isLoading } = useGetSupervisors();
  const { selectedSupervisorId, setSelectedSupervisorId } = useSelectedSupervisor();

  const options = supervisors.map((supervisor) => ({
    value: supervisor.id,
    label: `${supervisor.profile.firstName} ${supervisor.profile.lastName}`.trim(),
  }));

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
          Selecciona el supervisor que revisará y aprobará tus reportes mensuales. Se aplicará
          cuando cierres un mes.
        </p>

        <Select
          placeholder="Selecciona un supervisor"
          loading={isLoading}
          value={selectedSupervisorId ?? undefined}
          onChange={setSelectedSupervisorId}
          options={options}
          allowClear
          className="w-full max-w-md"
        />
      </section>
    </div>
  );
}

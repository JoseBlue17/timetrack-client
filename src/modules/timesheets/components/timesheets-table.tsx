import { Table } from 'antd';

import { useExplosion } from '@/components/explosion/explosion';
import type { ITimesheetsTableProps } from './timesheet.interface';
import { TimesheetExpandedRow } from './timesheet-expanded-row';
import { getExpandIcon, getTimesheetsColumns } from './timesheets-table.columns';
import { useTimesheetsTable } from './use-timesheets-table';

export function TimesheetsTable({ groups, onEdit }: ITimesheetsTableProps) {
  const { expandedKeys, setExpandedKeys, deleteTimesheet, isDeleting, handleToggleExpand } =
    useTimesheetsTable();
  const { triggerExplosion, Explosion } = useExplosion();

  const columns = getTimesheetsColumns({
    onEdit,
    onDelete: deleteTimesheet,
    isDeleting,
    onToggleExpand: handleToggleExpand,
    expandedKeys,
  });

  return (
    <>
      <Explosion />
      <Table
        columns={columns}
        dataSource={groups}
        rowKey="date"
        pagination={false}
        className="shadow-sm rounded-lg"
        expandable={{
          expandedRowRender: (record) => (
            <TimesheetExpandedRow
              group={record}
              onEdit={onEdit}
              onDelete={deleteTimesheet}
              triggerExplosion={triggerExplosion}
            />
          ),
          expandedRowKeys: expandedKeys,
          expandIcon: (props) => getExpandIcon(props),
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedKeys([...expandedKeys, record.date]);
              return;
            }

            setExpandedKeys(expandedKeys.filter((key) => key !== record.date));
          },
        }}
      />
    </>
  );
}

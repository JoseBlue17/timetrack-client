import { Table } from 'antd';
import type { ITimesheetsTableProps } from './timesheet.interface';
import { useTimesheetsTable } from './use-timesheets-table';
import {
  getTimesheetsColumns,
  getExpandedRowRender,
  getExpandIcon,
} from './timesheets-table.columns';
import { useExplosion } from '@/components/explosion/explosion';

export function TimesheetsTable({ groups, loading, onEdit }: ITimesheetsTableProps) {
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

  const expandedRowRender = getExpandedRowRender({
    onEdit,
    onDelete: deleteTimesheet,
    triggerExplosion,
  });

  return (
    <>
      <Explosion />
      <Table
        columns={columns}
        dataSource={groups}
        rowKey="date"
        loading={loading}
        pagination={false}
        expandable={{
          expandedRowRender,
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
        className="timesheets-main-table"
      />
    </>
  );
}

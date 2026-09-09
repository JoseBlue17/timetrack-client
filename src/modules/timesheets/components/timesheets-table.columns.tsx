import { Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { LuPencil, LuTrash2, LuMinus, LuPlus } from 'react-icons/lu';

import type { ITimesheetDateGroup, ITimesheet } from '../timesheet.interface';

interface GetColumnsProps {
  onEdit: (timesheet: ITimesheet) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onToggleExpand: (date: string) => void;
  expandedKeys: string[];
}

export const getTimesheetsColumns = ({
  onEdit,
  onDelete,
  isDeleting,
  onToggleExpand,
}: GetColumnsProps) => [
  {
    title: 'Fecha',
    dataIndex: 'date',
    key: 'date',
    render: (date: string) => (
      <span className="font-semibold text-gray-700">{dayjs(date).format('DD MMM YYYY')}</span>
    ),
  },
  {
    title: 'Proyectos',
    dataIndex: 'projects',
    key: 'projects',
    render: (count: number) => (
      <Button type="link" className="p-0 font-medium text-sm">
        {count} {count === 1 ? 'proyecto' : 'proyectos'}
      </Button>
    ),
  },
  {
    title: 'Total horas',
    dataIndex: 'totalHours',
    key: 'totalHours',
    render: (hours: number) => (
      <span className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1 text-[13px] font-bold text-indigo-600">
        {hours}h
      </span>
    ),
  },
  {
    title: 'Acciones',
    key: 'actions',
    render: (_: unknown, record: ITimesheetDateGroup) => (
      <div className="flex gap-2">
        <Button
          type="text"
          size="small"
          icon={<LuPencil className="text-gray-400 group-hover:text-indigo-500" />}
          className="group"
          onClick={(e) => {
            e.stopPropagation();
            if (record.timesheets.length === 1) {
              onEdit(record.timesheets[0]);
              return;
            }
            onToggleExpand(record.date);
          }}
        />
        {record.timesheets.length === 1 && (
          <Popconfirm
            title="¿Eliminar este registro?"
            onConfirm={(e) => {
              e?.stopPropagation();
              onDelete(record.timesheets[0].id);
            }}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<LuTrash2 className="text-red-400" />}
              loading={isDeleting}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        )}
      </div>
    ),
  },
];

interface GetExpandIconProps {
  expanded: boolean;
  onExpand: (record: ITimesheetDateGroup, e: React.MouseEvent<HTMLElement>) => void;
  record: ITimesheetDateGroup;
}

export const getExpandIcon = ({ onExpand, expanded, record }: GetExpandIconProps) => (
  <Button
    type="text"
    size="small"
    onClick={(e) => onExpand(record, e)}
    icon={expanded ? <LuMinus size={16} /> : <LuPlus size={16} />}
  />
);

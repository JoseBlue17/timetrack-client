import { Button, Popconfirm, Table } from 'antd';
import { LuPencil, LuTrash2, LuMinus, LuPlus } from 'react-icons/lu';
import dayjs from 'dayjs';
import type { ITimesheetDateGroup, ITimesheet } from './timesheet.interface';

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
      <button className="text-indigo-500 hover:text-indigo-600 font-medium text-sm transition-colors border-none bg-transparent cursor-pointer">
        {count} {count === 1 ? 'proyecto' : 'proyectos'}
      </button>
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

export const getExpandedRowRender = ({
  onEdit,
  onDelete,
}: Pick<GetColumnsProps, 'onEdit' | 'onDelete'>) => {
  return (group: ITimesheetDateGroup) => {
    const subColumns = [
      {
        title: 'Proyecto',
        dataIndex: 'project',
        key: 'project',
        render: (text: string) => (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="font-semibold text-gray-700">{text}</span>
          </div>
        ),
      },
      {
        title: 'Descripción',
        dataIndex: 'description',
        key: 'description',
        className: 'text-gray-500 text-sm',
      },
      {
        title: 'Horas',
        dataIndex: 'hours',
        key: 'hours',
        render: (h: number) => <span className="font-bold text-gray-700">{h}h</span>,
      },
      {
        title: 'Acciones',
        key: 'actions',
        render: (_: unknown, record: ITimesheet) => (
          <div className="flex gap-2">
            <Button
              type="text"
              size="small"
              icon={<LuPencil className="text-gray-400" />}
              onClick={() => onEdit(record)}
            />
            <Popconfirm
              title="¿Eliminar este registro?"
              onConfirm={() => onDelete(record.id)}
              okText="Sí"
              cancelText="No"
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<LuTrash2 className="text-red-400" />}
              />
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <div className="bg-stone-50/50 rounded-2xl border border-stone-100/50 m-2">
        <Table
          columns={subColumns}
          dataSource={group.timesheets}
          rowKey="id"
          pagination={false}
          size="small"
          className="nested-timesheets-table"
        />
      </div>
    );
  };
};

interface GetExpandIconProps {
  expanded: boolean;
  onExpand: (record: ITimesheetDateGroup, e: React.MouseEvent<HTMLElement>) => void;
  record: ITimesheetDateGroup;
}

export const getExpandIcon = ({ onExpand, expanded, record }: GetExpandIconProps) =>
  record.timesheets.length > 1 ? (
    <button
      onClick={(e) => onExpand(record, e)}
      className="text-gray-400 hover:text-indigo-600 transition-colors border-none bg-transparent cursor-pointer"
    >
      {expanded ? <LuMinus size={16} /> : <LuPlus size={16} />}
    </button>
  ) : (
    <div className="w-4" />
  );

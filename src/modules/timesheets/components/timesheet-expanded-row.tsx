import { Button, Popconfirm, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LuPencil, LuTrash2 } from 'react-icons/lu';

import type { ITimesheet, ITimesheetDateGroup } from '../timesheet.interface';

interface ITimesheetExpandedRowProps {
  group: ITimesheetDateGroup;
  onEdit: (timesheet: ITimesheet) => void;
  onDelete: (id: string) => void;
  triggerExplosion: (element: HTMLElement) => void;
}

export function TimesheetExpandedRow({
  group,
  onEdit,
  onDelete,
  triggerExplosion,
}: ITimesheetExpandedRowProps) {
  const subColumns: ColumnsType<ITimesheet> = [
    {
      title: 'Proyecto',
      dataIndex: 'project',
      key: 'project',
      align: 'center',
      width: 140,
      render: (text: string) => (
        <div className="flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="font-semibold text-gray-700">{text}</span>
        </div>
      ),
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      width: 240,
      render: (description: string) => (
        <div className="max-h-20 overflow-y-auto text-sm text-gray-500 px-2">
          {description || 'Sin descripción'}
        </div>
      ),
    },
    {
      title: 'Horas',
      dataIndex: 'hours',
      key: 'hours',
      align: 'center',
      width: 100,
      render: (h: number) => <span className="font-bold text-gray-700">{h}h</span>,
    },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'center',
      width: 100,
      render: (_: unknown, record: ITimesheet) => (
        <div className="flex justify-center gap-2">
          <Button
            type="text"
            size="small"
            icon={<LuPencil className="text-gray-400" />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="¿Eliminar este registro?"
            onConfirm={() => {
              const element = document.querySelector<HTMLElement>(
                `[data-timesheet-row-id="${record.id}"]`,
              );
              if (element) {
                triggerExplosion(element);
              }
              onDelete(record.id);
            }}
            okText="Sí"
            cancelText="No"
          >
            <Button type="text" size="small" danger icon={<LuTrash2 className="text-red-400" />} />
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
        onRow={(record) =>
          ({
            'data-timesheet-row-id': record.id,
          }) as unknown as React.HTMLAttributes<HTMLElement>
        }
      />
    </div>
  );
}

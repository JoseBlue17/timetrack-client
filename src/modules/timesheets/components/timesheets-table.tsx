import { useState } from 'react';
import { Table, Button, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ITimesheetDateGroup, ITimesheet } from '../timesheet.interface';
import { useDeleteTimesheet } from '../hooks/use-delete-timesheet';

interface TimesheetsTableProps {
  groups: ITimesheetDateGroup[];
  loading?: boolean;
  onEdit: (timesheet: ITimesheet) => void;
}

export function TimesheetsTable({ groups, loading, onEdit }: TimesheetsTableProps) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const { mutate: deleteTimesheet, isPending: isDeleting } = useDeleteTimesheet();

  const outerColumns = [
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
        <Tag color="blue">
          {count} {count === 1 ? 'proyecto' : 'proyectos'}
        </Tag>
      ),
    },
    {
      title: 'Total horas',
      dataIndex: 'totalHours',
      key: 'totalHours',
      render: (hours: number) => (
        <span className="inline-flex items-center rounded-full bg-indigo-500 px-2.5 py-0.5 text-[13px] font-semibold text-white">
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
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              if (record.timesheets.length === 1) {
                onEdit(record.timesheets[0]);
              } else {
                setExpandedKeys((prev) =>
                  prev.includes(record.date)
                    ? prev.filter((k) => k !== record.date)
                    : [...prev, record.date],
                );
              }
            }}
          />
          {record.timesheets.length === 1 && (
            <Popconfirm
              title="¿Eliminar este registro?"
              onConfirm={(e) => {
                e?.stopPropagation();
                deleteTimesheet(record.timesheets[0].id);
              }}
              okText="Sí"
              cancelText="No"
            >
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                loading={isDeleting}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const expandedRowRender = (group: ITimesheetDateGroup) => {
    const subColumns = [
      {
        title: 'Proyecto',
        dataIndex: 'project',
        key: 'project',
        render: (text: string) => <span className="font-medium">{text}</span>,
      },
      {
        title: 'Descripción',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: 'Horas',
        dataIndex: 'hours',
        key: 'hours',
        render: (h: number) => (
          <span className="inline-flex items-center rounded-full bg-indigo-300 px-2 py-0.5 text-[12px] font-semibold text-indigo-900">
            {h}h
          </span>
        ),
      },
      {
        title: 'Acciones',
        key: 'actions',
        render: (_: unknown, record: ITimesheet) => (
          <div className="flex gap-2">
            <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
            <Popconfirm
              title="¿Eliminar este registro?"
              onConfirm={() => deleteTimesheet(record.id)}
              okText="Sí"
              cancelText="No"
            >
              <Button size="small" danger icon={<DeleteOutlined />} loading={isDeleting} />
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <Table
        columns={subColumns}
        dataSource={group.timesheets}
        rowKey="id"
        pagination={false}
        size="small"
        className="ml-8"
      />
    );
  };

  return (
    <Table
      columns={outerColumns}
      dataSource={groups}
      rowKey="date"
      loading={loading}
      pagination={false}
      expandable={{
        expandedRowRender,
        expandedRowKeys: expandedKeys,
        onExpand: (expanded, record) => {
          setExpandedKeys(
            expanded
              ? [...expandedKeys, record.date]
              : expandedKeys.filter((k) => k !== record.date),
          );
        },
        rowExpandable: (record) => record.timesheets.length > 1,
      }}
      className="mt-4"
    />
  );
}

import { useRef, useState, useCallback, useMemo } from 'react';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import type { ITimesheet } from '../components/timesheet.interface';
import { useGetTimesheets } from '../hooks/use-get-timesheets';
import { useCloseMonth } from '../hooks/use-close-month';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useSelectedSupervisor, useHourlyRate, useSignature } from '@/hooks';
import {
  countUniqueTimesheetDays,
  groupTimesheetsByDate,
  sumTimesheetsHours,
} from '../components/timesheet.utils';

export function useTimesheetsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'old-reports'>('active');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<ITimesheet | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const currentMonth = selectedDate.format('MM');
  const currentYear = selectedDate.format('YYYY');

  const { timesheets, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetTimesheets({
      month: Number(currentMonth),
      year: Number(currentYear),
    });

  const observerTarget = useRef<HTMLDivElement>(null);

  useInfiniteScroll({
    observerTarget,
    onLoadMore: fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isLoading,
    isFetchingNextPage,
  });

  const { signatureUrl } = useSignature();
  const { selectedSupervisorId } = useSelectedSupervisor();
  const { hourlyRate } = useHourlyRate();
  const { closeMonth, isClosingMonth } = useCloseMonth({
    month: Number(currentMonth),
    year: Number(currentYear),
    hourlyRate,
    supervisorId: selectedSupervisorId,
    signatureUrl,
  });

  const handleCloseMonth = useCallback(() => {
    if (!signatureUrl) {
      Modal.warning({
        title: 'Firma requerida',
        content: 'Debes subir tu firma en Configuración antes de cerrar el mes.',
      });
      return;
    }

    if (!selectedSupervisorId) {
      Modal.warning({
        title: 'Supervisor requerido',
        content:
          'Debes seleccionar un supervisor en Configuración → Reportes antes de cerrar el mes.',
      });
      return;
    }

    Modal.confirm({
      title: '¿Cerrar mes y generar reporte?',
      content: 'No podrás agregar más registros a este mes después de cerrarlo.',
      okText: 'Sí, cerrar mes',
      cancelText: 'Cancelar',
      onOk: () => closeMonth(),
    });
  }, [closeMonth, selectedSupervisorId, signatureUrl]);

  const totalHours = sumTimesheetsHours(timesheets);
  const uniqueDays = countUniqueTimesheetDays(timesheets);
  const groups = groupTimesheetsByDate(timesheets);

  const handleEdit = useCallback((timesheet: ITimesheet) => {
    setSelectedTimesheet(timesheet);
    setModalOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setSelectedTimesheet(undefined);
    setModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setSelectedTimesheet(undefined);
  }, []);

  return useMemo(
    () => ({
      activeTab,
      setActiveTab,
      modalOpen,
      selectedTimesheet,
      selectedDate,
      setSelectedDate,
      isLoading,
      isFetchingNextPage,
      isClosingMonth,
      totalHours,
      uniqueDays,
      groups,
      timesheets,
      handleCloseMonth,
      handleEdit,
      handleAdd,
      handleClose,
      observerTarget,
    }),
    [
      activeTab,
      groups,
      handleAdd,
      handleClose,
      handleCloseMonth,
      handleEdit,
      isClosingMonth,
      isFetchingNextPage,
      isLoading,
      modalOpen,
      selectedDate,
      selectedTimesheet,
      timesheets,
      totalHours,
      uniqueDays,
    ],
  );
}

import { useRef, useCallback, useMemo } from 'react';
import { Modal } from 'antd';
import type { ITimesheet } from '../components/timesheet.interface';
import { useGetTimesheets } from './use-get-timesheets';
import { useCloseMonth } from './use-close-month';
import { useTimesheetFilters } from './use-timesheet-filters';
import { useTimesheetModal } from './use-timesheet-modal';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useSelectedSupervisor, useHourlyRate, useSignature } from '@/hooks';
import {
  countUniqueTimesheetDays,
  groupTimesheetsByDate,
  sumTimesheetsHours,
} from '@/helpers/group-timesheets-by-date';

export function useTimesheetsPage() {
  const { activeTab, setActiveTab, selectedDate, setSelectedDate, currentMonth, currentYear } =
    useTimesheetFilters();
  const { modalOpen, selectedTimesheet, handleEdit, handleAdd, handleClose } = useTimesheetModal();

  const { timesheets, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetTimesheets({
      month: currentMonth,
      year: currentYear,
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
    month: currentMonth,
    year: currentYear,
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

  const wrappedHandleEdit = useCallback(
    (timesheet: ITimesheet) => {
      handleEdit(timesheet);
    },
    [handleEdit],
  );

  const wrappedHandleAdd = useCallback(() => {
    handleAdd();
  }, [handleAdd]);

  const wrappedHandleClose = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return useMemo(
    () => ({
      activeTab,
      setActiveTab,
      modalOpen,
      selectedTimesheet,
      selectedDate,
      setSelectedDate,
      isLoading,
      isError,
      error,
      isFetchingNextPage,
      isClosingMonth,
      totalHours,
      uniqueDays,
      groups,
      timesheets,
      handleCloseMonth,
      handleEdit: wrappedHandleEdit,
      handleAdd: wrappedHandleAdd,
      handleClose: wrappedHandleClose,
      observerTarget,
    }),
    [
      activeTab,
      error,
      groups,
      handleCloseMonth,
      isClosingMonth,
      isError,
      isFetchingNextPage,
      isLoading,
      modalOpen,
      selectedDate,
      selectedTimesheet,
      setActiveTab,
      setSelectedDate,
      timesheets,
      totalHours,
      uniqueDays,
      wrappedHandleAdd,
      wrappedHandleClose,
      wrappedHandleEdit,
    ],
  );
}

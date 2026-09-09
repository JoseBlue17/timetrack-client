import { useState } from 'react';
import { useGetOldReports } from './use-get-old-reports';
import { useUploadOldReport } from './use-upload-old-report';
import { useDeleteOldReport } from './use-delete-old-report';
import { useScrollLoadMore } from '@/hooks/use-scroll-load-more';

export const OLD_REPORTS_MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const CURRENT_YEAR = new Date().getFullYear();

export const OLD_REPORTS_YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export function useOldReportsList() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [viewingPdfId, setViewingPdfId] = useState<string | null>(null);

  const {
    oldReports,
    isLoading: isLoadingOld,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetOldReports();

  useScrollLoadMore({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const { uploadOldReport, isUploading } = useUploadOldReport();
  const { deleteOldReport, isDeleting } = useDeleteOldReport();

  const handleUpload = () => {
    if (!pendingFile) return;

    uploadOldReport(
      {
        file: pendingFile,
        pdfFileName: pendingFile.name,
        referenceMonth: selectedMonth,
        referenceYear: selectedYear,
      },
      {
        onSuccess: () => {
          setPendingFile(null);
        },
      },
    );
  };

  return {
    oldReports,
    isLoadingOld,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    pendingFile,
    setPendingFile,
    isUploading,
    handleUpload,
    deleteOldReport,
    isDeleting,
    viewingPdfId,
    setViewingPdfId,
  };
}

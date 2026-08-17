import { useState } from 'react';
import { Button, Tabs, Modal, Select, Upload, Spin } from 'antd';
import { LuCloudUpload, LuFileText, LuTrash2, LuEye } from 'react-icons/lu';
import { MdOutlinePictureAsPdf, MdCalendarMonth } from 'react-icons/md';
import type { IMonthlyReport } from './reports.interface';
import { useGetOldReports } from '../hooks/use-get-old-reports';
import { useUploadOldReport } from '../hooks/use-upload-old-report';
import { useDeleteOldReport } from '../hooks/use-delete-old-report';
import { useGetOldReportPdf } from '../hooks/use-get-old-report-pdf';
import { MonthlyReportsList } from './monthly-reports-list';

type ReportsTab = 'monthly' | 'old';

const MONTH_NAMES = [
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
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

interface IOldReportsSectionProps {
  monthlyReportsData?: IMonthlyReport[];
}

function OldReportPdfViewer({
  reportId,
  onClose,
}: {
  reportId: string | null;
  onClose: () => void;
}) {
  const { data: pdfUrl, isLoading } = useGetOldReportPdf(reportId);

  return (
    <Modal
      open={!!reportId}
      onCancel={onClose}
      footer={null}
      width={900}
      styles={{ body: { padding: 0, height: '75vh' } }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <iframe src={pdfUrl} className="w-full h-full min-h-[70vh]" title="PDF Preview" />
      )}
    </Modal>
  );
}

export function OldReportsSection({ monthlyReportsData }: IOldReportsSectionProps) {
  const [activeTab, setActiveTab] = useState<ReportsTab>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [viewingPdfId, setViewingPdfId] = useState<string | null>(null);

  const { oldReports, isLoading: isLoadingOld } = useGetOldReports();
  const { uploadOldReport, isUploading } = useUploadOldReport();
  const { deleteOldReport, isDeleting } = useDeleteOldReport();

  const showTabs = monthlyReportsData !== undefined;

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

  const oldReportsContent = (
    <>
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Mes</label>
              <Select
                value={selectedMonth}
                onChange={setSelectedMonth}
                className="w-full"
                size="large"
                options={MONTH_NAMES.map((name, i) => ({ label: name, value: i + 1 }))}
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Año</label>
              <Select
                value={selectedYear}
                onChange={setSelectedYear}
                className="w-full"
                size="large"
                options={YEAR_OPTIONS.map((y) => ({ label: String(y), value: y }))}
              />
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Archivo PDF</label>
              <Upload
                accept=".pdf"
                maxCount={1}
                beforeUpload={(file) => {
                  setPendingFile(file);
                  return false;
                }}
                onRemove={() => setPendingFile(null)}
                fileList={
                  pendingFile ? [{ uid: '-1', name: pendingFile.name, status: 'done' }] : []
                }
              >
                <Button
                  icon={<LuCloudUpload />}
                  size="large"
                  className="w-full bg-brand! text-white! hover:bg-brand/70! hover:border-brand/30!"
                >
                  Seleccionar archivo
                </Button>
              </Upload>
            </div>

            <Button
              type="primary"
              icon={<LuCloudUpload />}
              size="large"
              loading={isUploading}
              disabled={!pendingFile}
              onClick={handleUpload}
              className="bg-brand! hover:bg-bran/70! hover:border-brand/30! text-white! disabled:bg-gray-300! disabled:border-gray-300! disabled:text-gray-500!"
            >
              Subir
            </Button>
          </div>
        </div>
      </div>
      <hr className="border-gray-200 mb-3 " />

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">
          PDFs subidos
        </h3>

        <div className="flex flex-col gap-3">
          {isLoadingOld ? (
            <div className="py-8 text-center border border-dashed border-gray-100 rounded-2xl">
              <Spin size="small" />
            </div>
          ) : oldReports.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-gray-100 rounded-2xl">
              <p className="text-gray-400 text-sm italic">No hay reportes antiguos subidos</p>
            </div>
          ) : (
            oldReports.map((pdfItem) => (
              <div
                key={pdfItem.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
              >
                <div className="text-red-400 shrink-0">
                  <LuFileText size={28} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">{pdfItem.pdfFileName}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {pdfItem.referenceMonthLabel} · Subido el {pdfItem.uploadedAtDate}
                  </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="text"
                    icon={<LuEye size={18} className="text-indigo-500" />}
                    onClick={() => setViewingPdfId(pdfItem.id)}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<LuTrash2 size={18} />}
                    loading={isDeleting}
                    onClick={() => deleteOldReport(pdfItem.id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <OldReportPdfViewer reportId={viewingPdfId} onClose={() => setViewingPdfId(null)} />
    </>
  );

  const tabItems = [
    {
      key: 'monthly',
      label: (
        <span className="flex items-center gap-2">
          <MdCalendarMonth size={16} />
          Reportes mensuales
        </span>
      ),
      children: <MonthlyReportsList monthlyReportsData={monthlyReportsData ?? []} />,
    },
    {
      key: 'old',
      label: (
        <span className="flex items-center gap-2">
          <MdOutlinePictureAsPdf size={16} />
          Reportes antiguos
        </span>
      ),
      children: oldReportsContent,
    },
  ];

  if (!showTabs) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mt-5">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Reportes antiguos (PDF)</h2>
          </div>
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            Sube reportes de meses anteriores
          </p>
        </div>
        {oldReportsContent}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mt-5">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Reportes</h2>
        </div>
        <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          Gestiona los reportes mensuales y antiguos
        </p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as ReportsTab)}
        items={tabItems}
        className="mb-8"
      />
    </div>
  );
}

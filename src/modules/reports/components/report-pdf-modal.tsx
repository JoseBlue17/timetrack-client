import { Modal, Spin, Button } from 'antd';
import { LuExternalLink, LuDownload } from 'react-icons/lu';
import { useGetReportPdf } from '../hooks/use-get-report-pdf';

interface IReportPdfModalProps {
  reportId: string | null;
  reportName?: string;
  open: boolean;
  onClose: () => void;
}

export function ReportPdfModal({ reportId, reportName, open, onClose }: IReportPdfModalProps) {
  const { pdfUrl, isLoading, error } = useGetReportPdf(reportId);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="flex items-center justify-between pr-8">
          <span className="text-lg font-bold text-gray-800 truncate max-w-xs">
            Detalle del reporte: {reportName || 'Cargando...'}
          </span>
          {pdfUrl && (
            <div className="flex gap-2">
              <Button
                type="text"
                size="small"
                icon={<LuExternalLink size={16} />}
                onClick={() => window.open(pdfUrl, '_blank')}
                className="text-indigo-600 hover:text-indigo-700!"
              >
                Abrir en nueva pestaña
              </Button>
              <Button
                type="text"
                size="small"
                icon={<LuDownload size={16} />}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = pdfUrl;
                  link.download = `reporte-${reportName || reportId}.pdf`;
                  link.click();
                }}
                className="text-gray-600 hover:text-indigo-600!"
              >
                Descargar
              </Button>
            </div>
          )}
        </div>
      }
      footer={null}
      width={1000}
      centered
      className="report-pdf-modal"
      styles={{ body: { padding: 0, height: '80vh', overflow: 'hidden' } }}
      destroyOnClose
    >
      <div className="w-full h-full bg-stone-100 flex items-center justify-center relative">
        {isLoading && (
          <div className="flex flex-col items-center gap-3">
            <Spin size="large" className="text-indigo-600" />
            <p className="text-gray-500 font-medium animate-pulse">
              Generando vista previa del reporte...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm text-center max-w-md">
            <p className="text-red-500 font-bold mb-2">Error al cargar el PDF</p>
            <p className="text-gray-500 text-sm">
              No se pudo obtener el reporte solicitado. Por favor, intenta de nuevo más tarde o
              contacta a soporte.
            </p>
          </div>
        )}

        {pdfUrl && !isLoading && (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            title={`Reporte ${reportName}`}
            className="w-full h-full border-none shadow-inner"
          />
        )}
      </div>
    </Modal>
  );
}

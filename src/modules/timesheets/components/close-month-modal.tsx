import dayjs from 'dayjs';
import { Modal, Button, Alert, Spin } from 'antd';
import { LuRotateCcw, LuUpload, LuCircleCheck } from 'react-icons/lu';
import { useCloseMonthSignature } from '../hooks/use-close-month-signature';
import { useGetMonthlySummary } from '@/modules/reports/hooks/use-get-monthly-summary';
import { useCreateReport } from '@/modules/reports/hooks/use-create-report';
import type { ICloseMonthModalProps } from './close-month.interface';

export function CloseMonthModal({
  isModalOpen,
  handleCloseModal,
  totalLocalDays,
  totalLocalHours,
}: ICloseMonthModalProps) {
  const currentMonth = dayjs().format('MM');
  const currentYear = dayjs().format('YYYY');

  const { data: monthlySummaryData, isLoading: isSummaryLoading } = useGetMonthlySummary(
    currentMonth,
    currentYear,
  );

  const { mutate: createReport, isPending: isCreatingReport } = useCreateReport();

  const {
    signatureCanvasRef,
    isSignatureCanvasEmpty,
    handleStartDrawingSignature,
    handleStopDrawingSignature,
    handleDrawingStream,
    handleClearSignatureCanvas,
  } = useCloseMonthSignature(isModalOpen);

  const handleConfirmCloseMonth = () => {
    const signatureCanvas = signatureCanvasRef.current;
    if (!signatureCanvas) return;

    createReport(
      {
        month: Number(currentMonth),
        year: Number(currentYear),
      },
      {
        onSuccess: () => {
          handleCloseModal();
          handleClearSignatureCanvas();
        },
      },
    );
  };

  // Usamos los datos del backend por prioridad, si no existen, usamos los locales
  const totalMonthRegisteredDays = monthlySummaryData?.uniqueDays ?? totalLocalDays;
  const totalMonthWorkedHours = monthlySummaryData?.totalHours ?? totalLocalHours;
  const totalMonthAmountInUsdt = monthlySummaryData?.totalAmount ?? 0;

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCloseModal}
      title={<span className="text-lg font-bold text-gray-800">Cerrar mes y generar reporte</span>}
      footer={null}
      width={540}
      className="close-month-modal"
      centered
    >
      <div className="flex flex-col gap-5 py-2">
        {isSummaryLoading ? (
          <div className="py-20 flex justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <p className="text-indigo-400 text-sm font-medium uppercase tracking-wider">
                  Resumen del mes
                </p>
                <div className="flex gap-12 mt-4">
                  <div>
                    <p className="text-indigo-400/80 text-xs mb-1">Total de días registrados</p>
                    <p className="text-3xl font-bold text-gray-800">{totalMonthRegisteredDays}</p>
                  </div>
                  <div>
                    <p className="text-indigo-400/80 text-xs mb-1">Total de horas</p>
                    <p className="text-3xl font-bold text-indigo-400">{totalMonthWorkedHours}h</p>
                  </div>
                  {totalMonthAmountInUsdt > 0 && (
                    <div>
                      <p className="text-indigo-400/80 text-xs mb-1">Monto estimado</p>
                      <p className="text-3xl font-bold text-emerald-600">
                        {totalMonthAmountInUsdt} USDT
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-800">Firma digital requerida</h3>
                <p className="text-gray-500 text-sm">
                  Para cerrar el mes y generar el reporte, debes firmar digitalmente
                </p>
              </div>

              <div className="relative group">
                <canvas
                  ref={signatureCanvasRef}
                  width={500}
                  height={192}
                  className="w-full h-48 bg-white border-2 border-dashed border-gray-200 rounded-2xl cursor-crosshair transition-colors group-hover:border-indigo-200 touch-none"
                  onMouseDown={handleStartDrawingSignature}
                  onMouseUp={handleStopDrawingSignature}
                  onMouseMove={handleDrawingStream}
                  onMouseLeave={handleStopDrawingSignature}
                  onTouchStart={handleStartDrawingSignature}
                  onTouchEnd={handleStopDrawingSignature}
                  onTouchMove={handleDrawingStream}
                />
                <button
                  type="button"
                  onClick={handleClearSignatureCanvas}
                  className="mt-2 flex items-center gap-2 text-gray-500 text-sm hover:text-indigo-600 transition-colors mx-auto"
                >
                  <LuRotateCcw size={14} />
                  <span>Limpiar</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute w-full h-px bg-gray-100"></div>
              <span className="relative bg-white px-4 text-gray-400 text-xs italic">o</span>
            </div>

            <Button
              block
              size="large"
              icon={<LuUpload />}
              className="rounded-xl border-gray-200 text-gray-600 font-medium hover:text-indigo-600! hover:border-indigo-500!"
            >
              Cargar imagen de firma
            </Button>

            <Alert
              message={
                <p className="text-orange-400 text-sm">
                  Al cerrar el mes, se generará un reporte automático que será enviado para
                  aprobación.
                  <span className="font-bold block mt-1">
                    No podrás agregar más registros a este mes después de cerrarlo.
                  </span>
                </p>
              }
              type="warning"
              className="rounded-xl bg-orange-50 border-orange-100"
            />

            <div className="flex gap-4 mt-2">
              <Button
                onClick={handleCloseModal}
                block
                size="large"
                className="rounded-xl font-semibold border-gray-200 text-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                block
                size="large"
                icon={<LuCircleCheck />}
                disabled={isSignatureCanvasEmpty}
                loading={isCreatingReport}
                onClick={handleConfirmCloseMonth}
                className="rounded-xl font-semibold"
              >
                Firmar y cerrar mes
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

import { useState, type ReactNode } from 'react';
import { Button } from 'antd';
import { LuCloudUpload, LuFileText, LuTrash2 } from 'react-icons/lu';
import { MdOutlinePictureAsPdf, MdCalendarMonth } from 'react-icons/md';
import type { IOldPdfReport, IMonthlyReport } from './reports.interface';
import { MonthlyReportsList } from './monthly-reports-list';

type ReportsTab = 'monthly' | 'old';

interface IOldReportsSectionProps {
  uploadedPdfReports: IOldPdfReport[];
  monthlyReportsData?: IMonthlyReport[];
}

const TABS: { value: ReportsTab; label: string; icon: ReactNode }[] = [
  { value: 'monthly', label: 'Reportes mensuales', icon: <MdCalendarMonth size={16} /> },
  { value: 'old', label: 'Reportes antiguos', icon: <MdOutlinePictureAsPdf size={16} /> },
];

export function OldReportsSection({
  uploadedPdfReports,
  monthlyReportsData,
}: IOldReportsSectionProps) {
  const [activeTab, setActiveTab] = useState<ReportsTab>('monthly');
  const showTabs = monthlyReportsData !== undefined;

  const oldReportsContent = (
    <>
      <div className="w-full h-44 bg-stone-50/50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/20 transition-all group mb-8">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
          <LuCloudUpload size={24} />
        </div>
        <div className="text-center">
          <p className="text-gray-700 font-bold text-sm">Haz clic o arrastra un archivo PDF aquí</p>
          <p className="text-gray-400 text-xs mt-1">
            Sube reportes antiguos en formato PDF (máximo 10MB)
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">
          PDFs subidos
        </h3>

        <div className="flex flex-col gap-3">
          {uploadedPdfReports.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-gray-100 rounded-2xl">
              <p className="text-gray-400 text-sm italic">No hay reportes antiguos subidos</p>
            </div>
          ) : (
            uploadedPdfReports.map((pdfItem) => (
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
                    {pdfItem.referenceMonth} · Subido el {pdfItem.uploadedAtDate}
                  </p>
                </div>

                <Button
                  type="text"
                  danger
                  icon={<LuTrash2 size={18} />}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );

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

      <div className="flex gap-0 border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.value
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'monthly' && <MonthlyReportsList monthlyReportsData={monthlyReportsData} />}
      {activeTab === 'old' && oldReportsContent}
    </div>
  );
}

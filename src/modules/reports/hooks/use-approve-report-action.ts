import { useCallback } from 'react';
import { Modal } from 'antd';
import { useAdminSignature } from '@/hooks';
import { dataUrlToFile } from '@/tools';
import { approveReportSchema, APPROVE_REPORT_SIGNATURE_REQUIRED } from '../components/validations';
import { useApproveReport } from './use-approve-report';

export function useApproveReportAction() {
  const { approveReport, isApprovingReport } = useApproveReport();
  const { adminSignatureDataUrl } = useAdminSignature();

  const handleApprove = useCallback(
    (reportId: string) => {
      if (!adminSignatureDataUrl || !approveReportSchema.isValidSync({ adminSignatureDataUrl })) {
        Modal.warning({
          title: 'Firma de aprobación requerida',
          content: APPROVE_REPORT_SIGNATURE_REQUIRED,
        });
        return;
      }

      const file = dataUrlToFile(adminSignatureDataUrl, 'admin-signature.png');
      approveReport({ reportId, file });
    },
    [adminSignatureDataUrl, approveReport],
  );

  return { handleApprove, isApprovingReport };
}

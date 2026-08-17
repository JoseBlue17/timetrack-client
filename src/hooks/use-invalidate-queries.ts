import { useQueryClient } from '@tanstack/react-query';
import {
  MONTHLY_SUMMARY_QUERY_KEY,
  OLD_REPORTS_QUERY_KEY,
  PAYMENTS_QUERY_KEY,
  PROJECTS_QUERY_KEY,
  REPORT_PDF_QUERY_KEY,
  REPORTS_LIST_QUERY_KEY,
  TIMESHEETS_QUERY_KEY,
  USER_PROFILE_QUERY_KEY,
  WALLETS_QUERY_KEY,
} from '@/query-keys';

export function useInvalidateTimesheets() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: TIMESHEETS_QUERY_KEY });
}

export function useInvalidatePayments() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
}

export function useInvalidateProjects() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
}

export function useInvalidateWallets() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: WALLETS_QUERY_KEY });
}

export function useInvalidateMonthlyReports() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: REPORTS_LIST_QUERY_KEY });
}

export function useInvalidateMonthlySummary() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: MONTHLY_SUMMARY_QUERY_KEY });
}

export function useInvalidateReportPdf() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: REPORT_PDF_QUERY_KEY });
}

export function useInvalidateUserProfile() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
}

export function useInvalidateOldReports() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: OLD_REPORTS_QUERY_KEY });
}

import { useState } from 'react';
import { useGetPayments } from './use-get-payments';
import { useDeletePayment } from './use-delete-payment';
import { useVerifyPayment } from './use-verify-payment';
import { useScrollLoadMore } from '@/hooks/use-scroll-load-more';
import type { IPayment } from '@/interfaces';
import { PaymentStatus } from '@/enums';

export function usePaymentsTable() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const {
    payments,
    isLoading,
    isError,
    error,
    invalidatePayments,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetPayments({
    status: statusFilter || undefined,
    excludeStatus: statusFilter ? undefined : PaymentStatus.Completed,
  });

  useScrollLoadMore({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const { mutate: deletePayment, isPending: isDeleting } = useDeletePayment();
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  const openDetail = (payment: IPayment) => {
    setSelectedPayment(payment);
    setDetailOpen(true);
  };

  const closeDetail = () => setDetailOpen(false);

  return {
    statusFilter,
    setStatusFilter,
    payments,
    isLoading,
    isError,
    error,
    invalidatePayments,
    deletePayment,
    isDeleting,
    verifyPayment,
    isVerifying,
    selectedPayment,
    detailOpen,
    openDetail,
    closeDetail,
  };
}

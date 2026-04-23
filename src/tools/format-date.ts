import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export const formatDate = (date: string | Date, format = 'DD/MM/YYYY'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

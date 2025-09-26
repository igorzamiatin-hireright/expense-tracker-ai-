import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM dd, yyyy');
};

export const formatDateInput = (dateString: string): string => {
  return format(parseISO(dateString), 'yyyy-MM-dd');
};

export const getCurrentMonth = () => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now)
  };
};

export const isDateInCurrentMonth = (dateString: string): boolean => {
  const date = parseISO(dateString);
  const { start, end } = getCurrentMonth();
  return isWithinInterval(date, { start, end });
};

export const isDateInRange = (
  dateString: string,
  startDate?: string,
  endDate?: string
): boolean => {
  if (!startDate && !endDate) return true;

  const date = parseISO(dateString);

  if (startDate && endDate) {
    return isWithinInterval(date, {
      start: parseISO(startDate),
      end: parseISO(endDate)
    });
  }

  if (startDate) {
    return date >= parseISO(startDate);
  }

  if (endDate) {
    return date <= parseISO(endDate);
  }

  return true;
};
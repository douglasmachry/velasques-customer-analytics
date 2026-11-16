import { useQuery } from '@tanstack/react-query';
import { loadAnalyticsData } from './data-source';

export function useAnalyticsData() {
  return useQuery({
    queryKey: ['analytics-data'],
    queryFn: loadAnalyticsData,
  });
}

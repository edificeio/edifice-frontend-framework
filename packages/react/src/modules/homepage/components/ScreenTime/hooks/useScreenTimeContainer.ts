import { useState } from 'react';
import { useEdificeClient } from '../../../../../providers/EdificeClientProvider/EdificeClientProvider.hook';
import { useDailyScreenTime } from '../services/queries/screenTime';
import { ScreenTimeKid, ScreenTimeStatus } from '../types';
import { addDays, getScreenTimeStatus, getToday, sumMinutes } from '../utils';
import { useScreenTimeKids } from './useScreenTimeKids';

export interface UseScreenTimeContainerReturn {
  kids: ScreenTimeKid[];
  selectedKid?: ScreenTimeKid;
  onKidChange: (kidId: string) => void;
  todayMinutes: number;
  yesterdayMinutes: number;
  status: ScreenTimeStatus;
}

/**
 * Custom hook that provides today's and yesterday's total screen time of the
 * selected kid.
 */
export const useScreenTimeContainer = (): UseScreenTimeContainerReturn => {
  const kids = useScreenTimeKids();
  const { sessionQuery } = useEdificeClient();
  const [selectedKidId, setSelectedKidId] = useState<string>();

  const selectedKid = kids.find((kid) => kid.id === selectedKidId) ?? kids[0];

  const today = getToday();
  const yesterday = addDays(today, -1);
  const todayQuery = useDailyScreenTime(selectedKid?.id, today);
  const yesterdayQuery = useDailyScreenTime(selectedKid?.id, yesterday);

  let status = getScreenTimeStatus([todayQuery, yesterdayQuery]);
  if (!selectedKid) status = sessionQuery.isError ? 'error' : 'loading';

  return {
    kids,
    selectedKid,
    onKidChange: setSelectedKidId,
    todayMinutes: sumMinutes(todayQuery.data ?? []),
    yesterdayMinutes: sumMinutes(yesterdayQuery.data ?? []),
    status,
  };
};

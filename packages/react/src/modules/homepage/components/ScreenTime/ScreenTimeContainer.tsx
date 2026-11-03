import { useScreenTimeContainer } from './hooks/useScreenTimeContainer';
import { useScreenTimeModal } from './hooks/useScreenTimeModal';
import { ScreenTime } from './ScreenTime';
import { ScreenTimeModal } from './ScreenTimeModal';

export function ScreenTimeContainer() {
  const {
    kids,
    selectedKid,
    onKidChange,
    todayMinutes,
    yesterdayMinutes,
    status,
  } = useScreenTimeContainer();

  const { open: openModal, ...modal } = useScreenTimeModal();

  return (
    <>
      <ScreenTime
        status={status}
        kids={kids}
        selectedKidId={selectedKid?.id}
        onKidChange={onKidChange}
        todayMinutes={todayMinutes}
        yesterdayMinutes={yesterdayMinutes}
        onFullScreenClick={() => openModal(selectedKid?.id)}
      />
      <ScreenTimeModal {...modal} />
    </>
  );
}

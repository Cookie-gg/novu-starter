"use client";

import {
  PopoverNotificationCenter,
  NotificationBell,
  NovuProvider,
} from "@novu/notification-center";

interface Props {
  subscriberId: string;
}

export const NotificationCenter: React.FC<Props> = ({ subscriberId }) => {
  return (
    <NovuProvider
      subscriberId={subscriberId}
      applicationIdentifier={`${process.env.NEXT_PUBLIC_NOVU_APP_INDENTIFIER}`}
      initialFetchingStrategy={{
        fetchNotifications: true,
        fetchUserPreferences: true,
      }}
    >
      <PopoverNotificationCenter colorScheme="dark">
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
};

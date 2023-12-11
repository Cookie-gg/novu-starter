"use client";

import { PropsWithChildren, useCallback, useState } from "react";
import styles from "~/styles/components/SubscribeButton.module.css";
import { Loader } from "../Loader";
import { toast } from "sonner";

interface Props extends PropsWithChildren {
  action?: () => Promise<void>;
  message?: {
    success: string;
    error: string;
  };
  pending?: boolean;
}

export const Button = ({ children, message, pending, action }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = useCallback(async () => {
    setIsLoading(true);
    try {
      action && (await action());
      message && toast.success(message.success);
    } catch (error) {
      console.error(error);
      message && toast.error(message.error);
    } finally {
      setIsLoading(false);
    }
  }, [action, message]);

  return (
    <button
      className={styles._}
      onClick={action ? onClick : undefined}
      type={action ? "button" : "submit"}
      disabled={pending || isLoading}
    >
      {(pending || isLoading) && <Loader />}
      <span>{children}</span>
    </button>
  );
};

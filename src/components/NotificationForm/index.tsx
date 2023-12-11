"use client";

import { action } from "./action";
import { Button } from "~/components/Button";
import styles from "~/styles/components/NotificationForm.module.css";

import { toast } from "sonner";
import { useCallback, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

const SubmitButton = () => {
  const status = useFormStatus();

  return <Button pending={status.pending}>Send</Button>;
};

export const NotificationForm = () => {
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(action, { message: null });
  const dispatch = useCallback(
    async (formData: FormData) => {
      await formAction(formData);
      ref.current?.reset();
    },
    [formAction]
  );

  useEffect(() => {
    if (!state.message && !state.error) return;
    if (state.error) toast.error(state.error.message);
    else toast.success(state.message);
  }, [state]);

  return (
    <form className={styles._} ref={ref} action={dispatch}>
      <label htmlFor="title">
        <span className={styles.text}>Title</span>
        <input name="title" type="text" required />
      </label>
      <label htmlFor="body">
        <span className={styles.text}>Body</span>
        <textarea name="body" required />
      </label>
      <SubmitButton />
    </form>
  );
};

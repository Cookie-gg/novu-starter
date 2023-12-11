"use server";

import { NovuApi } from "~/libs/novu";
import { string, object, parse } from "valibot";

const schema = object({ title: string(), body: string() });

export interface FormState {
  message: string | null;
  error?: Error;
}

export const action = async (
  _: FormState,
  formData: FormData
): Promise<FormState> => {
  try {
    const payload = parse(schema, {
      title: formData.get("title"),
      body: formData.get("body"),
    });

    const novuApi = new NovuApi();
    await novuApi.triggerEvent(payload);

    return {
      message: "Notification sent successfully",
    };
  } catch (error) {
    return {
      message: "Failed to send notification",
      error: error instanceof Error ? error : undefined,
    };
  }
};

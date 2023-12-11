import { NovuApi } from "~/libs/novu";
import { Button } from "../Button";

export const UnsubscribeButton: React.FC = () => {
  const action = async () => {
    "use server";

    const novuApi = new NovuApi();
    await novuApi.deleteSubscriber();
  };

  return (
    <Button
      action={action}
      message={{
        success: "Unsubscribed successfully",
        error: "Failed to unsubscribe",
      }}
    >
      Unsubscribe
    </Button>
  );
};

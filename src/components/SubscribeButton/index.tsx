import { NovuApi } from "~/libs/novu";
import { Button } from "../Button";

export const SubscribeButton: React.FC = () => {
  const action = async () => {
    "use server";

    const novuApi = new NovuApi();
    await novuApi.createSubscriber();
  };

  return (
    <Button
      action={action}
      message={{
        success: "Subscribed successfully",
        error: "Failed to subscribe",
      }}
    >
      Subscribe
    </Button>
  );
};

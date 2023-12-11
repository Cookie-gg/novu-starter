import crypto from "crypto";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export class NovuApi {
  BASE_URL = "https://api.novu.co/v1";
  REVALIDATE_TAG = "v1/subscribers/:id";

  private async httpClient(endpoint: string, options: RequestInit) {
    return fetch(`${this.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${process.env.NOVU_API_KEY}`,
        ...options.headers,
      },
    });
  }

  private createSubscriberId() {
    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const N = 16;
    return Array.from(crypto.randomFillSync(new Uint8Array(N)))
      .map((n) => S[n % S.length])
      .join("");
  }

  private subscriberId = {
    name: "subscriber_id",
    get: () => cookies().get(this.subscriberId.name)?.value,
    set: (subscriberId: string) =>
      cookies().set(this.subscriberId.name, subscriberId, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      }),
    delete: () => cookies().delete(this.subscriberId.name),
  };

  async verifySubscriber() {
    const subscriberId = this.subscriberId.get();
    if (!subscriberId) return false;

    try {
      const { status } = await this.httpClient(`/subscribers/${subscriberId}`, {
        method: "GET",
        next: { tags: [this.REVALIDATE_TAG] },
      });

      return status === 200 && subscriberId;
    } catch {
      return false;
    }
  }

  async createSubscriber() {
    this.subscriberId.delete();
    const subscriberId = this.createSubscriberId();

    await this.httpClient("/subscribers", {
      method: "POST",
      body: JSON.stringify({ subscriberId }),
    });

    await this.httpClient(`/topics/${process.env.NOVU_TOPIC_KEY}/subscribers`, {
      method: "POST",
      body: JSON.stringify({ subscribers: [subscriberId] }),
    });

    this.subscriberId.set(subscriberId);
    revalidateTag(this.REVALIDATE_TAG);
  }

  async deleteSubscriber() {
    const subscriberId = this.subscriberId.get();

    await this.httpClient(
      `/topics/${process.env.NOVU_TOPIC_KEY}/subscribers/removal`,
      {
        method: "POST",
        body: JSON.stringify({
          subscribers: [subscriberId],
        }),
      }
    );
    await this.httpClient(`/subscribers/${subscriberId}`, { method: "DELETE" });

    this.subscriberId.delete();
    revalidateTag(this.REVALIDATE_TAG);
  }

  async triggerEvent(body: { title: string; body: string }) {
    await this.httpClient(`/events/trigger`, {
      method: "POST",
      body: JSON.stringify({
        name: process.env.WORKFLOW_IDENTIFIER,
        to: [{ type: "Topic", topicKey: process.env.NOVU_TOPIC_KEY }],
        payload: body,
      }),
    });
  }
}

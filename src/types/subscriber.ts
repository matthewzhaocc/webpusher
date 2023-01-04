export interface ISubscriber {
  owner: string;
  subscriberId: string;
  config: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}

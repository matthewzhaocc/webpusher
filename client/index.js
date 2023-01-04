/** Begin Setup Webpusher  */
navigator.serviceWorker.register("sw.js");
(async () => {
  const reg = await navigator.serviceWorker.ready;
  const subscription = await reg.pushManager.getSubscription();
  if (subscription) {
    subscription.unsubscribe();
  }
  let serverKey = await fetch(
    "http://localhost:3000/subscribe/2206d1e0-5334-4edb-a95c-f6f8fe0dfbd6/.well-known/vapid-pubkey.json"
  );
  const body = await serverKey.json();
  const sub = await reg.pushManager.subscribe({
    applicationServerKey: body.pubKey,
    userVisibleOnly: true,
  });

  await fetch(
    "http://localhost:3000/subscribe/2206d1e0-5334-4edb-a95c-f6f8fe0dfbd6",
    {
      method: "PUT",
      body: JSON.stringify(sub),
      json: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
})();

/** End Setup Webpusher */

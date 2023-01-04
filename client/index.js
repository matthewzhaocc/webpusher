navigator.serviceWorker.register("service-worker.js");

navigator.serviceWorker.ready.then((reg) => {
  console.log("ready");
  reg.pushManager.getSubscription().then((sub) => {
    if (!sub) {
      reg.pushManager
        .subscribe({
          applicationServerKey:
            "BGEjh3nm5IXqLStBwtI3AtXkd8jX0G9Xjf4BxXnpZUPj7cESz0IXdbne2DRPVU2_0GYn2qXRtDEJ2oq3gO6Q60E",
          userVisibleOnly: true,
        })
        .then((sub) => {
          fetch(
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
        });
      return;
    }
    sub.unsubscribe().then(
      reg.pushManager
        .subscribe({
          applicationServerKey:
            "BGEjh3nm5IXqLStBwtI3AtXkd8jX0G9Xjf4BxXnpZUPj7cESz0IXdbne2DRPVU2_0GYn2qXRtDEJ2oq3gO6Q60E",
          userVisibleOnly: true,
        })
        .then((sub) => {
          fetch(
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
        })
    );
  });
});

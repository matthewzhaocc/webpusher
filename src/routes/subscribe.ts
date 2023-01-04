import express from "express";
import redis from "../db/cache";
import tenantProvider from "../provider/tenantProvider";
import validate from "../middleware/validate";
import { subscribeSchema } from "../validate/subscribe";
import subscriberProvider from "../provider/subscriberProvider";
import corsAllowAll from "../middleware/cors";
import authProvider from "../provider/authProvider";

const getSubscribeRouter = () => {
  const router = express.Router();

  router.get("/:tenantId/.well-known/vapid-pubkey.json", async (req, res) => {
    const pubKey = await redis.get(req.params.tenantId);
    if (pubKey) {
      res.send({ pubKey });
      return;
    }

    const tenant = await tenantProvider.getByIdentifier(req.params.tenantId);
    if (tenant) {
      await redis.set(req.params.tenantId, tenant.pubKey);
      res.send({ pubKey: tenant.pubKey });
      return;
    }

    res.status(404).send();
    return;
  });

  router.options("/:tenantId", corsAllowAll);
  router.put(
    "/:tenantId",
    corsAllowAll,
    validate(subscribeSchema),
    async (req, res) => {
      const config = req.body;
      const identifier = req.params.tenantId;

      const subscriberIdentifier = await subscriberProvider.subscribe(
        identifier,
        config
      );
      res.send(subscriberIdentifier);
    }
  );

  router.get(
    "/",
    authProvider.authenticateRequest.bind(authProvider),
    async (req, res) => {
      const sub = req.token?.sub as string;
      const tenant = await tenantProvider.getByOwner(sub);
      const subscribers = await subscriberProvider.listSubscriberByIdentifier(
        tenant?.identifier
      );
      res.send({ subscribers });
    }
  );

  return router;
};
export default getSubscribeRouter;

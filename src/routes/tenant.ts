import express from "express";
import authProvider from "../provider/authProvider";
import tenantProvider from "../provider/tenantProvider";

const getTenantRouter = () => {
  const router = express.Router();

  router.post(
    "/",
    authProvider.authenticateRequest.bind(authProvider),
    async (req, res) => {
      const identifier = await tenantProvider.create(req.token?.sub as string);
      res.send({ owner: identifier });
    }
  );

  return router;
};

export default getTenantRouter;

import express from "express";
import serviceWorker from "./serviceWorker";
import corsAllowAll from "../middleware/cors";

const getStaticRouter = () => {
  const router = express.Router();

  router.options("/serviceWorker.js", corsAllowAll);
  router.get("/serviceWorker.js", corsAllowAll, (_, res) => {
    res.send(serviceWorker);
  });

  return router;
};

export default getStaticRouter;

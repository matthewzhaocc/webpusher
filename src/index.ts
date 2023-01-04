import express from "express";
import dotenv from "dotenv";

dotenv.config();

import authProvider from "./provider/authProvider";
import client from "./db/connection";
import getTenantRouter from "./routes/tenant";
import getSubscribeRouter from "./routes/subscribe";
import getStaticRouter from "./static/static";

const app = express();

app.use(express.json());

app.use("/api/v1/tenant", getTenantRouter());
app.use("/subscribe", getSubscribeRouter());
app.use("/static", getStaticRouter());

process.on("SIGTERM", () => {
  client.close().then(() => {
    console.log("MongoDB Client closed successfully.");
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Application started, listening on port ${process.env.PORT || 3000}`
  );
});

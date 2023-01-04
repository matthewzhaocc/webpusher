import express from "express";
import cors from "cors";

const corsAllowAll = cors({
  origin: "*",
});

export default corsAllowAll;

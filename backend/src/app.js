const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");
const { getCaseStatus } = require("./controllers/caseStatusController");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "Backend is running",
    mode: env.uscisMode,
  });
});

app.post("/api/case-status", getCaseStatus);

module.exports = app;

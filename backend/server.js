const app = require("./src/app");
const { env } = require("./src/config/env");

const rawPort = process.env.PORT;
const parsedPort = Number(rawPort);
const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 4000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend server running on port ${port}`);
  console.log(`USCIS mode: ${env.uscisMode}`);
});

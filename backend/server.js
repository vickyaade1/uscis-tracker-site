const app = require("./src/app");
const { env } = require("./src/config/env");

app.listen(env.port, () => {
  console.log(`Backend server running on http://localhost:${env.port}`);
  console.log(`USCIS mode: ${env.uscisMode}`);
});

const express = require("express");
const bodyParser = require("body-parser");
const authRoute = require("./routers/user.router");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to EMS" });
});

app.use("/api/v1", authRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

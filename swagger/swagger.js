const swaggerJsdoc = require("swagger-jsdoc");
const dotenv = require("dotenv");
dotenv.config();
const exampleRouter = require("./path/to/your/router/file");

app.use("/api", exampleRouter);
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zyra",
      version: "1.0.0",
      description: "The ZYRA API description",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  apis: ["./routes/zyra/*.js"], // Ensure this path is correct
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

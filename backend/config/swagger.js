import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.1.1",
    info: {
      title: "Todos API",
      version: "1.0.0",
      description: "API documentation for the Todos application",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  console.log("swagger docs available at /api-docs");
};

export default swaggerDocs;

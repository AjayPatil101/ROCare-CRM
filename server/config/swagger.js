import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RO Service Management API",
      version: "1.0.0",
      description:
        "REST API for managing RO purifier customers, services, payments, reminders and admin operations.",
    },
    servers: [{ url: "/api", description: "Base API path" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js", "./docs/*.yaml"],
};

export const swaggerSpec = swaggerJsdoc(options);

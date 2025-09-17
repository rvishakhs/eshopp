
const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title : "Auth Service API",
        description : "API documentation for Auth Service"
    },
    host: "localhost:6000",
    schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ["./routes/auth.router.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
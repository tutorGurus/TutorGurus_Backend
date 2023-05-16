const swaggerAutogen  = require('swagger-autogen')();

const doc = {
    info : {
        title : 'Meta API',
        description : "TutorGurus API Documentation"
    },
    host : 'https://tutorgurus-backend.onrender.com',
    schemes : ['http', 'https'],
    securityDefinitions : {
        JwtToken : {
            type : 'apiKey',
            in : 'headers',
            name : 'authorization',
            description : '加上 JWT token'
        }
    }
}

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
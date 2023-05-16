const swaggerAutogen  = require('swagger-autogen')();

const doc = {
    info : {
        title : 'Meta API',
        description : "TutorGurus API Documentation"
    },
    host : 'localhost:8000',
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
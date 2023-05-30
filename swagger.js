const swaggerAutogen  = require('swagger-autogen')({autoQuery: false});

const doc = {
    info : {
        title : 'Meta API',
        description : "TutorGurus API Documentation"
    },
    host : 'localhost:3000',
    schemes : ['http', 'https'],
    securityDefinitions : {
        JwtToken : {
            type : 'apiKey',
            in : 'headers',
            name : 'authorization',
            description : '加上 JWT token',
            required : true
        }
    }
}

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });
const doc = {
    info: {
        title: 'API',
        description: 'API documentation'
    },
    host: 'localhost:3001',
    tags: [
        {
            "name": "Utenti",
            "description": "Tutte le api per la gestione Utenti"
        },
        {
            "name": "Maghi",
            "description": "Api per la gestione delle informazioni sui maghi"
        },
        {
            "name": "Scambi",
            "description": "Api per la gestione degli scambi"
        },
        {
            "name": "Pacchetti",
            "description": "Api per la gestione dei pacchetti di figurine"
        },
        {
            "name": "Carte",
            "description": "Api per la gestione delle carte"
        }
    ],

    components: {
        schemas: {

            userSchema: {
                $name: 'Mario',
                $password: 'password',
                $email: 'MarioRossi@unimi.it',
                $username: "SuperMario",
                $fav_magician: 1009368,
                $sticker_album: { 1009368: 1, 1009610: 2 },
                $credits: 0
            },
            userReg: {
                $name: 'Mario',
                $username: 'SuperMario',
                $password: 'password',
                $email: 'MarioRossi@gmail.com',
                $fav_magician: 1009368
            },
            userLogin: {
                $email: 'MarioRossi@gmail.com',
                $password: 'password'
            },
            usernameSchema:{
                $username: 'SuperMario'
            },
            userPasswordSchema:{
                $password: 'password'
            },
            emailSchema:{
                $email: 'MarioRossi@gmail.com'
            },
            creditsSchema: {
                $credits: 0
            },
            favouriteHeroSchema: {
                $fav_magician: 1009368
            },
            boosterSchema: {
                $boosterName: 'Booster',
                $price: 8,
                $cardNumber: 4
            },
            scambioSchema: {
                $carteRichieste: [1009368, 1009610],
                $carteOfferte: [1009368, 1009610],
            },
        },
        securitySchemes: {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'query',
                name: 'apikey'
            }
        }
    },
    servers: [
        {
            url: 'http://localhost:3001/',
            description: 'Development server',
        },
    ],

    security: [{
        ApiKeyAuth: []
    }]
}

const outputFile = './swagger-output.json';
const routes = ['./index.js'];

swaggerAutogen(outputFile, routes, doc);
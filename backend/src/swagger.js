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
                $fav_magician: "af95bd8a-dfae-45bb-bc69-533860d34129",
                $sticker_album: { "9e3f7ce4-b9a7-4244-b709-dae5c1f1d4a8": 1, "af95bd8a-dfae-45bb-bc69-533860d34129": 2 },
                $credits: 0
            },
            userReg: {
                $name: 'Mario',
                $username: 'SuperMario',
                $password: 'password',
                $email: 'MarioRossi@gmail.com',
                $fav_magician: "af95bd8a-dfae-45bb-bc69-533860d34129"
            },
            userLogin: {
                $email: 'MarioRossi@gmail.com',
                $password: 'password'
            },
            usernameSchema: {
                $username: 'SuperMario'
            },
            userPasswordSchema: {
                $password: 'password'
            },
            emailSchema: {
                $email: 'MarioRossi@gmail.com'
            },
            creditsSchema: {
                $credits: 0
            },
            favouriteHeroSchema: {
                $fav_magician: "af95bd8a-dfae-45bb-bc69-533860d34129"
            },
            boosterSchema: {
                $boosterName: 'Booster',
                $price: 8,
                $cardNumber: 4
            },
            scambioSchema: {
                $carteRichieste: ["9e3f7ce4-b9a7-4244-b709-dae5c1f1d4a8", "af95bd8a-dfae-45bb-bc69-533860d34129"]
                ,
                $carteOfferte: ["4c7e6819-a91a-45b2-a454-f931e4a7cce3", "c3b1f9a5-b87b-48bf-b00d-95b093ea6390"],
            },
            sameCardsScambiSchema: {
                $carte: ["9e3f7ce4-b9a7-4244-b709-dae5c1f1d4a8"]
            }
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
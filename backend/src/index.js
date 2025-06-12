MONGO_URI = process.env.MONGO_URI;

const express = require('express');
const app = express();
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const lib = require('./functions');

//Middleware
function auth(req, res, next) {
    const apikey = req.query.apikey
    if (apikey != "123456" || apikey == null) {
        res.status(401)
        return res.json({ error: "Invalid API key" })
    } else {
        next()
    }
}

app.use(express.json());
app.use(cors());

//uso il middleware

app.use(/\/((?!api-docs).)*/, auth);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/register', async (req, res) => {

    try {
        const result = await lib.registerUser(res, req.body);
        res.status(200).json(result);
    } catch (error) {
        lib.handleError(error, res)
    }

    /*
    #swagger.tags = ['Utenti']
    #swagger.description = "Registrazione di un nuovo utente"
    #swagger.requestBody = {
        required: false,
        content: {
        'application/json': {
            schema: {$ref: "#/components/schemas/userReg"}
            }
        }
    }

    */

})

app.get('/users', async (req, res) => {
    try {
        const result = await lib.getUsers(res);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*  
    #swagger.tags = ['Utenti']
    #swagger.description = "Restituisce tutti gli utenti presenti"
    #swagger.responses[200] = {
        description: 'Utenti trovati',
        content: {
            'application/json': {
                schema: {$ref: "#/components/schemas/userSchema"}                    
            }
        }
    }
    */
});

app.get('/users/:id', async (req, res) => {
    try {
        const result = await lib.getUserById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Utenti']
      #swagger.description = "Restituisce un utente in base all'id"
     */
});

app.post('/login', async (req, res) => {
    try {
        const result = await lib.logUser(req.body);
        res.status(200).json(result);
        console.log("user logged");
    } catch (err) {
        lib.handleError(err, res);
        console.log("user not logged");
    }
    /*
    #swagger.tags = ['Utenti']
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/userLogin" },
            }
        }
    }
*/
});

app.delete('/deleteUser/:id', async (req, res) => {
    try {
        const user = await lib.deleteUser(req.params.id);
        res.status(200).json(user);
        console.log("user deleted");
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Utenti']
      #swagger.description = "Elimina un utente in base all'id"
     */
});

app.put('/users/:id/updateUsername', async (req, res) => {
    try {
        const result = await lib.updateUsername(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /**
      #swagger.tags = ['Utenti']
      #swagger.requestBody = {
        required: true,
       content: {
           'application/json': {
                   schema: {$ref: "#/components/schemas/usernameSchema"}
              }
           }
        }
      #swagger.description = "Aggiorna il nome utente"
     */
});

app.put('/users/:id/updatePassword', async (req, res) => {
    try {
        await lib.updatePassword(req.params.id, req.body);
        res.status(200).json({ message: "Password updated correctly" });
    } catch (err) {
        lib.handleError(err, res);
    }
    /**
      #swagger.tags = ['Utenti']
      #swagger.requestBody = {
        required: true,
        schema: {$ref: "#/components/schemas/userPasswordSchema"}
        }
      #swagger.description = "Aggiorna la password"
     */
});

app.put('/users/:id/updateEmail', async (req, res) => {
    try {
        await lib.updateEmail(req.params.id, req.body);
        res.status(200).json({ message: "Email updated correctly" });
    } catch (err) {
        lib.handleError(err, res);
    }
    /**
      #swagger.tags = ['Utenti']
      #swagger.description = "Aggiorna l'email"
      #swagger.requestBody = {
        required: true,
       content: {
           'application/json': {
               schema: {$ref: "#/components/schemas/emailSchema"}
              }
           }
        }
     */
});

app.put('/users/:id/updateFavMagician', async (req, res) => {
    try {
        await lib.updateFavMagician(req.params.id, req.body.fav_hero);
        res.status(200).json({ message: "Magician updated correctly" });
    } catch (err) {
        lib.handleError(err, res);
    }
    /**
      #swagger.tags = ['Utenti']
      #swagger.description = "Aggiorna l'eroe preferito"
      #swagger.requestBody = {
        required: true,
       content: {
           'application/json': {
               schema: {$ref: "#/components/schemas/favouriteHeroSchema"}
              }
           }
        }
     */
})

app.put('/users/:id/updateCoins', async (req, res) => {
    try {
        const result = await lib.updateCoins(req.params.id, req.body.coins);
        res.status(200).json({ message: "Coins updated: " + result, coins: result });
    } catch (err) {
        lib.handleError(err, res);
    }
    /**
      #swagger.tags = ['Utenti']
      #swagger.description = "Aggiorna i crediti"
      #swagger.requestBody = {
        required: true,
       content: {
           'application/json': {
               schema: {$ref: "#/components/schemas/creditsSchema"}
              }
           }
        }
     */
});



//############pacchetti###############
app.get('/pacchetti', async (req, res) => {
    try {
        const result = await lib.getPacchetti(res);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Pacchetti']
      #swagger.description = "Restituisce tutti i pacchetti"
     */
})

app.get('/pacchetti/:idPacchetto', async (req, res) => {
    try {
        const result = await lib.getPacchettoById(req.params.idPacchetto);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Pacchetti']
      #swagger.description = "Restituisce un pacchetto in base al suo id "
     */
})

app.delete('/pacchetti/:idPacchetto', async (req, res) => {
    try {
        const result = await lib.deletePacchetto(req.params.idPacchetto);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Pacchetti']
      #swagger.description = "Elimina un pacchetto in base al suo id"
    */
})

app.post('/pacchetti/creaPacchetto', async (req, res) => {
    try {
        const result = await lib.creaPacchetto(req.body);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Pacchetti']
      #swagger.description = "Crea un pacchetto"
      #swagger.requestBody = {
        required: true,
       content: {
           'application/json': {
                schema: {
                    $ref: "#/components/schemas/boosterSchema"
                }
              }
           }
        }
     */
});

app.put('/pacchetti/compraPacchetto/:userId', async (req, res) => {
    try {
        const result = await lib.compraPacchetto(req.params.userId, req.body.boosterName);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Pacchetti']
      #swagger.description = "Compra un pacchetto e lo aggiunge ai pacchetti dell'utente"
      #swagger.requestBody = {
        required: true,
       content: {
            'application/json':{
                schema: {
                  $ref: "#/components/schemas/boosterNameSchema"
                }
             }
           }
        }
     */
})

app.get('/pacchettiUtente/:userId', async (req, res) => {
    try {
        const result = await lib.getPacchettiByUserId(req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Pacchetti']
      #swagger.description = "Restituisce i pacchetti posseduti da un utente"
     */
})

app.put('/apriPacchetto/:userId', async (req, res) => {
    try {
        const result = await lib.apriPacchetto(req.params.userId, req.body.boosterName);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Pacchetti']
      #swagger.description = "Apre un pacchetto dato il suo nome e l'id dell'utente a cui appartiene."
      #swagger.requestBody = {
        required: true,
       content: {
           'application/json':{
           schema:{
           $ref: "#/components/schemas/boosterNameSchema"
                }
              }
           }
        }
     */
})

app.put('/apriTuttiPacchetti/:userId', async (req, res) => {
    try {
        const result = await lib.apriPacchetti(req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Pacchetti']
      #swagger.description = "Apre tutti i pacchetti dell'utente"
     */
})

// ####################CARTE E SCAMBI########################
app.get('/carte/:userId/:pageNumber', async (req, res) => {
    try {
        const result = await lib.getUserCards(req.params.userId, req.params.pageNumber);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Carte']
      #swagger.description = "Restituisce tutte le carte di un utente dato l'id dell'utente e il numero di pagina"
     */
})

app.get('/cartaSingola/:cardId', async (req, res) => {
    try {
        const result = await lib.getCardById(req.params.cardId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Carte']
      #swagger.description = "Restituisce una carta specifica in base al suo id"
     */
})

app.put('/addCarta/:userId', async (req, res) => {
    try {
        const result = await lib.addCard(req.params.userId, req.body.cardId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Carte']
      #swagger.description = "Aggiunge una carta all'album di un utente"
      #swagger.requestBody = {
        required: true,
       content: {
            'application/json': {
                schema: {
                    $ref: "#/components/schemas/cardIdSchema"
                }
              }
           }
         }
        }
     */
})

app.get('/carta/:userId/:cardId', async (req, res) => {
    try {
        const result = await lib.getUserCardById(req.params.userId, req.params.cardId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Carte']
      #swagger.description = "Restituisce una carta in base al suo id e all'id dell'utente che la possiede"
     */
})

app.delete('/carte/:userId/:cardId', async (req, res) => {
    try {
        const result = await lib.removeCard(req.params.userId, req.params.cardId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Carte']
      #swagger.description = "Elimina una carta in base al suo id e all'id dell'utente che la possiede"
     */
})

app.put('/vendiCarta/:userId/:cardId', async (req, res) => {
    try {
        const result = await lib.sellCard(req.params.userId, req.params.cardId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Carte']
      #swagger.description = "Vende una carta in base al suo id e all'id dell'utente che la possiede"
     */
})

app.post('/scambi/:userId', async (req, res) => {
    try {
        const result = await lib.createScambio(req.params.userId, req.body);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Scambi']
      #swagger.description = "Permette ad un utente di creare uno scambio di carte"
      #swagger.requestBody = {
        required: true,
       content: {
            'application/json': {
                schema: {
                    $ref: "#/components/schemas/scambioSchema"
                }
              }
           }
        }
     */
})

app.get('/scambi', async (_, res) => {
    try {
        const result = await lib.getScambi();
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Scambi']
      #swagger.description = "Restituisce tutti gli scambi attivi"
     */
})

app.get('/scambi/:userId', async (req, res) => {
    try {
        const result = await lib.getScambiByUserId(req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Scambi']
      #swagger.description = "Restituisce gli scambi di un utente"
     */
})

app.get('/scambio/:scambioId', async (req, res) => {
    try {
        const result = await lib.getScambioById(req.params.scambioId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Scambi']
      #swagger.description = "Restituisce uno scambio in base all'id"
     */
})

app.put('/accettaScambio/:userId/:scambioId', async (req, res) => {
    try {
        const result = await lib.accettaScambio(req.params.userId, req.params.scambioId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Scambi']
      #swagger.description = "Permette di accettare uno scambio tra due utenti"
     */
})

app.delete('/scambi/:userId/:scambioId', async (req, res) => {
    try {
        const result = await lib.deleteScambio(req.params.scambioId, req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Scambi']
      #swagger.description = "Elimina uno scambio"
     */
})


// #HP API
app.get('/maghi', async (req, res) => {
    try {
        //  var result = await marvel.getFromMarvel('public/characters');
        //const result = await lib.getHeroes();
        const result = await lib.getAllMagicians();
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Maghi']
      #swagger.description = "Restituisce tutti i maghi"
     */
});


app.get('/randomMaghi/:numberOfMaghi', async (req, res) => {
    try {
        const result = await lib.getRandomCards(req.params.numberOfMaghi);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
    /*
      #swagger.tags = ['Maghi']
      #swagger.description = "Restituisce un numero casuale di maghi"
     */
})

app.listen(3001, () => {
    console.log('Server up and running, listening on port 3001');
})
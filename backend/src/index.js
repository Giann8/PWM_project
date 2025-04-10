MONGO_URI = process.env.MONGO_URI;

const express = require('express');
const app = express();
const cors = require('cors');
const lib = require('./functions');

const marvel = require('./marvel');


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
app.use(auth);

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/register', async (req, res) => {

    try {
        const result = await lib.registerUser(res, req.body);
        res.status(200).json(result);
    } catch (error) {
        lib.handleError(error, res)
    }

})

app.get('/users', async (req, res) => {
    try {
        const result = await lib.getUsers(res);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const result = await lib.getUserById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
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
});

app.delete('/deleteUser/:id', async (req, res) => {
    try {
        const user = await lib.deleteUser(req.params.id);
        res.status(200).json(user);
        console.log("user deleted");
    } catch (err) {
        lib.handleError(err, res);
    }
});

app.put('/users/:id/updateUsername', async (req, res) => {
    try {
        const result = await lib.updateUsername(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
});

app.put('/users/:id/updatePassword', async (req, res) => {
    try {
        await lib.updatePassword(req.params.id, req.body);
        res.status(200).json({ message: "Password updated correctly" });
    } catch (err) {
        lib.handleError(err, res);
    }
});

app.put('/users/:id/updateEmail', async (req, res) => {
    try {
        await lib.updateEmail(req.params.id, req.body);
        res.status(200).json({ message: "Email updated correctly" });
    } catch (err) {
        lib.handleError(err, res);
    }
});

app.put('/users/:id/updateFavHero', async (req, res) => {
    try {
        await lib.updateFavSuperhero(req.params.id, req.body.favhero);
        res.status(200).json({ message: "hero updated correctly" });
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.put('/users/:id/updateCoins', async (req, res) => {
    try {
        const result = await lib.updateCoins(req.params.id, req.body.coins);
        res.status(200).json({ message: "Coins updated: " + result, coins: result });
    } catch (err) {
        lib.handleError(err, res);
    }
});

app.put('/users/:id/buyBooster', async (req, res) => {
    try {
        const result = await lib.addPersonalBoosters(req.params.id, req.body.booster);
        res.status(200).json({ message: "Boosters updated: " + result });
    } catch (err) {
        lib.handleError(err, res);
    }
})


//pacchetti
app.get('/pacchetti', async (req, res) => {
    try {
        const result = await lib.getPacchetti(res);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.get('/pacchetti/:idPacchetto', async (req, res) => {
    try {
        const result = await lib.getPacchettoById(req.params.idPacchetto);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.delete('/pacchetti/:idPacchetto', async (req, res) => {
    try {
        const result = await lib.deletePacchetto(req.params.idPacchetto);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.post('/pacchetti/creaPacchetto', async (req, res) => {
    try {
        const result = await lib.creaPacchetto(req.body);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
});

app.put('/pacchetti/compraPacchetto/:userId', async (req, res) => {
    try {
        const result = await lib.compraPacchetto(req.params.userId, req.body.boosterName);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.get('/pacchettiUtente/:userId', async (req, res) => {
    try {
        const result = await lib.getPacchettiByUserId(req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.put('/apriPacchetto/:userId', async (req, res) => {
    try {
        const result = await lib.apriPacchetto(req.params.userId, req.body.boosterName);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})


// ####################CARTE E SCAMBI########################
app.get('/carte/:userId', async (req, res) => {
    try {
        const result = await lib.getUserCards(req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.get('/cartaSingola/:cardId', async (req, res) => {
    try {
        const result = await lib.getCardById(req.params.cardId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.put('/carte/:userId', async (req, res) => {
    try {
        const result = await lib.addCard(req.params.userId, req.body.cardName);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.post('/scambi/:userId', async (req, res) => {
    try {
        const result = await lib.createScambio(req.params.userId, req.body);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.get('/scambi', async (_, res) => {
    try {
        const result = await lib.getScambi();
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.get('/scambi/:userId', async (req, res) => {
    try {
        const result = await lib.getScambiByUserId(req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

app.delete('/scambi/:userId/:scambioId', async (req, res) => {
    try {
        const result = await lib.deleteScambio(req.params.scambioId, req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
})

// #MARVEL API
app.get('/heroes', async (req, res) => {
    try {
        //  var result = await marvel.getFromMarvel('public/characters');
        const result = await lib.getHeroes();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});


app.get('/randomHeroes/:numberOfHeroes', async (req, res) => {
    try {
        const result = await lib.getRandomHeroDB(req.params.numberOfHeroes);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
})

app.listen(3001, () => {
    console.log('Server up and running, listening on port 3001');
})
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
        res.status(200).json({ message: "Coins updated: " + result });
    } catch (err) {
        lib.handleError(err, res);
    }
});

//pacchetti
app.get('/pacchetti', (req, res) => {
    res.status(200).json({ message: "pacchetti" })
})

app.get('/pacchetti/:idPacchetto', (req, res) => {

})

app.post('/pacchetti/creapacchetto', async (req, res) => {
    try {
        const result = await lib.creaPacchetto(res, req.body);
        res.json(result);
    } catch (err) {
        lib.handleError(err, res);
    }
});

// #MARVEL API
app.get('/heroes', async (req, res) => {
    try {
        const result = await marvel.getFromMarvel('public/comics');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.listen(3001, () => {
    console.log('Server up and running, listening on port 3001');
})
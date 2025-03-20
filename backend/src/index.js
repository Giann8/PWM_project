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

app.post('/register', (req, res) => {
    try {

        lib.registerUser(res, req.body)
            .then(result => res.json(result))
            .catch(err => res.status(500).send("Errore: " + err.toString()))

    } catch (err) {
        res.status(500).json({ message: "Si è verificato un errore: ", error: err.toString() })
    }
})

app.get('/users', (req, res) => {
    lib.getUsers(res)
    //res.json({ message: "users" })
})

app.get('/users/:id', (req, res) => {
    lib.getUserById(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(500).send("Errore: " + err))
})



app.post('/login', (req, res) => {

    lib.logUser(req.body)
        .then(result => res.json(result))
        .then(() => console.log("user logged"))
        .catch(err => res.status(500).json({ message: "Si è verificato un errore: ", error: err.toString() }))
})

app.delete('/deleteUser/:id', (req, res) => {

    lib.deleteUser(req.params.id)
        .then((user) => res.status(200).json(user))
        .then(() => console.log("user deleted"))
        .catch(err => res.status(500).json({ message: "Si è verificato un errore: ", error: err.toString() }))

})

///UPDATE user info

app.put('/users/:id/updateUsername', (req, res) => {
    lib.updateUsername(req.params.id, req.body)
        .then(res => res.json(res))
        .catch(err => res.status(500).json({ message: "Si è verificato un errore: ", error: err.toString() }))

})


app.put('/users/:id/updatePassword', (req, res) => {

    lib.updatePassword(req.params.id, req.body)
        .then(() => { res.status(200).json({ message: "Password updated correctly" }) })
        .catch(err => res.status(500).json({ message: "Si è verificato un errore: ", error: err.toString() }))

});

app.put('/users/:id/updateEmail', (req, res) => {

    lib.updateEmail(req.params.id, req.body)
        .then(() => { res.status(200).json({ message: "Email updated correctly" }) })
        .catch(err => res.status(500).json({ message: "Si è verificato un errore: ", error: err.toString() }))
})



app.put('/users/:id/modifyCoins', (req, res) => {
    lib.updateCoins(req.params.id, req.body.coins)
        .then((result) => res.status(200).json({ message: "Coins updated:  " + result }))
        .catch(err => res.status(400).json({ message: "Si è verificato un errore: ", error: err.toString() }))
})

//pacchetti
app.get('/pacchetti', (req, res) => {

})

// #MARVEL API
app.get('/heroes', (req, res) => {
    marvel.getFromMarvel('public/characters')
        .then(result => res.json(result))
})

app.listen(3001, () => {
    console.log('Server up and running, listening on port 3001');
})
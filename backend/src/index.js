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
    lib.registerUser(res, req.body)
})

app.get('/users', (req, res) => {
    lib.getUsers(res)
    //res.json({ message: "users" })
})

app.post('/login',(req,res)=>{
    res.json({message: "login"})
})

app.delete('/deleteUser', (req, res) => {
    lib.deleteUser(res, req.body)
    console.log("user deleted")
})

app.get('/heroes',(req,res)=>{
    marvel.getFromMarvel('public/characters')
    .then(result => res.json(result))
})

app.listen(3001, () => {
    console.log('Server up and running, listening on port 3001');
})
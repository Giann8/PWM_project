const { MongoClient } = require('mongodb')
const crypto = require('crypto');

const DB_NAME = "MW_cards"
const client = new MongoClient(MONGO_URI);


function hash(input) {
    return crypto.createHash('sha256')
        .update(input)
        .digest('hex')
}

/**
 * Cerca utente per email
 * @param {*} email email da cercare
 */
async function searchEmail(email) {
    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const user = db.collection('users').findOne({ email: email });
    return user;
}

/**
 * Add new user to the database
 * @param {*} res response 
 * @param {*} user  user to add
 */
async function registerUser(res, user) {

    if (user.password && user.username && user.email) {
        if (user.username.length < 3) {
            res.status(400).send("Nome utente troppo corto o mancante");
            return;
        }
        if (user.email.length < 3) {
            res.status(400).send("Cognome troppo corto o mancante");
            return;
        }
        if (user.password.length < 8) {
            res.status(400).send("Password troppo corta o mancante");
            return;
        }
    } else {
        console.log(user)
        res.status(400).json({ error: 'Missing fields' })
        return
    }

    user.password = hash(user.password);
    const connection = await client.connect();

    try {
        if (await searchEmail(user.email) != null) {
            res.status(400).json({ error: 'Email already in use' })
            return
        }

        const db = connection.db(DB_NAME);

        await db.collection('users').insertOne({
            username: user.username,
            email: user.email,
            password: user.password,
            coins: 0,
            albums: {
                primo_album: [],
            },
            favorite_hero: user.favorite_hero||""
        });
        res.json(user);
        console.log('User added successfully');

    } catch (err) {

        console.log(err);
        res.status(500).json({ error: `Errore Generico: ${err.code}` })

    } finally {
        await client.close();
    }

}
/**
 * Funzione per eliminare un utente
 * @param {*} res response
 * @param {JSON} user utente da eliminare
 */
async function deleteUser(res, user) {
    if (user.email) {
        if (user.email.length < 8) {
            res.status(400).send("Email troppo corta o mancante");
            return;
        }
    } else {
        res.status(400).json({ error: 'Missing fields' })
        return
    }

    const connection = await client.connect();
    const db = connection.db(DB_NAME);
    try {
        await db.collection('users').findOneAndDelete({
            email: user.email
        })
        res.status(200).json(user)
    } catch (err) {
        console.log(err, user.email);
        res.status(500).json({ error: `Errore Generico: ${err.code}` })
    }
}

/**
 * Permette di vedere gli utenti registrati
 * @param {*} res response
 */
async function getUsers(res) {
    const connection = await client.connect();
    const db = connection.db(DB_NAME);
    try {
        const users = await db.collection('users').find().toArray();
        res.status(200).json(users)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: `Errore Generico: ${err.code}` })
    }
}

/**
 * funzione per il login dello user
 * @param {JSON} body 
 */
async function logUser(body){
    
}

module.exports = { registerUser, getUsers, deleteUser }


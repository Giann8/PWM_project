const { MongoClient, ObjectId } = require('mongodb')
const crypto = require('crypto');

const DB_NAME = "MW_cards"
const client = new MongoClient(MONGO_URI);

/**
 * Funzione per l'hash della password
 * @param {String} input 
 * @returns hash della password
 */
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
            album: {
            },
            favorite_hero: user.favorite_hero || ""
        });

        res.json(user);
        console.log('User added successfully');

    } catch (err) {
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
    } finally {
        await client.close();
    }
}

/**
 * Permette di vedere gli utenti registrati
 * @param {Response} res response
 */
async function getUsers(res) {
    const connection = await client.connect();
    const db = connection.db(DB_NAME);
    try {
        const users = await db.collection('users').find().toArray();
        if (users.length > 0) {
            res.status(200).json(users)
        } else {
            res.status(400).json({ error: `Errore: nessun utente nel DB` })
        }
    } catch (err) {
        res.status(500).json({ error: `Errore Generico: ${err.code}` })
    } finally {
        await client.close();
    }
}
/**
 * Funzione per ottenere un utente tramite username
 * @param {*} id 
 */
async function getUserById(id) {

    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    console.log(id);
    const confront_id = ObjectId.createFromHexString(id);
    try {

        const user = await db.collection('users').findOne({ _id: confront_id });
        if (user) {
            return user;
        } else {
            throw new Error("Utente non trovato")
        }
    } catch (err) {
        throw err;
    } finally {
        await client.close();
    }
}

/**
 * funzione per il login dello user
 * @param {JSON} body 
 */
async function logUser(body) {

    if (!body.email || !body.password) {
        throw new Error("email o password mancanti")
    }

    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const user = await db.collection('users').findOne({
        email: body.email,
        password: hash(body.password)
    });

    if (user) {
        return user;
    }
    else {
        throw new Error("L'email o la password sono errati oppure l'utente non esiste")
    }

}

module.exports = { registerUser, getUsers, deleteUser, getUserById, logUser }


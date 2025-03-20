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

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

/**
 * Cerca utente per email
 * @param {*} email email da cercare
 */
async function searchEmail(email) {
    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const user = await db.collection('Users').findOne({ email: email });
    await connection.close();

    return user;
}

/**
 * Funzione per controllare se l'username è già utilizzato
 * @param {*} username 
 */
async function checkUsername(username) {
    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const user = await db.collection('Users').findOne({ username: username })

    await connection.close();

    return user;
}

async function getUserCredits(id) {
    var user;
    try {
        user = await getUserById(id);
    } catch (err) {
        throw err;
    }
    return user.coins;
}
///////////////////////USERS///////////////////////

/**
 * Add new user to the database
 * @param {*} res response 
 * @param {body} user  user to add
 */
async function registerUser(res, user) {

    if (user.password && user.username && user.email) {
        if (user.username.length < 3) {
            throw new Error("Nome utente troppo corto o mancante");
        }
        if (user.password.length < 8) {
            throw new Error("Password troppo corta o mancante");
        }
        if (!validateEmail(user.email)) {
            throw new Error("Format: email non valida");
        }

    } else {
        throw new Error("Missing fields");
    }

    user.password = hash(user.password);

    try {
        if (await searchEmail(user.email) != null) {
            throw new Error("Email già in uso");
        }
        if (await checkUsername(user.username) != null) {
            throw new Error("Username già in uso");
        }
    } catch (err) {
        throw err;
    }

    const connection = await client.connect();

    try {

        const db = connection.db(DB_NAME);

        await db.collection('Users').insertOne({
            username: user.username,
            email: user.email,
            password: user.password,
            coins: 0,
            album: {
            },
            favorite_hero: user.favorite_hero || "",
        });
        console.log("User added")
        return user;
    } catch (err) {
        res.status(500).json({ error: `Errore Generico: ${err}` })

    } finally {
        await connection.close();
    }
}
/**
 * Funzione per eliminare un utente
 * @param {*} res response
 * @param {JSON} user utente da eliminare
 */
async function deleteUser(id) {

    const connection = await client.connect();
    const db = connection.db(DB_NAME);
    const user = await db.collection('Users').findOneAndDelete({ _id: ObjectId.createFromHexString(id) })

    connection.close();

    if (user == null) {
        throw new Error("Utente non trovato")
    } else {
        return user
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
        const users = await db.collection('Users').find().toArray();
        if (users.length > 0) {
            res.status(200).json(users)
        } else {
            res.status(400).json({ error: `Errore: nessun utente nel DB` })
        }
    } catch (err) {
        res.status(500).json({ error: `Errore Generico: ${err.code}` })
    } finally {
        await connection.close();
    }
}
/**
 * Funzione per ottenere un utente tramite username
 * @param {String} id 
 */
async function getUserById(id) {

    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    console.log(id);
    const confront_id = ObjectId.createFromHexString(id);
    try {

        const user = await db.collection('Users').findOne({ _id: confront_id });
        if (user) {
            return user;
        } else {
            throw new Error("Utente non trovato")
        }

    } catch (err) {
        throw err;
    } finally {
        await connection.close();
    }
}


/**
 * Funzione per trovare un utente tramite username
 * @param {string} username 
 */
async function getUserByUsername(username) {
    if (username.length <= 0) {
        throw new Error("Lo username non può essere vuoto")
    }

    try {
        if (checkUsername() == null) {
            throw new Error("l'utente specificato non esiste");
        } else {
            return user;
        }
    } catch (err) {
        throw err;
    }

}

/**
 * funzione per il login dello user
 * @param {JSON} body 
 */
async function logUser(body) {

    if (!body.email || !body.password) {
        throw new Error("email o password mancanti");
    }

    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const user = await db.collection('Users').findOne({
        email: body.email,
        password: hash(body.password)
    });
    await connection.close();

    if (user) {
        return user;
    }
    else {
        throw new Error("L'email o la password sono errati oppure l'utente non esiste");
    }

}


//!Update user info


/**
 * Update user Username
 * @param {String} id 
 * @param {JSON} body 
 */
async function updateUsername(id, body) {

    if (body.username == null || body.username.length < 3) {
        throw new Error("Nome utente troppo corto o mancante");
    }

    if (await checkUsername(body.username) != null) {
        throw new Error("Nome utente già utilizzato");
    }

    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const updatedUser = await db.collection('Users').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { username: body.username } })

    await connection.close();
    return updatedUser;
}

/**
 * Funzione per aggiornare l'email
 * @param {*} id 
 * @param {*} body 
 */
async function updateEmail(id, body) {

    if (body.email == null || !validateEmail(body.email)) {
        throw new Error("Format: email non valida");
    }

    if (await searchEmail(body.email) != null) {
        throw new Error("Email già in uso");
    }

    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const updatedUser = await db.collection('Users').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { email: body.email } })

    await connection.close();
    return updatedUser;
}

/**
 * Update user password
 * @param {String} id 
 * @param {Json} body 
 */
async function updatePassword(id, body) {

    if (body.password.length < 8) {
        throw new Error("Password troppo corta o mancante");
    }

    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    try {
        await db.collection('Users').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { password: hash(body.password) } })

    } finally {
        await connection.close();
    }
}

///////////////////////ACQUISTI///////////////////////

/**
 * Funzione per la modifica del credito
 * @param {String} id 
 * @param {String} coins 
 * @returns 
 */

async function updateCoins(id, coins) {
    var currentCoins

    currentCoins = await getUserCredits(id);

    const connection = await client.connect();

    try {

        const db = connection.db(DB_NAME);

        const total = Number(currentCoins) + Number(coins);

        if (total >= 0) {
            await db.collection('Users').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { coins: total } })
            return total;
        } else {
            throw new Error("Non hai abbastanza coins");
        }

    } finally {
        await connection.close();
    }

}



//Gestione errori
/**
 * Funzione per gestire gli errori
 * @param {Error} err 
 * @param {Response} res 
 */
function handleError(err, res) {
    if (err.message.includes("Format: ")) {
        res.status(400).json({ error: err.message })
    }
    res.status(500).json({ error: err.message })
}

module.exports = {
    registerUser,
    getUsers,
    deleteUser,
    getUserById,
    logUser,
    updateUsername,
    updatePassword,
    updateEmail,
    searchEmail,
    getUserByUsername,
    updateCoins,
    handleError
}


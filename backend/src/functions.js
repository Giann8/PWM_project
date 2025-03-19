const { MongoClient, ObjectId, Code } = require('mongodb')
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

    const user = await db.collection('users').findOne({ email: email });
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

    const user = await db.collection('users').findOne({ username: username })

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
 * @param {*} user  user to add
 */
async function registerUser(res, user) {

    if (user.password && user.username && user.email && user.name && user.surname) {
        if (user.username.length < 3) {
            throw new Error("Nome utente troppo corto o mancante");
        }
        if (user.email.length < 3) {
            throw new Error("Cognome troppo corto o mancante");
        }
        if (user.password.length < 8) {
            throw new Error("Password troppo corta o mancante");
        }
        if (user.name.length < 3) {
            throw new Error("Nome troppo corto o mancante");
        }
        if (user.surname.length < 3) {
            throw new Error("Cognome troppo corto o mancante");
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

        await db.collection('users').insertOne({
            name: user.name,
            surname: user.surname,
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
async function deleteUser(body) {

    if (body.email.length < 8) {
        throw new Error("Email troppo corta o mancante")
    }

    const connection = await client.connect();
    const db = connection.db(DB_NAME);
    const user = await db.collection('users').findOneAndDelete({
        email: body.email
    })

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
        const users = await db.collection('users').find().toArray();
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

        const user = await db.collection('users').findOne({ _id: confront_id });
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

    const user = await db.collection('users').findOne({
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
 * Update user Name
 * @param {string} id 
 * @param {JSON} body 
 */
async function updateName(id, body) {
    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    if (body.name == null || body.name.length < 3) {
        throw new Error("Nome troppo corto o mancante");
    }

    const user = await db.collection('users').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { name: body.name } })
    await connection.close()
    return user;
}

/**
 * Update user Username
 * @param {String} id 
 * @param {JSON} body 
 */
async function updateUsername(id, body) {

    if (body.username == null || body.username.length < 3) {
        throw new Error("Nome utente troppo corto o mancante");
    }
    try {
        if (await checkUsername(body.username) != null) {
            throw new Error("Nome utente già utilizzato");
        }
    } catch (err) {
        throw err;
    }

    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const updatedUser = await db.collection('users').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { username: body.username } })

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
        await db.collection('users').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { password: hash(body.password) } })

    } catch (err) {
        throw err;
    } finally {
        await connection.close();
    }
}

///////////////////////ACQUISTI///////////////////////

async function updateCoins(id, coins) {
    var currentCoins

    try {
        currentCoins = await getUserCredits(id);
    } catch (err) {
        throw err;
    }

    const connection = await client.connect();

    try {

        const db = connection.db(DB_NAME);

        const total = Number(currentCoins) + Number(coins);

        if (total >= 0) {
            await db.collection('users').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { coins: total } })
            return total;
        } else {
            throw new Error("Non hai abbastanza coins");
        }

    } catch (err) {
        throw err;
    } finally {
        await connection.close();
    }

}

module.exports = { registerUser, getUsers, deleteUser, getUserById, logUser, updateName, updateUsername, searchEmail, getUserByUsername, updatePassword, updateCoins }


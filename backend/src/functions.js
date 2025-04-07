const { MongoClient, ObjectId } = require('mongodb')
const crypto = require('crypto');
const { getFromMarvel, getRandomInt } = require('./marvel');
const { json } = require('stream/consumers');



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

async function getBoosterByName(boosterName) {
    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const booster = await db.collection('Boosters').findOne({ boosterName: boosterName })
    await connection.close();
    if (booster != null) {
        return booster;
    }
    throw new Error("Format: Pacchetto non trovato")
}

async function checkUserPassword(id, password) {
    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const user = await db.collection('Users').findOne({ _id: ObjectId.createFromHexString(id), password: hash(password) })

    await connection.close();

    return user;
}

async function checkBooster(boosterName) {
    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const booster = await db.collection('Boosters').findOne({ boosterName: boosterName })
    await connection.close();
    if (booster != null) {
        return true
    }
    return false;
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
            throw new Error("Format: Nome utente troppo corto o mancante");
        }
        if (user.password.length < 8) {
            throw new Error("Format: Password troppo corta o mancante");
        }
        if (!validateEmail(user.email)) {
            throw new Error("Format: email non valida");
        }

    } else {
        throw new Error("Format: Missing fields");
    }

    user.password = hash(user.password);

    if (await searchEmail(user.email) != null) {
        throw new Error("Format: Email già in uso");
    }
    if (await checkUsername(user.username) != null) {
        throw new Error("Format: Username già in uso");
    }

    const connection = await client.connect();

    try {

        const db = connection.db(DB_NAME);

        const added = await db.collection('Users').insertOne({
            username: user.username,
            email: user.email,
            password: user.password,
            coins: 0,
            album: {
            },
            favorite_hero: user.favorite_hero || "",
            Boosters: []
        });

        console.log("User added")
        return {
            _id: added.insertedId,
            username: user.username,
            email: user.email
        };

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
        throw new Error("Format: Utente non trovato")
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
            res.status(400).json({ error: `Form: nessun utente nel DB` })
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

    try {

        const user = await db.collection('Users').findOne({ _id: ObjectId.createFromHexString(id) });
        if (user) {
            return {
                _id: user._id,
                username: user.username,
                email: user.email,
                coins: user.coins,
                favorite_hero: user.favorite_hero,
                boosters: user.Boosters,
                album: user.album
            };
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
        throw new Error("Format: email o password mancanti");
    }

    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const user = await db.collection('Users').findOne({
        email: body.email,
        password: hash(body.password)
    });
    await connection.close();

    if (user) {
        return user._id;
    }
    else {
        throw new Error("Format: L'email o la password sono errati oppure l'utente non esiste");
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
    if (body.oldPassword == null || body.oldPassword.length < 8) {
        throw new Error("Format: Inserisci la password corrente");
    }

    if (body.password.length < 8) {
        throw new Error("Format: Password troppo corta o mancante");
    }


    if (await checkUserPassword(id, body.oldPassword) == null) {
        throw new Error("Format: La password corrente inserita è errata");
    }

    if (body.password == body.oldPassword) {
        throw new Error("Format: La nuova password non può essere uguale a quella vecchia");
    }

    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    try {
        await db.collection('Users').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { password: hash(body.password) } })

    } finally {
        await connection.close();
    }
}

async function updateFavSuperhero(id, hero) {
    if (hero.length <= 0) {
        throw new Error("Format: Nome supereroe non valido")
    }
    const connection = await client.connect();

    try {
        const db = connection.db(DB_NAME);
        await db.collection('Users').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { favorite_hero: hero } })
    } finally {
        await connection.close();
    }
}

async function updatePersonalBoosters(user_Id, booster_Id) {
    const user = await getUserById(user_Id);
    
    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        await db.collection('Users').findOneAndUpdate({ _id: user._id }, { $push: { Boosters: { booster_Id } } });
    } finally {
        await connection.close();
    }
    return user;
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

        console.log("Current coins: " + currentCoins)
        console.log("Coins to add: " + coins)
        const total = Number(currentCoins) + Number(coins);

        if (total >= 0) {
            await db.collection('Users').findOneAndUpdate({ _id: ObjectId.createFromHexString(id) }, { $set: { coins: total } })
            return total;
        } else {
            throw new Error("Format: Non hai abbastanza coins");
        }

    } finally {
        await connection.close();
    }

}
/**
 * Funzione per la creazione di un pacchetto
 * @param {JSON} body
 */
async function creaPacchetto(body) {
    if (body.cardNumber && body.boosterName && body.cost) {
        if (body.cardNumber <= 0) {
            throw new Error("Format: Il numero di carte del pacchetto deve essere maggiore di 0")
        }
        if (body.boosterName.length < 4) {
            throw new Error("Format: Il nome del pacchetto è troppo corto")
        }
        if (body.cost < 0) {
            throw new Error("Format: Il costo del pacchetto non può essere negativo")
        }
    } else {
        throw new Error("Format: Missing fields")
    }


    if (await checkBooster(body.boosterName)) {
        console.log(body.boosterName)
        throw new Error("Format: Pacchetto già esistente")
    }

    const connection = await client.connect();

    try {
        const db = connection.db(DB_NAME);
        const booster = await db.collection("Boosters").insertOne({
            boosterName: body.boosterName,
            cardNumber: Number(body.cardNumber),
            cost: Number(body.cost),
            type: body.type || "default",
            img: body.img || "https://www.pngall.com/wp-content/uploads/5/Booster-PNG-Clipart-Background.png"
        })
        return booster;
    } finally {
        await connection.close();
    }
}

/**
 * Funzione per eliminare un pacchetto.
 * @param {String} boosterId 
 */
async function deletePacchetto(boosterId) {
    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        const booster = await db.collection('Boosters').findOneAndDelete({ _id: ObjectId.createFromHexString(boosterId) });
        if (booster == null) {
            throw new Error("Format: Pacchetto non trovato")
        }
        return booster;
    } finally {
        await connection.close();
    }
};

/**
 * Funzione per ottenere tutti i pacchetti
 */
async function getPacchetti() {
    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        const boosters = await db.collection("Boosters").find().toArray();

        if (boosters.length <= 0) {
            throw new Error("Format: Nessun pacchetto trovato")
        }

        return boosters;
    } finally {
        await connection.close();
    }
}

/**
 * Funzione per ottenere un pacchetto tramite id.
 * @param {String} boosterId 
 * @returns 
 */
async function getPacchettoById(boosterId) {
    const connection = await client.connect();

    try {
        const db = connection.db(DB_NAME);
        const booster = await db.collection("Boosters").findOne({ _id: ObjectId.createFromHexString(boosterId) });

        if (booster == null) {
            throw new Error("Format: Pacchetto non trovato")
        }

        return booster;
    } finally {
        await connection.close();
    }
}

/**
 * Funzione per l'acquisto di un pacchetto.
 * @param {String} id 
 * @param {String} boosterName 
 */
async function compraPacchetto(id, boosterName) {


    const booster = await getBoosterByName(boosterName);
    const user = await getUserById(id);
    console.log(user)
    console.log(JSON.stringify(booster._id))
    if (user.coins >= booster.cost) {
        var result = await updateCoins(id, -booster.cost);
        await updatePersonalBoosters(id, JSON.stringify(booster._id));
        return { message: "Pacchetto acquistato", pacchetto: booster.boosterName, coins: result };
    } else {
        throw new Error("Format: Non hai abbastanza coins");
    }

}

//MARVEL RANDOM PICK

async function getRandomHero(n = 1) {
    heroes_data = getFromMarvel('public/characters', "limit=1");
    result = [];
    for (i = 0; i < n;) {
        offset = getRandomInt(0, heroes_data.data.total);
        hero = await getFromMarvel('/public/characters', `limit=1&offset=${offset}`);
        if (hero.data.results.length > 0) {
            result = hero.data.results[0];
            i++;
        }
    }
    return result;
}


//Gestione errori
/**
 * Funzione per gestire gli errori
 * @param {Error} err 
 * @param {Response} res 
 */
function handleError(err, res) {
    var message = err.message.split("Format: ");
    if (err.message.includes("Format: ")) {
        res.status(400).json({ error: message[1] })
        return;
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
    updateFavSuperhero,
    updatePersonalBoosters,
    searchEmail,
    getUserByUsername,
    updateCoins,
    handleError,
    creaPacchetto,
    deletePacchetto,
    getPacchetti,
    getPacchettoById,
    compraPacchetto,
    getRandomHero
}


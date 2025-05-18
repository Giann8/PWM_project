const { MongoClient, ObjectId, Db } = require('mongodb')
const crypto = require('crypto');
const { getFromMarvel, getRandomInt } = require('./marvel');
const { get } = require('http');
const { createBrotliDecompress } = require('zlib');




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

async function hasBooster(userId, boosterId) {
    const connection = await client.connect();
    const db = connection.db(DB_NAME);

    const user = await db.collection('Users').findOne({ _id: ObjectId.createFromHexString(userId), [`Boosters.${boosterId}`]: { $gt: 0 } })
    await connection.close();

    if (user != null) {
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
            favorite_hero: user.fav_hero || "",
            Boosters: {}
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

async function updateFavMagician(id, hero) {
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

async function addPersonalBoosters(user_Id, booster) {
    const user = await getUserById(user_Id);

    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        await db.collection('Users').findOneAndUpdate({ _id: ObjectId.createFromHexString(user_Id) }, {
            $inc: {
                [`Boosters.${booster._id}`]: 1
            }
        });
    } finally {
        await connection.close();
    }
    return user;
}

async function removePersonalBooster(user_Id, boosterId) {
    if (boosterId == null) {
        throw new Error("Format: Inserisci il pacchetto da rimuovere");

    }

    const user = await getUserById(user_Id);

    const numeroPacchetti = user.boosters[boosterId];

    const connection = await client.connect();
    try {
        var check = null;
        const db = connection.db(DB_NAME);
        if (numeroPacchetti && numeroPacchetti > 1) {
            check = await db.collection("Users").updateOne({ _id: ObjectId.createFromHexString(user_Id) }, {
                $inc: {
                    [`Boosters.${boosterId}`]: -1
                }
            });
        } else if (numeroPacchetti && numeroPacchetti === 1) {
            check = await db.collection("Users").updateOne({ _id: ObjectId.createFromHexString(user_Id) }, {
                $unset: {
                    [`Boosters.${boosterId}`]: ""
                }
            });
        }
        if (check == null) {
            throw new Error("Format: Pacchetto non trovato")
        }
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
    if (body.cardNumber && body.boosterName && body.price) {
        if (body.cardNumber <= 0) {
            throw new Error("Format: Il numero di carte del pacchetto deve essere maggiore di 0")
        }
        if (body.boosterName.length < 4) {
            throw new Error("Format: Il nome del pacchetto è troppo corto")
        }
        if (body.price < 0) {
            throw new Error("Format: Il costo del pacchetto non può essere negativo")
        }
    } else {
        throw new Error("Format: Missing fields")
    }


    if (await checkBooster(body.boosterName)) {

        throw new Error("Format: Pacchetto già esistente")
    }

    const connection = await client.connect();

    try {
        const db = connection.db(DB_NAME);
        const booster = await db.collection("Boosters").insertOne({
            boosterName: body.boosterName,
            cardNumber: Number(body.cardNumber),
            price: Number(body.price),
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

async function getPacchettiByUserId(userId) {

    const user = await getUserById(userId);

    const boosters = [];

    var total = 0;
    for (const booster in user.boosters) {
        var pacchetto = await getPacchettoById(booster);
        boosters.push({ booster: pacchetto, quantity: user.boosters[booster] });
        total += user.boosters[booster];
    }

    if (boosters.length <= 0) {
        throw new Error("Format: Nessun pacchetto trovato")
    }

    return { boosters: boosters, total: total };
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
    var user = await getUserById(id);

    if (user.coins >= booster.price) {
        user = await addPersonalBoosters(id, booster);
        var result = await updateCoins(id, -booster.price);
        return { message: "Pacchetto acquistato", pacchetto: booster.boosterName, coins: result };
    } else {
        throw new Error("Format: Non hai abbastanza coins");
    }

}

async function apriPacchetto(userId, boosterName) {
    if (!boosterName) {
        throw new Error("Format: Inserisci il pacchetto da aprire");
    }

    const booster = await getBoosterByName(boosterName);

    if (!await hasBooster(userId, booster._id)) {
        throw new Error("Format: Non possiedi questo pacchetto");
    }

    const heroes = await getRandomCards(booster.cardNumber)



    for (let i = 0; i < heroes.length; i++) {
        await addCard(userId, heroes[i].id);
    }


    const user = await removePersonalBooster(userId, booster._id);

    return { message: "Pacchetto aperto", heroes: heroes, user: user };

}
/**
 * Funzione per aprire tutti i pacchetti
 * @param {*} userId 
 */
async function apriPacchetti(userId) {
    var totalHeroes = [];

    const possessedBoosters = await getPacchettiByUserId(userId);
    for (let j = 0; j < possessedBoosters.boosters.length; j++) {

        const booster = possessedBoosters.boosters[j];

        for (let i = 0; i < booster.quantity; i++) {

            const heroesFound = await apriPacchetto(userId, booster.booster.boosterName);

            totalHeroes.push.apply(totalHeroes, heroesFound.heroes);
        }
    };


    return { message: "Pacchetti aperti", heroes: totalHeroes, quantity: totalHeroes.length };
}

/**
 * Funzione per ottenere le carte dell'utente 
 * @param {String} userId 
 * @returns 
 */
async function getUserCards(userId, pageNumber) {
    const user = await getUserById(userId);

    var heroNumber = 20;
    if (pageNumber == null) {
        pageNumber = 1;
    }
    if (pageNumber == "all") {
        pageNumber = 1;
        heroNumber = Object.keys(user.album).length
    }

    var album = [];
    if (Object.keys(user.album).length > 0) {
        for (let i = (pageNumber - 1) * heroNumber; i < pageNumber * heroNumber; i++) {
            const card = Object.keys(user.album)[i];
            const cardData = await getCardById(card);
            if (cardData) {
                album.push({ card: cardData, quantity: user.album[card] });
            }
        }
        return { album: album, totalCards: Object.keys(user.album).length };
    }
    throw new Error("Format: L'utente non possiede nessuna carta");
}

async function getUserCardById(userId, cardId) {
    const user = await getUserById(userId);
    if (user.album[cardId]) {
        const card = await getCardById(cardId);
        return { card: card, quantity: user.album[cardId] };
    }
    throw new Error("Format: Carta non trovata");
}
// /**
//  * 
//  * @param {String} cardId 
//  */
// async function getCardById(cardId) {
//     const connection = await client.connect();

//     try {
//         const db = connection.db(DB_NAME);
//         var card = await db.collection('Marvel').findOne({ id: Number(cardId) });
//         if (card == null) {
//             card = await fetch("https://hp-api.onrender.com/api/character/" + cardId)
//                 .then(async res => json = await res.json())
//                 .then(json => { })
//                 .catch(err => console.log(err));
//             if (card == null) {
//                 throw new Error("Format: Carta non trovata");
//             }
//         }

//         return { card: card };
//     } finally {
//         await connection.close();
//     }
// }

async function getCardById(cardId) {
    var card = null
    await fetch(`https://hp-api.onrender.com/api/character/` + cardId)
        .then(async res => {
            if (res.status == 200) {
                card = await res.json();
            } else {
                throw new Error("Format: Carta non trovata");
            }
        })
        .catch(err => { throw new Error(err) })
    if (card == null) {
        throw new Error("Format: Carta non trovata");
    }
    return card[0];
}
/**
 * 
 * @param {*} userId 
 * @param {*} card
 */
async function addCard(userId, cardId) {
    if (!cardId) {
        throw new Error("Format: Nessuna carta da aggiungere");
    }
    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        await db.collection('Users').findOneAndUpdate({ _id: ObjectId.createFromHexString(userId) }, {
            $inc: {
                [`album.${cardId}`]: 1
            }
        })
        return { message: "Carte aggiunte" }
    } catch (err) {
        console.log(err);
    } finally {
        await connection.close();
    }
}

async function removeCard(userId, cardId) {
    const user = await getUserById(userId);
    const cardQuantity = user.album[cardId];
    const connection = await client.connect();
    try {
        var updated;
        if (cardQuantity && cardQuantity > 1) {
            updated = await connection.db(DB_NAME).collection("Users").updateOne({ _id: ObjectId.createFromHexString(userId) }, {
                $inc: {
                    [`album.${cardId}`]: -1
                }
            });
        } else if (cardQuantity && cardQuantity === 1) {
            throw new Error("Format: non puoi scambiare o vendere l'ultima copia di una carta")
        }
        if (updated == null) {
            throw new Error("Carta non trovata")
        }
        return { message: "Carta eliminata", album: user.album, updated: updated }
    } finally {
        await connection.close();
    }
}


async function sellCard(userId, cardId) {
    await removeCard(userId, cardId);
    const coins = await updateCoins(userId, 10);
    return { message: "Carta venduta, ti sono state accreditate 10 monete", currentCoins: coins }
}

//################### EXCHANGES #######################
async function createScambio(userId, body) {
    if (userId == null || body.carteOfferte == null || body.carteRichieste == null) {
        throw new Error("Format: Missing fields")
    }
    if (body.carteOfferte.length <= 0) {
        throw new Error("Format: Inserisci la carta che vuoi offrire")
    }

    if (body.carteRichieste.length <= 0) {
        throw new Error("Format: Inserisci la carta che desideri")
    }
    if(hasDuplicates(body.carteOfferte)) {
        throw new Error("Format: Non puoi offrire due volte la stessa carta")
    }
    if (hasDuplicates(body.carteRichieste)) {
        throw new Error("Format: Non puoi richiedere due volte la stessa carta")
    }
    console.log(body)
    const user = await getUserById(userId);

    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        const exchange = await db.collection('Exchanges').insertOne({
            userId: userId,
            creator: user.username,
            carteRichieste: body.carteRichieste,
            carteOfferte: body.carteOfferte
        })
        return exchange;
    } finally {
        await connection.close();
    }
}

async function deleteScambio(exchangeId, userId) {
    if (userId == null || exchangeId == null) {
        throw new Error("Format: Missing fields")
    }
    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        const exchange = await db.collection('Exchanges').findOneAndDelete({ _id: ObjectId.createFromHexString(exchangeId) });

        if (exchange == null) {
            throw new Error("Scambio non trovato")
        } else if (exchange.userId != userId) {
            throw new Error("Format: Non puoi eliminare uno scambio che non hai creato")
        }

        return exchange;
    } finally {
        await connection.close();
    }

}

async function getScambioById(exchangeId) {
    if (exchangeId == null) {
        throw new Error("Format: Missing fields")
    }
    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        const exchange = await db.collection('Exchanges').findOne({ _id: ObjectId.createFromHexString(exchangeId) });

        if (exchange == null) {
            throw new Error("Scambio non trovato")
        } else {
            return exchange;
        }
    } finally {
        await connection.close();
    }
}

async function getScambi() {

    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        const exchanges = await db.collection('Exchanges').find().toArray();
        if (exchanges.length > 0) {
            return exchanges;
        } else {
            throw new Error("Format: Nessun scambio trovato");
        }
    } finally {
        await connection.close();
    }
}

async function getScambiByUserId(userId) {
    if (userId == ":userId") {
        throw new Error("Format: Missing fields")
    }
    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        const exchanges = await db.collection('Exchanges').find({ userId: userId }).toArray();

        if (exchanges.length > 0) {
            return exchanges;
        } else {
            throw new Error("Format: L'utente non ha scambi attivi");
        }
    } finally {
        await connection.close();
    }
}

async function accettaScambio(userId, exchangeId) {
    if (userId == null || exchangeId == null) {
        throw new Error("Format: Missing fields")
    }
    console.log(exchangeId, userId);
    const scambio = await getScambioById(exchangeId);
    const userCreatorId = scambio.userId;

    var userRemoved = [];
    var creatorRemoved = [];
    var userAdded = [];
    var creatorAdded = [];

    var nonPiuDisponibiliCreator = [];
    var nonPiuDisponibiliUser = [];

    try {
        for (let i = 0; i < scambio.carteOfferte.length; i++) {
            const carta = scambio.carteOfferte[i];
            await removeCard(userCreatorId, carta.id)
            if ((await getUserCardById(userCreatorId, carta.id)).quantity < 2) {
                nonPiuDisponibiliCreator.push({id:carta.id, name:carta.name});
            }
            creatorRemoved.push(carta.id);
            await addCard(userId, carta.id)
            userAdded.push(carta.id)

        }

        for (let i = 0; i < scambio.carteRichieste.length; i++) {
            const carta = scambio.carteRichieste[i];
            await removeCard(userId, carta.id)
            if ((await getUserCardById(userId, carta.id)).quantity < 2) {
                nonPiuDisponibiliUser.push({id:carta.id, name:carta.name});
            }
            userRemoved.push(carta.id);
            await addCard(userCreatorId, carta.id);
            creatorAdded.push(carta.id);
        }

    } catch (err) {
        console.log(err);
        if (userRemoved.length > 0) {
            for (cartaId in userRemoved) {
                console.log(cartaId);
                await addCard(userId, cartaId);
            }
        }
        if (creatorRemoved.length > 0) {
            for (cartaId in creatorRemoved) {
                await addCard(userCreatorId, cartaId);
            }
        }
        if (creatorAdded.length > 0) {
            for (cartaId in creatorAdded) {
                await removeCard(userCreatorId, cartaId);
            }
        }
        if (userAdded.length > 0) {
            for (cartaId in userAdded) {
                await removeCard(userId, cartaId);
            }
        }
        throw new Error("Format: an error occurred, exchange stopped and cards returned");
    }
    await deleteScambio(exchangeId, userCreatorId);


    var scambiAttiviUser = await getScambiWithSameCards(userId, nonPiuDisponibiliUser);
    var scambiAttiviCreator = await getScambiWithSameCards(userCreatorId, nonPiuDisponibiliCreator);

    if (scambiAttiviUser.length > 0) {
        for (let i = 0; i < scambiAttiviUser.length; i++) {
            const scambio = scambiAttiviUser[i];
            const response = await deleteScambio(String(scambio._id), userId);
        }
    }
    if (scambiAttiviCreator.length > 0) {
        for (let i = 0; i < scambiAttiviCreator.length; i++) {
            const scambio = scambiAttiviCreator[i];
            console.log(String(scambio._id));
            const response = await deleteScambio(String(scambio._id), userCreatorId);
            console.log(response)
        }
    }

    return { message: "Scambio completato con successo, alcuni scambi potrebbero essere stati eliminati" }
}

async function getScambiWithSameCards(userId, cards) {
    if (userId == null || cards == null) {
        throw new Error("Format: Missing fields")
    }
    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        const scambi = await db.collection('Exchanges').find({ userId: userId, carteOfferte: { $in: cards } }).toArray();
        return scambi;
    } finally {
        await connection.close();
    }
}

//MARVEL RANDOM PICK

async function getRandomHero(n = 1) {
    heroes_data = await getFromMarvel('public/characters', `limit=${n}`);

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

//Funzioni in caso di malfunzionamento api
async function getHeroes() {
    const connection = await client.connect();
    try {
        const db = connection.db(DB_NAME);
        const heroes = await db.collection('Marvel').find().toArray();
        if (heroes.length > 0) {
            return heroes;
        } else {
            throw new Error("Format: Nessun eroe trovato");
        }
    } finally {
        await connection.close();
    }
}


async function getRandomCards(n = 1) {
    var result = [];

    //const heroes = await getHeroes();
    const heroes = await getAllMagicians();

    for (i = 0; i < n;) {
        offset = getRandomInt(0, heroes.length);

        hero = heroes[offset];
        if (hero != null) {
            result.push(hero);
            i++;
        }
    }

    if (result.length <= 0) {
        throw new Error("fetch error")
    }

    return result;
}

async function getAllMagicians() {
    var magicians = [];
    var response = await fetch(`https://hp-api.onrender.com/api/characters`)
        .then(async response => {
            const json = await response.json()

            return { status: response.status, json: json }
        })
        .then(({ status, json }) => {
            if (status == 200) {
                for (let i = 0; i < json.length; i++) {
                    const magician = json[i];
                    magicians.push({
                        id: magician.id,
                        name: magician.name,
                        image: magician.image,
                        wand: magician.wand,
                        house: magician.house
                    })
                }
            }
            return true;
        })
        .catch(error => {
            console.log("error occurred " + error);
        });

    if (magicians.length <= 0) {
        throw new Error("fetch error")
    }

    return magicians
}
//Gestione errori
/**
 * Funzione per gestire gli errori
 * @param {Error} err 
 * @param {Response} res 
 */
function handleError(err, res) {
    if (err.message.includes("Format: ")) {
        var message = err.message.split("Format: ");
        res.status(400).json({ error: message[1] })
        return;
    }
    res.status(500).json({ error: err.message })
}

function hasDuplicates(array) {
    const seen = new Set();
    for (const item of array) {
        if (seen.has(item.id)) {
            return true; // Duplicato trovato
        }
        seen.add(item.id);
    }
    return false; // Nessun duplicato
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
    updateFavMagician,
    addPersonalBoosters,
    removePersonalBooster,
    searchEmail,
    getUserByUsername,
    updateCoins,
    handleError,
    creaPacchetto,
    deletePacchetto,
    getPacchetti,
    getPacchettiByUserId,
    getPacchettoById,
    compraPacchetto,
    apriPacchetto,
    apriPacchetti,
    getUserCards,
    getCardById,
    addCard,
    removeCard,
    sellCard,
    getUserCardById,
    createScambio,
    getScambi,
    getScambioById,
    getScambiByUserId,
    getScambiWithSameCards,
    accettaScambio,
    deleteScambio,
    getRandomHero,
    getRandomCards,
    getHeroes,
    getAllMagicians
}


const apikey = "123456";
const url = "http://localhost:3001"

function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('coins');
    localStorage.removeItem('username');
    window.location.href = "http://localhost:3000/home.html";
}

function closeAlert() {
    var alert = document.getElementById("error-alert");
    alert.classList.add("d-none");
}

function showPassword() {
    var password = document.getElementById("password");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

async function login() {
    if (!checkValidEmail(0) && !checkValidPassword(1)) {
        return;
    }
    var message_error = document.getElementsByClassName('error-message');

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        })
    }

    await fetch(url + '/login?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status === 200) {
                localStorage.setItem('userId', JSON.stringify(json));
                window.location.href = "http://localhost:3000/userPage.html";
            } else {
                message_error[2].innerHTML = "Credenziali non valide o utente non registrato";
                message_error[2].classList.remove("d-none");
                document.getElementById('email').classList.add("is-invalid");
                document.getElementById('password').classList.add("is-invalid");
            }
            console.log(json);
        })
        .catch(err => {
            message_error[2].innerHTML = "Unknown error: " + err;
            message_error[2].classList.remove("d-none");
            document.getElementById('email').classList.add("is-invalid");
            document.getElementById('password').classList.add("is-invalid");
        })
}


function checkValidEmail() {
    var message_error = document.getElementById('error-message-email');
    var email = document.getElementById('email').value;
    var re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
        message_error.innerHTML = "Invalid email";
        message_error.classList.remove("d-none");
        document.getElementById('email').classList.add("is-invalid");
        return false;
    } else {
        message_error.classList.add("d-none");
        document.getElementById('email').classList.remove("is-invalid");
        return true;
    }
}

function checkValidPassword() {
    var message_error = document.getElementById('error-message-password');
    var password = document.getElementById('password').value;
    if (password.length < 8) {
        message_error.innerHTML = "La password deve essere di almeno 8 caratteri";
        message_error.classList.remove("d-none");
        document.getElementById('password').classList.add("is-invalid");
        return false;
    } else {
        message_error.classList.add("d-none");
        document.getElementById('password').classList.remove("is-invalid");
        return true;
    }
}

function checkValidOldPassword() {
    var message_error = document.getElementById('error-message-old-password');
    var old_password = document.getElementById('old-password').value;
    if (old_password.length < 8) {
        message_error.innerHTML = "La password deve essere di almeno 8 caratteri";
        message_error.classList.remove("d-none");
        document.getElementById('old-password').classList.add("is-invalid");
        return false;
    }
    else {
        message_error.classList.add("d-none");
        document.getElementById('old-password').classList.remove("is-invalid");
        return true;
    }
}

function checkValidUsername() {
    var message_error = document.getElementById('error-message-username');
    var username = document.getElementById('username').value;
    if (username.length < 3 || username.length == null) {
        message_error.innerHTML = "Inserisci un username valido";
        message_error.classList.remove("d-none");
        document.getElementById('username').classList.add("is-invalid");
        return false;
    } else {
        message_error.classList.add("d-none");
        document.getElementById('username').classList.remove("is-invalid");
        return true;
    }
}


if (document.URL.includes("login.html")) {
    const form = document.getElementById('form');
    form.addEventListener('submit', async () => await validateAndLogin());
}

if (document.URL.includes("register.html")) {
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async () => await validateAndRegister());
}




async function validateAndLogin() {
    if (checkValidEmail(0) && checkValidPassword(1)) {
        await login();
    }
}

async function validateAndRegister() {
    if (checkValidUsername() && checkValidEmail() && checkValidPassword()) {
        await register();
    }
}

async function register() {
    if (!checkValidUsername() && !checkValidEmail() && !checkValidPassword()) {
        return;
    }
    const username = document.getElementById('username').value
    var message_error = document.getElementsByClassName('error-message');
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            username: username,
            fav_magician: document.getElementById('favmagician').value
        })
    }
    console.log(document.getElementById('favmagician').value);

    await fetch(url + '/register?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        }
        )
        .then(({ status, json }) => {
            if (status === 200) {
                localStorage.setItem('userId', JSON.stringify(json._id));
                localStorage.setItem('username', JSON.stringify(username));
                window.location.href = "http://localhost:3000/userPage.html";
            } else {
                message_error[3].innerHTML = JSON.stringify(json.error);
                message_error[3].classList.remove("d-none");
                document.getElementById('username').classList.add("is-invalid");
                document.getElementById('email').classList.add("is-invalid");
                document.getElementById('password').classList.add("is-invalid");
            }
            console.log(json);
        }
        )
        .catch(err => {
            message_error[3].innerHTML = "Unknown error: " + err;
            message_error[3].classList.remove("d-none");
            document.getElementById('username').classList.add("is-invalid");
            document.getElementById('email').classList.add("is-invalid");
            document.getElementById('password').classList.add("is-invalid");
        })
}



function checkLogin() {
    if (localStorage.getItem('userId') == null) {
        return false;
    } else {
        return true;
    }
}

function popUp() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function closePopUp() {
    var popup = document.getElementById("myPopup");
    popup.classList.remove("show");
}

async function getUserInfo() {
    const userId = JSON.parse(localStorage.getItem('userId'));
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        }
    }

    await fetch(url + '/users/' + userId + '?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status === 200) {
                var boostersQuantity = 0;
                for (booster in json.boosters) {
                    boostersQuantity += json.boosters[booster];
                }
                console.log(boostersQuantity)
                localStorage.setItem('username', JSON.stringify(json.username));
                localStorage.setItem('coins', JSON.parse(json.coins));
                localStorage.setItem('boostersNumber', boostersQuantity);
                localStorage.setItem('favMagician', JSON.stringify(json.fav_magician));
                document.getElementById('utente').innerHTML = json.username;
                document.getElementById('old-email').value = json.email;
                document.getElementById('coins').innerHTML = json.coins;
                document.getElementById('boostersNumber').innerHTML = boostersQuantity;

                console.log(json.coins);
            } else {
                console.log("Error fetching user info");
            }
        })
        .catch(err => {
            console.log(err);
        })
}

async function updateFavMagician(magician) {
    var magicianId = magician || document.getElementById('favmagician').value;

    var userId = JSON.parse(localStorage.getItem('userId'));
    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fav_magician: magicianId
        })
    }

    await fetch(url + '/users/' + userId + '/updateFavMagician?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status == 200) {
                localStorage.setItem('favMagician', JSON.stringify(magicianId));
                window.location.reload();
            } else {
                console.log(json.error);
            }
        })
        .catch(err => {
            console.log(err);
        })
}


async function updateEmail() {

    if (!checkValidEmail()) {
        return;
    }

    var message_error = document.getElementById("error-message-email");

    var new_email = document.getElementById("email").value;
    var userId = JSON.parse(localStorage.getItem('userId'));

    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            email: new_email
        })
    }

    await fetch(url + '/users/' + userId + '/updateEmail?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status == 200) {
                localStorage.setItem(email, JSON.stringify(new_email));
                window.location.reload();
            } else {
                console.log(json.error);
                message_error.innerHTML = JSON.stringify(json.error);
                message_error.classList.remove("d-none");
                document.getElementById('email').classList.add("is-invalid");
            }
        })
        .catch(err => {
            console.log(err);
            message_error.innerHTML = "Errore sconosciuto: " + err + "\n Riprovare";
            message_error.classList.remove("d-none");
            document.getElementById('email').classList.add("is-invalid");
        })

}

async function updatePassword() {
    if (!checkValidOldPassword() && !checkValidPassword()) {
        return;
    }
    var old_password = document.getElementById("old-password").value;
    var message_error_old = document.getElementById("error-message-old-password");
    var message_error = document.getElementById("error-message-password");
    var new_password = document.getElementById("password").value;

    var userId = JSON.parse(localStorage.getItem('userId'));

    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            oldPassword: old_password,
            password: new_password
        })
    }

    await fetch(url + '/users/' + userId + '/updatePassword?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status == 200) {
                window.location.reload();
            } else {
                console.log(json.error);
                message_error_old.innerHTML = JSON.stringify(json.error);
                message_error_old.classList.remove("d-none");
                message_error.innerHTML = JSON.stringify(json.error);
                message_error.classList.remove("d-none");
                document.getElementById('old-password').classList.add("is-invalid");
                document.getElementById('password').classList.add("is-invalid");
            }
        })
        .catch(err => {
            console.log(err);
            message_error.innerHTML = "Errore sconosciuto: " + err + "\n Riprovare";
            message_error.classList.remove("d-none");
            document.getElementById('password').classList.add("is-invalid");
            document.getElementById('old-password').classList.add("is-invalid");
        })
}

async function deleteAccount() {
    var userId = JSON.parse(localStorage.getItem('userId'));
    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        }
    }

    await fetch(url + '/deleteUser/' + userId + '?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status == 200) {
                logout();
            } else {
                console.log(json.error);
            }
        })
        .catch(err => {
            console.log(err);
        })

    //logout();
}

async function updateUsername() {

    if (!checkValidUsername()) {
        return;
    }

    var new_username = document.getElementById("username").value;
    var message_error = document.getElementById("error-message-username");
    var userId = JSON.parse(localStorage.getItem('userId'));

    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            username: new_username
        })
    }

    await fetch(url + '/users/' + userId + '/updateUsername?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status == 200) {
                localStorage.setItem('username', JSON.stringify(new_username));
                window.location.reload();
            } else {
                console.log(json.error);
                message_error.innerHTML = JSON.stringify(json.error);
                message_error.classList.remove("d-none");
                document.getElementById('username').classList.add("is-invalid");
            }
        })
        .catch(err => {
            console.log(err);
            message_error.innerHTML = "Errore sconosciuto: " + err + "\n Riprovare";
            message_error.classList.remove("d-none");
            document.getElementById('username').classList.add("is-invalid");
        })
}


async function getBoosters() {


    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        }
    }

    boosters = null;

    await fetch(url + '/pacchetti?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status === 200) {
                boosters = json;
            } else {
                console.log("show error alert")
            }
        })
        .catch(err => {
            console.log(err);
        })

    return boosters;
}
/**
 * 
 * @param {JSON} boosters 
 */
function showBoosters(boosters) {
    var card = document.getElementById('card-booster');

    for (i = 0; i < boosters.length; i++) {
        var booster = boosters[i];
        var clone = card.cloneNode(true);
        title = clone.getElementsByClassName('card-title')[0];
        description = clone.getElementsByClassName('card-body')[0];

        image = clone.getElementsByClassName('card-img-top')[0];
        button = clone.getElementsByClassName('btn btn-button')[0];

        image.src = booster.img || "assets/Default_booster.jpg";
        title.innerHTML = `<b>${booster.boosterName}</b>`;
        description.innerHTML = `<p><b>Carte: </b>${booster.cardNumber} Prezzo: ${booster.price}</p>`;


        clone.classList.remove('d-none')
        card.after(clone)
    }
}

async function buyBooster(boosterName) {

    var userId = JSON.parse(localStorage.getItem('userId'));
    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            boosterName: boosterName
        })
    }

    const response = await fetch(url + '/pacchetti/compraPacchetto/' + userId + '?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status === 200) {
                localStorage.setItem("coins", json.coins);
                localStorage.setItem("boostersNumber", Number(localStorage.getItem("boostersNumber")) + 1);
                document.getElementById("coins").innerHTML = json.coins;
                document.getElementById("boostersNumber").innerHTML = Number(localStorage.getItem("boostersNumber"));
                showAlert("success", "<strong>Booster acquistato con successo</strong>");
            } else {
                showAlert("error", `<strong>Errore!</strong>` + json.error)
                return;
            }
        })
        .catch(err => {
            console.log(err);
        })
}

function showAlert(type, message) {

    document.getElementById(type + '-alert').classList.remove("d-none");
    document.getElementById(type).innerHTML = message;
    if (type == "error") {
        n = 0
    } else {
        n = 1
    }
    startLoadingBar(3000, n);
    setTimeout(() => {
        document.getElementById(type + "-alert").classList.add('d-none');
    }, 3500);
}

async function buyCredits(coins) {
    var userId = JSON.parse(localStorage.getItem('userId'));


    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            coins: coins
        })
    }

    await fetch(url + '/users/' + userId + '/updateCoins?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status === 200) {
                localStorage.setItem("coins", json.coins)
                document.getElementById("coins").innerHTML = json.coins;
                showAlert("success", "<strong>Monete acquistate con successo</strong>");
            }
        })
        .catch(err => {
            showAlert("error", `<strong>Errore!</strong>` + err)
        })
}

async function getScambi() {

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        }
    }
    scambi = [];
    await fetch(url + '/scambi?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status === 200) {
                scambi = json;
            }
        })
        .catch(err => {
            console.log(err);
        })
    return scambi;
}

async function getMyScambi() {

    var userId = JSON.parse(localStorage.getItem('userId'));
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
    mieiScambi = [];
    await fetch(url + '/scambi/' + userId + '?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json };
        })
        .then(({ status, json }) => {
            if (status === 200) {
                mieiScambi = json;
            }
        })
        .catch(err => {
            console.log(err);
        })

    return mieiScambi;
}


async function getRandomMaghi(numberOfmaghi) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    maghi = [];
    await fetch(url + '/randomMaghi/' + numberOfmaghi + '?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json };
        })
        .then(({ status, json }) => {
            if (status == 200) {
                maghi = json;
            }
        })
        .catch(err => {
            console.log(err);
        })
    return maghi;
}

async function getAllCards() {

    const options = {
        method: "GET",
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };

    const allCards = await fetch(url + '/maghi/' + '?apikey=' + apikey, options)
        .then(async res => {
            json = await res.json();
            return ({ status: res.status, json: json })
        })
        .then(({ status, json }) => {
            if (status == 200) {
                return json;
            }
        })
        .catch(err => {
            showAlert('error', 'Errore di connessione al server');
            hideSpinner();
        });
    return allCards;
}

async function getCardById(cardId) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };

    const card = await fetch(url + `/cartaSingola/${cardId}?apikey=` + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json };
        })
        .then(({ status, json }) => {
            if (status == 200) {
                return json;
            }
        })
        .catch(err => {
            console.log(err);
        })
    return card
}

async function getUserCardById(cardId, userId) {
    if (userId == null)
        var userId = JSON.parse(localStorage.getItem('userId'));

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    var card = null;
    await fetch(url + `/carta/${userId}/${cardId}?apikey=` + apikey, options)
        .then(async (res) => {
            json = await res.json();
            return { status: res.status, json: json };
        })
        .then(({ status, json }) => {
            if (status == 200) {
                card = json;
            } else {
                card = null;
            }
        })
        .catch((err) => {
            console.log(err);
        })
    return card;
}

async function userHasCard(cardId, userId) {
    const card = await getUserCardById(cardId, userId);
    return card != null;
}

function showFoundCards(maghi, modal) {


    if (maghi.length <= 0) {
        return;
    }

    var card = document.getElementById('card-hero');


    for (i = 0; i < maghi.length; i++) {
        showCard(card, maghi[i], true);
    }

    if (modal) {
        const modal = new bootstrap.Modal(document.getElementById('cardsModal'));
        modal.show();
    }
}

function showCard(card, hero, possessed) {
    var clone = card.cloneNode(true);
    var image = clone.getElementsByClassName('card-img-top')[0];
    var name = clone.getElementsByClassName('card-title')[0];
    var description = clone.getElementsByClassName('card-description')[0];
    var house = clone.getElementsByClassName('card-house')[0];
    var cardPage = clone.getElementsByClassName('stretched-link')[0];
    var favoriteButton = clone.getElementsByClassName('btn btn-primary btn-fav')[0];

    if (cardPage != undefined) {
        cardPage.href = "heroCard.html?cardId=" + hero.id;
    }
    if (hero.image != "" && hero.image != null) {
        image.src = hero.image;
    }

    image.style = "width: 100%; height: 100%; object-fit: cover;";
    name.innerHTML = `<b>${hero.name}</b>`;

    if (!possessed) {

        image.style.filter = "grayscale(1)";
        description.innerHTML = `<p>Non possiedi questa carta</p>`
        house.innerHTML = "";

    } else {

        if (description != undefined) {
            if (description != undefined && hero.wand.wood != "") {
                description.innerHTML = `<h5>Wand:</h5><p><b>Wood:</b> ${hero.wand.wood}</p><p><b>Core:</b> ${hero.wand.core}</p>`;
            } else {
                description.innerHTML = `<p>No wand</p>`;
            }
        }

        if (house != undefined) {
            if (house != null && hero.house != "") {
                house.innerHTML = `<p><b>House:</b> ${hero.house}</p>`;
            } else {
                house.innerHTML = `<p>No house</p>`;
            }
        }
    }

    if (favoriteButton != undefined) {
        const fav_magician = JSON.parse(localStorage.getItem("favMagician"));
        if (localStorage.getItem("userId") != null) {
            if (hero.id == fav_magician) {
                favoriteButton.classList.add("btn-warning");
                favoriteButton.classList.add("disabled");
                favoriteButton.classList.remove("btn-primary");
                favoriteButton.innerHTML = "This is your favorite magician";
            } else {
                favoriteButton.innerHTML = "Change favorite magician";
                favoriteButton.setAttribute("onClick", `updateFavMagician('${hero.id}')`);
            }
        } else {
            favoriteButton.classList.add("disabled");
            favoriteButton.classList.remove("btn-primary");
            favoriteButton.innerHTML = "Login to set favorite magician";
        }

    }

    clone.classList.remove('d-none');
    card.after(clone);
}

if (!document.URL.includes("register.html") && !document.URL.includes("login.html")) {
    if (checkLogin()) {
        console.log("User logged in");
        document.getElementById('login_nav').classList.add("d-none");
        document.getElementById('user_nav').classList.remove("d-none");
    } else {
        document.getElementById('login_nav').classList.remove("d-none");
        document.getElementById('user_nav').classList.add("d-none");
    }
    document.getElementById('username').innerHTML = JSON.parse(localStorage.getItem('username'));
    document.getElementById("coins").innerHTML = localStorage.getItem("coins");
    document.getElementById("boostersNumber").innerHTML = localStorage.getItem("boostersNumber");
}


function showSpinner(button) {
    if (button == null) {
        document.getElementById("loading").classList.remove('d-none');
        document.getElementById("container").classList.add('d-none');
        return;
    }

    const card = button.closest('.card');
    const spinner = card.querySelector('.spinner-border');
    spinner.classList.remove('d-none');
}

function hideSpinner(button) {
    if (button == null) {
        document.getElementById("loading").classList.add('d-none');
        document.getElementById("container").classList.remove('d-none');
        return;
    }

    const card = button.closest('.card');
    const spinner = card.querySelector('.spinner-border');
    spinner.classList.add('d-none');
}

function pagination(currentPage, totalPages, linkPage) {
    const item = document.getElementsByClassName('page-item')[0];
    for (i = 2; i >= 0; i--) {

        const clone = item.cloneNode(true);
        const link = clone.getElementsByClassName('page-link')[0];
        switch (i) {
            case 0:
                if (currentPage == 1) {
                    link.classList.add('disabled');
                }
                link.innerHTML = currentPage - 1;
                link.href = linkPage + (currentPage - 1);
                break;
            case 1:
                link.innerHTML = currentPage;
                link.href = linkPage + currentPage;
                link.classList.add('active');
                break;
            case 2:
                if (currentPage == totalPages) {
                    link.classList.add('disabled');
                }
                link.innerHTML = currentPage + 1;
                link.href = linkPage + (currentPage + 1);
                break;
            default:
                break;
        }
        clone.classList.remove('d-none');
        item.after(clone);
    }

}

function paginatedCards(allCards, pageNumber, numberOfCards) {
    var currentCards = [];
    for (let i = (pageNumber - 1) * numberOfCards; i < pageNumber * numberOfCards; i++) {
        currentCards.push(allCards[i]);
    }
    return currentCards;
}

function startLoadingBar(duration, n) {
    if (n == null) {
        n = 2;
    }
    const progressBar = document.getElementsByClassName('progress-bar')[n];
    let progress = 0;

    // Calcola l'incremento per ogni intervallo
    const interval = 50; // Intervallo in millisecondi
    const increment = 100 / (duration / interval);

    // Aggiorna la barra di caricamento
    const loadingInterval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval); // Ferma l'intervallo quando la barra è piena
        }

        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }, interval);
}

function showOffers(offers) {
    const offerTemplate = document.getElementById("offer");

    for (let i = 0; i < offers.length; i++) {
        const offer = offers[i];
        const clone = offerTemplate.cloneNode(true);


        clone.querySelector("#offer-creator").textContent = offer.creator;

        clone.querySelector("#offered-card").textContent = offer.carteOfferte.map((carta) => (carta.name)).join(", ");
        clone.querySelector("#requested-card").textContent = offer.carteRichieste.map((carta) => (carta.name)).join(", ");
        var acceptButton = clone.querySelector(".btn");

        if (localStorage.getItem("userId") == null) {
            acceptButton.classList.add("disabled");
            acceptButton.innerHTML = "<b>Accedi per accettare l'offerta</b>";
        } else if (localStorage.getItem("userId").valueOf() == JSON.stringify(offer.userId)) {
            acceptButton.classList.add("disabled");
            acceptButton.innerHTML = "<b>Non puoi accettare la tua stessa offerta</b"
        } else {
            acceptButton.setAttribute("onclick", `accettaScambio('${offer._id}', this)`);
        }

        clone.classList.remove("d-none"); // Rimuove la classe nascosta
        offerTemplate.after(clone); // Aggiunge il clone al contenitore
    }
    document.getElementById("loading").classList.add('d-none');
}

async function accettaScambio(scambioId, button) {
    showSpinner(button);
    var userId = JSON.parse(localStorage.getItem("userId").valueOf())
    var scambio = await getScambioById(scambioId);
    if (scambio.userId == userId) {
        showAlert("error", "<strong>Non puoi accettare la tua stessa offerta</strong>");
        hideSpinner(button);
        return;
    }

    for (let i = 0; i < scambio.carteOfferte.length; i++) {
        if (await userHasCard(scambio.carteOfferte[i].id, userId)) {
            showAlert("error", "<strong>Non puoi accettare questa offerta, possiedi già una delle carte offerte: </strong>" + scambio.carteOfferte[i].name);
            hideSpinner(button);
            return;
        }
    }
    for (let i = 0; i < scambio.carteRichieste.length; i++) {
        const possedute = await getUserCardById(scambio.carteRichieste[i].id, userId);
        if (possedute == null || possedute.quantity <= 1) {
            showAlert("error", "<strong>Non puoi accettare questa offerta, non possiedi abbastanza copie della carta richiesta: </strong>" + scambio.carteRichieste[i].name);
            hideSpinner(button);
            return;
        }
    }


    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
    await fetch(url + '/accettaScambio/' + userId + '/' + scambioId + '?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status == 200) {
                showAlert("success", "<strong>Offerta accettata con successo</strong>");
                window.location.reload();
            } else {
                showAlert("error", "<strong>Errore!</strong>" + json.error);
            }
        })
        .catch(err => {
            showAlert("error", "<strong>Errore generico: </strong>" + err);
        })

    hideSpinner(button);
}

async function getScambioById(scambioId) {

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
    var offer = null;
    await fetch(url + '/scambio/' + scambioId + '?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status == 200) {
                offer = json;
            } else {
                offer = null;
            }
        })
        .catch((err) => {
            console.log(err);
        })
    return offer;
}
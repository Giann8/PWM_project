const apikey = 123456;


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

    await fetch('http://localhost:3001/login?apikey=123456', options)
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

if (document.URL.includes("userPage.html")) {
    const form = document.getElementById('update-email-form');
    form.addEventListener('submit', async () => await updateEmail());

    const form2 = document.getElementById('update-password-form');
    form2.addEventListener('submit', async () => await updatePassword());

    const form3 = document.getElementById('update-username-form');
    form3.addEventListener('submit', async () => await updateUsername());

    const deleteAccountButton = document.getElementById('delete-account-button');
    deleteAccountButton.addEventListener('click', async () => await deleteAccount());
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
            username: document.getElementById('username').value
        })
    }
    await fetch('http://localhost:3001/register?apikey=123456', options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        }
        )
        .then(({ status, json }) => {
            if (status === 200) {
                localStorage.setItem('userId', JSON.stringify(json._id));
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

    await fetch('http://localhost:3001/users/' + userId + '?apikey=123456', options)
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

    await fetch('http://localhost:3001/users/' + userId + '/updateEmail?apikey=' + apikey, options)
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
    console.log(old_password)
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

    await fetch('http://localhost:3001/users/' + userId + '/updatePassword?apikey=' + apikey, options)
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

    await fetch('http://localhost:3001/deleteUser/' + userId + '?apikey=' + apikey, options)
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

    await fetch('http://localhost:3001/users/' + userId + '/updateUsername?apikey=' + apikey, options)
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

    await fetch('http://localhost:3001/pacchetti?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status === 200) {
                boosters = json;
                console.log(json);
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
        description.innerHTML = `<p><b>Carte: </b>${booster.cardNumber} Prezzo: ${booster.cost}</p>`;


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

    const response = await fetch('http://localhost:3001/pacchetti/compraPacchetto/' + userId + '?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status === 200) {
                localStorage.setItem("coins", json.coins);
                localStorage.setItem("boostersNumber", Number(localStorage.getItem("boostersNumber")) + 1);
                document.getElementById("coins").innerHTML = json.coins;
                document.getElementById("boostersNumber").innerHTML = Number(localStorage.getItem("boostersNumber")) + 1;
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

    console.log(coins);
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

    await fetch('http://localhost:3001/users/' + userId + '/updateCoins?apikey=' + apikey, options)
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
    await fetch('http://localhost:3001/scambi?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status === 200) {
                scambi = json;
                console.log(json);
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
    await fetch('http://localhost:3001/scambi/' + userId + '?apikey=' + apikey, options)
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

async function getHeroes() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    heroes = [];
    await fetch('http://localhost:3001/heroes?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json };
        })
        .then(({ status, json }) => {
            if (status == 200) {
                heroes = json;
            }
        })
        .catch(err => {
            console.log(err);
        })
    return heroes;
}


async function getRandomHeroes(numberOfHeroes) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        }
    };
    heroes = [];
    await fetch('http://localhost:3001/randomHeroes/' + numberOfHeroes + '?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json };
        })
        .then(({ status, json }) => {
            if (status == 200) {
                heroes = json;
            }
        })
        .catch(err => {
            console.log(err);
        })
    return heroes;
}

function showHeroesPossessed(heroes, modal) {
    if (heroes.length == 0) {
        return;
    }

    var card = document.getElementById('card-hero');

    for (i = 0; i < heroes.length; i++) {
        showCard(card, heroes[i], true);
    }

    if (modal) {
        const modal = new bootstrap.Modal(document.getElementById('cardsModal'));
        modal.show();
    }
}

/**
 * 
 * @param {*} allHeroes 
 * @param {Object[]} myHeroes 
 */
function showHeroes(allHeroes, myHeroes) {
    var card = document.getElementById('card-hero');
    for (i = 0; i < allHeroes.length; i++) {
        if (!myHeroes.includes(allHeroes[i])) {
            var hero = allHeroes[i];
            var clone = card.cloneNode(true);
            var image = clone.getElementsByClassName('card-img-top')[0];
            var name = clone.getElementsByClassName('card-title')[0];
            var description = clone.getElementsByClassName('card-description')[0];

            image.src = hero.image;
            name.innerHTML = `<b>${hero.name}</b>`;

            if (description != null)
                description.innerHTML = `<p>${hero.description}</p>`;


            clone.classList.remove('d-none');
            card.after(clone);
        } else {
            showHeroesPossessed(allHeroes[i], false);
        }
    }
}
function showCard(card, hero, possessed) {
    var clone = card.cloneNode(true);
    var image = clone.getElementsByClassName('card-img-top')[0];
    var name = clone.getElementsByClassName('card-title')[0];
    var description = clone.getElementsByClassName('card-description')[0];

    image.src = hero.image;
    name.innerHTML = `<b>${hero.name}</b>`;
    if (description != null)
        description.innerHTML = `<p>${hero.description}</p>`;

    if (!possessed) {
        image.style.filter = "grayscale(1)";
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
        return;
    }
    const card = button.closest('.card');
    const spinner = card.querySelector('.spinner-border');
    spinner.classList.remove('d-none');
}

function hideSpinner(button) {
    if (button == null) {
        document.getElementById("loading").classList.remove('d-none');
        return;
    }
    const card = button.closest('.card');
    const spinner = card.querySelector('.spinner-border');
    spinner.classList.add('d-none');
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
        progressBar.setAttribute('aria-valuenow', progress + 1);
    }, interval);
}
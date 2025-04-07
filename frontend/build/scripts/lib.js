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
                localStorage.setItem('username', JSON.stringify(json.username));
                localStorage.setItem('coins', JSON.parse(json.coins));
                localStorage.setItem('boostersNumber', json.boosters.length);
                document.getElementById('utente').innerHTML = json.username;
                document.getElementById('old-email').value = json.email;
                document.getElementById('coins').innerHTML = json.coins;

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

    await fetch('http://localhost:3001/pacchetti/compraPacchetto/' + userId + '?apikey=' + apikey, options)
        .then(async (res) => {
            const json = await res.json();
            return { status: res.status, json: json }
        })
        .then(({ status, json }) => {
            if (status === 200) {
                localStorage.setItem("coins", json.coins);
                window.setTimeout(()=>{window.location.reload()},500)
            } else {
                document.getElementById("error-alert").classList.remove("d-none");
                document.getElementById("error").innerHTML = `<strong>Errore!</strong>` + json.error;
            }
        })
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
                    localStorage.setItem("coins",json.coins)
                    window.location.reload();
            } else {
                document.getElementById("error").classList.remove("d-none");
                document.getElementById("error").innerHTML = "Errore: " + json.error;
            }
        })
        .catch(err => {
            alert("errore: " + err);
        })
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
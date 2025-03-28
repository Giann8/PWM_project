

async function login() {
    if (!checkValidEmail() && !checkValidPassword()) {
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
    var message_error = document.getElementsByClassName('error-message');
    var email = document.getElementById('email').value;
    var re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
        message_error[0].innerHTML = "Invalid email";
        message_error[0].classList.remove("d-none");
        document.getElementById('email').classList.add("is-invalid");
        return false;
    } else {
        message_error[0].classList.add("d-none");
        document.getElementById('email').classList.remove("is-invalid");
        return true;
    }
}

function checkValidPassword() {
    var message_error = document.getElementsByClassName('error-message');
    var password = document.getElementById('password').value;
    if (password.length < 8) {
        message_error[1].innerHTML = "Password must be at least 8 characters long";
        message_error[1].classList.remove("d-none");
        document.getElementById('password').classList.add("is-invalid");
        return false;
    } else {
        message_error[1].classList.add("d-none");
        document.getElementById('password').classList.remove("is-invalid");
        return true;
    }
}

const form = document.getElementById('form');

if (document.URL.includes("login.html")) {
    form.addEventListener('submit', async () => await validateAndLogin());
}

async function validateAndLogin() {
    if (checkValidEmail() && checkValidPassword()) {
        await login();
    }
}

async function checkLogin() {
    if (localStorage.getItem('userId') == null) {
        window.location.href = "http://localhost:3000/login.html";
        console.log("User not logged in");
    } else {
        console.log("User logged in");
        await getUserInfo();
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
                document.getElementById('username').innerHTML = json.username;
                document.getElementById('email').innerHTML = json.email;
                document.getElementById('name').innerHTML = json.name;
                document.getElementById('surname').innerHTML = json.surname;
            } else {
                console.log("Error fetching user info");
            }
        })
        .catch(err => {
            document.getElementById('error').innerHTML = "Unknown error: " + err;
        })
}
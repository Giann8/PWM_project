
async function login() {

    var message_error = document.getElementsByClassName('error-message');

    await fetch('http://192.168.1.154:3001/login?apikey=123456', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            email: document.getElementById('Email').value,
            password: document.getElementById('Password').value
        })
    })
        .then(res => res.json())
        .catch(err => {
            console.log(err);
            message_error[1].innerHTML = "Invalid credentials";
            message_error[1].classList.remove("d-none");
            document.getElementById('Email').classList.add("border-danger");
            document.getElementById('Password').classList.add("border-danger");
        })
}

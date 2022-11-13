var user = localStorage.getItem("user"); //load logged user from local storage
login_btn();
function login_btn(){
  var user = localStorage.getItem("user"); //load logged user from local storage
if (user !== null) {
  document.getElementById('login_welcome').innerHTML = "Vítej " + user;//send a welcome message
  document.getElementById('login_list').innerHTML = '<div class="login">' + 
  '<ul>' +
  '<li id="logout" onclick=logOut() class="list">'+
  '<a>'+
  '<span class="icon"><ion-icon name="log-out-outline"></ion-icon></span>'+
  '<span class="text">Odhlášení</span>'+
  '</a>'+
  '</li>'+
  '</ul>'+
  '</div>';
}else{
  document.getElementById('login_list').innerHTML = '<div class="login">' + 
  '<ul>' +
  '<li id="login" onclick=logIn() class="list">' + 
  '<a>' +
  '<span class="icon"><ion-icon name="log-in-outline"></ion-icon></span>' +
  '<span class="text">Přihlášení</span>' +
  '</a>' +
  '</li>'+
  '</ul>'+
  '</div>';
  
}
}
//Functions

function Status(status) {
  var Response_text;
  if ((String(status)).startsWith('1')) {
    switch (status) {
      case 100:
        Response_text = "Continue";
        break;
      default:
        break;
    }
  } else if ((String(status)).startsWith('2')) {
    switch (status) {
      case 200:
        Response_text = "OK";
        break;
      default:
        break;
    }
  } else if ((String(status)).startsWith('3')) {
    switch (status) {
      case value:

        break;
      default:
        break;
    }
  } else if ((String(status)).startsWith('4')) {
    switch (status) {
      case value:

        break;
      default:
        break;
    }
  } else {
    switch (status) {
      case value:

        break;
      default:
        break;
    }
  }
  return Response_text;
  
}
/* LOGIN */
async function logIn() {
  const { value: formValues } = await Swal.fire({
    title: 'Login',
    html:
      '<input id="login_name" placeholder="Nickname" class="swal2-input">' +
      '<form><input id="login_pswrd" type="password" autocomplete="on" placeholder="Password" class="swal2-input"></form>',
    focusConfirm: false,
    showCancelButton: true,
    footer: '<a href="#" onclick="register();">Not registered? </a>',
    preConfirm: () => {
      return [
        document.getElementById('login_name').value,
        document.getElementById('login_pswrd').value
      ]
    }
  })
  let login = { name: document.getElementById('login_name').value, password: document.getElementById('login_pswrd').value }; // make an object login with values
  if (formValues) {
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': login.name,
        'password': login.password
      })
    };
    fetch(`/login`, requestOptions) //fetch data from request
      .then(result => result.json()
        .then(json => { console.log("response: ", Status(result.status), "logged in: ", json.valid);

          if (json.valid == true) {
            localStorage.setItem("user", login.name);
            document.getElementById('login_welcome').innerHTML = "Welcome " + login.name;//send a welcome message
            user = localStorage.getItem("user");
            login_btn();
            Swal.fire({ //match
              toast: true,
              timerProgressBar: true,
              position: 'top-end',
              icon: 'success',
              title: 'logged in as ' + login.name,
              showConfirmButton: false,
              timer: 3000,

            })
          } else { // password or name don´t match
            Swal.fire({
              position: 'top-end',
              timerProgressBar: true,
              toast: true,
              showConfirmButton: false,
              icon: 'error',
              title: 'Name or Password don´t match!',
              footer: '<a href="#" onclick="register();">Not registered? </a>',
              timer: 5000,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })
          }
        }))

  }
}

/* LOGOUT*/
async function logOut() {
  localStorage.removeItem("user");
  document.getElementById('login_welcome').innerHTML = "" 
  login_btn();
  Swal.fire({ //match
    position: 'top-end',
    icon: 'info',
    toast: true,
    text: 'Byly jste odhlášeni',
    showConfirmButton: false,
    timer: 3000
  })
}

//registration

async function register() {
const { value: password } = await Swal.fire({
  title: 'Registrace',
  html:'<input id="register_name" placeholder="Jméno" class="swal2-input">',
  input: 'password',
  inputPlaceholder: 'Heslo',
  showCancelButton: true,
  footer: '<a href="#" onclick="logIn();">Už jste registrováni? </a>',
  inputValidator: (value) => {
    if (!value.match(/^.{8,}$/g)) {
      return 'Alespoň 8 znaků'
    }
    if (!value.match(/[a-z]/g)) {
      return 'Alespoň 1 malé písmeno'
    }
    if (!value.match(/[A-Z]/g)) {
      return 'Alespoň 1 Velké písmeno'
    }
    if (!value.match(/\d/g)) {
      return 'Alespoň 1 číslo'
    }
    if (value == document.getElementById('register_name').value){
      return 'Heslo se nesmí shodovat s jménem' 
    }
  },
  preConfirm: (value) => {
    return  value
  }
})
let register = {name: document.getElementById('register_name').value, password: password}; // make an object register with values
if (password) {
requestOptions = {
method: 'POST',
headers: {
  'Content-Type': 'application/json'
},
body: JSON.stringify({
  'username': register.name,
  'password': register.password
})
};
fetch(`/register`, requestOptions) //fetch data from request
.then(result => result.json()
  .then(json => { console.log("response: ", Status(result.status), "Registered: ", json.valid);

  if(json.valid == true){
Swal.fire({ //match
icon: 'success',
text: 'Úspěšně pregistrován jako ' + register.name + ' nyní se můžete přihlásit',
footer: '<a href="#" onclick="logIn();">Klikni pro přihlášení </a>',
showConfirmButton: false,
confirmButtonText: 'Dismiss',
timer: 5000
})
}else{ //name already exists
Swal.fire({
icon: 'error',
text: 'Jejda... uživatel s tímto jménem už existuje',
footer: '<a href="#" onclick="login();">Už jste registrovaní? </a>',
confirmButtonText: 'Dismiss',
timer: 5000
})


} })) }
}
function start(){
if(localStorage.getItem("user") == null){
  logIn()
}else{
  window.open("./zarizeni.html","_self");
}
}
addEventListener('storage', (event) => { });
onstorage = (event) => { 
  logOut();
}
var user = localStorage.getItem("user"); //load logged user from local storage
login_btn();
function login_btn(){
  var user = localStorage.getItem("user"); //load logged user from local storage
if (user !== null) {
  document.getElementById('login_welcome').innerHTML = "Welcome " + user;//send a welcome message
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
      text: 'You have been logged out',
      showConfirmButton: false,
      timer: 3000
    })
    /*setTimeout(function() {

      window.location = window.location.href;
    }, 3500);*/
}

//registration

async function register() {
  const { value: formValues } = await Swal.fire({
title: 'Register',
html:
  '<input id="register_name" placeholder="Nickname" class="swal2-input">' +
  '<form><input id="register_pswrd" type="password" autocomplete="on" placeholder="Password" class="swal2-input"></form>',
focusConfirm: false,
showCancelButton: true,
footer: '<a href="#" onclick="logIn();">Already registered? </a>',
preConfirm: () => {
  return [
    document.getElementById('register_name').value,
    document.getElementById('register_pswrd').value
         ]
}
})
let register = {name: document.getElementById('register_name').value, password: document.getElementById('register_pswrd').value}; // make an object register with values
if (formValues) {
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
position: 'top-end',
icon: 'success',
text: 'successfully registered as ' + register.name + ' you can now login',
footer: '<a href="#" onclick="login();">Click to Login </a>',
showConfirmButton: false,
confirmButtonText: 'Dismiss',
timer: 5000
})
  }else{ //name already exists
  Swal.fire({
position: 'top-end',
icon: 'warning',
text: json.valid,
footer: '<a href="#" onclick="login();">Already registered? </a>',
confirmButtonText: 'Dismiss',
timer: 5000
})


} })) }}

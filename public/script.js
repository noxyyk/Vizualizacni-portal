const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
// HTML
async function login_btn(){
  var user = localStorage.getItem("user")
  var pfp = localStorage.getItem("pfp")
  pfp = pfp? '<img class="pfp" style="border-radius: 50%;"  referrerpolicy="no-referrer" src="'+ pfp + '">' : '<ion-icon name="accessibility-outline"></ion-icon>'
  document.getElementById('login_welcome').innerHTML = user == null? "" : "Vítej " + user
  if (user == null) {
    document.getElementById("dropdown_account").style.display= "none";
    document.getElementById("login_list").style.display= "inline-block";
    document.getElementById('login_list').innerHTML ='<div class="login">' + '<ul>' + '<li  id="login" onclick=logIn() class="list">' + '<a>' + '<span class="icon"><ion-icon name="log-in-outline"></ion-icon></span>' + '<span class="text">Přihlášení</span>' +   '</a>' + '</li>'+  '</ul>'+  '</div>'
  }else{
    document.getElementById("dropdown_account").style.display= "inline-block";
    document.getElementById("login_list").style.display= "none";
    document.getElementById('dropdown_account').innerHTML = '<button class="dropbtn" style="width:100%;height:100%;display:flex;padding:10px;align-items:center;justify-content:center;border-radius: 50%;">' + pfp + '</button>' + 
  '<div class="dropdown-content"><a onclick=account()><span class="icon"><ion-icon name="settings-outline"></ion-icon></span><span class="text"> Účet</span></a><a onclick=logOut()><span class="icon"><ion-icon name="log-out-outline"></ion-icon></span><span class="text">Odhlášení</span></a></div>'
  }
}
// INIT
verifyToken()
login_btn()
//Functions
function time(s) {
  var day = Math.floor(s / 86400);
  var hour = Math.floor((s % 86400) / 3600);
  var minute = Math.floor(((s % 86400) % 3600) / 60);
  var second = ((s % 86400) % 3600) % 60;
  return day > 1 ? day + " dny": day == 1? day + " dnem": hour > 1 ? hour + " hodinami" : hour == 1? hour + " hodinou" : minute > 1 ? minute + " minutami" : minute == 1? minute + " minutou" : second + " sekundami"
}
function verifyToken(){
  var token = localStorage.getItem("token")
  if (token == null) return

  requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'token': token
    })
  };
  fetch(`/verify`, requestOptions) //fetch data from request
    .then(result => result.json()
      .then(json => { console.log("response: ", Status(result.status));
      if (json.valid) return true
      localStorage.removeItem("token");
          login_btn();
          Swal.fire({ 
            timerProgressBar: true,
            position: 'bottom-end',
            toast: true,
            icon: 'warning',
            text: json.response.name == 'TokenExpiredError'? 'Token expiroval před ' + time(Math.floor(((new Date().getTime())-(new Date(json.response.expiredAt).getTime()))/1000)) + ', přihlášení je vyžadováno' : 'Token je neplatný, přihlášení je vyžadováno' ,
            showConfirmButton: false,
            timer: 10000,
          })
          return false
      }))
}
function swalError(response){
  Swal.fire({
    icon: 'error',
    title: 'Jejda...',
    text: response
  })
}
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
        case 201:
        Response_text = "Created";
        break;
      default:
        Response_text = "Unexpected Output";
        break;
    }
  } else if ((String(status)).startsWith('3')) {
    switch (status) {
      case value:

        break;
      default:
        Response_text = "Unexpected Output";
        break;
    }
  } else if ((String(status)).startsWith('4')) {
    switch (status) {
      case 401:
        Response_text = "Unauthorized";
        break;
      case 404:
        Response_text = "Not Found";
        break;
        case 409:
        Response_text = "Already exists";
        break;
      default:
        Response_text = "Unexpected Output";
        break;
    }
  } else {
    switch (status) {
      case 500:
        Response_text = "Internal Server Error";
        break;
      default:
        Response_text = "Unexpected Output";
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
      '<input id="login_name" placeholder="Jméno" autocomplete="on" class="swal2-input">' +
      '<form><input id="login_pswrd" type="password" autocomplete="on" placeholder="Heslo" class="swal2-input"></form>',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Přihlásit',
    cancelButtonText: 'Zrušit',
    footer: '<a href="#" onclick="register();">Nejste registrován? </a>',
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
        .then(json => { console.log("response: ", Status(result.status));
        if (!json.valid) return swalError(json.response)

            localStorage.setItem("user", login.name);
            localStorage.setItem("pfp", json.pfp);
            localStorage.setItem("token", json.token);
            login_btn();
            Swal.fire({
              toast: true,
              timerProgressBar: true,
              position: 'bottom-end',
              icon: 'success',
              title: 'logged in as ' + login.name,
              showConfirmButton: false,
              timer: 3000,
            })
        }))
  }
}

/* LOGOUT*/
async function logOut() {
  localStorage.removeItem("user");
  localStorage.removeItem("pfp");
  login_btn();
  
  
    Swal.fire({ //match
      position: 'bottom-end',
      icon: 'info',
      toast: true,
      text: 'Byli jste odhlášeni',
      showConfirmButton: false,
      timer: 3000
    })
}

//registration

async function register() {
  const { value: register } = await Swal.fire({
  title: 'Registrace',
  html:`<input type="text" id="name" autocomplete="on" class="swal2-input" placeholder="Jméno">
  <form><input type="password" id="password" class="swal2-input" placeholder="Heslo" autocomplete="on"></form>`,
  showCancelButton: true,
  confirmButtonText: 'Registrovat',
  cancelButtonText: 'Zrušit',
  footer: '<a href="#" onclick="logIn();">Už jste registrováni? </a>',
    preConfirm: () => {
      const login = Swal.getPopup().querySelector('#name').value
      const password = Swal.getPopup().querySelector('#password').value
    if (!password.match(/[a-z]/g))    Swal.showValidationMessage('Heslo musí obsahovat alespoň jedno malé písmeno')
    if (!password.match(/[A-Z]/g))    Swal.showValidationMessage('Heslo musí obsahovat alespoň jedno velké písmeno')
    if (!password.match(/\d/g))       Swal.showValidationMessage('Heslo musí obsahovat alespoň jedno číslo')
    if (password == login)  	        Swal.showValidationMessage('Heslo se nesmí shodovat s jménem' )
    if (!password.match(/^.{8,}$/g))  Swal.showValidationMessage('Heslo musí mít alespoň 8 znaků')
    if(login.match(/[^a-zA-Z0-9]/g))  Swal.showValidationMessage('Jméno nesmí obsahovat speciální znaky')
    if(login.length < 4)              Swal.showValidationMessage('Jméno musí mít alespoň 4 znaky')
    if (!login || !password)          Swal.showValidationMessage(`Vyplňte prosím jméno a heslo`)

    return { login: login, password: password }
  },
})
if(register){
  requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'username': register.login,
      'password': register.password
    })
    };
    fetch(`/register`, requestOptions) //fetch data from request
    .then(result => result.json()
      .then(json => { console.log("response: ", Status(result.status));
      if (!json.valid) return swalError(json.response)
      
      Swal.fire({ //match
      icon: 'success',
      text: 'Úspěšně registrován jako ' + register.login + ' nyní se můžete přihlásit',
      footer: '<a href="#" onclick="logIn();">Klikni pro přihlášení </a>',
      showConfirmButton: false,
      confirmButtonText: 'Dismiss',
      timer: 5000
    }) 
  }))
}
}
async function account(type) {
  switch (type) {
    case "username":
      const { value: username } = await Swal.fire({
        title: 'Změna jména',
        html:`<form><input type="text" id="name" autocomplete="on" class="swal2-input" placeholder="Nové jméno" ></form>`,
        showCancelButton: true,
        confirmButtonText: 'Zněnit jméno',
        cancelButtonText: 'Zrušit',
          preConfirm: () => {
           return Swal.getPopup().querySelector('#name').value
        },
      })
      if(username){
        requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'username': localStorage.getItem("user"),
            'name': username,
            'type': 'name'
          })
          };
          fetch(`/change`, requestOptions) //fetch data from request
          .then(result => result.json()
            .then(json => { console.log("response: ", Status(result.status));
            if (!json.valid) return swalError(json.response)

            localStorage.setItem("user", username);
            document.getElementById('login_welcome').innerHTML = "Vítej " + user;
            Swal.fire({ //match
            icon: 'success',
            text: 'Změna jména proběhla úspěšně',
            showConfirmButton: false,
            confirmButtonText: 'Dismiss',
            timer: 5000
            })
           }))
      }
  break;
    case "password":
      const { value: value } = await Swal.fire({
        title: 'Změna hesla',
        html:`<form><input type="password" id="password" autocomplete="on" class="swal2-input" placeholder="Nové heslo" ></form>
              <form><input type="password" id="password_again" autocomplete="on" class="swal2-input" placeholder="Nové heslo znovu" ></form>`,
        showCancelButton: true,
        confirmButtonText: 'Zněnit heslo',
        cancelButtonText: 'Zrušit',
          preConfirm: () => {
            const password_again = Swal.getPopup().querySelector('#password_again').value
            const password = Swal.getPopup().querySelector('#password').value
      
          if (!password.match(/[a-z]/g))   Swal.showValidationMessage('Heslo musí obsahovat alespoň jedno malé písmeno')
          if (!password.match(/[A-Z]/g))   Swal.showValidationMessage('Heslo musí obsahovat alespoň jedno velké písmeno')
          if (!password.match(/\d/g))      Swal.showValidationMessage('Heslo musí obsahovat alespoň jedno číslo')
          if (password != password_again)  Swal.showValidationMessage('Heslo se musí shodovat' )
          if (!password.match(/^.{8,}$/g)) Swal.showValidationMessage('Heslo musí mít alespoň 8 znaků')
          if (!password_again || !password)Swal.showValidationMessage(`Vyplňte prosím oboje pole`)

          return password
        },
      })
      if(value){
        requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'username': localStorage.getItem("user"),
            'password': value,
            'type': 'password'
          })
          };
          fetch(`/change`, requestOptions) //fetch data from request
          .then(result => result.json()
            .then(json => { console.log("response: ", Status(result.status));
            if (!json.valid) return swalError(json.response)
            
            Swal.fire({ 
            icon: 'success',
            text: 'Změna hesla proběhla úspěšně',
            showConfirmButton: false,
            confirmButtonText: 'Dismiss',
            timer: 5000
            }).then(() => {logOut()})
           }))
      }
  break;
    case "email"://not yet implemented
  break;
    case "delete":
      requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'username': localStorage.getItem("user")
        })
        };
        fetch(`/delete`, requestOptions) //fetch data from request
        .then(result => result.json()
          .then(json => { console.log("response: ", Status(result.status));
          if (!json.valid) return swalError(json.response)
          localStorage.removeItem("user");
          localStorage.removeItem("pfp");
        Swal.fire({ //match
        icon: 'success',
        text: 'Účet byl úspěšně smazán',
        showConfirmButton: false,
        confirmButtonText: 'Dismiss',
        timer: 5000
        })
         }))
        delay(5000).then(() => {
        logOut();
        })
  break;
  default:
    Swal.fire({
      title: 'Účet',
      html: 'Jméno: ' + localStorage.getItem("user") +' '+'<button id="username" onclick=account("username") class="btn btn-warning">' + 'Změnit jméno' + '</button><br>Heslo: ********** <button onclick=account("password") id="password" class="btn btn-warning">' + 'Změnit heslo' + '</button><br><button onclick=logOut() class="btn btn-danger">' + 'Odhlásit se' + '</button><br> <button onclick=account("delete") id="delete" class="btn btn-danger" style="color: red">' + 'Smazat účet' + '</button><br>',
    })
  break;
  }

}
function start(){
if(localStorage.getItem("user") == null) return logIn()
  window.open("./zarizeni.html","_self");
}

onstorage = (event) => { 
  console.log("storage event");
  if (event.key == 'token' && event.newValue != null) if(!verifyToken()) logOut()
  
};


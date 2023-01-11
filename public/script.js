const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const page = "api.vizualizacni-portal.noxyyk.com";
//set custom swal fire
var toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
Swal = Swal.mixin({
  denyButtonColor: '#d33',
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Potvrdit',
  denyButtonText: 'Zrušit',
  cancelButtonText: 'Zrušit',
  allowOutsideClick: false,
  focusConfirm : false,
})
var notif = Swal.mixin({
  position: 'center',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  allowOutsideClick: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
// HTML
async function login_btn(){
  var user = localStorage.getItem("user")
  try{user = JSON.parse(user)}catch{user = null}
  var pfp = user?.pfp == null  || typeof user.pfp != "string" || (!user.pfp.includes("https://") && !user.pfp.includes("./images/avatar_"))? '<ion-icon name="accessibility-outline"></ion-icon>' : '<img onclick="account()" class="pfp" style="border-radius: 50%;"  referrerpolicy="no-referrer"alt="logo" src="'+  user.pfp  + '">' 
  if (user?.token == null) {
    document.getElementById("dropdown_account").style.display= "none";
    document.getElementById("login_list").style.display= "inline-block";
    document.getElementById('login_list').innerHTML ='<div class="login">' + '<ul>' + '<li  id="login" onclick=logIn() class="list">' + '<a>' + '<span class="icon"><ion-icon name="log-in-outline"></ion-icon></span>' + '<span class="text">Přihlášení</span>' +   '</a>' + '</li>'+  '</ul>'+  '</div>'
  }else{
    document.getElementById("dropdown_account").style.display= "inline-block";
    document.getElementById("login_list").style.display= "none";
    document.getElementById('dropdown_account').innerHTML = '<button class="dropbtn dropbtn_animation"style="width:100%;height:100%;display:flex;padding:10px;align-items:center;justify-content:center;border-radius: 50%;">' + pfp + '</button>' + 
  '<div class="dropdown-content animation"><a onclick=account()><span class="icon"><ion-icon name="settings-outline"></ion-icon></span><span class="text"> Účet</span></a><a onclick=logOut()><span class="icon"><ion-icon name="log-out-outline"></ion-icon></span><span class="text"> Odhlášení</span></a>'+ (user.admin? '<a onclick=userlist()><span class="icon"><ion-icon name="people-outline"></ion-icon></span><span class="text"> Uživatelé</span></a>' : '' )+'</div>'
  }
    document.getElementById('login_welcome').innerHTML = user == null || user?.user == undefined ? "" : user.user + " | " + (user.admin? "administrátor" : user.role)
    animations()
  }
// INIT
verifyToken()
login_btn()
//Functions
function time(s) {
  var year = Math.floor(s / 31536000);
  var day = Math.floor(s / 86400);
  var hour = Math.floor((s % 86400) / 3600);
  var minute = Math.floor(((s % 86400) % 3600) / 60);
  var second = Math.round(((s % 86400) % 3600) % 60);
  return year > 0? (year + year == 1? " rokem": " lety"): day > 1 ? day + " dny": day == 1? day + " dnem": hour > 1 ? hour + " hodinami" : hour == 1? hour + " hodinou" : minute > 1 ? minute + " minutami" : minute == 1? minute + " minutou" : second + " sekundami"
}
function listsGetSortCompare(type, direction) {
  var compareFuncs = {
      'NUMERIC': function(a, b) {
          return Number(a) - Number(b);
      },
      'TEXT': function(a, b) {
          return a.ID.toString() > b.ID.toString() ? 1 : -1;
      },
      'TEXT_NOCASE': function(a, b) {
          return a.ID.toString().toLowerCase() > b.ID.toString().toLowerCase() ? 1 : -1;
      },
      'DATE': function(a, b) {
          return b.data.user.createdTimestamp > a.data.user.createdTimestamp? 1 : -1;
      },
      'DATE2': function(a, b) {
        if (a.data.user.loggedTimestamp == undefined) return 1
        return b.data.user.loggedTimestamp > a.data.user.loggedTimestamp? 1 : -1;
    },
      'ROLE': function(a, b) {
        let arole = (a.data.user.admin ? 3 : a.data.user.role == "advanced" ? 2 : 1)
        let brole = (b.data.user.admin ? 3 : b.data.user.role == "advanced" ? 2 : 1)
        if (arole == brole) return a.data.user.loggedTimestamp > b.data.user.loggedTimestamp ? 1 : -1;
        return arole > brole? 1 : -1;
      }
  };
  var compare = compareFuncs[type];
  return function(a, b) {
      return compare(a, b) * direction;
  };
}
function verifyToken(){
  var validation = true
  var token = localStorage.getItem("user")
  try { token = JSON.parse(token).token } catch { token = null}
  if (token == null) return false
  requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      referrer: "https://api.vizualizacni-portal.noxyyk.com/"
    },
    body: JSON.stringify({
      'token': token
    })
  };
  fetch("/verify", requestOptions) //fetch data from request
    .then(result => result.json()
      .then(json => { console.log("response: ", Status(result.status));
      if (json.valid){ validation = true;
        localStorage.setItem("user",JSON.stringify({"email":json.email,"user": json.user, "pfp": json.pfp, "token": token, "createdTimestamp": json.createdTimestamp, "admin": json.admin, "ID": json.ID, "role": json.role}))
        return
      }
      localStorage.removeItem("user");
      login_btn();
      validation = false
      toast.fire({ 
            icon: 'warning',
            text: json.response.name == 'TokenExpiredError'? 'Token expiroval před ' + time(Math.floor(((new Date().getTime())-(new Date(json.response.expiredAt).getTime()))/1000)) + ', přihlášení je vyžadováno' : 'Token je neplatný, přihlášení je vyžadováno',
            timer: 10000
          })
      }))
return validation
}
function swalError(response){
  notif.fire({
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
      '<form><input id="login_name" type="name" placeholder="Jméno" autocomplete="on" class="swal2-input"></form>' +
      '<form><input id="login_pswrd" type="password" autocomplete="on" placeholder="Heslo" class="swal2-input"></form>',
    input: 'checkbox',
    inputValue: 1,
    inputPlaceholder: 'Zůstat přihlášen',
    showCancelButton: true,
    confirmButtonText: 'Přihlásit',
    footer: '<a href="#" onclick="register();">Nejste registrován? </a>',
    preConfirm: (result) => {
      return [
        document.getElementById('login_name').value,
        document.getElementById('login_pswrd').value,
        result == 1? true : false
      ]
    }
  })
  if (formValues) {
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        referrer: "https://api.vizualizacni-portal.noxyyk.com/"
      },
      body: JSON.stringify({
        'username': formValues[0],
        'password': formValues[1],
        'stayLogged': formValues[2] 
      })
    };
    fetch("/login", requestOptions) //fetch data from request
      .then(result => result.json()
        .then(json => { console.log("response: ", Status(result.status));
        if (!json.valid) return swalError(json.response)
        localStorage.setItem("user",JSON.stringify({"user": formValues[0], "pfp": json.pfp, "token": json.token, "createdTimestamp": json.createdTimestamp, "admin": json.admin, "ID": json.ID, "role": json.role}))
            login_btn();
            toast.fire({
              icon: 'success',
              title: 'logged in as ' + formValues[0]
            })
        }))
  }
}

/* LOGOUT*/
async function logOut() {
  localStorage.removeItem("user");
  login_btn();
  
  
    toast.fire({ //match
      icon: 'info',
      text: 'Byli jste odhlášeni',
    })
}

//registration

async function register() {
  const register = async () => {
    Swal.showLoading()
    const name = Swal.getPopup().querySelector('#name').value
    const password = Swal.getPopup().querySelector('#password').value
    var validationErrors = []
    if (!name || !password)         { Swal.showValidationMessage('Vyplňte prosím všechna pole'); return undefined}
    if(name.match(/[^a-zA-Z0-9]/g) || name.length < 4) validationErrors.push('nesmí obsahovat speciální znaky a musí mít alespoň 4 znaky')
    if (validationErrors.length > 0)      return Swal.showValidationMessage("jméno: " + validationErrors.join(', '));
    if (!password.match(/[a-z]/g))   validationErrors.push('alespoň jedno malé písmeno')
    if (!password.match(/[A-Z]/g))   validationErrors.push('alespoň jedno velké písmeno')
    if (!password.match(/\d/g))      validationErrors.push('alespoň jedno číslo')
    if (password == name)  	       validationErrors.push('nesmí být stejné jako jméno')
    if (!password.match(/^.{8,}$/g)) validationErrors.push('alespoň 8 znaků')
    if (validationErrors.length > 0)      return Swal.showValidationMessage("heslo: " + validationErrors.join(', '));

    const data = {"username": name, "password": password };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
      referrer: "https://api.vizualizacni-portal.noxyyk.com/" },
      body: JSON.stringify(data)
  }
  try {
    const response = await fetch("/register", options);
    const json = await response.json();
    if (!json.valid) {
        Swal.hideLoading();
        return Swal.showValidationMessage(json.response);
    }
    notif.fire({
        icon: 'success',
        text: `Úspěšně registrován jako ${name}. nyní se můžete přihlásit.`,
        footer: '<a href="#" onclick="logIn();">Klikni pro přihlášení </a>'
    });
} catch (error) {
    console.error(error);
    Swal.hideLoading();
    Swal.showValidationMessage('Nastala chyba');
}
  };
  Swal.fire({
  title: 'Registrace',
  html:`<input type="text" id="name" autocomplete="on" class="swal2-input" placeholder="Jméno">
  <form><input type="password" id="password" class="swal2-input" placeholder="Heslo" autocomplete="on"></form>`,
  showCancelButton: true,
  confirmButtonText: 'Registrovat',
  footer: '<a href="#" onclick="logIn();">Už jste registrováni? </a>',
    preConfirm: register
})
}

async function account(type) {
  switch (type) {
    case "username":
      await Swal.fire({
        title: 'Změna jména',
        html:`<form><input type="text" id="name" autocomplete="on" class="swal2-input" placeholder="Nové jméno" ></form>`,
        showCancelButton: true,
        confirmButtonText: 'Zněnit jméno',
          preConfirm: () => {  
            let username = Swal.getPopup().querySelector('#name').value
            if (username == JSON.parse(localStorage.getItem("user")).user) return Swal.showValidationMessage(`zvolené jméno je stejné jako předtím`)
            if(username.match(/[^a-zA-Z0-9]/g)) return Swal.showValidationMessage('Jméno nesmí obsahovat speciální znaky')
            if(username.length < 4)             return Swal.showValidationMessage('Jméno musí mít alespoň 4 znaky')
            Swal.showLoading()
            requestOptions = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                referrer: "https://api.vizualizacni-portal.noxyyk.com/"
              },
              body: JSON.stringify({
                'username': JSON.parse(localStorage.getItem("user")).user,
                'username_new': username,
                'type': 'name'
              })
              };
              fetch("/change", requestOptions) //fetch data from request
              .then(result => result.json()
                .then(json => { console.log("response: ", Status(result.status));
                if (!json.valid) return swalError(json.response)
                object = (JSON.parse(localStorage.getItem("user")))
                object.user = username
                object.token = json.token
                localStorage.setItem("user", JSON.stringify(object))	
                login_btn()
                Swal.hideLoading()
                notif.fire({ //match
                icon: 'success',
                text: 'Změna jména proběhla úspěšně',
                position: 'center',
                })
                
               }))
        },
      })
  break;
    case "password":
      const { value: value } = await Swal.fire({
        title: 'Změna hesla',
        html:`<form><input type="password" id="password" autocomplete="on" class="swal2-input" placeholder="Nové heslo" ></form>
              <form><input type="password" id="password_again" autocomplete="on" class="swal2-input" placeholder="Nové heslo znovu" ></form>`,
        showCancelButton: true,
        confirmButtonText: 'Zněnit heslo',
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
            'Content-Type': 'application/json',
            referrer: "https://api.vizualizacni-portal.noxyyk.com/"
          },
          body: JSON.stringify({
            'username': JSON.parse(localStorage.getItem("user")).user,
            'password': value,
            'type': 'password'
          })
          };
          fetch("/change", requestOptions) //fetch data from request
          .then(result => result.json()
            .then(json => { console.log("response: ", Status(result.status));
            if (!json.valid) return swalError(json.response)
            
            notif.fire({ 
            icon: 'success',
            text: 'Změna hesla proběhla úspěšně',
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
          'Content-Type': 'application/json',
          referrer: "https://api.vizualizacni-portal.noxyyk.com/"
        },
        body: JSON.stringify({
          'username': JSON.parse(localStorage.getItem("user")).user
        })
        };
        fetch("/delete", requestOptions) //fetch data from request
        .then(result => result.json()
          .then(json => { console.log("response: ", Status(result.status));
          if (!json.valid) return swalError(json.response)
          localStorage.removeItem("user");
        notif.fire({ //match
        icon: 'success',
        text: 'Účet byl úspěšně smazán',
        timer: 5000
        })
         }))
        delay(5000).then(() => {
        logOut();
        })
  break;
    case "pfp":
      var avatars = [];
      var avatars_html = "";
      for (var i = 0; i < 9; i++) {
        avatars.push(`./images/avatar_${i}.png`);
        avatars_html += `<img id="avatar_${i}" class="avatar" src="/images/avatar_${i}.png" alt="avatar_${i}">`;
      }

      var { value: avatar } = await Swal.fire({
        title: 'Změna profilového obrázku',
        html: '<div class="grid-container">'  + avatars_html + `</div>`,
        showCancelButton: true,
        showDenyButton: true,
        denyButtonText: 'Vlastní obrázek',
        confirmButtonText: 'Zněnit profilový obrázek',
        didOpen: () => {
          for (var i = 0; i < avatars.length; i++) {
            document.getElementById(`avatar_${i}`).addEventListener('click', () => {
              for (var i = 0; i < avatars.length; i++) {
                document.getElementById(`avatar_${i}`).classList.remove('selected');
              }
              event.target.classList.add('selected');
            })
          }
        },
        preConfirm: () => {
          var avatar = '';
          for (var i = 0; i < avatars.length; i++) {
            if (document.getElementById(`avatar_${i}`).classList.contains('selected')) {
              avatar = avatars[i];
            }
          }
          if (avatar == '') Swal.showValidationMessage(`Vyberte prosím profilový obrázek`)
          if (avatar == JSON.parse(localStorage.getItem("user")).pfp) Swal.showValidationMessage(`zvolený avatar je stejný jako předtím`)
          return avatar
        },
      })
//on deny button pressed
    if (avatar != undefined && !avatar) {
      //add avatar using link
avatar = await Swal.fire({
        title: 'Změna profilového obrázku',
        input: 'text',
        inputLabel: 'Zadejte URL obrázku',
        inputPlaceholder: 'https://i.imgur.com/2CXjyN6.png',
        showCancelButton: true,
        confirmButtonText: 'Zněnit profilový obrázek',
        preConfirm: (avatar) => {
          if (!avatar) Swal.showValidationMessage(`Vyberte prosím profilový obrázek`)
          if (!avatar.match(/^http(s?):\/\/.*/g)) Swal.showValidationMessage(`Vyberte prosím platný obrázek`)
          return avatar
        },
      })
      avatar = avatar.value;
      }

      if (avatar) {
        requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            referrer: "https://api.vizualizacni-portal.noxyyk.com/"
          },
          body: JSON.stringify({
            'username': JSON.parse(localStorage.getItem("user")).user,
            'avatar': avatar,
            'type': 'avatar'
          })
          };
          fetch("/change", requestOptions) //fetch data from request
          .then(result => result.json()
            .then(json => { console.log("response: ", Status(result.status));
            if (!json.valid) return swalError(json.response)
            notif.fire({
              icon: 'success',
              text: 'Změna profilového obrázku proběhla úspěšně',
              timer: 3000
            }).then(() => {
            object = (JSON.parse(localStorage.getItem("user")))
            object.pfp = avatar
            object.token = json.token
            localStorage.setItem("user", JSON.stringify(object))	
            login_btn()
            
          })
            }))
      }
      break;
  default:
    Swal.fire({
      title: 'Účet',
      html: 'Jméno: ' + JSON.parse(localStorage.getItem("user")).user +' '+'<button id="username" onclick=account("username") class="btn btn-warning">' + 'Změnit jméno' + '</button><br>Heslo: ********** <button onclick=account("password") id="password" class="btn btn-warning">' + 'Změnit heslo' + '</button><br><button onclick=account("pfp") class="btn btn-warning">' + 'Změna profilového obrázku' + '</button><br><button onclick=logOut() class="btn btn-danger">' + 'Odhlásit se' + '</button><br> <button onclick=account("delete") id="delete" class="btn btn-danger" style="color: red">' + 'Smazat účet' + '</button><br>',
    })
  break;
  }

}
function start(){
if(localStorage.getItem("user") == null) return logIn()
  window.open("./zarizeni.html","_self");
}

async function userlist(){
  //check if user is admin
  if(!JSON.parse(localStorage.getItem("user")).admin) return swalError("Nemáte dostatečná oprávnění")
  var userlist = await fetch("/userlist", { referrer: "https://api.vizualizacni-portal.noxyyk.com/"})
  .then(result => result.json()
    .then(json => { console.log("response: ", Status(result.status));
    if (!json.valid) return swalError(json.response)
    return json.users
   }))
    var html = []
    let roles = ['user', 'advanced', 'admin']
    let usersperpage = 10
    var sorttype = {
      "direction": -1,
      "type": "DATE",
  };
  userlist.forEach(element => {
    if (element.data.user.avatar == undefined ||  typeof element.data.user.avatar != "string") element.data.user.avatar = "./images/0.png"
    let img = new Image();
    img.src = element.data.user.avatar;
      img.onerror = function() {
        element.data.user.avatar = "./images/0.png"
      }

  let userrole = (element.data.user.admin ? 3 : element.data.user.role == "advanced" ? 2 : 1) // (element.data.user.admin ? 'admin' : element.data.user.role)
  html.push('<tr><td>'+ element.data.user.ID+'</td><td><img style="border-radius: 50%;width:50px"referrerpolicy="no-referrer" src="'+ element.data.user.avatar + '"></td><td>' + element.ID + '</td><td>' + time((new Date().getTime() / 1000) - element.data.user.createdTimestamp) + '</td><td>' + (element.data.user.loggedTimestamp ? ((new Date().getTime() / 1000) - element.data.user.loggedTimestamp <= 3600 || JSON.parse(localStorage.getItem("user")).user == element.ID ? '<span style="color:#00ff00">aktivní</span>' : time((new Date().getTime() / 1000) - element.data.user.loggedTimestamp)) : '<span style="color:#ff0a0a">nikdy</span>' )+ '</td><td>' +'<select id="role"' +(JSON.parse(localStorage.getItem("user")).user == element.ID? "disabled" : "" )+ '>' + roles.map((role, index) => {return '<option value="'+ role +'" ' + (userrole == index + 1 ? 'selected' : '') + '>' + role + '</option>'}).join('') +'</select>' +'</td></tr>')
  });
  const swalPage = Swal.mixin({  
    confirmButtonText: 'další',
    denyButtonText: 'předchozí',
    cancelButtonText: 'zavřít',
    reverseButtons: true,
    confirmButtonColor: '#3085d6',
    denyButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  })	

  let lastPage = Math.ceil(html.length/usersperpage)
  for (let currentPage = 1; currentPage < lastPage +1;) {
   const result = await swalPage.fire({
      title: 'Uživatelé' + ' (' + currentPage + '/' +  lastPage + ')',
      html: '<table style="width:100%;color:#000"><tr><th>ID</th><th>avatar</th><th id="TEXT">jméno ' + (sorttype.type == "TEXT"? (sorttype.direction == 1? "↓":"↑"): "") + '</th><th id="DATE">vytvoření ' + (sorttype.type == "DATE"? (sorttype.direction == 1? "↓":"↑"): "") + '</th><th id="DATE2">přihlášení ' + (sorttype.type == "DATE2"? (sorttype.direction == 1? "↓":"↑"): "") + '</th><th id="ROLE">role ' + (sorttype.type == "ROLE"? (sorttype.direction == 1? "↓":"↑"): "") + '</th></tr>' + html.slice(currentPage *usersperpage -usersperpage, currentPage * usersperpage).join('') + '</table>',
      grow: "row",
      showCancelButton: true,
      showDenyButton: currentPage > 1,
      showConfirmButton: currentPage < lastPage,
      didOpen: () => {
        
        document.getElementById("TEXT").onclick = function() {sortusers("TEXT")};
        document.getElementById("DATE").onclick = function() {sortusers("DATE")};
        document.getElementById("DATE2").onclick = function() {sortusers("DATE2")};
        document.getElementById("ROLE").onclick = function() {sortusers("ROLE")};
        document.querySelectorAll('select').forEach((select, index) => {
          select.addEventListener('change', (event) => {
            let userrole = (event.target.value == 'admin' ? 3 : event.target.value == 'advanced' ? 2 : 1)
            let roles = ['user', 'advanced', 'admin']
            console.log(userlist[currentPage * usersperpage-usersperpage+index].ID, roles[userrole - 1])
            let requestOptions = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                referrer: "https://api.vizualizacni-portal.noxyyk.com/"
              },
              body: JSON.stringify
              ({
                'username': userlist[currentPage * usersperpage-usersperpage+index].ID,
                'role': roles[userrole - 1]
              })
              };
              fetch("/role", requestOptions) //fetch data from request
              .then(result => result.json()
                .then(json => { console.log("response: ", Status(result.status));
                if (!json.valid) return swalError(json.response)
                
                if(!JSON.parse(localStorage.getItem("user")).admin) return swalError("Nemáte dostatečná oprávnění")
                //change html of selected users role
                html = html.map((html, index2) => {
                  if (index2 == index) {
                    return html.replace(/<select>.*<\/select>/, '<select>' + roles.map((role, index) => {return '<option value="'+ role +'" ' + (userrole == index + 1 ? 'selected' : '') + '>' + role + '</option>'}).join('') +'</select>')
                  }
                  return html
                })
               if (userlist[index].ID == JSON.parse(localStorage.getItem("user")).user) return delay(1000).then(() => {verifyToken()})
                }))
          })
        })
      }
    })
    function sortusers(type){
      Swal.showLoading()
      
      let direction = sorttype.type == type ? sorttype.direction * -1 : -1
      sorttype.direction = direction
     // direction = type == "TEXT" ? 1 : direction
      sorttype.type = type
      userlist.sort(listsGetSortCompare(type, direction))
      html = []
      var sorted = 0
      userlist.forEach(element => {
        //check if image is valid otherwise use default image
        let img = new Image();
        img.src = element.data.user.avatar;
        img.onerror = function() {
          element.data.user.avatar = "./images/0.png"
        }
      let userrole = (element.data.user.admin ? 3 : element.data.user.role == "advanced" ? 2 : 1) // (element.data.user.admin ? 'admin' : element.data.user.role)
      html.push('<tr><td>'+ element.data.user.ID+'</td><td><img style="border-radius: 50%;width:50px"referrerpolicy="no-referrer" src="'+ element.data.user.avatar + '"></td><td>' + element.ID + '</td><td>' + time((new Date().getTime() / 1000) - element.data.user.createdTimestamp) + '</td><td>' + (element.data.user.loggedTimestamp ? ((new Date().getTime() / 1000) - element.data.user.loggedTimestamp <= 3600 || JSON.parse(localStorage.getItem("user")).user == element.ID ? '<span style="color:#00ff00">aktivní</span>' : time((new Date().getTime() / 1000) - element.data.user.loggedTimestamp)) : '<span style="color:#ff0a0a">nikdy</span>' )+ '</td><td>' +'<select id="role"' +(JSON.parse(localStorage.getItem("user")).user == element.ID? "disabled" : "" )+ '>' + roles.map((role, index) => {return '<option value="'+ role +'" ' + (userrole == index + 1 ? 'selected' : '') + '>' + role + '</option>'}).join('') +'</select>' +'</td></tr>')
sorted++
if (sorted == userlist.length) {
  delay(100).then(() => {
    currentPage = 0
    Swal.hideLoading()
    swalPage.clickConfirm()
    
    })
  }
    })
    }
      if (result.isConfirmed) {
        currentPage++
        
      } else if (result.isDenied) {
        currentPage--
        
      } else {
        break
      }
  }
}


onstorage = (event) => { 
 // console.log("storage change");
  if (event.key == 'user' && event.newValue != null)  if(!verifyToken()) return logOut()
  delay(1000).then(() => {
    login_btn()
  })
}
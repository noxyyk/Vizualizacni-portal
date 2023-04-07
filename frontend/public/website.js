init()
function init(){
    fetch('./files/info.json')
    .then(result => result.json())
    .then(data => {
      if (data.error) {
        throw data.error
        return
      }  
    document.getElementById('footer').innerHTML = `
          <div class="footer_padding">
          <div class="footer_content">
          <div class="grid_container">
          <div class="grid_item"><b>O projektu</b>
            <p>Název: ${data.name}<br>Verze: ${data.version}<br>Poslední změna: ${data.lastUpdate}<br>Hosting: <a href="${data.hosting.link}">${data.hosting.text}</a></p>
            </div>
          <div class="grid_item"><b>O mě</b>
            <p>Přezdívka: ${data.username}<br>Stránka: <a href="${data.page}">${data.page}</a><br>věk: ` +  ((new Date(Date.now() - (((new Date(data.age)).getTime()))).getUTCFullYear())-1970) + `<br>Třída: ${data.class}
              </p></div>
          <div class="grid_item"><b></b></div>
          <div class="grid_item"><b>Kontakt</b>
            
            <p><button class="startbtn infobtn" href="mailto:${data.socials.email}"><b>Napiš mi </b><ion-icon name="mail-outline"></ion-icon></a></button>
            </p>
            <div class="socials">
              <a href="${data.socials.github}"><ion-icon name="logo-github"></ion-icon></a> <a href="${data.socials.twitter}"><ion-icon name="logo-twitter"></ion-icon></a> <a href="${data.socials.instagram}"><ion-icon name="logo-instagram"></ion-icon></a> <a href="${data.socials.facebook}"><ion-icon name="logo-facebook"></ion-icon></a> <a href="${data.socials.discord}"><ion-icon name="logo-discord"></ion-icon></a> <a href="${data.socials.youtube}"><ion-icon name="logo-youtube"></ion-icon></a>
            </div>
            </div>
          </div>  
          <div class="separator_line"></div>
          </div>
          </div>
          <div class="footer_default"><p>Copyright © 2023 ${data.author}, SPŠE Plzeň <a href="/tos">Podmínky služby</a> | <a href="/tos#zasady">zásady ochrany osobních údajů</a>
          </p></div>
  `})   
document.getElementById('header').innerHTML = `<div class="header" id="header">
<div class="name_text"><h1>Vizualizační Portál</h1></div>
<div class="logo"><img src="./images/logo.png" width="80px";></div>
<h5><div class="welcome"><div id="login_welcome"></div></h5>
<div class="navigation">
  <ul>
    <li class="list">
        <a href="./index.html">
            <span class="icon"><ion-icon name="home-outline"></ion-icon></span>
            <span class="text">Domů</span>
        </a>
    </li>
    <li class="list" onclick=ChangeLog()>
        <a>
            <span class="icon"><ion-icon name="code-slash-outline"></ion-icon></span>
            <span class="text">Změny</span> 
        </a>
    </li>
    <li class="list">
        <a  onclick=start()>
            <span class="icon"><ion-icon name="settings-outline"></ion-icon></span>
            <span class="text">Zařízení</span>
        </a>
    </li>
    <li class="list">
        <a href="./grafy.html">
            <span class="icon"><ion-icon name="information-circle-outline"></ion-icon></span>
            <span class="text">O projektu</span>
        </a>
    </li>
</ul>
</div>
<div id="login_list"></div>
<div id="dropdown_account" class="dropdown login"></div>
<div class="dropdown mobile">
  <input style="display: none;" type="checkbox" id="dropdown-toggle" class="dropbtn dropdown"></input>
  <label for="dropdown-toggle" class="dropbtn dropdown"><ion-icon name="menu-outline"></ion-icon></label>
  <div style="top: 45px;" class="dropdown-content">
    <a href="./index.html">
      <span class="icon"><ion-icon name="home-outline"></ion-icon></span>
      <span class="text">Domů</span>
  </a>
    <a onclick=ChangeLog()>
      <span class="icon"><ion-icon name="code-slash-outline"></ion-icon></span>
              <span class="text">Změny</span> 
          </a>
          <a onclick=start()>
            <span class="icon"><ion-icon name="settings-outline"></ion-icon></span>
            <span class="text">Zařízení</span>
        </a>
        <a href="./grafy.html">
          <span class="icon"><ion-icon name="information-circle-outline"></ion-icon></span>
          <span class="text">O projektu</span>
      </a>
  </div>
</div>
</div>`
}
login_btn()
async function login_btn() {
	var user = localStorage.getItem('user')
	try {
		user = JSON.parse(user)
	} catch {
		user = null
	}
	var pfp =
		user?.pfp == null ||
		typeof user.pfp != 'string' ||
		(!user.pfp.includes('https://') && !user.pfp.includes('./images/avatar_'))
			? '<ion-icon name="accessibility-outline"></ion-icon>'
			: '<img onclick="account()" class="pfp" style="border-radius: 50%;"  referrerpolicy="no-referrer"alt="logo" src="' +
			  user.pfp +
			  '">'
	if (user?.token == null) {
    if(window.location.href.includes("zarizeni.html"))window.location.href = "./index.html"
		document.getElementById('dropdown_account').style.display = 'none'
		document.getElementById('login_list').style.display = 'inline-block'
		document.getElementById('login_list').innerHTML =
			'<div class="login">' +
			'<ul>' +
			'<li  id="login" onclick=logIn() class="list">' +
			'<a>' +
			'<span class="icon"><ion-icon name="log-in-outline"></ion-icon></span>' +
			'<span class="text">Přihlášení</span>' +
			'</a>' +
			'</li>' +
			'</ul>' +
			'</div>'
	} else {
		document.getElementById('dropdown_account').style.display = 'inline-block'
		document.getElementById('login_list').style.display = 'none'
		document.getElementById('dropdown_account').innerHTML =
			'<button class="dropbtn dropbtn_animation"style="width:100%;height:100%;display:flex;padding:10px;align-items:center;justify-content:center;border-radius: 50%;">' +
			pfp +
			'</button>' +
			'<div class="dropdown-content animation"><a onclick=account()><span class="icon"><ion-icon name="settings-outline"></ion-icon></span><span class="text"> Účet</span></a><a onclick=logOut()><span class="icon"><ion-icon name="log-out-outline"></ion-icon></span><span class="text"> Odhlášení</span></a>' +
			(user.admin
				? '<a onclick=userlist()><span class="icon"><ion-icon name="people-outline"></ion-icon></span><span class="text"> Uživatelé</span></a><a onclick=audit()><span class="icon"><ion-icon name="megaphone-outline"></ion-icon></span><span class="text"> Audit</span></a>'
				: '') +
			'</div>'
	}
	document.getElementById('login_welcome').innerHTML =
		user == null || user?.user == undefined
			? ''
			: user.user + ' | ' + (user.admin ? 'administrátor' : user.role)
	animations()
}
function start() {
	if (localStorage.getItem('user') == null) return logIn("./zarizeni.html")
	window.open('./zarizeni.html', '_self')
}
init()
function init(){
    fetch('./files/info.json')
    .then(result => result.json())
    .then(data => {
      if (data.error) {
        throw data.error
        return
      }  
    document.getElementById('footer').innerHTML = `<div class="footer">
    <!-- fetch data from /footer and set data to footer -->
    <p class="footer_cpr">
          <div class="footer_padding">
            <div class="footer_content">
          <div class="grid_container">
          <div class="grid_item"><b>O projektu</b>
            <p>Název: ${data.name}<br>Verze: ${data.version}<br>Poslední změna: ${data.lastUpdate}<br>Hosting: <a href="${data.hosting.link}">${data.hosting.text}</a></p>
            </div>
          <div class="grid_item"><b>O mě</b>
            <p>Přezdívka: ${data.username}<br>Stránka: <a href="${data.page}">${data.page}</a><br>věk: ` +  ((new Date(Date.now() - (((new Date(data.age)).getTime()))).getUTCFullYear())-1970) + `<br>Třída: ${data.class}
              </p></div>
          <div class="grid_item"><b>C</b></div>
          <div class="grid_item"><b>Kontakt</b>
            <p>
            <button class="startbtn" style="  background-color: var(--button_clr);border:  none;;width:170px;height: 30px;border-radius: var(--article_border_radius);"><a style="color:#000;  text-decoration: none;" href="mailto:${data.socials.email}"><b>Napiš mi </b><ion-icon name="mail-outline"></ion-icon></a></button>
            <br>
            <div class="socials">
              <a href="${data.socials.github}"><ion-icon name="logo-github"></ion-icon></a> <a href="${data.socials.twitter}"><ion-icon name="logo-twitter"></ion-icon></a> <a href="${data.socials.instagram}"><ion-icon name="logo-instagram"></ion-icon></a> <a href="${data.socials.facebook}"><ion-icon name="logo-facebook"></ion-icon></a> <a href="${data.socials.discord}"><ion-icon name="logo-discord"></ion-icon></a> <a href="${data.socials.youtube}"><ion-icon name="logo-youtube"></ion-icon></a>
            </div>
            </div>
            </p>
          </div>
          <div class="separator_line"></div>
          </div>
          <p>Copyright © 2023 ${data.author}, SPŠE Plzeň <a href="/podminky.html">Podmínky služby</a> | <a href="/zasady.html">zásady ochrany osobních údajů</a>
            </p>
          </div>
        </p>
  </div>
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
        <a href="#about">
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
        <a href="#about">
          <span class="icon"><ion-icon name="information-circle-outline"></ion-icon></span>
          <span class="text">O projektu</span>
      </a>
  </div>
</div>
</div>`
}
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
            <p><span style="cursor:pointer" onclick="guide()">API dokumentace</span><br>Verze: ${data.version}<br>Poslední změna: ${data.lastUpdate}<br>Hosting: <a href="${data.hosting.link}">${data.hosting.text}</a></p>
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
const guide_css = `
.swal2-modal {
  min-height: 300px;
}
.box h1 {
  text-align: center;
}
.box h2 {
  margin-top: 20px;
}
.box {
  width: 90%;
  margin: 0 auto;
  margin-top: 20px;
  border: 1px solid hsl(122, 39%, 49%);;
  background-color: hsl(122, 39%, 90%);
  border-radius: 5px;
  overflow: hidden;
}
.box .box-content {
  display: flex;
  flex-direction: column;
  /* padding: 10px; */
}
.box .head {
  padding: 10px; 
}
.box .box-content button {
  border: none;
  background-color: transparent;
  cursor: pointer;
}
.box .content {  
  padding: 0;
  display: none;
}
.box .content p{
  margin-left: 15px;
}
.box .content table {
margin-left: 30px;
}
.box .content.display {
  display: block;
}
.box .rotate ion-icon{
  transform: rotate(180deg);
}
.box .head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box .method {
  background-color: #4CAF50;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
}
.box .path {
  margin-left: 10px;
}
.box .summary {
  margin-left: 10px;
}
.box .arror {
  margin-left: 10px;
}
.box .clipborad {
  margin-left: 10px;
}

.box .parameters th {
  padding: 5px;
  text-align: left;
}
.box .parameters td {
  padding: 5px;
  text-align: left;
}
.box .parameters tr:nth-child(1) {
  border-bottom: 1px solid #ccc;
}
.box .white {
  background-color: #f5f5ff;
  height : 100%;
  width: 100%;
  padding: 1px;
  text-align: left;
  margin-left: 0px;
}
.box .content {
  border-top: 1px solid hsl(122, 39%, 49%);
}
.box .path {
  font-weight: bold;
}
.box .tableHead {
  border-collapse: collapse;
}
.box .tableHead th {
  padding: 5px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.box .tableHead td {
  padding: 5px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.box .tableHead td {
  vertical-align: top;
}
.box .script {
  background-color: #f5f5ff;
  height : 100%;
  width: 100%;
  padding: 1px;
  text-align: left;
  margin-left: 0px;
}
.box .parameters th{
  display: none;
}`;
function guide() {
  Swal.fire({
    html: `<div class="box">
    <div class="box-content">
    <div class="head">
    <button  class="toggle-content">
        <span class="method">POST</span>
        <span class="path">/api/write</span>
        <span class="summary">zapsat hodnoty do databáze</span>
        <span class="arror"><ion-icon name="chevron-down-outline"></ion-icon></span>
    </button>
    <button>
        <span class="clipborad"><ion-icon name="clipboard-outline"></ion-icon></span>
    </button>
 </div>
    <div class="content">
     <div class="white">
         <p>parametry:</p>
     </div>
     <br>
     <table class="tableHead">
         <tr>
             <th>Query:</th>
             <th>Headers:</th>
         </tr>
         <tr>
             <td>
                  <table class="parameters">
            <tr>
                <th>Jméno</th>
                <th>Hodnota</th>
            </tr>
            <tr>
                <td>tag:</td>
                <td>devID</td>
            </tr>
            <tr>
                <td>tagvalue:</td>
                <td>1</td>
            </tr>
            <tr>
                <td>value:</td>
                <td>23</td>
            </tr>
            <tr>
                <td>measurement:</td>
                <td>temperature</td>
            </tr>
                 </table>
              </td>
     <td>
         <table class="parameters">
             <tr>
                 <th>Jméno</th>
                 <th>Hodnota</th>
             </tr>
             <tr>
                 <td>Authorization:</td>
                 <td>Bearer {API klíč}</td>
             </tr>
         </table>
     </td>
 </tr>
 </table>
        <br>
        <div class="white">
        <p>odpovědi:</p>
       </div>
       <br>
        <table class="parameters">
               <tr>
                 <th>Kód</th>
                 <th>Odpověď</th>
               </tr>
               <tr>
                 <td>200</td>
                 <td>ok</td>
               </tr>
                 <tr>
                     <td>401</td>
                     <td>chybné parametry / nesprávný token</td>
                 </tr>
                 <tr>
                     <td>409</td>
                     <td>Uživatel / zařízení neexistuje</td>
                 </tr>
        </table>
        <br>
        <div class="white">
            <p>příklad odpovědi:</p>
    </div>
     <br>
     <div class="script">
         <pre>
         {
             "status": "ok",
             "message": "Data byla úspěšně zapsána"
         }
         </pre>
     </div>
 </div>
 </div>
 </div>
 
 <div class="box">
     <div class="box-content">
     <div class="head">
     <button  class="toggle-content">
         <span class="method">POST</span>
         <span class="path">/api/data</span>
         <span class="summary">vypsat hodnoty z databáze</span>
         <span class="arror"><ion-icon name="chevron-down-outline"></ion-icon></span>
     </button>
     <button>
         <span class="clipborad"><ion-icon name="clipboard-outline"></ion-icon></span>
     </button>
  </div>
     <div class="content">
      <div class="white">
          <p>parametry:</p>
      </div>
      <br>
      <table class="tableHead">
          <tr>
              <th>Headers:</th>
              <th>Body:</th>
          </tr>
          <tr>
              <td>
                 <table class="parameters">
                     <tr>
                         <th>Jméno</th>
                         <th>Hodnota</th>
                     </tr>
                     <tr>
                         <td>Authorization:</td>
                         <td>Bearer {API klíč}</td>
                     </tr>
                 </table>
               </td>
      <td>
          <table class="parameters">
              <tr>
                  <th>Jméno</th>
                  <th>Hodnota</th>
              </tr>
              <tr>
                  <td>device:</td>
                  <td>obyvak</td>
              </tr>
              <tr>
                 <td>measurement:</td>
                 <td>temperature</td>
             </tr>
          </table>
      </td>
  </tr>
  </table>
         <br>
         <div class="white">
         <p>odpovědi:</p>
        </div>
        <br>
         <table class="parameters">
                <tr>
                  <th>Kód</th>
                  <th>Odpověď</th>
                </tr>
                <tr>
                  <td>200</td>
                  <td>ok</td>
                </tr>
                <tr>
                 <td>400</td>
                 <td>Invalid token / Není nastaven measurement</td>
             </tr>
                  <tr>
                      <td>401</td>
                      <td>Zařízení nenalezeno / Není nastaven token nebo url</td>
                  </tr>
                  <tr>
                      <td>409</td>
                      <td>Uživatel neexistuje</td>
                  </tr>
         </table>
         <br>
         <div class="white">
             <p>příklad odpovědi:</p>
     </div>
      <br>
      <div class="script">
          <pre>
          {
            "valid":true,
            "response": {
                "values": [
                ["2023-03-30T21:02:47.744252Z","0.6996007451734343"],
                ["2023-03-30T21:02:48.7565157Z","82.91015100133646"],
                ["2023-03-30T21:02:49.762536Z","52.66027838126273"],
                ["2023-03-30T21:02:50.7756547Z","6.6677244324441"]
            ],
            "tag":"devID",
            "value":"1"
            }
          }
          </pre>
      </div>
  </div>
  </div>
  </div>`,
    title: 'API dokumentace',
    showConfirmButton: false,
    showCloseButton: true,
    width: '80%',
    willOpen: () => {
      let style = document.createElement('style')
      style.innerHTML = guide_css;
      document.head.appendChild(style);

      const toggleContent = document.querySelectorAll('.toggle-content');
      toggleContent.forEach((item) => {
          item.addEventListener('click', () => {
              console.log(item.parentElement.parentElement);
              const content = item.parentElement.parentElement.querySelector('.content');
              const arrow = item.querySelector('.arror ion-icon');
              content.classList.toggle('display');
              arrow.classList.toggle('rotate');
          });
      });
      const copy = document.querySelectorAll('.clipborad');
      copy.forEach((item) => {
          item.addEventListener('click', () => {
              const path = item.parentElement.parentElement.querySelector('.path').innerText;
              const url = "https://api." + window.location.hostname + path;
              navigator.clipboard.writeText(url);
          });
      });
    },
});
}
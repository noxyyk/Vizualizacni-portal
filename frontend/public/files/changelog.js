async function ChangeLog() {
	Swal.fire({
		position: 'center',
		width: '900px',
		html: `
    <style> 
    ul{
        list-style: none; 
        display:contents;
    }   
     .grid {
        display: grid;
        grid-template-columns: auto auto;
      }
        .change-grid {
        border: 1px solid #000;
        border-radius: 5px;
        padding: 5px;
        margin: 5px;
        }
        #prosinec_content,  #listopad_content, #rijen_content,  #zari_content, #srpen_content, #cervenec_content, #cerven_content, #kveten_content, #duben_content, #brezen_content, #unor_content, #leden_content {
            display: none;
        }
    </style> 
    <h1 id="change-log">Seznam Změn</h1>
    <div class="grid">
    
    <div class="change-grid">
    <h2 id="leden">Leden</h2>
    <div id="leden_content">
    <p><strong>28.1.2023</strong></p>
    <ul>
    <li>API routing</li>
    </ul>
    <p><strong>20.1.2023</strong></p>
    <ul>
    <li>vylepšen footer</li>
    </ul>
    <p><strong>11.1.2023</strong></p>
    <ul>
    <li>hosting frontend na vercel a backend na railway</li>
    </ul>
    <p><strong>10.1.2023</strong></p>
    <ul>
    <li>animace při načtení webu</li>
    <li>načtení animací při změně loginu</li>
    <li>animace pro dropdown</li>
    <li>dropdown na mobilu jako checkbox</li>
    </ul>
    <p><strong>9.1.2023</strong></p>
    <ul>
    <li>načtení icon před body</li>
    <li>změna registrace, nyní ukazuje jestli uživatel existuje ve stejném modalu</li>
    <li>smazání changelog.md, bude se používat tento modal</li>
    </ul>
    <p><strong>2.1.2023</strong></p>
    <ul>
    <li>přidání nových avatarů</li>
    <li>možnost zůstat přihlášený</li>
    <li>animace loga</li>
    </ul>
    <p><strong>1.1.2023</strong></p>
    <ul>
    <li>přidání sezaření podle posledního přihlášení</li>
    </ul>
    </div></div>
    <div class="change-grid">
    <h2 id="prosinec">Prosinec</h2>
    <div id="prosinec_content">
    <p><strong>27.12.2022</strong></p>
    <ul>
    <li>sezaření uživatelů podle, jména, role, datumu registrace </li>
    </ul>
    <p><strong>26.12.2022</strong></p>
    <ul>
    <li>pouze 1 admin</li>
    <li>změna role uživatele</li>
    </ul>
    <p><strong>20.12.2022</strong></p>
    <ul>
    <li>/role - změna role uživatele</li>
    </ul>
    <p><strong>15.12.2022</strong></p>
    <ul>
    <li>získání array všech uživatelů</li>
    </ul>
    <p><strong>6.12.2022</strong></p>
    <ul>
    <li>funkce time(s) - zobrazí čas od expirace tokenu</li>
    <li>validace tokenu při jeho změně</li>
    <li>přidán JWT token</li>
    </ul>
    <p><strong>5.12.2022</strong></p>
    <ul>
    <li>vypsat detailnější &quot;chyby&quot;</li>
    <li>request /delete - smaže účet</li>
    </ul>
    <p><strong>3.12.2022</strong></p>
    <ul>
    <li>povolené origins pro CORS</li>
    <li>profilový obrázek</li>
    </ul>
    </div></div>
    <div class="change-grid">
    <h2 id="listopad">Listopad</h2>
    <div id="listopad_content">
    <p><strong>30.11.2022</strong></p>
    <ul>
    <li>backend zpraven</li>
    <li>odhlášení při změně local storage</li>
    </ul>
    <p><strong>25.11.2022</strong></p>
    <ul>
    <li>změna hesla, jména, smazání účtu</li>
    <li>nový dropdown s účtem pokud je uživatel přihlášen</li>
    <li>oprava posuvníku u malého rozlišení</li>
    </ul>
    <p><strong>24.11.2022</strong></p>
    <ul>
    <li>Úprava, opravy, přidání posuvníku k textu</li>
    </ul>
    <p><strong>17.11.2022</strong></p>
    <ul>
    <li>Změněny response statusu</li>
    </ul>
    <p><strong>13.11.2022</strong></p>
    <ul>
    <li>hotová registrace a přihlášení</li>
    <li>šifrování pomocí HASH</li>
    <li>vytvoření objekt při registraci</li>
    <li>Uživatel odhlášen po změně localStorage</li>
    </ul>
    <p><strong>10*11.2022</strong></p>
    <ul>
    <li>Regex pro heslo</li>
    <li>upravena zarizeni.html</li>
    </ul>
    <p><strong>4.11.2022</strong></p>
    <ul>
    <li>registrace</li>
    <li>propojení s mongoDB</li>
    </ul>
    </div></div>
    <div class="change-grid">
    <h2 id="rijen">Říjen</h2>
    <div id="rijen_content">
    <p><strong>26.10.2022</strong></p>
    <ul>
    <li>přidán device stránka</li>
    <li>dokumentace k API <a href="https://app.swaggerhub.com/apis-docs/noxyyk/login/1.0#/default/post_login">https://app.swaggerhub.com/apis-docs/noxyyk/login/1.0#/default/post_login</a></li>
    </ul>
    <p><strong>23.10.2022</strong></p>
    <ul>
    <li>upraveno odhlášení</li>
    <li>změněny div do lepší podoby, místo posouvání pixelů</li>
    <li>nastavena maximální velikost</li>
    <li>zpraven footer</li>
    <li>dropdown se bude zobrazovat dřív</li>
    </ul>
    <p><strong>20.10.2022</strong></p>
    <ul>
    <li>změna barev</li>
    </ul>
    <p><strong>19.10.2022</strong></p>
    <ul>
    <li>Opraveno překrývání článku</li>
    <li>zobrazit pouze přihlášení NEBO odhlášení</li>
    </ul>
    <p><strong>16.10.2022</strong></p>
    <ul>
    <li>Optimální rozhraní</li>
    </ul>
    <p><strong>15.10.2022</strong></p>
    <ul>
    <li>Aktualizováno uživatelské rozhraní, reagovat na velikost obrazovky</li>
    </ul>
    <p><strong>14.10.2022</strong></p>
    <ul>
    <li>pčidaná response funkce</li>
    </ul>
    <p><strong>13.10.2022</strong></p>
    <ul>
    <li>Přidáno logo</li>
    <li>Přepnuto na požadavek z GET na POST</li>
    <li>Uložit přihlášení do lokální proměnné</li>
    <li>Aktualizované funkce odhlášení a přihlášení</li>
    </ul>
    <p><strong>7.10.2022</strong></p>
    <ul>
    <li>TEST fungujícího přihlášení</li>
    <li>Provedena komunikace mezi frontendem a backendem</li>
    <li>spuštěný web pomocí railway.app</li>
    <li>odstraněn vercel</li>
    </ul>
    <p><strong>1.10.2022</strong></p>
    <ul>
    <li>přidáno sweetalerts</li>
    </ul>
    <p><strong>28.9.2022</strong></p>
    <ul>
    <li>tlačítka fungují</li>
    <li>přidány styly a ikony k tlačítkům a animace při najetí myší</li>
    <li>přidána navigační lišta s tlačítky 1.(domů, changelog,#setup,#about), 2.(přihlášení, odhlášení)</li>
    <li>písmo změněno na Poppins, sans-serif</li>
    </ul>
    <p><strong>27.9.2022</strong></p>
    <ul>
    <li>Přidán seznam změn </li>
    <li>Přidáno zápatí </li>
    <li>Přidáno záhlaví</li>
    </ul>
    <p><strong>26.9.2022</strong></p>
    <ul>
    <li>spuštěny webové stránky pomocí vercel </li>
    <li>Vytvoření webových stránek</li>
    </ul></div>
    </div> </div>
    `,
		confirmButtonText: 'Super!',
		didOpen: () => {
			document.getElementById('leden').onclick = function () {
				showHide('leden')
			}
			document.getElementById('prosinec').onclick = function () {
				showHide('prosinec')
			}
			document.getElementById('listopad').onclick = function () {
				showHide('listopad')
			}
			document.getElementById('rijen').onclick = function () {
				showHide('rijen')
			}
			function showHide(id) {
				var e = document.getElementById(id + '_content')
				if (e.style.display == 'block') e.style.display = 'none'
				else e.style.display = 'block'
			}
		},
	})
}

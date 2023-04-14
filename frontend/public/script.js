const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const page = "https://api.vizualizacni-portal.noxyyk.com/api"
const roles = ['user', 'advanced', 'admin']
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
	},
})
Swal = Swal.mixin({
	denyButtonColor: '#d33',
	confirmButtonColor: '#3085d6',
	cancelButtonColor: '#d33',
	confirmButtonText: 'Potvrdit',
	denyButtonText: 'Zrušit',
	cancelButtonText: 'Zrušit',
	allowOutsideClick: true,
	focusConfirm: false,
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
	},
})
// INIT
verifyToken()
login_btn()
//Functions
function time(s) {
	var year = Math.floor(s / 31536000)
	var day = Math.floor(s / 86400)
	var hour = Math.floor((s % 86400) / 3600)
	var minute = Math.floor(((s % 86400) % 3600) / 60)
	var second = Math.round(((s % 86400) % 3600) % 60)
	return year > 0
		? year + year == 1
			? ' rokem'
			: ' lety'
		: day > 1
			? day + ' dny'
			: day == 1
				? day + ' dnem'
				: hour > 1
					? hour + ' hodinami'
					: hour == 1
						? hour + ' hodinou'
						: minute > 1
							? minute + ' minutami'
							: minute == 1
								? minute + ' minutou'
								: second + ' sekundami'
}
function listsGetSortCompare(type, direction) {
	var compareFuncs = {
		NUMERIC: function (a, b) {
			return Number(a) - Number(b)
		},
		TEXT: function (a, b) {
			return a.id.toString() > b.id.toString() ? 1 : -1
		},
		TEXT_NOCASE: function (a, b) {
			return a.id.toString().toLowerCase() > b.id.toString().toLowerCase()
				? 1
				: -1
		},
		DATE: function (a, b) {
			return b.value.user.createdTimestamp > a.value.user.createdTimestamp
				? 1
				: -1
		},
		DATE2: function (a, b) {
			if (a.value.user.loggedTimestamp == undefined) return 1
			return b.value.user.loggedTimestamp > a.value.user.loggedTimestamp ? 1 : -1
		},
		ROLE: function (a, b) {
			let arole = a.value.user.admin ? 3 : a.value.user.role == 'advanced' ? 2 : 1
			let brole = b.value.user.admin ? 3 : b.value.user.role == 'advanced' ? 2 : 1
			if (arole == brole)
				return a.value.user.loggedTimestamp > b.value.user.loggedTimestamp
					? 1
					: -1
			return arole > brole ? 1 : -1
		},
	}
	var compare = compareFuncs[type]
	return function (a, b) {
		return compare(a, b) * direction
	}
}
function verifyToken() {
	var validation = true
	var token = localStorage.getItem('user')
	try {
		token = JSON.parse(token).token
	
	if (token == null) return false
	fetch(page + '/verify', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			"Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
		}
	})
		.then((result) =>
			result.json().then((json) => {
				console.log('response: ', Status(result.status))
				if (json.valid) {
					validation = true
					localStorage.setItem(
						'user',
						JSON.stringify({
							email: json.email,
							user: json.user,
							pfp: json.pfp,
							token: token,
							createdTimestamp: json.createdTimestamp,
							admin: json.admin,
							ID: json.ID,
							role: json.role,
						})
					)
					return
				}
				localStorage.removeItem('user')
				login_btn()
				validation = false
				console.log(json)
				toast.fire({
					icon: 'warning',
					text:
						json.name == 'TokenExpiredError'
							? ('Token expiroval před ' +
							  time(
							  	Math.floor(
							  		(new Date().getTime() -
											new Date(json.expiredAt).getTime()) /
											1000
							  	)
							  ) +
							  ', přihlášení je vyžadováno')
							: 'Token je neplatný, přihlášení je vyžadováno',
					timer: 10000,
				})
			})
		)
	} catch {
		localStorage.removeItem('user')
		login_btn()
		validation = false
	}
	return validation
}
function swalError(response) {
	notif.fire({
		icon: 'error',
		title: 'Jejda...',
		text: response,
	})
}
function Status(status) {
	var Response_text
	if (String(status).startsWith('1')) {
		switch (status) {
		case 100:
			Response_text = 'Continue'
			break
		default:
			break
		}
	} else if (String(status).startsWith('2')) {
		switch (status) {
		case 200:
			Response_text = 'OK'
			break
		case 201:
			Response_text = 'Created'
			break
		default:
			Response_text = 'Unexpected Output'
			break
		}
	} else if (String(status).startsWith('3')) {
		switch (status) {
		case value:
			break
		default:
			Response_text = 'Unexpected Output'
			break
		}
	} else if (String(status).startsWith('4')) {
		switch (status) {
		case 401:
			Response_text = 'Unauthorized'
			break
		case 404:
			Response_text = 'Not Found'
			break
		case 409:
			Response_text = 'Already exists'
			break
		default:
			Response_text = 'Unexpected Output'
			break
		}
	} else {
		switch (status) {
		case 500:
			Response_text = 'Internal Server Error'
			break
		default:
			Response_text = 'Unexpected Output'
			break
		}
	}
	return Response_text
}
/* LOGIN */
async function logIn(redirect) {
Swal.fire({
		title: 'Přihlášení',
		html:
			'<form><input id="login_name" type="name" placeholder="Jméno" autocomplete="on" class="swal2-input">' +
			'<input id="login_pswrd" type="password" autocomplete="on" placeholder="Heslo" class="swal2-input"></form>',
		input: 'checkbox',
		inputValue: 1,
		inputPlaceholder: 'Zůstat přihlášen',
		showCancelButton: true,
		confirmButtonText: 'Přihlásit',
		footer: '<a href="" onclick="event.preventDefault();register()">Nejste registrován?</a>',
		preConfirm: async function (){
			Swal.showLoading()
			const name = Swal.getPopup().querySelector('#login_name').value
			const password = Swal.getPopup().querySelector('#login_pswrd').value
			const result = Swal.getPopup().querySelector('#swal2-checkbox').checked
			if (!name || !password) {
				return Swal.showValidationMessage('Vyplňte prosím všechna pole')
			}
			const data = { username: name, password: password, stayLogged: result}
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}
			try {
				const response = await fetch(page + '/login', options)
				const json = await response.json()
				if (!json.valid) {
					Swal.hideLoading()
					return Swal.showValidationMessage(json.response)
				}
	
		  localStorage.setItem(
			'user',
			JSON.stringify({
			  user: name,
			  pfp: json.pfp,
			  token: json.token,
			  createdTimestamp: json.createdTimestamp,
			  admin: json.admin,
			  ID: json.ID,
			  role: json.role,
			})
		  )
		  if (redirect != null) return window.location.href = String(redirect)
		  login_btn()
				notif.fire({
					icon: 'success',
					text: `přihlášen jako ${name}.`,
					allowOutsideClick: true
				})
			} catch (error) {
				console.error(error)
				Swal.hideLoading()
				Swal.showValidationMessage('Nastala chyba')
			}
		}
	})
}

/* LOGOUT*/
async function logOut() {
	localStorage.removeItem('user')
	localStorage.removeItem('devices')
	await login_btn()

	toast.fire({
		//match
		icon: 'info',
		text: 'Byli jste odhlášeni',
	})
}

//registration

async function register() {
		Swal.fire({
		title: 'Registrace',
		html: `<form><input type="text" id="name" autocomplete="on" class="swal2-input" placeholder="Jméno">
           <input type="password" id="password" class="swal2-input" placeholder="Heslo" autocomplete="on"></form>`,
		showCancelButton: true,
		confirmButtonText: 'Registrovat',
		footer: '<a href="" onclick="event.preventDefault();logIn();">Už jste registrováni? </a>',
		preConfirm: async function () {
			Swal.showLoading()
			const name = Swal.getPopup().querySelector('#name').value
			const password = Swal.getPopup().querySelector('#password').value
			var validationErrors = []
			if (!name || !password) {
				Swal.showValidationMessage('Vyplňte prosím všechna pole')
				return undefined
			}
			if (name.match(/[^a-zA-Z0-9]/g) || name.length < 4 || name.length > 20)
				validationErrors.push(
					'nesmí obsahovat speciální znaky a musí mít alespoň 4 znaky'
				)
			if (validationErrors.length > 0)
				return Swal.showValidationMessage('jméno: ' + validationErrors.join(', '))
			if (!password.match(/[a-z]/g))
				validationErrors.push('alespoň jedno malé písmeno')
			if (!password.match(/[A-Z]/g))
				validationErrors.push('alespoň jedno velké písmeno')
			if (!password.match(/\d/g)) validationErrors.push('alespoň jedno číslo')
			if (password == name) validationErrors.push('nesmí být stejné jako jméno')
			if (!password.match(/^.{8,}$/g)) validationErrors.push('alespoň 8 znaků')
			if (validationErrors.length > 0)
				return Swal.showValidationMessage('heslo: ' + validationErrors.join(', '))
	
			const data = { username: name, password: password }
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}
			try {
				const response = await fetch(page + '/register', options)
				const json = await response.json()
				if (!json.valid) {
					Swal.hideLoading()
					return Swal.showValidationMessage(json.response)
				}
				notif.fire({
					icon: 'success',
					text: `Úspěšně registrován jako ${name}. nyní se můžete přihlásit.`,
					footer: '<a href="#" onclick="logIn();">Klikni pro přihlášení </a>',
				})
			} catch (error) {
				console.error(error)
				Swal.hideLoading()
				Swal.showValidationMessage('Nastala chyba')
			}
		},
	})
}

async function account(type) {
	switch (type) {
	case 'username':
		await Swal.fire({
			title: 'Změna jména',
			html: '<form><input type="text" id="name" autocomplete="on" class="swal2-input" placeholder="Nové jméno" ></form>',
			showCancelButton: true,
			confirmButtonText: 'Zněnit jméno',
			preConfirm: async () => {
				let username = Swal.getPopup().querySelector('#name').value
				if (username == JSON.parse(localStorage.getItem('user')).user)
					return Swal.showValidationMessage(
						'zvolené jméno je stejné jako předtím'
					)
				if (username.match(/[^a-zA-Z0-9]/g))
					return Swal.showValidationMessage(
						'Jméno nesmí obsahovat speciální znaky'
					)
				if (username.length < 4)
					return Swal.showValidationMessage('Jméno musí mít alespoň 4 znaky')
				Swal.showLoading()
				let response = await(await fetch(page + '/change', {method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					"Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
				},
				body: JSON.stringify({
					username_new: username,
					type: 'name',
				}),})).json()
				if (!response.valid) return Swal.showValidationMessage(response.response)
				Swal.hideLoading()
				logOut()
				notif.fire({
					icon: 'success',
					text: `Úspěšně změněno na ${username}, přihlašte se znovu`,
				})

			},
		})
		break
	case 'password':
		Swal.fire({
			title: 'Změna hesla',
			html: `<form><input type="password" id="old_password" autocomplete="on" class="swal2-input" placeholder="Staré heslo" >
			<input type="password" id="password" autocomplete="off" class="swal2-input" placeholder="Nové heslo" >
              <input type="password" id="password_again" autocomplete="off" class="swal2-input" placeholder="Nové heslo znovu" ></form>`,
			showCancelButton: true,
			confirmButtonText: 'Zněnit heslo',
			preConfirm: async () => {
				Swal.showLoading()
				const password_again =	Swal.getPopup().querySelector('#password_again').value
				const password = Swal.getPopup().querySelector('#password').value
				const old_password = Swal.getPopup().querySelector('#old_password').value
				if (password == old_password) return Swal.showValidationMessage('Nové heslo musí být jiné než staré')
				if (password != password_again) return Swal.showValidationMessage('Heslo se musí shodovat')
				if (!password.match(/[a-z]/g)) return Swal.showValidationMessage('Heslo musí obsahovat alespoň jedno malé písmeno')
				if (!password.match(/[A-Z]/g)) return Swal.showValidationMessage('Heslo musí obsahovat alespoň jedno velké písmeno')
				if (!password.match(/\d/g))	return Swal.showValidationMessage('Heslo musí obsahovat alespoň jedno číslo')
				if (!password.match(/^.{8,}$/g)) return Swal.showValidationMessage('Heslo musí mít alespoň 8 znaků')
				if (!password_again || !password || !old_password) return Swal.showValidationMessage('Vyplňte prosím všechna pole')
				try {
					const json = await (await fetch(page + '/change', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							"Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
						},
						body: JSON.stringify({password: password, password_old: old_password, type: 'password'})
					})).json()
					console.log (json)
					if (!json.valid) {
						Swal.hideLoading()
						return Swal.showValidationMessage(json.response)
					}
					notif.fire({
									icon: 'success',
									text: 'Změna hesla proběhla úspěšně',
									timer: 5000,
								})
				} catch (error) {
					console.error(error)
					Swal.hideLoading()
					Swal.showValidationMessage('Nastala chyba')
				}
			}
			
		})
		break
	case 'email': //not yet implemented
		break
	case 'delete':
		Swal.fire({
			title: 'Opravdu chcete smazat účet?',
			text: 'Tato akce je nevratná',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			html: `<form><input type="password" id="password" class="swal2-input" placeholder="Heslo" autocomplete="off"></form>`,
			confirmButtonText: 'Smazat',
			preConfirm: async () => {			
				Swal.showLoading()
				const password = Swal.getPopup().querySelector('#password').value
				if (!password) return Swal.showValidationMessage('Vyplňte prosím heslo')
				const data = { username: JSON.parse(localStorage.getItem('user')).user, password: password, type: 'delete'}
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						"Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
					},
					body: JSON.stringify(data),
				}
				try {
					const response = await fetch(page + '/delete', options)
					const json = await response.json()
					if (!json.valid) {
						Swal.hideLoading()
						return Swal.showValidationMessage(json.response)
					}
					localStorage.removeItem('user')
					await notif.fire({
						icon: 'success',
						text: 'Účet byl úspěšně smazán',
						timer: 5000,
					}).then(() => {
						logOut()
						login_btn()
					})
				} catch (error) {
					console.error(error)
					Swal.hideLoading()
					Swal.showValidationMessage('Nastala chyba')
				}}
		})

		break
	case 'pfp':
		var avatars = []
		var avatars_html = ''
		for (var i = 0; i < 9; i++) {
			avatars.push(`./images/avatar_${i}.png`)
			avatars_html += `<img id="avatar_${i}" class="avatar" src="/images/avatar_${i}.png" alt="avatar_${i}">`
		}
		var { value: avatar } = await Swal.fire({
			title: 'Změna profilového obrázku',
			html: '<div class="grid-container">' + avatars_html + '</div>',
			showCancelButton: true,
			showDenyButton: true,
			denyButtonText: 'Vlastní obrázek',
			confirmButtonText: 'Zněnit profilový obrázek',
			didOpen: () => {
				for (var i = 0; i < avatars.length; i++) {
					document
						.getElementById(`avatar_${i}`)
						.addEventListener('click', () => {
							for (var i = 0; i < avatars.length; i++) {
								document
									.getElementById(`avatar_${i}`)
									.classList.remove('selected')
							}
							event.target.classList.add('selected')
						})
				}
			},
			preConfirm: () => {
				var avatar = ''
				for (var i = 0; i < avatars.length; i++) {
					if (
						document
							.getElementById(`avatar_${i}`)
							.classList.contains('selected')
					) {
						avatar = avatars[i]
					}
				}
				if (avatar == '')
					Swal.showValidationMessage('Vyberte prosím profilový obrázek')
				if (avatar == JSON.parse(localStorage.getItem('user')).pfp)
					Swal.showValidationMessage('zvolený avatar je stejný jako předtím')
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
					if (!avatar)
						Swal.showValidationMessage('Vyberte prosím profilový obrázek')
					if (!avatar.match(/^http(s?):\/\/.*/g))
						Swal.showValidationMessage('Vyberte prosím platný obrázek')
					return avatar
				},
			})
			avatar = avatar.value
		}

		if (avatar) {
			requestOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					"Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
				},
				body: JSON.stringify({
					avatar: avatar,
					type: 'avatar',
				}),
			}
			fetch(page + '/change', requestOptions) //fetch data from request
				.then((result) =>
					result.json().then((json) => {
						console.log('response: ', Status(result.status))
						if (!json.valid) return swalError(json.response)
						notif
							.fire({
								icon: 'success',
								text: 'Změna profilového obrázku proběhla úspěšně',
								timer: 3000,
							})
							.then(() => {
								object = JSON.parse(localStorage.getItem('user'))
								object.pfp = avatar
								object.token = json.token
								localStorage.setItem('user', JSON.stringify(object))
								login_btn()
							})
					})
				)
		}
		break
	default:
		Swal.fire({
			title: 'Účet',
			html:
					'Jméno: ' +
					JSON.parse(localStorage.getItem('user')).user +
					' ' +
					'<button id="username" onclick=account("username") class="btn btn-warning">' +
					'Změnit jméno' +
					'</button><br>Heslo: ********** <button onclick=account("password") id="password" class="btn btn-warning">' +
					'Změnit heslo' +
					'</button><br><button onclick=account("pfp") class="btn btn-warning">' +
					'Změna profilového obrázku' +
					'</button><br><button onclick=logOut() class="btn btn-danger">' +
					'Odhlásit se' +
					'</button><br> <button onclick=account("delete") id="delete" class="btn btn-danger" style="color: red">' +
					'Smazat účet' +
					'</button><br>' +
					(JSON.parse(localStorage.getItem('user')).admin? (`
					<div class="mobile">
						<button onclick=userlist() id="userlist" class="btn btn-warning">Seznam uživatelů</button>
						<button onclick=audit() class="btn btn-warning">Audit</button>
					</div>`) : ''),
		})
		break
	}
}

async function userlist() {
	//check if user is admin
	if (!JSON.parse(localStorage.getItem('user')).admin)
		return swalError('Nemáte dostatečná oprávnění')
	var userlist = await fetch(page + '/userlist', { 
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
		"Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
	}
	}).then((result) =>
		result.json().then((json) => {
			console.log('response: ', Status(result.status))
			if (!json.valid) return swalError(json.response)
			return json.users
		})
	)
	var html = []
	let roles = ['user', 'advanced', 'admin']
	let usersperpage = 10
	var sorttype = {
		direction: -1,
		type: 'DATE',
	}
	userlist.forEach((element) => {
		let avatar = element.value.user.avatar;
		if (!avatar || typeof avatar !== 'string') {
		  avatar = './images/0.png';
		}
		let img = new Image()
		img.onerror = function() {
			this.src = './images/0.png';
		  };
		img.src = avatar;

		let userrole = element.value.user.admin
			? 3
			: element.value.user.role == 'advanced'
				? 2
				: 1
		html.push(
			'<tr><td>' +
				element.value.user.ID +
				'</td><td><img style="border-radius: 50%;width:50px;"referrerpolicy="no-referrer" src="' +
				avatar +
				'"></td><td>' +
				element.id +
				'</td><td>' +
				time(new Date().getTime() / 1000 - element.value.user.createdTimestamp) +
				'</td><td>' +
				(element.value.user.loggedTimestamp
					? new Date().getTime() / 1000 - element.value.user.loggedTimestamp <=
							3600 ||
					  JSON.parse(localStorage.getItem('user')).user == element.id
						? '<span style="color:#00ff00">aktivní</span>'
						: time(
							new Date().getTime() / 1000 - element.value.user.loggedTimestamp
						  )
					: '<span style="color:#ff0a0a">nikdy</span>') +
				'</td><td>' +
				'<select id="role"' +
				(JSON.parse(localStorage.getItem('user')).user == element.id
					? 'disabled'
					: '') +
				'>' +
				roles
					.map((role, index) => {
						return (
							'<option value="' +
							role +
							'" ' +
							(userrole == index + 1 ? 'selected' : '') +
							'>' +
							role +
							'</option>'
						)
					})
					.join('') +
				'</select>' +
				'</td></tr>'
		)
	})
	const swalPage = Swal.mixin({
		confirmButtonText: 'další',
		denyButtonText: 'předchozí',
		cancelButtonText: 'zavřít',
		reverseButtons: true,
		confirmButtonColor: '#3085d6',
		denyButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
	})

	let lastPage = Math.ceil(html.length / usersperpage)
	for (let currentPage = 1; currentPage < lastPage + 1; ) {
		const result = await swalPage.fire({
			title: 'Uživatelé' + ' (' + currentPage + '/' + lastPage + ')',
			showClass: {
				popup: 'animate__animated animate__fadeInDown'
			  },
			  hideClass: {
				popup: 'animate__animated animate__fadeOutUp'
			  },
			html:
				'<table style="width:100%;color:#000"><tr><th>ID</th><th>avatar</th><th id="TEXT">jméno ' +
				(sorttype.type == 'TEXT' ? (sorttype.direction == 1 ? '↓' : '↑') : '') +
				'</th><th id="DATE">vytvoření ' +
				(sorttype.type == 'DATE' ? (sorttype.direction == 1 ? '↓' : '↑') : '') +
				'</th><th id="DATE2">přihlášení ' +
				(sorttype.type == 'DATE2'
					? sorttype.direction == 1
						? '↓'
						: '↑'
					: '') +
				'</th><th id="ROLE">role ' +
				(sorttype.type == 'ROLE' ? (sorttype.direction == 1 ? '↓' : '↑') : '') +
				'</th></tr>' +
				html
					.slice(
						currentPage * usersperpage - usersperpage,
						currentPage * usersperpage
					)
					.join('') +
				'</table>',
			grow: 'row',
			showCancelButton: true,
			showDenyButton: currentPage > 1,
			showConfirmButton: currentPage < lastPage,
			didOpen: () => {
				document.getElementById('TEXT').onclick = function () {
					sortusers('TEXT')
				}
				document.getElementById('DATE').onclick = function () {
					sortusers('DATE')
				}
				document.getElementById('DATE2').onclick = function () {
					sortusers('DATE2')
				}
				document.getElementById('ROLE').onclick = function () {
					sortusers('ROLE')
				}
				document.querySelectorAll('select').forEach((select, index) => {
					select.addEventListener('change', (event) => {
						let userrole =
							event.target.value == 'admin'
								? 3
								: event.target.value == 'advanced'
									? 2
									: 1
						console.log(
							userlist[currentPage * usersperpage - usersperpage + index].id,
							roles[userrole - 1]
						)
						console.log()
						let requestOptions = {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								"Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
							},
							body: JSON.stringify({
								username: userlist[currentPage * usersperpage - usersperpage + index].id,
								role: roles[userrole - 1],
							}),
						}
						fetch(page + '/role', requestOptions) //fetch data from request
							.then((result) =>
								result.json().then((json) => {
									console.log('response: ', Status(result.status))
									if (!json.valid) return swalError(json.response)

									if (!JSON.parse(localStorage.getItem('user')).admin)
										return swalError('Nemáte dostatečná oprávnění')
									//change html of selected users role
									html = html.map((html, index2) => {
										if (index2 == index) {
											return html.replace(
												/<select>.*<\/select>/,
												'<select>' +
													roles
														.map((role, index) => {
															return (
																'<option value="' +
																role +
																'" ' +
																(userrole == index + 1 ? 'selected' : '') +
																'>' +
																role +
																'</option>'
															)
														})
														.join('') +
													'</select>'
											)
										}
										return html
									})
									if (
										userlist[index].id ==
										JSON.parse(localStorage.getItem('user')).user
									)
										return delay(1000).then(() => {
											verifyToken()
										})
								})
							)
					})
				})
			},
		})
		function sortusers(type) {
			Swal.showLoading()

			let direction = sorttype.type == type ? sorttype.direction * -1 : -1
			sorttype.direction = direction
			// direction = type == "TEXT" ? 1 : direction
			sorttype.type = type
			userlist.sort(listsGetSortCompare(type, direction))
			html = []
			var sorted = 0
			userlist.forEach((element) => {
				//check if image is valid otherwise use default image
				let avatar = element.value.user.avatar;
				if (!avatar || typeof avatar !== 'string') {
				  avatar = './images/0.png';
				}
				let img = new Image()
				img.onerror = function() {
					this.src = './images/0.png';
				  };
				img.src = avatar;
				let userrole = element.value.user.admin
					? 3
					: element.value.user.role == 'advanced'
						? 2
						: 1 // (element.value.user.admin ? 'admin' : element.value.user.role)
				html.push(
					'<tr><td>' +
						element.value.user.ID +
						'</td><td><img style="border-radius: 50%;width:50px"referrerpolicy="no-referrer" src="' +
						element.value.user.avatar +
						'"></td><td>' +
						element.id +
						'</td><td>' +
						time(
							new Date().getTime() / 1000 - element.value.user.createdTimestamp
						) +
						'</td><td>' +
						(element.value.user.loggedTimestamp
							? new Date().getTime() / 1000 -
									element.value.user.loggedTimestamp <=
									3600 ||
							  JSON.parse(localStorage.getItem('user')).user == element.id
								? '<span style="color:#00ff00">aktivní</span>'
								: time(
									new Date().getTime() / 1000 -
											element.value.user.loggedTimestamp
								  )
							: '<span style="color:#ff0a0a">nikdy</span>') +
						'</td><td>' +
						'<select id="role"' +
						(JSON.parse(localStorage.getItem('user')).user == element.id
							? 'disabled'
							: '') +
						'>' +
						roles
							.map((role, index) => {
								return (
									'<option value="' +
									role +
									'" ' +
									(userrole == index + 1 ? 'selected' : '') +
									'>' +
									role +
									'</option>'
								)
							})
							.join('') +
						'</select>' +
						'</td></tr>'
				)
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
}async function audit(){
	let response = await ( await fetch(`${page}/logs`,{
	 method: 'GET',
	 headers: {
		 'Content-Type': 'application/json',
		 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`}
	 })).json()
	  if(response.valid){
		 let logs = response.logs
		 let logsHTML = ``

		 for(let i = 0; i < logs.length; i++){
const f = new Intl.RelativeTimeFormat("cz", {
style: "long",
numeric: "auto"
});

const time = new Date(logs[i].timestamp);
const now = new Date();
const diff = now - time;
const days = Math.floor(diff / 1000 / 60 / 60 / 24);
let result = "";

if (days < 3) {
result = (f.format(-days, "day") + " v " + time.toLocaleTimeString());
}else if (days < 7) {
const weekday = time.toLocaleDateString("cs-CZ", {weekday: "long"});
let declension = "minul";
let koncovka = ["é","á","ý"]
if ((["pondělí","úterý"]).includes(weekday)) declension += koncovka[0];
else if ((["středa","sobota","neděle"]).includes(weekday)) declension += koncovka[1];
else declension += koncovka[2];
result = declension + " " + weekday + " v " + time.toLocaleTimeString();
} else {
result = time.toLocaleDateString()
}
let roles = {
"admin": "Admin",
"user": "Osobní",
"advanced": "Pokročilý"}
let user_, arrow_
switch(logs[i].icon){
case "ROLE_CHANGE":
 user_ = `<span style="color: #fff">${logs[i].user}</span>
<span style="color: gray;font-size:0.8em;">#${logs[i].id}</span>
<span style="color: rgba(255, 255, 255, 0.8)">${logs[i].type}</span>
<span style="color: #fff">${logs[i].data.target}</span>
<span style="color: gray;font-size:0.8em;">#${logs[i].data.targetid}</span>`
arrow_ = `<div class="log-content-data-new">
<ion-icon name="add-circle-outline"></ion-icon>
<span>${roles[logs[i].data.new] || logs[i].data.new}</span>
</div>
<div class="log-content-data-old">
<ion-icon name="remove-circle-outline"></ion-icon>
<span>${roles[logs[i].data.old] || logs[i].data.old}</span>
</div>`
break
case "ROLE_REQUEST":
	let company_size = ["1-10","11-50","51-250","251-1k","1k+"]
	 user_ = `<span style="color: #fff">${logs[i].user}</span>
<span style="color: gray;font-size:0.8em;">#${logs[i].id}</span>
<span style="color: rgba(255, 255, 255, 0.8)">${logs[i].type}</span>`
arrow_ = `<div class="log-content-data-request">
<table style="color:rgba(255, 255, 255, 0.8">
<tr>
<th>Jméno</th>
<th>Příjmení</th>
<th>Email</th>
<th>Firma</th>
<th>Zaměstnanců</th>
</tr>
<tr>
<td>${logs[i].data.name}</td>
<td>${logs[i].data.surname}</td>
<td>${logs[i].data.email}</td>
<td>${logs[i].data.company}</td>
<td>${company_size[logs[i].data.company_size - 1]}</td>
</tr>
</table>
</div>`
break
}

		   logsHTML += `
		   <div class="log">
			 <div class="log-icon">
			   <img src="${logs[i].avatar}" style="width: 50px;height: 50px;border-radius: 50%;">
			 </div>
			 <div class="log-content">
			   <div class="log-content-header">
				 <div class="log-content-header-content">
				   <span>
				   ${user_}
				   </span>
				 </div>
			   </div>
			   <div class="log-content-header-timestamp">
				   <span style="color: #C9C9C9;font-size:0.8em">${result}</span>
				 </div>
			 </div>
			  <div class="log-content-data">
				${arrow_}
			   </div>
			   <div class="log-arrow">
				   <ion-icon class="arrow-icon arrow-icon-right" name="chevron-down-outline"></ion-icon>
			  </div>
		   </div>
		   `
		 }
		 logsHTML += `
		 <style>
		   
		 .logs {
			 margin-top: 80px;
			 display: flex;
			 flex-direction: column;
			 align-items: center;
			 justify-content: center;
			 width: 100%;
			 height: 100%;
			 overflow: auto;
		   }
		   .log-content-data-request table {
			   width: 100%;
			   border-collapse: collapse;
			 
				 }
		   .log {
			 border: #212325 1px solid;
			 min-width: 700px;
			 background-color: #2b2d31;
			 border-radius: 5px;
			 margin: 5px;
			 display: flex;
			 flex-direction: row;
			 align-items: center;
			 padding: 10px;
			 font-size: 14px;
		   }
		   .log-active {
			 background-color: #26272a;
		  }
		 
		 a .log-icon {
			 margin-right: 10px;
			 color: #B9BBBE;
		   }
		   .log-content {
			 display: flex;
			 flex-direction: column;
			 align-items: flex-start;
			 justify-content: center;
			 flex-grow: 1;
			 color: #FFFFFF;
			 padding-left: 5px;
		   }
		   .log-content-header {
			 display: flex;
			 flex-direction: row;
			 align-items: center;
			 margin-bottom: 5px;
		   }
		   .log-content-header-content {
			 display: flex;
			 flex-direction: row;
			 align-items: center;
			 margin-right: 10px;
		   }
		   .log-content-data {
			 top: 50px;
			 display: none;  /* initially hidden */
			 flex-direction: row;
			 align-items: center;
		   }
		   
		   .log-content-data-target {
			 display: flex;
			 flex-direction: row;
			 align-items: center;
			 margin-right: 10px;
		   }
		   
		   .log-content-data-new,.log-content-data-old {
			 display: flex;
			 flex-direction: row;
			 align-items: center;
			 margin-right: 10px;
		   }
		   .log-content-data-new{
			 color: #43B581;
		   }
		   .log-content-data-old {
			 color: #F04747;
		   }
		   .log-arrow {
		   color: #B9BBBE;
		   margin-left: auto;
		   cursor: pointer;
		   font-size: 16px;
		   transform: rotate(0deg);
		   }
		   .arrow-icon-right {
			 transform: rotate(-90deg);
		   }
		 .log-content-data {
			 flex-direction: column;
		   }
		   .text-white {
			 color: #fff;
		   }
		   </style> `
		 Swal.fire({
			title: 'Audit logy',
			 html: logsHTML,
			 width: 'fit-content',
			 padding: '0',
			 background: '#313338',
			customClass: {
				title: 'text-white',
			},
			 didOpen: () => {
				const logsContainer = document.querySelector('.swal2-container');
				logsContainer.addEventListener('click', function(event) {
					console.log(event.target);
				if (!event.target.closest('.log')) return;
				toggleLogContent(event);
				});
				function toggleLogContent(event) {
					const logContent = event.target.closest('.log').querySelector('.log-content-data');
					const arrowIcon =  event.target.closest('.log').querySelector('.arrow-icon');
					
					if (arrowIcon.classList.contains('arrow-icon-right')) {
					logContent.style.display = 'flex';
					arrowIcon.classList.remove('arrow-icon-right');
					logContent.closest('.log').classList.add('log-active');
					const logs = document.querySelectorAll('.log');
						for (let i = 0; i < logs.length; i++) {
							if (logs[i] == event.target.closest('.log')) continue
							logs[i].querySelector('.log-content-data').style.display = 'none';
							logs[i].querySelector('.arrow-icon').classList.add('arrow-icon-right')
							logs[i].classList.remove('log-active');
						}
					} else {
					logContent.closest('.log').classList.remove('log-active');	
					logContent.style.display = 'none';
					arrowIcon.classList.add('arrow-icon-right');
					}
					}
		 }		
})		

}

}		

onstorage = (event) => {
	// console.log("storage change");
	if (event.key == 'user' && event.newValue != null)
		if (!verifyToken()) return logOut()
	delay(1000).then(() => {
		login_btn()
	})
}
// listen for popstate events
window.addEventListener("popstate", function(event) {
  if (Swal.isVisible()) {
    event.preventDefault();
    Swal.close();
  }
  if(this.window.location.pathname == '/zarizeni.html') {  
	if(document.getElementsByClassName("content")[0].classList.contains("disabled")) {
	device("back")
  }
}
});
const footer = document.querySelector("#footer");
const footerPadding = document.querySelector(".footer_padding");

footer.addEventListener("click", () => {
  footerPadding.classList.toggle("expanded");
});

window.addEventListener('load', function() {
	var images = document.getElementsByTagName('img');
	for (var i = 0; i < images.length; i++) {
	  if (images[i].complete) {
		images[i].classList.add('loaded');
	  } else {
		images[i].addEventListener('load', function() {
		  this.classList.add('loaded');
		});
	  }
	}
  });
  document.addEventListener('DOMNodeInserted', function(e) {
	if (e.target.tagName == 'IMG') {
	  e.target.addEventListener('load', function() {
		this.classList.add('loaded');
	  }
	  );
	}
	  });
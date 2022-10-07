/* LOGIN */ 
async function logIn() {
      const { value: formValues } = await Swal.fire({
    title: 'Login',
    html:
      '<input id="login_name" placeholder="Nickname" class="swal2-input">' +
      '<form><input id="login_pswrd" type="password" autocomplete="on" placeholder="Password" class="swal2-input"></form>',
    focusConfirm: false,
    showCancelButton: true,
    //footer: '<a href="#" onclick="register();">Not registered? </a>',
    preConfirm: () => {
      return [
        document.getElementById('login_name').value,
        document.getElementById('login_pswrd').value
             ]
    }
  })
  let login = {name:document.getElementById('login_name').value, password:document.getElementById('login_pswrd').value}; // make an object login with values
  if (formValues) {
      requestOptions = { //send a request
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'username': login.name,
        'password': login.password
      }
    };
    fetch(`/login`, requestOptions) //fetch data from request
    .then(result => result.json()
      .then(json => {
        console.log(json.valid);
        if(json.valid == true){
    Swal.fire({ //match
    toast: true,
    timerProgressBar: true,
    position: 'top-end',
    icon: 'success',
    title: 'logged in as ' + login.name,
    showConfirmButton: false,
    timer: 3000,
    
  })
      }else{ // password or name don´t match
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
    Swal.fire({ //match
    position: 'top-end',
    icon: 'info',
    toast: true,
    text: 'You have been logged out',
    showConfirmButton: false,
    timer: 3000
  })
      login = null;
      user =null;
      setTimeout(function(){
  
  window.location = window.location.href;
  }, 3500); 
      
    }
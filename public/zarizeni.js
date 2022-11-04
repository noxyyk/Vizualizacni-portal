function init(){
var user = localStorage.getItem("user"); //load logged user from local storage
if (user !== null) {
  document.getElementById('html').innerHTML = "";
  }
}
login_btn()
init()

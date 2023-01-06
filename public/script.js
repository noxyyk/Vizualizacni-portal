const delay = ms => new Promise(res => setTimeout(res, ms));
const text = ["remember", "expand", "funnier", "cooler","customize","shorten"]
//INIT
animate()

//FUNCTIONS
function setnew() {
    requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'id': "test",
        'url': "https://google.com",
        'author': "test"
      })
    };
    fetch(`/set`, requestOptions)
      .then(result => result.json()
        .then(json => {
        if (!json.valid) return console.error(json.error);
        //show sucess
        }))
      }
    async function animate() {
    await delay(1000);
    while (true) {
      for (var j = 0; j < text.length ; j++) {
      var last = text[j==0?text.length-1:j-1]
      var next = text[j]
      var word = last
      var textreply = ""
      for (var i = 0; i < last.length ; i++) {
        word = word.slice(0, -1)
        textreply = 'You want to <span style="color:#30d0e6;">' +  word + "</span> a link? you are at the right place!"
        document.getElementById("textedit").innerHTML = textreply
        await delay(120)
      }
      for (var i = 0; i < next.length; i++) {
        word = word + next[i]
        textreply = 'You want to <span style="color:#30d0e6;">' +  word + "</span> a link? you are at the right place!"
        document.getElementById("textedit").innerHTML = textreply
        await delay(120)
      }
      await delay(1000)
    }
  }
}
async function copy() {
  var copyText = document.getElementById("resultText");
  var text = copyText.value
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
  document.getElementById("resultText").value = "Copied!"
  await delay(1000)
  document.getElementById("resultText").value = text
}
async function sendData() {
  //get value from form
  var id = document.getElementById("customID").value
  var url = document.getElementById("url").value


}
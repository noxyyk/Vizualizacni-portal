var data
let user = JSON.parse(localStorage.getItem('user'))
if (user == null)  window.location.href = '/'
let requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        token: user.token
    })
}


addEventListener('click', function (x) {
if (!x.target.classList.contains('device'))  return
device_name = x.target.getElementsByTagName('h2')[0].innerHTML 

//show buttons rename, delelete, cancel, view
swal.fire({
    title: device_name,
    html: `<button onclick='device("rename", "${device_name}")' id="swal-button1" class="swal2-confirm swal2-styled" aria-label="" style="display: inline-block;">Přejmenovat</button><button id="swal-button2" onclick='device("remove", "${device_name}")' class="swal2-confirm swal2-styled" aria-label="" style="display: inline-block;">Smazat</button><button id="swal-button3" class="swal2-confirm swal2-styled" aria-label="" onclick='device("view","${device_name}")' style="display: inline-block;">Zobrazit</button>`,
    focusConfirm: false,
    preConfirm: () => {},
})

})

device("get")
async function device(x, target) {
  var devices = Array.from(
    document.getElementsByClassName("grid_container")[0].children
  );
  devices = devices.map(function (device) {
    return device.outerHTML;
  });
  const names = devices.map(function (device) {
    return device.split("h2>")[1].split("<")[0];
  }); 
  switch (x) {
    case "add":
      const add = async () => {
        console.log("add")
        Swal.showLoading()
        const deviceName = document.getElementById("swal-input1").value;
        if (deviceName.length > 20)  return swal.showValidationMessage(`Device name is too long`);
        if (deviceName.length < 3)  return swal.showValidationMessage(`Device name is too short`);
        if (names.includes(deviceName)) return swal.showValidationMessage(`Device already exists`);
        requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: JSON.parse(localStorage.getItem("user")).token,
            device: deviceName,
          }),
        };
        const response = await fetch(page + "/add", requestOptions)
        const data = await response.json();
        Swal.hideLoading()  
        if (!data.valid) return Swal.showValidationMessage(data.response);

        devices.splice(
          devices.length - 1,
          0,
          `<div class="grid_item device"><h2>${deviceName}</h2></div>`
        );
        document.getElementsByClassName("grid_container")[0].innerHTML =
          devices.join("");
      }
     Swal.fire({
        title: "Přidat zařízení",
        html: '<form><input id="swal-input1" class="swal2-input" placeholder="Device Name"></form>',
        focusConfirm: false,
        showCloseButton: true,
        preConfirm: () => add()
      });



      break;
    case "remove":
      const remove = async () => {
        Swal.showLoading()
        const device = document.getElementById("swal-input1").value;
                if (device !== `smazat ${target}`) return swal.showValidationMessage(`neplatný vstup`)
        requestOptions = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              token: JSON.parse(localStorage.getItem("user")).token,
              name: target,
          }),
      };
      const response = await fetch(page + "/delete", requestOptions)
      const data = await response.json();
      if (!data.valid) return Swal.showValidationMessage(data.response);
      Swal.hideLoading()
      devices.splice(names.indexOf(`${target}`), 1)
      document.getElementsByClassName("grid_container")[0].innerHTML = devices.join("")
    }
      swal.fire({
            title: `Smazat ${target}`,
            html: `<p>pro smazání napište <mark>smazat ${target}</p></mark><br><input id="swal-input1" class="swal2-input" placeholder="Device Name">`,
            focusConfirm: false,
            preConfirm: () => remove()
        })
      break;
    case "rename":
      const rename = async () => {
        Swal.showLoading()
        const device = document.getElementById("swal-input1").value;
        if (device.length > 20) return swal.showValidationMessage(`Device name is too long`)
        if (device.length < 3) return swal.showValidationMessage(`Device name is too short`)
        if (names.includes(device)) return swal.showValidationMessage(`Device already exists`)
        requestOptions = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              token: JSON.parse(localStorage.getItem("user")).token,
              name: target,
              new_name: device,
              type: "name"
          }),
      };
      const response = await fetch(page + "/edit", requestOptions)
      const data = await response.json();
      if (!data.valid) return Swal.showValidationMessage(data.response);
      Swal.hideLoading()
      devices[names.indexOf(target)] = `<div class="grid_item device"><h2>${device}</h2></div>`
      document.getElementsByClassName("grid_container")[0].innerHTML = devices.join("")
    }
        swal.fire({
            title: `Přejmenování ${target}`,
            html: '<input id="swal-input1" class="swal2-input" placeholder="Nový název">',
            focusConfirm: false,
            preConfirm: rename
        })
      break;
    case "view":
      Swal.close()
      let device = data.find(device => device.name == target)
      let date = new Date(device.createdTimestamp * 1000)
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()
      let hours = date.getHours()
      let minutes = date.getMinutes()
      let seconds = date.getSeconds()
      let time = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
      document.getElementsByClassName("grid_container")[0].style.display = "none"
      document.getElementsByClassName("device")[0].innerHTML = `
      <div class="device">
      <div class="articles"><div class="article">
      <h2>${target}</h2>
      <h3>Informace</h3>
      <p>Vytvořeno: ${time} <br>
      Data: ${device.data.length == 0 ? "zatím nic" : device.data}</p>
      </div></div>
    </div>`  
      break;
    case "get":
      fetch(`${page}/getall`, requestOptions)
    .then(response => response.json())
    .then(result => { 
        if (!result.valid) return
        if (result.devices.length == 0) return
        data = result.devices
            result.devices.forEach(device => {
                devices.splice(
                    devices.length - 1,
                    0,
                    `<div class="grid_item device"><h2>${device.name}</h2></div>`
                  );
            })
            document.getElementsByClassName("grid_container")[0].innerHTML = devices.join("")
    })
    break
      default:
        Swal.fire({
            title: "Zařízení",
            html: `<div class="grid_container">${devices.join("")}</div>`,
            focusConfirm: false,
            showCloseButton: true,
            showConfirmButton: false,
        })


      break;
  }
}

var data
let user = JSON.parse(localStorage.getItem('user'))
if (user == null)  window.location.href = '/'


addEventListener('click', function (x) {
if (!x.target.classList.contains('device'))  return
device_name = x.target.getElementsByTagName('h2')[0].innerHTML 
device("view",device_name)
})

device("get")
async function device(x, target) {
  console.log(x)
  var devices = Array.from(
    document.getElementsByClassName("grid_container")[0].children
  );
  devices = devices.map(function (device) {
    return device.outerHTML;
  });
  const names = devices.map(function (device) {
    return device.split("h2>")[1].split("<")[0]
  }); 
  if (target == undefined && ["remove","rename"].includes(x) ) {
   target = document.getElementsByClassName("deviceinfo")[0].getElementsByTagName("h2")[0].innerHTML
  }
  switch (x) {
    case "add":
     Swal.fire({
        title: "Přidat zařízení",
        html: '<form><input id="swal-input1" class="swal2-input" placeholder="Device Name"></form>',
        focusConfirm: false,
        showCloseButton: true,
        preConfirm: async () => {
          Swal.showLoading()
          const deviceName = document.getElementById("swal-input1").value;
          if (deviceName.length > 20)  return swal.showValidationMessage(`Device name is too long`);
          if (deviceName.length < 3)  return swal.showValidationMessage(`Device name is too short`);
          if (names.includes(deviceName)) return swal.showValidationMessage(`Device already exists`);
         let response = await fetch(page + "/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
            },
            body: JSON.stringify({
              device: deviceName,
            }),
          })
          response = await response.json();
          Swal.hideLoading()  
          if (!response.valid) return Swal.showValidationMessage(response.response);
  
          devices.splice(
            devices.length - 1,
            0,
            `<div class="grid_item device"><h2>${deviceName}</h2></div>`
          );
          document.getElementsByClassName("grid_container")[0].innerHTML =
            devices.join("");
            data.push({name: deviceName, createdTimestamp: Math.floor(Date.now() / 1000), data: []})
        }
      });



      break;
    case "remove":
      Swal.fire({
            title: `Smazat ${target}`,
            html: `<p>pro smazání napište <mark>smazat ${target}</p></mark><br><input id="swal-input1" class="swal2-input" placeholder="Device Name">`,
            showCancelButton: true,
            confirmButtonText: 'Potvrdit',
            preConfirm:  async () => {
              Swal.showLoading()
              const device = document.getElementById("swal-input1").value;
                      if (device !== `smazat ${target}`) return swal.showValidationMessage(`neplatný vstup`)
            let response = await fetch(page + "/remove", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
              },
              body: JSON.stringify({
                  name: target,
              }),
          })
             response = await response.json();
            if (!response.valid) return Swal.showValidationMessage(response.response);
            Swal.hideLoading()
            devices.splice(names.indexOf(`${target}`), 1)
            document.getElementsByClassName("grid_container")[0].innerHTML = devices.join("")
            data.splice(names.indexOf(`${target}`), 1)
            document.getElementsByClassName("device_content")[0].classList.add("disabled")
            document.getElementsByClassName("content")[0].classList.remove("disabled")
          }
        })
      break;
    case "rename":
        Swal.fire({
            title: `Přejmenování ${target}`,
            html: '<input id="swal-input1" class="swal2-input" placeholder="Nový název">',
            showCancelButton: true,
            confirmButtonText: 'Přejmenovat',
            preConfirm: async () => {
              Swal.showLoading()
              const device = document.getElementById("swal-input1").value;
              if (device.length > 20) return swal.showValidationMessage(`Device name is too long`)
              if (device.length < 3) return swal.showValidationMessage(`Device name is too short`)
              if (names.includes(device)) return swal.showValidationMessage(`Device already exists`)
            let response = await fetch(page + "/edit", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
              },
              body: JSON.stringify({
                  name: target,
                  new_name: device,
                  type: "name"
              }),
          })
            response= await response.json();
            if (!response.valid) return Swal.showValidationMessage(response.response);
            Swal.hideLoading()
            devices[names.indexOf(target)] = `<div class="grid_item device"><h2>${device}</h2></div>`
            document.getElementsByClassName("grid_container")[0].innerHTML = devices.join("")
            data[names.indexOf(target)].name = device
            //update device info
            if (document.getElementsByClassName("deviceinfo")[0].getElementsByTagName("h2")[0].innerHTML == target) {
              document.getElementsByClassName("deviceinfo")[0].getElementsByTagName("h2")[0].innerHTML = device
            }
          }
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
      document.getElementsByClassName("deviceinfo")[0].innerHTML = `
      <h2>${target}</h2>
      <h3>Informace</h3>
      <p>Vytvořeno: ${time} <br>
      Data: ${device.data.length == 0 ? "zatím nic" : device.data}</p>
      </div>`
    var ctx = document.getElementById('my-chart').getContext('2d');
    if (window.myChart != null) {
      window.myChart.destroy();
    }
    window.myChart =  new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'My Data',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
  

//get id with dievice_content and remove class disabled
document.getElementsByClassName("device_content")[0].classList.remove("disabled")
document.getElementsByClassName("content")[0].classList.add("disabled")


const response = await fetch(`${page}/data`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
  },
  body: JSON.stringify({
    device: target,
  }),
})
const result = await response.json()
if (!result.valid) return Swal.fire({
  icon: 'error',
  title: 'Oops...',
  text: result.response
})
console.log(result.response)
Swal.fire({
  title: 'Data',
  html: `
  <div class="grid_container">
  ${
    Object.entries(result.response).map(([measurement, data]) => `
      <div class="grid_item data">
        <h2>${measurement}</h2>
        <p>${
          data.map(([datetime, value]) => {
            const date = new Date(datetime);
            const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} - ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}:${date.getMilliseconds().toString().padStart(2, "0")}: ${value}`;
            return formattedDate;
          }).join("<br>")
        }</p>
      </div>
    `).join("")
  }
</div>


  `,
  showCloseButton: true,
  showCancelButton: false,
  width: '100%',
  focusConfirm: false,
  confirmButtonText: 'Zavřít',
  confirmButtonAriaLabel: 'Zavřít',
  cancelButtonText: 'Zavřít',
  cancelButtonAriaLabel: 'Zavřít',
})



      break;
    case "back":
      document.getElementsByClassName("device_content")[0].classList.add("disabled")
      document.getElementsByClassName("content")[0].classList.remove("disabled")
      break;
    case "get":
      fetch(`${page}/getall`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
        }
    })
    .then(response => response.json())
    .then(result => { 
        if (!result.valid) return
        if (result.devices.length == 0) return
        data = result.devices
        localStorage.setItem("devices", JSON.stringify(data))

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
    case "set":
  target = target ? target : document.getElementsByClassName("deviceinfo")[0].getElementsByTagName("h2")[0].innerHTML
  const device_content = data.findIndex(x => x.name == target);
  var {bucket, org, token, url} = data[device_content]
  if (data[device_content].bucket == undefined) {
    bucket = ""
    org = ""
    token = ""
    url = ""
  }
    Swal.fire({
      title: 'InfluxDB Query',
      width: '50%',
      html:
      `<form><input id="bucket" type="name" value="${bucket}" placeholder="Bucket" class="swal2-input">
        <input id="org" type="name" value="${org}" placeholder="Organizace" class="swal2-input">
        <input id="token" type="name" value="${token}" placeholder="Token" class="swal2-input">
        <input id="url" type="name" value="${url}" placeholder="Url adresa" class="swal2-input"></form>
        <style>
        .swal2-input {
          min-width: 60%;
          }
          </style>`,
      showCancelButton: true,
      confirmButtonText: 'Odeslat',
      preConfirm: async () => {
        Swal.showLoading();
        const bucket = Swal.getPopup().querySelector('#bucket').value;
        const url = Swal.getPopup().querySelector('#url').value;
        const token = Swal.getPopup().querySelector('#token').value;
        const org = Swal.getPopup().querySelector('#org').value;
        if (!bucket || !url || !token || !org) {
          return Swal.showValidationMessage('Vyplňte všechny údaje');
        }
        target = document.getElementsByClassName("deviceinfo")[0].getElementsByTagName("h2")[0].innerHTML
        const response = await fetch(`${page}/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
          },
          body: JSON.stringify({
            device: target,
            bucket: bucket,
            url: url,
            token: token,
            org: org
          }),
        });
        const json = await response.json();
        Swal.hideLoading();
        if (!json.valid) {
          return Swal.showValidationMessage(json.response);
        }
        Swal.fire({
          title: 'Query Results',
          html: JSON.stringify(json, null, 2),
          confirmButtonText: 'OK',
        });
      },
    });

    
    break  
    default:
console.log("error")
      break;
  }
}
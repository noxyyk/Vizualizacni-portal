var data
let user = localStorage.getItem('user')
if (user == null)  window.location.href = '/'
let deviceLoad = JSON.parse(localStorage.getItem('devices'))
let addDevice = `<div class="grid_item add_device" onclick='device("add")'>
<h2><ion-icon name="add-circle-outline"></ion-icon></h2> 
</div>`
if (deviceLoad != null && deviceLoad.length > 0) {
  let devices = []
 deviceLoad.forEach(device => {
  devices.push(`<div class="grid_item device"><h2>${device.name}</h2></div>`);
});
devices.push(addDevice)
document.querySelector(".grid_container").innerHTML = devices.join("")
} else {
  document.querySelector(".grid_container").innerHTML =  `<div class="grid_item skeleton"></div><div class="grid_item skeleton"></div><div class="grid_item skeleton"></div><div class="grid_item skeleton"></div><div class="grid_item skeleton"></div><div class="grid_item skeleton"></div>`
}

addEventListener('click', function (x) {
if (!x.target.classList.contains('device'))  return
device_name = x.target.getElementsByTagName('h2')[0].innerHTML 
device("view",device_name)
})

device("get")
async function device(x, target) {  
  ;(x)
  var devices = Array.from(
    document.getElementsByClassName("grid_container")[0].children
  );
  devices = devices.filter(function (device) { 
    return !device.classList.contains("skeleton");
  });
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
      if (screen.width < 550 && screen.width < screen.height) return rotateScreen()
      window.history.pushState(null, null, window.location.href);
      document.getElementById("chart-container").innerHTML = ""
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
      <span id="data-section"></span></p>    
      </div>`
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
if (!result.valid) {
  document.getElementById("chart-container").innerHTML = `<div class="error">${result.response}</div>`
  document.getElementById("chart-container").classList.add("error")
  document.getElementById("chart-container").style.minHeight = "fit-content"
  return
}
document.getElementById("chart-container").style.display = "block"
document.getElementById("chart-container").classList.remove("error")
const units = ['day', 'hour', 'minute'];
const buttons = document.querySelectorAll('.time-range-button');
const chartConfigs = {};
const dataSummary = {};
let dataSection = "";
let secrets = result.secrets;
for (var key in result.response) {
  if (result.response.hasOwnProperty(key)) {
    const value = result.response[key]
      // Create a canvas element for the chart
      var canvas = document.createElement('canvas');
      canvas.id = key;
      document.getElementById('chart-container').appendChild(canvas);
      const datas = value.values.map(function (item) {
        return {
          x: String(moment(item[0]).format("YYYY-MM-DD HH:mm:ss")),
          y: String(item[1])
        }
      }); 
       // Configure chart options
      const chartOptions = { scales: {
        xAxes: {
          type: 'time',
          time: {
            unit: 'minute',
            displayFormats: {
              second: 'mm:ss',
              minute: 'HH:mm',
              hour: 'MMM d, h',
              day: 'MMM d',
              days: 'MMM d',
              week: 'MMM d'
            }
          },
          ticks: {
            display: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        },
        y: {
          ticks: {
            display: true,
          },
          title: {
            display: true,
            text: 'hodnota'
          }
        },
        x: {
          title: {
            display: true,
            text: 'čas'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: key,
        }
      }}
      const timeUnits = [
        { label: 'všechny hodnoty', unit: 'all', value: 1 },
        { label: 'týdny', unit: 'week', value: 1 },
        { label: 'dny', unit: 'day', value: 1 },
        { label: 'hodiny', unit: 'hour', value: 1 },
        { label: 'minuty', unit: 'minute', value: 1 },
        { label: 'sekundy', unit: 'second', value: 1},
        { label: 'živě', unit: 'live', value: 0}
      ];
      const buttonsContainer = document.createElement('div');
      buttonsContainer.id = 'buttons-container';
      document.getElementById('chart-container').appendChild(buttonsContainer);
      
      const buttons = timeUnits.map(({ label, unit, value }) => {
        const button = document.createElement('button');
        button.innerText = label;
        button.setAttribute('data-unit', `${value} ${unit}`);
        if (unit === "live"){
          const live = result.response[key]
          button.setAttribute("data-measurement", key);
          button.setAttribute("data-tag", live.tag);
          button.setAttribute("data-tagvalue", live.value);
        }
        buttonsContainer.appendChild(button);
        return button;
      });
      
      // Create chart
      const ctx = canvas.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: value.tag + " - " + value.value,
            data: datas
          }]
        },
        options: chartOptions
      });
        // Calculate max, min, average, and last values
        const dataValues = value.values.map(function (item) { return Number(item[1]) });
        const maxValue = Math.max(...dataValues);
        const minValue = Math.min(...dataValues);
        const sumValue = dataValues.reduce((accumulator, currentValue) => accumulator + currentValue);
        const averageValue = sumValue / dataValues.length;
        const lastValue = dataValues[dataValues.length - 1];
        
        // Add data summary to object
        dataSummary[key] = {
          key: key,
          maxValue: maxValue,
          minValue: minValue,
          sumValue: sumValue,
          averageValue: averageValue,
          lastValue: lastValue,
          lastTimeValue: moment(value.lastTimestamp).format("HH:mm:ss DD.MM.YYYY")
        };

        //check if dataSection has table
        if (dataSection === "") {
        dataSection += `
        <table class="data-table">
        <tr>
          <th>Measurement</th>
          <th>Maximální hodnota</th>
          <th>Minimální hodnota</th>
          <th>Součet</th>
          <th>Průměrná hodnota</th>
          <th>Poslední hodnota</th>
        </tr>`
        }
        dataSection += `
          <tr>
            <td><b>${dataSummary[key].key}</b></td>
            <td>${Math.round(dataSummary[key].maxValue)}</td>
            <td>${Math.round(dataSummary[key].minValue)}</td>
            <td>${Math.round(dataSummary[key].sumValue)}</td>
            <td>${Math.round(dataSummary[key].averageValue)}</td>
            <td>${Math.round(dataSummary[key].lastValue)}, ${dataSummary[key].lastTimeValue}</td>
          </tr>`;
      if (value.secret) {
        secrets.push(value.secret);
      }
    // Store chart configuration
    chartConfigs[key] = chartOptions;
    // Add event listeners to buttons
    buttons.forEach(button => {
      button.addEventListener('click', () => {  
        const unit = button.getAttribute('data-unit');
        const [time, timeUnit] = unit.split(' ');
        if (timeUnit === 'live') {
          const measurement = button.getAttribute('data-measurement');
          const tag = button.getAttribute('data-tag');
          const tagvalue = button.getAttribute('data-tagvalue');
          const token = JSON.parse(localStorage.getItem('user')).token;
          window.location.href = `/live?measurement=${measurement}&tag=${tag}&tagvalue=${tagvalue}&token=${token}`
          return
        }
        const lastTime = moment(value.values[value.values.length - 1][0]).unix()
        const firstTime = moment(value.values[0][0]).unix()
        let time_per_unit = {"all":9999999,"second": 60, "minute": 3600, "hour":86400, "day":604800, "week":2629743}
        const diff = (lastTime - time_per_unit[timeUnit])
        if (diff < firstTime) { 
          if (lastTime - firstTime > 1200000) {chartConfigs[key].scales.xAxes.ticks.stepSize = 1; chartConfigs[key].scales.xAxes.time.unit = "day";}
          else if (lastTime - firstTime > 6400000) {chartConfigs[key].scales.xAxes.ticks.stepSize = 20; chartConfigs[key].scales.xAxes.time.unit = "hour";}
          else if (lastTime - firstTime > 320000) {chartConfigs[key].scales.xAxes.ticks.stepSize = 10; chartConfigs[key].scales.xAxes.time.unit = "hour";}
          else if (lastTime - firstTime > 10000) {chartConfigs[key].scales.xAxes.ticks.stepSize = 10; chartConfigs[key].scales.xAxes.time.unit = "minute";}
          else if (lastTime - firstTime > 500) {chartConfigs[key].scales.xAxes.ticks.stepSize = 10; chartConfigs[key].scales.xAxes.time.unit = "second";}
          else {chartConfigs[key].scales.xAxes.ticks.stepSize = 10; chartConfigs[key].scales.xAxes.time.unit = "second";}
        chartConfigs[key].scales.xAxes.min = moment.unix(firstTime).toDate();
        chartConfigs[key].scales.xAxes.max = moment.unix(lastTime).toDate();
        chart.options = chartConfigs[key];
        chart.update();
        return
    }
    chartConfigs[key].scales.xAxes.ticks.stepSize = 5
    chartConfigs[key].scales.xAxes.time.unit = timeUnit;
    chartConfigs[key].scales.xAxes.min = moment.unix(diff).toDate();

        
        

        chart.options = chartConfigs[key];
        chart.update();
      });
    });
      
  }
}
dataSection += `</table><br>` 
  dataSection += `<div class="apikeys"><h3>API Klíče</h3><p> 
  Vaše tajné klíče rozhraní API jsou uvedené níže. Vezměte prosím na vědomí, že po vygenerování znovu nezobrazujeme vaše tajné klíče rozhraní API.
  Nesdílejte klíč rozhraní API s ostatními ani ho nezveřejňujte v prohlížeči nebo jiném kódu na straně klienta.</p> <table id="secrets" class="table table-striped table-bordered table-hover table-sm"><tr><th>Klíč</th><th>Vytvořen</th><th>Použitý</th><th></th></tr>`
  if (secrets?.tokens?.length > 0) {
  for (let i = 0; i < secrets.tokens.length; i++) {
    dataSection += `<tr id="secret${i}"><td>${secrets.tokens[i]}</td><td>${moment(secrets.info[i].created).format("DD.MM.YYYY")}</td><td>${secrets.info[i].lastUsed == "nikdy" ? "nikdy" : moment(secrets.info[i].lastUsed).format("DD.MM.YYYY")}</td><td><a type="button"onclick="deleteSecret('${secrets.tokens[i]}')"><ion-icon name="trash-outline"></ion-icon></a></td></tr>`
  }
} 
  dataSection += `</table></div><br>
  <button type="button" style="width:fit-content" class="btn btn-primary" onclick="generateSecret()">Generovat nový klíč</button>`
document.getElementById("data-section").innerHTML = dataSection
      break;
    case "back":
      if (screen.orientation.lock) {
   screen.orientation.unlock();
}
      document.getElementsByClassName("device_content")[0].classList.add("disabled")
      document.getElementsByClassName("content")[0].classList.remove("disabled")
      let chartContainer = document.getElementById("chart-container")
chartContainer.querySelectorAll('#buttons-container').forEach(e => e.remove());
try {
      for (let i = 0; i < chartContainer.children.length; i++) {
        Chart.getChart(chartContainer.children[i].id).destroy()
        chartContainer.children[i].remove()
      }
    } catch (error) {
      chartContainer.innerHTML = ""
    }
      break;
    case "get":
      fetch(`${page}/getall`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(result => {
        if (!result.valid || result.devices.length == 0) {
          document.querySelectorAll('.skeleton').forEach(e => e.remove());
          return;
        }
        
        data = result.devices;
        localStorage.setItem("devices", JSON.stringify(data));
        devices = [];
        result.devices.forEach(device => {
          devices.push(`<div class="grid_item device"><h2>${device.name}</h2></div>`);
        });
        devices.push(addDevice)
        document.querySelector(".grid_container").innerHTML = devices.join("");
        document.querySelectorAll('.skeleton').forEach(e => e.remove());
      })
      .catch(error => {
        document.querySelectorAll('.skeleton').forEach(e => e.remove());
        console.error('Error:', error);
      });
      
    break
    case "set":
  target = target ? target : document.getElementsByClassName("deviceinfo")[0].getElementsByTagName("h2")[0].innerHTML
  const device_content = data.findIndex(x => x.name == target);
  var {bucket, org, token, url, tag, tagvalue} = data[device_content]
  if (data[device_content].bucket == undefined) {
    bucket = ""
    org = ""
    token = ""
    url = ""
    tag = ""
    tagvalue = ""
  }
    Swal.fire({
      title: 'InfluxDB Query',
      width: '50%',
      html:
      `<form><input id="bucket" type="name" value="${bucket}" placeholder="Bucket" class="swal2-input">
        <input id="org" type="name" value="${org}" placeholder="Organizace" class="swal2-input">
        <input id="token" type="name" value="${token}" placeholder="Token" class="swal2-input">
        <input id="url" type="name" value="${url}" placeholder="Url adresa" class="swal2-input">
        <input id="tag" type="name" value="${tag}" placeholder="tag" class="swal2-input">
        <input id="tagvalue" type="name" value="${tagvalue}" placeholder="hodnota tagu" class="swal2-input">
        </form>
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
        const tag = Swal.getPopup().querySelector('#tag').value;
        const tagvalue = Swal.getPopup().querySelector('#tagvalue').value;
        if (!bucket || !url || !token || !org || !tag || !tagvalue) {
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
            org: org,
            tag: tag,
            tagvalue: tagvalue
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
async function generateSecret() {
const response = await fetch(`${page}/secret?type=create`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
  },
  body: JSON.stringify({
    'device': document.getElementsByClassName("deviceinfo")[0].getElementsByTagName("h2")[0].innerHTML,
  })
});
const json = await response.json();
if (!json.valid) {
  return Swal.showValidationMessage(json.response);
}
Swal.fire({
  title: 'Nový token',
  html: JSON.stringify(json.token),
  confirmButtonText: 'OK',
  text: "Token můžete zkopírovat pouze jednou, po zavření okna se již nezobrazí."
});
//add to table
var table = document.getElementById("secrets");
//insert row at the end of the table
var row = table.insertRow(-1);
var cell1 = row.insertCell(0);
var cell2 = row.insertCell(1);
var cell3 = row.insertCell(2);
var cell4 = row.insertCell(3);
cell1.innerHTML = json.hidden
cell2.innerHTML = moment().format('DD.MM.YYYY')
cell3.innerHTML = "nikdy"
cell4.innerHTML = `<a type="button"onclick="deleteSecret('${json.hidden}')"><ion-icon name="trash-outline"></ion-icon></a>`
}
async function deleteSecret(desiredKey) {
  //get index from key
  var index = -1;
  var table = document.getElementById("secrets");
  var rows = table.getElementsByTagName("tr");
  
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName("td");
    var key = cells[0];
    if (key === undefined) continue
    key = key.innerHTML;
    if (key === desiredKey) {
      index = i;
      break;
    }
  }
  if (index === -1) return;
  console.log(index)
  const response = await fetch(`${page}/secret?type=delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem("user")).token}`
    },
    body: JSON.stringify({
      'device': document.getElementsByClassName("deviceinfo")[0].getElementsByTagName("h2")[0].innerHTML,
      'token': index - 1
    })
  });
  const json = await response.json();
  if (!json.valid) {
    return Swal.showValidationMessage(json.response);
  }
  table.deleteRow(index);
  }
  async function rotateScreen() {
    screen.orientation.lock('landscape').catch((error) => {
      const animationDiv= `<div class="center">
        <div class="phone"></div>
        <div class="message">
          Otočte telefon do širokého režimu
        </div></div>
      `;
      
      let style = document.createElement("style");
      style.innerHTML = `
      .center {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 175px !important;
      }
      .phone {
        height: 50px;
        width: 100px;
        border: 3px solid black;
        border-radius: 10px;
        animation: rotate 1.5s ease-in-out infinite alternate;
      }
      
      .message {
        color: black;
        font-size: 1em;
        margin-top: 40px;
      }
      
      @keyframes rotate {
        0% {
          transform: rotate(0deg)
        }
        50% {
          transform: rotate(-90deg)
        }
        100% {
          transform: rotate(-90deg)
        }
      }
      `;
      Swal.fire({
        title: "Otočte telefon",
        html: animationDiv,
        showConfirmButton: false,
        showCloseButton: true,
        heightAuto: false,
        customClass: {
          htmlContainer: "swal2-html-container",
        },
        didOpen: () => {
          document.head.appendChild(style);
        },
      });

      

      
      //wait till user rotates the screen

    });
  }
  function handleOrientationChange() {
    console.log(screen.orientation.type);
    if (screen.orientation.type === "landscape-primary") {
      Swal.close();
    } else {
      if (document.getElementsByClassName("device_content")[0].classList.contains("disabled")) return;
      rotateScreen();
    }
  }
  
  // Add event listener
  screen.orientation.addEventListener("change", handleOrientationChange);
  
  // Remove event listener when the page is unloaded
  window.addEventListener("beforeunload", () => {
    screen.orientation.removeEventListener("change", handleOrientationChange);
  });
  
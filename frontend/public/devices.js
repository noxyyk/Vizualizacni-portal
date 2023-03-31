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
  ;(x)
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

  return
}
document.getElementById("chart-container").style.display = "block"
const units = ['day', 'hour', 'minute'];
const buttons = document.querySelectorAll('.time-range-button');
const chartConfigs = {};
const dataSummary = {};
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

    const dataSection = document.getElementById("data-section");
    dataSection.innerHTML += `<b> ${dataSummary[key].key}</b><br>
    Maximální: ${dataSummary[key].maxValue}<br>
    Minimální: ${dataSummary[key].minValue}<br>
    Součet: ${dataSummary[key].sumValue}<br>
    Průměrná: ${dataSummary[key].averageValue}<br>
    Poslední: ${dataSummary[key].lastValue}, ${dataSummary[key].lastTimeValue}<br><br>`;
    // Store chart configuration
    chartConfigs[key] = chartOptions;
    // Add event listeners to buttons
    buttons.forEach(button => {
      button.addEventListener('click', () => {  
        const unit = button.getAttribute('data-unit');
        const [time, timeUnit] = unit.split(' ');
        if (timeUnit === 'live') {
 window.location.href = `/live?device=${target}&tag=${key}`
          return;
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
      break;
    case "back":
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
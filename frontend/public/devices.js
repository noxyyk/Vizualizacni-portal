addEventListener('click', function (x) {
if (!x.target.classList.contains('device')) return
//get device name
var device_name = x.target.getElementsByTagName('h2')[0].innerHTML
//show buttons rename, delelete, cancel, view
swal.fire({
    title: device_name,
    html: `<button onclick='device("rename")' id="swal-button1" class="swal2-confirm swal2-styled" aria-label="" style="display: inline-block;">Rename</button><button id="swal-button2" onclick='device("delete")' class="swal2-confirm swal2-styled" aria-label="" style="display: inline-block;">Delete</button><button id="swal-button3" class="swal2-confirm swal2-styled" aria-label="" onclick='device()' style="display: inline-block;">View</button>`,
    focusConfirm: false,
    preConfirm: () => {
    },
})

})
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
      var device_name = await swal.fire({
        title: "Add Device",
        html: '<input id="swal-input1" class="swal2-input" placeholder="Device Name">',
        focusConfirm: false,
        preConfirm: () => {
          const deviceName = document.getElementById("swal-input1").value;
          if (deviceName.length > 20)
            return swal.showValidationMessage(`Device name is too long`);
          if (deviceName.length < 3)
            return swal.showValidationMessage(`Device name is too short`);
          if (names.includes(deviceName))
            return swal.showValidationMessage(`Device already exists`);
          return deviceName;
        },
      });
      if (!device_name.isConfirmed) return;

      devices.splice(
        devices.length - 1,
        0,
        `<div class="grid_item device" onclick='device()'><h2>${device_name.value}</h2></div>`
      );
      document.getElementsByClassName("grid_container")[0].innerHTML =
        devices.join("");

      break;
    case "remove":
        var device_name = await swal.fire({
            title: "Remove Device",
            html: '<input id="swal-input1" class="swal2-input" placeholder="Device Name">',
            focusConfirm: false,
            preConfirm: () => {
                const deviceName = document.getElementById("swal-input1").value;
                if (deviceName.length > 20)
                    return swal.showValidationMessage(`Device name is too long`)
                if (deviceName.length < 3)
                    return swal.showValidationMessage(`Device name is too short`)
                if (!names.includes(deviceName))
                    return swal.showValidationMessage(`Device does not exist`)
                return deviceName
            }
        })
        if (!device_name.isConfirmed) return
        devices.splice(names.indexOf(device_name.value), 1)
        document.getElementsByClassName("grid_container")[0].innerHTML = devices.join("")
      break;
    case "rename":
        var device_name = await swal.fire({
            title: "Rename Device",
            html: '<input id="swal-input1" class="swal2-input" placeholder="Device Name">',
            focusConfirm: false,
            preConfirm: () => {
                const deviceName = document.getElementById("swal-input1").value;
                if (deviceName.length > 20)
                    return swal.showValidationMessage(`Device name is too long`)
                if (deviceName.length < 3)
                    return swal.showValidationMessage(`Device name is too short`)
                if (names.includes(deviceName))
                    return swal.showValidationMessage(`Device already exists`)
                return deviceName
            }
        })
        if (!device_name.isConfirmed) return
        devices[0] = `<div class="grid_item device" onclick='device()'><h2>${device_name.value}</h2></div>`
        document.getElementsByClassName("grid_container")[0].innerHTML = devices.join("")
      break;
    default:
        swal.fire({
            title: "View Device",
            html: `<div class="grid_container">${devices.join("")}</div>`,
            focusConfirm: false,
            showConfirmButton: false,
            showCloseButton: true,
        })

      break;
  }
}

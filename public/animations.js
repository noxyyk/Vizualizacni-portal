function animations(){
 var pfp = document.getElementsByClassName("dropbtn")[0].getElementsByTagName("img")[0]
if (pfp == undefined) pfp = document.getElementsByClassName("dropbtn")[0].getElementsByTagName("ion-icon")[0]
if (pfp != undefined){
    const dropdown = document.getElementsByClassName("dropdown-content")[0]
    let dropdownOpen = false;
    pfp.addEventListener("mouseover", async function () {
        dropdown.classList.add("visible");
        dropdownOpen = true;
        while (dropdownOpen) {
          await new Promise(resolve => setTimeout(resolve, 1000));
            if (!dropdownOpen) {
            dropdown.classList.add("fadeout");
            setTimeout(function () {
            dropdown.classList.remove("visible");
            dropdown.classList.remove("fadeout");
            return
            }, 500)
            }
        }
    })
    
      
      pfp.addEventListener("mouseout", async function () {
    dropdownOpen = false;
    });
      
      dropdown.addEventListener("mouseover", function () {
        dropdownOpen = true;
      });
      
      dropdown.addEventListener("mouseout", function () {
        dropdownOpen = false;
      });
    
    }
}

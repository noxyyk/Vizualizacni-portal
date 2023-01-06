var ishovered = false;
document.getElementsByClassName("dropbtn")[0].getElementsByTagName("img")[0].onmouseover = function() {
    ishovered = true
         fadein("dropdown-content", 5, 0)};
         document.getElementsByClassName("dropbtn")[0].getElementsByTagName("img")[0].onmouseout = function() {
            ishovered = false
            console.log(ishovered)
        //     delay(200).then(() => {
        //         console.log(ishovered)
        //     while (ishovered) {}
        //  fadeout("dropdown-content", 5, 0);})
        };
document.getElementsByClassName("dropdown-content")[0].onmouseover = function() {
    console.log("hovered")
ishovered = true
        };
        document.getElementsByClassName("dropdown-content")[0].onmouseout = function() {
            console.log("not hovered")
            ishovered = false
                    };
//fade in animation
function fadein(element, speed, array) {
var el = document.getElementsByClassName(element)[array];
var op = 0.1;  // initial opacity
el.style.display = 'block';
var timer = setInterval(function () {
if (op >= 1){
    clearInterval(timer);
}
el.style.opacity = op;
el.style.filter = 'alpha(opacity=' + op * 100 + ")";
op += op * 0.1;
}, speed);
}
//fade out animation
function fadeout(element, speed, array) {
var el = document.getElementsByClassName(element)[array];
var op = 1;  // initial opacity
var timer = setInterval(function () {
if (op <= 0.1){
    clearInterval(timer);
el.style.display = 'none';
}
el.style.opacity = op;
el.style.filter = 'alpha(opacity=' + op * 100 + ")";
op -= op * 0.1;
}, speed);
}


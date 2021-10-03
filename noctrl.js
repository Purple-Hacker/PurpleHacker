/*while (true) {
    /*if (e.ctrlKey) {
      console.log("ctr key was pressed");
      window.location.href = "https://google.com"; 
   }
}*/
var cntrlIsPressed = false;

$(document).keydown(function(event) {
    if (event.which == "17")
        cntrlIsPressed = true;
        console.log("ctr key was pressed");
        window.location.href = "https://google.com";
});

$(document).keyup(function() {
    cntrlIsPressed = false;
    console.log("ctr key was pressed");
        window.location.href = "https://google.com";
});



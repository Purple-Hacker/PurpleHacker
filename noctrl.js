/*while (true) {
    /*if (e.ctrlKey) {
      console.log("ctr key was pressed");
      window.location.href = "https://google.com"; 
   }
}*/
$(document).keydown(function(event) {
    if (event.which == "17")
        cntrlIsPressed = true;
        console.log("ctr key was pressed");
        window.location.href = "https://google.com"; 
    else if (event.which == 65 && cntrlIsPressed) {
        // Cntrl+  A
        selectAllRows();
        console.log("ctr + a key was pressed");
        window.location.href = "https://google.com"; 
    }
});

$(document).keyup(function() {
    cntrlIsPressed = false;
});

var cntrlIsPressed = false;

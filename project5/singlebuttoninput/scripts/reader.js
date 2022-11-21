console.log("Accessibility Rocks!");

var state = "none"; // horizontal_scanning, vertical_scanning

// keep track of how many times the user has pressed the space bar
var spaceCounter = 0;

// keep track of the x and y coordinates 
var xVal = 0;
var yVal = 0;

// keep track of whether or not to show the software keyboard
var showKeyboard = false;

// keep track of the where to put text inputted on the software keyboard
var lastTextElement = null;

// keep track of whether Caps Lock is on or off
var capsLock = false;

// when the document loads
$(document).ready(function () {


    // ELEMENT CREATION AND STYLE // 


    // create the button that toggles the keyboard
    $("body").append($("<div id='keyboard' class='buttons' ></div>"));
    $('#keyboard').css("top", ""+ $(window).height() - 110 + "px");
    $('#keyboard').css("left", "10px");

    // create the button that scrolls the page up
    $("body").append($("<div id='scrollUp' class='buttons' ></div>"));
    $('#scrollUp').css("top", ""+ $(window).height() - 230 + "px");
    $('#scrollUp').css("left", ""+ $(window).width() - 110 + "px");

    // create the button that scrolls the page down
    $("body").append($("<div id='scrollDown' class='buttons'></div>"));
    $('#scrollDown').css("top", ""+ $(window).height() - 110 + "px");
    $('#scrollDown').css("left", ""+ $(window).width() - 110 + "px");

    // stylize the buttons
    $('.buttons').css("position", "fixed");
    $('.buttons').css("z-index", "5");
    $('.buttons').css("width", "100px");
    $('.buttons').css("height", "100px");
    $('.buttons').css("outline-color", "black");
    $('.buttons').css("outline-width", "5px");
    $('.buttons').css("outline-style", "solid");

    // create the line that scans from top to bottom
    $("body").append($("<div id='hbar' class='bars'></div>"));
    $("#hbar").css("background-color", "red");
    $("#hbar").css("width", ""+ $(window).width() +"");
    $("#hbar").css("height", "10px");

    // create the line that scans from left to right
    $("body").append($("<div id='vbar' class='bars'></div>"));
    $("#vbar").css("background-color", "blue");
    $("#vbar").css("height", ""+ $(window).height() + 50 +"");
    $("#vbar").css("width", "10px");

    // stylise the bars
    $(".bars").css("left", "0px");
    $(".bars").css("top", "0px");
    $(".bars").css("z-index", "10");
    $(".bars").css("position", "fixed");
    $(".bars").css("display", "none");


    // EVENT HANDLERS AND LISTENERS // 


    // when a button is pressed
    $(document).keydown(function(e) {
        event.preventDefault();

        // if the button was a space
        if(e.key == " ") {

            // update state here, given current state
            if (spaceCounter == 0) {
                state = "horizontal_scanning";
            } else if(spaceCounter == 1) {

                // record the horizontal coordinate of the vertical bar
                xVal =  parseInt($("#vbar").css("left").slice(0, -2));
                state = "vertical_scanning"
            } else if(spaceCounter == 2) {
                state = "none"

                // record the vertical coordinate of the horizontal bar
                yVal = parseInt($("#hbar").css("top").slice(0, -2));

                // reset the bars
                $(".bars").css("left", "0px");
                $(".bars").css("top", "0px");
                $(".bars").css("display", "none");

                // press at the intersection of the two bars
                var elementtoclick = document.elementFromPoint(xVal, yVal);
                simulateClick(elementtoclick);
                spaceCounter = -1;
            }
            spaceCounter += 1;
        
            e.stopPropagation();
            return false;
        }
    });

    // when the mouse clicks
    document.addEventListener('click', function (e) {
        
        // get the element getting clicked
        var elementBeingClicked = document.elementFromPoint(e.clientX, e.clientY);

        // determine if the software keyboard was clicked, and if so, which key
        var newchar = "";
        processClick(elementBeingClicked, newchar);
        var newchar = "";
    });

    // when the scrollDown button is pressed
    document.getElementById("scrollDown").onclick = function() {
        $('html, body').animate({scrollTop: $(document).scrollTop()+($(window).height()*.1)}, 1000);
    };

    // when the scrollUp button is pressed
    document.getElementById("scrollUp").onclick = function() {
        $('html, body').animate({scrollTop: $(document).scrollTop()-($(window).height()*.1)}, 1000);
    };

    // when the toggle keyboard button is pressed
    document.getElementById("keyboard").onclick = function() {
        if (showKeyboard == false) {
            $('.keyboard').show();  
            showKeyboard = true;
            $('.keyboard').css("position", "fixed");
            $('.keyboard').css("z-index", "7");
            $('.keyboard').css("left", "" + ($(window).width() / 2) - 310 + "px");
            $('.keyboard').css("top", "" + ($(window).height() / 2) - 95 + "px");
        } else {
            $('.keyboard').hide();  
            showKeyboard = false;
        }
    };


    // MISC FUNCTIONS // 


    // call the paint function every 200 milliseconds
    setInterval(function() {
        paint();
    }, 200);

    function paint() {

        // move the horizontal bar down the page
        if(state == "vertical_scanning") {
            var currentTop = $("#hbar").css("top");
            $("#hbar").css("display", "block");
            $("#vbar").css("display", "none");

            // reset the horizontal bar to the top of the window when it reaches the bottom
            if (parseInt(currentTop.slice(0, -2)) > $(window).height()) {
                $("#hbar").css("top", "0px");
            } else {
                $("#hbar").css("top", ""+ (parseInt(currentTop.slice(0, -2)) + 15) +"px");
            }
        
        // move the vertical line to the right of the page
        } else if(state == "horizontal_scanning") {
            var currentLeft = $("#vbar").css("left");
            $("#vbar").css("display", "block");

            // reset the vertical bar to the left of the window when it reaches the right side
            if (parseInt(currentLeft.slice(0, -2)) > $(window).width()) {
                $("#vbar").css("left", "0px");
            } else{
                $("#vbar").css("left", "" + (parseInt(currentLeft.slice(0, -2)) + 15) + "px");
            }
        
        // hide both the bars
        } else if(state == "none") { 
            $("#hbar").css("display", "none");
        }
    }

    function simulateClick(element) {
        
        // if an actual element has been clicked on
        if (!element) return;

        // determine if the software keyboard was clicked, and if so, which key
        var newchar = "";
        processClick(element, newchar);
        var newchar = "";

        console.log(element);

        var dispatchEvent = function (elt, name) {
            var clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent(name, true, true);
            elt.dispatchEvent(clickEvent);
        };

        dispatchEvent(element, 'mouseover');
        dispatchEvent(element, 'mousedown');
        dispatchEvent(element, 'click');
        dispatchEvent(element, 'mouseup');
    };

    function processClick(element, newchar){

        // get the element being clicked on's class
        var className = element.className;

        // if the element is a key with a printable character on it
        if ((className == "key num dual") || (className == "key letter") || (className == "key dual") || (className == "key letter dual slash")) {
            
            // get the text of the key's value
            var data = element.textContent.slice(1, -1);
            var length = data.length;
            newchar = data;

            // if the key only has one character
            if (length == 1){

                // if caps lock is off, set the letter to lowercase
                if (capsLock == false) {
                    newchar = newchar.toLowerCase();
                }

            // if the key has more than one character
            } else if (length > 1) {

                // get the last character
                newchar = newchar.slice(-1);
            }
            
        // or is the caps lock key
        } else if (className == "key caps") {
            newchar = "";
            if (capsLock == false) {
                capsLock = true;
            } else {
                capsLock = false;
            }
        
        // or is the tab key
        } else if (className == "key tab") {
            newchar = "    ";

        // or is the space key
        } else if (className == "key space") {
            newchar = " ";
        
        // or is the backspace key
        } else if (className == "key backspace") {
            newchar = "backspace";
        } 

        // if an element that accepts text as input has been clicked on previously
        if (lastTextElement != null){

            // if the backspace key was clicked on, delete the last character from the text input
            if (newchar == "backspace") {
                $(lastTextElement).val($(lastTextElement).val().slice(0, -1));

            // add the new character
            } else if (newchar != "") {
                $(lastTextElement).val($(lastTextElement).val() + newchar);
            } 
        }

        // if the element being clicked on is an element that accepts text input, store it
        if ($(element).is("input[type='text'],textarea")){
            lastTextElement = element;
        };
    }

    // I don't know why, but this code runs after all the other code no matter where it gets placed, 
    // so I put it at the end to remind myself
    $.get("https://sarahmorrisonsmith.com/accessibility/keyboard.html", function (data) {
        $("body").append(data);

        //Hidding the keyboard initially
        $('.keyboard').hide();
        showKeyboard = false;
    });

});

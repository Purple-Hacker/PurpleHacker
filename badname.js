/*
  badname
  Copyright © 2021 Varun B.
*/

function main() {
  if (!window.a) return // prevent multiple instances

  if (window.badname) return // prevent multiple instances
  window.badname = true

  // Function to find React component from DOM (https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging)
  function FindReact(dom, traverseUp = 0) {
    const key = Object.keys(dom).find(key => {
      return key.startsWith("__reactFiber$") // react 17+
        || key.startsWith("__reactInternalInstance$"); // react <17
    });
    const domFiber = dom[key];
    if (domFiber == null) return null;

    // react <16
    if (domFiber._currentElement) {
      let compFiber = domFiber._currentElement._owner;
      for (let i = 0; i < traverseUp; i++) {
        compFiber = compFiber._currentElement._owner;
      }
      return compFiber._instance;
    }

    // react 16+
    const GetCompFiber = fiber => {
      //return fiber._debugOwner; // this also works, but is __DEV__ only
      let parentFiber = fiber.return;
      while (typeof parentFiber.type == "string") {
        parentFiber = parentFiber.return;
      }
      return parentFiber;
    };
    let compFiber = GetCompFiber(domFiber);
    for (let i = 0; i < traverseUp; i++) {
      compFiber = GetCompFiber(compFiber);
    }
    return compFiber.stateNode;
  }

  HTMLElement.prototype.makeDraggable = HTMLElement.prototype.makeDraggable || function () {
    var myWindow = this;
    myWindow.mouseDown = false;
    myWindow.offsets = { x: 0, y: 0 };

    myWindow.addEventListener('mousedown', function (e) {
      if (e.target.classList.contains('window-top')) {
        myWindow.mouseDown = true;
        myWindow.offsets.x = e.target.parentNode.offsetLeft - e.pageX;
        myWindow.offsets.y = e.target.parentNode.offsetTop - e.pageY;
      }
    });

    myWindow.addEventListener('mouseup', function (e) {
      myWindow.mouseDown = false;
      if (e.target.classList.contains("round") && e.target.classList.contains("red")) {
        e.target.parentNode.parentNode.style.display = "none";
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (e.target.classList.contains("window-top")) {
        myWindow.mouseDown = false;
      }
    });

    document.addEventListener('mousemove', function (e) {
      if (e.target.classList.contains("window-top") && myWindow.mouseDown) {
        e.preventDefault();
        e.target.parentNode.style.left = (e.pageX + myWindow.offsets.x) + 'px';
        e.target.parentNode.style.top = (e.pageY + myWindow.offsets.y) + 'px';
      }
    }, false);
  };

  // Create draggable window-like div
  var isDown = false;

  let div = {}
  let content = {};
  let header = {}
  function createWindow() {
    div = document.createElement("div")
    div.id = "badname-window"
    div.style.position = "fixed"
    //div.style.width = "250px"
    div.style.resize = "both"
    div.style.overflowY = "auto"
    div.style.overflowX = "hidden"
    div.style.top = "20px"
    div.style.zIndex = 9999
    div.style.backgroundColor = '#f1f1f1'
    div.style.boxShadow = 'rgb(0 0 0 / 25%) 0px 0px 10px 5px'
    div.style.display = "block"
    div.style.width = "290px"
    div.style.borderRadius = "5px"

    header = document.createElement("div")
    header.id = "badname-header"
    header.className = "window-top"
    header.style.padding = "10px"
    header.style.background = 'linear-gradient(to right, #824dff, #4db5ff)'
    header.style.color = 'white'
    header.style.cursor = 'move'
    header.innerText = "badname"

    content = document.createElement("div")
    content.style.padding = "8px"
    content.style.display = "block"
    content.id = "badname-content"

    div.appendChild(header)
    div.appendChild(content)
    document.body.appendChild(div)

    // make it draggable
div.addEventListener('mousedown', function(e) {
    isDown = true;
    offset = [
        div.offsetLeft - e.clientX,
        div.offsetTop - e.clientY
    ];
}, true);

document.addEventListener('mouseup', function() {
    isDown = false;
}, true);

document.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (isDown) {
        mousePosition = {

            x : event.clientX,
            y : event.clientY

        };
        div.style.left = (mousePosition.x + offset[0]) + 'px';
        div.style.top  = (mousePosition.y + offset[1]) + 'px';
    }
}, true);

    // close button
    let close = document.createElement("span")
    close.style.cursor = "pointer"
    close.style.float = 'right'
    close.innerText = "X"

    close.addEventListener('click', function (e) {
      if (content.style.display == "block") {
        content.style.display = 'none'
        div.style.height = 'auto'
      } else {
        content.style.display = 'block'
      }
    })
    header.appendChild(close)
  }

  // setup styles
  let style = document.createElement("style")
  style.innerText = `
  .data-container {
    width: 95%;
  }
  .data-container input[type="text"], input[type="number"] {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    font-size: 14px;
    font-family: monospace;
    color: #333;
    background: #f1f1f1;
  }
  .badname-reload {
    width: 95%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    outline: none;
    font-size: 14px;
    font-family: monospace;
    color: #333;
    background: #f1f1f1;
    cursor: pointer;
  }
  .badname-reload:hover {
    background: #f2709c;
    color: white
  }
  `
  document.head.appendChild(style)

  // set window content to state
  let react = {}
  function setWindowContent() {
    let state = react.state
    while (content.hasChildNodes()) {
      content.removeChild(content.lastChild);
    }
    for (const [key, value] of Object.entries(state)) {
      let type = typeof value
      switch (type) {
        case 'string':
          var container = document.createElement("div")
          container.className = 'data-container'

          var label = document.createElement("label")
          label.innerText = key + ': '
          label.htmlFor = 'state-' + key
          var input = document.createElement("input")
          input.type = "text"
          input.value = value
          input.id = 'state-' + key
          container.appendChild(label)
          container.appendChild(input)
          content.appendChild(container)

          let e = input.addEventListener('change', function (e) {
            react.setState({ [e.target.id.replace('state-', '')]: e.target.value })
          })
          break;
        case 'number':
          var container = document.createElement("div")
          container.className = 'data-container'

          var label = document.createElement("label")
          label.innerText = key + ': '
          label.htmlFor = 'state-' + key
          var input = document.createElement("input")
          input.type = "number"
          input.value = value
          input.id = 'state-' + key
          container.appendChild(label)
          container.appendChild(input)
          content.appendChild(container)
          input.addEventListener('change', function (e) {
            react.setState({ [e.target.id.replace('state-', '')]: e.target.value })
          })
          break;
        case 'boolean':
          var container = document.createElement("div")
          container.className = 'data-container'

          var label = document.createElement("label")
          label.innerText = key + ': '
          label.htmlFor = 'state-' + key
          var input = document.createElement("input")
          input.type = "checkbox"
          input.checked = value
          input.id = 'state-' + key
          container.appendChild(label)
          container.appendChild(input)
          content.appendChild(container)
          input.addEventListener('change', function (e) {
            react.setState({ [e.target.id.replace('state-', '')]: e.target.checked })
          })
          break;
        case 'object':
          var container = document.createElement("div")
          container.className = 'data-container'

          var label = document.createElement("label")
          label.innerText = key + ': '
          label.htmlFor = 'state-' + key
          var input = document.createElement("input")
          input.type = "text"
          input.value = JSON.stringify(value)
          input.id = 'state-' + key
          container.appendChild(label)
          container.appendChild(input)
          content.appendChild(container)
          input.addEventListener('change', function (e) {
            react.setState({ [e.target.id.replace('state-', '')]: JSON.parse(e.target.value) })
          })
          break;
        default:
          console.log('unknown type: ' + type)
      }
    }

    // add reload react button
    let reload = document.createElement("button")
    reload.className = "badname-reload"
    reload.innerText = "reload"
    reload.addEventListener('click', function () {
      getReact()
      setWindowContent()
    })
    content.appendChild(reload)

    let a = setInterval(() => {
      // rerun setWindowContent if no input is selected
      if (document.activeElement.tagName !== "INPUT") {
        clearInterval(a)
        setWindowContent()
      }
    }, 750)
  }
  function getReact() {
    console.log('getting react')
    react = FindReact(document.querySelector("#app").children[0].children[0])
    
    window.react = react
  }
  getReact()
  createWindow()
  setWindowContent()

  // keyboard shortcuts (crtl+shift+y)
  window.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() == 'y') {
      // toggle visibility of the window
      e.preventDefault()
      if (div.style.display == "block") {
        div.style.display = 'none'
      } else {
        div.style.display = 'block'
      }
    }
  })
}

main()

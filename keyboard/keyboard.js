const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
  },

  init() {
    // Create Main Elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this.createColorPicker())
    this.elements.keysContainer.appendChild(this._createKeys());

    // Add node list to keys 
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    
    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input class
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        })
      })
    });
  },
  
  createColorPicker(){
    const colorContainer = document.createElement("div");

    const backgroundColor = document.createElement("div");
    const inputBackground = document.createElement("input");
    const labelBackground = document.createElement("label");
    labelBackground.innerHTML = "BG Color: "
    inputBackground.id = "background-color-picker"
    inputBackground.className = "color-picker"
    inputBackground.setAttribute("type","color");
    inputBackground.setAttribute("oninput", "handleKeyboardBG()")
    inputBackground.setAttribute("value", "#E84545")
    backgroundColor.appendChild(labelBackground)
    backgroundColor.appendChild(inputBackground)

    colorContainer.appendChild(backgroundColor)

    const keyColor = document.createElement("div");
    const inputKey = document.createElement("input");
    const labelKey = document.createElement("label");
    labelKey.innerHTML = "Key Color: "
    inputKey.id = "key-color-picker"
    inputKey.className = "color-picker"
    inputKey.setAttribute("type","color");
    inputKey.setAttribute("oninput", "handleKeyboardKey()")
    inputKey.setAttribute("value", "#2B2E4A")
    keyColor.appendChild(labelKey)
    keyColor.appendChild(inputKey)

    colorContainer.appendChild(keyColor)

    colorContainer.style.display = "flex"
    colorContainer.style.justifyContent = "space-evenly"
    colorContainer.style.marginBottom = "4px"
    
    return colorContainer;
  },

  _createKeys() {

    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]","\\",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
      "shift" ,"z", "x", "c", "v", "b", "n", "m", ",", ".", "/","done"
      , "space"
    ];

    const symbolLayout = [
      "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "",
      "", "", "", "", "", "", "", "", "", "", "", "{", "}","|",
      "", "", "", "", "", "", "", "", "", "", ":", '"', "",
      "" ,"", "", "", "", "", "", "", "<", ">", "?",""
      , ""
    ];

    // Create HTML for icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`
    }
    
    keyLayout.forEach(key => {
      // console.log(keyLayout.indexOf(key))
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "|", "enter", "done"].indexOf(key) !== -1;
      

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {

        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvents("oninput");
          });

          break;

        case "tab":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("swap_horiz");
  
          keyElement.addEventListener("click", () => {
            this.properties.value += "\t";
            this._triggerEvents("oninput");
          });
  
            break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable", "caps");
          keyElement.innerText = "CAPS";
          const blank = document.createElement("div");
          keyElement.appendChild(blank);

          keyElement.addEventListener("click", () => {
            this.toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvents("oninput");
          });

          break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide", "shift");
          keyElement.innerHTML = createIconHTML("expand_less");
  
          keyElement.addEventListener("click", () => {
            this.properties.shift = !this.properties.shift;
            this.Shift();
          });
  
          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");
  
          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvents("oninput");
          });
  
          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark", "keyboard__key", "done");
          keyElement.innerHTML = createIconHTML("check_circle");
  
          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvents("onclose")
          });
  
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          
          keyElement.setAttribute("onclick", "new Audio('./mouseClick.mp3').play()");

          keyElement.addEventListener("click", () => {
            // this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            if(this.properties.shift){
              if(!(symbolLayout[keyLayout.indexOf(key)]==="")){
                this.properties.value += symbolLayout[keyLayout.indexOf(key)];
              }
              else{
                this.properties.value += key.toUpperCase();
              }
              this.properties.shift = false;
              this.Shift()
            }
            else if(this.properties.capsLock){
              this.properties.value += key.toUpperCase();
            }
            else{
              this.properties.value += key;
            }

            this._triggerEvents("oninput");
            // if(this.properties.shift){
            //   this.properties.shift = false;
            // }
          });
        }

        fragment.appendChild(keyElement);

        if(insertLineBreak) {
          fragment.appendChild(document.createElement("br"));
        }

      });

      return fragment;
      
  },

  _triggerEvents(handlerName) {
    if(typeof this.eventHandlers[handlerName] == "function" ){
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  Shift(){
    const symbolLayout = [
      "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "",
      "", "", "", "", "", "", "", "", "", "", "", "{", "}","|",
      "", "", "", "", "", "", "", "", "", "", ":", '"', "",
      "" ,"", "", "", "", "", "", "", "<", ">", "?",""
      , ""
    ];

    const keyLayout = [
      "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]","\\",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
      "shift" ,"z", "x", "c", "v", "b", "n", "m", ",", ".", "/","done"
      , "space"
    ];

    const icons = [
      "swap_horiz", "backspace", "keyboard_return", "expand_less", "check_circle", "space_bar", "CAPS"
    ]
  
    const keyArray = Array.from(this.elements.keys);
    // console.log(keyArray[0].textContent)
    // console.log(this.elements.keys[0].textContent)

    for(key of keyArray){
      // console.log(key.textContent)
      // console.log(icons.some( icon => icon == key.textContent ))

      if (!(symbolLayout[keyArray.indexOf(key)] === "")) {
        key.textContent = this.properties.shift ? symbolLayout[keyArray.indexOf(key)] : keyLayout[keyArray.indexOf(key)];
        // console.log(this.elements.keys[keyArray.indexOf(key)].textContent)
        }

      else if( !icons.includes(key.textContent) ) {
        key.textContent = this.properties.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }

    }
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (key of this.elements.keys){
      if (key.childElementCount === 0){
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden")
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden")
  },
};

function handleKeyboardBG() {
  const keyboard = Keyboard.elements.main;
  const color = document.getElementById("background-color-picker").value;
  keyboard.style.backgroundColor = color;
}

function handleKeyboardKey() {
  const keys = document.getElementsByClassName("keyboard__key");
  const keysArray = Array.from(keys)
  const color = document.getElementById("key-color-picker").value;

  keysArray.forEach(key => {
    key.style.color = color;
  });
}

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
  // Keyboard.open("initial value test", function(currentValue) {
  //   console.log("Value Change! current value: " + currentValue);
  // }, function(currentValue) {
  //   console.log("keyboard closed! Finishing Value: " + currentValue);
  // });
});
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
  },

  init() {
    // Create Main Elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

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

  _createKeys() {

    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
      "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]","|",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
      "shift" ,"z", "x", "c", "v", "b", "n", "m", ",", ".", "?","done"
      , "space"
    ];

    // Create HTML for icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`
    }

    keyLayout.forEach(key => {
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
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("expand_less");
  
          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvents("oninput");
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
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");
  
          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvents("onclose")
          });
  
          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this._triggerEvents("oninput");
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

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
  // Keyboard.open("initial value test", function(currentValue) {
  //   console.log("Value Change! current value: " + currentValue);
  // }, function(currentValue) {
  //   console.log("keyboard closed! Finishing Value: " + currentValue);
  // });
});
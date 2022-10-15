const nameElement = document.getElementsByClassName("name")[0];
const emailElement = document.getElementsByClassName("email")[0];

const myKeysValues = window.location.search;
const urlParams = new URLSearchParams(myKeysValues);

const firstName = urlParams.get("firstname");
const lastName = urlParams.get("lastname");
const email = urlParams.get("email");

// nameElement.insertAdjacentText("","Hello")
nameElement.insertAdjacentText("beforebegin",`Hello, ${firstName} ${lastName}`)
emailElement.insertAdjacentText("beforebegin",`Email: ${email}`)
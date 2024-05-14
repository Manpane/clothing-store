const API_BASE_URL = "http://localhost:10000/api";

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function showError(message) {
  showMessage(message, 'error');
}

function showSuccess(message) {
  showMessage(message, 'success');
}

function showMessage(message, messageType) {

  const messageElement = document.createElement('div');
  messageElement.style.position = 'absolute';
  messageElement.style.zIndex = '100000';
  messageElement.style.top = '20px';
  messageElement.style.left = '50%';
  messageElement.style.width = 'fit-content';
  messageElement.style.transform = 'translateX(-50%)';
  messageElement.style.fontSize = '20px';

  messageElement.classList.add('message', messageType);
  messageElement.textContent = message;
  document.body.appendChild(messageElement);

  setTimeout(() => {
    document.body.removeChild(messageElement);
  }, 60000);
}


function logout() {
  setCookie("token", "", 0);
  window.location.href = "/login.html";
}
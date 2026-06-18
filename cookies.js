function setCookie(name, value, days) {
  let date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  let expires = "expires=" + date.toUTCString();

  document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function getCookie(name) {
  let cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();

    if (c.indexOf(name + "=") === 0) {
      return c.substring(name.length + 1);
    }
  }
  return "";
}

function checkCookie() {
  let user = getCookie("username");

  if (user) {
    console.log("Καλώς ήρθες " + user);
    alert("Καλώς ήρθες " + user);
  } else {
    user = prompt("Παρακαλώ συμπληρώστε το όνομά σας:", "");

    if (user && user.trim() !== "") {
      setCookie("username", user.trim(), 365);
      alert("Saved!");
    }
  }
}

checkCookie();
document.addEventListener("DOMContentLoaded", function () {
  console.log("Пассажирам.РФ — сайт загружен");

  window.showNotification = function (message, type = "info") {
    const alertBox = document.createElement("div");
    alertBox.className = `alert alert-${type} alert-dismissible fade show`;
    alertBox.role = "alert";
    alertBox.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    document.body.prepend(alertBox);
    setTimeout(() => alertBox.remove(), 4000);
  };

  window.validateLogin = function (login) {
    const re = /^[A-Za-z0-9]{6,}$/;
    return re.test(login);
  };

  window.validatePassword = function (password) {
    return password.length >= 8;
  };

  window.validateEmail = function (email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  console.log("Все функции загружены!");
});



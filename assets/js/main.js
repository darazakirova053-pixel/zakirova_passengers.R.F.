// ========================================
// assets/js/main.js
// Пассажирам.РФ — все скрипты
// ========================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("Пассажирам.РФ — сайт загружен");

  // ---------- ОБЩИЕ ФУНКЦИИ ----------

  // Уведомления
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

  // Валидация логина (латиница + цифры, мин 6)
  window.validateLogin = function (login) {
    const re = /^[A-Za-z0-9]{6,}$/;
    return re.test(login);
  };

  // Валидация пароля (мин 8 символов)
  window.validatePassword = function (password) {
    return password.length >= 8;
  };

  // Валидация email
  window.validateEmail = function (email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // ---------- СТРАНИЦА ВХОДА (login.html) ----------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const login = document.getElementById("login").value.trim();
      const password = document.getElementById("password").value.trim();
      let valid = true;

      if (login !== "Admin26" && login !== "user") {
        const errorEl = document.getElementById("loginError");
        if (errorEl) errorEl.style.display = "block";
        valid = false;
      } else {
        const errorEl = document.getElementById("loginError");
        if (errorEl) errorEl.style.display = "none";
      }

      if (password !== "Demo20" && password !== "pass1234") {
        const errorEl = document.getElementById("passwordError");
        if (errorEl) errorEl.style.display = "block";
        valid = false;
      } else {
        const errorEl = document.getElementById("passwordError");
        if (errorEl) errorEl.style.display = "none";
      }

      if (valid) {
        window.showNotification("Успешный вход!", "success");
        setTimeout(() => {
          window.location.href = "profile.html";
        }, 500);
      }
    });
  }

  // ---------- СТРАНИЦА РЕГИСТРАЦИИ (register.html) ----------
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const login = document.getElementById("regLogin").value.trim();
      const password = document.getElementById("regPassword").value.trim();
      const email = document.getElementById("email").value.trim();
      let valid = true;

      if (!window.validateLogin(login)) {
        const errorEl = document.getElementById("regLoginError");
        if (errorEl) errorEl.style.display = "block";
        valid = false;
      } else {
        const errorEl = document.getElementById("regLoginError");
        if (errorEl) errorEl.style.display = "none";
      }

      if (!window.validatePassword(password)) {
        const errorEl = document.getElementById("regPasswordError");
        if (errorEl) errorEl.style.display = "block";
        valid = false;
      } else {
        const errorEl = document.getElementById("regPasswordError");
        if (errorEl) errorEl.style.display = "none";
      }

      if (!window.validateEmail(email)) {
        const errorEl = document.getElementById("regEmailError");
        if (errorEl) errorEl.style.display = "block";
        valid = false;
      } else {
        const errorEl = document.getElementById("regEmailError");
        if (errorEl) errorEl.style.display = "none";
      }

      if (valid) {
        window.showNotification(
          "Регистрация успешна! Теперь войдите.",
          "success",
        );
        setTimeout(() => {
          window.location.href = "login.html";
        }, 500);
      }
    });
  }

  // ---------- СТРАНИЦА ЗАЯВКИ (application.html) ----------
  const appForm = document.getElementById("applicationForm");
  if (appForm) {
    appForm.addEventListener("submit", function (e) {
      e.preventDefault();
      window.showNotification("Заявка отправлена на согласование!", "success");
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 500);
    });
  }

  // ---------- СТРАНИЦА АДМИНА (admin.html) ----------
  // Изменение статуса
  window.changeStatus = function (btn, newStatus) {
    const row = btn.closest("tr");
    const statusCell = row.querySelector("td:nth-child(4)");
    const badge = statusCell.querySelector(".badge");
    badge.textContent = newStatus;

    if (newStatus === "Новая") {
      badge.className = "badge bg-warning";
    } else if (newStatus === "Идет обучение") {
      badge.className = "badge bg-primary";
    } else {
      badge.className = "badge bg-success";
    }

    window.showNotification('Статус изменён на "' + newStatus + '"', "success");
  };

  // Фильтры
  window.applyFilters = function () {
    const transport = document
      .getElementById("filterTransport")
      .value.toLowerCase();
    const status = document.getElementById("filterStatus").value;
    const rows = document.querySelectorAll("#adminTable tbody tr");

    rows.forEach((row) => {
      const rowTransport = row
        .querySelector("td:nth-child(2)")
        .textContent.toLowerCase();
      const rowStatus = row.querySelector("td:nth-child(4) .badge").textContent;
      let show = true;

      if (transport && !rowTransport.includes(transport)) show = false;
      if (status && rowStatus !== status) show = false;

      row.style.display = show ? "" : "none";
    });

    window.showNotification("Фильтр применён", "info");
  };

  // Сортировка
  window.sortTable = function (col) {
    const table = document.getElementById("adminTable");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const sorted = rows.sort((a, b) => {
      const valA = a.querySelectorAll("td")[col].textContent.trim();
      const valB = b.querySelectorAll("td")[col].textContent.trim();
      return valA.localeCompare(valB);
    });

    tbody.append(...sorted);
    window.showNotification("Таблица отсортирована", "info");
  };

  // ---------- ПРОФИЛЬ (profile.html) - Отзывы ----------
  // Обработчик для кнопок "Оставить отзыв"
  document.querySelectorAll(".review-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      const statusCell = row.querySelector("td:nth-child(4) .badge");
      const status = statusCell.textContent;

      if (status === "Обучение завершено") {
        const review = prompt("Оставьте ваш отзыв о курсе:");
        if (review) {
          // Находим ячейку отзыва и вставляем текст
          const reviewCell = row.querySelector("td:nth-child(5)");
          reviewCell.innerHTML = `<span class="text-success">${review}</span>`;
          window.showNotification("Спасибо за ваш отзыв!", "success");
        }
      } else {
        window.showNotification(
          "Отзыв можно оставить только после завершения обучения!",
          "warning",
        );
      }
    });
  });

  console.log("Все скрипты загружены!");
});

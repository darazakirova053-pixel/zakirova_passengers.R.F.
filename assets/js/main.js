document.addEventListener("DOMContentLoaded", function () {
  console.log("Пассажирам.РФ — сайт загружен");

  // ===== УВЕДОМЛЕНИЯ =====
  window.showNotification = function (message, type = "info") {
    const alertBox = document.createElement("div");
    alertBox.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertBox.style.zIndex = "9999";
    alertBox.style.maxWidth = "500px";
    alertBox.style.width = "90%";
    alertBox.role = "alert";
    alertBox.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.prepend(alertBox);
    setTimeout(() => {
      alertBox.classList.remove("show");
      setTimeout(() => alertBox.remove(), 300);
    }, 4000);
  };

  // ===== ВАЛИДАЦИЯ =====
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

  // ===== МОДАЛЬНОЕ ОКНО ДЛЯ ОТЗЫВОВ =====
  const modalHTML = `
    <div class="modal fade" id="reviewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Оставить отзыв</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="reviewForm">
              <div class="mb-3">
                <label for="reviewText" class="form-label">Ваш отзыв о курсе</label>
                <textarea class="form-control" id="reviewText" rows="4" placeholder="Напишите ваш отзыв..." required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Оценка</label>
                <div class="d-flex gap-2 flex-wrap" id="ratingStars">
                  <label class="rating-option" data-value="5">
                    <img src="../../assets/img/star.svg" alt="5 звезд" class="star-img" />
                    <img src="../../assets/img/star.svg" alt="5 звезд" class="star-img" />
                    <img src="../../assets/img/star.svg" alt="5 звезд" class="star-img" />
                    <img src="../../assets/img/star.svg" alt="5 звезд" class="star-img" />
                    <img src="../../assets/img/star.svg" alt="5 звезд" class="star-img" />
                    <span class="ms-1">Отлично</span>
                    <input type="radio" name="rating" value="5" checked class="d-none" />
                  </label>
                  <label class="rating-option" data-value="4">
                    <img src="../../assets/img/star.svg" alt="4 звезды" class="star-img" />
                    <img src="../../assets/img/star.svg" alt="4 звезды" class="star-img" />
                    <img src="../../assets/img/star.svg" alt="4 звезды" class="star-img" />
                    <img src="../../assets/img/star.svg" alt="4 звезды" class="star-img" />
                    <span class="ms-1">Хорошо</span>
                    <input type="radio" name="rating" value="4" class="d-none" />
                  </label>
                  <label class="rating-option" data-value="3">
                    <img src="../../assets/img/star.svg" alt="3 звезды" class="star-img" />
                    <img src="../../assets/img/star.svg" alt="3 звезды" class="star-img" />
                    <img src="../../assets/img/star.svg" alt="3 звезды" class="star-img" />
                    <span class="ms-1">Средне</span>
                    <input type="radio" name="rating" value="3" class="d-none" />
                  </label>
                  <label class="rating-option" data-value="2">
                    <img src="../../assets/img/star.svg" alt="2 звезды" class="star-img" />
                    <img src="../../assets/img/star.svg" alt="2 звезды" class="star-img" />
                    <span class="ms-1">Плохо</span>
                    <input type="radio" name="rating" value="2" class="d-none" />
                  </label>
                  <label class="rating-option" data-value="1">
                    <img src="../../assets/img/star.svg" alt="1 звезда" class="star-img" />
                    <span class="ms-1">Ужасно</span>
                    <input type="radio" name="rating" value="1" class="d-none" />
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button type="button" class="btn btn-primary" id="submitReviewBtn">Отправить отзыв</button>
          </div>
        </div>
      </div>
    </div>
  `;

  if (!document.getElementById("reviewModal")) {
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  let currentReviewRow = null;

  document.querySelectorAll(".rating-option").forEach((option) => {
    option.addEventListener("click", function () {
      document.querySelectorAll(".rating-option").forEach((el) => {
        el.style.opacity = "0.5";
      });
      this.style.opacity = "1";
      const radio = this.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  const defaultOption = document.querySelector(
    '.rating-option[data-value="5"]',
  );
  if (defaultOption) {
    defaultOption.style.opacity = "1";
  }

  document.querySelectorAll(".review-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      const statusCell = row.querySelector("td:nth-child(4) .badge");
      const status = statusCell.textContent;

      if (status === "Обучение завершено") {
        currentReviewRow = row;
        document.getElementById("reviewText").value = "";
        document.querySelectorAll(".rating-option").forEach((el) => {
          el.style.opacity = "0.5";
        });
        const defaultOpt = document.querySelector(
          '.rating-option[data-value="5"]',
        );
        if (defaultOpt) {
          defaultOpt.style.opacity = "1";
          const radio = defaultOpt.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        }
        const modal = new bootstrap.Modal(
          document.getElementById("reviewModal"),
        );
        modal.show();
      } else {
        window.showNotification(
          "Отзыв можно оставить только после завершения обучения!",
          "warning",
        );
      }
    });
  });

  document
    .getElementById("submitReviewBtn")
    .addEventListener("click", function () {
      const reviewText = document.getElementById("reviewText").value.trim();
      const selectedRating = document.querySelector(
        '#ratingStars input[type="radio"]:checked',
      );
      const rating = selectedRating ? selectedRating.value : "5";

      if (!reviewText) {
        window.showNotification("Пожалуйста, напишите ваш отзыв!", "warning");
        return;
      }

      if (currentReviewRow) {
        const reviewCell = currentReviewRow.querySelector("td:nth-child(5)");
        let starsHtml = "";
        for (let i = 0; i < parseInt(rating); i++) {
          starsHtml += `<img src="../../assets/img/star.svg" alt="star" class="star-icon" />`;
        }
        for (let i = parseInt(rating); i < 5; i++) {
          starsHtml += `<img src="../../assets/img/star-empty.svg" alt="empty star" class="star-icon" style="opacity:0.3;" />`;
        }

        reviewCell.innerHTML = `
        <div class="d-flex flex-column align-items-start">
          <div class="d-flex gap-1">${starsHtml}</div>
          <span class="text-success mt-1">"${reviewText}"</span>
        </div>
      `;
        window.showNotification("Спасибо за ваш отзыв!", "success");

        const modal = bootstrap.Modal.getInstance(
          document.getElementById("reviewModal"),
        );
        modal.hide();
        currentReviewRow = null;
      }
    });

  // ===== СТРАНИЦА ВХОДА (ИСПРАВЛЕНО) =====
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const login = document.getElementById("login").value.trim();
      const password = document.getElementById("password").value.trim();

      // Очищаем предыдущие ошибки
      const loginError = document.getElementById("loginError");
      const passwordError = document.getElementById("passwordError");
      if (loginError) loginError.style.display = "none";
      if (passwordError) passwordError.style.display = "none";

      // 1. Проверяем админа
      if (login === "Admin26" && password === "Demo20") {
        window.showNotification("Добро пожаловать, Администратор!", "success");
        setTimeout(function () {
          window.location.href = "admin.html";
        }, 500);
        return;
      }

      // 2. Проверяем пользователя (только логин user, пароль любой)
      if (login === "user") {
        window.showNotification("Добро пожаловать!", "success");
        setTimeout(function () {
          window.location.href = "profile.html";
        }, 500);
        return;
      }

      // 3. Если ничего не подошло — ошибка
      if (loginError) loginError.style.display = "block";
      window.showNotification("Неверный логин или пароль!", "danger");
    });
  }

  // ===== СТРАНИЦА РЕГИСТРАЦИИ =====
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
        setTimeout(function () {
          window.location.href = "login.html";
        }, 500);
      }
    });
  }

  // ===== СТРАНИЦА ЗАЯВКИ =====
  const appForm = document.getElementById("applicationForm");
  if (appForm) {
    appForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const transport = document.getElementById("transport").value;
      const date = document.getElementById("startDate").value;
      const payment = document.getElementById("payment").value;

      if (!transport || !date || !payment) {
        window.showNotification("Пожалуйста, заполните все поля!", "warning");
        return;
      }

      window.showNotification("Заявка отправлена на согласование!", "success");
      setTimeout(function () {
        window.location.href = "profile.html";
      }, 500);
    });
  }

  // ===== ПАГИНАЦИЯ ДЛЯ АДМИНКИ =====

  const allApplications = [
    {
      id: 1,
      transport: "Автобус",
      date: "01.06.2026",
      status: "Обучение завершено",
    },
    { id: 2, transport: "Электробус", date: "05.06.2026", status: "Новая" },
    {
      id: 3,
      transport: "Трамвай",
      date: "10.06.2026",
      status: "Идет обучение",
    },
    { id: 4, transport: "Автобус", date: "15.06.2026", status: "Новая" },
    {
      id: 5,
      transport: "Электробус",
      date: "20.06.2026",
      status: "Обучение завершено",
    },
    { id: 6, transport: "Трамвай", date: "25.06.2026", status: "Новая" },
    {
      id: 7,
      transport: "Автобус",
      date: "30.06.2026",
      status: "Идет обучение",
    },
    { id: 8, transport: "Электробус", date: "05.07.2026", status: "Новая" },
    {
      id: 9,
      transport: "Трамвай",
      date: "10.07.2026",
      status: "Обучение завершено",
    },
  ];

  let currentPage = 1;
  const itemsPerPage = 3;
  let filteredApplications = [...allApplications];

  function getStatusBadge(status) {
    const colors = {
      Новая: "bg-warning",
      "Идет обучение": "bg-primary",
      "Обучение завершено": "bg-success",
    };
    return `<span class="badge ${colors[status] || "bg-secondary"}">${status}</span>`;
  }

  function renderTable(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredApplications.slice(start, end);
    const tbody = document.getElementById("tableBody");

    if (!tbody) return;

    if (pageItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center">Нет заявок</td></tr>`;
      return;
    }

    tbody.innerHTML = pageItems
      .map(function (app) {
        return `
      <tr>
        <td>${app.id}</td>
        <td>${app.transport}</td>
        <td>${app.date}</td>
        <td>${getStatusBadge(app.status)}</td>
        <td>
          <button class="btn btn-sm btn-success" onclick="changeStatusById(${app.id}, 'Идет обучение')">Начать</button>
          <button class="btn btn-sm btn-secondary" onclick="changeStatusById(${app.id}, 'Обучение завершено')">Завершить</button>
        </td>
      </tr>
    `;
      })
      .join("");
  }

  function updatePagination() {
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    if (prevPage) prevPage.classList.toggle("disabled", currentPage <= 1);
    if (nextPage)
      nextPage.classList.toggle("disabled", currentPage >= totalPages);

    for (let i = 1; i <= 3; i++) {
      const pageBtn = document.getElementById("page" + i);
      if (pageBtn) {
        pageBtn.classList.toggle("active", i === currentPage);
        pageBtn.style.display = i <= totalPages ? "" : "none";
      }
    }
  }

  window.changePage = function (page) {
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable(currentPage);
    updatePagination();
  };

  window.changeStatusById = function (id, newStatus) {
    var app = null;
    for (var i = 0; i < filteredApplications.length; i++) {
      if (filteredApplications[i].id === id) {
        app = filteredApplications[i];
        break;
      }
    }
    if (app) {
      app.status = newStatus;
      renderTable(currentPage);
      window.showNotification(
        'Статус изменён на "' + newStatus + '"',
        "success",
      );
    }
  };

  window.changeStatus = function (btn, newStatus) {
    var row = btn.closest("tr");
    var id = parseInt(row.querySelector("td:first-child").textContent);
    window.changeStatusById(id, newStatus);
  };

  window.applyFilters = function () {
    var transport = document
      .getElementById("filterTransport")
      .value.toLowerCase();
    var status = document.getElementById("filterStatus").value;
    var search = document.getElementById("searchInput").value.toLowerCase();

    var result = [];
    for (var i = 0; i < allApplications.length; i++) {
      var app = allApplications[i];
      var match = true;
      if (transport && !app.transport.toLowerCase().includes(transport))
        match = false;
      if (status && app.status !== status) match = false;
      if (search && !app.transport.toLowerCase().includes(search))
        match = false;
      if (match) result.push(app);
    }
    filteredApplications = result;

    currentPage = 1;
    renderTable(currentPage);
    updatePagination();
    window.showNotification("Фильтр применён", "info");
  };

  window.resetFilters = function () {
    document.getElementById("filterTransport").value = "";
    document.getElementById("filterStatus").value = "";
    document.getElementById("searchInput").value = "";
    filteredApplications = [];
    for (var i = 0; i < allApplications.length; i++) {
      filteredApplications.push(allApplications[i]);
    }
    currentPage = 1;
    renderTable(currentPage);
    updatePagination();
    window.showNotification("Фильтры сброшены", "info");
  };

  window.searchApplications = function () {
    var search = document.getElementById("searchInput").value.toLowerCase();
    var result = [];
    for (var i = 0; i < allApplications.length; i++) {
      if (allApplications[i].transport.toLowerCase().includes(search)) {
        result.push(allApplications[i]);
      }
    }
    filteredApplications = result;
    currentPage = 1;
    renderTable(currentPage);
    updatePagination();
  };

  // ===== ИСПРАВЛЕННАЯ СОРТИРОВКА =====
  window.sortTable = function (col) {
    var keys = ["id", "transport", "date", "status"];
    var key = keys[col];

    var table = document.getElementById("adminTable");
    if (!table) return;

    var currentSort = table.dataset.sort || "";
    var direction = currentSort === col ? "desc" : "asc";
    table.dataset.sort = direction === "asc" ? col : "";

    filteredApplications.sort(function (a, b) {
      var valA = a[key];
      var valB = b[key];

      if (key === "id") {
        return direction === "asc" ? valA - valB : valB - valA;
      }

      if (key === "date") {
        var numA = parseInt(valA.split(".")[0]) || 0;
        var numB = parseInt(valB.split(".")[0]) || 0;
        return direction === "asc" ? numA - numB : numB - numA;
      }

      if (key === "status") {
        var order = { Новая: 1, "Идет обучение": 2, "Обучение завершено": 3 };
        return direction === "asc"
          ? (order[valA] || 0) - (order[valB] || 0)
          : (order[valB] || 0) - (order[valA] || 0);
      }

      return direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    renderTable(currentPage);
    window.showNotification("Таблица отсортирована", "info");
  };

  // ===== ИНИЦИАЛИЗАЦИЯ АДМИНКИ =====
  var adminTable = document.getElementById("adminTable");
  if (adminTable) {
    filteredApplications = [];
    for (var i = 0; i < allApplications.length; i++) {
      filteredApplications.push(allApplications[i]);
    }
    renderTable(1);
    updatePagination();
  }

  console.log("Все скрипты загружены!");
});

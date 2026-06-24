document.addEventListener("DOMContentLoaded", function () {
  console.log("Пассажирам.РФ — сайт загружен");

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

  const defaultOption = document.querySelector('.rating-option[data-value="5"]');
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
        const defaultOpt = document.querySelector('.rating-option[data-value="5"]');
        if (defaultOpt) {
          defaultOpt.style.opacity = "1";
          const radio = defaultOpt.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        }
        const modal = new bootstrap.Modal(document.getElementById("reviewModal"));
        modal.show();
      } else {
        window.showNotification(
          "Отзыв можно оставить только после завершения обучения!",
          "warning"
        );
      }
    });
  });

  document.getElementById("submitReviewBtn").addEventListener("click", function () {
    const reviewText = document.getElementById("reviewText").value.trim();
    const selectedRating = document.querySelector('#ratingStars input[type="radio"]:checked');
    const rating = selectedRating ? selectedRating.value : "5";

    if (!reviewText) {
      window.showNotification("Пожалуйста, напишите ваш отзыв!", "warning");
      return;
    }

    if (currentReviewRow) {
      const reviewCell = currentReviewRow.querySelector("td:nth-child(5)");
      let starsHtml = '';
      for (let i = 0; i < parseInt(rating); i++) {
        starsHtml += `<img src="../../assets/img/star-gold.svg" alt="star" class="star-icon" />`;
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
      
      const modal = bootstrap.Modal.getInstance(document.getElementById("reviewModal"));
      modal.hide();
      currentReviewRow = null;
    }
  });

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
        window.showNotification("Регистрация успешна! Теперь войдите.", "success");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 500);
      }
    });
  }

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
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 500);
    });
  }

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

  window.searchApplications = function () {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#adminTable tbody tr");

    rows.forEach((row) => {
      const transport = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
      row.style.display = transport.includes(query) ? "" : "none";
    });
  };

  window.applyFilters = function () {
    const transport = document.getElementById("filterTransport").value.toLowerCase();
    const status = document.getElementById("filterStatus").value;
    const rows = document.querySelectorAll("#adminTable tbody tr");

    rows.forEach((row) => {
      const rowTransport = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
      const rowStatus = row.querySelector("td:nth-child(4) .badge").textContent;
      let show = true;

      if (transport && !rowTransport.includes(transport)) show = false;
      if (status && rowStatus !== status) show = false;

      row.style.display = show ? "" : "none";
    });

    window.showNotification("Фильтр применён", "info");
  };

  window.resetFilters = function () {
    document.getElementById("filterTransport").value = "";
    document.getElementById("filterStatus").value = "";
    document.getElementById("searchInput").value = "";
    const rows = document.querySelectorAll("#adminTable tbody tr");
    rows.forEach((row) => {
      row.style.display = "";
    });
    window.showNotification("Фильтры сброшены", "info");
  };

  window.sortTable = function (col) {
    const table = document.getElementById("adminTable");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    const currentSort = table.dataset.sort || "";
    const direction = currentSort === col ? "desc" : "asc";
    table.dataset.sort = direction === "asc" ? col : "";

    const sorted = rows.sort((a, b) => {
      const valA = a.querySelectorAll("td")[col].textContent.trim();
      const valB = b.querySelectorAll("td")[col].textContent.trim();
      
      if (col === 0 || col === 2) {
        const numA = parseInt(valA) || 0;
        const numB = parseInt(valB) || 0;
        return direction === "asc" ? numA - numB : numB - numA;
      }
      
      return direction === "asc" 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    });

    tbody.append(...sorted);
    window.showNotification("Таблица отсортирована", "info");
  };

  console.log("Все скрипты загружены!");
});
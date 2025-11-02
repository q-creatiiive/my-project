// ==========================
// تحميل المكونات (هيدر/فوتر) ديناميكيًا
// ==========================
function loadComponent(id, file) {
  return fetch(file)
    .then(res => res.text())
    .then(data => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = data;
    })
    .catch(err => console.error("خطأ في تحميل المكون:", err));
}

// ==========================
// عرض بطاقات مزودي الخدمة
// ==========================
function renderCards(container, data) {
  if (!container) return;
  container.innerHTML = "";
  if (data.length === 0) {
    container.innerHTML = "<p>لا توجد نتائج مطابقة.</p>";
    return;
  }
  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "service-card m-2 p-3 border rounded";
    div.style.width = "250px";
    div.innerHTML = `
      <img src="${item.img}" class="img-fluid mb-2" alt="${item.name}">
      <h5>${item.name}</h5>
      <p>${item.desc.substring(0, 100)}...</p>
      <a href="details.html?id=${item.id}" class="btn btn-sm btn-primary">معلومات مزود الخدمة</a>
    `;
    container.appendChild(div);
  });
}

// ==========================
// العدّادات
// ==========================
function startCounters() {
  const counters = document.querySelectorAll(".stat:not(.done)");
  counters.forEach(counter => {
    counter.classList.add("done"); 
    counter.innerText = "0";
    const target = +counter.getAttribute("data-target");
    let current = 0;
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = progress * (2 - progress);
      current = Math.floor(target * eased);
      counter.innerText = current;
      if (progress < 1) requestAnimationFrame(updateCounter);
      else counter.innerText = target;
    }

    requestAnimationFrame(updateCounter);
  });
}

// ==========================
// إظهار الكروت عند النزول
// ==========================
function revealCards(selector, offset = 100) {
  document.querySelectorAll(selector).forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - offset) {
      el.classList.add("show");
    }
  });
}

// ==========================
// سلايدر
// ==========================
function initSlider() {
  const cards = document.querySelectorAll(".program-card");
  const dots = document.querySelectorAll(".program-dots button");
  if (!cards.length || !dots.length) return;

  let index = 0;
  function showCard(i) {
    cards[index].classList.remove("active");
    dots[index].classList.remove("active");
    index = i;
    cards[index].classList.add("active");
    dots[index].classList.add("active");
  }
  dots.forEach((dot, i) => dot.addEventListener("click", () => showCard(i)));
}

// ==========================
// فتح وغلق أي بوب أب / مودال
// ==========================
function openPopup(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = "flex";
  setTimeout(() => el.classList.add("show"), 10);
}

function closePopup(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("show");
  setTimeout(() => {
    el.style.display = "none";
    const form = el.querySelector("form");
    if (form) form.reset();
    const success = el.querySelector(".success-msg");
    if (success) success.style.display = "none";
  }, 300);
}

// ==========================
// التحقق من المدخلات
// ==========================
function validatePhoneInput(el) {
  if (!el) return;
  el.addEventListener("input", () => {
    el.value = el.value.replace(/[^0-9]/g, "");
  });
}

function validateEmailInput(el) {
  if (!el) return;
  el.addEventListener("input", () => {
    el.value = el.value.replace(/[\u0600-\u06FF]/g, "");
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(el.value)) el.setCustomValidity("الرجاء إدخال بريد إلكتروني صحيح");
    else el.setCustomValidity("");
  });
}

// ==========================
// عند تحميل الصفحة
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.getElementById("cardsContainer");
  let providersData = [];

  // تحميل الهيدر والفوتر
  Promise.all([
    loadComponent("header", "header.html"),
    loadComponent("footer", "footer.html")
  ]).then(() => {
    // القائمة والدروب داون
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");
    const dropdowns = document.querySelectorAll(".dropdown");

    if (menuToggle && menu) {
      menuToggle.addEventListener("click", () => {
        menu.classList.toggle("active");
        menuToggle.textContent = menu.classList.contains("active") ? "✖" : "☰";
      });
    }

    dropdowns.forEach(drop => {
      const btn = drop.querySelector(".dropbtn");
      const dropdownMenu = drop.querySelector(".dropdown-menu");
      if (btn && dropdownMenu) {
        btn.addEventListener("click", e => {
          e.preventDefault();
          dropdownMenu.classList.toggle("active");
        });
      }
    });

    document.addEventListener("click", e => {
      dropdowns.forEach(drop => {
        const dropdownMenu = drop.querySelector(".dropdown-menu");
        if (dropdownMenu && !drop.contains(e.target)) {
          dropdownMenu.classList.remove("active");
        }
      });
    });

    // باقي الدوال
    initSlider();
    revealCards(".project-card", 50);
    revealCards(".service", 150);
    startCounters();

    // تحميل بيانات مزودي الخدمة
    if (cardsContainer) {
      fetch("providers.json")
        .then(res => res.json())
        .then(data => {
          providersData = data;
          renderCards(cardsContainer, providersData);
        })
        .catch(err => console.error("خطأ في تحميل providers.json:", err));
    }

    // فلترة البحث
    const searchInput = document.getElementById("searchInput");
    const categorySelect = document.getElementById("categorySelect");
    const sizeSelect = document.getElementById("sizeSelect");
    const filterBtn = document.getElementById("filterBtn");

    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        const q = searchInput?.value.toLowerCase() || "";
        const cat = categorySelect?.value || "all";
        const size = sizeSelect?.value || "all";

        const filtered = providersData.filter(p =>
          (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) &&
          (cat === "all" || p.category === cat) &&
          (size === "all" || p.size === size)
        );
        renderCards(cardsContainer, filtered);
      });
    }

    // التحقق من المدخلات
    validatePhoneInput(document.getElementById("eventPhone"));
    validatePhoneInput(document.getElementById("locationPhone"));
    validateEmailInput(document.getElementById("eventEmail"));
    validateEmailInput(document.getElementById("locationEmail"));

    // التعامل مع النماذج
    const forms = [
      {formId: "eventForm", successId: "eventSuccessMsg", popupId: "popupEvent"},
      {formId: "locationForm", successId: "locationSuccessMsg", popupId: "popupLocation"},
    ];

    forms.forEach(({formId, successId, popupId}) => {
      const form = document.getElementById(formId);
      if (!form) return;
      form.addEventListener("submit", e => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const successMsg = document.getElementById(successId);
        if (successMsg) successMsg.style.display = "block";
        setTimeout(() => closePopup(popupId), 2000);
      });
    });

    // غلق البوب أب / مودالات عند الضغط خارجها
    window.addEventListener("click", e => {
      ["popupEvent", "popupLocation", "employeesModal", "equipmentModal", "projectsModal"]
        .forEach(id => {
          const el = document.getElementById(id);
          if (el && e.target === el) closePopup(id);
        });
    });

  }).catch(err => console.error("خطأ في تحميل الهيدر/الفوتر:", err));

  // إعادة الكشف عند التمرير
  window.addEventListener("scroll", () => {
    revealCards(".project-card", 50);
    revealCards(".service", 150);
  });
});

// ==========================
// مودالات الموظفين، المعدات، وسابقة الأعمال
// ==========================
const modalBtns = [
  {openId: "openEmployees", modalId: "employeesModal", closeId: "closeEmployees"},
  {openId: "openEquipment", modalId: "equipmentModal", closeId: "closeEquipment"},
  {openId: "openProjects", modalId: "projectsModal", closeId: "closeProjects"}
];

modalBtns.forEach(({openId, modalId, closeId}) => {
  const openBtn = document.getElementById(openId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeId);

  if (!openBtn || !modal || !closeBtn) return;

  openBtn.onclick = () => openPopup(modalId);
  closeBtn.onclick = () => closePopup(modalId);
});

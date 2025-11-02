document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById("cards-container");

  if (!container) return; // لو العنصر غير موجود

  fetch("factories.json")
    .then(res => res.json())
    .then(data => {
      for (const id in data) {
        const f = data[id];
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <h3>${f.name}</h3>
          ${f.email ? `<p>البريد الإلكتروني: ${f.email}</p>` : ''}
          <p>النشاط: ${f.activity}</p>
          <a href="factoriesdetail.html?id=${id}" class="btn">التفاصيل</a>
        `;
        container.appendChild(card);
      }
    })
    .catch(err => console.error("خطأ في تحميل بيانات المصانع:", err));

  // مثال على نافذة مودال لو فيه أزرار فتح
  const openEmpBtn = document.getElementById("openEmpBtn");
  const empModal = document.getElementById("empModal");

  if (openEmpBtn && empModal) {
    openEmpBtn.onclick = function() {
      empModal.style.display = "flex";
    };
  }
});

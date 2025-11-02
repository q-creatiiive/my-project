const params = new URLSearchParams(window.location.search);
const factoryId = params.get("id");

fetch("factories.json")
  .then(res => res.json())
  .then(data => {
    const f = data[factoryId];
    if (!f) {
      document.getElementById("factory-info").innerHTML = "<p>لم يتم العثور على المصنع.</p>";
      return;
    }

    document.getElementById("factory-info").innerHTML = `
      <p><strong>اسم المصنع:</strong> ${f.name}</p>
      ${f.email ? `<p><strong>البريد الإلكتروني:</strong> ${f.email}</p>` : ''}
      <p><strong>النشاط الرئيسي:</strong> ${f.activity}</p>
      <p><strong>عدد المنتجات:</strong> ${f.productsCount}</p>
      <p><strong>العنوان:</strong> ${f.address}</p>
      <p><strong>إجمالي كمية الطاقة الاستيعابية:</strong> ${f.capacity}</p>
    `;

    const tbody = document.querySelector("#products-table tbody");
    f.products.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.qty}</td>
          <td>${p.unit}</td>
        </tr>
      `;
    });
  })
  .catch(err => {
    console.error("خطأ في تحميل بيانات المصنع:", err);
    document.getElementById("factory-info").innerHTML = "<p>حدث خطأ أثناء تحميل بيانات المصنع.</p>";
  });

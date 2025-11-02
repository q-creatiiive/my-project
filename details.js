document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch("providers.json")
    .then(res => res.json())
    .then(data => {
      const provider = data.find(p => p.id === id);
      if(provider){
        document.getElementById("providerName").textContent = provider.name;
        document.getElementById("providerDesc").textContent = provider.desc;
        document.getElementById("providerImg").src = provider.img;
        document.getElementById("providerCategory").textContent = provider.category;
        document.getElementById("providerSize").textContent = provider.size;
      } else {
        document.querySelector(".container").innerHTML = "<p>المزود غير موجود.</p>";
      }
    });
});



document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card-custom");
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("show");
        }, index * 200); // 200ms فرق بين كل كرت
    });
});
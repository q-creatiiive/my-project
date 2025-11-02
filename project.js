





document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".container-details");
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("show");
        }, index * 200); // 200ms فرق بين كل كرت
    });
});
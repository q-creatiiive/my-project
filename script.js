// تحميل الهيدر والفوتر ديناميكيًا
function loadComponent(id, file) {
    fetch(file)
        .then(res => res.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            // بعد تحميل الهيدر نفعل القوائم
            const menuToggle = document.querySelector('.menu-toggle');
            const menu = document.querySelector('.menu');
            const dropdowns = document.querySelectorAll('.dropdown');

            if(menuToggle && menu){
                menuToggle.addEventListener('click', () => {
                    menu.classList.toggle('active');
                });
            }

            dropdowns.forEach(drop => {
                const btn = drop.querySelector('.dropbtn');
                if (btn) {
                    btn.addEventListener('click', (e) => {
                        if(window.innerWidth <= 768){
                            e.preventDefault();
                            drop.querySelector('.dropdown-menu').classList.toggle('active');
                        }
                    });
                }
            });

        })
        .catch(err => console.error("خطأ في تحميل المكون:", err));
}

// استدعاء الهيدر والفوتر
loadComponent("header", "header.html");
loadComponent("footer", "footer.html");


// كود عدّاد الأرقام مع تأثير انسيابي (Ease)
function startCounters() {
    const counters = document.querySelectorAll('.stat');
    counters.forEach(counter => {
        counter.innerText = '0';
        const target = +counter.getAttribute('data-target');
        let current = 0;

        const duration = 2000; // مدة العد (2 ثانية)
        const startTime = performance.now();

        function updateCounter(now) {
            const progress = Math.min((now - startTime) / duration, 1); // نسبة التقدم (0 → 1)
            const easedProgress = progress * (2 - progress); // دالة Ease-Out
            current = Math.floor(target * easedProgress);
            counter.innerText = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target; // تأكيد آخر قيمة
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// تشغيل العدّاد عند الظهور في الشاشة (كل مرة)
window.addEventListener("scroll", () => {
    const statsSection = document.getElementById("statsSection");
    if (!statsSection) return; // إذا ما فيه العنصر لا يعمل كود
    const sectionTop = statsSection.getBoundingClientRect().top;
    const sectionBottom = statsSection.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight && sectionBottom > 0) {
        startCounters();
    }
});


// إظهار الكروت عند النزول لأسفل
function revealProjects() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const cardTop = card.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (cardTop < windowHeight - 50) {
      card.classList.add('show');
    } else {
      card.classList.remove('show'); // يرجع يخفيها إذا طلعت
    }
  });
}
window.addEventListener('scroll', revealProjects);


 // دالة لتفعيل الكلاس عند النزول
  function reveal() {
    const services = document.querySelectorAll('.service');
    services.forEach(service => {
      const windowHeight = window.innerHeight;
      const elementTop = service.getBoundingClientRect().top;
      const elementVisible = 150;
      if(elementTop < windowHeight - elementVisible) {
        service.classList.add('show');
      }
    });
  }

  window.addEventListener('scroll', reveal);
  window.addEventListener('load', reveal);

// سلايدر الكروت (صور + محتوى)
(function initSlider() {
    const cards = document.querySelectorAll('.program-card');
    const dots = document.querySelectorAll('.program-dots button');
    if (!cards.length || !dots.length) return;

    let index = 0;

    function showCard(i) {
        cards[index].classList.remove('active');
        dots[index].classList.remove('active');
        index = i;
        cards[index].classList.add('active');
        dots[index].classList.add('active');
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showCard(i));
    });
})();
 

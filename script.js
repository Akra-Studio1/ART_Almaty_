
/* =====================================================
   ART ALMATY — COMPLETE INTERACTION SYSTEM
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ================================================
     1. INTRO
  ================================================ */

  const intro = document.getElementById("intro");
  const introSkip = document.getElementById("introSkip");

  function closeIntro() {
    if (!intro) return;

    intro.classList.add("hidden");

    try {
      sessionStorage.setItem("artAlmatyIntroSeen", "true");
    } catch (error) {
      // Сайт продолжает работать, даже если хранилище недоступно.
    }
  }

  let introWasSeen = false;

  try {
    introWasSeen = sessionStorage.getItem("artAlmatyIntroSeen") === "true";
  } catch (error) {
    introWasSeen = false;
  }

  if (intro && introWasSeen) {
    intro.classList.add("hidden");
  }

  if (introSkip) {
    introSkip.addEventListener("click", closeIntro);
  }

  if (intro && !introWasSeen) {
    window.setTimeout(closeIntro, 5500);
  }


  /* ================================================
     2. HEADER SCROLL
  ================================================ */

  const header = document.getElementById("siteHeader");

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();


  /* ================================================
     3. MOBILE MENU
  ================================================ */

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.classList.remove("active");
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }


  /* ================================================
     4. REVEAL ANIMATIONS
  ================================================ */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  }


  /* ================================================
     5. BEFORE / AFTER SLIDERS
  ================================================ */

  const comparisonBoxes = document.querySelectorAll("[data-comparison]");

  comparisonBoxes.forEach((box) => {

    const range = box.querySelector("[data-comparison-range]");
    const afterWrap = box.querySelector("[data-after-wrap]");
    const line = box.querySelector("[data-comparison-line]");

    if (!range || !afterWrap || !line) {
      return;
    }

    range.min = "0";
    range.max = "100";
    range.step = "0.1";
    range.value = "50";

    function updateComparison(value) {

      const position = Math.max(
        0,
        Math.min(100, Number(value))
      );

      afterWrap.style.clipPath =
        `inset(0 0 0 ${position}%)`;

      line.style.left = `${position}%`;

    }

    range.addEventListener("input", (event) => {
      updateComparison(event.target.value);
    });

    updateComparison(50);

  });


  /* ================================================
     6. CONTACT FORM — WHATSAPP
  ================================================ */

  const contactForm = document.getElementById("contactForm");

  /*
    ВАЖНО:
    Вставь сюда подтверждённый номер WhatsApp компании.
    Формат: код страны + номер, только цифры.
    Не добавляй +, пробелы или скобки.

    Пока номер пустой, форма не отправляет сообщение.
  */

  const WHATSAPP_NUMBER = "77072727941";

  if (contactForm) {

    contactForm.addEventListener("submit", (event) => {

      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      if (!WHATSAPP_NUMBER) {
        alert("Контакт WhatsApp ещё не настроен. Пожалуйста, свяжитесь с владельцем сайта.");
        return;
      }

      const name = document.getElementById("clientName")?.value.trim() || "";
      const phone = document.getElementById("clientPhone")?.value.trim() || "";
      const direction = document.getElementById("clientDirection")?.value || "";
      const comment = document.getElementById("clientComment")?.value.trim() || "Не указан";

      const message = [
        "Здравствуйте! Хочу оставить заявку на мебель.",
        "",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Направление: ${direction}`,
        `Комментарий: ${comment}`
      ].join("\n");

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, "_blank", "noopener,noreferrer");

    });

  }


  /* ================================================
     7. IMAGE ERROR DETECTION
  ================================================ */

  document.querySelectorAll("img").forEach((image) => {

    image.addEventListener("error", () => {
      console.warn("Не удалось загрузить изображение:", image.src);
    });

  });


  /* ================================================
     8. FOOTER YEAR / INITIALIZATION
  ================================================ */

  console.log("ART ALMATY website initialized.");

});

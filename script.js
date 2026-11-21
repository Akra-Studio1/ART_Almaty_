
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // SETTINGS
  // ==========================================

  const WHATSAPP_NUMBER = ""; 
  // Добавим подтверждённый номер компании позже.
  // Формат: код страны и цифры, без +, пробелов и скобок.

  const INTRO_DURATION = 5500;

  // ==========================================
  // CINEMATIC INTRO
  // ==========================================

  const intro = document.querySelector(".intro");
  const skipButton = document.querySelector(".intro-skip");

  function closeIntro() {
    if (!intro || intro.classList.contains("hidden")) return;

    intro.classList.add("hidden");

    setTimeout(() => {
      intro.remove();
    }, 1100);

    try {
      sessionStorage.setItem("artAlmatyIntroShown", "true");
    } catch (error) {
      // Сайт продолжит работать, даже если хранилище недоступно.
    }
  }

  let introAlreadyShown = false;

  try {
    introAlreadyShown =
      sessionStorage.getItem("artAlmatyIntroShown") === "true";
  } catch (error) {
    introAlreadyShown = false;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (intro && (introAlreadyShown || reducedMotion)) {
    intro.remove();
  } else if (intro) {
    const introTimer = setTimeout(closeIntro, INTRO_DURATION);

    if (skipButton) {
      skipButton.addEventListener("click", () => {
        clearTimeout(introTimer);
        closeIntro();
      });
    }
  }

  // ==========================================
  // SCROLL REVEAL
  // ==========================================

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
        rootMargin: "0px 0px -40px 0px"
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

  // ==========================================
  // BEFORE / AFTER SLIDER
  // ==========================================

  const comparison = document.querySelector(".comparison-stage");
  const afterImage = document.querySelector(".comparison-after");
  const divider = document.querySelector(".comparison-divider");
  const handle = document.querySelector(".comparison-handle");

  if (comparison && afterImage && divider && handle) {
    let dragging = false;

    function updateComparison(clientX) {
      const rect = comparison.getBoundingClientRect();

      let position = ((clientX - rect.left) / rect.width) * 100;

      position = Math.max(0, Math.min(100, position));

      afterImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
      divider.style.left = `${position}%`;
      handle.style.left = `${position}%`;
    }

    comparison.addEventListener("pointerdown", (event) => {
      dragging = true;

      if (comparison.setPointerCapture) {
        comparison.setPointerCapture(event.pointerId);
      }

      updateComparison(event.clientX);
    });

    comparison.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      updateComparison(event.clientX);
    });

    comparison.addEventListener("pointerup", () => {
      dragging = false;
    });

    comparison.addEventListener("pointercancel", () => {
      dragging = false;
    });

    handle.setAttribute("tabindex", "0");
    handle.setAttribute("role", "slider");
    handle.setAttribute("aria-label", "Сравнение до и после");
    handle.setAttribute("aria-valuemin", "0");
    handle.setAttribute("aria-valuemax", "100");
    handle.setAttribute("aria-valuenow", "50");

    function updateKeyboardComparison(direction) {
      const current = Number(
        handle.getAttribute("aria-valuenow") || 50
      );

      const next = Math.max(
        0,
        Math.min(100, current + direction * 5)
      );

      const rect = comparison.getBoundingClientRect();
      updateComparison(rect.left + rect.width * next / 100);

      handle.setAttribute("aria-valuenow", String(next));
    }

    handle.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        updateKeyboardComparison(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        updateKeyboardComparison(1);
      }
    });

    comparison.addEventListener("pointermove", () => {
      const rect = comparison.getBoundingClientRect();
      const position =
        ((parseFloat(divider.style.left) || 50) / 100);

      handle.setAttribute(
        "aria-valuenow",
        String(Math.round(position * 100))
      );
    });
  }

  // ==========================================
  // CONTACT FORM / WHATSAPP
  // ==========================================

  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = contactForm.querySelector(
        '[name="name"]'
      )?.value.trim();

      const phone = contactForm.querySelector(
        '[name="phone"]'
      )?.value.trim();

      const direction = contactForm.querySelector(
        '[name="direction"]'
      )?.value.trim();

      const comment = contactForm.querySelector(
        '[name="comment"]'
      )?.value.trim();

      if (!name || !phone) {
        alert("Пожалуйста, заполните имя и номер телефона.");
        return;
      }

      const message = [
        "Здравствуйте! Новая заявка с сайта ART ALMATY.",
        "",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Направление: ${direction || "Не указано"}`,
        `Комментарий: ${comment || "Нет"}`
      ].join("\n");

      if (!WHATSAPP_NUMBER) {
        alert(
          "Форма готова. Для отправки заявок необходимо добавить подтверждённый номер WhatsApp компании."
        );
        return;
      }

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
  }

  // ==========================================
  // MOBILE MENU SUPPORT
  // ==========================================

  const navLinks = document.querySelectorAll(".nav a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
    });
  });

  // ==========================================
  // IMAGE FALLBACK
  // ==========================================

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");
    });
  });

  console.log("ART ALMATY website initialized.");
});


document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // SETTINGS
  // ==========================================

  const CONFIG = {
    whatsappNumber: "",
    introDuration: 5500
  };

  // Номер компании добавим после согласования.
  // Формат: 77000000000, без плюса и пробелов.

  // ==========================================
  // INTRO — ARCHITECTURE
  // ==========================================

  const intro = document.getElementById("intro");
  const skipIntro = document.getElementById("skipIntro");

  let introTimer = null;
  let introClosed = false;

  function closeIntro() {
    if (!intro || introClosed) return;

    introClosed = true;

    if (introTimer) {
      clearTimeout(introTimer);
    }

    intro.classList.add("hidden");

    try {
      sessionStorage.setItem("artAlmatyIntroShown", "true");
    } catch (error) {
      // Сайт продолжает работать без sessionStorage.
    }

    window.setTimeout(() => {
      intro.remove();
    }, 1100);
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let introWasShown = false;

  try {
    introWasShown =
      sessionStorage.getItem("artAlmatyIntroShown") === "true";
  } catch (error) {
    introWasShown = false;
  }

  if (intro) {
    if (introWasShown || reducedMotion) {
      intro.remove();
    } else {
      introTimer = window.setTimeout(
        closeIntro,
        CONFIG.introDuration
      );
    }
  }

  if (skipIntro) {
    skipIntro.addEventListener("click", closeIntro);
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

  // ==========================================
  // COMPARISON SLIDER
  // ==========================================

  const comparisonBox = document.getElementById("comparisonBox");
  const afterWrap = document.getElementById("afterWrap");
  const comparisonLine = document.getElementById("comparisonLine");
  const comparisonRange = document.getElementById("comparisonRange");
  const afterImage = comparisonBox?.querySelector(".comparison-after");

  if (
    comparisonBox &&
    afterWrap &&
    comparisonLine &&
    comparisonRange &&
    afterImage
  ) {
    function syncImageSize() {
      const width = comparisonBox.clientWidth;

      // Изображение сохраняет ширину всей сцены,
      // а обрезается только внешним контейнером.
      afterImage.style.width = `${width}px`;
      afterImage.style.height = "100%";
    }

    function updateComparison(value) {
      const position = Math.max(0, Math.min(100, Number(value)));

      afterWrap.style.width = `${position}%`;
      comparisonLine.style.left = `${position}%`;

      comparisonRange.value = String(position);
      comparisonRange.setAttribute(
        "aria-valuenow",
        String(Math.round(position))
      );
    }

    syncImageSize();
    updateComparison(comparisonRange.value);

    comparisonRange.addEventListener("input", (event) => {
      updateComparison(event.target.value);
    });

    window.addEventListener("resize", syncImageSize);

    if ("ResizeObserver" in window) {
      const comparisonObserver = new ResizeObserver(syncImageSize);
      comparisonObserver.observe(comparisonBox);
    }

    afterImage.addEventListener("load", syncImageSize);
  }

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");
  const navLinks = document.querySelectorAll("#navigation a");

  function closeMenu() {
    if (!menuToggle || !navigation) return;

    menuToggle.classList.remove("active");
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
  }

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      document.body.classList.toggle("menu-open", isOpen);

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Закрыть меню" : "Открыть меню"
      );
    });

    navLinks.forEach((link) => {
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

  // ==========================================
  // HEADER SCROLL EFFECT
  // ==========================================

  const header = document.getElementById("header");

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  // ==========================================
  // CONTACT FORM
  // ==========================================

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);

      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const direction = String(
        formData.get("direction") || ""
      ).trim();

      const comment = String(
        formData.get("comment") || ""
      ).trim();

      if (!name || !phone) {
        if (formStatus) {
          formStatus.textContent =
            "Пожалуйста, заполните имя и телефон.";
        }
        return;
      }

      if (!CONFIG.whatsappNumber) {
        if (formStatus) {
          formStatus.textContent =
            "Демонстрационная форма. Контакт компании пока не подключён.";
        }
        return;
      }

      const message = [
        "Здравствуйте! Новая заявка с сайта ART ALMATY.",
        "",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Направление: ${direction || "Не указано"}`,
        `Комментарий: ${comment || "Не указан"}`
      ].join("\n");

      const whatsappURL =
        "https://wa.me/" +
        CONFIG.whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

      const openedWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      if (openedWindow) {
        if (formStatus) {
          formStatus.textContent =
            "Откройте WhatsApp и отправьте подготовленное сообщение.";
        }
      } else {
        if (formStatus) {
          formStatus.textContent =
            "Не удалось открыть WhatsApp. Проверьте настройки браузера.";
        }
      }
    });
  }

  // ==========================================
  // IMAGE ERROR HANDLING
  // ==========================================

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");
      image.setAttribute("data-image-error", "true");
    });
  });

  // ==========================================
  // FOOTER YEAR
  // ==========================================

  console.log("ART ALMATY initialized successfully.");
});

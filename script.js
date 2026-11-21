
document.addEventListener("DOMContentLoaded", function () {

    // 1. INTRO
    var intro = document.querySelector(".intro");
    var skipButton = document.querySelector(".intro-skip");

    function closeIntro() {
        if (intro) {
            intro.classList.add("hidden");
        }
    }

    if (intro) {
        var introWasSeen = false;

        try {
            introWasSeen = sessionStorage.getItem("artIntroSeen") === "yes";
        } catch (error) {
            introWasSeen = false;
        }

        if (introWasSeen) {
            closeIntro();
        } else {
            window.setTimeout(function () {
                closeIntro();

                try {
                    sessionStorage.setItem("artIntroSeen", "yes");
                } catch (error) {
                    // Storage is optional.
                }
            }, 5600);
        }
    }

    if (skipButton) {
        skipButton.addEventListener("click", function () {
            closeIntro();

            try {
                sessionStorage.setItem("artIntroSeen", "yes");
            } catch (error) {
                // Storage is optional.
            }
        });
    }


    // 2. HEADER
    var header = document.querySelector(".header");

    function updateHeader() {
        if (!header) {
            return;
        }

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader);


    // 3. MOBILE MENU
    var menuButton = document.querySelector(".menu-toggle");
    var navigation = document.querySelector(".nav");

    if (menuButton && navigation) {

        menuButton.addEventListener("click", function () {
            navigation.classList.toggle("open");
            menuButton.classList.toggle("active");

            var isOpen = navigation.classList.contains("open");
            menuButton.setAttribute("aria-expanded", isOpen);
        });

        var menuLinks = navigation.querySelectorAll("a");

        menuLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("open");
                menuButton.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }


    // 4. SCROLL ANIMATIONS
    var revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        var revealObserver = new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });

        }, {
            threshold: 0.12
        });

        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });

    }


    // 5. BEFORE / AFTER SLIDERS
    var comparisonBoxes = document.querySelectorAll("[data-comparison]");

    comparisonBoxes.forEach(function (box) {

        var range = box.querySelector("[data-comparison-range]");
        var afterWrap = box.querySelector("[data-after-wrap]");
        var line = box.querySelector("[data-comparison-line]");
        var afterImage = afterWrap ? afterWrap.querySelector("img") : null;

        if (!range || !afterWrap || !line || !afterImage) {
            console.warn("Проверь HTML блока До / После:", box);
            return;
        }

        function updateSlider() {
            var value = Number(range.value);

            if (value < 0) {
                value = 0;
            }

            if (value > 100) {
                value = 100;
            }

            afterWrap.style.width = value + "%";
            line.style.left = value + "%";
        }

        function resizeImage() {
            afterImage.style.width = box.clientWidth + "px";
        }

        range.min = 0;
        range.max = 100;
        range.value = 50;

        updateSlider();
        resizeImage();

        range.addEventListener("input", updateSlider);

        window.addEventListener("resize", resizeImage);

        afterImage.addEventListener("load", resizeImage);

    });


    // 6. CONTACT FORM
    var contactForm = document.querySelector(".contact-form");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            var nameField = contactForm.querySelector('[name="name"]');
            var phoneField = contactForm.querySelector('[name="phone"]');
            var directionField = contactForm.querySelector('[name="direction"]');
            var commentField = contactForm.querySelector('[name="comment"]');
            var status = contactForm.querySelector(".form-status");

            if (!nameField || !phoneField || !directionField) {
                if (status) {
                    status.textContent = "Проверь поля формы в HTML.";
                }
                return;
            }

            var message = "Здравствуйте! Заявка с сайта ART ALMATY.\n\n";
            message += "Имя: " + nameField.value + "\n";
            message += "Телефон: " + phoneField.value + "\n";
            message += "Направление: " + directionField.value + "\n";

            if (commentField) {
                message += "Комментарий: " + commentField.value;
            }

            /*
                Добавим подтверждённый номер WhatsApp компании позже.
                Пока номер намеренно не указан.
            */

            var whatsappNumber = "";

            if (whatsappNumber === "") {
                if (status) {
                    status.textContent = "Форма работает. Для отправки заявки нужно добавить номер WhatsApp компании.";
                }

                console.log(message);
                return;
            }

            var whatsappLink = "https://wa.me/" + whatsappNumber;
            whatsappLink += "?text=" + encodeURIComponent(message);

            window.open(whatsappLink, "_blank");
        });

    }


    // 7. IMAGE CHECK
    var images = document.querySelectorAll("img");

    images.forEach(function (image) {

        image.addEventListener("error", function () {
            console.warn("Не загрузилось изображение: " + image.src);
        });

    });

});
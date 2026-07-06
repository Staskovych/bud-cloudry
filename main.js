/**
 * IBK Prombud client-side interaction script.
 * Handles navigation layout triggers, contact form validation, and customized video controls.
 */
(function () {
  "use strict";

  // --- Mobile Navigation Menu Handler ---
  const header = document.querySelector(".header");
  const burger = document.querySelector(".header__burger");
  const nav = document.getElementById("header-nav");

  if (header && burger && nav) {
    const setMenuState = (isOpen) => {
      header.classList.toggle("header--menu-open", isOpen);
      document.body.classList.toggle("header-menu-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    };

    burger.addEventListener("click", () => {
      setMenuState(!header.classList.contains("header--menu-open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenuState(false);
    });

    // --- Sticky Scroll Header Animation ---
    const handleScroll = () => {
      header.classList.toggle("header--scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  // --- Contact Form Input Validation and Formatting ---
  const contactForm = document.getElementById("contact-form");
  const successOverlay = document.getElementById("contact-success");
  const successCloseBtn = document.getElementById("success-close-btn");

  if (contactForm && successOverlay && successCloseBtn) {
    const fields = {
      name: {
        element: document.getElementById("form-name"),
        group: document.getElementById("form-name").closest(".form-group"),
        validate: (val) => val.trim().length > 0
      },
      email: {
        element: document.getElementById("form-email"),
        group: document.getElementById("form-email").closest(".form-group"),
        validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
      },
      phone: {
        element: document.getElementById("form-phone"),
        group: document.getElementById("form-phone").closest(".form-group"),
        validate: (val) => val.replace(/\D/g, "").length >= 10
      }
    };

    // Format phone number dynamically to standard Ukrainian template: +38 (0XX) XXX-XX-XX
    const phoneInput = fields.phone.element;
    phoneInput.addEventListener("input", (e) => {
      let digits = e.target.value.replace(/\D/g, "");

      if (digits.startsWith("380")) {
        digits = digits.substring(2);
      } else if (digits.startsWith("80")) {
        digits = digits.substring(1);
      }

      let formatted = "+38 (0";
      if (digits.length > 1) {
        const localArea = digits.startsWith("0") ? digits.substring(1) : digits;
        if (localArea.length > 0) formatted += localArea.substring(0, 2);
        if (localArea.length > 2) formatted += ") " + localArea.substring(2, 5);
        if (localArea.length > 5) formatted += "-" + localArea.substring(5, 7);
        if (localArea.length > 7) formatted += "-" + localArea.substring(7, 9);
      } else {
        formatted += digits;
      }

      e.target.value = formatted === "+38 (0" ? "" : formatted;
    });

    // Toggle validation visual feedback
    const validateField = (field) => {
      const isValid = field.validate(field.element.value);
      field.group.classList.toggle("form-group--error", !isValid);
      return isValid;
    };

    Object.values(fields).forEach((field) => {
      field.element.addEventListener("blur", () => validateField(field));
      field.element.addEventListener("input", () => {
        if (field.group.classList.contains("form-group--error")) {
          validateField(field);
        }
      });
    });

    // Form Submission Handling
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let isFormValid = true;
      Object.values(fields).forEach((field) => {
        if (!validateField(field)) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        const submitBtn = document.getElementById("submit-btn");
        const originalBtnHtml = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>Надсилання...</span>";

        // Simulate network latency and resolve
        setTimeout(() => {
          successOverlay.classList.add("contact__success-overlay--active");
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }, 1200);
      }
    });

    // Close success overlay popup
    const hideSuccessOverlay = () => {
      successOverlay.classList.remove("contact__success-overlay--active");
    };

    successCloseBtn.addEventListener("click", hideSuccessOverlay);
    successOverlay.addEventListener("click", (e) => {
      if (e.target === successOverlay) hideSuccessOverlay();
    });
  }

  // --- Custom Video Player Interactions ---
  const promoVideo = document.getElementById("promo-video");
  const promoOverlay = document.getElementById("promo-video-overlay");
  const promoPlayBtn = document.getElementById("promo-video-play-btn");

  if (promoVideo && promoOverlay && promoPlayBtn) {
    const initiatePlayback = () => {
      promoOverlay.classList.add("intro-video__overlay--hidden");
      promoVideo.setAttribute("controls", "true");
      promoVideo.play();
    };

    promoPlayBtn.addEventListener("click", initiatePlayback);

    promoVideo.addEventListener("ended", () => {
      promoVideo.removeAttribute("controls");
      promoOverlay.classList.remove("intro-video__overlay--hidden");
      promoVideo.load();
    });

    // Custom keyboard hotkeys for video element focus
    promoVideo.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (promoVideo.paused) {
          promoVideo.play();
        } else {
          promoVideo.pause();
        }
      }
    });
  }

  // --- Scroll-Reveal Observer ---
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll(".reveal, .reveal-stagger");
    if (revealElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -80px 0px",
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          if (target.classList.contains("reveal-stagger")) {
            target.classList.add("reveal-stagger--active");
          } else {
            target.classList.add("reveal--active");
          }
          self.unobserve(target);
        }
      });
    }, observerOptions);

    revealElements.forEach((element) => observer.observe(element));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollReveal);
  } else {
    initScrollReveal();
  }
})();


"use strict";

// ========================================
// PORTFOLIO CONFIGURATION
// ========================================

const PORTFOLIO_CONFIG = Object.freeze({
  email: "yashika.sharma1004@gmail.com"
});


// ========================================
// GLOBAL ELEMENTS
// ========================================

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const statusMessage = document.querySelector("#site-status");
const backToTop = document.querySelector(".back-to-top");

let statusTimeout;


// ========================================
// STATUS MESSAGE
// ========================================

function showStatus(message) {
  if (!statusMessage) return;

  window.clearTimeout(statusTimeout);

  statusMessage.textContent = message;
  statusMessage.classList.add("is-visible");

  statusTimeout = window.setTimeout(function () {
    statusMessage.classList.remove("is-visible");
  }, 3500);
}


// ========================================
// MOBILE MENU
// ========================================

const mobileMenuQuery = window.matchMedia("(max-width: 800px)");

function setMenuState(isOpen, options) {

  if (!menuToggle || !navPanel) return;

  const returnFocus = options && options.returnFocus;

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  navPanel.classList.toggle(
    "is-open",
    isOpen
  );

  // Hidden mobile menu must not be focusable or announced
  if (mobileMenuQuery.matches && !isOpen) {
    navPanel.setAttribute("inert", "");
  } else {
    navPanel.removeAttribute("inert");
  }

  if (isOpen) {
    const firstLink = navPanel.querySelector("a");
    if (firstLink) firstLink.focus();
  } else if (returnFocus) {
    menuToggle.focus();
  }
}


// Menu toggle
if (menuToggle) {

  menuToggle.addEventListener("click", function () {

    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    setMenuState(!isOpen);
  });
}


// Close menu when navigation link clicked
navLinks.forEach(function (link) {

  link.addEventListener("click", function () {
    setMenuState(false);
  });

});


// Close menu with Escape and return focus to the toggle
document.addEventListener("keydown", function (event) {

  if (
    event.key === "Escape" &&
    menuToggle &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    setMenuState(false, { returnFocus: true });
  }

});


// Close menu when clicking outside it
document.addEventListener("click", function (event) {

  if (
    !menuToggle ||
    !navPanel ||
    menuToggle.getAttribute("aria-expanded") !== "true"
  ) {
    return;
  }

  if (
    !navPanel.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    setMenuState(false);
  }

});


// Close menu when keyboard focus leaves it
if (navPanel) {

  navPanel.addEventListener("focusout", function (event) {

    if (
      mobileMenuQuery.matches &&
      event.relatedTarget &&
      !navPanel.contains(event.relatedTarget) &&
      event.relatedTarget !== menuToggle
    ) {
      setMenuState(false);
    }

  });
}


// Reset menu state when switching between mobile and desktop layouts
mobileMenuQuery.addEventListener("change", function () {
  setMenuState(false);
});


// ========================================
// SMOOTH SCROLL
// ========================================

document
  .querySelectorAll('a[href^="#"]')
  .forEach(function (anchor) {

    anchor.addEventListener("click", function (event) {

      const target = document.querySelector(
        anchor.getAttribute("href")
      );

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion
          ? "auto"
          : "smooth",
        block: "start"
      });
    });
  });


// ========================================
// NAVIGATION SECTION OBSERVER
// ========================================

const sections = navLinks
  .map(function (link) {
    return document.querySelector(
      link.getAttribute("href")
    );
  })
  .filter(Boolean);


if ("IntersectionObserver" in window) {

  // Active navigation section
  const sectionObserver = new IntersectionObserver(
    function (entries) {

      entries.forEach(function (entry) {

        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach(function (link) {

          const isCurrent =
            link.getAttribute("href") ===
            "#" + entry.target.id;

          if (isCurrent) {
            link.setAttribute(
              "aria-current",
              "page"
            );
          } else {
            link.removeAttribute(
              "aria-current"
            );
          }

        });
      });

    },
    {
      rootMargin: "-28% 0px -62% 0px",
      threshold: 0
    }
  );


  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });


  // Reveal animation
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );
        }
      });

    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08
    }
  );


  document
    .querySelectorAll(".reveal")
    .forEach(function (element) {

      revealObserver.observe(element);

    });

} else {

  // Fallback if IntersectionObserver isn't supported
  document
    .querySelectorAll(".reveal")
    .forEach(function (element) {

      element.classList.add(
        "is-visible"
      );

    });
}


// ========================================
// CONTACT FORM
// ========================================

const contactForm =
  document.querySelector("#contact-form");


if (contactForm) {

  contactForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      const form = event.currentTarget;

      if (!form.checkValidity()) {

        form.reportValidity();
        return;

      }

      const formData =
        new FormData(form);

      const senderName =
        String(formData.get("name") || "").trim();

      const senderEmail =
        String(formData.get("email") || "").trim();

      const message =
        String(formData.get("message") || "").trim();


      const subject =
        encodeURIComponent(
          "Portfolio inquiry from " +
          senderName
        );


      const body =
        encodeURIComponent(
          "Name: " +
          senderName +
          "\nEmail: " +
          senderEmail +
          "\n\nMessage:\n" +
          message
        );


      showStatus(
        "Your email application is opening with the message details."
      );


      window.location.href =
        "mailto:" +
        PORTFOLIO_CONFIG.email +
        "?subject=" +
        subject +
        "&body=" +
        body;
    }
  );
}


// ========================================
// HEADER + BACK TO TOP
// ========================================

function updatePageChrome() {

  const hasScrolled =
    window.scrollY > 12;


  if (header) {

    header.classList.toggle(
      "is-scrolled",
      hasScrolled
    );

  }


  if (backToTop) {

    backToTop.classList.toggle(
      "is-visible",
      window.scrollY > 600
    );

  }
}


window.addEventListener(
  "scroll",
  updatePageChrome,
  {
    passive: true
  }
);


// ========================================
// BACK TO TOP
// ========================================

if (backToTop) {

  backToTop.addEventListener(
    "click",
    function () {

      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion
          ? "auto"
          : "smooth"
      });

    }
  );
}


// ========================================
// INITIALIZE
// ========================================

setMenuState(false);
updatePageChrome();
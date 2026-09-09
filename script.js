"use strict";

// ========================================
// PORTFOLIO CONFIGURATION
// ========================================

const PORTFOLIO_CONFIG = Object.freeze({
  githubUrl: "https://github.com/yashika-10",
  linkedInUrl: "https://www.linkedin.com/in/yashika-sharma1004/",
  resumeUrl: "assets/yashika's resume.pdf",
  email: "yashika.sharma1004@gmail.com",
  phone: "+91 8929xxxxxx"
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
// URL VALIDATION
// ========================================

function isValidExternalUrl(value) {
  return (
    typeof value === "string" &&
    /^https?:\/\/\S+$/i.test(value)
  );
}


// ========================================
// PHONE FORMATTER
// ========================================

function formatPhoneForLink(phone) {
  return phone.replace(/[^\d+]/g, "");
}


// ========================================
// CONTACT DETAILS
// ========================================

function setConfiguredContactDetails() {

  // Email links
  document.querySelectorAll("[data-email-link]").forEach(function (link) {
    link.href = "mailto:" + PORTFOLIO_CONFIG.email;
  });

  // Email text
  document.querySelectorAll("[data-email-text]").forEach(function (element) {
    element.textContent = PORTFOLIO_CONFIG.email;
  });

  // Phone links
  document.querySelectorAll("[data-phone-link]").forEach(function (link) {
    link.href =
      "tel:" + formatPhoneForLink(PORTFOLIO_CONFIG.phone);
  });

  // Phone text
  document.querySelectorAll("[data-phone-text]").forEach(function (element) {
    element.textContent = PORTFOLIO_CONFIG.phone;
  });
}


// ========================================
// GITHUB / LINKEDIN / RESUME BUTTONS
// ========================================

function configureExternalButtons() {

  const links = {
    github: PORTFOLIO_CONFIG.githubUrl,
    linkedin: PORTFOLIO_CONFIG.linkedInUrl
  };


  // GitHub + LinkedIn
  document
    .querySelectorAll("[data-config-link]")
    .forEach(function (button) {

      const linkName = button.dataset.configLink;
      const url = links[linkName];

      button.addEventListener("click", function () {

        if (!isValidExternalUrl(url)) {

          showStatus(
            linkName === "github"
              ? "GitHub link is not configured yet."
              : "LinkedIn link is not configured yet."
          );

          return;
        }

        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );
      });
    });


  // Resume
  document
    .querySelectorAll("[data-resume-link]")
    .forEach(function (button) {

      // Enable Resume button
      button.disabled = false;

      button.addEventListener("click", function () {

        if (!PORTFOLIO_CONFIG.resumeUrl) {
          showStatus("Resume link is not configured yet.");
          return;
        }

        window.open(
          PORTFOLIO_CONFIG.resumeUrl,
          "_blank",
          "noopener,noreferrer"
        );
      });
    });
}


// ========================================
// MOBILE MENU
// ========================================

function setMenuState(isOpen) {

  if (!menuToggle || !navPanel) return;

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  navPanel.classList.toggle(
    "is-open",
    isOpen
  );
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


// Close menu with Escape
document.addEventListener("keydown", function (event) {

  if (event.key === "Escape") {
    setMenuState(false);
  }

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
// PROJECT LINKS
// ========================================

document
  .querySelectorAll("[data-project-link]")
  .forEach(function (button) {

    button.addEventListener("click", function () {

      showStatus(
        button.dataset.projectLink +
        " is not publicly linked yet."
      );

    });

  });


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

setConfiguredContactDetails();
configureExternalButtons();
updatePageChrome();
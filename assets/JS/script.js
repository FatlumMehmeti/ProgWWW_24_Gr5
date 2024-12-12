// Initialize the theme and language on page load
document.addEventListener("DOMContentLoaded", function () {
  applySavedTheme();
  applySavedLanguage();

  // Modal-related logic
  const modal = document.getElementById("cookiePolicyModal");
  const cookiePolicyLink = document.getElementById("cookiePolicyLink");

  if (cookiePolicyLink && modal) {
    // Show modal on link click
    cookiePolicyLink.addEventListener("click", (event) => {
      event.preventDefault();
      modal.style.display = "block";
    });

    // Close modal when clicking outside the modal content
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // Enable checkbox toggling on label click
  document.querySelectorAll(".cookie-options .cookie-items").forEach((option) => {
    const checkbox = option.querySelector('input[type="checkbox"]');
    if (checkbox) {
      option.addEventListener("click", () => {
        if (!checkbox.disabled) {
          checkbox.checked = !checkbox.checked;
        }
      });
    }
  });

  // Newsletter form submission logic
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("emailInput").value;
      alert(`You have been subscribed with this email: ${email}`);
    });
  }
});

// Apply saved theme from localStorage
function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  const modeIcon = document.getElementById("modeIcon");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    modeIcon.className = "ri-contrast-2-fill";
  } else {
    document.body.classList.remove("light-mode");
    modeIcon.className = "ri-contrast-2-line";
  }
}

// Toggle dark/light mode and save selection to localStorage
function toggleTheme() {
  const isLightMode = document.body.classList.toggle("light-mode");
  const modeIcon = document.getElementById("modeIcon");

  modeIcon.className = isLightMode
    ? "ri-contrast-2-fill"
    : "ri-contrast-2-line";
  localStorage.setItem("theme", isLightMode ? "light" : "dark");
}

// Google Translate API initialization
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}

// Toggle Google Translate visibility
function openTranslate() {
  const translateElement = document.getElementById("google_translate_element");
  translateElement.style.display =
    translateElement.style.display === "none" ? "block" : "none";
}

// Apply saved language from localStorage
function applySavedLanguage() {
  const savedLanguage = localStorage.getItem("selectedLanguage");
  if (savedLanguage) {
    new google.translate.TranslateElement(
      { pageLanguage: "en", includedLanguages: savedLanguage },
      "google_translate_element"
    );
  }
}

// Capture language selection in the Google Translate dropdown
document.addEventListener("click", function (event) {
  const frame = document.querySelector("iframe.goog-te-menu-frame");
  if (frame && frame.contentDocument) {
    frame.contentDocument
      .querySelectorAll(".goog-te-menu2-item")
      .forEach((item) => {
        item.addEventListener("click", function () {
          const selectedLanguage = item.getAttribute("lang");
          localStorage.setItem("selectedLanguage", selectedLanguage);
        });
      });
  }
});

// Functions for accept and reject buttons
function acceptCookies() {
  alert("You have accepted cookies.");
  const modal = document.getElementById("cookiePolicyModal");
  if (modal) modal.style.display = "none";
}

function rejectCookies() {
  alert("You have rejected cookies.");
  const modal = document.getElementById("cookiePolicyModal");
  if (modal) modal.style.display = "none";
}

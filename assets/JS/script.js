// Initialize the theme and language on page load
document.addEventListener("DOMContentLoaded", function() {
    applySavedTheme();
    applySavedLanguage();
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
    
    modeIcon.className = isLightMode ? "ri-contrast-2-fill" : "ri-contrast-2-line";
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
    translateElement.style.display = translateElement.style.display === "none" ? "block" : "none";
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
  document.addEventListener("click", function(event) {
    const frame = document.querySelector("iframe.goog-te-menu-frame");
    if (frame && frame.contentDocument) {
      frame.contentDocument.querySelectorAll(".goog-te-menu2-item").forEach((item) => {
        item.addEventListener("click", function() {
          const selectedLanguage = item.getAttribute("lang");
          localStorage.setItem("selectedLanguage", selectedLanguage);
        });
      });
    }
  });

  // Get modal and link elements
  const modal = document.getElementById('cookiePolicyModal');
  const cookiePolicyLink = document.getElementById('cookiePolicyLink');

  // Show modal on link click
  cookiePolicyLink.addEventListener('click', (event) => {
      event.preventDefault();
      modal.style.display = 'block';
  });

  // Functions for accept and reject buttons
  function acceptCookies() {
      alert('You have accepted cookies.');
      modal.style.display = 'none';
  }

  function rejectCookies() {
      alert('You have rejected cookies.');
      modal.style.display = 'none';
  }

  // Disable clicks outside the modal
  modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            event.stopPropagation();
        }
    });
    // Enable checkbox on label click
    document.querySelectorAll('.cookie-options .cookie-items').forEach(option => {
        option.addEventListener('click', () => {
            const checkbox = option.querySelector('input[type="checkbox"]');
            if (!checkbox.disabled) {
                checkbox.checked = !checkbox.checked;
            }
        });
    });
  
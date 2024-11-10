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
  
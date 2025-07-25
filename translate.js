function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,hi,bn,ta,te,ml,gu,mr,kn,pa', // English + Indian languages
    layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL
  }, 'google_translate_element');
}

// Persistent language setting
document.addEventListener("DOMContentLoaded", function () {
  const observer = new MutationObserver(() => {
    const langSelect = document.querySelector(".goog-te-combo");
    if (langSelect) {
      langSelect.addEventListener("change", function () {
        localStorage.setItem("selectedLanguage", this.value);
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const savedLang = localStorage.getItem("selectedLanguage");
  if (savedLang) {
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = savedLang;
        select.dispatchEvent(new Event("change"));
        clearInterval(interval);
      }
    }, 500);
  }
});

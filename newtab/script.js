document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    countdownEl: document.getElementById('countdown'),
    customTextInput: document.getElementById('customTextInput'),
    settingsModal: document.getElementById('settingsModal'),
    applySettingsBtn: document.getElementById('applySettings'),
    closeSettingsBtn: document.getElementById('closeSettings'),
    digitCountInput: document.getElementById('digitCount'),
    refreshRateInput: document.getElementById('refreshRate'),
    settingsToggle: document.getElementById('settingsToggle'),
    themeToggle: document.getElementById('themeToggle'),
    themeSelector: document.getElementById('themeSelector'),
    modalDate: document.getElementById('modalDate'),
    modalSave: document.getElementById('modalSave'),
    modalCancel: document.getElementById('modalCancel'),
    modalOverlay: document.getElementById('modalOverlay'),
    dateSettingInput: document.getElementById('dateSetting'),
    errorMessage: document.getElementById('errorMessage'),
  };

  // Tema değişimi
  function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('theme', theme); // Temayı kaydet
    if (elements.themeSelector) {
      elements.themeSelector.value = theme; // Dropdown güncelle
    }
  }

  // Varsayılan tema kontrolü
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme); // Kaydedilen temayı uygula
  } else {
    applyTheme('dark'); // Varsayılan olarak "dark" teması
  }

  // Tema menüsünü aç/kapa
  elements.themeToggle.addEventListener('click', () => {
    const themeSelectorWrapper = document.getElementById('themeSelectorWrapper');
    themeSelectorWrapper.style.display = 
      themeSelectorWrapper.style.display === "block" ? "none" : "block";
  });

  // Tema değişimi dropdown'dan seçilince
  if (elements.themeSelector) {
    elements.themeSelector.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });
  }

  // Kullanıcı ayarları için varsayılan değerler
  let userSettings = {
    digitCount: 7,
    refreshRate: 1000,
    currentDate: null,
    customText: "",
  };

  // localStorage'dan mevcut ayarları al
  const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
  if (savedSettings) {
    userSettings = savedSettings; // Mevcut ayarları kullan
  }

  // Modalda ayarları güncelle
  function updateSettingsModal() {
    elements.digitCountInput.value = userSettings.digitCount;
    elements.refreshRateInput.value = userSettings.refreshRate;
    elements.dateSettingInput.value = userSettings.currentDate || '';
    elements.customTextInput.value = userSettings.customText || ''; // Metin alanını doldur
  }

  // Sayacın güncellenmesi
  // Metni güncelle
function updateCountdown() {
  if (!userSettings.currentDate) return;

  const target = new Date(userSettings.currentDate);
  const now = new Date();
  const diff = target - now;

  const years = diff / 31557600000; // Yıl hesaplama
  const formattedYears = Math.abs(years).toFixed(userSettings.digitCount);

  // Tarihin üstündeki yazıyı ekleyin
  const customText = userSettings.customText || 'Hedefe kalan süre:';

  elements.countdownEl.innerHTML = `
    <div class="custom-text">${customText}</div>
    <span class="glow">${formattedYears}</span>
  `;
  }


  // Sayacın başlatılması
  let countdownInterval;
  function startCountdown() {
    clearInterval(countdownInterval); // Önceki interval'i temizle
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, userSettings.refreshRate);
  }

  startCountdown(); // Başlangıçta sayacı başlat

  // Ayarları uygulama
  function applySettings() {
    const digitCount = parseInt(elements.digitCountInput.value, 10);
    let refreshRate = parseInt(elements.refreshRateInput.value, 10);
    const newDate = elements.dateSettingInput.value;
    const customText = elements.customTextInput.value; // Girilen metni al
  
    let validSettings = true;
  
    // Basamak sayısı kontrolü
    if (digitCount >= 1 && digitCount <= 50) {
      userSettings.digitCount = digitCount;
    } else {
      showErrorMessage('Basamak sayısı 1 ile 50 arasında olmalıdır.');
      validSettings = false;
    }
  
    // Yenileme hızı kontrolü
    if (refreshRate >= 1 && refreshRate <= 5000) {
      userSettings.refreshRate = refreshRate;
    } else {
      showErrorMessage("Yenileme hızı 1ms ile 5000ms arasında olmalıdır.");
      validSettings = false;
    }
  
    if (newDate) {
      userSettings.currentDate = newDate;
      localStorage.setItem('savedDate', newDate);
    }
  
    // Girilen metni kaydet
    userSettings.customText = customText || '';
  
    if (validSettings) {
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      startCountdown();
      closeSettingsModal();
    }
  }

  // Hata mesajını göster
  function showErrorMessage(message) {
    const errorPopup = document.createElement('div');
    errorPopup.className = 'error-popup';
    errorPopup.textContent = message;

    document.body.appendChild(errorPopup);

    errorPopup.style.display = 'block';

    setTimeout(() => {
      errorPopup.remove();
    }, 3000);
  }

  // Ayarları Uygulama ve Kapatma
  elements.applySettingsBtn.addEventListener('click', applySettings);
  elements.closeSettingsBtn.addEventListener('click', closeSettingsModal);

  // Modalı açma
  function openSettingsModal() {
    elements.settingsModal.style.display = 'flex';
    updateSettingsModal();
  }

  // Modalı kapama
  function closeSettingsModal() {
    elements.settingsModal.style.display = 'none';
  }

  // Ayarları açmak için buton ekleyin
  elements.settingsToggle.addEventListener('click', openSettingsModal);

  // Yerel depolama işlemi
  const savedDate = localStorage.getItem('savedDate');
  if (savedDate) {
    userSettings.currentDate = savedDate;
    elements.dateSettingInput.value = savedDate;
    updateCountdown();
  } else {
    openSettingsModal();
  }
});

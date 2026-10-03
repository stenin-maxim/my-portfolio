document.addEventListener('DOMContentLoaded', () => {
    const btnRu = document.getElementById('btn-ru');
    const btnEn = document.getElementById('btn-en');
    let translations = null;

    async function loadTranslations() {
        try {
            const response = await fetch('translations.json');
            translations = await response.json();
            
            // После загрузки определяем, какой язык отобразить
            const savedLang = localStorage.getItem('preferred-lang');
            if (savedLang === 'ru' || savedLang === 'en') {
                changeLanguage(savedLang);
            } else {
                const isRussian = (navigator.language || navigator.userLanguage).includes('ru');
                changeLanguage(isRussian ? 'ru' : 'en');
            }
        } catch (error) {
            console.error('Ошибка загрузки переводов:', error);
        }
    }

    // Функция смены языка
    function changeLanguage(lang) {
        if (!translations) return;
        localStorage.setItem('preferred-lang', lang);

        // Активные классы для кнопок
        if (lang === 'ru') {
            btnRu.classList.add('active');
            btnEn.classList.remove('active');
        } else {
            btnEn.classList.add('active');
            btnRu.classList.remove('active');
        }

        // Переводим элементы
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                // Если в переводе есть HTML теги (например, highlight для имени), используем innerHTML
                if (translations[lang][key].includes('<')) {
                    element.innerHTML = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
    }
    btnRu.addEventListener('click', () => changeLanguage('ru'));
    btnEn.addEventListener('click', () => changeLanguage('en'));

    // Стартуем загрузку
    loadTranslations();
})
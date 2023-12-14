document.getElementById('generate').addEventListener('click', generateQuote);
document.getElementById('translate').addEventListener('click', translateQuote);

function generateQuote() {
    let numberOfQuotes = getLocalStorageItem('number_of_quotes') || 0;

    fetchQuote()
        .then(quote => {
            saveLocalStorage(numberOfQuotes);
            setSessionStorageItem(`quote_${numberOfQuotes + 1}`, quote);
            updateQuoteElement(quote);
        });
}

function translateQuote() {
    const quoteElement = document.getElementById('quote');
    const quoteToTranslate = quoteElement.innerText;
    const targetLanguage = 'pl';

    fetchTranslation(quoteToTranslate, targetLanguage)
        .then(translatedText => {
            updateQuoteElement(translatedText);

            let translationCount = getLocalStorageItem('translation_count') || 0;
            setLocalStorageItem('translation_count', translationCount + 1);
            setSessionStorageItem(`quote_${translationCount + 1}_translated`, translatedText);
        })
        .catch(error => console.error('Błąd tłumaczenia:', error));
}

function getLocalStorageItem(key) {
    return parseInt(localStorage.getItem(key)) || 0;
}

function setLocalStorageItem(key, value) {
    localStorage.setItem(key, value);
}

function getSessionStorageItem(key) {
    return sessionStorage.getItem(key);
}

function setSessionStorageItem(key, value) {
    sessionStorage.setItem(key, value);
}

function fetchQuote() {
    return fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(data => data.content);
}

function fetchTranslation(quote, targetLanguage) {
    return fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(quote)}`)
        .then(response => response.json())
        .then(data => (data && data[0] && data[0][0] && data[0][0][0]) ? data[0][0][0] : 'Błąd tłumaczenia');
}

function saveLocalStorage(numberOfQuotes) {
    setLocalStorageItem('number_of_quotes', numberOfQuotes + 1);
}

function updateQuoteElement(text) {
    document.getElementById('quote').innerText = text;
}

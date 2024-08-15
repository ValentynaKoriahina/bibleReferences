import { getVerse, booksChaptersVerses } from './utils/bibleTexts.js';

// Заполняет выпадающие списки при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const bookSelect = document.getElementById('bookSelect');
  const chapterSelect = document.getElementById('chapterSelect');
  const verseSelect = document.getElementById('verseSelect');

  function populateChapters(book) {
    chapterSelect.innerHTML = '';
    if (booksChaptersVerses[book]) {
      for (const chapter in booksChaptersVerses[book]) {
        const option = document.createElement('option');
        option.value = chapter;
        option.textContent = `Глава ${chapter}`;
        chapterSelect.appendChild(option);
      }
    }
  }

  function populateVerses(book, chapter) {
    verseSelect.innerHTML = '';
    if (booksChaptersVerses[book] && booksChaptersVerses[book][chapter]) {
      for (let i = 1; i <= booksChaptersVerses[book][chapter]; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Стих ${i}`;
        verseSelect.appendChild(option);
      }
    }
  }

  // Заполняет выпадающий список книг при загрузке страницы
  for (const book in booksChaptersVerses) {
    const option = document.createElement('option');
    option.value = book;
    option.textContent = book;
    bookSelect.appendChild(option);
  }

  // Обновляет главы и стихи при выборе книги
  bookSelect.addEventListener('change', (event) => {
    const selectedBook = event.target.value;
    populateChapters(selectedBook);
    populateVerses(selectedBook, chapterSelect.value);
  });

  // Обновляет стихи при выборе главы
  chapterSelect.addEventListener('change', (event) => {
    const selectedBook = bookSelect.value;
    const selectedChapter = event.target.value;
    populateVerses(selectedBook, selectedChapter);
  });

  // Заполняет главы и стихи для первой книги при загрузке страницы
  if (bookSelect.options.length > 0) {
    const initialBook = bookSelect.options[0].value;
    populateChapters(initialBook);
    if (chapterSelect.options.length > 0) {
      populateVerses(initialBook, chapterSelect.options[0].value);
    }
  }
});


// Проверяет тип устройства (мобильное или десктоп) для отображение текста в модальном окне
export function checkDeviceType() {
  if (window.innerWidth <= 800) {
    document.getElementById("info").innerHTML = '';
  } else {
    document.getElementById("info").innerHTML = 'Используйте Shift или Ctrl для выбора нескольких стихов';
  }
}


// Сбрасывает выбранные значения и текстовые элементы в модальном окне
export function resetModal() {
  const bookSelect = document.getElementById("bookSelect");
  const chapterSelect = document.getElementById("chapterSelect");
  const verseSelect = document.getElementById("verseSelect");
  const selectedText = document.getElementById("selectedText");
  const additionalText = document.getElementById("additionalText");

  bookSelect.selectedIndex = 0;
  chapterSelect.selectedIndex = -1;
  verseSelect.selectedIndex = -1;

  selectedText.textContent = "";
  additionalText.textContent = "";
}


// Обрабатывает выделение текста пользователем и отображает его в модальном окне
export function handleTextSelection() {
  checkDeviceType();
  const selection = window.getSelection().toString().trim();
  if (selection) {
    document.getElementById("selectedText").innerHTML = selection;
    document.getElementById("selectionModal").style.display = "block";
  }
}

// Обновляет доступные варианты глав в зависимости от выбранной книги
export function updateChapterOptions() {
  const book = document.getElementById('bookSelect').value;
  const chapterSelect = document.getElementById('chapterSelect');
  const numberOfChapters = booksChaptersVerses[book] ? Object.keys(booksChaptersVerses[book]).length : 0;

  chapterSelect.innerHTML = '';
  for (let i = 1; i <= numberOfChapters; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    chapterSelect.appendChild(option);
  }

  updateVerseOptions();
}

// Обновляет доступные варианты стихов в зависимости от выбранной книги и главы
export function updateVerseOptions() {
  const book = document.getElementById('bookSelect').value;
  const chapter = document.getElementById('chapterSelect').value;
  const verseSelect = document.getElementById('verseSelect');
  const numberOfVerses = booksChaptersVerses[book] && booksChaptersVerses[book][chapter] ? booksChaptersVerses[book][chapter] : 0;

  verseSelect.innerHTML = '';
  for (let i = 1; i <= numberOfVerses; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    verseSelect.appendChild(option);
  }
}

// Обрабатывает нажатие кнопки перехода к выбранному стиху и отображает его текст
document.getElementById('goToVerseButton').addEventListener('click', () => {
  const book = document.getElementById('bookSelect').value;
  const chapter = document.getElementById('chapterSelect').value;
  const selectedVerses = Array.from(document.getElementById('verseSelect').selectedOptions).map(option => option.value);

  const reference = `${book} ${chapter}:${selectedVerses.join(',')}`;
  const verseText = getVerse(reference);

  document.getElementById('additionalText').innerHTML = `${reference}<br> ${verseText}`;
});


// Добавляет обработчики закрытия модальных окон
document.querySelectorAll('.close').forEach(closeBtn => {
  closeBtn.onclick = function () {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = "none");
    resetModal();
  };
});


// Закрывает модальное окно при нажатии вне его области
window.onclick = function (event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target == modal) {
      modal.style.display = "none";
      resetModal();
    }
  });
};

// Открывает модальное окно через плавающую кнопку
document.getElementById('floatingButton').addEventListener('click', async function () {
  checkDeviceType();
  document.getElementById("selectionModal").style.display = "block";
});


// Передает выделенный текст в модальное окно выделение текста в элементе с id="output"
document.getElementById('output').addEventListener('mouseup', handleTextSelection);

// Обновляет главы при изменении выбранной книги
document.getElementById('bookSelect').addEventListener('change', updateChapterOptions);

// Обновляет стихи при изменении выбранной главы
document.getElementById('chapterSelect').addEventListener('change', updateVerseOptions);


// Обрабатывает нажатие кнопки перехода к выбранному стиху и отображает его текст
document.getElementById('goToVerseButton').addEventListener('click', () => {
  const book = document.getElementById('bookSelect').value;
  const chapter = document.getElementById('chapterSelect').value;
  const selectedVerses = Array.from(document.getElementById('verseSelect').selectedOptions).map(option => option.value);

  const reference = `${book} ${chapter}:${selectedVerses.join(',')}`;
  const verseText = getVerse(reference);

  document.getElementById('additionalText').innerHTML = `${reference}<br> ${verseText}`;
});


// Активация кнопки после выбора всех опций
function checkSelections() {
  const bookSelect = document.getElementById('bookSelect');
  const chapterSelect = document.getElementById('chapterSelect');
  const verseSelect = document.getElementById('verseSelect');
  const goToVerseButton = document.getElementById('goToVerseButton');

  // Проверяем, выбраны ли все опции
  if (bookSelect.value && chapterSelect.value && verseSelect.selectedOptions.length > 0) {
    goToVerseButton.disabled = false; // Активируем кнопку
  } else {
    goToVerseButton.disabled = true; // Деактивируем кнопку
  }
}

document.getElementById('bookSelect').addEventListener('change', checkSelections);
document.getElementById('chapterSelect').addEventListener('change', checkSelections);
document.getElementById('verseSelect').addEventListener('change', checkSelections);


import { books, bible } from './bible.js';

// Создаёт объект с количеством глав и стихов для каждой книги
export let booksChaptersVerses = countBooksChaptersVerses();

/**
 * Подсчитывает количество глав и стихов в каждой книге Библии
 * @returns {Object} Объект, где ключи — названия книг, а значения — объект с количеством стихов по главам
 */
function countBooksChaptersVerses() {
    let booksChaptersVerses = {};

    for (const book in bible) {
        let chapters = 0;
        let verses = 0;
        let result = {};

        for (const i in bible[book]) {
            chapters += 1;
            verses = 0;
            for (const _ in bible[book][i]) {
                verses += 1;
            }
            // Запоминаем количество стихов в текущей главе
            const chapter = Number(i) + 1;
            result[chapter] = verses;
        }

        // Сохраняем результат для текущей книги
        booksChaptersVerses[books[book][0]] = result;
    }

    return booksChaptersVerses;
}

/**
 * Получает текст стихов по ссылкам
 * @param {Array} references Массив объектов с ссылками на стихи
 * @returns {String} HTML-строка с текстом стихов
 */
export function processReferences(references) {
    let results = [];

    references.forEach(ref => {
        const book = mapBookName(ref.book);
        const { chapter, verses } = ref;

        if (bible.hasOwnProperty(book)) {
            const chapters = bible[book];
            if (chapter - 1 < chapters.length) {
                const chapterVerses = chapters[chapter - 1];
                verses.forEach(verseNumber => {
                    if (verseNumber - 1 < chapterVerses.length) {
                        results.push(`(${chapter}:${verseNumber}) ${chapterVerses[verseNumber - 1]}`);
                    } else {
                        results.push(`(${chapter}:${verseNumber}) Стих не найден`);
                    }
                });
            } else {
                results.push(`(${book} ${chapter}) Глава не найдена`);
            }
        } else {
            results.push(`(${book}) Книга не найдена`);
        }
    });

    return results.join('<br>');
}

/**
 * Преобразует название книги в ключ объекта `bible`
 * @param {String} value Название книги
 * @returns {String|null} Ключ книги в объекте `bible` или `null`, если книга не найдена
 */
export function mapBookName(value) {
    for (const [key, val] of Object.entries(books)) {
        if (val[0] === value) {
            return key;
        }
    }
    return null;
}

/**
 * Получает текст стихов по ссылке
 * @param {String} reference Ссылка на стих
 * @returns {String} HTML-строка с текстом стихов
 */
export function getVerse(reference) {
    let parsedRef = parseBibleReference(reference);

    console.log(1);
    console.log(parsedRef);

    return processReferences(parsedRef);
}

/**
 * Разбирает ссылку на стихи и возвращает структурированные данные
 * @param {String} reference Ссылка на стих
 * @returns {Array} Массив объектов с книгой, главой и стихами
 */
function parseBibleReference(reference) {
    // Регулярное выражение для разбора ссылок на Библию
    const regex = /([\d]*\s*[^\d,]+)\s*(\d+):(\d+(?:-\d+)?(?:,\s*\d+(?:-\d+)?)*)/g;

    const matches = [];
    let match;

    // Используем регулярное выражение для поиска всех ссылок
    while ((match = regex.exec(reference)) !== null) {
        const book = match[1].trim();
        const chapter = parseInt(match[2], 10);
        const verses = [];

        // Разбираем строки стихов
        const verseRanges = match[3].split(',');
        for (let range of verseRanges) {
            const [start, end] = range.split('-').map(v => parseInt(v.trim(), 10));
            if (end !== undefined) {
                for (let i = start; i <= end; i++) {
                    verses.push(i);
                }
            } else {
                verses.push(start);
            }
        }

        matches.push({
            book,
            chapter,
            verses: Array.from(new Set(verses)) // Убираем дубли
        });
    }

    // Копируем имя книги из первого элемента в пустые
    if (matches.length > 0) {
        const firstBook = matches[0].book;

        for (let i = 1; i < matches.length; i++) {
            if (!matches[i].book || matches[i].book === '-') {
                matches[i].book = firstBook;
            }
        }
    }

    return matches;
}

'use strict';

//Variabler
const searchField = document.getElementById('search'); //Sökfältet
const searchButton = document.getElementById('btn'); //Sökknappen
const content = document.querySelector('div.content'); //Tom div i vilken man petar in saker i
import defaultbild from '../img/provbild.jpg'; //grå bild (importeras eftersom parcel komprimerar med random siffertillägg)

//Göm api-nyckeln tydligen
require('dotenv').config();
const key = process.env.API_KEY;

/* Händelsehanterare som lyssnar efter enterslag eller tryck på sökknappen, anropar fetchfunktion */
searchField.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchBooks();
    }
});
searchButton.addEventListener('click', () => {
    searchBooks();
});

//liten funktion som avkodar snippets med hjälp av textarea
function decodeHTMLEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text.replace(/<[^>]*>/g, '');
    return textarea.value;
}

/* Fetchfunktion som hämtar google books-data */
async function searchBooks() {
    const searchValue = encodeURI(searchField.value);
    const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchValue}&${key}`;

    try {
        const response = await fetch(googleUrl);
        const data = await response.json();

        /* Skapa tom array att peta in items i */
        let dataArray = [];

        /* Sålla ut items från svaret, lägg in i dataarrayen */
        if (data.items) {
            dataArray = data.items;
        }
        /* Skicka till funktion som skriver ut till skärmen */
        printSearch(dataArray);
    } catch (error) {
        console.log('Något gick fel: ' + error);
        document.querySelector(
            'div.content'
        ).innerHTML = `<p class="intro">Något verkar ha gått fel... </p>`;
    }
}

/* Funktion som skriver ut sökresultat till skärmen */
function printSearch(data) {
    //Rensa skärmen
    if (content.innerHTML.length > 0) {
        content.innerHTML = '';
    }
    //Skapa ny div
    const searchGrid = document.createElement('div');
    searchGrid.classList.add('searchgrid');
    content.appendChild(searchGrid);

    //Loopa igenom alla
    data.forEach((item) => {
        //skapa div.card
        const divCard = document.createElement('div');
        divCard.classList.add('card');

        //bild, om det finns
        if (item.volumeInfo.imageLinks) {
            const bookImg = document.createElement('img');
            bookImg.src = item.volumeInfo.imageLinks.thumbnail;
            bookImg.setAttribute('alt', '');
            divCard.appendChild(bookImg);
        } else {
            //defaultbild annars
            const bookImg = document.createElement('img');
            bookImg.src = defaultbild;
            bookImg.setAttribute('alt', '');
            divCard.appendChild(bookImg);
        }

        //Boktitel
        const titleP = document.createElement('p');
        titleP.classList.add('boktitel');
        const bookTitle = document.createTextNode(item.volumeInfo.title);
        titleP.appendChild(bookTitle);
        divCard.appendChild(titleP);

        //Författare OM det finns en
        if (item.volumeInfo.authors) {
            const authorP = document.createElement('p');
            authorP.classList.add('author');

            //Om det finns mer än en, lägg till mellanslag
            if (item.volumeInfo.authors.length > 1) {
                const authorsList = item.volumeInfo.authors.join(', ');
                const authorText = document.createTextNode(authorsList);
                authorP.appendChild(authorText);
            } else {
                //Annars, lägg till som vanligt
                const authorText = document.createTextNode(
                    item.volumeInfo.authors
                );
                //Peta in i P-elementet
                authorP.appendChild(authorText);
            }
            //peta in i divcard
            divCard.appendChild(authorP);
        } else {
            //Skriv ut reservtext annars
            const authorP = document.createElement('p');
            authorP.classList.add('author');
            const authorText = document.createTextNode(
                'Ingen författare listad'
            );
            //peta in i DOM
            authorP.appendChild(authorText);
            divCard.appendChild(authorP);
        }
        //Peta in divcard i DOM
        searchGrid.appendChild(divCard);

        //Lägg på händelselyssnare så man kan klicka på bok
        divCard.addEventListener('click', (e) => {
            //Anropa funktion som skriver ut bokinfo till skärmen
            showBook(item);
        });
    });
}

/* Funktion som skriver ut info om bok  */
function showBook(book) {
    const abtBook = book.volumeInfo;

    //rensa skärmen från sök
    if (content.innerHTML.length > 0) {
        content.innerHTML = '';
    }

    //skapa bookpage
    const bookPage = document.createElement('div');
    bookPage.classList.add('bookpage');
    content.appendChild(bookPage);

    //Titlegrid
    const titleGrid = document.createElement('div');
    titleGrid.classList.add('titlegrid');
    content.appendChild(titleGrid);

    //skapa div runt bild:
    const flexImg = document.createElement('div');
    flexImg.classList.add('fleximg');
    titleGrid.appendChild(flexImg);

    //bild om finns
    if (abtBook.imageLinks) {
        const bookImg = document.createElement('img');
        bookImg.src = abtBook.imageLinks.thumbnail;
        bookImg.setAttribute('alt', '');
        flexImg.appendChild(bookImg);
    } else {
        //defaultbild annars
        const bookImg = document.createElement('img');
        bookImg.src = defaultbild;
        bookImg.setAttribute('alt', '');
        flexImg.appendChild(bookImg);
    }

    //bokinfo div
    const bookInfo = document.createElement('div');
    bookInfo.classList.add('bookinfo');

    bookInfo.innerHTML = `
    <h1>${abtBook.title}</h1>`;
    //Kolla om författare finns listad
    if (abtBook.authors) {
        //Om ja, kolla om det är mer än 1 författare i listan
        if (abtBook.authors.length > 1) {
            //Om ja, lägg till mellanslag mellan författarnamnen
            const authorsList = abtBook.authors.join(', ');
            bookInfo.innerHTML += `<p>${authorsList}</p>`;
        } else {
            //Om nej, lägg till som vanligt
            bookInfo.innerHTML += `<p>${abtBook.authors}</p>`;
        }
    } else {
        //Om ingen författare finns, skriv det
        bookInfo.innerHTML += `<p style="font-style: italic">Ingen författare listad</p>`;
    }
    //Kolla om bokkategori finns listat
    if (abtBook.categories) {
        bookInfo.innerHTML += `<p>${abtBook.categories}`;
    }
    //Kolla om publisher finns
    if (abtBook.publisher) {
        bookInfo.innerHTML += `<p>${abtBook.publisher}</p>`;
    }
    //Lägg till resten av informationen
    if (abtBook.pageCount && abtBook.industryIdentifiers) {
        bookInfo.innerHTML += `
        <p>${abtBook.pageCount} sidor</p>
        <p>ISBN: ${abtBook.industryIdentifiers[0].identifier}</p>
        `;
    }

    //Peta in i DOM
    titleGrid.appendChild(bookInfo);
    bookPage.appendChild(titleGrid);

    //Skapa presentation
    const presentation = document.createElement('div');
    presentation.classList.add('presentation');
    const textContent = document.createElement('div');
    textContent.classList.add('text-content');
    presentation.appendChild(textContent);
    bookPage.appendChild(presentation);

    //själva Textinnehållet om boken
    const aboutTitle = document.createElement('h2');
    const aboutTitleText = document.createTextNode(`Om ${abtBook.title}`);
    aboutTitle.appendChild(aboutTitleText);
    textContent.appendChild(aboutTitle);

    //Beskrivning
    const desc = document.createElement('p');
    desc.classList.add('no-top-margin');

    //Kolla om det finns beskrivning
    if (abtBook.description) {
        const descText = document.createTextNode(abtBook.description);
        desc.appendChild(descText);
    } else {
        const descText = document.createTextNode(
            'Det finns ingen information tillgänglig om denna titel...'
        );
        desc.appendChild(descText);
    }
    textContent.appendChild(desc);

    //Om det finns textsnippet:
    if (book.searchInfo) {
        let snippet = document.createElement('p');
        snippet.classList.add('textsnippet');
        //Avkoda med hjälp av funktionen
        const decodedSnippet = decodeHTMLEntities(book.searchInfo.textSnippet);
        // lägg in i textnod
        const snippetText = document.createTextNode(decodedSnippet);
        snippet.appendChild(snippetText);
        textContent.appendChild(snippet);
    }

    //Skapa om författaren-rubrik (om det finns en)
    const aboutHeadline = document.createElement('h2');
    if (abtBook.authors) {
        const headlineText = document.createTextNode(
            `Om ${abtBook.authors[0]}`
        );
        aboutHeadline.appendChild(headlineText);
    } else {
        const headlineText = document.createTextNode('Om författaren');
        aboutHeadline.appendChild(headlineText);
    }
    textContent.appendChild(aboutHeadline);

    //skapa extract-biten genom att anropa funktion
    if (abtBook.authors) {
        fetchExtract(abtBook.authors, textContent);
    } else {
        const extractEl = document.createElement('p');
        extractEl.classList.add('no-top-margin');
        extractEl.innerHTML = 'Det finns ingenting att visa här.';
        textContent.appendChild(extractEl);
    }
}

//Funktion som hämtar info om författare från wikipedia API
async function fetchExtract(authors, div) {
    //Grunden till wikipedialänk
    const wikiUrl =
        'https://sv.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&origin=*&titles=';
    //författarnamn
    let author = authors[0];
    author = encodeURI(author);

    try {
        const response = await fetch(wikiUrl + author);
        const data = await response.json();
        //Hämta bara extract utan att veta pageID
        const page = Object.values(data.query.pages)[0];
        const extract = page.extract;
        //Skapa element
        const extractP = document.createElement('p');
        extractP.classList.add('no-top-margin');
        //Kolla om det finns info om författare
        if (!extract) {
            extractP.innerHTML =
                'Det finns ingen information tillgänglig för denna författare..';
        } else {
            extractP.innerHTML = extract;
        }
        div.appendChild(extractP);
    } catch (error) {
        console.log('Nåt gick fel: ' + error);
    }
}

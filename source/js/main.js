'use strict';

//Variabler
const searchField = document.getElementById('search'); //Sökfältet
const searchButton = document.getElementById('btn'); //Sökknappen
const content = document.querySelector('div.content'); //Tom div i vilken man petar in saker i

const key = ''; //Google Books API nyckel

/* Händelsehanterare som lyssnar efter enterslag eller tryck på sökknappen, anropar fetchfunktion */
searchField.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchBooks();
    }
});
searchButton.addEventListener('click', () => {
    searchBooks();
});

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
        document.querySelector('main p.intro').innerHTML =
            'Något verkar ha gått fel..';
    }
}

/* Funktion som skriver ut sökresultat till skärmen */
function printSearch(data) {
    console.log(data);
    content.innerHTML = '';
    //Skapa ny div
    const searchGrid = document.createElement('div');
    searchGrid.classList.add('searchgrid');
    content.appendChild(searchGrid);

    data.forEach((item) => {
        /* Kod här :) */
    });
}

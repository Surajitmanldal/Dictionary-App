// https://api.dictionaryapi.dev/api/v2/entries/en/hello
// get Elements From Html
const themeIcon = document.getElementById('theme-icon');

themeIcon.addEventListener('click', () => {
    themeIcon.classList.toggle('fa-sun');
    themeIcon.classList.toggle('fa-moon');
    document.body.classList.toggle('dark-theme');

    // Save theme preference
    const isDark = themeIcon.classList.contains('fa-moon');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') === 'dark';
    if (savedTheme) {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        document.body.classList.add('dark-theme');
    }
});


let search_word = document.getElementById("search-word");
let search = document.getElementById("search-btn");
let word = document.querySelector(".word");
let pOF_speech = document.querySelector(".part-of-speech");
let meaning = document.querySelector(".meaning");
let synonyms = document.querySelector(".synonyms");
let example = document.querySelector(".example");
let read = document.getElementById("read");

let currentAudio = null;
const sound = document.getElementById('sound');
const spinner = document.querySelector('.loading-spinner');


const dictionary = async () => {
    try {
        spinner.style.display = 'block';
        const card = document.querySelector('.card');
        card.style.display = 'none';
        let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search_word.value}`);
        let dataWord = await data.json();
        if (!data.ok) {
            throw new Error("Word not found!");
        }
        spinner.style.display = 'none';
        card.style.display = 'block';
        card.classList.add('show');

        const audioUrl = dataWord[0].phonetics[0]?.audio;

        sound.replaceWith(sound.cloneNode(true));
        const newSound = document.getElementById('sound');

        newSound.addEventListener('click', () => {
            if (audioUrl) {
                // Stop previous audio if playing
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio = null;
                }
                // Create and play new audio
                currentAudio = new Audio(audioUrl);
                currentAudio.play();
            } else {
                alert("Sorry, audio not available for this word");
            }
        });
        // console.log(dataWord[0]['word'])
        // console.log(dataWord[0]['meanings'][0]['partOfSpeech'])
        // console.log(dataWord[0]['meanings'][0]['definitions'][0]['definition'])
        // console.log(dataWord[0]['meanings'][0]['definitions'][0]['example'])
        // console.log(dataWord[0]['sourceUrls']['0']);
        // console.log(dataWord[0]['meanings'][0]['synonyms']['0']);
        displayData(
            dataWord[0]['word'],
            dataWord[0]['meanings'][0]['partOfSpeech'],
            dataWord[0]['meanings'][0]['definitions'][0]['definition'],
            dataWord[0]['meanings'][0]['synonyms']['0'],
            dataWord[0]['meanings'][0]['definitions'][0]['example'],
            dataWord[0]['sourceUrls']['0']
        );
    }
    catch (error) {
        alert(error.message);
        const card = document.querySelector('.card');
        spinner.style.display = 'none';
        card.classList.remove('show');
    }
}



function displayData(searchWord, partOfSpeech, wordMeaning, wordSynonyms, wordExample, readMore) {
    word.textContent = searchWord;
    pOF_speech.textContent = partOfSpeech;

    meaning.setAttribute('data-label', 'Meaning:');
    meaning.textContent = wordMeaning;

    example.setAttribute('data-label', 'Example:');
    if (wordExample == undefined) {
        example.textContent = "You can think by your own";
    }
    else {
        example.textContent = wordExample;
    }

    synonyms.setAttribute('data-label', 'Synonyms:');
    synonyms.textContent = wordSynonyms;

    read.href = readMore;
}
search.addEventListener('click', () => {
    if (!search_word.value.trim()) {
        alert("Please enter a word to search!");
        return;
    }
    dictionary();
});

search_word.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (!search_word.value.trim()) {
            alert("Please enter a word to search!");
            return;
        }
        dictionary();
    }
});

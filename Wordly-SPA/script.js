const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const resultsSection = document.getElementById("results");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload
    const word = input.value.trim();

    // Clear previous results and error messages
    resultsSection.innerHTML = "";
    errorMessage.textContent = "";

    if (!word) {
        errorMessage.textContent = "Please enter a word.";
        return;
    }

    fetchWordData(word);
});

async function fetchWordData(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error("Word not found");
        }
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        errorMessage.textContent = error.message;
    }
}

function displayResults(data) {
    data.forEach((entry) => {
        const card = document.createElement("div");
        card.classList.add("definition-card");

        const wordTitle = document.createElement("h2");
        wordTitle.textContent = entry.word;
        card.appendChild(wordTitle);

        if (entry.phonetic) {
            const pronunciation = document.createElement("p");
            pronunciation.textContent = `Pronunciation: ${entry.phonetic}`;
            card.appendChild(pronunciation);
        }

        entry.meanings.forEach((meaning) => {
            const partOfSpeech = document.createElement("p");
            partOfSpeech.textContent = `Part of Speech: ${meaning.partOfSpeech}`;
            card.appendChild(partOfSpeech);

            const defsList = document.createElement("ul");
            meaning.definitions.forEach((def) => {
                const defItem = document.createElement("li");
                defItem.textContent = def.definition;
                defsList.appendChild(defItem);
            });
            card.appendChild(defsList);

            if (meaning.synonyms && meaning.synonyms.length > 0) {
                const syns = document.createElement("p");
                syns.textContent = `Synonyms: ${meaning.synonyms.join(", ")}`;
                card.appendChild(syns);
            }

            if (entry.phonetics && entry.phonetics.length > 0) {
                entry.phonetics.forEach((phonetic) => {
                    if (phonetic.audio) {
                        const audioBtn = document.createElement("button");
                        audioBtn.classList.add("audio-button");
                        audioBtn.textContent = "🔊 Play Audio";
                        audioBtn.addEventListener("click", () => {
                            const audio = new Audio(phonetic.audio);
                            audio.play();
                        });
                        card.appendChild(audioBtn);
                    }
                });
            }
        });

        resultsSection.appendChild(card);
    });
}
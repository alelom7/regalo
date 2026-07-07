

// Recupero gli elementi delle schermate
const mainScreen = document.getElementById("main-screen");
const bachecaScreen = document.getElementById("bacheca-screen");

// Pulsanti
const btnBacheca = document.getElementById("btn-bacheca");
const btnBackBacheca = document.getElementById("back-from-bacheca");

// 1. Quando premo "Lascia una Dedica", nascondo il menu e mostro la bacheca
btnBacheca.addEventListener("click", function() {
    mainScreen.classList.add("hidden");
    bachecaScreen.classList.remove("hidden");
});

// 2. Quando premo "Torna al Menu", nascondo la bacheca e rimostro il menu
btnBackBacheca.addEventListener("click", function() {
    bachecaScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
});

// 3. Quando premo "Galleria", nascondo il menu e mostro la galleria
const galleriaScreen = document.getElementById("galleria-screen");
const btnGalleria = document.getElementById("btn-galleria");
const btnBackGalleria = document.getElementById("back-from-galleria");
btnGalleria.addEventListener("click", function() {
    mainScreen.classList.add("hidden");
    galleriaScreen.classList.remove("hidden");
});

// 4. Quando premo "Torna al Menu", nascondo la galleria e rimostro il menu
btnBackGalleria.addEventListener("click", function() {
    galleriaScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
});

//5. Quando premo "Rivivi il nostro viaggio", nascondo il menu e mostro la galleria
const storiaScreen = document.getElementById("storia-screen");
const btnStoria = document.getElementById("btn-quiz");
const btnBackStoria = document.getElementById("back-from-storia");
btnStoria.addEventListener("click", function() {
    mainScreen.classList.add("hidden");
    storiaScreen.classList.remove("hidden");
}); 
//quando premo "Torna al Menu", nascondo la galleria e rimostro il menu
btnBackStoria.addEventListener("click", function() {
    storiaScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
});

// Gestione Schermata Cruciverba
const cruciverbaScreen = document.getElementById("cruciverba-screen");
const btnCruciverba = document.getElementById("btn-cruciverba");
const btnBackCruciverba = document.getElementById("back-from-cruciverba");

// Apro il cruciverba
btnCruciverba.addEventListener("click", function() {
    mainScreen.classList.add("hidden");
    cruciverbaScreen.classList.remove("hidden");
});

// Torno al menu
btnBackCruciverba.addEventListener("click", function() {
    cruciverbaScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");
});

// IL MOTORE DEL GIOCO
document.getElementById("check-cruciverba").addEventListener("click", function() {
    // 1. Prendo tutte le caselle della pagina
    const celle = document.querySelectorAll(".cell");
    let tutteCorrette = true;

    // 2. Controllo ogni singola casella una per una (ciclo)
    celle.forEach(function(cella) {
        // Prendo la lettera inserita dall'utente e la trasformo in maiuscolo
        const letteraInserita = cella.value.toUpperCase();
        // Prendo la risposta esatta che avevamo nascosto nell'HTML
        const letteraEsatta = cella.dataset.answer.toUpperCase();

        // 3. Faccio il paragone
        if (letteraInserita === letteraEsatta) {
            cella.classList.add("corretto");
            cella.classList.remove("sbagliato");
        } else {
            cella.classList.add("sbagliato");
            cella.classList.remove("corretto");
            tutteCorrette = false; // Se ne sbaglia anche solo una, il gioco non è finito
        }
    });

    // 4. Messaggio finale
    const messaggio = document.getElementById("risultato-cruciverba");
    if (tutteCorrette) {
        messaggio.innerText = "🎉 Complimenti! Risposta Esatta!";
        messaggio.style.color = "green";
    } else {
        messaggio.innerText = "❌ Mmh, c'è qualche errore. Riprova!";
        messaggio.style.color = "red";
    }

});

// ==========================================
// AUTOFOCUS CRUCIVERBA (Salto caselle)
// ==========================================

// Prendo tutte le caselle (creando una struttura indicizzata simile a un array)
const tutteLeCelle = document.querySelectorAll(".cell");

// Scorro l'array elemento per elemento, tenendo traccia dell'indice attuale
tutteLeCelle.forEach(function(cellaAttuale, indice) {
    
    // 1. Quando l'utente inserisce un carattere
    cellaAttuale.addEventListener("input", function() {
        // Se la cella è piena (ha 1 carattere) e non siamo all'ultima casella dell'array
        if (cellaAttuale.value.length === 1 && indice + 1 < tutteLeCelle.length) {
            // Sposta il cursore (focus) all'indice successivo
            tutteLeCelle[indice + 1].focus();
        }
    });

    // 2. Quando l'utente preme il tasto Cancella (Backspace)
    cellaAttuale.addEventListener("keydown", function(evento) {
        // Se il tasto premuto è Backspace, la cella attuale è vuota e non siamo alla prima casella (indice 0)
        if (evento.key === "Backspace" && cellaAttuale.value === "" && indice - 1 >= 0) {
            // Sposta il cursore (focus) all'indice precedente
            tutteLeCelle[indice - 1].focus();
        }
    });
});
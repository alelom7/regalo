// 1. Imposta la data della laurea (Anno, Mese - 1, Giorno, Ora, Minuti, Secondi)
// Attenzione: in JavaScript i mesi partono da 0 (0 = Gennaio, 5 = Giugno, 6 = Luglio, ecc.)
const dataLaurea = new Date(2026, 10, 27, 0, 0, 0).getTime();
// 2. Aggiorna il conteggio alla rovescia ogni secondo (1000 millisecondi)
const timer = setInterval(function() {

    // Prendi l'ora esatta di questo istante
    const adesso = new Date().getTime();
    
    // Calcola la differenza in millisecondi tra la scadenza e adesso
    const distanza = dataLaurea - adesso;
    
    // Conversioni matematiche per ottenere i singoli intervalli di tempo
    const giorni = Math.floor(distanza / (1000 * 60 * 60 * 24));
    const ore = Math.floor((distanza % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minuti = Math.floor((distanza % (1000 * 60 * 60)) / (1000 * 60));
    const secondi = Math.floor((distanza % (1000 * 60)) / 1000);
    
    // Recupera l'elemento HTML dove mostrare il testo
    const elementoCountdown = document.getElementById("countdown");
    
    // 3. Gestione dell'output sul browser
    if (distanza > 0) {
        // Se manca ancora tempo, stampa i giorni, le ore, i minuti e i secondi
        elementoCountdown.innerHTML = giorni + "g " + ore + "o " + minuti + "m " + secondi + "s ";
    } else {
        // Se il tempo è scaduto, ferma l'intervallo e mostra il messaggio di sblocco
        clearInterval(timer);
        elementoCountdown.innerHTML = "Il grande giorno è arrivato! 🎉";
        
        // Nota: Qui inseriremo in seguito la funzione per far comparire i giochi e le foto
    }
}, 1000);
// Gestione del cambio schermata al clic del pulsante
document.getElementById("enter-btn").addEventListener("click", function() {
    // 1. Seleziona le due schermate
    const landingScreen = document.getElementById("landing-screen");
    const mainScreen = document.getElementById("main-screen");

    // 2. Aggiunge la classe hidden alla prima per nasconderla
    landingScreen.classList.add("hidden");

    // 3. Rimuove la classe hidden dalla seconda per mostrarla sullo schermo
    mainScreen.classList.remove("hidden");
});

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
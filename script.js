// 1. Imposta la data della laurea (Anno, Mese - 1, Giorno, Ora, Minuti, Secondi)
// Attenzione: in JavaScript i mesi partono da 0 (0 = Gennaio, 5 = Giugno, 6 = Luglio, ecc.)
const dataLaurea = new Date(2026, 6, 15, 11, 0, 0).getTime();

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
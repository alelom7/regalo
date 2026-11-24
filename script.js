// Recupero gli elementi delle schermate
const mainScreen = document.getElementById("main-screen");
const bachecaScreen = document.getElementById("bacheca-screen");
const galleriaScreen = document.getElementById("galleria-screen");
const cruciverbaScreen = document.getElementById("cruciverba-screen");
const top10Screen = document.getElementById("top10-screen");
const avantiUnAltroScreen = document.getElementById("avanti-un-altro-screen");


// Funzione helper per il cambio schermata fluido su mobile e desktop
function mostraSchermata(schermataDaMostrare) {
    [mainScreen, bachecaScreen, galleriaScreen, cruciverbaScreen, top10Screen, avantiUnAltroScreen].forEach(function(s) {
        if (s) s.classList.add("hidden");
    });
    if (schermataDaMostrare) {
        schermataDaMostrare.classList.remove("hidden");
        window.scrollTo(0, 0); // Riporta in cima alla pagina su mobile
    }
}

function tornaAlMenu() {
    fermaTimerAvanti();
    if (typeof chiudiLightbox === "function") chiudiLightbox();
    mostraSchermata(mainScreen);
}

// 1. Bacheca Pubblica
const btnBacheca = document.getElementById("btn-bacheca");
const btnBackBacheca = document.getElementById("back-from-bacheca");
if (btnBacheca) btnBacheca.addEventListener("click", () => mostraSchermata(bachecaScreen));
if (btnBackBacheca) btnBackBacheca.addEventListener("click", tornaAlMenu);

// 2. Galleria Fotografica
const btnGalleria = document.getElementById("btn-galleria");
const btnBackGalleria = document.getElementById("back-from-galleria");
if (btnGalleria) btnGalleria.addEventListener("click", () => {
    mostraSchermata(galleriaScreen);
    if (typeof inizializzaGalleria === "function") inizializzaGalleria();
});
if (btnBackGalleria) btnBackGalleria.addEventListener("click", tornaAlMenu);

// 3. Cruciverba
const btnCruciverba = document.getElementById("btn-cruciverba");
const btnBackCruciverba = document.getElementById("back-from-cruciverba");
if (btnCruciverba) btnCruciverba.addEventListener("click", () => {
    mostraSchermata(cruciverbaScreen);
    impostaParolaAttiva(1, false);
});
if (btnBackCruciverba) btnBackCruciverba.addEventListener("click", tornaAlMenu);

//Avanti un altro
const btnAvantiUnAltro = document.getElementById("btn-avanti-un-altro");
const btnBackAvantiUnAltro = document.getElementById("back-from-avanti-un-altro");
if (btnAvantiUnAltro) btnAvantiUnAltro.addEventListener("click", () => { mostraSchermata(avantiUnAltroScreen); mostraIntroAvantiUnAltro(); });
if (btnBackAvantiUnAltro) btnBackAvantiUnAltro.addEventListener("click", tornaAlMenu);

//Top 10
const btnTop10 = document.getElementById("btn-top10");
const btnBackTop10 = document.getElementById("back-from-top10");
// Top10 click handled in top10 section below
if (btnBackTop10) btnBackTop10.addEventListener("click", tornaAlMenu);


// ==========================================
// IL MOTORE DEL CRUCIVERBA (Verifica per singola parola)
// ==========================================

function controllaRiga(rigaEl) {
    // Chiude la tastiera virtuale dello smartphone se aperta
    if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
    }

    const celle = rigaEl.querySelectorAll(".cell");
    const btn = rigaEl.querySelector(".btn-check-riga");
    const status = rigaEl.querySelector(".riga-status");
    let rigaCorretta = true;
    let rigaVuota = true;

    celle.forEach(function(cella) {
        const letteraInserita = cella.value.trim().toUpperCase();
        const letteraEsatta = (cella.dataset.answer || "").trim().toUpperCase();

        if (letteraInserita !== "") {
            rigaVuota = false;
        }

        if (letteraInserita === letteraEsatta) {
            cella.classList.add("corretto");
            cella.classList.remove("sbagliato");
        } else {
            cella.classList.add("sbagliato");
            cella.classList.remove("corretto");
            rigaCorretta = false;
        }
    });

    if (rigaVuota) {
        if (status) status.innerText = "";
        return false;
    }

    if (rigaCorretta) {
        if (btn) {
            btn.innerText = "✓ Esatta!";
            btn.classList.add("parola-esatta");
        }
        if (status) {
            status.innerText = "✨";
        }
        // Segna la pillola in cima come risolta
        const numRiga = rigaEl.dataset.row;
        const pillRisolta = document.querySelector(`.indizio-pill[data-target-row="${numRiga}"]`);
        if (pillRisolta) {
            pillRisolta.classList.add("risolta");
            pillRisolta.innerHTML = `${numRiga} ✓`;
        }
    } else {
        if (btn) {
            btn.innerText = "Riprova";
            btn.classList.remove("parola-esatta");
        }
        if (status) {
            status.innerText = "❌";
        }
    }

    // Controlliamo se tutte le 5 parole sono state completate
    controllaVittoriaTotale();
    return rigaCorretta;
}

function controllaVittoriaTotale() {
    const tutteLeRighe = document.querySelectorAll(".cruciverba-riga");
    let tutteVinte = true;

    tutteLeRighe.forEach(function(riga) {
        const celle = riga.querySelectorAll(".cell");
        celle.forEach(function(cella) {
            if (cella.value.trim().toUpperCase() !== (cella.dataset.answer || "").trim().toUpperCase()) {
                tutteVinte = false;
            }
        });
    });

    const messaggio = document.getElementById("risultato-cruciverba");
    if (tutteVinte && messaggio) {
        messaggio.innerText = "🎉 Complimenti! Hai completato tutto il cruciverba!";
        messaggio.style.color = "#205c2a";

        // Pioggia di coriandoli festosi
        if (typeof confetti === "function") {
            confetti({
                particleCount: 100,
                spread: 75,
                origin: { y: 0.6 }
            });
            setTimeout(function() {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0.1, y: 0.6 }
                });
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 0.9, y: 0.6 }
                });
            }, 250);
        }
    }
}

// Assegno il click a ciascun pulsante Verifica di ogni parola
document.querySelectorAll(".btn-check-riga").forEach(function(btn) {
    btn.addEventListener("click", function() {
        const riga = btn.closest(".cruciverba-riga");
        if (riga) {
            controllaRiga(riga);
        }
    });
});


// ==========================================
// GESTIONE INDIZI INTERATTIVI & CRUCIVERBA COMPATTO (Mobile & Desktop)
// ==========================================

const elencoDomandeCruciverba = [
    { num: 1, testo: "1. È il nostro brindisi più speciale, ormai diventato tradizionale: dopo cuore e sesso con tanto trasporto, qual è il terzo augurio che porta conforto?" },
    { num: 2, testo: "2. Un linguaggio segreto fatto di segni e astrazione, che portò entrambe sull'orlo della disperazione: tra bilanci e mercati era l'intrusa spietata, la prova maledetta sempre rimandata." },
    { num: 3, testo: "3. Abitante dei boschi dal potere incantato, ma in centro a Parma rubò la scena al locale affollato: Babbetta ne vestì le sembianze alate, finendo su whatsapp tra mille risate. Cosa era?" },
    { num: 4, testo: "4. Accessorio poco glamour per la notte scatenata, ma vitale per Babbetta nella stagione gelata: un piccolo quadrato morbido e discreto, che salvava i suoi occhi da quel vento indiscreto." },
    { num: 5, testo: "5. Il primo anno aveva un appuntamento fisso, tra balli, risate e qualche tipo mai visto: tra personaggi strani e storie da raccontare, quale locale ci faceva sempre ritornare?" },
    { num: 6, testo: "6. Un cane tanto sognato da me e Babbetta con passione, ma Vale poneva sempre una condizione: se mai fosse arrivato quel cagnolino speciale, quale nome doveva avere per essere ufficiale?" },
    { num: 7, testo: "7. Visti dal vivo in una pista dal nome celeste, con quel motivetto a farci girare le teste, ricordiamo quei giorni d’oro: che nome ci davamo, essendo fan di loro?" },
    { num: 8, testo: "8. Non eran gatti né animali lontane, ma come chiamavamo le nostre birmane?" },
    { num: 9, testo: "9. Tra un pranzo, un festino e un bicchiere di vino, è nato per caso il nostro destino. Un nome inventato così per scherzare, ma ormai è un marchio che non può cambiare: qual è?" },
    { num: 10, testo: "10. Porta il nome di una terra antica e lontana, ma per Babbetta è una dolce ossessione quotidiana: dopo ogni pasto la pretende a gran voce, per chiudere il pranzetto in modo sano e veloce." },
    { num: 11, testo: "11. Sembra innocuo, dolce e quasi infantile ma con la vodka diventa un tranello sottile: in un giovedì fu la sua rovina, facendo barcollare la povera Valentina." }
];

let parolaCruciverbaAttiva = 1;

function ottieniTestoIndizio(num) {
    const numInt = parseInt(num, 10);
    const itemDomanda = document.querySelector(`.domanda-item[data-row="${numInt}"]`);
    if (itemDomanda) {
        const testoEl = itemDomanda.querySelector(".domanda-testo");
        if (testoEl) {
            return `${numInt}. ${testoEl.innerText.trim()}`;
        }
        return itemDomanda.innerText.trim();
    }
    const item = elencoDomandeCruciverba.find(d => d.num === numInt);
    return item ? item.testo : "";
}

function impostaParolaAttiva(num, focusCell = false) {
    parolaCruciverbaAttiva = parseInt(num, 10);
    const totRighe = document.querySelectorAll(".cruciverba-riga").length || 11;

    // 1. Aggiorna Banner attivo in alto
    const bannerNum = document.getElementById("banner-num");
    const bannerTesto = document.getElementById("banner-testo-indizio");
    const bannerTot = document.getElementById("banner-tot");
    if (bannerNum) bannerNum.innerText = parolaCruciverbaAttiva;
    if (bannerTot) bannerTot.innerText = totRighe;
    if (bannerTesto) {
        const testoIndizio = ottieniTestoIndizio(parolaCruciverbaAttiva);
        if (testoIndizio) {
            bannerTesto.style.opacity = "0.3";
            setTimeout(() => {
                bannerTesto.innerText = testoIndizio;
                bannerTesto.style.opacity = "1";
            }, 120);
        }
    }

    // 2. Aggiorna stato pillole
    document.querySelectorAll(".indizio-pill").forEach(p => {
        p.classList.toggle("attiva", parseInt(p.dataset.targetRow, 10) === parolaCruciverbaAttiva);
    });

    // 3. Evidenzia la riga corrispondente nella griglia
    document.querySelectorAll(".cruciverba-riga").forEach(r => {
        const isCurrent = parseInt(r.dataset.row, 10) === parolaCruciverbaAttiva;
        r.classList.toggle("riga-attiva", isCurrent);
    });

    // 4. Evidenzia la domanda nelle colonne laterali (sia a sinistra che a destra)
    document.querySelectorAll(".domanda-item").forEach(item => {
        const isCurrent = parseInt(item.dataset.row, 10) === parolaCruciverbaAttiva;
        item.classList.toggle("attiva", isCurrent);
    });

    // 5. Se richiesto, porta il cursore nella prima cella vuota
    if (focusCell) {
        const rigaEl = document.querySelector(`.cruciverba-riga[data-row="${parolaCruciverbaAttiva}"]`);
        if (rigaEl) {
            const celle = Array.from(rigaEl.querySelectorAll(".cell"));
            let cellaBersaglio = celle.find(c => c.value.trim() === "");
            if (!cellaBersaglio && celle.length > 0) cellaBersaglio = celle[0];
            if (cellaBersaglio) {
                cellaBersaglio.focus();
                cellaBersaglio.select();
            }
        }
    }
}

// Click sulle pillole numeriche in alto
document.querySelectorAll(".indizio-pill").forEach(pill => {
    pill.addEventListener("click", function() {
        const targetRow = this.dataset.targetRow;
        impostaParolaAttiva(targetRow, true);
    });
});

// Frecce precedente / successivo nel banner
const btnPrevIndizio = document.getElementById("btn-prev-indizio");
const btnNextIndizio = document.getElementById("btn-next-indizio");

if (btnPrevIndizio) {
    btnPrevIndizio.addEventListener("click", function() {
        const tot = document.querySelectorAll(".cruciverba-riga").length || 11;
        let prev = parolaCruciverbaAttiva - 1;
        if (prev < 1) prev = tot;
        impostaParolaAttiva(prev, true);
    });
}

if (btnNextIndizio) {
    btnNextIndizio.addEventListener("click", function() {
        const tot = document.querySelectorAll(".cruciverba-riga").length || 11;
        let next = parolaCruciverbaAttiva + 1;
        if (next > tot) next = 1;
        impostaParolaAttiva(next, true);
    });
}

// Toggle per mostrare / nascondere tutti gli indizi (su mobile)
const btnToggleTutte = document.getElementById("btn-toggle-tutte-domande");
const layoutBox = document.getElementById("cruciverba-layout-box");

if (btnToggleTutte && layoutBox) {
    btnToggleTutte.addEventListener("click", function() {
        layoutBox.classList.toggle("mostra-tutti-indizi");
        if (layoutBox.classList.contains("mostra-tutti-indizi")) {
            btnToggleTutte.innerText = "Nascondi tutti gli indizi ▴";
        } else {
            btnToggleTutte.innerText = "Mostra tutti gli indizi ▾";
        }
    });
}

// Click sugli indizi (sia a sinistra che a destra)
document.querySelectorAll(".domanda-item").forEach(item => {
    item.addEventListener("click", function() {
        const row = this.dataset.row;
        if (row) impostaParolaAttiva(row, true);
    });
});

// ==========================================
// AUTOFOCUS & DIGITAZIONE CRUCIVERBA (Mobile & Desktop)
// ==========================================

const tutteLeRigheCruciverba = document.querySelectorAll(".cruciverba-riga");

tutteLeRigheCruciverba.forEach(function(riga) {
    const celleDellaRiga = Array.from(riga.querySelectorAll(".cell"));

    // Tap su qualsiasi punto della riga la attiva
    riga.addEventListener("click", function(e) {
        if (!e.target.classList.contains("btn-check-riga")) {
            impostaParolaAttiva(riga.dataset.row, false);
        }
    });

    celleDellaRiga.forEach(function(cellaAttuale, indiceNellaRiga) {
        
        // 1. Quando la cella riceve il focus (tap su smartphone o click), seleziona il testo esistente
        // ed attiva la parola nel banner
        cellaAttuale.addEventListener("focus", function() {
            cellaAttuale.select();
            if (riga.dataset.row) {
                impostaParolaAttiva(riga.dataset.row, false);
            }
        });

        // 2. Quando l'utente inserisce un carattere
        cellaAttuale.addEventListener("input", function() {
            cellaAttuale.classList.remove("sbagliato");
            cellaAttuale.classList.remove("corretto");

            const btnRiga = riga.querySelector(".btn-check-riga");
            const statusRiga = riga.querySelector(".riga-status");
            if (btnRiga && btnRiga.classList.contains("parola-esatta")) {
                btnRiga.classList.remove("parola-esatta");
                btnRiga.innerText = "Verifica";
                if (statusRiga) statusRiga.innerText = "";
            }

            // Garantisce sempre il maiuscolo e prende l'ultimo carattere inserito
            const rawVal = cellaAttuale.value.trim().toUpperCase();
            if (rawVal.length > 0) {
                cellaAttuale.value = rawVal.charAt(rawVal.length - 1);
            } else {
                cellaAttuale.value = "";
            }

            // Se è stata digitata una lettera, avanza alla cella successiva della STESSA riga
            if (cellaAttuale.value.length === 1) {
                if (indiceNellaRiga + 1 < celleDellaRiga.length) {
                    const cellaSucc = celleDellaRiga[indiceNellaRiga + 1];
                    cellaSucc.focus();
                    cellaSucc.select();
                }
            }
        });

        // 3. Tasti speciali (Backspace e Invio)
        cellaAttuale.addEventListener("keydown", function(evento) {
            // Se preme Invio, verifica la parola corrente e chiude la tastiera
            if (evento.key === "Enter") {
                evento.preventDefault();
                cellaAttuale.blur();
                controllaRiga(riga);
                return;
            }

            // Se preme Backspace ed è vuota, torna indietro alla casella precedente della stessa riga e la svuota
            if (evento.key === "Backspace" && cellaAttuale.value === "" && indiceNellaRiga > 0) {
                evento.preventDefault();
                const cellaPrec = celleDellaRiga[indiceNellaRiga - 1];
                cellaPrec.focus();
                cellaPrec.value = "";
            }
        });
    });
});

// ==========================================
// SCROLL REVEAL (Comparsa morbida della Timeline)
// ==========================================
if ("IntersectionObserver" in window) {
    const observerCard = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visibile");
                observerCard.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08
    });

    document.querySelectorAll(".glass-card, .magazine-item, .timeline-item, .card-ricordo").forEach(function(el) {
        observerCard.observe(el);
    });
} else {
    document.querySelectorAll(".glass-card, .magazine-item, .timeline-item, .card-ricordo").forEach(function(el) {
        el.classList.add("visibile");
    });
}

// ==========================================
// GIOCO: AVANTI UN ALTRO (LA SCALATA)
// ==========================================

// Puoi modificare, aggiungere o rimuovere liberamente le domande qui sotto!
// Per ogni domanda indica il testo e le 2 opzioni (una con corretta: true e una con corretta: false)
const domandeAvantiUnAltro = [
    {
        domanda: "2 o 3, quante erano le birmane che invadevano la nostra casa?",
        opzioni: [
            { testo: "2", corretta: true },
            { testo: "3", corretta: false }
        ]
    },
    {
        domanda: "Sara o Antonella, chi delle due è caduta ubriaca davanti a un poliziotto?",
        opzioni: [
            { testo: "Sara", corretta: true },
            { testo: "Antonella", corretta: false }
        ]
    },
    {
        domanda: "Il polpo o il delfino, quale di questi animali ha tre cuori?",
        opzioni: [
            { testo: "Il delfino", corretta: true },
            { testo: "Il polpo", corretta: false }
        ]
    },
    {
        domanda: "Mercoledì o giovedì, se oggi è martedì tra 8 giorni sarà... ",
        opzioni: [
            { testo: "Giovedì", corretta: true },
            { testo: "Mercoledì", corretta: false }
        ]
    },
    {
        domanda: "Una perdita o un utile, se i ricavi sono inferiori ai costi, l'impresa registra...",
        opzioni: [
            { testo: "Un utile", corretta: true },
            { testo: "Una perdita", corretta: false }
        ]
    },
    {
        domanda: "Cristian o Babbetta, chi dei due finge di essere un supereroe?",
        opzioni: [
            { testo: "Cristian", corretta: true },
            { testo: "Babbetta", corretta: false }
        ]
    },
    {
        domanda: "Maledette o Benedette, qual è l'aggettivo più usato da mamma Vittoria?",
        opzioni: [
            { testo: "Benedette", corretta: true },
            { testo: "Maledette", corretta: false }
        ]
    },
    {
        domanda: "Carlo Conti o Casper, a chi dei due somiglia Valentina a fine agosto?",
        opzioni: [
            { testo: "Carlo Conti", corretta: false },
            { testo: "Casper", corretta: true }
        ]
    },
    {
        domanda: "Anthony o Ultimo, chi ascolta più spesso Valentina?",
        opzioni: [
            { testo: "Ultimo", corretta: true },
            { testo: "Anthony", corretta: false }
        ]
    },
    {
        domanda: "Un cane o un serpente, quale dei due vorrebbe coccolare Babbetta?",
        opzioni: [
            { testo: "Un cane", corretta: false },
            { testo: "Un serpente", corretta: true }
        ]
    },
    {
        domanda: "Canberra o Sydney, qual è la capitale dell'Australia?",
        opzioni: [
            { testo: "Canberra", corretta: false },
            { testo: "Sydney", corretta: true }    
        ]
    },
    {
        domanda: "Il Nilo o il Congo, qual è il fiume più lungo del mondo?",
        opzioni: [
            { testo: "Il Nilo", corretta: false },
            { testo: "Il Congo", corretta: true }
        ]
    },
    {
        domanda: "Polizia o Finanza, quale dei due ancora non ha bussato alla porta di casa nostra?",
        opzioni: [ 
            { testo: "Polizia", corretta: true },
            { testo: "Finanza", corretta: false }
        ]   
    },
    {
        domanda: "Lunedì o Martedì, quale dei due è a forma di cacca di Nuvola??",
        opzioni: [
            { testo: "Lunedì", corretta: false },
            { testo: "Martedì", corretta: true }
        ]
    },
    {
        domanda: "Una marca o un simbolo matematico, cosa è MiuMiu per Mario?",
        opzioni: [
            { testo: "Una marca", corretta: true },
            { testo: "Un simbolo matematico", corretta: false }
        ]
    },
    {
        domanda: "Christian o Bobo, chi è stato vittima delle pettole?",
        opzioni: [
            { testo: "Christian", corretta: false },
            { testo: "Bobo", corretta: true }
        ]
    },
    {
        domanda: "Cinese o Giapponese, com'è il nostro cuore preferito?",
        opzioni: [
            { testo: "Cinese", corretta: false },
            { testo: "Giapponese", corretta: true }
        ]
    }

];

const TEMPO_TOTALE_AVANTI = 5 * 60; // 5 minuti = 300 secondi
let tempoRimanenteAvanti = TEMPO_TOTALE_AVANTI;
let timerAvantiInterval = null;
let indiceDomandaAvanti = 0;
let bloccoClickAvanti = false;

const avantiIntroBox = document.getElementById("avanti-intro-box");
const avantiGiocoBox = document.getElementById("avanti-gioco-box");
const avantiVittoriaBox = document.getElementById("avanti-vittoria-box");
const avantiPersoBox = document.getElementById("avanti-perso-box");

const avantiDomandaTesto = document.getElementById("avanti-domanda-testo");
const avantiStepText = document.getElementById("avanti-step-text");
const avantiProgressBar = document.getElementById("avanti-progress-bar");
const avantiFeedbackMsg = document.getElementById("avanti-feedback-msg");
const avantiBtn0 = document.getElementById("avanti-btn-0");
const avantiBtn1 = document.getElementById("avanti-btn-1");

const avantiTimerPill = document.getElementById("avanti-timer-pill");
const avantiTimerDisplay = document.getElementById("avanti-timer-display");
const avantiTempoRimastoVittoria = document.getElementById("avanti-tempo-rimasto-vittoria");

const btnStartAvanti = document.getElementById("btn-start-avanti");
const btnRestartAvanti = document.getElementById("btn-restart-avanti");
const btnRetryAvanti = document.getElementById("btn-retry-avanti");
const btnMenuFromIntro = document.getElementById("btn-menu-from-intro");
const btnMenuFromAvanti = document.getElementById("btn-menu-from-avanti");
const btnMenuFromPerso = document.getElementById("btn-menu-from-perso");

// ==========================================
// GESTIONE TIMER (5 MINUTI)
// ==========================================

function formattaTempo(secondi) {
    const m = Math.floor(secondi / 60);
    const s = secondi % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

function aggiornaDisplayTimer() {
    if (avantiTimerDisplay) {
        avantiTimerDisplay.innerText = formattaTempo(tempoRimanenteAvanti);
    }
    if (avantiTimerPill) {
        avantiTimerPill.classList.remove("timer-warning", "timer-urgent");
        if (tempoRimanenteAvanti <= 20) {
            avantiTimerPill.classList.add("timer-urgent");
        } else if (tempoRimanenteAvanti <= 60) {
            avantiTimerPill.classList.add("timer-warning");
        }
    }
}

function fermaTimerAvanti() {
    if (timerAvantiInterval) {
        clearInterval(timerAvantiInterval);
        timerAvantiInterval = null;
    }
}

function avviaTimerAvanti() {
    fermaTimerAvanti();
    tempoRimanenteAvanti = TEMPO_TOTALE_AVANTI;
    aggiornaDisplayTimer();
    
    timerAvantiInterval = setInterval(function() {
        tempoRimanenteAvanti--;
        aggiornaDisplayTimer();
        if (tempoRimanenteAvanti <= 0) {
            fermaTimerAvanti();
            mostraSconfittaAvanti();
        }
    }, 1000);
}

// ==========================================
// CAMBIO SCHERMATE AVANTI UN ALTRO
// ==========================================

function mostraIntroAvantiUnAltro() {
    fermaTimerAvanti();
    if (avantiIntroBox) avantiIntroBox.classList.remove("hidden");
    if (avantiGiocoBox) avantiGiocoBox.classList.add("hidden");
    if (avantiVittoriaBox) avantiVittoriaBox.classList.add("hidden");
    if (avantiPersoBox) avantiPersoBox.classList.add("hidden");
}

function iniziaGiocoAvantiUnAltro() {
    indiceDomandaAvanti = 0;
    if (avantiIntroBox) avantiIntroBox.classList.add("hidden");
    if (avantiGiocoBox) avantiGiocoBox.classList.remove("hidden");
    if (avantiVittoriaBox) avantiVittoriaBox.classList.add("hidden");
    if (avantiPersoBox) avantiPersoBox.classList.add("hidden");
    avviaTimerAvanti();
    caricaDomandaAvanti();
}

function mostraVittoriaAvanti() {
    fermaTimerAvanti();
    if (avantiIntroBox) avantiIntroBox.classList.add("hidden");
    if (avantiGiocoBox) avantiGiocoBox.classList.add("hidden");
    if (avantiVittoriaBox) avantiVittoriaBox.classList.remove("hidden");
    if (avantiPersoBox) avantiPersoBox.classList.add("hidden");

    if (avantiTempoRimastoVittoria) {
        avantiTempoRimastoVittoria.innerText = formattaTempo(tempoRimanenteAvanti);
    }

    // Pioggia di coriandoli festosi
    if (typeof confetti === "function") {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
        });
        setTimeout(function() {
            confetti({
                particleCount: 70,
                angle: 60,
                spread: 60,
                origin: { x: 0.15, y: 0.65 }
            });
            confetti({
                particleCount: 70,
                angle: 120,
                spread: 60,
                origin: { x: 0.85, y: 0.65 }
            });
        }, 300);
    }
}

function mostraSconfittaAvanti() {
    fermaTimerAvanti();
    if (avantiIntroBox) avantiIntroBox.classList.add("hidden");
    if (avantiGiocoBox) avantiGiocoBox.classList.add("hidden");
    if (avantiVittoriaBox) avantiVittoriaBox.classList.add("hidden");
    if (avantiPersoBox) avantiPersoBox.classList.remove("hidden");
}

// ==========================================
// LOGICA DI GIOCO & TRANSIZIONI ULTRA-RAPIDE
// ==========================================

function caricaDomandaAvanti() {
    bloccoClickAvanti = false;

    if (!avantiDomandaTesto || !avantiBtn0 || !avantiBtn1) return;

    if (avantiFeedbackMsg) {
        avantiFeedbackMsg.innerText = "";
        avantiFeedbackMsg.className = "avanti-feedback";
    }

    [avantiBtn0, avantiBtn1].forEach(function(b) {
        b.className = "avanti-btn-risposta";
        b.disabled = false;
    });

    if (avantiGiocoBox) avantiGiocoBox.classList.remove("card-shake");

    const totaleDomande = domandeAvantiUnAltro.length;
    const q = domandeAvantiUnAltro[indiceDomandaAvanti];

    if (avantiStepText) {
        avantiStepText.innerText = "Domanda " + (indiceDomandaAvanti + 1) + " di " + totaleDomande;
    }

    if (avantiProgressBar) {
        const perc = (indiceDomandaAvanti / totaleDomande) * 100;
        avantiProgressBar.style.width = perc + "%";
    }

    avantiDomandaTesto.innerText = q.domanda;

    // Mescola casualmente l'ordine delle 2 opzioni
    const opzioni = Math.random() < 0.5 
        ? [q.opzioni[0], q.opzioni[1]] 
        : [q.opzioni[1], q.opzioni[0]];

    avantiBtn0.innerText = opzioni[0].testo;
    avantiBtn0.dataset.corretta = opzioni[0].corretta ? "true" : "false";

    avantiBtn1.innerText = opzioni[1].testo;
    avantiBtn1.dataset.corretta = opzioni[1].corretta ? "true" : "false";
}

function gestisciSceltaAvanti(btnCliccato) {
    if (bloccoClickAvanti) return;
    bloccoClickAvanti = true;

    const eCorretta = btnCliccato.dataset.corretta === "true";

    avantiBtn0.disabled = true;
    avantiBtn1.disabled = true;

    if (eCorretta) {
        btnCliccato.classList.add("corretta");
        if (avantiFeedbackMsg) {
            avantiFeedbackMsg.innerText = "✨ Esatto! Avanti!";
            avantiFeedbackMsg.className = "avanti-feedback msg-corretto";
        }

        const totaleDomande = domandeAvantiUnAltro.length;
        if (indiceDomandaAvanti + 1 < totaleDomande) {
            indiceDomandaAvanti++;
            // Transizione ultra rapida ed energica: 180ms invece dei vecchi 600ms!
            setTimeout(function() {
                caricaDomandaAvanti();
            }, 180);
        } else {
            // Vittoria totale entro il tempo limite!
            if (avantiProgressBar) avantiProgressBar.style.width = "100%";
            setTimeout(function() {
                mostraVittoriaAvanti();
            }, 220);
        }
    } else {
        // Errore: si illumina di rosso, trema e resetta subito alla domanda 1!
        btnCliccato.classList.add("sbagliata");
        if (avantiGiocoBox) avantiGiocoBox.classList.add("card-shake");

        if (avantiFeedbackMsg) {
            avantiFeedbackMsg.innerText = "💥 Risposta errata! Si torna alla domanda 1!";
            avantiFeedbackMsg.className = "avanti-feedback msg-sbagliato";
        }

        // Transizione rapida al reset: 420ms invece dei vecchi 1000ms!
        setTimeout(function() {
            indiceDomandaAvanti = 0;
            caricaDomandaAvanti();
        }, 420);
    }
}

// Event Listeners di Gioco
if (avantiBtn0) {
    avantiBtn0.addEventListener("click", function() {
        gestisciSceltaAvanti(avantiBtn0);
    });
}
if (avantiBtn1) {
    avantiBtn1.addEventListener("click", function() {
        gestisciSceltaAvanti(avantiBtn1);
    });
}

// Pulsanti Start / Rigioca
if (btnStartAvanti) {
    btnStartAvanti.addEventListener("click", iniziaGiocoAvantiUnAltro);
}
if (btnRestartAvanti) {
    btnRestartAvanti.addEventListener("click", iniziaGiocoAvantiUnAltro);
}
if (btnRetryAvanti) {
    btnRetryAvanti.addEventListener("click", iniziaGiocoAvantiUnAltro);
}

// Pulsanti Ritorno al Menu
if (btnMenuFromIntro) {
    btnMenuFromIntro.addEventListener("click", tornaAlMenu);
}
if (btnMenuFromAvanti) {
    btnMenuFromAvanti.addEventListener("click", tornaAlMenu);
}
if (btnMenuFromPerso) {
    btnMenuFromPerso.addEventListener("click", tornaAlMenu);
}


// ==========================================
// GIOCO: TOP 10 (MOMENTI ICONICI DRAG & DROP)
// ==========================================

const momentiTop10 = [
    { id: "m1", titolo: "mmm", icona: "🦗", desc: "nnnnn" },
    { id: "m2", titolo: "ciao", icona: "☕", desc: "gggg" }
];

// Stato classifica: 10 posizioni (indice 0 = 1° posto, 9 = 10° posto). Contiene l'ID del momento o null.
let slotsTop10 = new Array(10).fill(null);
let idMomentoSelezionato = null; // Per modalità tap/touch su smartphone
let touchDragInfo = null; // Per touch drag su smartphone

const PASSWORD_TOP10 = "babbymerda";
const top10LockBox = document.getElementById("top10-lock-box");
const top10ContentBox = document.getElementById("top10-content-box");
const top10PasswordForm = document.getElementById("top10-password-form");
const top10PasswordInput = document.getElementById("top10-password-input");
const top10PasswordError = document.getElementById("top10-password-error");
const top10TogglePwd = document.getElementById("top10-toggle-pwd");
const btnSubmitTop10Pwd = document.getElementById("btn-submit-top10-pwd");
const btnBackFromTop10Lock = document.getElementById("btn-back-from-top10-lock");

const top10SlotsContainer = document.getElementById("top10-slots-container");
const top10ItemsPool = document.getElementById("top10-items-pool");
const top10CountBadge = document.getElementById("top10-count-badge");
const top10CompleteBox = document.getElementById("top10-complete-box");
const btnResetTop10 = document.getElementById("btn-reset-top10");
const btnRestartTop10 = document.getElementById("btn-restart-top10");
const btnMenuFromTop10 = document.getElementById("btn-menu-from-top10");

function inizializzaTop10() {
    renderizzaTop10();
}

function trovaMomentoPerId(id) {
    return momentiTop10.find(m => m.id === id);
}

function renderizzaTop10() {
    if (!top10SlotsContainer || !top10ItemsPool) return;

    // 1. Renderizza i 10 Slots della Tabella
    top10SlotsContainer.innerHTML = "";
    slotsTop10.forEach((idMomento, index) => {
        const slotEl = document.createElement("div");
        const rankNum = index + 1;
        let podioClass = "";
        if (rankNum === 1) podioClass = "podio-1";
        else if (rankNum === 2) podioClass = "podio-2";
        else if (rankNum === 3) podioClass = "podio-3";

        const isFilled = idMomento !== null;
        const isReadyToPlace = !isFilled && idMomentoSelezionato !== null;

        slotEl.className = `top10-slot ${podioClass} ${isFilled ? "slot-filled" : ""} ${isReadyToPlace ? "slot-ready-to-place" : ""}`;
        slotEl.dataset.slotIndex = index;

        // Badge Posizione
        let rankLabel = rankNum + "°";
        if (rankNum === 1) rankLabel = "🥇 1°";
        else if (rankNum === 2) rankLabel = "🥈 2°";
        else if (rankNum === 3) rankLabel = "🥉 3°";

        const rankBadge = document.createElement("div");
        rankBadge.className = "top10-slot-rank";
        rankBadge.innerText = rankLabel;
        slotEl.appendChild(rankBadge);

        // Corpo dello Slot
        const bodyEl = document.createElement("div");
        bodyEl.className = "top10-slot-body";

        if (idMomento) {
            const momento = trovaMomentoPerId(idMomento);
            if (momento) {
                const itemEl = document.createElement("div");
                itemEl.className = "top10-item";
                itemEl.draggable = true;
                itemEl.dataset.itemId = momento.id;
                itemEl.dataset.fromSlot = index;

                itemEl.innerHTML = `
                    <div class="top10-slot-item-left">
                        <span class="top10-item-icon">${momento.icona}</span>
                        <div class="top10-item-texts">
                            <div class="top10-item-title">${momento.titolo}</div>
                            <div class="top10-item-desc">${momento.desc}</div>
                        </div>
                    </div>
                    <button type="button" class="top10-item-remove-btn" title="Rimuovi dallo slot" data-remove-slot="${index}">×</button>
                `;

                collegaEventiDragItem(itemEl);
                bodyEl.appendChild(itemEl);
            }
        } else {
            if (idMomentoSelezionato) {
                bodyEl.innerHTML = `<span class="top10-slot-empty slot-ready-text">👉 Tocca per il ${rankNum}° posto</span>`;
            } else {
                bodyEl.innerHTML = `<span class="top10-slot-empty">📥 Trascina o tocca per posizionare</span>`;
            }
        }

        slotEl.appendChild(bodyEl);
        collegaEventiDropSlot(slotEl);

        // Click/Tap sullo slot per posizionare l'elemento selezionato
        slotEl.addEventListener("click", function(e) {
            if (e.target.closest(".top10-item-remove-btn")) return;
            if (idMomentoSelezionato) {
                posizionaMomentoInSlot(idMomentoSelezionato, index);
                idMomentoSelezionato = null;
                renderizzaTop10();
            }
        });

        top10SlotsContainer.appendChild(slotEl);
    });

    // 2. Renderizza i Quadratini Disponibili nel Pool
    top10ItemsPool.innerHTML = "";
    const momentiDisponibili = momentiTop10.filter(m => !slotsTop10.includes(m.id));

    if (momentiDisponibili.length === 0) {
        top10ItemsPool.innerHTML = `<div class="top10-pool-empty">🎉 Tutti i 10 momenti sono in classifica!</div>`;
    } else {
        momentiDisponibili.forEach(momento => {
            const itemEl = document.createElement("div");
            const isSelected = idMomentoSelezionato === momento.id;
            itemEl.className = `top10-item ${isSelected ? "selected-for-place" : ""}`;
            itemEl.draggable = true;
            itemEl.dataset.itemId = momento.id;

            itemEl.innerHTML = `
                <span class="top10-item-icon">${momento.icona}</span>
                <span class="top10-item-title">${momento.titolo}</span>
                <span class="top10-item-desc">${momento.desc}</span>
            `;

            collegaEventiDragItem(itemEl);

            // Tap per selezionare / deselezionare
            itemEl.addEventListener("click", function() {
                if (idMomentoSelezionato === momento.id) {
                    idMomentoSelezionato = null;
                } else {
                    idMomentoSelezionato = momento.id;
                }
                renderizzaTop10();
            });

            top10ItemsPool.appendChild(itemEl);
        });
    }

    collegaEventiDropPool(top10ItemsPool);

    // 3. Aggiorna Contatore e Stato Completamento
    const posizionati = slotsTop10.filter(id => id !== null).length;
    if (top10CountBadge) {
        top10CountBadge.innerText = `${posizionati} / 10 Posizionati`;
        if (posizionati === 10) {
            top10CountBadge.classList.add("complete");
        } else {
            top10CountBadge.classList.remove("complete");
        }
    }

    if (top10CompleteBox) {
        if (posizionati === 10) {
            top10CompleteBox.classList.remove("hidden");
            lanciaCoriandoliTop10();
        } else {
            top10CompleteBox.classList.add("hidden");
        }
    }

    // Gestione rimozione con la "x"
    document.querySelectorAll("[data-remove-slot]").forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            const slotIdx = parseInt(btn.dataset.removeSlot, 10);
            slotsTop10[slotIdx] = null;
            renderizzaTop10();
        });
    });
}

function posizionaMomentoInSlot(idMomento, targetSlotIndex) {
    // Se era già in un altro slot, rimuovilo dal vecchio slot
    const oldSlotIndex = slotsTop10.indexOf(idMomento);
    const existingInTarget = slotsTop10[targetSlotIndex];

    if (oldSlotIndex !== -1) {
        // Scambio posizioni se lo slot di destinazione era già occupato
        slotsTop10[oldSlotIndex] = existingInTarget;
    }
    slotsTop10[targetSlotIndex] = idMomento;
}

// ==========================================
// DRAG & DROP HTML5 + TOUCH SUPPORT
// ==========================================

function collegaEventiDragItem(el) {
    el.addEventListener("dragstart", function(e) {
        el.classList.add("is-dragging");
        e.dataTransfer.setData("text/plain", el.dataset.itemId);
        e.dataTransfer.effectAllowed = "move";
    });

    el.addEventListener("dragend", function() {
        el.classList.remove("is-dragging");
        document.querySelectorAll(".slot-drag-over, .pool-drag-over").forEach(node => {
            node.classList.remove("slot-drag-over", "pool-drag-over");
        });
    });

    // Touch Support per Smartphone: distingue scorrimento orizzontale vs trascinamento
    el.addEventListener("touchstart", function(e) {
        if (e.target.closest(".top10-item-remove-btn")) return;
        const touch = e.touches[0];
        const momento = trovaMomentoPerId(el.dataset.itemId);
        if (!momento) return;

        touchDragInfo = {
            itemId: el.dataset.itemId,
            startX: touch.clientX,
            startY: touch.clientY,
            ghostEl: null,
            dragged: false
        };
    }, { passive: true });

    el.addEventListener("touchmove", function(e) {
        if (!touchDragInfo) return;
        const touch = e.touches[0];
        const diffX = Math.abs(touch.clientX - touchDragInfo.startX);
        const diffY = Math.abs(touch.clientY - touchDragInfo.startY);

        // Se il movimento è prevalentemente orizzontale, l'utente sta scorrendo le schede per leggerle!
        // Non bloccare assolutamente lo scorrimento naturale
        if (!touchDragInfo.dragged) {
            if (diffX > diffY) {
                // Lascia scorrere liberamente il carosello a destra/sinistra
                touchDragInfo = null;
                return;
            }

            // Avvia il trascinamento SOLO se il movimento è chiaramente verso il basso (verso la classifica)
            if (diffY > 18 && diffY > diffX * 1.5) {
                touchDragInfo.dragged = true;
                const momento = trovaMomentoPerId(touchDragInfo.itemId);
                const ghost = document.createElement("div");
                ghost.className = "top10-touch-ghost";
                ghost.innerHTML = `<span>${momento.icona}</span> <span>${momento.titolo}</span>`;
                document.body.appendChild(ghost);
                touchDragInfo.ghostEl = ghost;
            }
        }

        if (touchDragInfo && touchDragInfo.dragged && touchDragInfo.ghostEl) {
            e.preventDefault();
            touchDragInfo.ghostEl.style.left = touch.clientX + "px";
            touchDragInfo.ghostEl.style.top = touch.clientY + "px";

            const elemUnder = document.elementFromPoint(touch.clientX, touch.clientY);
            document.querySelectorAll(".slot-drag-over, .pool-drag-over").forEach(n => n.classList.remove("slot-drag-over", "pool-drag-over"));
            if (elemUnder) {
                const targetSlot = elemUnder.closest(".top10-slot");
                if (targetSlot) targetSlot.classList.add("slot-drag-over");
            }
        }
    }, { passive: false });

    el.addEventListener("touchend", function(e) {
        if (!touchDragInfo) return;

        if (touchDragInfo.dragged && touchDragInfo.ghostEl) {
            touchDragInfo.ghostEl.remove();
            const touch = e.changedTouches[0];
            const elemUnder = document.elementFromPoint(touch.clientX, touch.clientY);

            if (elemUnder) {
                const targetSlot = elemUnder.closest(".top10-slot");
                if (targetSlot) {
                    const slotIndex = parseInt(targetSlot.dataset.slotIndex, 10);
                    posizionaMomentoInSlot(touchDragInfo.itemId, slotIndex);
                    renderizzaTop10();
                }
            }
        }

        document.querySelectorAll(".slot-drag-over, .pool-drag-over").forEach(n => n.classList.remove("slot-drag-over", "pool-drag-over"));
        touchDragInfo = null;
    });
}

function collegaEventiDropSlot(slotEl) {
    slotEl.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        slotEl.classList.add("slot-drag-over");
    });

    slotEl.addEventListener("dragleave", function() {
        slotEl.classList.remove("slot-drag-over");
    });

    slotEl.addEventListener("drop", function(e) {
        e.preventDefault();
        slotEl.classList.remove("slot-drag-over");
        const itemId = e.dataTransfer.getData("text/plain");
        if (!itemId) return;

        const targetSlotIndex = parseInt(slotEl.dataset.slotIndex, 10);
        posizionaMomentoInSlot(itemId, targetSlotIndex);
        renderizzaTop10();
    });
}

function collegaEventiDropPool(poolEl) {
    poolEl.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        poolEl.classList.add("pool-drag-over");
    });

    poolEl.addEventListener("dragleave", function() {
        poolEl.classList.remove("pool-drag-over");
    });

    poolEl.addEventListener("drop", function(e) {
        e.preventDefault();
        poolEl.classList.remove("pool-drag-over");
        const itemId = e.dataTransfer.getData("text/plain");
        if (!itemId) return;

        // Se era in uno slot, lo rimuoviamo e torna nel pool
        const slotIdx = slotsTop10.indexOf(itemId);
        if (slotIdx !== -1) {
            slotsTop10[slotIdx] = null;
            renderizzaTop10();
        }
    });
}

function resetClassificaTop10() {
    slotsTop10 = new Array(10).fill(null);
    idMomentoSelezionato = null;
    renderizzaTop10();
}

function lanciaCoriandoliTop10() {
    if (typeof confetti === "function") {
        confetti({
            particleCount: 100,
            spread: 75,
            origin: { y: 0.6 }
        });
        setTimeout(function() {
            confetti({
                particleCount: 60,
                angle: 60,
                spread: 55,
                origin: { x: 0.15, y: 0.65 }
            });
            confetti({
                particleCount: 60,
                angle: 120,
                spread: 55,
                origin: { x: 0.85, y: 0.65 }
            });
        }, 250);
    }
}

// Event Listeners di Navigazione e Reset Top 10
if (btnTop10) {
    btnTop10.addEventListener("click", () => {
        mostraSchermata(top10Screen);
        apriTop10ConPassword();
    });
}
if (btnResetTop10) btnResetTop10.addEventListener("click", resetClassificaTop10);
if (btnRestartTop10) btnRestartTop10.addEventListener("click", resetClassificaTop10);
if (btnMenuFromTop10) btnMenuFromTop10.addEventListener("click", tornaAlMenu);


// ==========================================
// GESTIONE PASSWORD TOP 10 ("babbymerda")
// ==========================================

function apriTop10ConPassword() {
    // Reimposta la schermata di blocco
    if (top10LockBox) top10LockBox.classList.remove("hidden");
    if (top10ContentBox) top10ContentBox.classList.add("hidden");
    if (top10PasswordInput) {
        top10PasswordInput.value = "";
        top10PasswordInput.type = "password";
        setTimeout(() => top10PasswordInput.focus(), 200);
    }
    if (top10PasswordError) top10PasswordError.classList.add("hidden");
    if (top10LockBox) top10LockBox.classList.remove("lock-shake");
}

function verificaPasswordTop10() {
    if (!top10PasswordInput) return;
    const inserita = top10PasswordInput.value.trim().toLowerCase();

    if (inserita === PASSWORD_TOP10.toLowerCase()) {
        // Password corretta! Sblocca la pagina
        if (top10PasswordError) top10PasswordError.classList.add("hidden");
        if (top10LockBox) top10LockBox.classList.add("hidden");
        if (top10ContentBox) top10ContentBox.classList.remove("hidden");
        inizializzaTop10();
    } else {
        // Password errata
        if (top10PasswordError) top10PasswordError.classList.remove("hidden");
        if (top10LockBox) {
            top10LockBox.classList.remove("lock-shake");
            void top10LockBox.offsetWidth; // Trigger reflow per riavviare animazione
            top10LockBox.classList.add("lock-shake");
        }
        top10PasswordInput.select();
    }
}

if (top10PasswordForm) {
    top10PasswordForm.addEventListener("submit", function(e) {
        e.preventDefault();
        verificaPasswordTop10();
    });
}

if (btnSubmitTop10Pwd) {
    btnSubmitTop10Pwd.addEventListener("click", function(e) {
        e.preventDefault();
        verificaPasswordTop10();
    });
}

if (top10TogglePwd && top10PasswordInput) {
    top10TogglePwd.addEventListener("click", function() {
        if (top10PasswordInput.type === "password") {
            top10PasswordInput.type = "text";
            top10TogglePwd.innerText = "🙈";
        } else {
            top10PasswordInput.type = "password";
            top10TogglePwd.innerText = "👁️";
        }
    });
}

if (btnBackFromTop10Lock) {
    btnBackFromTop10Lock.addEventListener("click", tornaAlMenu);
}

// ==========================================================================
// SEZIONE GALLERIA FOTOGRAFICA (SCORRIMENTO, UPLOAD & GESTIONE)
// ==========================================================================

// Elenco foto predefinite caricate dalla cartella assets
const FOTO_PREDEFINITE = [
    {
        id: "predefinita-1",
        src: "assets/cinqueterre.jpeg",
        titolo: "Gita in Liguria",
        isCustom: false
    },
    {
        id: "predefinita-2",
        src: "assets/perletti.jpeg",
        titolo: "Perletti in azione",
        isCustom: false
    },
    {
        id: "predefinita-3",
        src: "assets/paul.jpeg",
        titolo: "noi e Paul",
        isCustom: false
    },
    {
        id: "predefinita-4",
        src: "assets/astro.jpeg",
        titolo: "incontri all'astro",
        isCustom: false
    },
    {
        id: "predefinita-5",
        src: "assets/giove.jpeg",
        titolo: "Le bimbe del giovedrink",
        isCustom: false
    },
    {
        id: "predefinita-6",
        src: "assets/noe.jpeg",
        titolo: "Noe & Vale",
        isCustom: false
    },
    {
        id: "predefinita-7",
        src: "assets/noe2.jpeg",
        titolo: "Noe a Taranto",
        isCustom: false
    },
    {
        id: "predefinita-8",
        src: "assets/ladypizza.jpeg",
        titolo: "Tappa fissa da Lady Pizza",
        isCustom: false
    },
    {
        id: "predefinita-9",
        src: "assets/ttlegirls.mp4",
        titolo: "TTLE Girls",
        tipo: "video",
        isCustom: false
    },
    {
        id: "predefinita-10",
        src: "assets/video2.mp4",
        titolo: "volevamo essere delle dure",
        tipo: "video",
        isCustom: false
    },
];

// Stato della Galleria
let galleriaFoto = [];
let indiceFotoCorrente = 0;
let galleriaInizializzata = false;
let vistaAttivaGalleria = "slider";
let lightboxAperto = false;

// Gestione IndexedDB per il salvataggio persistente delle foto caricate
const CLOUDINARY_CLOUD_NAME = "md77rjws";
const CLOUDINARY_UPLOAD_PRESET = "galleria";
const FIREBASE_DB_URL = "https://galleria-d8e0d-default-rtdb.europe-west1.firebasedatabase.app";

// Legge tutte le foto e i video condivisi da Firebase (visibili a tutti)
async function caricaFotoDaDatabase() {
    try {
        const res = await fetch(`${FIREBASE_DB_URL}/foto_caricate.json`);
        const data = await res.json();
        if (!data) return [];
        return Object.values(data).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    } catch (e) {
        console.error("Errore lettura Firebase:", e);
        return [];
    }
}

// Carica foto o video su Cloudinary e salva i dati su Firebase
async function caricaESalvaMediaCondiviso(file) {
    const isVideo = file.type.startsWith("video/");
    const endpointTipo = isVideo ? "video" : "image";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${endpointTipo}/upload`,
        {
            method: "POST",
            body: formData
        }
    );

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok || !uploadData.secure_url) {
        throw new Error("Upload su Cloudinary fallito");
    }

    const nomePulito = file.name.replace(/\.[^/.]+$/, "");
    const dataOggi = new Date().toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    const nuovoElemento = {
        id: "shared-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        src: uploadData.secure_url,
        titolo: nomePulito,
        sottotitolo: `Caricata il ${dataOggi}`,
        tipo: isVideo ? "video" : "image",
        isCustom: false,
        timestamp: Date.now()
    };

    await fetch(`${FIREBASE_DB_URL}/foto_caricate/${nuovoElemento.id}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuovoElemento)
    });

    return nuovoElemento;
}

// Mostra un messaggio toast temporaneo
let timerToastGalleria = null;
function mostraToastGalleria(messaggio, durata = 3500) {
    const toast = document.getElementById("galleria-toast");
    if (!toast) return;
    toast.textContent = messaggio;
    toast.classList.remove("hidden");
    if (timerToastGalleria) clearTimeout(timerToastGalleria);
    timerToastGalleria = setTimeout(() => {
        toast.classList.add("hidden");
    }, durata);
}

// Inizializza la galleria (carica dati ed eventi)
async function inizializzaGalleria() {
    await ricaricaFotoGalleria();

    if (!galleriaInizializzata) {
        impostaAscoltatoriGalleria();
        galleriaInizializzata = true;
    }
}

// Recupera foto predefinite + foto salvate nel DB
async function ricaricaFotoGalleria() {
    const fotoSalvate = await caricaFotoDaDatabase();
    galleriaFoto = [...FOTO_PREDEFINITE, ...fotoSalvate];
    

    const sliderView = document.getElementById("galleria-slider-view");
    const gridView = document.getElementById("galleria-grid-view");
    const emptyState = document.getElementById("galleria-empty-state");
    const countEl = document.getElementById("thumbnails-count");

    if (countEl) countEl.textContent = galleriaFoto.length;

    if (galleriaFoto.length === 0) {
        if (sliderView) sliderView.classList.add("hidden");
        if (gridView) gridView.classList.add("hidden");
        if (emptyState) emptyState.classList.remove("hidden");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    if (vistaAttivaGalleria === "slider") {
        if (sliderView) sliderView.classList.remove("hidden");
        if (gridView) gridView.classList.add("hidden");
    } else {
        if (sliderView) sliderView.classList.add("hidden");
        if (gridView) gridView.classList.remove("hidden");
    }

    if (indiceFotoCorrente >= galleriaFoto.length) {
        indiceFotoCorrente = galleriaFoto.length - 1;
    }
    if (indiceFotoCorrente < 0) {
        indiceFotoCorrente = 0;
    }

    aggiornaFotoSlider(indiceFotoCorrente);
    renderizzaMiniature();
    renderizzaGriglia();
}

// Mostra la foto attiva nello slider principale
function aggiornaFotoSlider(index, direzioneAnim = null) {
    if (galleriaFoto.length === 0) return;

    indiceFotoCorrente = (index + galleriaFoto.length) % galleriaFoto.length;
    const foto = galleriaFoto[indiceFotoCorrente];

    const imgEl = document.getElementById("slider-active-img");
    let videoEl = document.getElementById("slider-active-video");
    const isVideo = foto.tipo === "video";

    const counterEl = document.getElementById("slider-counter");
    const titoloEl = document.getElementById("slider-foto-titolo");
    const subEl = document.getElementById("slider-foto-sub");
    const btnElimina = document.getElementById("btn-elimina-foto");

    if (imgEl && imgEl.parentElement) {
        if (!videoEl) {
            videoEl = document.createElement("video");
            videoEl.id = "slider-active-video";
            videoEl.controls = true;
            videoEl.playsInline = true;
            videoEl.preload = "metadata";
            videoEl.className = imgEl.className;
            imgEl.parentElement.insertBefore(videoEl, imgEl.nextSibling);
        }

        if (isVideo) {
            imgEl.classList.add("hidden");
            videoEl.classList.remove("hidden");
            videoEl.src = foto.src;
        } else {
            videoEl.pause();
            videoEl.classList.add("hidden");
            imgEl.classList.remove("hidden");

            if (direzioneAnim === "next") {
                imgEl.classList.add("anim-next");
                setTimeout(() => {
                    imgEl.src = foto.src;
                    imgEl.classList.remove("anim-next");
                }, 120);
            } else if (direzioneAnim === "prev") {
                imgEl.classList.add("anim-prev");
                setTimeout(() => {
                    imgEl.src = foto.src;
                    imgEl.classList.remove("anim-prev");
                }, 120);
            } else {
                imgEl.src = foto.src;
            }
        }
    }

    if (counterEl) {
        counterEl.textContent = `Foto ${indiceFotoCorrente + 1} di ${galleriaFoto.length}`;
    }

    if (titoloEl) {
        titoloEl.textContent = foto.titolo || `Foto ${indiceFotoCorrente + 1}`;
    }

    if (subEl) {
        subEl.textContent = foto.sottotitolo || "";
    }

    // Mostra il tasto elimina solo per le foto caricate dall'utente
    if (btnElimina) {
        if (foto.isCustom) {
            btnElimina.classList.remove("hidden");
        } else {
            btnElimina.classList.add("hidden");
        }
    }

    // Aggiorna miniatura attiva e scrolla
    evidenziaMiniatura(indiceFotoCorrente);

    // Se il lightbox è aperto, aggiorna anche la vista a tutto schermo
    if (lightboxAperto) {
        aggiornaFotoLightbox(indiceFotoCorrente);
    }
}

// Scorre alla foto successiva
function fotoSuccessiva() {
    if (galleriaFoto.length <= 1) return;
    aggiornaFotoSlider(indiceFotoCorrente + 1, "next");
}

// Scorre alla foto precedente
function fotoPrecedente() {
    if (galleriaFoto.length <= 1) return;
    aggiornaFotoSlider(indiceFotoCorrente - 1, "prev");
}

// Renderizza il nastro orizzontale di miniature
function renderizzaMiniature() {
    const track = document.getElementById("slider-thumbnails-track");
    if (!track) return;

    track.innerHTML = "";
    galleriaFoto.forEach((foto, i) => {
        const item = document.createElement("div");
        item.className = `thumb-item ${i === indiceFotoCorrente ? "active" : ""}`;
        item.dataset.index = i;
        item.title = foto.titolo || `Foto ${i + 1}`;

        let mediaEl;
        if (foto.tipo === "video") {
            mediaEl = document.createElement("video");
            mediaEl.src = foto.src;
            mediaEl.preload = "metadata";
            mediaEl.muted = true;
            mediaEl.playsInline = true;
        } else {
                mediaEl = document.createElement("img");
                mediaEl.src = foto.src;
                mediaEl.alt = foto.titolo || `Miniatura ${i + 1}`;
                mediaEl.loading = "lazy";
            }

item.appendChild(mediaEl); 
        item.addEventListener("click", () => {
            aggiornaFotoSlider(i);
        });

        track.appendChild(item);
    });
}

// Evidenzia la miniatura attiva e la scrolla al centro
function evidenziaMiniatura(index) {
    const track = document.getElementById("slider-thumbnails-track");
    if (!track) return;

    const items = track.querySelectorAll(".thumb-item");
    items.forEach((item, i) => {
        if (i === index) {
            item.classList.add("active");
            item.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        } else {
            item.classList.remove("active");
        }
    });
}

// Renderizza la vista a griglia di tutte le foto
function renderizzaGriglia() {
    const container = document.getElementById("galleria-grid-container");
    if (!container) return;

    container.innerHTML = "";
    galleriaFoto.forEach((foto, i) => {
        const card = document.createElement("div");
        card.className = "grid-photo-card";
        card.dataset.index = i;

        const mediaHtml = foto.tipo === "video"
            ? `<video src="${foto.src}" preload="metadata" muted playsinline></video>`
            : `<img src="${foto.src}" alt="${foto.titolo || 'Foto'}" loading="lazy">`;

        card.innerHTML = `
            <div class="grid-photo-img-wrap">
                ${mediaHtml}
            </div>
            <div class="grid-photo-info">
                <h4 class="grid-photo-title">${foto.titolo || 'Senza titolo'}</h4>
                <p class="grid-photo-sub">${foto.sottotitolo || ''}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            cambiaVistaGalleria("slider");
            aggiornaFotoSlider(i);
        });

        container.appendChild(card);
    });
}

// Cambia vista tra Slider e Griglia
function cambiaVistaGalleria(vista) {
    vistaAttivaGalleria = vista;
    const sliderView = document.getElementById("galleria-slider-view");
    const gridView = document.getElementById("galleria-grid-view");
    const btnSlider = document.getElementById("btn-view-slider");
    const btnGrid = document.getElementById("btn-view-grid");

    if (vista === "slider") {
        if (sliderView) sliderView.classList.remove("hidden");
        if (gridView) gridView.classList.add("hidden");
        if (btnSlider) btnSlider.classList.add("active");
        if (btnGrid) btnGrid.classList.remove("active");
        aggiornaFotoSlider(indiceFotoCorrente);
    } else {
        if (sliderView) sliderView.classList.add("hidden");
        if (gridView) gridView.classList.remove("hidden");
        if (btnSlider) btnSlider.classList.remove("active");
        if (btnGrid) btnGrid.classList.add("active");
    }
}

// Gestione Lightbox a tutto schermo
function apriLightbox() {
    if (galleriaFoto.length === 0) return;
    const lightbox = document.getElementById("galleria-lightbox");
    if (!lightbox) return;

    lightbox.classList.remove("hidden");
    lightboxAperto = true;
    aggiornaFotoLightbox(indiceFotoCorrente);
}

function chiudiLightbox() {
    const lightbox = document.getElementById("galleria-lightbox");
    const lbVideo = document.getElementById("lightbox-video");
    if (lbVideo) lbVideo.pause();
    if (!lightbox) return;
    lightbox.classList.add("hidden");
    lightboxAperto = false;
}

function aggiornaFotoLightbox(index) {
    if (galleriaFoto.length === 0) return;
    const foto = galleriaFoto[index];
    const img = document.getElementById("lightbox-img");
    let lbVideo = document.getElementById("lightbox-video");
    const counter = document.getElementById("lightbox-counter");
    const title = document.getElementById("lightbox-title");

    if (img && img.parentElement) {
        if (!lbVideo) {
            lbVideo = document.createElement("video");
            lbVideo.id = "lightbox-video";
            lbVideo.controls = true;
            lbVideo.playsInline = true;
            lbVideo.className = img.className;
            img.parentElement.insertBefore(lbVideo, img.nextSibling);
        }

        if (foto.tipo === "video") {
            img.classList.add("hidden");
            lbVideo.classList.remove("hidden");
            lbVideo.src = foto.src;
        } else {
            lbVideo.pause();
            lbVideo.classList.add("hidden");
            img.classList.remove("hidden");
            img.src = foto.src;
        }
    }

    if (counter) counter.textContent = `${index + 1} / ${galleriaFoto.length}`;
    if (title) title.textContent = foto.titolo || "";
}

// Impostazione di tutti gli Event Listener della Galleria
function impostaAscoltatoriGalleria() {
    const btnCarica = document.getElementById("btn-carica-foto");
    const btnEmptyCarica = document.getElementById("btn-empty-carica");
    const fileInput = document.getElementById("galleria-file-input");
    const btnPrev = document.getElementById("slider-btn-prev");
    const btnNext = document.getElementById("slider-btn-next");
    const viewport = document.getElementById("slider-viewport");
    const btnFullscreen = document.getElementById("btn-fullscreen-foto");
    const btnElimina = document.getElementById("btn-elimina-foto");
    const btnViewSlider = document.getElementById("btn-view-slider");
    const btnViewGrid = document.getElementById("btn-view-grid");

    // Click per aprire il file picker
    const apriFilePicker = () => {
        if (fileInput) fileInput.click();
    };
    if (btnCarica) btnCarica.addEventListener("click", apriFilePicker);
    if (btnEmptyCarica) btnEmptyCarica.addEventListener("click", apriFilePicker);

    // Caricamento dei file selezionati
    if (fileInput) {
        fileInput.addEventListener("change", async function(e) {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;

            const spinner = document.getElementById("galleria-upload-spinner");
            const spinnerText = document.getElementById("galleria-upload-spinner-text");

            if (spinner) spinner.classList.remove("hidden");
            if (spinnerText) spinnerText.textContent = `Salvataggio di ${files.length} foto in corso...`;

            let contatoreSalvate = 0;
            const indicePartenzaNuoveFoto = galleriaFoto.length;

            for (let i = 0; i < files.length; i++) {
                const f = files[i];
                try {
                    if (spinnerText) {
                        spinnerText.textContent = `Caricamento ${i + 1} di ${files.length}...`;
                    }
                    await caricaESalvaMediaCondiviso(f);
                    contatoreSalvate++;
                } catch (err) {
                    console.error("Errore elaborazione file:", err);
                }
            }

            if (spinner) spinner.classList.add("hidden");
            fileInput.value = ""; // Resetta per permettere di ricaricare lo stesso file se necessario

            if (contatoreSalvate > 0) {
                // Ricarica tutte le foto
                await ricaricaFotoGalleria();
                // Sposta lo slider alla prima nuova foto caricata
                aggiornaFotoSlider(indicePartenzaNuoveFoto);

                mostraToastGalleria(`🎉 ${contatoreSalvate} ${contatoreSalvate === 1 ? 'foto aggiunta' : 'foto aggiunte'} alla galleria!`);

                // Esplosione coriandoli se la libreria confetti è presente
                if (typeof confetti === "function") {
                    confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.7 }
                    });
                }
            } else {
                mostraToastGalleria("Impossibile caricare le foto selezionate. Riprova.");
            }
        });
    }

    // Navigazione frecce slider
    if (btnPrev) btnPrev.addEventListener("click", fotoPrecedente);
    if (btnNext) btnNext.addEventListener("click", fotoSuccessiva);

    // Click sulla foto o sul tasto ingrandisci per aprire il lightbox
    if (viewport) viewport.addEventListener("click", apriLightbox);
    if (btnFullscreen) btnFullscreen.addEventListener("click", apriLightbox);

    // Tasto elimina foto caricata
    if (btnElimina) {
        btnElimina.addEventListener("click", async () => {
            const foto = galleriaFoto[indiceFotoCorrente];
            if (!foto || !foto.isCustom) return;

            const conferma = confirm(`Vuoi davvero rimuovere "${foto.titolo || 'questa foto'}" dalla galleria?`);
            if (!conferma) return;

            await eliminaFotoDaDatabase(foto.id);
            mostraToastGalleria("Foto rimossa dalla galleria.");
            await ricaricaFotoGalleria();
        });
    }

    // Toggle Vista Slider / Griglia
    if (btnViewSlider) btnViewSlider.addEventListener("click", () => cambiaVistaGalleria("slider"));
    if (btnViewGrid) btnViewGrid.addEventListener("click", () => cambiaVistaGalleria("grid"));

    // GESTIONE SWIPE TOUCH PER SMARTPHONE SULLO SLIDER
    const stage = document.getElementById("slider-stage");
    if (stage) {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        stage.addEventListener("touchstart", function(e) {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
            }
        }, { passive: true });

        stage.addEventListener("touchend", function(e) {
            if (e.changedTouches.length === 1) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                // Rileva swipe orizzontale
                if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
                    if (deltaX < 0) {
                        fotoSuccessiva();
                    } else {
                        fotoPrecedente();
                    }
                }
            }
        }, { passive: true });
    }

    // GESTIONE LIGHTBOX
    const lbClose = document.getElementById("lightbox-close");
    const lbBackdrop = document.getElementById("lightbox-backdrop");
    const lbPrev = document.getElementById("lightbox-prev");
    const lbNext = document.getElementById("lightbox-next");
    const lbWrap = document.getElementById("lightbox-img-wrap");

    if (lbClose) lbClose.addEventListener("click", chiudiLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener("click", chiudiLightbox);
    if (lbPrev) lbPrev.addEventListener("click", (e) => {
        e.stopPropagation();
        fotoPrecedente();
    });
    if (lbNext) lbNext.addEventListener("click", (e) => {
        e.stopPropagation();
        fotoSuccessiva();
    });

    // Swipe nel Lightbox su smartphone
    if (lbWrap) {
        let lbTouchStartX = 0;
        let lbTouchStartY = 0;

        lbWrap.addEventListener("touchstart", function(e) {
            if (e.touches.length === 1) {
                lbTouchStartX = e.touches[0].clientX;
                lbTouchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        lbWrap.addEventListener("touchend", function(e) {
            if (e.changedTouches.length === 1) {
                const deltaX = e.changedTouches[0].clientX - lbTouchStartX;
                const deltaY = e.changedTouches[0].clientY - lbTouchStartY;

                if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX < 0) {
                        fotoSuccessiva();
                    } else {
                        fotoPrecedente();
                    }
                }
            }
        }, { passive: true });
    }

    // NAVIGAZIONE TASTIERA (Frecce Sinistra / Destra / Esc)
    window.addEventListener("keydown", function(e) {
        const galleriaVisibile = galleriaScreen && !galleriaScreen.classList.contains("hidden");
        if (!galleriaVisibile) return;

        if (e.key === "ArrowLeft") {
            fotoPrecedente();
        } else if (e.key === "ArrowRight") {
            fotoSuccessiva();
        } else if (e.key === "Escape") {
            if (lightboxAperto) {
                chiudiLightbox();
            } else {
                tornaAlMenu();
            }
        }
    });
}


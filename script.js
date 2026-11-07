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
if (btnGalleria) btnGalleria.addEventListener("click", () => mostraSchermata(galleriaScreen));
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
        const letteraEsatta = (cella.dataset.answer || "").toUpperCase();

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
            if (cella.value.trim().toUpperCase() !== (cella.dataset.answer || "").toUpperCase()) {
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
    { num: 1, testo: "1. Se valentina inizia a ballare, sai già cosa sta per domandare: tra un sorriso e una sculettata, parte la frase tanto amata." },
    { num: 2, testo: "2. Non eran gatti né animali lontane, ma come chiamavamo le nostre birmane?" },
    { num: 3, testo: "3. Un cane tanto sognato da me e Babbetta con passione, ma Vale poneva sempre una condizione: se mai fosse arrivato quel cagnolino speciale, quale nome doveva avere per essere ufficiale?" },
    { num: 4, testo: "4. È il nostro brindisi più speciale, ormai diventato tradizionale: dopo cuore e sesso con tanto trasporto, qual è il terzo augurio che porta conforto?" },
    { num: 5, testo: "5. Il primo anno aveva un appuntamento fisso, tra balli, risate e qualche tipo mai visto: tra personaggi strani e storie da raccontare, quale locale ci faceva sempre ritornare?" }
];

let parolaCruciverbaAttiva = 1;

function impostaParolaAttiva(num, focusCell = false) {
    parolaCruciverbaAttiva = parseInt(num, 10);

    // 1. Aggiorna Banner attivo in alto
    const bannerNum = document.getElementById("banner-num");
    const bannerTesto = document.getElementById("banner-testo-indizio");
    if (bannerNum) bannerNum.innerText = parolaCruciverbaAttiva;
    if (bannerTesto) {
        const item = elencoDomandeCruciverba.find(d => d.num === parolaCruciverbaAttiva);
        if (item) {
            bannerTesto.style.opacity = "0.3";
            setTimeout(() => {
                bannerTesto.innerText = item.testo;
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

    // 4. Evidenzia la domanda nella lista desktop
    document.querySelectorAll(".cruciverba-domande p").forEach(p => {
        const isCurrent = parseInt(p.dataset.row, 10) === parolaCruciverbaAttiva;
        p.classList.toggle("attiva", isCurrent);
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
        let prev = parolaCruciverbaAttiva - 1;
        if (prev < 1) prev = 5;
        impostaParolaAttiva(prev, true);
    });
}

if (btnNextIndizio) {
    btnNextIndizio.addEventListener("click", function() {
        let next = parolaCruciverbaAttiva + 1;
        if (next > 5) next = 1;
        impostaParolaAttiva(next, true);
    });
}

// Toggle per mostrare / nascondere tutte le domande
const btnToggleTutte = document.getElementById("btn-toggle-tutte-domande");
const listaDomandeDesktop = document.getElementById("cruciverba-domande-lista");

if (btnToggleTutte && listaDomandeDesktop) {
    btnToggleTutte.addEventListener("click", function() {
        listaDomandeDesktop.classList.toggle("aperto-mobile");
        if (listaDomandeDesktop.classList.contains("aperto-mobile")) {
            btnToggleTutte.innerText = "Nascondi tutti gli indizi ▴";
        } else {
            btnToggleTutte.innerText = "Mostra tutti gli indizi ▾";
        }
    });
}

// Click sui paragrafi delle domande (desktop)
document.querySelectorAll(".cruciverba-domande p").forEach(p => {
    p.addEventListener("click", function() {
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
    { id: "m1", titolo: "Le Birmane sul Balcone", icona: "🦗", desc: "Gli scarafaggi di bambù e la convivenza estrema" },
    { id: "m2", titolo: "Caffettiamo con Balletto", icona: "☕", desc: "Lo sculettamento improvviso prima del caffè" },
    { id: "m3", titolo: "Il Bus 2 - Largo 8 Marzo", icona: "🚌", desc: "I viaggi infiniti tra nebbia e ritardi a Parma" },
    { id: "m4", titolo: "Gin Lemon al Valentino Bar", icona: "🍸", desc: "Dove tutto ebbe inizio tra crêpes e decisioni matte" },
    { id: "m5", titolo: "Il Cane Immaginario", icona: "🐶", desc: "Vale: 'Lo prendiamo solo se si chiama Heetsina'" },
    { id: "m6", titolo: "Caduta col Poliziotto", icona: "👮‍♀️", desc: "Sara o Antonella? La figura più epica di sempre" },
    { id: "m7", titolo: "Brindisi: Cuore, Sesso e...", icona: "🥂", desc: "Il terzo augurio solenne: SUCCESSO!" },
    { id: "m8", titolo: "Serata Giovedrink", icona: "💃", desc: "Ballo scatenato, musica alta e risate fino all'alba" },
    { id: "m9", titolo: "Ansia Notturna Pre-Esame", icona: "📚", desc: "Notte in bianco a ripetere disperate sui libri" },
    { id: "m10", titolo: "Tesi Stampata all'Ultimo", icona: "🎓", desc: "La folle corsa in copisteria con l'ansia a mille" }
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


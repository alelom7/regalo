// Recupero gli elementi delle schermate
const mainScreen = document.getElementById("main-screen");
const bachecaScreen = document.getElementById("bacheca-screen");
const galleriaScreen = document.getElementById("galleria-screen");
const cruciverbaScreen = document.getElementById("cruciverba-screen");
const milionarioScreen = document.getElementById("milionario-screen");
const top10Screen = document.getElementById("top10-screen");
const avantiUnAltroScreen = document.getElementById("avanti-un-altro-screen");


// Funzione helper per il cambio schermata fluido su mobile e desktop
function mostraSchermata(schermataDaMostrare) {
    [mainScreen, bachecaScreen, galleriaScreen, cruciverbaScreen, milionarioScreen, top10Screen, avantiUnAltroScreen].forEach(function(s) {
        if (s) s.classList.add("hidden");
    });
    if (schermataDaMostrare) {
        schermataDaMostrare.classList.remove("hidden");
        window.scrollTo(0, 0); // Riporta in cima alla pagina su mobile
    }
}

function tornaAlMenu() {
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
if (btnCruciverba) btnCruciverba.addEventListener("click", () => mostraSchermata(cruciverbaScreen));
if (btnBackCruciverba) btnBackCruciverba.addEventListener("click", tornaAlMenu);

//Avanti un altro
const btnAvantiUnAltro = document.getElementById("btn-avanti-un-altro");
const btnBackAvantiUnAltro = document.getElementById("back-from-avanti-un-altro");
if (btnAvantiUnAltro) btnAvantiUnAltro.addEventListener("click", () => { mostraSchermata(avantiUnAltroScreen); iniziaGiocoAvantiUnAltro(); });
if (btnBackAvantiUnAltro) btnBackAvantiUnAltro.addEventListener("click", tornaAlMenu);

//Top 10
const btnTop10 = document.getElementById("btn-top10");
const btnBackTop10 = document.getElementById("back-from-top10");
if (btnTop10) btnTop10.addEventListener("click", () => mostraSchermata(top10Screen));
if (btnBackTop10) btnBackTop10.addEventListener("click", tornaAlMenu);

//Milionario
const btnMilionario = document.getElementById("btn-milionario");
const btnBackMilionario = document.getElementById("back-from-milionario");
if (btnMilionario) btnMilionario.addEventListener("click", () => mostraSchermata(milionarioScreen));
if (btnBackMilionario) btnBackMilionario.addEventListener("click", tornaAlMenu);    


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
// AUTOFOCUS & DIGITAZIONE CRUCIVERBA (Mobile & Desktop)
// ==========================================

const tutteLeRigheCruciverba = document.querySelectorAll(".cruciverba-riga");

tutteLeRigheCruciverba.forEach(function(riga) {
    const celleDellaRiga = Array.from(riga.querySelectorAll(".cell"));

    celleDellaRiga.forEach(function(cellaAttuale, indiceNellaRiga) {
        
        // 1. Quando la cella riceve il focus (tap su smartphone o click), seleziona il testo esistente
        // In questo modo digitare una nuova lettera la sostituisce subito senza dover prima cancellare!
        cellaAttuale.addEventListener("focus", function() {
            cellaAttuale.select();
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
        domanda: "Durante le nottate prima di un esame, qual è la fonte primaria di energia?",
        opzioni: [
            { testo: "Caffè a litri e preghiere", corretta: true },
            { testo: "Tisana rilassante e 8 ore di sonno profondo", corretta: false }
        ]
    },
    {
        domanda: "Al Valentino Bar, come è nata la storica decisione di andare a convivere a Parma?",
        opzioni: [
            { testo: "Tra un gin lemon, una crêpes e zero certezze", corretta: true },
            { testo: "Con un dettagliato business plan approvato da un notaio", corretta: false }
        ]
    },
    {
        domanda: "Come sono state affettuosamente ribattezzate le famigerate inquiline birmane della prima casa?",
        opzioni: [
            { testo: "Suji", corretta: true },
            { testo: "Le Principesse del Baltico", corretta: false }
        ]
    },
    {
        domanda: "Qual è il leggendario autobus di linea diventato simbolo delle nostre epiche traversate a Parma?",
        opzioni: [
            { testo: "Il 2 - Largo 8 Marzo", corretta: true },
            { testo: "La Ferrari 458 Italia", corretta: false }
        ]
    },
    {
        domanda: "Cosa succede quando Valentina si alza all'improvviso e comincia a sculettare a tempo?",
        opzioni: [
            { testo: "Sta per chiedere con entusiasmo: 'Caffettiamo?'", corretta: true },
            { testo: "Ha perso di nuovo le chiavi dell'appartamento", corretta: false }
        ]
    },
    {
        domanda: "Qual è il terzo solenne elemento del nostro brindisi: 'Cuore, Sesso e...'?",
        opzioni: [
            { testo: "Successo!", corretta: true },
            { testo: "Sonno arretrato", corretta: false }
        ]
    },
    {
        domanda: "E adesso che siete ufficialmente Dottoresse ad Alta Gradazione, cosa vi spetta di diritto?",
        opzioni: [
            { testo: "Festeggiamenti sfrenati, risate e fiumi di brindisi!", corretta: true },
            { testo: "Tornare a studiare per un esame lunedì mattina", corretta: false }
        ]
    }
];

let indiceDomandaAvanti = 0;
let bloccoClickAvanti = false;

const avantiGiocoBox = document.getElementById("avanti-gioco-box");
const avantiVittoriaBox = document.getElementById("avanti-vittoria-box");
const avantiDomandaTesto = document.getElementById("avanti-domanda-testo");
const avantiStepText = document.getElementById("avanti-step-text");
const avantiProgressBar = document.getElementById("avanti-progress-bar");
const avantiFeedbackMsg = document.getElementById("avanti-feedback-msg");
const avantiBtn0 = document.getElementById("avanti-btn-0");
const avantiBtn1 = document.getElementById("avanti-btn-1");
const btnRestartAvanti = document.getElementById("btn-restart-avanti");
const btnMenuFromAvanti = document.getElementById("btn-menu-from-avanti");

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
            avantiFeedbackMsg.innerText = "✨ Esatto! Avanti con la prossima!";
            avantiFeedbackMsg.className = "avanti-feedback msg-corretto";
        }

        const totaleDomande = domandeAvantiUnAltro.length;
        if (indiceDomandaAvanti + 1 < totaleDomande) {
            indiceDomandaAvanti++;
            setTimeout(function() {
                caricaDomandaAvanti();
            }, 600);
        } else {
            // Vittoria totale!
            if (avantiProgressBar) avantiProgressBar.style.width = "100%";
            setTimeout(function() {
                mostraVittoriaAvanti();
            }, 500);
        }
    } else {
        // Errore: si illumina di rosso, trema e resetta alla domanda 1!
        btnCliccato.classList.add("sbagliata");
        if (avantiGiocoBox) avantiGiocoBox.classList.add("card-shake");

        if (avantiFeedbackMsg) {
            avantiFeedbackMsg.innerText = "💥 Risposta errata! Si torna alla domanda 1!";
            avantiFeedbackMsg.className = "avanti-feedback msg-sbagliato";
        }

        setTimeout(function() {
            indiceDomandaAvanti = 0;
            caricaDomandaAvanti();
        }, 1000);
    }
}

function mostraVittoriaAvanti() {
    if (avantiGiocoBox) avantiGiocoBox.classList.add("hidden");
    if (avantiVittoriaBox) avantiVittoriaBox.classList.remove("hidden");

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

function iniziaGiocoAvantiUnAltro() {
    indiceDomandaAvanti = 0;
    if (avantiGiocoBox) avantiGiocoBox.classList.remove("hidden");
    if (avantiVittoriaBox) avantiVittoriaBox.classList.add("hidden");
    caricaDomandaAvanti();
}

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
if (btnRestartAvanti) {
    btnRestartAvanti.addEventListener("click", iniziaGiocoAvantiUnAltro);
}
if (btnMenuFromAvanti) {
    btnMenuFromAvanti.addEventListener("click", tornaAlMenu);
}

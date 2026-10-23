// Recupero gli elementi delle schermate
const mainScreen = document.getElementById("main-screen");
const bachecaScreen = document.getElementById("bacheca-screen");
const galleriaScreen = document.getElementById("galleria-screen");
const cruciverbaScreen = document.getElementById("cruciverba-screen");

// Funzione helper per il cambio schermata fluido su mobile e desktop
function mostraSchermata(schermataDaMostrare) {
    [mainScreen, bachecaScreen, galleriaScreen, cruciverbaScreen].forEach(function(s) {
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
// SCROLL REVEAL (Comparsa morbida delle Card)
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
        threshold: 0.05
    });

    document.querySelectorAll(".card-ricordo").forEach(function(card) {
        card.classList.add("nascosta-scroll");
        observerCard.observe(card);
    });
} else {
    document.querySelectorAll(".card-ricordo").forEach(function(card) {
        card.classList.add("visibile");
    });
}
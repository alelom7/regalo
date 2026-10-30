import re

# 1. UPDATE index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

avanti_html_target = re.search(
    r'<div id="avanti-un-altro-screen" class="screen hidden">.*?</div>\s*</div>',
    html,
    flags=re.DOTALL
)

if avanti_html_target:
    new_avanti_screen = """    <div id="avanti-un-altro-screen" class="screen hidden">
        <div class="nav-bar">
            <button class="back-btn" id="back-from-avanti-un-altro">⬅ Torna al Menu</button>
            <h2>Avanti un Altro</h2>
        </div>

        <div class="avanti-container">
            <!-- Box di Gioco della Scalata -->
            <div id="avanti-gioco-box" class="avanti-card">
                <div class="avanti-header">
                    <span class="avanti-badge">SFIDA DI LAUREA • LA SCALATA</span>
                    <div class="avanti-progress-info">
                        <span id="avanti-step-text">Domanda 1 di 7</span>
                        <span class="avanti-streak-badge">🎯 Vietato sbagliare!</span>
                    </div>
                    <div class="avanti-progress-bar-bg">
                        <div id="avanti-progress-bar" class="avanti-progress-bar-fill"></div>
                    </div>
                </div>

                <div class="avanti-body">
                    <p class="avanti-regola-hint">⚠️ Clicca sulla risposta corretta per avanzare. Un solo errore ti farà ripartire dalla prima domanda!</p>
                    <h3 id="avanti-domanda-testo" class="avanti-domanda">Caricamento in corso...</h3>
                    
                    <div class="avanti-risposte-grid">
                        <button type="button" class="avanti-btn-risposta" id="avanti-btn-0"></button>
                        <button type="button" class="avanti-btn-risposta" id="avanti-btn-1"></button>
                    </div>

                    <div id="avanti-feedback-msg" class="avanti-feedback"></div>
                </div>
            </div>

            <!-- Box di Vittoria Finale (nascosto inizialmente) -->
            <div id="avanti-vittoria-box" class="avanti-card hidden">
                <div class="avanti-vittoria-content">
                    <span class="vittoria-icon">🎓🏆🥂</span>
                    <span class="avanti-badge">TRAGUARDO RAGGIUNTO</span>
                    <h2>SCALATA COMPLETATA!</h2>
                    <p class="vittoria-desc">Incredibile! Avete risposto correttamente a tutte le domande senza sbagliare nemmeno una volta! La proclamazione a Dottoresse ad Alta Gradazione è ufficialmente meritatissima!</p>
                    <div class="vittoria-azioni">
                        <button type="button" class="nav-btn bottone-pulsante" id="btn-restart-avanti">Rigioca la Scalata</button>
                        <button type="button" class="back-btn" id="btn-menu-from-avanti">⬅ Torna al Menu</button>
                    </div>
                </div>
            </div>
        </div>
    </div>"""
    html = html[:avanti_html_target.start()] + new_avanti_screen + html[avanti_html_target.end():]
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("index.html updated successfully!")
else:
    print("Error: avanti-un-altro-screen target not found in index.html")

# 2. UPDATE style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

css_game = """

/* ==========================================================================
   6. AVANTI UN ALTRO (GIOCO DELLA SCALATA AD ALTA GRADAZIONE)
   ========================================================================== */
.avanti-container {
    max-width: 680px;
    margin: 3.5rem auto 5rem;
    padding: 0 1.5rem;
}

.avanti-card {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(28, 25, 23, 0.05);
    padding: 2.8rem 2.2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avanti-header {
    margin-bottom: 2rem;
}

.avanti-badge {
    display: inline-block;
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--accent-burgundy);
    background: rgba(74, 21, 33, 0.07);
    padding: 0.45rem 1.2rem;
    border-radius: 9999px;
    margin-bottom: 1.1rem;
}

.avanti-progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    margin-bottom: 0.65rem;
}

.avanti-streak-badge {
    color: var(--accent-burgundy);
    font-size: 0.82rem;
}

.avanti-progress-bar-bg {
    width: 100%;
    height: 8px;
    background: var(--bg-secondary);
    border-radius: 9999px;
    overflow: hidden;
    border: 1px solid var(--border-subtle);
}

.avanti-progress-bar-fill {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #8c102b, #4a1521);
    border-radius: 9999px;
    transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.avanti-regola-hint {
    font-size: 0.84rem;
    color: var(--text-muted);
    margin-bottom: 1.6rem;
    line-height: 1.45;
}

.avanti-domanda {
    font-family: var(--font-serif);
    font-size: 1.7rem;
    line-height: 1.35;
    color: var(--text-main);
    margin-bottom: 2.4rem;
    min-height: 4.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
}

.avanti-risposte-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
    margin-bottom: 1.5rem;
}

.avanti-btn-risposta {
    font-family: var(--font-sans);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-main);
    background: var(--bg-secondary);
    border: 1.5px solid var(--border-subtle);
    border-radius: 18px;
    padding: 1.4rem 1.2rem;
    cursor: pointer;
    line-height: 1.35;
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 2px 8px rgba(28, 25, 23, 0.03);
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
}

.avanti-btn-risposta:hover:not(:disabled) {
    background: var(--accent-burgundy);
    color: #ffffff;
    border-color: var(--accent-burgundy);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(74, 21, 33, 0.18);
}

.avanti-btn-risposta:active:not(:disabled) {
    transform: scale(0.97);
}

.avanti-btn-risposta.corretta {
    background: #15803d !important;
    color: #ffffff !important;
    border-color: #15803d !important;
    box-shadow: 0 0 20px rgba(21, 128, 61, 0.4) !important;
    transform: scale(1.02);
}

.avanti-btn-risposta.sbagliata {
    background: #b91c1c !important;
    color: #ffffff !important;
    border-color: #b91c1c !important;
    box-shadow: 0 0 20px rgba(185, 28, 28, 0.4) !important;
    animation: erroreShake 0.45s ease-in-out;
}

@keyframes erroreShake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
}

.avanti-card.card-shake {
    animation: erroreShake 0.45s ease-in-out;
}

.avanti-feedback {
    min-height: 2.2rem;
    font-size: 0.95rem;
    font-weight: 600;
    margin-top: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease;
}

.avanti-feedback.msg-corretto {
    color: #15803d;
}

.avanti-feedback.msg-sbagliato {
    color: #b91c1c;
}

/* Schermata vittoria */
.avanti-vittoria-content {
    padding: 1.5rem 0.5rem;
}

.vittoria-icon {
    font-size: 3.5rem;
    display: block;
    margin-bottom: 1rem;
    animation: battito 1.5s ease-in-out infinite;
}

.avanti-vittoria-content h2 {
    font-size: 2.2rem;
    color: var(--accent-burgundy);
    margin: 0.6rem 0 1rem;
}

.vittoria-desc {
    color: var(--text-muted);
    font-size: 1.05rem;
    line-height: 1.6;
    max-width: 480px;
    margin: 0 auto 2.2rem;
}

.vittoria-azioni {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
}

@media screen and (max-width: 600px) {
    .avanti-container {
        margin: 1.8rem auto 3rem;
        padding: 0 1rem;
    }

    .avanti-card {
        padding: 1.8rem 1.2rem;
        border-radius: 20px;
    }

    .avanti-domanda {
        font-size: 1.35rem;
        min-height: 3.6rem;
        margin-bottom: 1.8rem;
    }

    .avanti-risposte-grid {
        grid-template-columns: 1fr;
        gap: 0.9rem;
    }

    .avanti-btn-risposta {
        font-size: 0.98rem;
        padding: 1.2rem 1rem;
    }
}
"""

if "AVANTI UN ALTRO (GIOCO DELLA SCALATA" not in css:
    css += css_game
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("style.css updated successfully!")
else:
    print("style.css already contains avanti styles")

# 3. UPDATE script.js
with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Make sure button click for avanti-un-altro starts the game
js = js.replace(
    'if (btnAvantiUnAltro) btnAvantiUnAltro.addEventListener("click", () => mostraSchermata(avantiUnAltroScreen));',
    'if (btnAvantiUnAltro) btnAvantiUnAltro.addEventListener("click", () => { mostraSchermata(avantiUnAltroScreen); iniziaGiocoAvantiUnAltro(); });'
)

js_game = """

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
"""

if "GIOCO: AVANTI UN ALTRO (LA SCALATA)" not in js:
    js += js_game
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("script.js updated successfully!")
else:
    print("script.js already contains avanti game logic")

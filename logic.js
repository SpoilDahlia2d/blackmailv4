// Discord Webhook destination (You'll need to set this before pushing to production)
// You can test with a dummy or real webhook if you have one.
const WEBHOOK_URL = "";

const questions = [
    {
        id: "name",
        prompt: "Identify yourself. Full Legal Name:",
        errorMsg: "Invalid format. I demand your FULL name, insect.",
        validate: (ans) => {
            const words = ans.trim().split(" ");
            return words.length >= 2 && words.every(w => w.length > 1 && /^[a-zA-Z\s]+$/.test(w));
        }
    },
    {
        id: "age",
        prompt: "Age. Lie and I will know:",
        errorMsg: "Enter a valid age between 18 and 99.",
        validate: (ans) => {
            const age = parseInt(ans.trim(), 10);
            return !isNaN(age) && age >= 18 && age <= 99;
        }
    },
    {
        id: "discord",
        prompt: "Discord Username:",
        errorMsg: "Too short. Don't hide from me.",
        validate: (ans) => ans.trim().length >= 3
    },
    {
        id: "job",
        prompt: "Occupation / Job Title:",
        errorMsg: "Pathetic. Be specific. At least 5 characters.",
        validate: (ans) => ans.trim().length >= 5
    },
    {
        id: "income",
        prompt: "Current Monthly Net Income (€/$):",
        errorMsg: "Numbers only. If it's too low, I might just block you.",
        validate: (ans) => {
            const cleaned = ans.replace(/[^0-9]/g, '');
            if(!cleaned) return false;
            return parseInt(cleaned, 10) > 500;
        }
    },
    {
        id: "bank",
        prompt: "Total available in your bank account right now:",
        errorMsg: "I asked for a number. Provide it.",
        validate: (ans) => /^[0-9.,]+$/.test(ans.replace(/[\$\€\£\s]/g, '')) && ans.trim().length > 0
    },
    {
        id: "credit",
        prompt: "What is your credit card limit?",
        errorMsg: "Invalid. Try again.",
        validate: (ans) => /^[0-9.,]+$/.test(ans.replace(/[\$\€\£\s]/g, '')) && ans.trim().length > 0
    },
    {
        id: "relationship",
        prompt: "Relationship Status (Single/Partnered/Married):",
        errorMsg: "Answer 'Single', 'Partnered', or 'Married'.",
        validate: (ans) => {
            const lower = ans.trim().toLowerCase();
            return ["single", "partnered", "married"].includes(lower);
        }
    },
    {
        id: "partnerName",
        prompt: "Partner's Name (Type N/A if single and pathetic):",
        errorMsg: "At least 3 characters or N/A.",
        validate: (ans) => ans.trim().length >= 2
    },
    {
        id: "secret",
        prompt: "Does your partner/family know you are a submissive? (Yes/No):",
        errorMsg: "Simple Yes or No.",
        validate: (ans) => ["yes", "no"].includes(ans.trim().toLowerCase())
    },
    {
        id: "insecurity",
        prompt: "What is your deepest, most pathetic insecurity?",
        errorMsg: "Not dragging this out enough. Dig deeper. Minimum 30 chars.",
        validate: (ans) => ans.trim().length >= 30
    },
    {
        id: "blackmail",
        prompt: "Anything I can use against you (But totally won't)🤭:",
        errorMsg: "Stop stalling. I need LEVERAGE. Minimum 30 chars.",
        validate: (ans) => ans.trim().length >= 30
    },
    {
        id: "survival",
        prompt: "If I demanded your entire paycheck right now, how would you survive?",
        errorMsg: "Explain yourself better. Minimum 20 chars.",
        validate: (ans) => ans.trim().length >= 20
    },
    {
        id: "luxury",
        prompt: "What luxury item does Goddess Dahlia deserve from you?",
        errorMsg: "Too cheap. Name something substantial. (Min 10 chars).",
        validate: (ans) => ans.trim().length >= 10
    },
    {
        id: "essay",
        prompt: "Why should I even allow you to serve me?",
        errorMsg: "Pathetic effort. Write an essay. Prove your devotion. (Min 40 chars).",
        validate: (ans) => ans.trim().length >= 40
    },
    {
        id: "pledge",
        prompt: "FINAL PLEDGE: Type 'I surrender my privacy and finances to Goddess Dahlia'",
        errorMsg: "Typo detected. You must type EXACTLY: I surrender my privacy and finances to Goddess Dahlia",
        validate: (ans) => ans.trim() === "I surrender my privacy and finances to Goddess Dahlia"
    }
];

let currentIndex = 0;
const historyContainer = document.getElementById("history-container");
const glitchText = document.getElementById("glitch-text");
const inputField = document.getElementById("terminal-input");
const errorMsg = document.getElementById("error-message");
let isTyping = false;
let collectedData = {};

// Typewriter effect
async function typeOut(text, element, speed = 30) {
    return new Promise(resolve => {
        isTyping = true;
        element.innerHTML = "";
        inputField.disabled = true;
        inputField.value = "";
        inputField.focus(); // keep focus
        
        let i = 0;
        const interval = setInterval(() => {
            element.innerHTML += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                isTyping = false;
                inputField.disabled = false;
                inputField.focus();
                resolve();
            }
        }, speed);
    });
}

async function loadQuestion() {
    if (currentIndex >= questions.length) {
        completeInterrogation();
        return;
    }
    errorMsg.classList.add("hidden");
    document.body.classList.remove("glitch-flash");
    const q = questions[currentIndex];
    await typeOut(q.prompt, glitchText);
}

function renderHistory(question, answer) {
    const div = document.createElement("div");
    div.className = "past-exchange";
    div.innerHTML = `
        <p class="past-q">> ${question}</p>
        <p class="past-a">${answer}</p>
    `;
    historyContainer.appendChild(div);
    window.scrollTo(0, document.body.scrollHeight);
}

function triggerError(msg) {
    errorMsg.innerText = `[ SYSTEM REJECT ] ${msg}`;
    errorMsg.classList.remove("hidden");
    document.body.classList.add("glitch-flash");
    inputField.value = "";
    setTimeout(() => {
        document.body.classList.remove("glitch-flash");
    }, 400);
}

inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !isTyping) {
        const val = inputField.value;
        const q = questions[currentIndex];
        
        if (q.validate(val)) {
            // Success
            collectedData[q.id] = val;
            renderHistory(q.prompt, val);
            currentIndex++;
            loadQuestion();
        } else {
            // Failure
            triggerError(q.errorMsg);
        }
    }
});

async function completeInterrogation() {
    glitchText.innerHTML = "";
    inputField.disabled = true;
    inputField.classList.add("hidden");
    
    await typeOut("PROCESSING DOSSIER...", glitchText, 50);
    
    try {
        await sendToDiscord(collectedData);
        await new Promise(r => setTimeout(r, 1500));
        await typeOut("DOSSIER TRANSMITTED TO KEEPER. YOU ARE NOW THE PROPERTY OF GODDESS DAHLIA.", glitchText, 50);
        
        // At the end, redirect or show payment buttons
        setTimeout(() => {
            const finale = document.createElement('div');
            finale.innerHTML = `
                <div class="mt-8 text-center animate-pulse">
                    <a href="https://throne.me/" target="_blank" class="px-6 py-3 bg-pink-600 text-white font-bold rounded-md hover:bg-pink-700 uppercase tracking-widest text-xl shadow-[0_0_15px_#ec4899]">
                        PAY SILENCE FEE NOW
                    </a>
                </div>
            `;
            document.getElementById("current-question-container").appendChild(finale);
        }, 2000);
    } catch(err) {
        // Fallback if discord fails locally
        await typeOut("DOSSIER ARCHIVED LOCALLY. PENDING SECURE TRANSMISSION...", glitchText, 50);
    }
}

async function sendToDiscord(data) {
    if (!WEBHOOK_URL) return; // Skip if no URL provided
    
    const embed = {
        title: "🚨 NUOVO SCHIAVO ACQUISITO: DOSSIER TECHDOM 🚨",
        color: 15418782, // Pink/Red
        fields: [
            { name: "Nome", value: data.name || "N/A", inline: true },
            { name: "Età", value: data.age || "N/A", inline: true },
            { name: "Discord", value: data.discord || "N/A", inline: true },
            { name: "Lavoro", value: data.job || "N/A", inline: false },
            { name: "Income / Banche", value: `Income: ${data.income}\nBank: ${data.bank}\nCredit: ${data.credit}`, inline: false },
            { name: "Relationship", value: `${data.relationship} (Partner: ${data.partnerName})\nKnows about it: ${data.secret}`, inline: false },
            { name: "Insecurity", value: data.insecurity || "N/A", inline: false },
            { name: "Leverage / Blackmail", value: data.blackmail || "N/A", inline: false },
            { name: "Worthless Essay", value: data.essay || "N/A", inline: false }
        ],
        footer: { text: "Dahlia Slave Protocol v1.0" },
        timestamp: new Date().toISOString()
    };

    return fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
    });
}

// Background Audio Unlocker
let audioStarted = false;
function startAudio() {
    if(!audioStarted) {
        const audio = document.getElementById('bg-audio');
        if(audio) {
            audio.volume = 0.5; // Luxury bg volume
            audio.play().catch(e => console.log("Audio blocked: ", e));
            audioStarted = true;
        }
    }
}
document.addEventListener('keydown', startAudio);
document.addEventListener('click', startAudio);

// Start
window.onload = () => {
    // Add small delay for dramatic effect
    setTimeout(() => {
        loadQuestion();
    }, 1000);
};


/* =====================================================
   HOLY QURAN ULTIMATE
   FILE 03: script.js
   Advanced Offline Quran Application
===================================================== */

"use strict";

/* ---------- APP CONFIGURATION ---------- */

const APP = {
    name: "Holy Quran Ultimate",
    version: "1.0.0",
    defaultLanguage: "both",
    defaultQari: "mishary",
    defaultTheme: "light"
};

/* ---------- LOCAL DATABASE ---------- */

const DB = {
    get(key, fallback = null) {
        try {
            const value = localStorage.getItem("hqu_" + key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem("hqu_" + key, JSON.stringify(value));
            return true;
        } catch (error) {
            showToast("Storage is full or unavailable.");
            return false;
        }
    },

    remove(key) {
        localStorage.removeItem("hqu_" + key);
    }
};

/* ---------- APPLICATION STATE ---------- */

let state = {
    currentPage: "homePage",
    currentSurah: 1,
    currentAyah: 1,
    fontSize: 30,
    translation: DB.get("translation", "both"),
    theme: DB.get("theme", "light"),
    qari: DB.get("qari", "mishary"),
    audioSpeed: 1,
    memorized: DB.get("memorized", []),
    bookmarks: DB.get("bookmarks", []),
    readingHistory: DB.get("history", []),
    tasbeeh: DB.get("tasbeeh", 0),
    autoScroll: false,
    repeat: false
};

/* ---------- QURAN SURAH LIST ---------- */

const surahs = [
    ["Al-Fatihah", "الفاتحة", 7, "Meccan"],
    ["Al-Baqarah", "البقرة", 286, "Medinan"],
    ["Aal-Imran", "آل عمران", 200, "Medinan"],
    ["An-Nisa", "النساء", 176, "Medinan"],
    ["Al-Maidah", "المائدة", 120, "Medinan"],
    ["Al-Anam", "الأنعام", 165, "Meccan"],
    ["Al-Araf", "الأعراف", 206, "Meccan"],
    ["Al-Anfal", "الأنفال", 75, "Medinan"],
    ["At-Tawbah", "التوبة", 129, "Medinan"],
    ["Yunus", "يونس", 109, "Meccan"],
    ["Hud", "هود", 123, "Meccan"],
    ["Yusuf", "يوسف", 111, "Meccan"],
    ["Ar-Rad", "الرعد", 43, "Medinan"],
    ["Ibrahim", "إبراهيم", 52, "Meccan"],
    ["Al-Hijr", "الحجر", 99, "Meccan"],
    ["An-Nahl", "النحل", 128, "Meccan"],
    ["Al-Isra", "الإسراء", 111, "Meccan"],
    ["Al-Kahf", "الكهف", 110, "Meccan"],
    ["Maryam", "مريم", 98, "Meccan"],
    ["Ta-Ha", "طه", 135, "Meccan"],
    ["Al-Anbiya", "الأنبياء", 112, "Meccan"],
    ["Al-Hajj", "الحج", 78, "Medinan"],
    ["Al-Muminun", "المؤمنون", 118, "Meccan"],
    ["An-Nur", "النور", 64, "Medinan"],
    ["Al-Furqan", "الفرقان", 77, "Meccan"],
    ["Ash-Shuara", "الشعراء", 227, "Meccan"],
    ["An-Naml", "النمل", 93, "Meccan"],
    ["Al-Qasas", "القصص", 88, "Meccan"],
    ["Al-Ankabut", "العنكبوت", 69, "Meccan"],
    ["Ar-Rum", "الروم", 60, "Meccan"],
    ["Luqman", "لقمان", 34, "Meccan"],
    ["As-Sajdah", "السجدة", 30, "Meccan"],
    ["Al-Ahzab", "الأحزاب", 73, "Medinan"],
    ["Saba", "سبأ", 54, "Meccan"],
    ["Fatir", "فاطر", 45, "Meccan"],
    ["Ya-Sin", "يس", 83, "Meccan"],
    ["As-Saffat", "الصافات", 182, "Meccan"],
    ["Sad", "ص", 88, "Meccan"],
    ["Az-Zumar", "الزمر", 75, "Meccan"],
    ["Ghafir", "غافر", 85, "Meccan"],
    ["Fussilat", "فصلت", 54, "Meccan"],
    ["Ash-Shura", "الشورى", 53, "Meccan"],
    ["Az-Zukhruf", "الزخرف", 89, "Meccan"],
    ["Ad-Dukhan", "الدخان", 59, "Meccan"],
    ["Al-Jathiyah", "الجاثية", 37, "Meccan"],
    ["Al-Ahqaf", "الأحقاف", 35, "Meccan"],
    ["Muhammad", "محمد", 38, "Medinan"],
    ["Al-Fath", "الفتح", 29, "Medinan"],
    ["Al-Hujurat", "الحجرات", 18, "Medinan"],
    ["Qaf", "ق", 45, "Meccan"],
    ["Adh-Dhariyat", "الذاريات", 60, "Meccan"],
    ["At-Tur", "الطور", 49, "Meccan"],
    ["An-Najm", "النجم", 62, "Meccan"],
    ["Al-Qamar", "القمر", 55, "Meccan"],
    ["Ar-Rahman", "الرحمن", 78, "Medinan"],
    ["Al-Waqiah", "الواقعة", 96, "Meccan"],
    ["Al-Hadid", "الحديد", 29, "Medinan"],
    ["Al-Mujadila", "المجادلة", 22, "Medinan"],
    ["Al-Hashr", "الحشر", 24, "Medinan"],
    ["Al-Mumtahanah", "الممتحنة", 13, "Medinan"],
    ["As-Saff", "الصف", 14, "Medinan"],
    ["Al-Jumuah", "الجمعة", 11, "Medinan"],
    ["Al-Munafiqun", "المنافقون", 11, "Medinan"],
    ["At-Taghabun", "التغابن", 18, "Medinan"],
    ["At-Talaq", "الطلاق", 12, "Medinan"],
    ["At-Tahrim", "التحريم", 12, "Medinan"],
    ["Al-Mulk", "الملك", 30, "Meccan"],
    ["Al-Qalam", "القلم", 52, "Meccan"],
    ["Al-Haqqah", "الحاقة", 52, "Meccan"],
    ["Al-Maarij", "المعارج", 44, "Meccan"],
    ["Nuh", "نوح", 28, "Meccan"],
    ["Al-Jinn", "الجن", 28, "Meccan"],
    ["Al-Muzzammil", "المزمل", 20, "Meccan"],
    ["Al-Muddaththir", "المدثر", 56, "Meccan"],
    ["Al-Qiyamah", "القيامة", 40, "Meccan"],
    ["Al-Insan", "الإنسان", 31, "Medinan"],
    ["Al-Mursalat", "المرسلات", 50, "Meccan"],
    ["An-Naba", "النبأ", 40, "Meccan"],
    ["An-Naziat", "النازعات", 46, "Meccan"],
    ["Abasa", "عبس", 42, "Meccan"],
    ["At-Takwir", "التكوير", 29, "Meccan"],
    ["Al-Infitar", "الإنفطار", 19, "Meccan"],
    ["Al-Mutaffifin", "المطففين", 36, "Meccan"],
    ["Al-Inshiqaq", "الإنشقاق", 25, "Meccan"],
    ["Al-Buruj", "البروج", 22, "Meccan"],
    ["At-Tariq", "الطارق", 17, "Meccan"],
    ["Al-Ala", "الأعلى", 19, "Meccan"],
    ["Al-Ghashiyah", "الغاشية", 26, "Meccan"],
    ["Al-Fajr", "الفجر", 30, "Meccan"],
    ["Al-Balad", "البلد", 20, "Meccan"],
    ["Ash-Shams", "الشمس", 15, "Meccan"],
    ["Al-Layl", "الليل", 21, "Meccan"],
    ["Ad-Duha", "الضحى", 11, "Meccan"],
    ["Ash-Sharh", "الشرح", 8, "Meccan"],
    ["At-Tin", "التين", 8, "Meccan"],
    ["Al-Alaq", "العلق", 19, "Meccan"],
    ["Al-Qadr", "القدر", 5, "Meccan"],
    ["Al-Bayyinah", "البينة", 8, "Medinan"],
    ["Az-Zalzalah", "الزلزلة", 8, "Medinan"],
    ["Al-Adiyat", "العاديات", 11, "Meccan"],
    ["Al-Qariah", "القارعة", 11, "Meccan"],
    ["At-Takathur", "التكاثر", 8, "Meccan"],
    ["Al-Asr", "العصر", 3, "Meccan"],
    ["Al-Humazah", "الهمزة", 9, "Meccan"],
    ["Al-Fil", "الفيل", 5, "Meccan"],
    ["Quraysh", "قريش", 4, "Meccan"],
    ["Al-Maun", "الماعون", 7, "Meccan"],
    ["Al-Kawthar", "الكوثر", 3, "Meccan"],
    ["Al-Kafirun", "الكافرون", 6, "Meccan"],
    ["An-Nasr", "النصر", 3, "Medinan"],
    ["Al-Masad", "المسد", 5, "Meccan"],
    ["Al-Ikhlas", "الإخلاص", 4, "Meccan"],
    ["Al-Falaq", "الفلق", 5, "Meccan"],
    ["An-Nas", "الناس", 6, "Meccan"]
];

/* ---------- QARI LIST ---------- */

const qaris = [
    { id: "mishary", name: "Mishary Rashid Alafasy" },
    { id: "sudais", name: "Abdur Rahman As-Sudais" },
    { id: "shuraim", name: "Saud Al-Shuraim" },
    { id: "abdulbasit", name: "Abdul Basit" },
    { id: "maher", name: "Maher Al-Muaiqly" },
    { id: "minshawi", name: "Al-Minshawi" },
    { id: "husary", name: "Mahmoud Khalil Al-Husary" },
    { id: "ajmi", name: "Ahmed Al-Ajmi" }
];

/* ---------- HELPER FUNCTIONS ---------- */

function getElement(id) {
    return document.getElementById(id);
}

function showToast(message) {
    let toast = getElement("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.style.cssText =
            "position:fixed;bottom:85px;left:50%;transform:translateX(-50%);" +
            "background:#075c43;color:white;padding:12px 20px;" +
            "border-radius:30px;z-index:9999;max-width:90%;text-align:center;";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

function safeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

/* ---------- PAGE NAVIGATION ---------- */

function navigateTo(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const target = getElement(pageId);

    if (target) {
        target.classList.add("active");
        state.currentPage = pageId;
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        showToast("This section will be available soon.");
    }

    document.querySelectorAll("[data-page]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });
}

/* ---------- GENERATE SURAH LIST ---------- */

function renderSurahs(search = "") {
    const container = getElement("surahList");
    if (!container) return;

    const query = search.toLowerCase();

    const filtered = surahs.filter((surah, index) =>
        surah[0].toLowerCase().includes(query) ||
        surah[1].includes(query) ||
        String(index + 1).includes(query)
    );

    container.innerHTML = "";

    filtered.forEach((surah) => {
        const number = surahs.indexOf(surah) + 1;

        const item = document.createElement("button");
        item.className = "surah-card";
        item.innerHTML = `
            <span class="surah-number">${number}</span>
            <span class="surah-info">
                <strong>${safeText(surah[0])}</strong>
                <small>${surah[3]} • ${surah[2]} Ayahs</small>
            </span>
            <span class="surah-arabic">${safeText(surah[1])}</span>
        `;

        item.addEventListener("click", () => openSurah(number));
        container.appendChild(item);
    });

    if (!filtered.length) {
        container.textContent = "No Surah found.";
    }
}

/* ---------- OPEN SURAH ---------- */

function openSurah(number) {
    const surah = surahs[number - 1];
    if (!surah) return;

    state.currentSurah = number;
    state.currentAyah = 1;

    const title = getElement("readerSurahName");
    const details = getElement("readerSurahDetails");

    if (title) title.textContent = surah[0] + " • " + surah[1];

    if (details) {
        details.textContent =
            `Surah ${number} • ${surah[2]} Ayahs • ${surah[3]}`;
    }

    renderReader();
    saveHistory();
    navigateTo("readerPage");
}

/* ---------- QURAN DATA CONNECTION ---------- */

// Real Quran Arabic text and verified translations will be
// loaded from local JSON files in the next development stage.
// This prevents displaying invented Quranic verses.

let quranData = null;
let urduData = null;
let englishData = null;

async function loadLocalQuranData() {
    try {
        const [quran, urdu, english] = await Promise.all([
            fetch("data/quran.json"),
            fetch("data/urdu.json"),
            fetch("data/english.json")
        ]);

        if (!quran.ok || !urdu.ok || !english.ok) {
            throw new Error("Local Quran files are not ready.");
        }

        quranData = await quran.json();
        urduData = await urdu.json();
        englishData = await english.json();

        showToast("Quran data loaded successfully.");
        renderReader();

    } catch (error) {
        console.info("Quran data will be connected in a later file.");
    }
}

/* ---------- QURAN READER ---------- */

function renderReader() {
    const container = getElement("ayahContainer");
    if (!container) return;

    const surahNumber = state.currentSurah;
    const surah = surahs[surahNumber - 1];

    container.innerHTML = "";

    if (!quranData) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>📖 Quran Reader</h3>
                <p>Arabic Quran and verified translations will appear here after the offline data files are added.</p>
                <p>Selected Surah: ${safeText(surah[0])}</p>
            </div>
        `;
        return;
    }

    const verses = quranData[surahNumber];

    if (!verses) {
        container.textContent = "Surah data not found.";
        return;
    }

    verses.forEach((verse, index) => {
        const ayahNumber = index + 1;

        const urdu = urduData?.[surahNumber]?.[index] || "";
        const english = englishData?.[surahNumber]?.[index] || "";

        const article = document.createElement("article");
        article.className = "ayah-card";

        let translations = "";

        if (state.translation === "both" || state.translation === "urdu") {
            translations += `
                <p class="translation urdu" dir="rtl">
                    ${safeText(urdu)}
                </p>`;
        }

        if (state.translation === "both" || state.translation === "english") {
            translations += `
                <p class="translation english">
                    ${safeText(english)}
                </p>`;
        }

        article.innerHTML = `
            <div class="ayah-heading">
                <span>Ayah ${ayahNumber}</span>
                <button class="ayah-bookmark" aria-label="Bookmark">
                    ☆
                </button>
            </div>
            <p class="arabic-text" dir="rtl"
               style="font-size:${state.fontSize}px">
                ${safeText(verse.text || verse)}
            </p>
            ${translations}
        `;

        article.querySelector(".ayah-bookmark").addEventListener("click", () => {
            addBookmark(surahNumber, ayahNumber);
        });

        container.appendChild(article);
    });
}

/* ---------- TRANSLATION SETTINGS ---------- */

function changeTranslation(language) {
    state.translation = language;
    DB.set("translation", language);
    renderReader();
    showToast("Translation updated.");
}

/* ---------- FONT SETTINGS ---------- */

function changeFontSize(amount) {
    state.fontSize = Math.max(18, Math.min(60, state.fontSize + amount));
    renderReader();
    showToast("Quran font size: " + state.fontSize);
}

/* ---------- BOOKMARK SYSTEM ---------- */

function addBookmark(surah, ayah) {
    const exists = state.bookmarks.some(
        item => item.surah === surah && item.ayah === ayah
    );

    if (exists) {
        showToast("Already bookmarked.");
        return;
    }

    state.bookmarks.push({
        surah,
        ayah,
        date: new Date().toISOString()
    });

    DB.set("bookmarks", state.bookmarks);
    updateStatistics();
    showToast("Bookmark saved successfully!");
    renderBookmarks();
}

function removeBookmark(surah, ayah) {
    state.bookmarks = state.bookmarks.filter(
        item => !(item.surah === surah && item.ayah === ayah)
    );

    DB.set("bookmarks", state.bookmarks);
    renderBookmarks();
    updateStatistics();
}

function renderBookmarks() {
    const container = getElement("bookmarkList");
    if (!container) return;

    container.innerHTML = "";

    state.bookmarks.forEach(item => {
        const surah = surahs[item.surah - 1];

        const button = document.createElement("button");
        button.className = "bookmark-item";
        button.innerHTML = `
            <strong>${safeText(surah[0])}</strong>
            <span>Ayah ${item.ayah}</span>
            <span>✕</span>
        `;

        button.addEventListener("click", () => {
            openSurah(item.surah);
            state.currentAyah = item.ayah;
        });

        container.appendChild(button);
    });

    if (!state.bookmarks.length) {
        container.textContent = "No bookmarks saved yet.";
    }
}

/* ---------- READING HISTORY ---------- */

function saveHistory() {
    state.readingHistory = {
        surah: state.currentSurah,
        ayah: state.currentAyah,
        date: new Date().toISOString()
    };

    DB.set("history", state.readingHistory);

    const name = getElement("lastSurahName");
    const details = getElement("lastReadingDetails");

    if (name) name.textContent = surahs[state.currentSurah - 1][0];

    if (details) {
        details.textContent = "Surah " + state.currentSurah +
            " • Ayah " + state.currentAyah;
    }
}

/* ---------- EXPORT / IMPORT BOOKMARKS ---------- */

function exportBookmarks() {
    const data = JSON.stringify(state.bookmarks, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "holy-quran-bookmarks.json";
    link.click();

    URL.revokeObjectURL(url);
    showToast("Bookmarks exported.");
}

function importBookmarks(file) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        try {
            const imported = JSON.parse(reader.result);

            if (!Array.isArray(imported)) throw new Error();

            state.bookmarks = imported.filter(item =>
                Number.isInteger(item.surah) &&
                Number.isInteger(item.ayah) &&
                item.surah >= 1 &&
                item.surah <= 114 &&
                item.ayah >= 1 &&
                item.ayah <= surahs[item.surah - 1][2]
            );

            DB.set("bookmarks", state.bookmarks);
            renderBookmarks();
            updateStatistics();
            showToast("Bookmarks imported.");

        } catch {
            showToast("Invalid bookmark file.");
        }
    };

    reader.readAsText(file);
}

/* ---------- HIFZ TRACKER ---------- */

function markMemorized() {
    const surahInput = getElement("hifzSurah");
    const ayahInput = getElement("hifzAyah");

    if (!surahInput || !ayahInput) return;

    const surah = Number(surahInput.value);
    const ayah = Number(ayahInput.value);

    if (
        !Number.isInteger(surah) ||
        !Number.isInteger(ayah) ||
        surah < 1 || surah > 114 ||
        ayah < 1 || ayah > surahs[surah - 1][2]
    ) {
        showToast("Enter a valid Surah and Ayah.");
        return;
    }

    const exists = state.memorized.some(
        item => item.surah === surah && item.ayah === ayah
    );

    if (exists) {
        showToast("This Ayah is already marked.");
        return;
    }

    state.memorized.push({
        surah,
        ayah,
        date: new Date().toISOString()
    });

    DB.set("memorized", state.memorized);
    renderHifz();
    showToast("Hifz progress saved.");
}

function renderHifz() {
    const list = getElement("hifzList");
    const progress = getElement("hifzProgress");
    const bar = getElement("hifzBar");
    const details = getElement("hifzDetails");

    const percentage = (state.memorized.length / 6236) * 100;

    if (progress) {
        progress.textContent = percentage.toFixed(2) + "%";
    }

    if (bar) bar.style.width = percentage + "%";

    if (details) {
        details.textContent =
            `${state.memorized.length} of 6236 Ayahs marked`;
    }

    if (!list) return;

    list.innerHTML = "";

    state.memorized.slice().reverse().forEach(item => {
        const name = surahs[item.surah - 1][0];

        const row = document.createElement("div");
        row.className = "hifz-item";
        row.textContent = `${name} • Ayah ${item.ayah}`;
        list.appendChild(row);
    });
}

/* ---------- QARI SELECTION ---------- */

function renderQaris() {
    const select = getElement("qariSelect");
    if (!select) return;

    select.innerHTML = "";

    qaris.forEach(qari => {
        const option = document.createElement("option");
        option.value = qari.id;
        option.textContent = qari.name;

        if (qari.id === state.qari) {
            option.selected = true;
        }

        select.appendChild(option);
    });
}

function changeQari(id) {
    const selected = qaris.find(qari => qari.id === id);
    if (!selected) return;

    state.qari = id;
    DB.set("qari", id);

    const name = getElement("audioQariName");
    if (name) name.textContent = selected.name;

    showToast("Qari selected: " + selected.name);
}

/* ---------- AUDIO PLAYER ---------- */

// Audio will use downloaded local MP3 files.
// Actual audio paths will be connected in a later stage.

function getAudioElement() {
    return getElement("quranAudio");
}

function playAudio() {
    const audio = getAudioElement();

    if (!audio || !audio.src) {
        showToast("Download Quran audio to listen offline.");
        return;
    }

    audio.play().catch(() => showToast("Audio could not be played."));
}

function pauseAudio() {
    const audio = getAudioElement();
    if (audio) audio.pause();
}

function setAudioSpeed(speed) {
    state.audioSpeed = Number(speed);

    const audio = getAudioElement();
    if (audio) audio.playbackRate = state.audioSpeed;

    showToast("Playback speed: " + state.audioSpeed + "x");
}

function toggleRepeat() {
    state.repeat = !state.repeat;

    const audio = getAudioElement();
    if (audio) audio.loop = state.repeat;

    showToast(state.repeat ? "Repeat enabled." : "Repeat disabled.");
}

function downloadCurrentAudio() {
    const audio = getAudioElement();

    if (!audio || !audio.src) {
        showToast("Audio file is not available yet.");
        return;
    }

    const link = document.createElement("a");
    link.href = audio.src;
    link.download = "quran-recitation.mp3";
    link.click();
}

/* ---------- AUDIO PROGRESS ---------- */

function updateAudioProgress() {
    const audio = getAudioElement();
    if (!audio) return;

    const progress = getElement("audioProgress");
    if (progress && audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }

    const current = getElement("audioCurrentTime");
    if (current) current.textContent = formatTime(audio.currentTime);

    const duration = getElement("audioDuration");
    if (duration && isFinite(audio.duration)) {
        duration.textContent = formatTime(audio.duration);
    }
}

function formatTime(seconds) {
    if (!isFinite(seconds)) return "00:00";

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    return String(min).padStart(2, "0") + ":" +
        String(sec).padStart(2, "0");
}

/* ---------- TASBEEH COUNTER ---------- */

function updateTasbeeh() {
    const display = getElement("tasbeehCount");
    if (display) display.textContent = state.tasbeeh;
}

function incrementTasbeeh() {
    state.tasbeeh++;
    DB.set("tasbeeh", state.tasbeeh);
    updateTasbeeh();
}

function resetTasbeeh() {
    state.tasbeeh = 0;
    DB.set("tasbeeh", 0);
    updateTasbeeh();
    showToast("Tasbeeh counter reset.");
}

/* ---------- THEME SETTINGS ---------- */

function applyTheme(theme) {
    state.theme = theme;
    DB.set("theme", theme);

    document.documentElement.setAttribute("data-theme", theme);

    document.body.classList.toggle("dark-mode", theme === "dark");
    document.body.classList.toggle("light-mode", theme === "light");
}

function toggleTheme() {
    applyTheme(state.theme === "dark" ? "light" : "dark");
    showToast("Theme changed.");
}

/* ---------- AUTO SCROLL ---------- */

function toggleAutoScroll() {
    state.autoScroll = !state.autoScroll;

    if (state.autoScroll) {
        window.autoScrollTimer = setInterval(() => {
            window.scrollBy({
                top: 1,
                behavior: "auto"
            });
        }, 60);

        showToast("Auto scroll started.");
    } else {
        clearInterval(window.autoScrollTimer);
        showToast("Auto scroll stopped.");
    }
}

/* ---------- AYAH NAVIGATION ---------- */

function nextAyah() {
    const max = surahs[state.currentSurah - 1][2];

    if (state.currentAyah < max) {
        state.currentAyah++;
    } else if (state.currentSurah < 114) {
        state.currentSurah++;
        state.currentAyah = 1;
    }

    saveHistory();
    showToast("Ayah " + state.currentAyah);
}

function previousAyah() {
    if (state.currentAyah > 1) {
        state.currentAyah--;
    } else if (state.currentSurah > 1) {
        state.currentSurah--;
        state.currentAyah = surahs[state.currentSurah - 1][2];
    }

    saveHistory();
    showToast("Ayah " + state.currentAyah);
}

/* ---------- STATISTICS ---------- */

function updateStatistics() {
    const bookmarks = getElement("bookmarkCount");
    const reads = getElement("readCount");
    const audio = getElement("audioCount");

    if (bookmarks) bookmarks.textContent = state.bookmarks.length;
    if (reads) reads.textContent = state.readingHistory ? 1 : 0;
    if (audio) audio.textContent = "0";
}

/* ---------- SEARCH ---------- */

function setupSearch() {
    const search = getElement("surahSearch");

    if (search) {
        search.addEventListener("input", event => {
            renderSurahs(event.target.value);
        });
    }

    const audioSearch = getElement("audioSurahSearch");

    if (audioSearch) {
        audioSearch.addEventListener("input", event => {
            renderAudioSurahs(event.target.value);
        });
    }
}

function renderAudioSurahs(search = "") {
    const container = getElement("audioSurahList");
    if (!container) return;

    container.innerHTML = "";

    surahs.forEach((surah, index) => {
        if (
            !surah[0].toLowerCase().includes(search.toLowerCase()) &&
            !String(index + 1).includes(search)
        ) return;

        const button = document.createElement("button");
        button.className = "audio-surah-item";
        button.textContent = `${index + 1}. ${surah[0]}`;

        button.addEventListener("click", () => {
            state.currentSurah = index + 1;
            const title = getElement("audioTitle");
            if (title) title.textContent = surah[0];

            showToast("Selected " + surah[0] +
                ". Downloaded audio will be connected later.");
        });

        container.appendChild(button);
    });
}

/* ---------- PRAYER / QIBLA PLACEHOLDERS ---------- */

function openPrayer() {
    showToast("Prayer times module will be added in the next stage.");
}

function openQibla() {
    showToast("Qibla compass module will be added in the next stage.");
}

/* ---------- BUTTON EVENT CONNECTIONS ---------- */

function connectButtons() {

    // Navigation
    document.querySelectorAll("[data-page]").forEach(button => {
        button.addEventListener("click", () => {
            navigateTo(button.dataset.page);
        });
    });

    // Home
    getElement("continueReadingBtn")?.addEventListener("click", () => {
        const history = state.readingHistory;
        if (history) {
            state.currentSurah = history.surah;
            state.currentAyah = history.ayah;
            openSurah(history.surah);
        } else {
            openSurah(1);
        }
    });

    getElement("dailyAyahRefresh")?.addEventListener("click", () => {
        showToast("Daily Ayah data will be connected soon.");
    });

    // Reader
    getElement("readerBookmarkBtn")?.addEventListener("click", () => {
        addBookmark(state.currentSurah, state.currentAyah);
    });

    getElement("fontIncrease")?.addEventListener("click", () => {
        changeFontSize(2);
    });

    getElement("fontDecrease")?.addEventListener("click", () => {
        changeFontSize(-2);
    });

    getElement("translationLanguage")?.addEventListener("change", event => {
        changeTranslation(event.target.value);
    });

    getElement("previousAyah")?.addEventListener("click", previousAyah);
    getElement("nextAyah")?.addEventListener("click", nextAyah);

    getElement("autoScrollBtn")?.addEventListener("click", toggleAutoScroll);

    // Bookmarks
    getElement("exportBookmarks")?.addEventListener("click", exportBookmarks);

    getElement("importBookmarks")?.addEventListener("click", () => {
        getElement("bookmarkFile")?.click();
    });

    getElement("bookmarkFile")?.addEventListener("change", event => {
        importBookmarks(event.target.files[0]);
    });

    // Hifz
    getElement("markMemorized")?.addEventListener("click", markMemorized);

    // Audio
    getElement("qariSelect")?.addEventListener("change", event => {
        changeQari(event.target.value);
    });

    getElement("repeatAudio")?.addEventListener("click", toggleRepeat);
    getElement("downloadAudio")?.addEventListener("click", downloadCurrentAudio);

    getElement("audioSpeed")?.addEventListener("change", event => {
        setAudioSpeed(event.target.value);
    });

    const audio = getAudioElement();

    if (audio) {
        audio.addEventListener("timeupdate", updateAudioProgress);
        audio.addEventListener("ended", () => {
            if (state.repeat) audio.play();
        });
    }

    // Audio controls
    getElement("playAudio")?.addEventListener("click", playAudio);
    getElement("pauseAudio")?.addEventListener("click", pauseAudio);

    // Theme
    getElement("themeBtn")?.addEventListener("click", toggleTheme);

    // Prayer / Qibla
    getElement("prayerBtn")?.addEventListener("click", openPrayer);
    getElement("qiblaBtn")?.addEventListener("click", openQibla);

    // Tasbeeh
    getElement("tasbeehButton")?.addEventListener("click", incrementTasbeeh);
    getElement("tasbeehReset")?.addEventListener("click", resetTasbeeh);
}

/* ---------- APP INITIALIZATION ---------- */

function initializeApp() {
    applyTheme(state.theme);

    renderSurahs();
    renderAudioSurahs();
    renderQaris();
    renderBookmarks();
    renderHifz();

    setupSearch();
    connectButtons();
    updateStatistics();
    updateTasbeeh();

    // Load previously saved reading progress
    if (state.readingHistory) {
        const name = getElement("lastSurahName");
        const details = getElement("lastReadingDetails");

        if (name) {
            name.textContent =
                surahs[state.readingHistory.surah - 1][0];
        }

        if (details) {
            details.textContent =
                "Surah " + state.readingHistory.surah +
                " • Ayah " + state.readingHistory.ayah;
        }
    }

    // Connect local Quran data when the data files exist
    loadLocalQuranData();

    // Hide loading screen
    getElement("appLoader")?.classList.add("hidden");

    showToast("Holy Quran Ultimate is ready.");
}

/* ---------- START APPLICATION ---------- */

document.addEventListener("DOMContentLoaded", initializeApp);

// HOLY QURAN ULTIMATE
// Offline System Registration

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration =
        await navigator.serviceWorker.register(
          "./service-worker.js"
        );

      console.log(
        "Offline system activated!",
        registration.scope
      );
    } catch (error) {
      console.error(
        "Offline system registration failed:",
        error
      );
    }
  });
}

/* =====================================
   HOLY QURAN ULTIMATE
   FILE 13 - QURAN DATA CONNECTION
===================================== */

(function () {
  "use strict";

  let surahData = [];
  let arabicData = {};
  let urduData = {};
  let englishData = {};
  let currentSurah = 1;

  const getElement = (id) =>
    document.getElementById(id);

  async function loadQuranFiles() {
    try {
      const files = await Promise.all([
        fetch("./data/surahs.json").then(r => {
          if (!r.ok) throw new Error("Surah file error");
          return r.json();
        }),
        fetch("./data/quran.json").then(r => {
          if (!r.ok) throw new Error("Quran file error");
          return r.json();
        }),
        fetch("./data/urdu.json").then(r => {
          if (!r.ok) throw new Error("Urdu file error");
          return r.json();
        }),
        fetch("./data/english.json").then(r => {
          if (!r.ok) throw new Error("English file error");
          return r.json();
        })
      ]);

      surahData = files[0].surahs;
      arabicData = files[1];
      urduData = files[2];
      englishData = files[3];

      showSurahList();
      openSurah(1);

      console.log("Quran data loaded successfully!");

    } catch (error) {
      console.error("Quran loading error:", error);

      const list = getElement("surahList");
      if (list) {
        list.textContent =
          "Quran data could not load. Please check your files.";
      }
    }
  }

  function showSurahList(filter = "") {
    const list = getElement("surahList");
    if (!list) return;

    list.innerHTML = "";

    const results = surahData.filter(surah =>
      surah.name.toLowerCase().includes(filter.toLowerCase()) ||
      surah.arabic.includes(filter)
    );

    results.forEach(surah => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "surah-item";
      button.innerHTML = `
        <span>${surah.id}. ${surah.name}</span>
        <span>${surah.arabic}</span>
        <small>${surah.ayahs} Ayahs · ${surah.type}</small>
      `;

      button.addEventListener("click", () => {
        openSurah(surah.id);
      });

      list.appendChild(button);
    });
  }

  function openSurah(id) {
    currentSurah = id;

    const surah = surahData.find(s => s.id === id);
    if (!surah) return;

    const name = getElement("readerSurahName");
    const details = getElement("readerSurahDetails");
    const container = getElement("ayahContainer");

    if (name) {
      name.textContent =
        surah.arabic + " — " + surah.name;
    }

    if (details) {
      details.textContent =
        surah.ayahs + " Ayahs · " + surah.type;
    }

    if (!container) return;

    container.innerHTML = "";

    const arabic = arabicData[String(id)] || [];
    const urdu = urduData[String(id)] || [];
    const english = englishData[String(id)] || [];

    if (arabic.length === 0) {
      container.textContent =
        "Is Surah ka verified Arabic data abhi add nahi hua. Please check back later.";
      return;
    }

    const language =
      getElement("translationLanguage")?.value || "urdu";

    arabic.forEach((ayah, index) => {
      const card = document.createElement("article");
      card.className = "ayah-card";

      const arabicText = document.createElement("p");
      arabicText.className = "ayah-arabic";
      arabicText.dir = "rtl";
      arabicText.textContent = ayah;

      const number = document.createElement("small");
      number.textContent = "Ayah " + (index + 1);

      card.appendChild(number);
      card.appendChild(arabicText);

      const translation = document.createElement("p");
      translation.className = "ayah-translation";

      if (language === "english") {
        translation.textContent =
          english[index] || "Translation not available.";
      } else {
        translation.textContent =
          urdu[index] || "ترجمہ دستیاب نہیں ہے۔";
      }

      card.appendChild(translation);
      container.appendChild(card);
    });
  }

  const search = getElement("surahSearch");

  if (search) {
    search.addEventListener("input", () => {
      showSurahList(search.value);
    });
  }

  const languageSelect =
    getElement("translationLanguage");

  if (languageSelect) {
    languageSelect.addEventListener("change", () => {
      openSurah(currentSurah);
    });
  }

  window.addEventListener("DOMContentLoaded", loadQuranFiles);

})();

/* =====================================
   HOLY QURAN ULTIMATE
   FILE 15 - READING CONTROLS
===================================== */

(function () {
  "use strict";

  function setupReadingControls() {
    const reader = document.getElementById("ayahContainer");

    if (!reader || document.getElementById("readingToolbar")) {
      return;
    }

    let fontSize = 29;

    const toolbar = document.createElement("div");
    toolbar.id = "readingToolbar";
    toolbar.className = "reading-toolbar";

    const label = document.createElement("span");
    label.textContent = "Arabic Text Size";

    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.textContent = "A−";
    decrease.setAttribute("aria-label", "Decrease Arabic font size");

    const sizeDisplay = document.createElement("span");
    sizeDisplay.textContent = fontSize + "px";

    const increase = document.createElement("button");
    increase.type = "button";
    increase.textContent = "A+";
    increase.setAttribute("aria-label", "Increase Arabic font size");

    const reset = document.createElement("button");
    reset.type = "button";
    reset.textContent = "Reset";

    function applyFontSize() {
      document.querySelectorAll(".ayah-arabic").forEach((ayah) => {
        ayah.style.fontSize = fontSize + "px";
      });

      sizeDisplay.textContent = fontSize + "px";
    }

    decrease.addEventListener("click", () => {
      fontSize = Math.max(20, fontSize - 2);
      applyFontSize();
    });

    increase.addEventListener("click", () => {
      fontSize = Math.min(48, fontSize + 2);
      applyFontSize();
    });

    reset.addEventListener("click", () => {
      fontSize = 29;
      applyFontSize();
    });

    toolbar.append(
      label,
      decrease,
      sizeDisplay,
      increase,
      reset
    );

    reader.parentNode.insertBefore(toolbar, reader);

    const observer = new MutationObserver(applyFontSize);

    observer.observe(reader, {
      childList: true
    });

    applyFontSize();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      setupReadingControls
    );
  } else {
    setupReadingControls();
  }

})();

/* =====================================
   FILE 16: BOOKMARK & LAST READ SYSTEM
===================================== */

(function () {
  const container = document.getElementById("ayahContainer");
  const surahList = document.getElementById("surahList");

  if (!container) return;

  let currentSurah = 1;

  const getBookmarks = () => {
    try {
      return JSON.parse(localStorage.getItem("hquBookmarks")) || [];
    } catch {
      return [];
    }
  };

  const saveBookmarks = (items) => {
    localStorage.setItem("hquBookmarks", JSON.stringify(items));
  };

  const getLastRead = () => {
    try {
      return JSON.parse(localStorage.getItem("hquLastRead"));
    } catch {
      return null;
    }
  };

  // Bookmark and Last Read panel
  const panel = document.createElement("section");
  panel.id = "bookmarkPanel";

  panel.innerHTML = `
    <h3>⭐ My Quran Bookmarks</h3>
    <p id="bookmarkCount">Saved: 0</p>
    <div id="bookmarkList"></div>

    <div class="last-read-box">
      <h3>📖 Last Read</h3>
      <p id="lastReadText">No reading history yet.</p>
      <button id="resumeReading">Continue Reading</button>
    </div>
  `;

  container.parentNode.insertBefore(panel, container);

  const bookmarkList = document.getElementById("bookmarkList");

  function updateBookmarkPanel() {
    const bookmarks = getBookmarks();

    document.getElementById("bookmarkCount").textContent =
      "Saved: " + bookmarks.length;

    bookmarkList.innerHTML = "";

    if (bookmarks.length === 0) {
      bookmarkList.innerHTML =
        "<p>No bookmarks saved yet.</p>";
    }

    bookmarks.forEach((item) => {
      const row = document.createElement("div");
      row.className = "bookmark-row";

      const label = document.createElement("span");
      label.textContent =
        "Surah " + item.surah + " — Ayah " + item.ayah;

      const remove = document.createElement("button");
      remove.textContent = "Remove";

      remove.addEventListener("click", () => {
        saveBookmarks(
          getBookmarks().filter(
            b => !(b.surah === item.surah && b.ayah === item.ayah)
          )
        );
        updateBookmarkPanel();
        decorateAyahs();
      });

      row.append(label, remove);
      bookmarkList.appendChild(row);
    });

    const lastRead = getLastRead();

    document.getElementById("lastReadText").textContent =
      lastRead
        ? `Surah ${lastRead.surah}, Ayah ${lastRead.ayah}`
        : "No reading history yet.";
  }

  function saveReadingPosition(ayah) {
    const position = {
      surah: currentSurah,
      ayah: ayah
    };

    localStorage.setItem(
      "hquLastRead",
      JSON.stringify(position)
    );

    updateBookmarkPanel();
  }

  function decorateAyahs() {
    const cards = container.querySelectorAll(".ayah-card");
    const bookmarks = getBookmarks();

    cards.forEach((card, index) => {
      const ayahNumber = index + 1;

      card.dataset.ayahNumber = ayahNumber;

      if (!card.querySelector(".ayah-bookmark-btn")) {
        const button = document.createElement("button");

        button.className = "ayah-bookmark-btn";
        button.type = "button";

        card.appendChild(button);
      }

      const button = card.querySelector(".ayah-bookmark-btn");

      const saved = bookmarks.some(
        b => b.surah === currentSurah && b.ayah === ayahNumber
      );

      button.textContent = saved
        ? "⭐ Bookmarked"
        : "☆ Save Bookmark";

      button.onclick = (event) => {
        event.stopPropagation();

        let updated = getBookmarks();

        const exists = updated.some(
          b => b.surah === currentSurah && b.ayah === ayahNumber
        );

        if (exists) {
          updated = updated.filter(
            b => !(b.surah === currentSurah && b.ayah === ayahNumber)
          );
        } else {
          updated.push({
            surah: currentSurah,
            ayah: ayahNumber
          });
        }

        saveBookmarks(updated);
        updateBookmarkPanel();
        decorateAyahs();
      };

      card.onclick = () => {
        saveReadingPosition(ayahNumber);
      };
    });
  }

  // Detect selected Surah
  if (surahList) {
    surahList.addEventListener("click", (event) => {
      const item = event.target.closest(".surah-item");
      if (!item) return;

      const match = item.textContent.match(/^\s*(\d+)/);

      if (match) {
        currentSurah = Number(match[1]);
      }

      setTimeout(decorateAyahs, 100);
    });
  }

  // Watch for new Ayah cards
  const observer = new MutationObserver(() => {
    decorateAyahs();
  });

  observer.observe(container, {
    childList: true,
    subtree: true
  });

  // Continue from last read
  document.getElementById("resumeReading").onclick = () => {
    const lastRead = getLastRead();

    if (!lastRead) {
      alert("No saved reading position yet.");
      return;
    }

    currentSurah = lastRead.surah;

    const surahItems = surahList
      ? surahList.querySelectorAll(".surah-item")
      : [];

    const target = Array.from(surahItems).find(item => {
      const match = item.textContent.match(/^\s*(\d+)/);
      return match && Number(match[1]) === lastRead.surah;
    });

    if (target) {
      target.click();

      setTimeout(() => {
        const ayah = container.querySelector(
          `[data-ayah-number="${lastRead.ayah}"]`
        );

        if (ayah) {
          ayah.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, 500);
    } else {
      alert("Please select the saved Surah from the Surah list.");
    }
  };

  updateBookmarkPanel();
  decorateAyahs();

})();

/* =====================================
   FILE 19: PROFESSIONAL QURAN AUDIO PLAYER
===================================== */

(function () {
  const reader = document.getElementById("ayahContainer");
  if (!reader) return;

  if (document.getElementById("hquAudioPlayer")) return;

  const player = document.createElement("section");
  player.id = "hquAudioPlayer";

  player.innerHTML = `
    <h3>🎧 Quran Audio Player</h3>

    <label for="hquQariSelect">Choose Qari</label>
    <select id="hquQariSelect">
      <option value="">Loading Qaris...</option>
    </select>

    <p id="hquQariName">Select your favourite Qari</p>

    <audio id="hquAudio" preload="metadata"></audio>

    <div class="hqu-audio-controls">
      <button id="hquBack" type="button">⏪ 10s</button>
      <button id="hquPlay" type="button">▶ Play</button>
      <button id="hquForward" type="button">10s ⏩</button>
    </div>

    <input
      id="hquProgress"
      type="range"
      min="0"
      max="100"
      value="0"
    >

    <div class="hqu-audio-time">
      <span id="hquCurrentTime">00:00</span>
      <span id="hquDuration">00:00</span>
    </div>

    <p id="hquAudioMessage">
      Select a Qari to begin.
    </p>
  `;

  reader.parentNode.insertBefore(player, reader);

  const audio = document.getElementById("hquAudio");
  const select = document.getElementById("hquQariSelect");
  const play = document.getElementById("hquPlay");
  const progress = document.getElementById("hquProgress");
  const message = document.getElementById("hquAudioMessage");

  let qaris = [];

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    return String(min).padStart(2, "0") + ":" +
      String(sec).padStart(2, "0");
  }

  async function loadQaris() {
    try {
      const response = await fetch("./data/qaris.json");

      if (!response.ok) throw new Error("Qari file not found");

      const data = await response.json();
      qaris = data.qaris || [];

      select.innerHTML = "";

      qaris.forEach(qari => {
        const option = document.createElement("option");
        option.value = qari.id;
        option.textContent = qari.name;
        select.appendChild(option);
      });

      select.value = data.selectedQari || "mishary";

      if (!select.value && qaris.length) {
        select.selectedIndex = 0;
      }

      select.dispatchEvent(new Event("change"));

    } catch (error) {
      select.innerHTML = "<option>Qaris unavailable</option>";
      message.textContent = "Could not load Qari list.";
    }
  }

  function selectQari() {
    const qari = qaris.find(item => item.id === select.value);

    audio.pause();
    audio.removeAttribute("src");
    audio.load();

    play.textContent = "▶ Play";
    progress.value = 0;

    document.getElementById("hquQariName").textContent =
      qari ? qari.name : "No Qari selected";

    document.getElementById("hquCurrentTime").textContent = "00:00";
    document.getElementById("hquDuration").textContent = "00:00";

    if (!qari || !qari.audioSource) {
      message.textContent =
        "Audio link is not added yet. Add a verified audio URL to enable playback.";
      return;
    }

    audio.src = qari.audioSource;
    message.textContent = "Qari selected. Press Play to listen.";
  }

  select.addEventListener("change", selectQari);

  play.addEventListener("click", async () => {
    if (!audio.src) {
      message.textContent = "No audio source available yet.";
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        play.textContent = "⏸ Pause";
        message.textContent = "Now playing Quran recitation.";
      } catch (error) {
        message.textContent = "Audio could not play. Check the audio link.";
      }
    } else {
      audio.pause();
      play.textContent = "▶ Play";
    }
  });

  document.getElementById("hquBack").addEventListener("click", () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });

  document.getElementById("hquForward").addEventListener("click", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = Math.min(
        audio.duration,
        audio.currentTime + 10
      );
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      progress.value = (audio.currentTime / audio.duration) * 100;
    }

    document.getElementById("hquCurrentTime").textContent =
      formatTime(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    document.getElementById("hquDuration").textContent =
      formatTime(audio.duration);
  });

  progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (Number(progress.value) / 100) * audio.duration;
    }
  });

  audio.addEventListener("ended", () => {
    play.textContent = "▶ Play";
    message.textContent = "Recitation completed.";
  });

  audio.addEventListener("error", () => {
    play.textContent = "▶ Play";
    message.textContent = "Audio unavailable. Please check its URL.";
  });

  loadQaris();
})();

/* =====================================
   FILE 22: SURAH AUDIO CONNECTION
===================================== */

(function () {
  const audio = document.getElementById("hquAudio");
  const qariSelect = document.getElementById("hquQariSelect");
  const surahList = document.getElementById("surahList");
  const message = document.getElementById("hquAudioMessage");
  const playButton = document.getElementById("hquPlay");

  if (!audio || !qariSelect || !message) return;

  let audioLibrary = [];
  let currentSurah = 1;

  async function loadAudioLibrary() {
    try {
      const response = await fetch("./data/audio-library.json");

      if (!response.ok) {
        throw new Error("Audio library not found");
      }

      const data = await response.json();
      audioLibrary = data.qaris || [];

      connectAudio();
    } catch (error) {
      message.textContent =
        "Audio library could not be loaded.";
    }
  }

  function connectAudio() {
    const selectedQari = qariSelect.value;

    const qari = audioLibrary.find(
      item => item.id === selectedQari
    );

    if (!qari) {
      message.textContent = "Please select a Qari.";
      return;
    }

    const audioURL = qari.surahs?.[String(currentSurah)];

    audio.pause();
    audio.removeAttribute("src");
    audio.load();

    if (!audioURL || !audioURL.trim()) {
      if (playButton) playButton.textContent = "▶ Play";

      message.textContent =
        "Verified audio for this Surah is not added yet.";

      return;
    }

    audio.src = audioURL;
    audio.load();

    message.textContent =
      qari.name + " — Surah " + currentSurah +
      " is ready to play.";
  }

  // Detect selected Surah
  if (surahList) {
    surahList.addEventListener("click", event => {
      const item = event.target.closest(".surah-item");

      if (!item) return;

      const match = item.textContent.match(/^\s*(\d+)/);

      if (match) {
        currentSurah = Number(match[1]);
        connectAudio();
      }
    });
  }

  // Detect selected Qari
  qariSelect.addEventListener("change", connectAudio);

  loadAudioLibrary();

})();

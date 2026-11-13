
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

/* =====================================
   FILE 24: 114 SURAH AUDIO SELECTION
===================================== */

(function () {
  const player = document.getElementById("hquAudioPlayer");
  const surahList = document.getElementById("surahList");

  if (!player || !surahList) return;

  if (document.getElementById("hquSurahSelect")) return;

  const section = document.createElement("div");
  section.id = "hquSurahSelection";

  section.innerHTML = `
    <label for="hquSurahSelect">
      📖 Select Surah for Recitation
    </label>
    <select id="hquSurahSelect">
      <option value="">Loading Surahs...</option>
    </select>
  `;

  const qariSelect = document.getElementById("hquQariSelect");

  if (qariSelect) {
    qariSelect.insertAdjacentElement("afterend", section);
  } else {
    player.appendChild(section);
  }

  const select = document.getElementById("hquSurahSelect");

  function updateSurahOptions() {
    const items = surahList.querySelectorAll(".surah-item");

    if (!items.length) return;

    const previousValue = select.value;
    select.innerHTML = "";

    items.forEach(item => {
      const match = item.textContent.match(/^\s*(\d+)/);
      if (!match) return;

      const number = Number(match[1]);

      const option = document.createElement("option");
      option.value = number;
      option.textContent = item.textContent.trim();

      select.appendChild(option);
    });

    if (previousValue && select.querySelector(
      `option[value="${previousValue}"]`
    )) {
      select.value = previousValue;
    }
  }

  select.addEventListener("change", () => {
    const number = Number(select.value);
    if (!number) return;

    const items = surahList.querySelectorAll(".surah-item");

    const target = Array.from(items).find(item => {
      const match = item.textContent.match(/^\s*(\d+)/);
      return match && Number(match[1]) === number;
    });

    if (target) {
      target.click();
    }
  });

  const observer = new MutationObserver(updateSurahOptions);

  observer.observe(surahList, {
    childList: true,
    subtree: true
  });

  updateSurahOptions();

})();

/* =====================================
   FILE 27: DIGITAL TASBEEH JAVASCRIPT
===================================== */

(function () {
  const countDisplay = document.getElementById("tasbeehCount");
  const dhikrDisplay = document.getElementById("tasbeehDhikr");
  const countButton = document.getElementById("tasbeehIncrement");
  const resetButton = document.getElementById("tasbeehReset");
  const message = document.getElementById("tasbeehMessage");
  const targetDisplay = document.getElementById("tasbeehTarget");

  if (!countDisplay || !countButton || !resetButton) return;

  const target = 100;
  let selectedDhikr = "سبحان الله";

  let counts = {};

  try {
    counts = JSON.parse(
      localStorage.getItem("hquTasbeehCounts")
    ) || {};
  } catch {
    counts = {};
  }

  function currentCount() {
    return Number(counts[selectedDhikr]) || 0;
  }

  function saveCounts() {
    localStorage.setItem(
      "hquTasbeehCounts",
      JSON.stringify(counts)
    );
  }

  function updateDisplay() {
    countDisplay.textContent = currentCount();
    dhikrDisplay.textContent = selectedDhikr;
    targetDisplay.textContent = target;
  }

  document.querySelectorAll(".tasbeeh-type").forEach(button => {
    button.addEventListener("click", () => {
      selectedDhikr = button.dataset.dhikr;

      document.querySelectorAll(".tasbeeh-type")
        .forEach(item => item.classList.remove("active"));

      button.classList.add("active");

      message.textContent = "Selected: " + selectedDhikr;
      updateDisplay();
    });
  });

  countButton.addEventListener("click", () => {
    counts[selectedDhikr] = currentCount() + 1;

    saveCounts();
    updateDisplay();

    if (currentCount() === target) {
      message.textContent =
        "Alhamdulillah! Your 100-count target is complete.";
    } else {
      message.textContent = "Keep remembering Allah.";
    }
  });

  resetButton.addEventListener("click", () => {
    counts[selectedDhikr] = 0;

    saveCounts();
    updateDisplay();

    message.textContent = "Counter reset successfully.";
  });

  updateDisplay();

})();

/* =====================================
   FILE 30: DAILY TASBEEH STATISTICS
===================================== */

(function () {
  const countButton = document.getElementById("tasbeehIncrement");
  const todayDisplay = document.getElementById("todayTasbeehCount");
  const goalInput = document.getElementById("dailyTasbeehGoal");
  const saveGoalButton = document.getElementById("saveTasbeehGoal");
  const progressBar = document.getElementById("goalProgressBar");
  const progressText = document.getElementById("goalProgressText");
  const completedDisplay = document.getElementById("completedTasbeehDays");

  if (
    !countButton ||
    !todayDisplay ||
    !goalInput ||
    !saveGoalButton ||
    !progressBar
  ) return;

  const today = new Date().toLocaleDateString("en-CA");

  function readStorage(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  let dailyRecords = readStorage("hquDailyTasbeeh", {});
  let goal = Number(localStorage.getItem("hquDailyGoal")) || 100;

  if (!Number.isFinite(goal) || goal < 1) goal = 100;

  function updateStatistics() {
    const todayCount = Number(dailyRecords[today]) || 0;
    const percentage = Math.min(100, (todayCount / goal) * 100);

    todayDisplay.textContent = todayCount;
    goalInput.value = goal;

    progressBar.style.width = percentage + "%";

    progressText.textContent =
      Math.round(percentage) + "% completed (" +
      todayCount + " / " + goal + ")";

    const completedDays = Object.values(dailyRecords)
      .filter(count => Number(count) >= goal)
      .length;

    completedDisplay.textContent = completedDays;
  }

  // Count every Tasbeeh button press
  countButton.addEventListener("click", () => {
    dailyRecords[today] =
      (Number(dailyRecords[today]) || 0) + 1;

    localStorage.setItem(
      "hquDailyTasbeeh",
      JSON.stringify(dailyRecords)
    );

    updateStatistics();
  });

  // Save daily goal
  saveGoalButton.addEventListener("click", () => {
    const newGoal = Number(goalInput.value);

    if (
      !Number.isInteger(newGoal) ||
      newGoal < 1 ||
      newGoal > 100000
    ) {
      alert("Please enter a goal between 1 and 100000.");
      return;
    }

    goal = newGoal;

    localStorage.setItem("hquDailyGoal", goal);

    updateStatistics();

    alert("Daily goal saved successfully!");
  });

  updateStatistics();

})();

/* =========================================
   FILE 33: QURAN HIFZ TRACKER
========================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "hquHifzProgress";

  const surahSelect = document.getElementById("hifzSurahSelect");
  const juzSelect = document.getElementById("hifzJuzSelect");

  const markSurahBtn = document.getElementById("hifzMarkSurah");
  const markJuzBtn = document.getElementById("hifzMarkJuz");

  const surahList = document.getElementById("hifzSurahList");
  const juzList = document.getElementById("hifzJuzList");

  const surahMessage = document.getElementById("hifzSurahMessage");
  const juzMessage = document.getElementById("hifzJuzMessage");

  const surahProgress = document.getElementById("hifzSurahProgress");
  const juzProgress = document.getElementById("hifzJuzProgress");
  const progressBar = document.getElementById("hifzProgressBar");
  const overallProgress = document.getElementById("hifzOverallProgress");

  if (!surahSelect || !juzSelect || !markSurahBtn || !markJuzBtn) {
    return;
  }

  let hifzData = {
    surahs: [],
    juz: []
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && Array.isArray(saved.surahs) && Array.isArray(saved.juz)) {
      hifzData = saved;
    }
  } catch (error) {
    console.warn("Hifz data could not be loaded.", error);
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hifzData));
    } catch (error) {
      console.warn("Hifz data could not be saved.", error);
    }
  }

  function showMessage(element, message) {
    if (element) {
      element.textContent = message;
    }
  }

  function updateProgress() {
    const surahCount = hifzData.surahs.length;
    const juzCount = hifzData.juz.length;

    const total = surahCount + juzCount;
    const percentage = Math.round((total / 144) * 100);

    surahProgress.textContent = surahCount + " / 114";
    juzProgress.textContent = juzCount + " / 30";

    progressBar.style.width = percentage + "%";
    overallProgress.textContent = percentage + "% Completed";
  }

  function createListItem(parent, label, type, value) {
    const item = document.createElement("div");
    item.className = "hifz-list-item";

    const name = document.createElement("span");
    name.textContent = "✓ " + label;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.className = "hifz-remove-btn";

    removeButton.addEventListener("click", function () {
      if (type === "surah") {
        hifzData.surahs = hifzData.surahs.filter(
          number => number !== value
        );
      } else {
        hifzData.juz = hifzData.juz.filter(
          number => number !== value
        );
      }

      saveData();
      renderLists();
      updateProgress();
    });

    item.appendChild(name);
    item.appendChild(removeButton);
    parent.appendChild(item);
  }

  function renderLists() {
    surahList.replaceChildren();
    juzList.replaceChildren();

    if (hifzData.surahs.length === 0) {
      surahList.textContent = "No Surahs marked yet.";
    } else {
      hifzData.surahs.forEach(number => {
        const option = Array.from(surahSelect.options).find(
          item => Number(item.value) === number
        );

        const name = option ? option.textContent : "Surah " + number;

        createListItem(surahList, name, "surah", number);
      });
    }

    if (hifzData.juz.length === 0) {
      juzList.textContent = "No Juz completed yet.";
    } else {
      hifzData.juz.forEach(number => {
        createListItem(juzList, "Juz " + number, "juz", number);
      });
    }
  }

  async function loadSurahs() {
    try {
      const response = await fetch("./data/surahs.json");

      if (!response.ok) {
        throw new Error("Surah data unavailable");
      }

      const data = await response.json();

      const surahs = Array.isArray(data)
        ? data
        : Array.isArray(data.surahs)
          ? data.surahs
          : Object.values(data);

      surahSelect.innerHTML = '<option value="">Select Surah</option>';

      surahs.forEach((surah, index) => {
        if (!surah || typeof surah !== "object") return;

        const number = Number(
          surah.number || surah.id || surah.surahNumber || index + 1
        );

        const name =
          surah.englishName ||
          surah.nameEnglish ||
          surah.name ||
          surah.english_name ||
          ("Surah " + number);

        if (!Number.isInteger(number) || number < 1 || number > 114) {
          return;
        }

        const option = document.createElement("option");
        option.value = number;
        option.textContent = number + ". " + name;

        surahSelect.appendChild(option);
      });

      renderLists();

    } catch (error) {
      surahSelect.innerHTML =
        '<option value="">Could not load Surahs</option>';

      showMessage(
        surahMessage,
        "Please check that data/surahs.json exists."
      );

      console.error("Hifz Surah loading error:", error);
    }
  }

  markSurahBtn.addEventListener("click", function () {
    const number = Number(surahSelect.value);

    if (!number) {
      showMessage(surahMessage, "Please select a Surah first.");
      return;
    }

    if (hifzData.surahs.includes(number)) {
      showMessage(surahMessage, "This Surah is already marked.");
      return;
    }

    hifzData.surahs.push(number);
    hifzData.surahs.sort((a, b) => a - b);

    saveData();
    renderLists();
    updateProgress();

    showMessage(surahMessage, "Surah successfully saved! ✓");
    surahSelect.value = "";
  });

  markJuzBtn.addEventListener("click", function () {
    const number = Number(juzSelect.value);

    if (!Number.isInteger(number) || number < 1 || number > 30) {
      showMessage(juzMessage, "Please select a Juz first.");
      return;
    }

    if (hifzData.juz.includes(number)) {
      showMessage(juzMessage, "This Juz is already marked.");
      return;
    }

    hifzData.juz.push(number);
    hifzData.juz.sort((a, b) => a - b);

    saveData();
    renderLists();
    updateProgress();

    showMessage(juzMessage, "Juz successfully saved! ✓");
    juzSelect.value = "";
  });

  loadSurahs();
  updateProgress();

})();

/* =========================================
   FILE 35: HIFZ TRACKER IMPROVEMENTS
========================================= */

(function () {
  "use strict";

  const KEY = "hquHifzProgress";

  const surahSelect = document.getElementById("hifzSurahSelect");
  const juzSelect = document.getElementById("hifzJuzSelect");

  const surahCount = document.getElementById("hifzSurahProgress");
  const juzCount = document.getElementById("hifzJuzProgress");
  const progressBar = document.getElementById("hifzProgressBar");
  const progressText = document.getElementById("hifzOverallProgress");

  if (!surahSelect || !juzSelect) return;

  function getProgress() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));

      if (data && Array.isArray(data.surahs) && Array.isArray(data.juz)) {
        return data;
      }
    } catch (error) {
      console.warn("Could not read Hifz progress:", error);
    }

    return { surahs: [], juz: [] };
  }

  function updateHifzDisplay() {
    const data = getProgress();

    const memorizedSurahs = new Set(
      data.surahs.filter(n => Number.isInteger(n) && n >= 1 && n <= 114)
    );

    const completedJuz = new Set(
      data.juz.filter(n => Number.isInteger(n) && n >= 1 && n <= 30)
    );

    const surahs = memorizedSurahs.size;
    const juz = completedJuz.size;

    const percent = Math.round(
      ((surahs + juz) / 144) * 100
    );

    if (surahCount) surahCount.textContent = surahs + " / 114";
    if (juzCount) juzCount.textContent = juz + " / 30";

    if (progressBar) progressBar.style.width = percent + "%";
    if (progressText) progressText.textContent = percent + "% Completed";
  }

  function cleanSurahOptions() {
    const seen = new Set();

    Array.from(surahSelect.options).forEach(option => {
      if (!option.value) return;

      const value = Number(option.value);

      if (seen.has(value)) {
        option.remove();
      } else {
        seen.add(value);
      }
    });
  }

  cleanSurahOptions();
  updateHifzDisplay();

  window.addEventListener("storage", function (event) {
    if (event.key === KEY) {
      updateHifzDisplay();
    }
  });

  console.log("Hifz Tracker improvements loaded successfully.");

})();

/* =========================================
   FILE 37: DAILY HIFZ REVISION SYSTEM
========================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "hquDailyHifzRevisions";

  const surahSelect = document.getElementById("revisionSurah");
  const dateInput = document.getElementById("revisionDate");
  const notesInput = document.getElementById("revisionNotes");
  const saveButton = document.getElementById("saveRevision");

  const message = document.getElementById("revisionMessage");
  const historyList = document.getElementById("revisionHistoryList");
  const totalElement = document.getElementById("revisionTotal");
  const todayElement = document.getElementById("revisionToday");

  if (!surahSelect || !dateInput || !saveButton) return;

  let revisions = [];

  function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function loadRevisions() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      revisions = Array.isArray(saved) ? saved : [];
    } catch (error) {
      revisions = [];
    }
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(revisions));
      return true;
    } catch (error) {
      showMessage("Could not save data on this device.");
      return false;
    }
  }

  function showMessage(text) {
    message.textContent = text;
  }

  function loadSurahOptions() {
    const existing = new Set(
      Array.from(surahSelect.options).map(option => option.value)
    );

    fetch("./data/surahs.json")
      .then(response => {
        if (!response.ok) throw new Error("Surah file unavailable");
        return response.json();
      })
      .then(data => {
        const surahs = Array.isArray(data)
          ? data
          : Array.isArray(data.surahs)
            ? data.surahs
            : Object.values(data);

        surahs.forEach((surah, index) => {
          if (!surah || typeof surah !== "object") return;

          const number = Number(
            surah.number || surah.id || surah.surahNumber || index + 1
          );

          const name =
            surah.englishName ||
            surah.nameEnglish ||
            surah.name ||
            surah.english_name ||
            "Surah " + number;

          if (
            !Number.isInteger(number) ||
            number < 1 ||
            number > 114 ||
            existing.has(String(number))
          ) return;

          const option = document.createElement("option");
          option.value = number;
          option.textContent = number + ". " + name;

          surahSelect.appendChild(option);
          existing.add(String(number));
        });
      })
      .catch(error => {
        console.error("Revision Surah loading error:", error);
        showMessage("Please check data/surahs.json.");
      });
  }

  function renderHistory() {
    historyList.replaceChildren();

    const today = getLocalDate();

    const todayCount = revisions.filter(
      item => item.date === today
    ).length;

    totalElement.textContent = revisions.length;
    todayElement.textContent = todayCount;

    if (revisions.length === 0) {
      historyList.textContent = "No revision records yet.";
      return;
    }

    const sorted = [...revisions].sort(
      (a, b) => b.date.localeCompare(a.date) || b.id - a.id
    );

    sorted.forEach(item => {
      const card = document.createElement("div");
      card.className = "revision-item";

      const details = document.createElement("div");

      const title = document.createElement("strong");
      title.textContent = item.surahName;

      const date = document.createElement("p");
      date.textContent = "📅 " + item.date;

      details.appendChild(title);
      details.appendChild(date);

      if (item.notes) {
        const notes = document.createElement("p");
        notes.textContent = item.notes;
        details.appendChild(notes);
      }

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Delete";
      remove.className = "revision-delete";

      remove.addEventListener("click", function () {
        revisions = revisions.filter(
          revision => revision.id !== item.id
        );

        if (saveData()) renderHistory();
      });

      card.appendChild(details);
      card.appendChild(remove);

      historyList.appendChild(card);
    });
  }

  saveButton.addEventListener("click", function () {
    const number = Number(surahSelect.value);
    const date = dateInput.value;
    const notes = notesInput.value.trim();

    if (!number || !date) {
      showMessage("Please select a Surah and revision date.");
      return;
    }

    if (date > getLocalDate()) {
      showMessage("Future dates cannot be selected.");
      return;
    }

    const option = surahSelect.options[surahSelect.selectedIndex];

    const revision = {
      id: Date.now(),
      surahNumber: number,
      surahName: option.textContent,
      date: date,
      notes: notes
    };

    revisions.push(revision);

    if (!saveData()) {
      revisions.pop();
      return;
    }

    renderHistory();

    surahSelect.value = "";
    dateInput.value = getLocalDate();
    notesInput.value = "";

    showMessage("Revision saved successfully! ✓");
  });

  loadRevisions();

  dateInput.value = getLocalDate();

  loadSurahOptions();
  renderHistory();

})();

/* =========================================
   FILE 40: QURAN DAILY GOALS & STREAK
========================================= */

(function () {
  "use strict";

  const GOAL_KEY = "hquQuranDailyGoal";
  const READING_KEY = "hquQuranDailyReading";

  const targetInput = document.getElementById("quranDailyTarget");
  const readingInput = document.getElementById("quranAyahsRead");

  const saveGoalBtn = document.getElementById("saveQuranGoal");
  const saveReadingBtn = document.getElementById("saveQuranReading");

  const goalMessage = document.getElementById("quranGoalMessage");
  const readingMessage = document.getElementById("quranReadingMessage");

  const streakElement = document.getElementById("quranStreakCount");
  const todayElement = document.getElementById("quranTodayTotal");
  const daysElement = document.getElementById("quranTotalDays");
  const totalElement = document.getElementById("quranTotalAyahs");

  const progressBar = document.getElementById("quranDailyProgressBar");
  const progressText = document.getElementById("quranDailyProgressText");

  if (
    !targetInput ||
    !readingInput ||
    !saveGoalBtn ||
    !saveReadingBtn
  ) return;

  function localDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function readStorage(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  let dailyGoal = Number(readStorage(GOAL_KEY, 20));

  if (!Number.isInteger(dailyGoal) || dailyGoal < 1 || dailyGoal > 6236) {
    dailyGoal = 20;
  }

  let readings = readStorage(READING_KEY, {});

  if (
    !readings ||
    typeof readings !== "object" ||
    Array.isArray(readings)
  ) {
    readings = {};
  }

  function showMessage(element, message) {
    if (element) element.textContent = message;
  }

  function saveReadings() {
    try {
      localStorage.setItem(READING_KEY, JSON.stringify(readings));
      return true;
    } catch (error) {
      showMessage(readingMessage, "Could not save reading data.");
      return false;
    }
  }

  function calculateStreak() {
    const activeDates = Object.keys(readings).filter(date => {
      return /^\d{4}-\d{2}-\d{2}$/.test(date) &&
        Number(readings[date]) > 0;
    });

    const activeSet = new Set(activeDates);

    let current = new Date();
    const today = localDate(current);

    // If nothing has been read today, allow yesterday's streak to continue.
    if (!activeSet.has(today)) {
      current.setDate(current.getDate() - 1);
    }

    let streak = 0;

    while (activeSet.has(localDate(current))) {
      streak++;
      current.setDate(current.getDate() - 1);
    }

    return streak;
  }

  function updateDisplay() {
    const today = localDate();
    const todayRead = Number(readings[today]) || 0;

    const activeDays = Object.keys(readings).filter(date => {
      return Number(readings[date]) > 0;
    }).length;

    const totalRead = Object.values(readings).reduce((sum, value) => {
      const count = Number(value);
      return sum + (
        Number.isInteger(count) && count > 0 ? count : 0
      );
    }, 0);

    const percentage = Math.min(
      100,
      Math.round((todayRead / dailyGoal) * 100)
    );

    streakElement.textContent = calculateStreak() + " Days";
    todayElement.textContent = todayRead;
    daysElement.textContent = activeDays;
    totalElement.textContent = totalRead;

    progressBar.style.width = percentage + "%";

    progressText.textContent =
      percentage + "% of daily goal completed";

    targetInput.value = dailyGoal;
    readingInput.value = todayRead;
  }

  saveGoalBtn.addEventListener("click", function () {
    const newGoal = Number(targetInput.value);

    if (
      !Number.isInteger(newGoal) ||
      newGoal < 1 ||
      newGoal > 6236
    ) {
      showMessage(
        goalMessage,
        "Please enter a goal between 1 and 6236."
      );
      return;
    }

    try {
      localStorage.setItem(GOAL_KEY, JSON.stringify(newGoal));
      dailyGoal = newGoal;

      updateDisplay();
      showMessage(goalMessage, "Daily goal saved successfully! ✓");
    } catch (error) {
      showMessage(goalMessage, "Could not save your daily goal.");
    }
  });

  saveReadingBtn.addEventListener("click", function () {
    const count = Number(readingInput.value);

    if (
      !Number.isInteger(count) ||
      count < 0 ||
      count > 6236
    ) {
      showMessage(
        readingMessage,
        "Please enter a number between 0 and 6236."
      );
      return;
    }

    const today = localDate();
    const previousValue = readings[today];

    readings[today] = count;

    if (!saveReadings()) {
      if (previousValue === undefined) {
        delete readings[today];
      } else {
        readings[today] = previousValue;
      }
      return;
    }

    updateDisplay();

    showMessage(
      readingMessage,
      "Today's reading saved successfully! ✓"
    );
  });

  updateDisplay();

  console.log("Quran Daily Goals loaded successfully.");

})();

/* =========================================
   FILE 43 — HOLY QURAN ULTIMATE
   ADVANCED QURAN SEARCH
========================================= */

(function () {
  "use strict";

  const searchInput = document.getElementById("quranSearchInput");
  const searchButton = document.getElementById("quranSearchButton");
  const searchType = document.getElementById("quranSearchType");
  const searchStatus = document.getElementById("quranSearchStatus");
  const searchResults = document.getElementById("quranSearchResults");

  if (!searchInput || !searchButton || !searchType || !searchResults) {
    return;
  }

  let searchDatabase = [];
  let databaseReady = false;

  const files = [
    { file: "./data/surahs.json", type: "surah" },
    { file: "./data/quran.json", type: "arabic" },
    { file: "./data/urdu.json", type: "urdu" },
    { file: "./data/english.json", type: "english" }
  ];

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFC")
      .replace(/[\u064B-\u065F\u0670]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getSurahName(number) {
    const found = searchDatabase.find(item =>
      item.type === "surah" &&
      Number(item.surahNumber) === Number(number)
    );

    return found ? found.text : "Surah " + number;
  }

  function addEntry(type, text, surahNumber, ayahNumber) {
    if (typeof text !== "string" || !text.trim()) return;

    searchDatabase.push({
      type: type,
      text: text.trim(),
      surahNumber: surahNumber || null,
      ayahNumber: ayahNumber || null
    });
  }

  function getNumber(object, keys) {
    for (const key of keys) {
      const value = Number(object[key]);

      if (Number.isInteger(value) && value > 0) {
        return value;
      }
    }

    return null;
  }

  function extractText(data, type) {
    const seen = new Set();

    const textKeys = {
      arabic: [
        "text", "arabic", "arabicText",
        "textArabic", "uthmani", "ayahText",
        "content"
      ],
      urdu: [
        "urdu", "urduTranslation", "translation",
        "meaning", "text", "translationText"
      ],
      english: [
        "english", "englishTranslation", "translation",
        "meaning", "text", "translationText"
      ]
    };

    function walk(node, context, parentKey, depth) {
      if (depth > 15 || node == null) return;

      if (Array.isArray(node)) {
        node.forEach((item, index) => {
          walk(item, context, parentKey, depth + 1);
        });
        return;
      }

      if (typeof node !== "object") {
        if (
          typeof node === "string" &&
          ["arabic", "urdu", "english"].includes(type)
        ) {
          const key = type + "|" + context.surah + "|" +
            context.ayah + "|" + node;

          if (!seen.has(key)) {
            seen.add(key);
            addEntry(type, node, context.surah, context.ayah);
          }
        }
        return;
      }

      const nextContext = { ...context };

      const verseCollections = [
        "ayahs", "verses", "ayat", "ayah",
        "verse", "surahAyahs"
      ];

      const hasVerseCollection = Object.keys(node).some(key =>
        verseCollections.includes(key.toLowerCase()) &&
        Array.isArray(node[key])
      );

      if (hasVerseCollection) {
        nextContext.surah =
          getNumber(node, [
            "surahNumber", "surah_number",
            "surahNo", "number", "id"
          ]) || nextContext.surah;
      }

      const isVerseItem = [
        "ayahs", "verses", "ayat",
        "ayah", "verse", "surahAyahs"
      ].includes(String(parentKey || "").toLowerCase());

      if (isVerseItem) {
        nextContext.ayah =
          getNumber(node, [
            "ayahNumber", "ayah_number",
            "verseNumber", "number", "id"
          ]) || nextContext.ayah;
      }

      if (type === "surah") {
        const number = getNumber(node, [
          "number", "surahNumber", "id"
        ]);

        const name =
          node.englishName ||
          node.nameEnglish ||
          node.english_name ||
          node.name ||
          node.transliteration;

        const arabicName =
          node.arabicName || node.nameArabic || "";

        if (number && (name || arabicName)) {
          addEntry(
            "surah",
            [name, arabicName].filter(Boolean).join(" — "),
            number,
            null
          );
        }
      } else {
        const keys = textKeys[type] || [];

        keys.forEach(key => {
          const value = node[key];

          if (typeof value === "string" && value.trim()) {
            const uniqueKey =
              type + "|" + nextContext.surah + "|" +
              nextContext.ayah + "|" + value;

            if (!seen.has(uniqueKey)) {
              seen.add(uniqueKey);
              addEntry(
                type,
                value,
                nextContext.surah,
                nextContext.ayah
              );
            }
          }
        });
      }

      Object.keys(node).forEach(key => {
        if (typeof node[key] === "object" && node[key] !== null) {
          walk(node[key], nextContext, key, depth + 1);
        }
      });
    }

    walk(data, { surah: null, ayah: null }, "", 0);
  }

  async function loadSearchDatabase() {
    searchStatus.textContent = "Quran data load ho raha hai...";

    for (const item of files) {
      try {
        const response = await fetch(item.file);

        if (!response.ok) {
          throw new Error("File not found");
        }

        const data = await response.json();
        extractText(data, item.type);

      } catch (error) {
        console.warn("Search data unavailable:", item.file);
      }
    }

    databaseReady = true;

    searchStatus.textContent =
      "Search ready! Available Quran data mein search karein.";

  }

  function createResult(entry) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hqu-search-result";
    button.dataset.surahNumber = entry.surahNumber || "";

    const heading = document.createElement("strong");
    const categoryNames = {
      surah: "Surah Name",
      arabic: "Arabic Ayah",
      urdu: "Urdu Translation",
      english: "English Translation"
    };

    heading.textContent = categoryNames[entry.type] || "Quran Result";

    const details = document.createElement("div");
    details.className = "hqu-search-result-details";

    if (entry.surahNumber) {
      details.textContent =
        getSurahName(entry.surahNumber) +
        (entry.ayahNumber ? " | Ayah " + entry.ayahNumber : "");
    } else {
      details.textContent = "Quran text";
    }

    const content = document.createElement("p");
    content.textContent = entry.text;

    button.appendChild(heading);
    button.appendChild(details);
    button.appendChild(content);

    return button;
  }

  function runSearch() {
    const query = normalizeText(searchInput.value);

    searchResults.replaceChildren();

    if (!query) {
      searchStatus.textContent = "Pehle koi word ya phrase likhein.";
      return;
    }

    if (!databaseReady) {
      searchStatus.textContent = "Data abhi load ho raha hai...";
      return;
    }

    const selectedType = searchType.value;

    const matches = searchDatabase.filter(entry => {
      if (selectedType !== "all" && entry.type !== selectedType) {
        return false;
      }

      return normalizeText(entry.text).includes(query);
    });

    if (matches.length === 0) {
      searchStatus.textContent =
        "Is available data mein koi result nahi mila.";
      return;
    }

    const limitedMatches = matches.slice(0, 50);

    limitedMatches.forEach(entry => {
      searchResults.appendChild(createResult(entry));
    });

    searchStatus.textContent =
      matches.length + " results mile. " +
      (matches.length > 50 ? "Pehle 50 results dikhaye gaye." : "");
  }

  function openSurah(number) {
    if (!number) return;

    const items = document.querySelectorAll(".surah-item");

    for (const item of items) {
      const attributes = [
        item.dataset.surah,
        item.dataset.number,
        item.dataset.surahNumber
      ];

      const matchesNumber = attributes.some(value =>
        value && Number(value) === Number(number)
      );

      const name = normalizeText(getSurahName(number));
      const matchesName =
        name && normalizeText(item.textContent).includes(name);

      if (matchesNumber || matchesName) {
        item.click();

        document.getElementById("hquAdvancedSearch")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });

        return;
      }
    }

    searchStatus.textContent =
      "Result mil gaya, lekin Surah list mein uska button nahi mila.";
  }

  searchButton.addEventListener("click", runSearch);

  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      runSearch();
    }
  });

  searchResults.addEventListener("click", event => {
    const result = event.target.closest(".hqu-search-result");

    if (!result) return;

    const number = Number(result.dataset.surahNumber);

    if (number) {
      openSurah(number);
    }
  });

  loadSearchDatabase();

})();

/* =========================================
   FILE 46 — ADVANCED QURAN AUDIO CONTROLS
========================================= */

(function () {
  "use strict";

  const audio = document.getElementById("hquAudio");
  const playButton = document.getElementById("hquPlay");
  const previousButton = document.getElementById("hquPreviousAyah");
  const nextButton = document.getElementById("hquNextAyah");
  const progress = document.getElementById("hquProgress");
  const volume = document.getElementById("hquVolume");
  const speed = document.getElementById("hquSpeed");
  const currentTime = document.getElementById("hquAudioCurrentTime");
  const duration = document.getElementById("hquAudioDuration");
  const message = document.getElementById("hquAudioMessage");
  const surahTitle = document.getElementById("hquAudioSurah");
  const ayahTitle = document.getElementById("hquAudioAyah");

  if (
    !audio || !playButton || !progress ||
    !volume || !speed || !message
  ) {
    return;
  }

  let audioTracks = [];
  let currentTrackIndex = 0;

  function showMessage(text) {
    message.textContent = text;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return minutes + ":" + String(remaining).padStart(2, "0");
  }

  function updatePlayButton() {
    playButton.textContent = audio.paused ? "▶" : "⏸";
    playButton.setAttribute(
      "aria-label",
      audio.paused ? "Play audio" : "Pause audio"
    );
  }

  function updateTrackInformation() {
    const track = audioTracks[currentTrackIndex];

    if (!track) return;

    surahTitle.textContent = track.surahName || "Quran Recitation";

    ayahTitle.textContent =
      track.ayahNumber ? "Ayah " + track.ayahNumber : "Full Surah";
  }

  function loadTrack(index, autoplay) {
    if (!audioTracks.length) {
      showMessage("Verified audio source abhi available nahi hai.");
      return;
    }

    if (index < 0 || index >= audioTracks.length) {
      showMessage("Audio track available nahi hai.");
      return;
    }

    currentTrackIndex = index;

    const track = audioTracks[currentTrackIndex];

    if (!track.url) {
      showMessage("Is track ka verified audio URL add nahi hua.");
      updateTrackInformation();
      return;
    }

    audio.src = track.url;
    audio.load();

    updateTrackInformation();
    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    showMessage("Audio loading...");

    if (autoplay) {
      audio.play().catch(() => {
        showMessage("Audio play nahi hua. Dobara Play press karein.");
      });
    }
  }

  async function loadAudioLibrary() {
    try {
      const response = await fetch("./data/audio-library.json");

      if (!response.ok) {
        throw new Error("Audio library not found");
      }

      const library = await response.json();

      const qariSelect = document.getElementById("hquQariSelect");

      if (!qariSelect) return;

      const qaris = library.qaris || {};

      qariSelect.replaceChildren();

      Object.keys(qaris).forEach(qariId => {
        const option = document.createElement("option");

        option.value = qariId;
        option.textContent =
          qaris[qariId].name || qariId;

        qariSelect.appendChild(option);
      });

      const firstQari = qariSelect.value;

      if (firstQari) {
        loadQariTracks(firstQari, qaris);
      }

      qariSelect.addEventListener("change", () => {
        loadQariTracks(qariSelect.value, qaris);
      });

    } catch (error) {
      showMessage("Audio library load nahi ho saki.");
    }
  }

  function loadQariTracks(qariId, qaris) {
    const qari = qaris[qariId];

    if (!qari) {
      audioTracks = [];
      showMessage("Qari data available nahi hai.");
      return;
    }

    const surahs = qari.surahs || {};

    audioTracks = Object.keys(surahs)
      .map(number => {
        const item = surahs[number];

        return {
          surahNumber: Number(number),
          surahName:
            item.name || "Surah " + number,
          ayahNumber: item.ayahNumber || null,
          url:
            typeof item === "string"
              ? item
              : item.audioUrl || item.url || ""
        };
      })
      .sort((a, b) => a.surahNumber - b.surahNumber);

    currentTrackIndex = 0;

    if (!audioTracks.length) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      surahTitle.textContent = "No Audio Available";
      ayahTitle.textContent = "Verified audio sources required";

      showMessage(
        "Is Qari ke liye verified audio URLs abhi add nahi kiye gaye."
      );

      updatePlayButton();
      return;
    }

    loadTrack(0, false);
  }

  playButton.addEventListener("click", () => {
    if (!audio.src) {
      showMessage("Pehle verified audio source add karein.");
      return;
    }

    if (audio.paused) {
      audio.play().catch(() => {
        showMessage("Audio play nahi ho saka.");
      });
    } else {
      audio.pause();
    }
  });

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      loadTrack(currentTrackIndex - 1, true);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      loadTrack(currentTrackIndex + 1, true);
    });
  }

  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
  });

  speed.addEventListener("change", () => {
    audio.playbackRate = Number(speed.value);
  });

  progress.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime =
        (Number(progress.value) / 100) * audio.duration;
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      progress.value =
        (audio.currentTime / audio.duration) * 100;
    }

    currentTime.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
    showMessage("Audio ready.");
  });

  audio.addEventListener("play", updatePlayButton);
  audio.addEventListener("pause", updatePlayButton);

  audio.addEventListener("ended", () => {
    if (currentTrackIndex < audioTracks.length - 1) {
      loadTrack(currentTrackIndex + 1, true);
    } else {
      showMessage("Recitation completed.");
    }
  });

  audio.addEventListener("error", () => {
    showMessage("Audio load nahi hui. URL check karein.");
    updatePlayButton();
  });

  loadAudioLibrary();

})();

/* =========================================
   FILE 49 — QURAN READING HISTORY
========================================= */

(function () {
  "use strict";

  const HISTORY_KEY = "hquReadingHistory";
  const LAST_READ_KEY = "hquLastReadSurah";

  const historyList = document.getElementById("hquHistoryList");
  const lastReadName = document.getElementById("hquLastReadName");
  const continueButton = document.getElementById("hquContinueReading");
  const clearButton = document.getElementById("hquClearHistory");
  const historyMessage = document.getElementById("hquHistoryMessage");

  if (!historyList || !lastReadName) return;

  let surahNames = {};

  function getHistory() {
    try {
      const data = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function getLastRead() {
    try {
      return JSON.parse(localStorage.getItem(LAST_READ_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      showMessage("Reading history save nahi ho saki.");
    }
  }

  function showMessage(text) {
    if (historyMessage) {
      historyMessage.textContent = text;
    }
  }

  function getSurahName(number, fallback) {
    return surahNames[number] || fallback || "Surah " + number;
  }

  function findSurahButton(number) {
    const buttons = document.querySelectorAll(".surah-item");

    for (const button of buttons) {
      const values = [
        button.dataset.surah,
        button.dataset.number,
        button.dataset.surahNumber
      ];

      if (values.some(value =>
        value && Number(value) === Number(number)
      )) {
        return button;
      }
    }

    const expectedName = String(getSurahName(number)).toLowerCase();

    for (const button of buttons) {
      if (
        expectedName !== "" &&
        button.textContent.toLowerCase().includes(expectedName)
      ) {
        return button;
      }
    }

    return null;
  }

  function saveOpenedSurah(number, fallbackName) {
    number = Number(number);

    if (!Number.isInteger(number) || number < 1 || number > 114) {
      return;
    }

    const record = {
      number: number,
      name: getSurahName(number, fallbackName),
      openedAt: new Date().toISOString()
    };

    const history = getHistory().filter(
      item => Number(item.number) !== number
    );

    history.unshift(record);

    saveHistory(history.slice(0, 30));

    try {
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(record));
    } catch (error) {
      showMessage("Last read record save nahi ho saka.");
    }

    renderHistory();
  }

  function openSurah(number) {
    const button = findSurahButton(number);

    if (button) {
      button.click();
      showMessage("Surah open kar di gayi.");
    } else {
      showMessage(
        "Surah list mein yeh Surah button nahi mila."
      );
    }
  }

  function renderHistory() {
    const history = getHistory();
    const lastRead = getLastRead();

    historyList.replaceChildren();

    if (lastRead && lastRead.number) {
      lastReadName.textContent =
        lastRead.name || "Surah " + lastRead.number;
    } else if (history.length) {
      lastReadName.textContent = history[0].name;
    } else {
      lastReadName.textContent = "No reading history yet";
    }

    if (!history.length) {
      const empty = document.createElement("p");
      empty.textContent = "Your reading history will appear here.";
      historyList.appendChild(empty);
      return;
    }

    history.forEach(item => {
      const card = document.createElement("div");
      card.className = "hqu-history-item";

      const info = document.createElement("div");
      info.className = "hqu-history-info";

      const title = document.createElement("strong");
      title.textContent =
        item.name || "Surah " + item.number;

      const date = document.createElement("small");

      const parsedDate = new Date(item.openedAt);

      date.textContent = Number.isNaN(parsedDate.getTime())
        ? ""
        : parsedDate.toLocaleString();

      const openButton = document.createElement("button");
      openButton.type = "button";
      openButton.textContent = "Open";
      openButton.addEventListener("click", () => {
        openSurah(item.number);
      });

      info.appendChild(title);
      info.appendChild(date);

      card.appendChild(info);
      card.appendChild(openButton);

      historyList.appendChild(card);
    });
  }

  // Capture clicks on Surah list items.
  document.addEventListener("click", function (event) {
    const button = event.target.closest(".surah-item");

    if (!button) return;

    const values = [
      button.dataset.surah,
      button.dataset.number,
      button.dataset.surahNumber
    ];

    let number = values
      .map(Number)
      .find(value =>
        Number.isInteger(value) && value >= 1 && value <= 114
      );

    if (!number) {
      const text = button.textContent;
      const match = text.match(/^\s*(\d{1,3})[\s.)-]/);

      if (match) number = Number(match[1]);
    }

    if (number) {
      saveOpenedSurah(number, button.textContent.trim());
    }

  }, true);

  if (continueButton) {
    continueButton.addEventListener("click", () => {
      const lastRead = getLastRead();

      if (lastRead && lastRead.number) {
        openSurah(lastRead.number);
      } else {
        showMessage("Abhi koi reading history available nahi hai.");
      }
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      try {
        localStorage.removeItem(HISTORY_KEY);
        localStorage.removeItem(LAST_READ_KEY);

        renderHistory();
        showMessage("Reading history clear ho gayi.");

      } catch (error) {
        showMessage("History clear nahi ho saki.");
      }
    });
  }

  async function loadSurahNames() {
    try {
      const response = await fetch("./data/surahs.json");

      if (!response.ok) return;

      const data = await response.json();

      const list = Array.isArray(data)
        ? data
        : data.surahs || [];

      list.forEach(surah => {
        const number = Number(
          surah.number || surah.id || surah.surahNumber
        );

        const name =
          surah.englishName ||
          surah.nameEnglish ||
          surah.name ||
          surah.english_name;

        if (number && name) {
          surahNames[number] = name;
        }
      });

      renderHistory();

    } catch (error) {
      console.warn("Surah names could not be loaded.");
    }
  }

  renderHistory();
  loadSurahNames();

})();

/* ==================================================
 HOLY QURAN ULTIMATE
 PACKAGE 2 — 10 ADVANCED FEATURES
 JAVASCRIPT
================================================== */

(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const read = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };
  const save = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value));

  const KEYS = {
    notes: "hquPackage2Notes",
    favorites: "hquPackage2Favorites",
    checklist: "hquPackage2Checklist",
    tasbeeh: "hquPackage2Tasbeeh",
    theme: "hquPackage2Theme"
  };

  let surahs = [];
  let notes = read(KEYS.notes, []);
  let favorites = read(KEYS.favorites, []);
  let tasbeeh = read(KEYS.tasbeeh, {});
  let quizQuestions = [];
  let quizIndex = 0;
  let quizScore = 0;
  let quizActive = false;
  let editingNote = null;

  const today = () => new Date().toISOString().slice(0, 10);

  function message(id, text) {
    const element = $(id);
    if (element) element.textContent = text;
  }

  function addElement(parent, tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    parent.appendChild(element);
    return element;
  }

  function getSurahNumber(s) {
    return Number(s.number ?? s.id ?? s.surahNumber);
  }

  function getSurahName(s) {
    return s.englishName ?? s.nameEnglish ??
      s.english_name ?? s.name ?? `Surah ${getSurahNumber(s)}`;
  }

  function populateSurahSelect(id) {
    const select = $(id);
    if (!select) return;

    select.replaceChildren();

    const first = document.createElement("option");
    first.value = "";
    first.textContent = "Select Surah";
    select.appendChild(first);

    surahs.forEach(s => {
      const option = document.createElement("option");
      option.value = String(getSurahNumber(s));
      option.textContent = `${getSurahNumber(s)}. ${getSurahName(s)}`;
      select.appendChild(option);
    });
  }

  async function loadSurahs() {
    try {
      const response = await fetch("./data/surahs.json");
      if (!response.ok) throw new Error("Surah data unavailable");

      const data = await response.json();
      surahs = Array.isArray(data) ? data :
        Array.isArray(data.surahs) ? data.surahs : [];

      ["hquP2NoteSurah", "hquP2FavSurah"].forEach(populateSurahSelect);

      buildQuiz();
    } catch (error) {
      message("hquP2NoteMessage", "Surah list could not be loaded.");
      message("hquP2FavMessage", "Surah list could not be loaded.");
    }
  }

  function findSurah(number) {
    return surahs.find(s => getSurahNumber(s) === Number(number));
  }

  /* =========================================
     1. PERSONAL QURAN NOTES
  ========================================= */

  function renderNotes() {
    const list = $("hquP2NotesList");
    if (!list) return;

    list.replaceChildren();

    if (!notes.length) {
      addElement(list, "p", "No personal notes saved yet.");
      return;
    }

    notes.forEach(note => {
      const card = addElement(list, "div", undefined, "hqu-p2-item");
      const surah = findSurah(note.surah);
      addElement(card, "strong",
        `${surah ? getSurahName(surah) : "Surah " + note.surah}` +
        (note.ayah ? ` — Ayah ${note.ayah}` : "")
      );
      addElement(card, "p", note.text);

      const edit = addElement(card, "button", "✏️ Edit");
      edit.type = "button";
      edit.addEventListener("click", () => {
        $("hquP2NoteSurah").value = note.surah;
        $("hquP2NoteAyah").value = note.ayah || "";
        $("hquP2NoteText").value = note.text;
        editingNote = note.id;
        $("hquP2SaveNote").textContent = "Update Note";
      });

      const remove = addElement(card, "button", "🗑 Delete");
      remove.type = "button";
      remove.addEventListener("click", () => {
        if (!confirm("Delete this note?")) return;
        notes = notes.filter(n => n.id !== note.id);
        save(KEYS.notes, notes);
        renderNotes();
      });
    });
  }

  $("hquP2SaveNote")?.addEventListener("click", () => {
    const surah = $("hquP2NoteSurah")?.value;
    const ayah = $("hquP2NoteAyah")?.value;
    const text = $("hquP2NoteText")?.value.trim();

    if (!surah || !text) {
      message("hquP2NoteMessage", "Please select a Surah and write a note.");
      return;
    }

    if (ayah && Number(ayah) < 1) {
      message("hquP2NoteMessage", "Enter a valid Ayah number.");
      return;
    }

    if (editingNote !== null) {
      const old = notes.find(n => n.id === editingNote);
      if (old) {
        old.surah = Number(surah);
        old.ayah = ayah ? Number(ayah) : "";
        old.text = text;
      }
      editingNote = null;
      $("hquP2SaveNote").textContent = "💾 Save Note";
    } else {
      notes.unshift({
        id: Date.now(),
        surah: Number(surah),
        ayah: ayah ? Number(ayah) : "",
        text,
        date: today()
      });
    }

    save(KEYS.notes, notes);
    $("hquP2NoteText").value = "";
    $("hquP2NoteAyah").value = "";
    message("hquP2NoteMessage", "Note saved successfully!");
    renderNotes();
  });

  /* =========================================
     2. FAVORITE AYahs
  ========================================= */

  function renderFavorites() {
    const list = $("hquP2FavoritesList");
    if (!list) return;

    list.replaceChildren();

    if (!favorites.length) {
      addElement(list, "p", "No favorite Ayahs saved yet.");
      return;
    }

    favorites.forEach(fav => {
      const card = addElement(list, "div", undefined, "hqu-p2-item");
      const surah = findSurah(fav.surah);

      addElement(card, "strong",
        `${surah ? getSurahName(surah) : "Surah " + fav.surah} — Ayah ${fav.ayah}`
      );

      if (fav.text) addElement(card, "p", fav.text);

      const remove = addElement(card, "button", "Remove Favorite");
      remove.type = "button";
      remove.addEventListener("click", () => {
        favorites = favorites.filter(f => f.id !== fav.id);
        save(KEYS.favorites, favorites);
        renderFavorites();
      });
    });
  }

  $("hquP2SaveFavorite")?.addEventListener("click", () => {
    const surah = $("hquP2FavSurah")?.value;
    const ayah = Number($("hquP2FavAyah")?.value);
    const text = $("hquP2FavText")?.value.trim() || "";

    if (!surah || !Number.isInteger(ayah) || ayah < 1) {
      message("hquP2FavMessage", "Select a Surah and enter a valid Ayah number.");
      return;
    }

    const duplicate = favorites.some(f =>
      f.surah === Number(surah) && f.ayah === ayah
    );

    if (duplicate) {
      message("hquP2FavMessage", "This Ayah is already in your favorites.");
      return;
    }

    favorites.unshift({
      id: Date.now(),
      surah: Number(surah),
      ayah,
      text
    });

    save(KEYS.favorites, favorites);
    $("hquP2FavAyah").value = "";
    $("hquP2FavText").value = "";
    message("hquP2FavMessage", "Favorite saved!");
    renderFavorites();
  });

  /* =========================================
     3. DAILY ISLAMIC CHECKLIST
  ========================================= */

  function checklistKey() {
    return `${KEYS.checklist}_${today()}`;
  }

  function updateChecklist() {
    const boxes = document.querySelectorAll(
      "#hquP2ChecklistItems input[type=checkbox]"
    );

    const state = read(checklistKey(), {});

    boxes.forEach(box => {
      box.checked = Boolean(state[box.value]);

      box.onchange = () => {
        const updated = read(checklistKey(), {});
        updated[box.value] = box.checked;
        save(checklistKey(), updated);
        updateChecklistProgress();
      };
    });

    updateChecklistProgress();
  }

  function updateChecklistProgress() {
    const boxes = [...document.querySelectorAll(
      "#hquP2ChecklistItems input[type=checkbox]"
    )];

    const completed = boxes.filter(b => b.checked).length;
    message(
      "hquP2ChecklistProgress",
      `Today's progress: ${completed}/${boxes.length}`
    );
  }

  $("hquP2ResetChecklist")?.addEventListener("click", () => {
    if (!confirm("Reset today's checklist?")) return;

    localStorage.removeItem(checklistKey());
    updateChecklist();
  });

  /* =========================================
     4. ASMA UL HUSNA DATA LOADER
  ========================================= */

  let namesData = [];

  async function loadNames() {
    const list = $("hquP2NamesList");
    if (!list) return;

    try {
      const response = await fetch("./data/asma-ul-husna.json");
      if (!response.ok) throw new Error("Data unavailable");

      const data = await response.json();
      namesData = Array.isArray(data) ? data :
        Array.isArray(data.names) ? data.names : [];

      renderNames();
    } catch {
      list.textContent =
        "Verified names data file is not available yet. Add data/asma-ul-husna.json to enable this feature.";
    }
  }

  function renderNames() {
    const list = $("hquP2NamesList");
    if (!list) return;

    list.replaceChildren();

    const query = ($("hquP2NameSearch")?.value || "").toLowerCase();

    const filtered = namesData.filter(item =>
      [item.arabic, item.name, item.transliteration, item.meaning]
        .some(value => String(value || "").toLowerCase().includes(query))
    );

    filtered.forEach(item => {
      const card = addElement(list, "div", undefined, "hqu-p2-name-card");
      addElement(card, "h3", item.arabic || "");
      addElement(card, "strong", item.transliteration || item.name || "");
      addElement(card, "p", item.meaning || "");
    });

    if (!filtered.length) addElement(list, "p", "No matching names found.");
  }

  $("hquP2NameSearch")?.addEventListener("input", renderNames);

  /* =========================================
     5. DAILY DUAS DATA LOADER
  ========================================= */

  let duasData = [];

  async function loadDuas() {
    const list = $("hquP2DuasList");
    if (!list) return;

    try {
      const response = await fetch("./data/duas.json");
      if (!response.ok) throw new Error("Data unavailable");

      const data = await response.json();
      duasData = Array.isArray(data) ? data :
        Array.isArray(data.duas) ? data.duas : [];

      renderDuas();
    } catch {
      list.textContent =
        "Verified Dua data file is not available yet. Add data/duas.json to enable this feature.";
    }
  }

  function renderDuas() {
    const list = $("hquP2DuasList");
    if (!list) return;

    list.replaceChildren();

    const query = ($("hquP2DuaSearch")?.value || "").toLowerCase();
    const category = $("hquP2DuaCategory")?.value || "all";

    const filtered = duasData.filter(dua => {
      const matchesCategory = category === "all" ||
        dua.category === category;

      const matchesSearch = [
        dua.title, dua.arabic, dua.translation, dua.reference
      ].some(value => String(value || "").toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    filtered.forEach(dua => {
      const card = addElement(list, "div", undefined, "hqu-p2-dua-card");
      addElement(card, "h3", dua.title || "Daily Dua");
      addElement(card, "p", dua.arabic || "", "arabic");
      addElement(card, "p", dua.translation || "");
      addElement(card, "small", dua.reference || "");
    });

    if (!filtered.length) addElement(list, "p", "No matching Duas found.");
  }

  $("hquP2DuaSearch")?.addEventListener("input", renderDuas);
  $("hquP2DuaCategory")?.addEventListener("change", renderDuas);

  /* =========================================
     6. QURAN KNOWLEDGE QUIZ
     Uses Surah metadata only
  ========================================= */

  function buildQuiz() {
    quizQuestions = [];

    if (surahs.length < 4) return;

    surahs.forEach(s => {
      const correct = getSurahNumber(s);
      const name = getSurahName(s);

      if (!correct || !name) return;

      const choices = [correct];

      while (choices.length < 4) {
        const random = getSurahNumber(
          surahs[Math.floor(Math.random() * surahs.length)]
        );

        if (random && !choices.includes(random)) choices.push(random);
      }

      choices.sort(() => Math.random() - .5);

      quizQuestions.push({
        question: `What is the number of Surah ${name}?`,
        answer: correct,
        options: choices
      });
    });

    quizQuestions.sort(() => Math.random() - .5);
  }

  function showQuizQuestion() {
    if (quizIndex >= quizQuestions.length) {
      quizActive = false;
      message("hquP2QuizQuestion", "Quiz completed! 🎉");
      message("hquP2QuizOptions", "");
      message("hquP2QuizResult", "Well done! You completed the quiz.");
      message("hquP2QuizScore", `Final Score: ${quizScore}`);
      return;
    }

    const q = quizQuestions[quizIndex];
    message("hquP2QuizQuestion", q.question);

    const options = $("hquP2QuizOptions");
    if (!options) return;
    options.replaceChildren();

    q.options.forEach(option => {
      const surah = findSurah(option);
      const button = addElement(
        options,
        "button",
        surah ? `${option}. ${getSurahName(surah)}` : String(option)
      );

      button.type = "button";
      button.addEventListener("click", () => {
        if (!quizActive) return;

        if (option === q.answer) {
          quizScore++;
          message("hquP2QuizResult", "Correct answer! ✅");
        } else {
          message(
            "hquP2QuizResult",
            `Correct answer: ${q.answer}`
          );
        }

        quizIndex++;
        message("hquP2QuizScore", `Score: ${quizScore}`);
        options.querySelectorAll("button").forEach(b => b.disabled = true);

        const next = addElement(options, "button", "Next Question →");
        next.addEventListener("click", showQuizQuestion);
      });
    });
  }

  $("hquP2StartQuiz")?.addEventListener("click", () => {
    if (!quizQuestions.length) {
      message("hquP2QuizResult", "Surah data is not available.");
      return;
    }

    quizIndex = 0;
    quizScore = 0;
    quizActive = true;
    message("hquP2QuizScore", "Score: 0");
    message("hquP2QuizResult", "");
    showQuizQuestion();
  });

  /* =========================================
     7. ADVANCED TASBEEH
  ========================================= */

  function currentDhikr() {
    const type = $("hquP2TasbeehType")?.value || "SubhanAllah";

    if (type === "Custom") {
      return $("hquP2CustomDhikr")?.value.trim() || "Custom";
    }

    return type;
  }

  function currentTasbeehCount() {
    return Number(tasbeeh[currentDhikr()] || 0);
  }

  function renderTasbeeh() {
    const count = currentTasbeehCount();
    const goal = Math.max(1, Number($("hquP2TasbeehGoal")?.value) || 100);

    message("hquP2TasbeehCount", String(count));
    message(
      "hquP2TasbeehProgress",
      `Progress: ${Math.min(100, Math.round(count / goal * 100))}%`
    );
  }

  $("hquP2TasbeehAdd")?.addEventListener("click", () => {
    const key = currentDhikr();
    tasbeeh[key] = Number(tasbeeh[key] || 0) + 1;
    save(KEYS.tasbeeh, tasbeeh);
    renderTasbeeh();
  });

  $("hquP2TasbeehReset")?.addEventListener("click", () => {
    if (!confirm("Reset this Dhikr count?")) return;

    tasbeeh[currentDhikr()] = 0;
    save(KEYS.tasbeeh, tasbeeh);
    renderTasbeeh();
  });

  $("hquP2TasbeehType")?.addEventListener("change", renderTasbeeh);
  $("hquP2CustomDhikr")?.addEventListener("input", renderTasbeeh);
  $("hquP2TasbeehGoal")?.addEventListener("input", renderTasbeeh);

  /* =========================================
     8. ISLAMIC CALENDAR
  ========================================= */

  function renderCalendar() {
    const now = new Date();

    message(
      "hquP2GregorianDate",
      new Intl.DateTimeFormat("en-PK", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(now)
    );

    try {
      const hijri = new Intl.DateTimeFormat("en", {
        calendar: "islamic",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(now);

      message("hquP2HijriDate", hijri);
    } catch {
      message("hquP2HijriDate", "Hijri calendar is not supported by this browser.");
    }
  }

  /* =========================================
     9. DARK AND LIGHT MODE
  ========================================= */

  function setTheme(theme) {
    document.body.classList.toggle("hqu-p2-dark", theme === "dark");
    save(KEYS.theme, theme);

    message(
      "hquP2ThemeMessage",
      theme === "dark" ? "Dark mode enabled 🌙" : "Light mode enabled ☀️"
    );
  }

  $("hquP2LightMode")?.addEventListener("click", () => setTheme("light"));
  $("hquP2DarkMode")?.addEventListener("click", () => setTheme("dark"));

  const savedTheme = read(KEYS.theme, "light");
  setTheme(savedTheme === "dark" ? "dark" : "light");

  /* =========================================
     10. SETTINGS AND DATA BACKUP
  ========================================= */

  const backupKeys = Object.values(KEYS);

  $("hquP2ExportBackup")?.addEventListener("click", () => {
    const backup = {
      app: "Holy Quran Ultimate",
      version: 2,
      createdAt: new Date().toISOString(),
      data: {}
    };

    backupKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) backup.data[key] = value;
    });

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "holy-quran-ultimate-backup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    message("hquP2BackupMessage", "Backup downloaded successfully!");
  });

  let pendingBackup = null;

  $("hquP2ImportBackup")?.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    pendingBackup = null;

    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (
        data.app !== "Holy Quran Ultimate" ||
        !data.data ||
        typeof data.data !== "object" ||
        Array.isArray(data.data)
      ) {
        throw new Error("Invalid backup file");
      }

      pendingBackup = data;
      message("hquP2BackupMessage", "Backup file ready. Press Restore Backup.");
    } catch {
      message("hquP2BackupMessage", "Invalid backup file.");
    }
  });

  $("hquP2ImportButton")?.addEventListener("click", () => {
    if (!pendingBackup) {
      message("hquP2BackupMessage", "Please select a valid backup file first.");
      return;
    }

    if (!confirm("Restore backup? Current Package 2 data will be replaced.")) {
      return;
    }

    try {
      backupKeys.forEach(key => {
        if (Object.prototype.hasOwnProperty.call(pendingBackup.data, key)) {
          const value = pendingBackup.data[key];

          if (typeof value !== "string") {
            throw new Error("Invalid backup value");
          }

          JSON.parse(value);
          localStorage.setItem(key, value);
        }
      });

      message("hquP2BackupMessage", "Backup restored. Reload the app to see all changes.");
      pendingBackup = null;
    } catch {
      message("hquP2BackupMessage", "Could not restore this backup.");
    }
  });

  /* =========================================
     START ALL FEATURES
  ========================================= */

  function startPackage2() {
    renderNotes();
    renderFavorites();
    updateChecklist();
    renderTasbeeh();
    renderCalendar();
    loadNames();
    loadDuas();
    loadSurahs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startPackage2, { once: true });
  } else {
    startPackage2();
  }

})();

/* ============== END PACKAGE 2 ============== */

/* ==========================================
   HOLY QURAN ULTIMATE
   PACKAGE 3 - ALL 10 FEATURES
========================================== */

(function () {
  "use strict";

  const KEYS = {
    plans: "hquPackage3Plans",
    folders: "hquPackage3Folders",
    library: "hquPackage3Library",
    history: "hquPackage3SearchHistory",
    settings: "hquPackage3Settings"
  };

  const $ = id => document.getElementById(id);

  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function safeText(value) {
    return String(value ?? "");
  }

  function make(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function clear(element) {
    if (element) element.replaceChildren();
  }

  function emptyMessage(element, message) {
    if (element) element.appendChild(make("p", message));
  }

  function getArray(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.surahs)) return data.surahs;
    return [];
  }

  let surahs = [];

  async function loadSurahs() {
    try {
      const response = await fetch("./data/surahs.json");
      if (!response.ok) throw new Error("Surah data unavailable");
      surahs = getArray(await response.json());
      populateSurahSelect();
      renderSurahCards();
    } catch (error) {
      console.warn("Package 3: Surah data could not load.", error);
      const cards = $("hquP3SurahCards");
      emptyMessage(cards, "Surah information load nahi hui. data/surahs.json check karein.");
    }
  }

  function surahNumber(s) {
    return Number(s.number || s.surahNumber || s.id || 0);
  }

  function surahEnglish(s) {
    return s.englishName || s.nameEnglish || s.english_name || s.name || "Surah";
  }

  function surahArabic(s) {
    return s.arabicName || s.nameArabic || "";
  }

  function ayahCount(s) {
    return Number(s.numberOfAyahs || s.ayahCount || s.versesCount ||
      (Array.isArray(s.ayahs) ? s.ayahs.length : 0));
  }

  function revelation(s) {
    return safeText(s.revelationType || s.type || s.revelation || "Unknown");
  }

  /* ==========================================
     1. QURAN PROGRESS DASHBOARD
  ========================================== */

  function countItems(keys) {
    for (const key of keys) {
      const value = read(key, null);
      if (value !== null) {
        if (Array.isArray(value)) return value.length;
        if (typeof value === "object") return Object.keys(value).length;
      }
    }
    return 0;
  }

  function readSurahHistory() {
    const history = read("hquReadingHistory", []);
    const entries = Array.isArray(history)
      ? history
      : Object.values(history || {});

    const numbers = new Set();

    entries.forEach(item => {
      if (typeof item === "number") {
        if (item >= 1 && item <= 114) numbers.add(item);
        return;
      }

      if (item && typeof item === "object") {
        const number = Number(
          item.surahNumber || item.surah || item.number || item.surahId
        );
        if (number >= 1 && number <= 114) numbers.add(number);
      }
    });

    return numbers.size;
  }

  function renderDashboard() {
    const readCount = readSurahHistory();
    const bookmarks = countItems([
      "hquBookmarks",
      "quranBookmarks",
      "bookmarks"
    ]);
    const notes = countItems(["hquPackage2Notes"]);
    const favorites = countItems(["hquPackage2Favorites"]);

    const values = {
      hquP3ReadSurahs: readCount,
      hquP3Bookmarks: bookmarks,
      hquP3Notes: notes,
      hquP3Favorites: favorites
    };

    Object.entries(values).forEach(([id, value]) => {
      if ($(id)) $(id).textContent = value;
    });

    const percent = Math.min(100, Math.round((readCount / 114) * 100));

    if ($("hquP3ProgressBar")) {
      $("hquP3ProgressBar").style.width = percent + "%";
    }

    if ($("hquP3ProgressText")) {
      $("hquP3ProgressText").textContent =
        readCount + " of 114 Surahs read (" + percent + "%)";
    }
  }

  $("hquP3RefreshDashboard")?.addEventListener("click", renderDashboard);

  /* ==========================================
     2. READING PLANNER
  ========================================== */

  function populateSurahSelect() {
    const select = $("hquP3PlanSurah");
    if (!select || !surahs.length) return;

    const previous = select.value;
    clear(select);

    const placeholder = make("option", "Select Surah");
    placeholder.value = "";
    select.appendChild(placeholder);

    surahs.forEach(s => {
      const option = make(
        "option",
        surahNumber(s) + ". " + surahEnglish(s)
      );
      option.value = surahNumber(s);
      select.appendChild(option);
    });

    if (previous) select.value = previous;
  }

  function renderPlans() {
    const list = $("hquP3PlansList");
    if (!list) return;

    clear(list);
    const plans = read(KEYS.plans, []);

    if (!plans.length) {
      emptyMessage(list, "Abhi koi reading plan nahi hai.");
      return;
    }

    plans.forEach((plan, index) => {
      const card = make("div", "", "hqu-p3-item");

      const title = make("h4", plan.name);
      const detail = make(
        "p",
        "Date: " + plan.date + " | Target: " + plan.target + " Ayahs"
      );

      const status = make(
        "p",
        plan.completed ? "Completed ✓" : "Pending"
      );

      const complete = make(
        "button",
        plan.completed ? "Mark Pending" : "Complete"
      );

      complete.type = "button";
      complete.addEventListener("click", () => {
        const current = read(KEYS.plans, []);
        current[index].completed = !current[index].completed;
        save(KEYS.plans, current);
        renderPlans();
      });

      const remove = make("button", "Delete");
      remove.type = "button";
      remove.addEventListener("click", () => {
        const current = read(KEYS.plans, []);
        current.splice(index, 1);
        save(KEYS.plans, current);
        renderPlans();
      });

      card.append(title, detail, status, complete, remove);
      list.appendChild(card);
    });
  }

  $("hquP3AddPlan")?.addEventListener("click", () => {
    const number = Number($("hquP3PlanSurah")?.value);
    const date = $("hquP3PlanDate")?.value;
    const target = Number($("hquP3PlanTarget")?.value);
    const selected = surahs.find(s => surahNumber(s) === number);
    const message = $("hquP3PlanMessage");

    if (!selected || !date || !Number.isInteger(target) || target <= 0) {
      if (message) message.textContent =
        "Surah, date aur valid Ayah target select karein.";
      return;
    }

    const plans = read(KEYS.plans, []);
    plans.push({
      name: surahEnglish(selected),
      number,
      date,
      target,
      completed: false
    });

    save(KEYS.plans, plans);
    if (message) message.textContent = "Reading plan save ho gaya!";
    renderPlans();
  });

  /* ==========================================
     3. SURAH INFORMATION CARDS
  ========================================== */

  function renderSurahCards() {
    const container = $("hquP3SurahCards");
    if (!container) return;

    clear(container);

    const query = safeText($("hquP3SurahSearch")?.value).toLowerCase();
    const filter = $("hquP3SurahFilter")?.value || "all";

    const filtered = surahs.filter(s => {
      const name = surahEnglish(s).toLowerCase();
      const arabic = surahArabic(s);
      const number = String(surahNumber(s));
      const type = revelation(s).toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        arabic.includes(query) ||
        number.includes(query);

      const matchesType =
        filter === "all" || type.includes(filter.toLowerCase());

      return matchesSearch && matchesType;
    });

    if (!filtered.length) {
      emptyMessage(container, "Koi Surah nahi mili.");
      return;
    }

    filtered.forEach(s => {
      const card = make("div", "", "hqu-p3-item");
      card.appendChild(make("h3", surahNumber(s) + ". " + surahEnglish(s)));

      if (surahArabic(s)) {
        card.appendChild(make("p", surahArabic(s), "arabic-text"));
      }

      card.appendChild(make("p", "Ayahs: " + ayahCount(s)));
      card.appendChild(make("p", "Revelation: " + revelation(s)));
      container.appendChild(card);
    });
  }

  $("hquP3SurahSearch")?.addEventListener("input", renderSurahCards);
  $("hquP3SurahFilter")?.addEventListener("change", renderSurahCards);

  /* ==========================================
     4. BOOKMARK FOLDERS
  ========================================== */

  function renderFolders() {
    const list = $("hquP3FoldersList");
    if (!list) return;

    clear(list);
    const folders = read(KEYS.folders, []);

    if (!folders.length) {
      emptyMessage(list, "Abhi koi folder nahi bana.");
      return;
    }

    folders.forEach((folder, index) => {
      const row = make("div", "", "hqu-p3-item");
      row.appendChild(make("span", folder.name));

      const remove = make("button", "Delete Folder");
      remove.type = "button";
      remove.addEventListener("click", () => {
        const current = read(KEYS.folders, []);
        current.splice(index, 1);
        save(KEYS.folders, current);
        renderFolders();
      });

      row.appendChild(remove);
      list.appendChild(row);
    });
  }

  $("hquP3CreateFolder")?.addEventListener("click", () => {
    const input = $("hquP3FolderName");
    const message = $("hquP3FolderMessage");
    const name = safeText(input?.value).trim();

    if (!name) {
      if (message) message.textContent = "Folder ka naam likhein.";
      return;
    }

    const folders = read(KEYS.folders, []);

    if (folders.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      if (message) message.textContent = "Ye folder pehle se mojood hai.";
      return;
    }

    folders.push({ name });
    save(KEYS.folders, folders);
    input.value = "";
    if (message) message.textContent = "Folder create ho gaya!";
    renderFolders();
  });

  /* ==========================================
     5. SEARCH HISTORY
  ========================================== */

  function renderSearchHistory() {
    const list = $("hquP3SearchHistoryList");
    if (!list) return;

    clear(list);
    const history = read(KEYS.history, []);

    if (!history.length) {
      emptyMessage(list, "Quran Reader mein search karein, history yahan nazar aayegi.");
      return;
    }

    history.slice(0, 30).forEach(item => {
      list.appendChild(make("p", item.query + " — " + item.date));
    });
  }

  function addSearchHistory(query) {
    query = safeText(query).trim();
    if (!query) return;

    const history = read(KEYS.history, []);
    if (history[0]?.query.toLowerCase() === query.toLowerCase()) return;

    history.unshift({
      query,
      date: new Date().toLocaleDateString()
    });

    save(KEYS.history, history.slice(0, 30));
    renderSearchHistory();
  }

  const searchIds = [
    "hquSearchInput",
    "hquSearch",
    "quranSearchInput",
    "searchInput",
    "hquAdvancedSearchInput",
    "hquSearchQuery"
  ];

  searchIds.forEach(id => {
    const input = $(id);
    if (!input) return;

    input.addEventListener("keydown", event => {
      if (event.key === "Enter") addSearchHistory(input.value);
    });
  });

  ["hquSearchButton", "hquAdvancedSearchButton", "searchBtn"].forEach(id => {
    $(id)?.addEventListener("click", () => {
      searchIds.forEach(searchId => {
        const input = $(searchId);
        if (input?.value.trim()) addSearchHistory(input.value);
      });
    });
  });

  $("hquP3ClearSearchHistory")?.addEventListener("click", () => {
    save(KEYS.history, []);
    renderSearchHistory();
  });

  /* ==========================================
     6. PERSONAL STUDY LIBRARY
  ========================================== */

  function renderLibrary() {
    const list = $("hquP3LibraryList");
    if (!list) return;

    clear(list);
    const items = read(KEYS.library, []);

    if (!items.length) {
      emptyMessage(list, "Aapki study library abhi khali hai.");
      return;
    }

    items.forEach((item, index) => {
      const card = make("div", "", "hqu-p3-item");
      card.appendChild(make("h4", item.title));
      card.appendChild(make("p", "Category: " + item.category));
      card.appendChild(make("p", item.details));

      const remove = make("button", "Delete");
      remove.type = "button";
      remove.addEventListener("click", () => {
        const current = read(KEYS.library, []);
        current.splice(index, 1);
        save(KEYS.library, current);
        renderLibrary();
      });

      card.appendChild(remove);
      list.appendChild(card);
    });
  }

  $("hquP3SaveResource")?.addEventListener("click", () => {
    const title = safeText($("hquP3ResourceTitle")?.value).trim();
    const category = $("hquP3ResourceCategory")?.value || "General";
    const details = safeText($("hquP3ResourceDetails")?.value).trim();
    const message = $("hquP3LibraryMessage");

    if (!title) {
      if (message) message.textContent = "Resource ka title likhein.";
      return;
    }

    const items = read(KEYS.library, []);
    items.unshift({ title, category, details });
    save(KEYS.library, items);

    $("hquP3ResourceTitle").value = "";
    $("hquP3ResourceDetails").value = "";

    if (message) message.textContent = "Study resource save ho gaya!";
    renderLibrary();
  });

  /* ==========================================
     7. ARABIC FONT SETTINGS
  ========================================== */

  function applyArabicSize(size) {
    const selectors = [
      ".ayah-arabic",
      ".arabic-text",
      ".quran-arabic",
      ".quran-ayah-arabic",
      "[data-quran-arabic]",
      "#quranArabic"
    ];

    document.querySelectorAll(selectors.join(",")).forEach(element => {
      element.style.fontSize = size + "px";
    });

    if ($("hquP3ArabicPreview")) {
      $("hquP3ArabicPreview").style.fontSize = size + "px";
    }

    if ($("hquP3ArabicSizeValue")) {
      $("hquP3ArabicSizeValue").textContent = size + "px";
    }
  }

  const savedSettings = read(KEYS.settings, {});
  const savedArabicSize = Number(savedSettings.arabicSize || 30);

  if ($("hquP3ArabicSize")) {
    $("hquP3ArabicSize").value = savedArabicSize;
    applyArabicSize(savedArabicSize);
    $("hquP3ArabicSize").addEventListener("input", () => {
      applyArabicSize(Number($("hquP3ArabicSize").value));
    });
  }

  $("hquP3ApplyArabicSize")?.addEventListener("click", () => {
    const settings = read(KEYS.settings, {});
    settings.arabicSize = Number($("hquP3ArabicSize")?.value || 30);
    save(KEYS.settings, settings);
    applyArabicSize(settings.arabicSize);
  });

  /* ==========================================
     8. LANGUAGE PREFERENCE
  ========================================== */

  if ($("hquP3LanguageSelect")) {
    $("hquP3LanguageSelect").value =
      savedSettings.language || "English";
  }

  $("hquP3SaveLanguage")?.addEventListener("click", () => {
    const settings = read(KEYS.settings, {});
    settings.language = $("hquP3LanguageSelect")?.value || "English";
    save(KEYS.settings, settings);

    if ($("hquP3LanguageMessage")) {
      $("hquP3LanguageMessage").textContent =
        "Language preference save ho gayi. App translation ke liye translated text add karna hoga.";
    }
  });

  /* ==========================================
     9. NOTES EXPORT
  ========================================== */

  $("hquP3ExportNotes")?.addEventListener("click", () => {
    const notes = read("hquPackage2Notes", []);
    const message = $("hquP3ExportMessage");

    if (!Array.isArray(notes) || !notes.length) {
      if (message) message.textContent = "Export karne ke liye koi saved notes nahi hain.";
      return;
    }

    const content = notes.map((note, index) => {
      if (typeof note === "string") {
        return (index + 1) + ". " + note;
      }

      return [
        (index + 1) + ". " + (note.title || note.name || "Quran Note"),
        note.text || note.note || note.content || "",
        note.date || ""
      ].join("\n");
    }).join("\n\n----------------------\n\n");

    const blob = new Blob(
      ["HOLY QURAN ULTIMATE - MY NOTES\n\n" + content],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Holy-Quran-My-Notes.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    if (message) message.textContent = "Notes export file tayyar hai!";
  });

  /* ==========================================
     10. ACCESSIBILITY SETTINGS
  ========================================== */

  function applyAccessibility(settings) {
    document.body.classList.toggle(
      "hqu-p3-large-text",
      !!settings.largeText
    );

    document.body.classList.toggle(
      "hqu-p3-high-contrast",
      !!settings.highContrast
    );

    document.body.classList.toggle(
      "hqu-p3-reduce-motion",
      !!settings.reduceMotion
    );
  }

  const accessibility = savedSettings.accessibility || {};

  if ($("hquP3LargeText")) {
    $("hquP3LargeText").checked = !!accessibility.largeText;
  }

  if ($("hquP3HighContrast")) {
    $("hquP3HighContrast").checked = !!accessibility.highContrast;
  }

  if ($("hquP3ReduceMotion")) {
    $("hquP3ReduceMotion").checked = !!accessibility.reduceMotion;
  }

  applyAccessibility(accessibility);

  $("hquP3ApplyAccessibility")?.addEventListener("click", () => {
    const settings = read(KEYS.settings, {});

    settings.accessibility = {
      largeText: !!$("hquP3LargeText")?.checked,
      highContrast: !!$("hquP3HighContrast")?.checked,
      reduceMotion: !!$("hquP3ReduceMotion")?.checked
    };

    save(KEYS.settings, settings);
    applyAccessibility(settings.accessibility);

    if ($("hquP3AccessibilityMessage")) {
      $("hquP3AccessibilityMessage").textContent =
        "Accessibility settings save ho gayi!";
    }
  });

  /* ==========================================
     START PACKAGE 3
  ========================================== */

  renderDashboard();
  renderPlans();
  renderFolders();
  renderSearchHistory();
  renderLibrary();
  loadSurahs();

  console.log("Holy Quran Ultimate - Package 3 Loaded Successfully!");

})();

/* ==========================================
   HOLY QURAN ULTIMATE
   PACKAGE 4 - AUDIO ENGINE
   All 10 Features
========================================== */

(function () {
  "use strict";

  const $ = id => document.getElementById(id);

  const KEYS = {
    playlist: "hquPackage4Playlist",
    bookmarks: "hquPackage4Bookmarks",
    downloads: "hquPackage4Downloads",
    settings: "hquPackage4Settings"
  };

  const QARIS = {
    mishary: "Alafasy_128kbps",
    abdulbasit: "Abdul_Basit_Murattal_192kbps",
    sudais: "Sudais_128kbps",
    shuraim: "Shuraim_128kbps",
    maher: "Maher_AlMuaiqly_64kbps",
    minshawi: "Minshawy_Murattal_128kbps",
    husary: "Husary_128kbps",
    ghamdi: "Ghamadi_40kbps"
  };

  const audio = $("hquP4AudioElement");

  let surahs = [];
  let currentIndex = -1;
  let repeatCount = 0;
  let sleepTimeout = null;
  let wakeLock = null;
  let currentObjectURL = null;
  let databasePromise = null;

  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function text(value) {
    return String(value ?? "");
  }

  function element(tag, value, className) {
    const el = document.createElement(tag);
    el.textContent = value;
    if (className) el.className = className;
    return el;
  }

  function clear(el) {
    if (el) el.replaceChildren();
  }

  function numberOf(s) {
    return Number(s.number || s.surahNumber || s.id || 0);
  }

  function nameOf(s) {
    return s.englishName || s.nameEnglish ||
      s.english_name || s.name || "Surah";
  }

  function arabicOf(s) {
    return s.arabicName || s.nameArabic || "";
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return String(mins).padStart(2, "0") +
      ":" + String(secs).padStart(2, "0");
  }

  function message(id, value) {
    if ($(id)) $(id).textContent = value;
  }

  function getSelectedQari() {
    return $("hquP4Qari")?.value || "mishary";
  }

  function getAudioURL(surahNumber) {
    const folder = QARIS[getSelectedQari()] || QARIS.mishary;
    const file = String(surahNumber).padStart(3, "0") + ".mp3";

    return "https://everyayah.com/data/" + folder + "/" + file;
  }

  /* ==========================================
     OFFLINE AUDIO DATABASE
     Uses IndexedDB on supported browsers
  ========================================== */

  function openDatabase() {
    if (databasePromise) return databasePromise;

    databasePromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("Offline storage is not supported."));
        return;
      }

      const request = indexedDB.open("HolyQuranUltimateAudio", 1);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("audio")) {
          db.createObjectStore("audio", { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return databasePromise;
  }

  async function storeAudio(id, blob, name, qari) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("audio", "readwrite");

      transaction.objectStore("audio").put({
        id,
        blob,
        name,
        qari,
        savedAt: new Date().toISOString()
      });

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function getStoredAudio(id) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("audio", "readonly");
      const request = transaction.objectStore("audio").get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async function removeStoredAudio(id) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("audio", "readwrite");
      transaction.objectStore("audio").delete(id);

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /* ==========================================
     LOAD SURAH INFORMATION
  ========================================== */

  async function loadAudioSurahs() {
    try {
      const response = await fetch("./data/surahs.json");

      if (!response.ok) {
        throw new Error("Surah data unavailable");
      }

      const data = await response.json();

      surahs = Array.isArray(data)
        ? data
        : Array.isArray(data.surahs)
          ? data.surahs
          : [];

      populateSurahMenus();
    } catch (error) {
      console.error(error);

      message(
        "hquP4PlayerMessage",
        "Surah list load nahi hui. data/surahs.json check karein."
      );
    }
  }

  function populateSurahMenus() {
    [
      "hquP4PlaylistSurah",
      "hquP4DownloadSurah"
    ].forEach(id => {
      const select = $(id);
      if (!select) return;

      clear(select);

      const first = element("option", "Select Surah");
      first.value = "";
      select.appendChild(first);

      surahs.forEach(s => {
        const option = element(
          "option",
          numberOf(s) + ". " + nameOf(s)
        );

        option.value = numberOf(s);
        select.appendChild(option);
      });
    });
  }

  function getSurah(number) {
    return surahs.find(s => numberOf(s) === Number(number));
  }

  /* ==========================================
     1. QARI SELECTION
  ========================================== */

  const savedSettings = read(KEYS.settings, {});

  if ($("hquP4Qari") && savedSettings.qari &&
      QARIS[savedSettings.qari]) {
    $("hquP4Qari").value = savedSettings.qari;
  }

  function updateQariDisplay() {
    const select = $("hquP4Qari");

    const name = select?.selectedOptions?.[0]?.textContent ||
      "Mishary Rashid Alafasy";

    message("hquP4QariMessage", "Selected Qari: " + name);
    message("hquP4NowQari", "Qari: " + name);
  }

  $("hquP4Qari")?.addEventListener("change", () => {
    updateQariDisplay();

    if (currentIndex >= 0) {
      playSurah(currentIndex, false);
    }
  });

  /* ==========================================
     2. QURAN AUDIO PLAYER
  ========================================== */

  async function playSurah(index, autoPlay) {
    if (!audio || !surahs.length) return;

    if (index < 0 || index >= surahs.length) return;

    currentIndex = index;

    const surah = surahs[index];
    const number = numberOf(surah);
    const name = nameOf(surah);

    message("hquP4NowPlaying", name);
    message(
      "hquP4PlayerMessage",
      "Loading " + name + "..."
    );

    updateQariDisplay();

    if (currentObjectURL) {
      URL.revokeObjectURL(currentObjectURL);
      currentObjectURL = null;
    }

    audio.pause();
    audio.removeAttribute("src");

    const audioId = getSelectedQari() + "-" + number;

    try {
      const offline = await getStoredAudio(audioId);

      if (offline?.blob) {
        currentObjectURL = URL.createObjectURL(offline.blob);
        audio.src = currentObjectURL;

        message(
          "hquP4PlayerMessage",
          "Playing saved offline audio."
        );
      } else {
        audio.src = getAudioURL(number);

        message(
          "hquP4PlayerMessage",
          "Loading audio from online library..."
        );
      }

      audio.load();

      if (autoPlay) {
        try {
          await audio.play();
          message("hquP4Play", "▶ Playing");
        } catch {
          message(
            "hquP4PlayerMessage",
            "Play button dobara press karein."
          );
        }
      }
    } catch (error) {
      console.error(error);

      audio.src = getAudioURL(number);
      audio.load();

      if (autoPlay) {
        audio.play().catch(() => {
          message(
            "hquP4PlayerMessage",
            "Audio play nahi ho saka. Internet aur audio source check karein."
          );
        });
      }
    }
  }

  $("hquP4Play")?.addEventListener("click", async () => {
    if (currentIndex < 0) {
      if (!surahs.length) {
        message("hquP4PlayerMessage", "Surah list abhi load ho rahi hai.");
        return;
      }

      await playSurah(0, true);
      return;
    }

    audio?.play().then(() => {
      message("hquP4PlayerMessage", "Audio playing.");
    }).catch(() => {
      message("hquP4PlayerMessage", "Audio play nahi ho saka.");
    });
  });

  $("hquP4Pause")?.addEventListener("click", () => {
    audio?.pause();
    message("hquP4PlayerMessage", "Audio paused.");
  });

  $("hquP4Next")?.addEventListener("click", () => {
    if (!surahs.length) return;
    const next = Math.min(currentIndex + 1, surahs.length - 1);
    playSurah(next, true);
  });

  $("hquP4Previous")?.addEventListener("click", () => {
    if (!surahs.length) return;
    const previous = Math.max(currentIndex - 1, 0);
    playSurah(previous, true);
  });

  audio?.addEventListener("timeupdate", () => {
    const seek = $("hquP4Seek");

    if (seek && Number.isFinite(audio.duration)) {
      seek.value = audio.duration
        ? (audio.currentTime / audio.duration) * 100
        : 0;
    }

    message("hquP4CurrentTime", formatTime(audio.currentTime));
  });

  audio?.addEventListener("loadedmetadata", () => {
    message("hquP4Duration", formatTime(audio.duration));
  });

  audio?.addEventListener("play", () => {
    message("hquP4Play", "▶ Playing");
  });

  audio?.addEventListener("pause", () => {
    message("hquP4Play", "▶ Play");
  });

  audio?.addEventListener("error", () => {
    message(
      "hquP4PlayerMessage",
      "Audio load nahi hua. Internet ya Qari audio source check karein."
    );
  });

  $("hquP4Seek")?.addEventListener("input", event => {
    if (audio && Number.isFinite(audio.duration)) {
      audio.currentTime =
        (Number(event.target.value) / 100) * audio.duration;
    }
  });

  /* ==========================================
     3. PLAYBACK SPEED
  ========================================== */

  $("hquP4Speed")?.addEventListener("change", event => {
    if (audio) {
      audio.playbackRate = Number(event.target.value) || 1;
    }
  });

  /* ==========================================
     4. REPEAT SETTINGS
  ========================================== */

  $("hquP4RepeatMode")?.addEventListener("change", event => {
    const mode = event.target.value;

    repeatCount = 0;

    if (mode === "ayah") {
      message(
        "hquP4RepeatMessage",
        "Ayah repeat ke liye individual Ayah audio source zaroori hai. Is player mein filhal full Surah repeat supported hai."
      );
    } else if (mode === "surah") {
      message("hquP4RepeatMessage", "Surah repeat enabled.");
    } else if (mode === "three") {
      message("hquP4RepeatMessage", "Surah will repeat 3 times.");
    } else if (mode === "five") {
      message("hquP4RepeatMessage", "Surah will repeat 5 times.");
    } else {
      message("hquP4RepeatMessage", "Repeat is off.");
    }
  });

  /* ==========================================
     5. AUDIO PLAYLIST
  ========================================== */

  function renderPlaylist() {
    const list = $("hquP4PlaylistList");
    if (!list) return;

    clear(list);

    const playlist = read(KEYS.playlist, []);

    if (!playlist.length) {
      list.appendChild(element("p", "Playlist is empty."));
      return;
    }

    playlist.forEach((item, index) => {
      const row = element("div", "", "hqu-p4-item");

      row.appendChild(element(
        "h4",
        item.number + ". " + item.name
      ));

      const play = element("button", "▶ Play");
      play.type = "button";
      play.addEventListener("click", () => {
        const surahIndex = surahs.findIndex(
          s => numberOf(s) === item.number
        );

        if (surahIndex >= 0) playSurah(surahIndex, true);
      });

      const remove = element("button", "Remove");
      remove.type = "button";
      remove.addEventListener("click", () => {
        const items = read(KEYS.playlist, []);
        items.splice(index, 1);
        save(KEYS.playlist, items);
        renderPlaylist();
      });

      row.append(play, remove);
      list.appendChild(row);
    });
  }

  $("hquP4AddPlaylist")?.addEventListener("click", () => {
    const number = Number($("hquP4PlaylistSurah")?.value);
    const surah = getSurah(number);

    if (!surah) {
      message("hquP4PlayerMessage", "Pehle Surah select karein.");
      return;
    }

    const playlist = read(KEYS.playlist, []);

    playlist.push({
      number,
      name: nameOf(surah)
    });

    save(KEYS.playlist, playlist);
    renderPlaylist();

    message("hquP4PlayerMessage", "Surah playlist mein add ho gayi.");
  });

  $("hquP4ClearPlaylist")?.addEventListener("click", () => {
    save(KEYS.playlist, []);
    renderPlaylist();
  });

  /* ==========================================
     6. OFFLINE AUDIO DOWNLOADS
  ========================================== */

  async function downloadSurah() {
    const number = Number($("hquP4DownloadSurah")?.value);
    const surah = getSurah(number);

    if (!surah) {
      message("hquP4DownloadMessage", "Pehle Surah select karein.");
      return;
    }

    const button = $("hquP4DownloadButton");
    const qari = getSelectedQari();
    const id = qari + "-" + number;

    if (button) button.disabled = true;

    message(
      "hquP4DownloadMessage",
      "Downloading " + nameOf(surah) + "... Please wait."
    );

    try {
      const response = await fetch(getAudioURL(number));

      if (!response.ok) {
        throw new Error("Audio download failed.");
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error("Audio file is empty.");
      }

      await storeAudio(
        id,
        blob,
        nameOf(surah),
        qari
      );

      const downloads = read(KEYS.downloads, []);
      const updated = downloads.filter(item => item.id !== id);

      updated.unshift({
        id,
        number,
        name: nameOf(surah),
        qari,
        size: blob.size
      });

      save(KEYS.downloads, updated);
      renderDownloads();

      message(
        "hquP4DownloadMessage",
        nameOf(surah) + " successfully saved for offline listening!"
      );
    } catch (error) {
      console.error(error);

      message(
        "hquP4DownloadMessage",
        "Download fail hua. Internet, storage permission ya audio server CORS support check karein."
      );
    } finally {
      if (button) button.disabled = false;
    }
  }

  $("hquP4DownloadButton")?.addEventListener("click", downloadSurah);

  function renderDownloads() {
    const list = $("hquP4DownloadsList");
    if (!list) return;

    clear(list);

    const downloads = read(KEYS.downloads, []);

    if (!downloads.length) {
      list.appendChild(element("p", "No offline audio saved yet."));
      return;
    }

    downloads.forEach(item => {
      const row = element("div", "", "hqu-p4-item");

      row.appendChild(element(
        "h4",
        item.number + ". " + item.name
      ));

      row.appendChild(element(
        "p",
        "Qari: " + item.qari
      ));

      const play = element("button", "▶ Play Offline");
      play.type = "button";

      play.addEventListener("click", async () => {
        const index = surahs.findIndex(
          s => numberOf(s) === item.number
        );

        if (index < 0) return;

        if ($("hquP4Qari")) {
          $("hquP4Qari").value = item.qari;
          updateQariDisplay();
        }

        await playSurah(index, true);
      });

      const remove = element("button", "Delete Download");
      remove.type = "button";

      remove.addEventListener("click", async () => {
        try {
          await removeStoredAudio(item.id);

          const updated = read(KEYS.downloads, [])
            .filter(d => d.id !== item.id);

          save(KEYS.downloads, updated);
          renderDownloads();

          message("hquP4DownloadMessage", "Offline audio deleted.");
        } catch (error) {
          message("hquP4DownloadMessage", "Delete nahi ho saka.");
        }
      });

      row.append(play, remove);
      list.appendChild(row);
    });
  }

  /* ==========================================
     7. TRANSLATION DISPLAY
     Connect using a custom event from Quran reader:
     document.dispatchEvent(new CustomEvent(
       "hqu:ayah-selected",
       { detail: { arabic: "...", translation: "..." } }
     ));
  ========================================== */

  document.addEventListener("hqu:ayah-selected", event => {
    const detail = event.detail || {};
    const box = $("hquP4TranslationBox");

    if (!box) return;

    clear(box);

    if (detail.arabic) {
      const arabic = element("p", detail.arabic, "arabic-text");
      arabic.dir = "rtl";
      box.appendChild(arabic);
    }

    const language = $("hquP4TranslationLanguage")?.value || "en";

    let translation = detail.translation;

    if (translation && typeof translation === "object") {
      translation = translation[language] ||
        translation.en ||
        translation.ur ||
        "";
    }

    box.appendChild(
      element("p", translation || "Selected Ayah ki translation available nahi hai.")
    );
  });

  $("hquP4TranslationLanguage")?.addEventListener("change", () => {
    message(
      "hquP4PlayerMessage",
      "Translation language preference updated. Available translation data is required."
    );
  });

  /* ==========================================
     8. AUDIO BOOKMARKS
  ========================================== */

  function renderBookmarks() {
    const list = $("hquP4BookmarksList");
    if (!list) return;

    clear(list);

    const bookmarks = read(KEYS.bookmarks, []);

    if (!bookmarks.length) {
      list.appendChild(element("p", "No audio bookmarks yet."));
      return;
    }

    bookmarks.forEach((item, index) => {
      const row = element("div", "", "hqu-p4-item");

      row.appendChild(element("h4", item.name));
      row.appendChild(element("p", item.surahName));
      row.appendChild(element("p", "Position: " + formatTime(item.time)));

      const play = element("button", "▶ Open Bookmark");
      play.type = "button";

      play.addEventListener("click", async () => {
        const surahIndex = surahs.findIndex(
          s => numberOf(s) === item.number
        );

        if (surahIndex < 0) return;

        await playSurah(surahIndex, true);

        const seekToPosition = () => {
          if (Number.isFinite(audio.duration)) {
            audio.currentTime = Math.min(item.time, audio.duration);
            audio.removeEventListener("loadedmetadata", seekToPosition);
          }
        };

        audio.addEventListener("loadedmetadata", seekToPosition);
      });

      const remove = element("button", "Delete");
      remove.type = "button";

      remove.addEventListener("click", () => {
        const current = read(KEYS.bookmarks, []);
        current.splice(index, 1);
        save(KEYS.bookmarks, current);
        renderBookmarks();
      });

      row.append(play, remove);
      list.appendChild(row);
    });
  }

  $("hquP4SaveBookmark")?.addEventListener("click", () => {
    if (currentIndex < 0) {
      message("hquP4BookmarkMessage", "Pehle audio play karein.");
      return;
    }

    const name = text($("hquP4BookmarkName")?.value).trim();

    if (!name) {
      message("hquP4BookmarkMessage", "Bookmark ka naam likhein.");
      return;
    }

    const surah = surahs[currentIndex];
    const bookmarks = read(KEYS.bookmarks, []);

    bookmarks.unshift({
      name,
      number: numberOf(surah),
      surahName: nameOf(surah),
      time: audio?.currentTime || 0
    });

    save(KEYS.bookmarks, bookmarks);

    $("hquP4BookmarkName").value = "";
    message("hquP4BookmarkMessage", "Audio bookmark saved!");

    renderBookmarks();
  });

  /* ==========================================
     9. SLEEP TIMER
  ========================================== */

  function cancelSleepTimer() {
    if (sleepTimeout) {
      clearTimeout(sleepTimeout);
      sleepTimeout = null;
    }

    if ($("hquP4SleepTimer")) {
      $("hquP4SleepTimer").value = "0";
    }

    message("hquP4SleepMessage", "Sleep timer is off.");
  }

  $("hquP4SleepTimer")?.addEventListener("change", event => {
    if (sleepTimeout) clearTimeout(sleepTimeout);

    const minutes = Number(event.target.value);

    if (!minutes) {
      message("hquP4SleepMessage", "Sleep timer is off.");
      return;
    }

    message(
      "hquP4SleepMessage",
      "Audio will stop after " + minutes + " minutes."
    );

    sleepTimeout = setTimeout(() => {
      audio?.pause();
      sleepTimeout = null;

      if ($("hquP4SleepTimer")) {
        $("hquP4SleepTimer").value = "0";
      }

      message("hquP4SleepMessage", "Sleep timer finished. Audio stopped.");
    }, minutes * 60 * 1000);
  });

  $("hquP4CancelSleep")?.addEventListener("click", cancelSleepTimer);

  /* ==========================================
     10. AUDIO SETTINGS
  ========================================== */

  function loadAudioSettings() {
    const settings = read(KEYS.settings, {});

    if ($("hquP4Autoplay")) {
      $("hquP4Autoplay").checked = !!settings.autoplay;
    }

    if ($("hquP4RememberQari")) {
      $("hquP4RememberQari").checked =
        settings.rememberQari !== false;
    }

    if ($("hquP4KeepScreen")) {
      $("hquP4KeepScreen").checked = !!settings.keepScreen;
    }
  }

  $("hquP4SaveSettings")?.addEventListener("click", async () => {
    const settings = read(KEYS.settings, {});

    settings.autoplay = !!$("hquP4Autoplay")?.checked;
    settings.rememberQari = !!$("hquP4RememberQari")?.checked;
    settings.keepScreen = !!$("hquP4KeepScreen")?.checked;

    if (settings.rememberQari) {
      settings.qari = getSelectedQari();
    } else {
      delete settings.qari;
    }

    save(KEYS.settings, settings);

    if (settings.keepScreen && navigator.wakeLock?.request) {
      try {
        wakeLock = await navigator.wakeLock.request("screen");
      } catch {
        message(
          "hquP4SettingsMessage",
          "Screen Wake Lock is not supported or permission was denied. Other settings saved."
        );
        return;
      }
    } else if (wakeLock) {
      try {
        await wakeLock.release();
      } catch {}
      wakeLock = null;
    }

    message("hquP4SettingsMessage", "Audio settings saved!");
  });

  /* ==========================================
     AUDIO END - REPEAT & NEXT SURAH
  ========================================== */

  audio?.addEventListener("ended", async () => {
    const mode = $("hquP4RepeatMode")?.value || "none";

    if (mode === "surah") {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }

    if (mode === "three" || mode === "five") {
      const limit = mode === "three" ? 3 : 5;
      repeatCount++;

      if (repeatCount < limit) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      repeatCount = 0;
    }

    const settings = read(KEYS.settings, {});

    if (settings.autoplay && currentIndex < surahs.length - 1) {
      await playSurah(currentIndex + 1, true);
    } else {
      message("hquP4PlayerMessage", "Surah finished.");
    }
  });

  /* ==========================================
     INITIALIZE PACKAGE 4
  ========================================== */

  loadAudioSettings();
  updateQariDisplay();
  loadAudioSurahs();
  renderPlaylist();
  renderDownloads();
  renderBookmarks();

  console.log(
    "Holy Quran Ultimate - Package 4 Audio Center Loaded!"
  );

})();

/* =====================================================
   HOLY QURAN ULTIMATE
   PACKAGE 5 — 20 ADVANCED LEARNING FEATURES
===================================================== */

(() => {
"use strict";

const $ = id => document.getElementById(id);

const STORE = {
    goals: "hquPackage5Goals",
    notes: "hquPackage5Notes",
    collections: "hquPackage5Collections",
    progress: "hquPackage5Progress",
    settings: "hquPackage5Settings"
};

function read(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

let surahs = [];
let selectedAyah = null;
let timerSeconds = 0;
let timerInterval = null;
let quizScore = 0;
let quizTotal = 0;
let quizQuestions = [];
let quizIndex = 0;

let goals = read(STORE.goals, { target: 5, completed: 0 });
let notes = read(STORE.notes, []);
let collections = read(STORE.collections, []);
let progress = read(STORE.progress, {
    memorized: 0,
    quizCorrect: 0,
    sessions: 0
});
let settings = read(STORE.settings, {});

function message(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
}

function element(id, tag = "div") {
    const el = $(id);
    if (el) return el;
    return null;
}

function make(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
}

function numberValue(id, fallback = 1) {
    const value = Number($(id)?.value);
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getSurah(number) {
    return surahs.find(s =>
        Number(s.number || s.surahNumber || s.id) === Number(number)
    );
}

function surahName(s) {
    return s?.englishName ||
        s?.nameEnglish ||
        s?.english_name ||
        s?.name ||
        "Surah";
}

function ayahNumber(s) {
    return Number(s?.numberOfAyahs || s?.ayahCount || s?.totalAyahs || 0);
}

function populateSurah(id) {
    const select = $(id);
    if (!select) return;

    select.replaceChildren();

    const first = make("option", "Select Surah");
    first.value = "";
    select.appendChild(first);

    surahs.forEach(s => {
        const n = Number(s.number || s.surahNumber || s.id);
        const option = make(
            "option",
            `${n}. ${surahName(s)}`
        );
        option.value = n;
        select.appendChild(option);
    });
}

function getSelectedAyah() {
    return {
        surah: numberValue("hquP5MemorizeSurah"),
        ayah: numberValue("hquP5MemorizeAyah")
    };
}

function matchingAyah(detail) {
    if (!detail || !selectedAyah) return false;

    return Number(detail.surahNumber) === selectedAyah.surah &&
        Number(detail.ayahNumber) === selectedAyah.ayah;
}

function showAyahText(id, detail = selectedAyah) {
    const box = $(id);
    if (!box) return;

    box.replaceChildren();

    if (!detail || !detail.arabic) {
        box.textContent =
            "Quran text data available nahi. Verified Quran text dataset connect karein.";
        return;
    }

    box.textContent = detail.arabic;
    box.dir = "rtl";
}

/*
  Integration:
  Your Quran reader can send:
  document.dispatchEvent(new CustomEvent("hqu:ayah-selected", {
    detail: {
      surahNumber: 1,
      ayahNumber: 1,
      arabic: "...",
      words: [{arabic:"...", en:"...", ur:"...", ps:"..."}],
      translations: {en:"...", ur:"..."},
      tafsir: "...",
      tajweed: "..."
    }
  }));
*/

document.addEventListener("hqu:ayah-selected", event => {
    const d = event.detail || {};

    selectedAyah = {
        ...d,
        surahNumber: Number(d.surahNumber),
        ayahNumber: Number(d.ayahNumber)
    };

    const fields = [
        ["hquP5WordSurah", d.surahNumber],
        ["hquP5WordAyah", d.ayahNumber],
        ["hquP5TafsirSurah", d.surahNumber],
        ["hquP5TafsirAyah", d.ayahNumber],
        ["hquP5MemorizeSurah", d.surahNumber],
        ["hquP5MemorizeAyah", d.ayahNumber],
        ["hquP5NoteSurah", d.surahNumber],
        ["hquP5NoteAyah", d.ayahNumber],
        ["hquP5CollectionSurah", d.surahNumber],
        ["hquP5CollectionAyah", d.ayahNumber]
    ];

    fields.forEach(([id, value]) => {
        if ($(id) && value != null) $(id).value = value;
    });

    renderWords(d);
    renderTranslations(d);
    renderTafsir(d);
    renderMemorization(d);
    updateCopyText(d);
});

/* 1. Word-by-Word Quran */

function renderWords(detail) {
    const box = $("hquP5WordDisplay");
    if (!box) return;

    box.replaceChildren();

    if (!Array.isArray(detail.words) || !detail.words.length) {
        box.textContent =
            "Word-by-word data load nahi. Verified word dataset connect karein.";
        return;
    }

    detail.words.forEach(word => {
        const btn = make("button", word.arabic || "Word");
        btn.type = "button";

        btn.addEventListener("click", () => {
            const language = $("hquP5MeaningLanguage")?.value || "ur";
            const meaning = word[language] || "Is word ka meaning available nahi.";
            message("hquP5WordMeaning", meaning);
        });

        box.appendChild(btn);
    });
}

$("hquP5LoadWords")?.addEventListener("click", () => {
    if (!selectedAyah) {
        message("hquP5WordDisplay", "Pehle Quran reader se Ayah select karein.");
        return;
    }
    renderWords(selectedAyah);
});

/* 2. Word Meanings */

$("hquP5MeaningLanguage")?.addEventListener("change", () => {
    message("hquP5WordMeaning", "Meaning dekhne ke liye Arabic word select karein.");
});

/* 3. Tafsir Reader */

function renderTafsir(detail) {
    const box = $("hquP5TafsirContent");
    if (!box) return;

    box.textContent = detail.tafsir ||
        "Verified Tafsir dataset connect nahi hai. Is jagah authentic Tafsir data show hoga.";
}

$("hquP5LoadTafsir")?.addEventListener("click", () => {
    const surah = numberValue("hquP5TafsirSurah");
    const ayah = numberValue("hquP5TafsirAyah");

    if (selectedAyah &&
        matchingAyah({
            surahNumber: surah,
            ayahNumber: ayah
        })) {
        renderTafsir(selectedAyah);
    } else {
        message(
            "hquP5TafsirContent",
            "Is Ayah ka verified Tafsir data available nahi."
        );
    }
});

/* 4. Multiple Translation Comparison */

function renderTranslations(detail) {
    const box = $("hquP5CompareResults");
    if (!box) return;

    box.replaceChildren();

    const translations = detail.translations || {};
    const languages = Object.keys(translations);

    if (!languages.length) {
        box.textContent = "Verified translation data connect karein.";
        return;
    }

    languages.forEach(language => {
        const card = make("div");
        card.appendChild(make("h4", language.toUpperCase()));
        card.appendChild(make("p", String(translations[language])));
        box.appendChild(card);
    });
}

$("hquP5CompareButton")?.addEventListener("click", () => {
    if (!selectedAyah) {
        message("hquP5CompareResults", "Pehle Ayah select karein.");
        return;
    }
    renderTranslations(selectedAyah);
});

/* 5. Tajweed Learning Guide */

const tajweedTopics = {
    all: "Verified Tajweed lessons dataset connect karein.",
    noon: "Noon Sakinah aur Tanween ka authentic lesson add karein.",
    meem: "Meem Sakinah ka authentic lesson add karein.",
    madd: "Madd ke rules ka verified lesson add karein.",
    qalqalah: "Qalqalah ka verified lesson add karein.",
    ghunnah: "Ghunnah ka verified lesson add karein."
};

$("hquP5LoadTajweed")?.addEventListener("click", () => {
    const topic = $("hquP5TajweedTopic")?.value || "all";
    message(
        "hquP5TajweedContent",
        tajweedTopics[topic] || tajweedTopics.all
    );
});

/* 6. Tajweed Color Legend */

const legend = $("hquP5LearningCenter")?.querySelector(".hqu-p5-color-list");
if (legend) {
    legend.setAttribute(
        "aria-label",
        "Illustrative Tajweed color legend"
    );
}

/* 7. Memorization Mode */

function renderMemorization(detail = selectedAyah) {
    if (!detail) {
        message(
            "hquP5MemorizeContent",
            "Quran reader se Ayah select karein."
        );
        return;
    }

    showAyahText("hquP5MemorizeContent", detail);
}

$("hquP5StartMemorize")?.addEventListener("click", () => {
    selectedAyah = selectedAyah || null;

    if (!selectedAyah) {
        message(
            "hquP5MemorizeContent",
            "Pehle Quran reader mein Ayah select karein."
        );
        return;
    }

    renderMemorization(selectedAyah);
});

/* 8. Hide and Reveal Ayah */

$("hquP5HideAyah")?.addEventListener("click", () => {
    const box = $("hquP5HiddenAyah");
    if (!box) return;

    box.textContent = "Ayah hidden — pehle yaad karein, phir reveal karein.";
});

$("hquP5RevealAyah")?.addEventListener("click", () => {
    if (!selectedAyah?.arabic) {
        message("hquP5HiddenAyah", "Ayah text data available nahi.");
        return;
    }

    showAyahText("hquP5HiddenAyah", selectedAyah);
});

/* 9. Daily Memorization Goals */

function renderGoal() {
    goals.target = Math.max(1, Number(goals.target) || 1);
    goals.completed = Math.max(0, Number(goals.completed) || 0);

    const percent = Math.min(
        100,
        Math.round(goals.completed / goals.target * 100)
    );

    message(
        "hquP5GoalProgress",
        `Daily goal: ${goals.completed} / ${goals.target} Ayahs (${percent}%)`
    );
}

$("hquP5SaveGoal")?.addEventListener("click", () => {
    goals.target = numberValue("hquP5DailyGoal", 5);
    save(STORE.goals, goals);
    renderGoal();
});

$("hquP5CompleteGoal")?.addEventListener("click", () => {
    goals.completed++;
    progress.memorized++;
    save(STORE.goals, goals);
    save(STORE.progress, progress);
    renderGoal();
    renderProgress();
});

/* 10. Reading Session Timer */

function renderTimer() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    message(
        "hquP5TimerDisplay",
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );
}

$("hquP5TimerStart")?.addEventListener("click", () => {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        timerSeconds++;
        renderTimer();
    }, 1000);
});

$("hquP5TimerPause")?.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

$("hquP5TimerReset")?.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 0;
    renderTimer();
});

/* 11. Ayah Notes */

function renderNotes() {
    const box = $("hquP5NotesList");
    if (!box) return;

    box.replaceChildren();

    if (!notes.length) {
        box.textContent = "Abhi koi personal note save nahi.";
        return;
    }

    notes.forEach((note, index) => {
        const card = make("div");
        card.appendChild(
            make("p", `Surah ${note.surah} — Ayah ${note.ayah}`)
        );
        card.appendChild(make("p", note.text));
        card.appendChild(make("small", note.date));

        const remove = make("button", "Delete Note");
        remove.type = "button";

        remove.addEventListener("click", () => {
            notes.splice(index, 1);
            save(STORE.notes, notes);
            renderNotes();
        });

        card.appendChild(remove);
        box.appendChild(card);
    });
}

$("hquP5SaveNote")?.addEventListener("click", () => {
    const text = $("hquP5NoteText")?.value?.trim();
    if (!text) {
        message("hquP5NotesList", "Pehle note likhein.");
        return;
    }

    notes.unshift({
        surah: numberValue("hquP5NoteSurah"),
        ayah: numberValue("hquP5NoteAyah"),
        text,
        date: new Date().toLocaleString()
    });

    save(STORE.notes, notes);

    if ($("hquP5NoteText")) $("hquP5NoteText").value = "";

    renderNotes();
});

/* 12. Ayah Collections */

function renderCollections() {
    const box = $("hquP5CollectionsList");
    if (!box) return;

    box.replaceChildren();

    if (!collections.length) {
        box.textContent = "Abhi koi collection nahi.";
        return;
    }

    collections.forEach((item, index) => {
        const card = make("div");
        card.appendChild(make("h4", item.name));
        card.appendChild(
            make("p", `Surah ${item.surah} — Ayah ${item.ayah}`)
        );

        const remove = make("button", "Remove");
        remove.type = "button";

        remove.addEventListener("click", () => {
            collections.splice(index, 1);
            save(STORE.collections, collections);
            renderCollections();
        });

        card.appendChild(remove);
        box.appendChild(card);
    });
}

$("hquP5AddCollection")?.addEventListener("click", () => {
    const name = $("hquP5CollectionName")?.value?.trim();

    if (!name) {
        message("hquP5CollectionsList", "Collection ka naam likhein.");
        return;
    }

    collections.unshift({
        name,
        surah: numberValue("hquP5CollectionSurah"),
        ayah: numberValue("hquP5CollectionAyah")
    });

    save(STORE.collections, collections);
    renderCollections();

    if ($("hquP5CollectionName")) {
        $("hquP5CollectionName").value = "";
    }
});

/* 13. Copy Ayah */

function updateCopyText(detail) {
    const input = $("hquP5CopyText");
    if (input && detail?.arabic) {
        input.value = detail.arabic;
    }
}

async function copyText(text) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const temp = document.createElement("textarea");
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand("copy");
            temp.remove();
        }
        return true;
    } catch {
        return false;
    }
}

$("hquP5CopyButton")?.addEventListener("click", async () => {
    const text = $("hquP5CopyText")?.value?.trim();

    if (!text) {
        message("hquP5CopyMessage", "Copy karne ke liye Ayah select karein.");
        return;
    }

    const ok = await copyText(text);

    message(
        "hquP5CopyMessage",
        ok ? "Ayah copied successfully!" : "Copy nahi ho saka."
    );
});

/* 14. Share Ayah */

$("hquP5ShareButton")?.addEventListener("click", async () => {
    const text = $("hquP5CopyText")?.value?.trim();

    if (!text) {
        message("hquP5ShareMessage", "Pehle Ayah select karein.");
        return;
    }

    try {
        if (navigator.share) {
            await navigator.share({
                title: "Holy Quran",
                text
            });
            message("hquP5ShareMessage", "Share request complete.");
        } else {
            const ok = await copyText(text);
            message(
                "hquP5ShareMessage",
                ok ? "Share supported nahi — text copied." : "Share nahi ho saka."
            );
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            message("hquP5ShareMessage", "Sharing unavailable.");
        }
    }
});

/* 15. Arabic Font Customization */

$("hquP5ApplyFont")?.addEventListener("click", () => {
    const font = $("hquP5ArabicFont")?.value || "Traditional Arabic";

    const targets = document.querySelectorAll(
        "#hquP5LearningCenter, .ayah-arabic, .arabic-text, .quran-arabic, [data-quran-arabic]"
    );

    targets.forEach(node => {
        node.style.fontFamily = `"${font}", "Noto Naskh Arabic", serif`;
    });

    settings.font = font;
    save(STORE.settings, settings);
});

/* 16. Arabic Line Spacing */

$("hquP5ApplySpacing")?.addEventListener("click", () => {
    const spacing = Number($("hquP5LineSpacing")?.value || 2);

    document.querySelectorAll(
        "#hquP5LearningCenter .ayah-arabic, #hquP5LearningCenter .arabic-text, #hquP5LearningCenter .quran-arabic, [data-quran-arabic]"
    ).forEach(node => {
        node.style.lineHeight = spacing;
    });

    message("hquP5SpacingValue", `${spacing}`);
    settings.spacing = spacing;
    save(STORE.settings, settings);
});

/* 17. Reading Display Mode */

$("hquP5ApplyDisplay")?.addEventListener("click", () => {
    const mode = $("hquP5DisplayMode")?.value || "comfortable";
    const section = $("hquP5LearningCenter");

    if (!section) return;

    section.classList.remove(
        "hqu-p5-view-compact",
        "hqu-p5-view-comfortable",
        "hqu-p5-view-large"
    );

    section.classList.add(`hqu-p5-view-${mode}`);

    settings.display = mode;
    save(STORE.settings, settings);
});

/* 18. Translation Visibility */

$("hquP5ApplyTranslation")?.addEventListener("click", () => {
    const visible = $("hquP5ShowTranslation")?.checked ?? true;
    const section = $("hquP5LearningCenter");

    if (!section) return;

    section.classList.toggle("hqu-p5-hide-translations", !visible);

    settings.translationVisible = visible;
    save(STORE.settings, settings);
});

/* 19. Quran Learning Quiz */

function buildQuiz() {
    quizQuestions = [];

    if (!surahs.length) return;

    const total = surahs.length;

    quizQuestions.push({
        question: "Quran Majeed mein total kitni Surahs hain?",
        answer: String(total),
        options: [String(total - 1), String(total), String(total + 1)]
    });

    surahs.slice(0, 10).forEach(s => {
        const n = Number(s.number || s.surahNumber || s.id);
        const name = surahName(s);

        quizQuestions.push({
            question: `Surah "${name}" ka number kya hai?`,
            answer: String(n),
            options: [
                String(Math.max(1, n - 1)),
                String(n),
                String(Math.min(total, n + 1))
            ]
        });
    });

    quizQuestions = quizQuestions.sort(() => Math.random() - 0.5);
}

function showQuizQuestion() {
    if (quizIndex >= quizQuestions.length) {
        message(
            "hquP5QuizQuestion",
            `Quiz complete! Score: ${quizScore} / ${quizTotal}`
        );

        message("hquP5QuizOptions", "");
        message("hquP5QuizResult", "Aapka quiz complete ho gaya.");

        progress.quizCorrect += quizScore;
        save(STORE.progress, progress);
        renderProgress();
        return;
    }

    const q = quizQuestions[quizIndex];

    message(
        "hquP5QuizQuestion",
        `${quizIndex + 1}. ${q.question}`
    );

    const box = $("hquP5QuizOptions");
    if (!box) return;

    box.replaceChildren();

    const options = [...q.options].sort(() => Math.random() - 0.5);

    options.forEach(option => {
        const btn = make("button", option);
        btn.type = "button";

        btn.addEventListener("click", () => {
            const correct = option === q.answer;

            if (correct) quizScore++;

            quizTotal++;
            message(
                "hquP5QuizResult",
                correct ? "Correct answer!" : `Correct answer: ${q.answer}`
            );

            quizIndex++;
            setTimeout(showQuizQuestion, 900);
        });

        box.appendChild(btn);
    });
}

$("hquP5StartQuiz")?.addEventListener("click", () => {
    buildQuiz();

    if (!quizQuestions.length) {
        message("hquP5QuizQuestion", "Surah data load nahi hua.");
        return;
    }

    quizScore = 0;
    quizTotal = 0;
    quizIndex = 0;

    showQuizQuestion();
});

/* 20. Learning Progress Tracker */

function renderProgress() {
    const box = $("hquP5ProgressStats");
    if (box) {
        box.textContent =
            `Memorized Ayahs: ${progress.memorized} | ` +
            `Correct Quiz Answers: ${progress.quizCorrect} | ` +
            `Reading Goal Completed: ${goals.completed}`;
    }

    const bar = $("hquP5ProgressBar");
    if (bar) {
        const target = Math.max(1, goals.target);
        const percent = Math.min(
            100,
            Math.round(goals.completed / target * 100)
        );

        bar.style.width = `${percent}%`;
        bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-valuenow", String(percent));
        bar.setAttribute("aria-valuemin", "0");
        bar.setAttribute("aria-valuemax", "100");
    }
}

$("hquP5RefreshProgress")?.addEventListener("click", renderProgress);

/* Load Surah metadata */

async function loadSurahData() {
    try {
        const response = await fetch("./data/surahs.json");

        if (!response.ok) throw new Error("Surah file not found");

        const data = await response.json();

        surahs = Array.isArray(data) ? data :
            Array.isArray(data.surahs) ? data.surahs : [];

        [
            "hquP5WordSurah",
            "hquP5TafsirSurah",
            "hquP5MemorizeSurah",
            "hquP5NoteSurah",
            "hquP5CollectionSurah"
        ].forEach(populateSurah);

        buildQuiz();

    } catch {
        console.warn(
            "Package 5: ./data/surahs.json not found. Add verified Surah metadata."
        );
    }
}

/* Restore settings */

function restoreSettings() {
    const section = $("hquP5LearningCenter");
    if (!section) return;

    if (settings.display) {
        section.classList.add(`hqu-p5-view-${settings.display}`);

        if ($("hquP5DisplayMode")) {
            $("hquP5DisplayMode").value = settings.display;
        }
    }

    if (settings.translationVisible === false) {
        section.classList.add("hqu-p5-hide-translations");

        if ($("hquP5ShowTranslation")) {
            $("hquP5ShowTranslation").checked = false;
        }
    }

    if (settings.font) {
        document.querySelectorAll(
            "#hquP5LearningCenter .ayah-arabic, #hquP5LearningCenter .arabic-text, #hquP5LearningCenter .quran-arabic"
        ).forEach(node => {
            node.style.fontFamily =
                `"${settings.font}", "Noto Naskh Arabic", serif`;
        });
    }
}

/* Initialize all Package 5 features */

function initializePackage5() {
    renderGoal();
    renderTimer();
    renderNotes();
    renderCollections();
    renderProgress();
    restoreSettings();
    loadSurahData();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePackage5, {
        once: true
    });
} else {
    initializePackage5();
}

})();

/* =====================================================
   HOLY QURAN ULTIMATE
   PACKAGE 6 — 30 ADVANCED FEATURES
   File: script.js
===================================================== */

(function () {
  "use strict";

  const PREFIX = "hquPackage6";

  const $ = id => document.getElementById(id);

  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(PREFIX + key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const save = (key, value) => {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  };

  const text = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value;
  };

  const make = (tag, value, parent) => {
    const el = document.createElement(tag);
    el.textContent = value;
    parent.appendChild(el);
    return el;
  };

  let surahs = [];
  let metadata = {
    juz: [], para: [], hizb: [], ruku: [], sajdah: []
  };

  let currentAyah = null;
  const ayahCache = {};

  let history = read("History", []);
  let recent = read("Recent", []);
  let completed = read("Completed", []);
  let stats = read("Stats", {
    events: 0,
    ayahs: 0,
    dates: [],
    surahs: []
  });

  function numberOf(s) {
    return Number(
      s.number || s.surahNumber || s.id || 0
    );
  }

  function surahName(s) {
    return s.englishName ||
      s.nameEnglish ||
      s.english_name ||
      s.name ||
      "Surah";
  }

  function arabicName(s) {
    return s.arabicName ||
      s.nameArabic ||
      s.arabic_name ||
      "";
  }

  function ayahCount(s) {
    return Number(
      s.numberOfAyahs ||
      s.ayahCount ||
      s.totalAyahs ||
      0
    );
  }

  function getSurah(number) {
    return surahs.find(s => numberOf(s) === Number(number));
  }

  function showMessage(id, message) {
    text(id, message);
  }

  function navigate(surahNumber, ayahNumber) {
    const s = getSurah(surahNumber);

    if (!s) {
      return "Surah metadata available nahi.";
    }

    const total = ayahCount(s);

    if (
      !Number.isInteger(Number(ayahNumber)) ||
      Number(ayahNumber) < 1 ||
      (total && Number(ayahNumber) > total)
    ) {
      return "Ayah number durust nahi.";
    }

    const detail = {
      surahNumber: Number(surahNumber),
      ayahNumber: Number(ayahNumber)
    };

    document.dispatchEvent(
      new CustomEvent("hqu:navigate", { detail })
    );

    return `Opening ${surahName(s)} — Ayah ${ayahNumber}.`;
  }

  function fillSurahSelect(id) {
    const el = $(id);
    if (!el) return;

    el.replaceChildren();

    make("option", "Select Surah", el).value = "";

    surahs.forEach(s => {
      const option = make(
        "option",
        `${numberOf(s)}. ${surahName(s)} ${arabicName(s)}`,
        el
      );
      option.value = numberOf(s);
    });
  }

  function normalizePlace(s) {
    const value = String(
      s.revelationType ||
      s.revelationPlace ||
      s.type ||
      s.revelation_type ||
      ""
    ).toLowerCase();

    if (/makki|mecca|meccan/.test(value)) return "makki";
    if (/madani|medina|medinan/.test(value)) return "madani";

    return "";
  }

  function renderSurahList(containerId, list) {
    const box = $(containerId);
    if (!box) return;

    box.replaceChildren();

    if (!list.length) {
      make("p", "Koi matching verified Surah nahi mili.", box);
      return;
    }

    list.forEach(s => {
      const item = make("button", "", box);
      item.type = "button";
      item.className = "hqu-p6-result-item";
      item.textContent =
        `${numberOf(s)}. ${surahName(s)} — ${ayahCount(s)} Ayahs`;

      item.addEventListener("click", () => {
        showMessage(
          "hquP6SearchResults",
          navigate(numberOf(s), 1)
        );
      });
    });
  }

  /* 1. ADVANCED SURAH SEARCH */

  $("hquP6SurahSearch")?.addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();

    const result = surahs.filter(s =>
      [
        surahName(s),
        arabicName(s),
        String(numberOf(s))
      ].join(" ").toLowerCase().includes(q)
    );

    renderSurahList("hquP6SearchResults", result);
  });

  /* 2. SURAH CATEGORY FILTER */

  $("hquP6Category")?.addEventListener("change", e => {
    const category = e.target.value.toLowerCase();

    const result = surahs.filter(s => {
      if (!category || category === "all") return true;
      return normalizePlace(s) === category;
    });

    renderSurahList("hquP6CategoryResults", result);
  });

  /* 3–6. JUZ, PARA, HIZB, RUKU */

  function setupMetadataSelect(id, type) {
    const el = $(id);
    if (!el) return;

    el.replaceChildren();
    make("option", `Select ${type}`, el).value = "";

    const list = metadata[type.toLowerCase()] || [];

    list.forEach((item, index) => {
      const option = make(
        "option",
        item.label || `${type} ${index + 1}`,
        el
      );
      option.value = index;
    });
  }

  function openMetadata(type, selectId, infoId) {
    const el = $(selectId);
    if (!el || !el.value) {
      showMessage(infoId, "Pehle option select karein.");
      return;
    }

    const item = metadata[type][Number(el.value)];

    if (!item) {
      showMessage(infoId, "Verified data available nahi.");
      return;
    }

    const s = Number(item.surahNumber || item.surah || 0);
    const a = Number(item.ayahNumber || item.ayah || 1);

    if (!s || !getSurah(s)) {
      showMessage(infoId, "Is location ka verified Surah data nahi.");
      return;
    }

    showMessage(
      infoId,
      `${item.label || type}: ${navigate(s, a)}`
    );
  }

  $("hquP6OpenJuz")?.addEventListener("click", () =>
    openMetadata("juz", "hquP6Juz", "hquP6JuzInfo")
  );

  $("hquP6OpenPara")?.addEventListener("click", () =>
    openMetadata("para", "hquP6Para", "hquP6ParaInfo")
  );

  $("hquP6OpenHizb")?.addEventListener("click", () =>
    openMetadata("hizb", "hquP6Hizb", "hquP6HizbInfo")
  );

  $("hquP6OpenRuku")?.addEventListener("click", () =>
    openMetadata("ruku", "hquP6Ruku", "hquP6RukuInfo")
  );

  /* 7. SAJDAH GUIDE */

  function renderSajdah() {
    const box = $("hquP6SajdahList");
    if (!box) return;

    box.replaceChildren();

    if (!metadata.sajdah.length) {
      make("p", "Verified Sajdah data abhi connect nahi.", box);
      return;
    }

    metadata.sajdah.forEach(item => {
      const button = make(
        "button",
        item.label ||
        `Surah ${item.surahNumber}, Ayah ${item.ayahNumber}`,
        box
      );

      button.type = "button";

      button.addEventListener("click", () => {
        showMessage(
          "hquP6SajdahInfo",
          navigate(item.surahNumber, item.ayahNumber)
        );
      });
    });
  }

  /* 8. REVELATION FILTER */

  $("hquP6RevelationFilter")?.addEventListener("change", e => {
    const place = e.target.value.toLowerCase();

    const result = surahs.filter(s =>
      !place || place === "all" ||
      normalizePlace(s) === place
    );

    renderSurahList("hquP6RevelationResults", result);
  });

  /* 9. REVELATION INFORMATION */

  $("hquP6ShowRevelation")?.addEventListener("click", () => {
    const s = getSurah($("hquP6InfoSurah")?.value);

    if (!s) {
      showMessage("hquP6RevelationInfo", "Surah select karein.");
      return;
    }

    const place = normalizePlace(s);

    showMessage(
      "hquP6RevelationInfo",
      place
        ? `${surahName(s)} — ${place.toUpperCase()}`
        : "Is Surah ki revelation information dataset mein nahi."
    );
  });

  /* 10. AYAH NUMBER NAVIGATOR */

  $("hquP6GoAyah")?.addEventListener("click", () => {
    const n = Number($("hquP6AyahNumber")?.value);

    const s = currentAyah
      ? getSurah(currentAyah.surahNumber)
      : surahs[0];

    if (!s) {
      showMessage("hquP6AyahInfo", "Surah data load karein.");
      return;
    }

    showMessage(
      "hquP6AyahInfo",
      navigate(numberOf(s), n)
    );
  });

  /* 11. JUMP TO SURAH */

  $("hquP6JumpButton")?.addEventListener("click", () => {
    const n = Number($("hquP6JumpSurah")?.value);

    showMessage(
      "hquP6JumpButton",
      navigate(n, 1)
    );
  });

  /* 12. JUMP TO AYAH */

  $("hquP6JumpAyahButton")?.addEventListener("click", () => {
    const s = currentAyah?.surahNumber ||
      numberOf(surahs[0] || {});

    const a = Number($("hquP6JumpAyah")?.value);

    showMessage(
      "hquP6JumpAyahButton",
      navigate(s, a)
    );
  });

  /* 13. LAST READ POSITION */

  function saveLastRead() {
    if (!currentAyah) {
      showMessage("hquP6LastReadInfo", "Pehle Quran ki Ayah open karein.");
      return;
    }

    save("LastRead", currentAyah);

    showMessage(
      "hquP6LastReadInfo",
      `Saved: Surah ${currentAyah.surahNumber}, Ayah ${currentAyah.ayahNumber}`
    );
  }

  function restoreLastRead() {
    const item = read("LastRead", null);

    if (!item) {
      showMessage("hquP6LastReadInfo", "Last Read record nahi mila.");
      return;
    }

    showMessage(
      "hquP6LastReadInfo",
      navigate(item.surahNumber, item.ayahNumber)
    );
  }

  $("hquP6SaveLastRead")?.addEventListener("click", saveLastRead);
  $("hquP6RestoreLastRead")?.addEventListener("click", restoreLastRead);

  /* 14. CONTINUE READING */

  $("hquP6ContinueReading")?.addEventListener("click", () => {
    const item = read("LastRead", null);

    showMessage(
      "hquP6ContinueInfo",
      item
        ? navigate(item.surahNumber, item.ayahNumber)
        : "Abhi reading history nahi hai."
    );
  });

  /* 15. READING HISTORY */

  function renderHistory() {
    const box = $("hquP6History");
    if (!box) return;

    box.replaceChildren();

    if (!history.length) {
      make("p", "Abhi history empty hai.", box);
      return;
    }

    history.slice(0, 30).forEach(item => {
      const s = getSurah(item.surahNumber);
      const label = s
        ? `${surahName(s)} — Ayah ${item.ayahNumber}`
        : `Surah ${item.surahNumber} — Ayah ${item.ayahNumber}`;

      const button = make("button", label, box);
      button.type = "button";

      button.addEventListener("click", () =>
        navigate(item.surahNumber, item.ayahNumber)
      );
    });
  }

  $("hquP6RefreshHistory")?.addEventListener("click", renderHistory);

  /* 16. RECENTLY OPENED SURAHS */

  function renderRecent() {
    const box = $("hquP6RecentSurahs");
    if (!box) return;

    box.replaceChildren();

    recent.forEach(n => {
      const s = getSurah(n);
      if (!s) return;

      const button = make("button", surahName(s), box);
      button.type = "button";

      button.addEventListener("click", () =>
        navigate(n, 1)
      );
    });
  }

  /* 17. SURAH COMPLETION TRACKER */

  $("hquP6MarkComplete")?.addEventListener("click", () => {
    const n = Number($("hquP6CompleteSurah")?.value);
    const s = getSurah(n);

    if (!s) {
      showMessage("hquP6CompletionList", "Surah select karein.");
      return;
    }

    if (!completed.includes(n)) completed.push(n);

    save("Completed", completed);
    renderCompleted();
  });

  function renderCompleted() {
    const box = $("hquP6CompletionList");
    if (!box) return;

    box.replaceChildren();

    make(
      "p",
      `${completed.length} Surahs manually marked complete.`,
      box
    );

    completed.forEach(n => {
      const s = getSurah(n);
      if (s) make("div", `✓ ${surahName(s)}`, box);
    });
  }

  /* 18. AYAH RANGE SELECTION */

  $("hquP6SelectRange")?.addEventListener("click", () => {
    const start = Number($("hquP6RangeStart")?.value);
    const end = Number($("hquP6RangeEnd")?.value);

    if (
      !currentAyah ||
      !start ||
      !end ||
      end < start
    ) {
      showMessage("hquP6RangeInfo", "Valid Ayah range enter karein.");
      return;
    }

    const s = getSurah(currentAyah.surahNumber);

    if (s && ayahCount(s) && end > ayahCount(s)) {
      showMessage("hquP6RangeInfo", "Range Surah ki Ayah limit se bahar hai.");
      return;
    }

    save("Range", {
      surahNumber: currentAyah.surahNumber,
      start,
      end
    });

    showMessage(
      "hquP6RangeInfo",
      `Selected range: ${start}–${end}.`
    );
  });

  /* 19. SELECTED AYAHS READER */

  $("hquP6ReadSelection")?.addEventListener("click", () => {
    const box = $("hquP6SelectedReader");
    if (!box) return;

    box.replaceChildren();

    const range = read("Range", null);

    if (!range) {
      make("p", "Pehle Ayah range select karein.", box);
      return;
    }

    let found = 0;

    for (let n = range.start; n <= range.end; n++) {
      const item = ayahCache[
        `${range.surahNumber}:${n}`
      ];

      if (!item) continue;

      const card = make("div", "", box);
      card.className = "hqu-p6-selected-ayah";

      make("h4", `Ayah ${n}`, card);

      if (item.arabic) make("p", item.arabic, card);
      if (item.translation) make("p", item.translation, card);

      found++;
    }

    if (!found) {
      make(
        "p",
        "Is range ki Ayahs abhi reader se load nahi hui. Reader mein Ayahs open karein.",
        box
      );
    }
  });

  /* 20. FOCUS MODE */

  $("hquP6FocusMode")?.addEventListener("click", () => {
    const wrapper = $("hquP6Dashboard");
    if (!wrapper) return;

    wrapper.classList.toggle("hqu-p6-focus-active");
  });

  /* 21. FULL SCREEN */

  $("hquP6Fullscreen")?.addEventListener("click", async () => {
    const wrapper = $("hquP6Dashboard");
    if (!wrapper) return;

    try {
      if (!document.fullscreenElement) {
        if (wrapper.requestFullscreen) {
          await wrapper.requestFullscreen();
        } else {
          wrapper.classList.toggle("hqu-p6-fullscreen-fallback");
        }
      } else {
        await document.exitFullscreen();
      }
    } catch {
      wrapper.classList.toggle("hqu-p6-fullscreen-fallback");
    }
  });

  /* 22. ORIENTATION FRIENDLY LAYOUT */

  $("hquP6ApplyOrientation")?.addEventListener("click", () => {
    const wrapper = $("hquP6Dashboard");
    if (!wrapper) return;

    const mode = $("hquP6Orientation")?.value;

    wrapper.classList.remove(
      "hqu-p6-landscape",
      "hqu-p6-portrait"
    );

    if (mode === "landscape") {
      wrapper.classList.add("hqu-p6-landscape");
    } else if (mode === "portrait") {
      wrapper.classList.add("hqu-p6-portrait");
    }
  });

  /* 23. ARABIC FONT SIZE */

  $("hquP6ApplyArabicSize")?.addEventListener("click", () => {
    const size = Number($("hquP6ArabicSize")?.value || 32);

    text("hquP6ArabicSizeValue", `${size}px`);

    document.querySelectorAll(
      "#hquP6Dashboard .ayah-arabic, " +
      "#hquP6Dashboard .arabic-text, " +
      "#hquP6Dashboard .quran-arabic, " +
      "#hquP6Dashboard [data-quran-arabic]"
    ).forEach(el => {
      el.style.fontSize = `${size}px`;
    });

    save("ArabicSize", size);
  });

  /* 24. ARABIC ALIGNMENT */

  $("hquP6ApplyAlignment")?.addEventListener("click", () => {
    const value = $("hquP6Alignment")?.value || "right";

    document.querySelectorAll(
      "#hquP6Dashboard .ayah-arabic, " +
      "#hquP6Dashboard .arabic-text, " +
      "#hquP6Dashboard .quran-arabic, " +
      "#hquP6Dashboard [data-quran-arabic]"
    ).forEach(el => {
      el.style.textAlign = value;
      el.dir = "rtl";
    });

    save("Alignment", value);
  });

  /* 25. TRANSLATION FONT SIZE */

  $("hquP6ApplyTranslationSize")?.addEventListener("click", () => {
    const size = Number($("hquP6TranslationSize")?.value || 16);

    text("hquP6TranslationSizeValue", `${size}px`);

    document.querySelectorAll(
      "#hquP6Dashboard .ayah-translation, " +
      "#hquP6Dashboard .quran-translation, " +
      "#hquP6Dashboard [data-quran-translation]"
    ).forEach(el => {
      el.style.fontSize = `${size}px`;
    });

    save("TranslationSize", size);
  });

  /* 26. TRANSLATION SEARCH */

  $("hquP6TranslationSearch")?.addEventListener("input", e => {
    const q = e.target.value.trim().toLowerCase();
    const box = $("hquP6TranslationResults");

    if (!box) return;
    box.replaceChildren();

    if (!q) return;

    const elements = document.querySelectorAll(
      ".ayah-translation, .quran-translation, [data-quran-translation]"
    );

    let count = 0;

    elements.forEach(el => {
      if (el.textContent.toLowerCase().includes(q)) {
        make("p", el.textContent, box);
        count++;
      }
    });

    if (!count) {
      make("p", "Loaded translation mein koi result nahi mila.", box);
    }
  });

  /* 27. SURAH INFORMATION PANEL */

  $("hquP6OpenPanel")?.addEventListener("click", () => {
    const s = getSurah($("hquP6PanelSurah")?.value);
    const box = $("hquP6SurahPanel");

    if (!box) return;
    box.replaceChildren();

    if (!s) {
      make("p", "Surah select karein.", box);
      return;
    }

    make("h3", surahName(s), box);

    if (arabicName(s)) make("p", arabicName(s), box);

    make("p", `Surah Number: ${numberOf(s)}`, box);
    make("p", `Ayahs: ${ayahCount(s) || "Not available"}`, box);

    const place = normalizePlace(s);

    make(
      "p",
      `Revelation: ${place || "Information unavailable"}`,
      box
    );
  });

  /* 28. READING STATISTICS */

  function renderStatistics() {
    const box = $("hquP6Statistics");
    if (!box) return;

    box.replaceChildren();

    make("p", `Reading events: ${stats.events}`, box);
    make("p", `Unique Ayahs tracked: ${stats.ayahs}`, box);
    make("p", `Unique Surahs read: ${stats.surahs.length}`, box);
    make("p", `Completed Surahs: ${completed.length}`, box);
  }

  $("hquP6StatisticsRefresh")?.addEventListener(
    "click",
    renderStatistics
  );

  /* 29. DAILY READING STREAK */

  function localDate() {
    const d = new Date();

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
  }

  function calculateStreak() {
    const dates = [...new Set(stats.dates)].sort().reverse();

    if (!dates.length) return 0;

    const today = new Date(localDate() + "T12:00:00");
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    const todayString = localDate();
    const yesterdayString = [
      yesterday.getFullYear(),
      String(yesterday.getMonth() + 1).padStart(2, "0"),
      String(yesterday.getDate()).padStart(2, "0")
    ].join("-");

    if (
      dates[0] !== todayString &&
      dates[0] !== yesterdayString
    ) return 0;

    let streak = 0;
    let expected = new Date(dates[0] + "T12:00:00");

    for (const date of dates) {
      const expectedString = [
        expected.getFullYear(),
        String(expected.getMonth() + 1).padStart(2, "0"),
        String(expected.getDate()).padStart(2, "0")
      ].join("-");

      if (date !== expectedString) break;

      streak++;
      expected.setDate(expected.getDate() - 1);
    }

    return streak;
  }

  function renderStreak() {
    text(
      "hquP6Streak",
      `Current reading streak: ${calculateStreak()} days`
    );
  }

  $("hquP6RecordReading")?.addEventListener("click", () => {
    if (!currentAyah) {
      showMessage(
        "hquP6Streak",
        "Reading record ke liye pehle Quran ki Ayah open karein."
      );
      return;
    }

    const today = localDate();

    if (!stats.dates.includes(today)) {
      stats.dates.push(today);
    }

    save("Stats", stats);
    renderStreak();
  });

  /* 30. PERSONAL QURAN DASHBOARD */

  function renderDashboard() {
    const box = $("hquP6PersonalDashboard");
    if (!box) return;

    box.replaceChildren();

    make("h3", "My Quran Dashboard", box);
    make("p", `Reading Events: ${stats.events}`, box);
    make("p", `Ayahs Tracked: ${stats.ayahs}`, box);
    make("p", `Surahs Read: ${stats.surahs.length}`, box);
    make("p", `Completed Surahs: ${completed.length}`, box);
    make("p", `Reading Streak: ${calculateStreak()} days`, box);

    const last = read("LastRead", null);

    make(
      "p",
      last
        ? `Last Read: Surah ${last.surahNumber}, Ayah ${last.ayahNumber}`
        : "Last Read: Not available",
      box
    );
  }

  $("hquP6RefreshDashboard")?.addEventListener(
    "click",
    renderDashboard
  );

  /* RECEIVE CURRENT AYAH FROM QURAN READER */

  document.addEventListener("hqu:ayah-selected", event => {
    const d = event.detail || {};

    const s = Number(d.surahNumber);
    const a = Number(d.ayahNumber);

    if (!s || !a) return;

    currentAyah = {
      surahNumber: s,
      ayahNumber: a,
      surahName: d.surahName || "",
      arabic: d.arabic || "",
      translation:
        d.translation ||
        (Array.isArray(d.translations)
          ? d.translations.join(" ")
          : "")
    };

    ayahCache[`${s}:${a}`] = currentAyah;

    save("LastRead", currentAyah);

    history.unshift({
      surahNumber: s,
      ayahNumber: a,
      date: localDate()
    });

    history = history.slice(0, 100);
    save("History", history);

    recent = [s, ...recent.filter(n => n !== s)].slice(0, 20);
    save("Recent", recent);

    const ayahKey = `${s}:${a}`;

    const tracked = read("TrackedAyahs", []);

    if (!tracked.includes(ayahKey)) {
      tracked.push(ayahKey);
      stats.ayahs = tracked.length;
      save("TrackedAyahs", tracked);
    }

    stats.events++;

    if (!stats.surahs.includes(s)) {
      stats.surahs.push(s);
    }

    if (!stats.dates.includes(localDate())) {
      stats.dates.push(localDate());
    }

    save("Stats", stats);

    renderHistory();
    renderRecent();
    renderStreak();
  });

  /* RECEIVE VERIFIED QURAN LOCATION METADATA */

  document.addEventListener("hqu:quran-metadata", event => {
    const d = event.detail || {};

    ["juz", "para", "hizb", "ruku", "sajdah"].forEach(key => {
      if (Array.isArray(d[key])) {
        metadata[key] = d[key];
      }
    });

    setupMetadataSelect("hquP6Juz", "Juz");
    setupMetadataSelect("hquP6Para", "Para");
    setupMetadataSelect("hquP6Hizb", "Hizb");
    setupMetadataSelect("hquP6Ruku", "Ruku");

    renderSajdah();
  });

  /* LOAD SURAH DATA */

  async function loadSurahs() {
    try {
      const response = await fetch("./data/surahs.json");

      if (!response.ok) {
        throw new Error("Surah data file not found");
      }

      const data = await response.json();

      surahs = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : [];

      fillSurahSelect("hquP6InfoSurah");
      fillSurahSelect("hquP6JumpSurah");
      fillSurahSelect("hquP6CompleteSurah");
      fillSurahSelect("hquP6PanelSurah");

      renderCompleted();
      renderHistory();
      renderRecent();
      renderStatistics();
      renderStreak();
      renderDashboard();
      renderSajdah();

    } catch (error) {
      console.warn("Package 6:", error.message);

      [
        "hquP6SearchResults",
        "hquP6CategoryResults",
        "hquP6RevelationResults"
      ].forEach(id => {
        showMessage(
          id,
          "Surah metadata load nahi hua. ./data/surahs.json check karein."
        );
      });
    }
  }

  /* RESTORE SAVED READING SETTINGS */

  function restoreSettings() {
    const arabicSize = read("ArabicSize", null);
    const translationSize = read("TranslationSize", null);
    const alignment = read("Alignment", null);

    if (arabicSize && $("hquP6ArabicSize")) {
      $("hquP6ArabicSize").value = arabicSize;
    }

    if (translationSize && $("hquP6TranslationSize")) {
      $("hquP6TranslationSize").value = translationSize;
    }

    if (alignment && $("hquP6Alignment")) {
      $("hquP6Alignment").value = alignment;
    }
  }

  restoreSettings();
  loadSurahs();

  console.log("Holy Quran Ultimate — Package 6 loaded.");

})();

/* =========================================================
   HOLY QURAN ULTIMATE
   PACKAGE 7 — 50 ADVANCED FEATURES
   JAVASCRIPT
========================================================= */

(function () {
  "use strict";

  const P = "hquPackage7_";
  const $ = id => document.getElementById(id);

  const get = (key, fallback = []) => {
    try {
      const value = JSON.parse(localStorage.getItem(P + key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };

  const set = (key, value) => {
    try {
      localStorage.setItem(P + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("Storage error:", error);
      return false;
    }
  };

  const message = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value;
  };

  const make = (tag, value, parent) => {
    const el = document.createElement(tag);
    el.textContent = value;
    parent.appendChild(el);
    return el;
  };

  const clear = id => {
    const el = $(id);
    if (el) el.replaceChildren();
    return el;
  };

  const button = (parent, label, callback) => {
    const b = make("button", label, parent);
    b.type = "button";
    b.addEventListener("click", callback);
    return b;
  };

  let currentAyah = null;
  let content = {
    translations: [],
    tafsir: [],
    duas: [],
    knowledge: [],
    quiz: [],
    vocabulary: []
  };

  let quizQuestions = [];
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;

  const profiles = {
    alafasy: "Mishary Rashid Alafasy",
    abdulbasit: "Abdul Basit",
    sudais: "Abdur Rahman Al-Sudais",
    shuraim: "Saud Al-Shuraim",
    husary: "Mahmoud Khalil Al-Husary"
  };

  /* =====================================================
     1. MULTIPLE RECITERS LIBRARY
  ===================================================== */

  $("hquP7SaveReciter")?.addEventListener("click", () => {
    const id = $("hquP7Reciter")?.value;

    if (!id || !profiles[id]) {
      message("hquP7ReciterInfo", "Reciter select karein.");
      return;
    }

    set("Reciter", id);
    message("hquP7ReciterInfo", "Selected: " + profiles[id]);

    document.dispatchEvent(
      new CustomEvent("hqu:p7-reciter-selected", {
        detail: { id, name: profiles[id] }
      })
    );
  });

  /* 2. RECITER PROFILE CARDS */

  $("hquP7ShowProfiles")?.addEventListener("click", () => {
    const box = clear("hquP7Profiles");
    if (!box) return;

    Object.entries(profiles).forEach(([id, name]) => {
      const card = make("div", "", box);
      make("h4", name, card);

      button(card, "Select Reciter", () => {
        const select = $("hquP7Reciter");
        if (select) select.value = id;
        $("hquP7SaveReciter")?.click();
      });
    });
  });

  /* 3. AUDIO QUALITY */

  $("hquP7SaveQuality")?.addEventListener("click", () => {
    const value = $("hquP7AudioQuality")?.value || "medium";
    set("AudioQuality", value);
    message("hquP7QualityInfo", "Audio preference saved: " + value);

    document.dispatchEvent(
      new CustomEvent("hqu:p7-audio-quality", {
        detail: { quality: value }
      })
    );
  });

  /* 4. AUDIO DOWNLOAD MANAGER */

  $("hquP7StartDownload")?.addEventListener("click", () => {
    const surah = Number($("hquP7DownloadSurah")?.value);

    if (!Number.isInteger(surah) || surah < 1 || surah > 114) {
      message("hquP7DownloadStatus", "Surah number 1 se 114 tak enter karein.");
      return;
    }

    message(
      "hquP7DownloadStatus",
      "Audio downloader se connection request bheji ja rahi hai."
    );

    const progress = $("hquP7DownloadProgress");
    if (progress) progress.value = 0;

    document.dispatchEvent(
      new CustomEvent("hqu:request-audio-download", {
        detail: { surahNumber: surah }
      })
    );
  });

  document.addEventListener("hqu:audio-download-progress", event => {
    const d = event.detail || {};
    const progress = $("hquP7DownloadProgress");

    if (progress) {
      progress.value = Math.max(0, Math.min(100, Number(d.progress) || 0));
    }

    message(
      "hquP7DownloadStatus",
      d.message || `Download progress: ${progress?.value || 0}%`
    );
  });

  /* 5. DOWNLOADED AUDIO LIBRARY */

  let downloadedAudio = get("DownloadedAudio", []);

  function renderDownloads() {
    const box = clear("hquP7DownloadedLibrary");
    if (!box) return;

    if (!downloadedAudio.length) {
      make("p", "Abhi downloaded audio record nahi hai.", box);
      return;
    }

    downloadedAudio.forEach(item => {
      make(
        "p",
        `Surah ${item.surahNumber} — ${item.reciter || "Qari"}`,
        box
      );
    });
  }

  $("hquP7ShowDownloads")?.addEventListener("click", renderDownloads);

  document.addEventListener("hqu:audio-downloaded", event => {
    const d = event.detail || {};
    if (!d.surahNumber) return;

    downloadedAudio = downloadedAudio.filter(
      x => x.surahNumber !== d.surahNumber
    );

    downloadedAudio.unshift({
      surahNumber: d.surahNumber,
      reciter: d.reciter || "",
      date: new Date().toISOString()
    });

    set("DownloadedAudio", downloadedAudio);
    renderDownloads();
  });

  /* 6. AUDIO STORAGE MANAGER */

  $("hquP7CheckAudioStorage")?.addEventListener("click", async () => {
    const box = $("hquP7AudioStorageInfo");
    if (!box) return;

    box.textContent = "Checking storage...";

    try {
      if (!navigator.storage || !navigator.storage.estimate) {
        box.textContent = "Browser storage estimate supported nahi.";
        return;
      }

      const estimate = await navigator.storage.estimate();

      const used = (estimate.usage || 0) / 1024 / 1024;
      const total = (estimate.quota || 0) / 1024 / 1024;

      box.textContent =
        `Estimated browser storage used: ${used.toFixed(2)} MB / ${total.toFixed(2)} MB`;
    } catch {
      box.textContent = "Storage information unavailable.";
    }
  });

  /* 7. SURAH AUDIO QUEUE */

  let queue = get("AudioQueue", []);

  function renderQueue() {
    const box = clear("hquP7AudioQueue");
    if (!box) return;

    if (!queue.length) {
      make("p", "Audio queue empty hai.", box);
      return;
    }

    queue.forEach((n, index) => {
      const row = make("div", `Surah ${n}`, box);

      button(row, "Remove", () => {
        queue.splice(index, 1);
        set("AudioQueue", queue);
        renderQueue();
      });
    });
  }

  $("hquP7AddQueue")?.addEventListener("click", () => {
    const n = Number($("hquP7QueueSurah")?.value);

    if (!Number.isInteger(n) || n < 1 || n > 114) {
      message("hquP7AudioQueue", "Valid Surah number enter karein.");
      return;
    }

    queue.push(n);
    set("AudioQueue", queue);
    renderQueue();
  });

  $("hquP7ShowQueue")?.addEventListener("click", renderQueue);

  /* 8. CUSTOM PLAYLISTS */

  let playlists = get("Playlists", []);

  function renderPlaylists() {
    const box = clear("hquP7PlaylistList");
    const select = $("hquP7ManagePlaylist");

    if (select) {
      select.replaceChildren();
      make("option", "Select Playlist", select).value = "";
    }

    playlists.forEach((p, index) => {
      const option = make("option", p.name, select);
      if (select) option.value = index;

      if (box) {
        const row = make("div", `${p.name} (${p.surahs.length} Surahs)`, box);

        button(row, "Add Current Surah", () => {
          if (!currentAyah) {
            alert("Pehle Quran reader mein Ayah open karein.");
            return;
          }

          if (!p.surahs.includes(currentAyah.surahNumber)) {
            p.surahs.push(currentAyah.surahNumber);
            set("Playlists", playlists);
            renderPlaylists();
          }
        });
      }
    });
  }

  $("hquP7CreatePlaylist")?.addEventListener("click", () => {
    const name = $("hquP7PlaylistName")?.value.trim();

    if (!name) {
      alert("Playlist name enter karein.");
      return;
    }

    playlists.push({ name, surahs: [] });
    set("Playlists", playlists);

    $("hquP7PlaylistName").value = "";
    renderPlaylists();
  });

  /* 9. PLAYLIST RENAME & DELETE */

  $("hquP7RenameButton")?.addEventListener("click", () => {
    const index = Number($("hquP7ManagePlaylist")?.value);
    const name = $("hquP7RenamePlaylist")?.value.trim();

    if (!name || !playlists[index]) {
      message("hquP7PlaylistManageInfo", "Playlist aur new name select karein.");
      return;
    }

    playlists[index].name = name;
    set("Playlists", playlists);
    renderPlaylists();

    message("hquP7PlaylistManageInfo", "Playlist renamed.");
  });

  $("hquP7DeletePlaylist")?.addEventListener("click", () => {
    const index = Number($("hquP7ManagePlaylist")?.value);

    if (!playlists[index]) {
      message("hquP7PlaylistManageInfo", "Playlist select karein.");
      return;
    }

    playlists.splice(index, 1);
    set("Playlists", playlists);
    renderPlaylists();

    message("hquP7PlaylistManageInfo", "Playlist deleted.");
  });

  /* 10. AUDIO PLAYBACK HISTORY */

  let audioHistory = get("AudioHistory", []);

  function renderAudioHistory() {
    const box = clear("hquP7AudioHistory");
    if (!box) return;

    if (!audioHistory.length) {
      make("p", "Audio history empty hai.", box);
      return;
    }

    audioHistory.slice(0, 40).forEach(item => {
      make(
        "p",
        `Surah ${item.surahNumber} — ${item.reciter || "Qari"}`,
        box
      );
    });
  }

  $("hquP7ShowAudioHistory")?.addEventListener("click", renderAudioHistory);

  document.addEventListener("hqu:audio-played", event => {
    const d = event.detail || {};
    if (!d.surahNumber) return;

    audioHistory.unshift({
      surahNumber: Number(d.surahNumber),
      reciter: d.reciter || "",
      date: new Date().toISOString()
    });

    audioHistory = audioHistory.slice(0, 100);
    set("AudioHistory", audioHistory);
  });

  /* 11. TRANSLATION LIBRARY */

  $("hquP7SelectTranslation")?.addEventListener("click", () => {
    const language = $("hquP7Translation")?.value;

    if (!language) {
      message("hquP7TranslationInfo", "Language select karein.");
      return;
    }

    set("SelectedTranslation", language);

    message(
      "hquP7TranslationInfo",
      `${language} translation preference saved. Verified translation data required.`
    );

    document.dispatchEvent(
      new CustomEvent("hqu:translation-selected", {
        detail: { language }
      })
    );
  });

  /* 12. TRANSLATION LANGUAGE FILTER */

  $("hquP7FilterLanguages")?.addEventListener("click", () => {
    const language = $("hquP7LanguageFilter")?.value;
    const box = clear("hquP7LanguageResults");
    if (!box) return;

    const items = content.translations.filter(item =>
      language === "all" || item.language === language
    );

    if (!items.length) {
      make("p", "Is language ka verified translation dataset connected nahi.", box);
      return;
    }

    items.forEach(item => {
      make("p", `${item.language}: ${item.name || "Translation"}`, box);
    });
  });

  /* 13. TRANSLATION COMPARISON */

  $("hquP7CompareButton")?.addEventListener("click", () => {
    const one = $("hquP7CompareOne")?.value;
    const two = $("hquP7CompareTwo")?.value;
    const box = clear("hquP7ComparisonResults");

    if (!box) return;

    if (!currentAyah) {
      make("p", "Pehle Quran reader mein Ayah select karein.", box);
      return;
    }

    const translations = Array.isArray(currentAyah.translations)
      ? currentAyah.translations
      : [];

    const first = translations.find(x => x.language === one);
    const second = translations.find(x => x.language === two);

    make("h4", one.toUpperCase(), box);
    make("p", first?.text || "Is language ka translation load nahi.", box);

    make("h4", two.toUpperCase(), box);
    make("p", second?.text || "Is language ka translation load nahi.", box);
  });

  /* 14. TRANSLATION FAVORITES */

  let translationFavorites = get("TranslationFavorites", []);

  function renderTranslationFavorites() {
    const box = clear("hquP7TranslationFavorites");
    if (!box) return;

    translationFavorites.forEach(item => {
      make("p", item.text, box);
    });

    if (!translationFavorites.length) {
      make("p", "No saved translations.", box);
    }
  }

  $("hquP7SaveTranslationFavorite")?.addEventListener("click", () => {
    if (!currentAyah || !currentAyah.translation) {
      message("hquP7TranslationFavorites", "Current translation available nahi.");
      return;
    }

    translationFavorites.unshift({
      surahNumber: currentAyah.surahNumber,
      ayahNumber: currentAyah.ayahNumber,
      text: currentAyah.translation
    });

    set("TranslationFavorites", translationFavorites);
    renderTranslationFavorites();
  });

  $("hquP7ShowTranslationFavorites")?.addEventListener(
    "click",
    renderTranslationFavorites
  );

  /* 15. TRANSLATION DOWNLOAD STATUS */

  $("hquP7CheckTranslationData")?.addEventListener("click", () => {
    const box = clear("hquP7TranslationStatus");
    if (!box) return;

    make(
      "p",
      `${content.translations.length} translation datasets connected.`,
      box
    );

    if (!content.translations.length) {
      make("p", "No translation dataset connected yet.", box);
    }
  });

  /* 16. TAFSIR BOOK LIBRARY */

  $("hquP7SelectTafsir")?.addEventListener("click", () => {
    const book = $("hquP7TafsirBook")?.value;

    if (!book) {
      message("hquP7TafsirInfo", "Tafsir book select karein.");
      return;
    }

    set("SelectedTafsir", book);

    const available = content.tafsir.some(x => x.book === book);

    message(
      "hquP7TafsirInfo",
      available
        ? "Selected Tafsir dataset available."
        : "Book preference saved. Verified Tafsir text dataset required."
    );
  });

  /* 17. TAFSIR SEARCH */

  $("hquP7SearchTafsir")?.addEventListener("click", () => {
    const q = $("hquP7TafsirSearch")?.value.trim().toLowerCase();
    const box = clear("hquP7TafsirResults");
    if (!box) return;

    if (!q) {
      make("p", "Search word enter karein.", box);
      return;
    }

    const results = content.tafsir.filter(item =>
      String(item.text || "").toLowerCase().includes(q)
    );

    if (!results.length) {
      make("p", "No result. Verified Tafsir data connect karein.", box);
      return;
    }

    results.forEach(item => {
      make("p", item.text, box);
    });
  });

  /* 18. TAFSIR FAVORITES */

  let tafsirFavorites = get("TafsirFavorites", []);

  $("hquP7SaveTafsir")?.addEventListener("click", () => {
    const q = $("hquP7TafsirSearch")?.value.trim();

    if (!q) {
      message("hquP7TafsirFavorites", "Pehle Tafsir search karein.");
      return;
    }

    const item = content.tafsir.find(x =>
      String(x.text || "").toLowerCase().includes(q.toLowerCase())
    );

    if (!item) {
      message("hquP7TafsirFavorites", "Verified Tafsir result nahi mila.");
      return;
    }

    tafsirFavorites.unshift(item);
    set("TafsirFavorites", tafsirFavorites);

    renderTafsirFavorites();
  });

  function renderTafsirFavorites() {
    const box = clear("hquP7TafsirFavorites");
    if (!box) return;

    tafsirFavorites.forEach(item => make("p", item.text, box));

    if (!tafsirFavorites.length) {
      make("p", "No Tafsir favorites.", box);
    }
  }

  $("hquP7ShowTafsirFavorites")?.addEventListener(
    "click",
    renderTafsirFavorites
  );

  /* 19. TAFSIR FONT SETTINGS */

  $("hquP7ApplyTafsirFont")?.addEventListener("click", () => {
    const size = Number($("hquP7TafsirFontSize")?.value || 18);

    const output = $("hquP7TafsirFontValue");
    if (output) output.textContent = size + "px";

    document.querySelectorAll(
      "#hquP7TafsirInfo, #hquP7TafsirResults, #hquP7TafsirFavorites"
    ).forEach(el => el.style.fontSize = size + "px");

    set("TafsirFontSize", size);
  });

  /* 20. TAFSIR READING HISTORY */

  let tafsirHistory = get("TafsirHistory", []);

  function renderTafsirHistory() {
    const box = clear("hquP7TafsirHistory");
    if (!box) return;

    tafsirHistory.forEach(item => make("p", item.text, box));

    if (!tafsirHistory.length) make("p", "No Tafsir history.", box);
  }

  $("hquP7ShowTafsirHistory")?.addEventListener(
    "click",
    renderTafsirHistory
  );

  document.addEventListener("hqu:tafsir-opened", event => {
    const d = event.detail || {};
    if (!d.text) return;

    tafsirHistory.unshift({ text: d.text });
    tafsirHistory = tafsirHistory.slice(0, 50);
    set("TafsirHistory", tafsirHistory);
  });

  /* 21. MEMORIZATION REVISION PLANNER */

  let revisions = get("Revisions", []);

  function renderRevisions() {
    const box = clear("hquP7RevisionList");
    if (!box) return;

    revisions.forEach((item, index) => {
      const row = make(
        "div",
        `Surah ${item.surah} — Ayah ${item.ayah}`,
        box
      );

      button(row, "Remove", () => {
        revisions.splice(index, 1);
        set("Revisions", revisions);
        renderRevisions();
      });
    });

    if (!revisions.length) make("p", "No revision tasks.", box);
  }

  $("hquP7AddRevision")?.addEventListener("click", () => {
    const surah = Number($("hquP7RevisionSurah")?.value);
    const ayah = Number($("hquP7RevisionAyah")?.value);

    if (
      !Number.isInteger(surah) || surah < 1 || surah > 114 ||
      !Number.isInteger(ayah) || ayah < 1
    ) {
      message("hquP7RevisionList", "Valid Surah aur Ayah enter karein.");
      return;
    }

    revisions.push({ surah, ayah, done: false });
    set("Revisions", revisions);
    renderRevisions();
  });

  /* 22. REVISION SCHEDULE */

  let schedule = get("RevisionSchedule", []);

  function renderSchedule() {
    const box = clear("hquP7RevisionSchedule");
    if (!box) return;

    schedule.forEach(item => make("p", item.date, box));

    if (!schedule.length) make("p", "No revision schedule.", box);
  }

  $("hquP7SaveRevisionDate")?.addEventListener("click", () => {
    const date = $("hquP7RevisionDate")?.value;

    if (!date) {
      message("hquP7RevisionSchedule", "Date select karein.");
      return;
    }

    if (!schedule.some(x => x.date === date)) {
      schedule.push({ date });
    }

    set("RevisionSchedule", schedule);
    renderSchedule();
  });

  /* 23. MEMORIZATION CHECKLIST */

  let memoryTasks = get("MemoryTasks", []);

  function renderMemoryTasks() {
    const box = clear("hquP7MemoryChecklist");
    if (!box) return;

    memoryTasks.forEach((task, index) => {
      const label = make("label", "", box);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;

      const span = make("span", task.title, label);
      label.insertBefore(checkbox, span);

      checkbox.addEventListener("change", () => {
        memoryTasks[index].done = checkbox.checked;
        set("MemoryTasks", memoryTasks);
      });
    });
  }

  $("hquP7AddMemoryTask")?.addEventListener("click", () => {
    const title = $("hquP7MemoryTask")?.value.trim();

    if (!title) return;

    memoryTasks.push({ title, done: false });
    set("MemoryTasks", memoryTasks);

    $("hquP7MemoryTask").value = "";
    renderMemoryTasks();
  });

  /* 24. MEMORIZATION REMINDER SETTINGS */

  $("hquP7SaveReminder")?.addEventListener("click", () => {
    const time = $("hquP7ReminderTime")?.value;

    if (!time) {
      message("hquP7ReminderInfo", "Reminder time select karein.");
      return;
    }

    set("ReminderTime", time);

    message(
      "hquP7ReminderInfo",
      `Reminder preference saved: ${time}. Browser notification scheduling is not enabled.`
    );
  });

  /* 25. MEMORIZATION TEST HISTORY */

  let testHistory = get("TestHistory", []);

  function renderTestHistory() {
    const box = clear("hquP7TestHistory");
    if (!box) return;

    testHistory.forEach(item => {
      make("p", `${item.score}% — ${item.date}`, box);
    });
  }

  $("hquP7SaveTestScore")?.addEventListener("click", () => {
    const score = Number($("hquP7TestScore")?.value);

    if (!Number.isInteger(score) || score < 0 || score > 100) {
      message("hquP7TestHistory", "Score 0 se 100 tak enter karein.");
      return;
    }

    testHistory.unshift({
      score,
      date: new Date().toLocaleDateString()
    });

    set("TestHistory", testHistory);
    renderTestHistory();
  });

  /* 26. DAILY READING TARGET */

  $("hquP7SaveDailyGoal")?.addEventListener("click", () => {
    const value = Number($("hquP7DailyGoal")?.value);

    if (!Number.isInteger(value) || value < 1) {
      message("hquP7DailyGoalInfo", "Valid daily target enter karein.");
      return;
    }

    set("DailyGoal", value);
    message("hquP7DailyGoalInfo", `Daily target saved: ${value} Ayahs.`);
  });

  /* 27. WEEKLY READING TARGET */

  $("hquP7SaveWeeklyGoal")?.addEventListener("click", () => {
    const value = Number($("hquP7WeeklyGoal")?.value);

    if (!Number.isInteger(value) || value < 1) {
      message("hquP7WeeklyGoalInfo", "Valid weekly target enter karein.");
      return;
    }

    set("WeeklyGoal", value);
    message("hquP7WeeklyGoalInfo", `Weekly target saved: ${value} Ayahs.`);
  });

  /* 28. MONTHLY READING REPORT */

  $("hquP7GenerateMonthlyReport")?.addEventListener("click", () => {
    const box = clear("hquP7MonthlyReport");
    if (!box) return;

    const currentMonth = new Date().toISOString().slice(0, 7);
    const history = get("ReadingHistory", []);

    const entries = history.filter(item =>
      String(item.date || "").slice(0, 7) === currentMonth
    );

    make("h3", "Monthly Reading Report", box);
    make("p", `Tracked reading entries: ${entries.length}`, box);
    make("p", `Month: ${currentMonth}`, box);

    make(
      "p",
      "Report only includes reading records connected to this app.",
      box
    );
  });

  /* 29. READING CALENDAR */

  $("hquP7ShowCalendar")?.addEventListener("click", () => {
    const box = clear("hquP7Calendar");
    if (!box) return;

    const value = $("hquP7CalendarMonth")?.value;

    if (!value) {
      make("p", "Month select karein.", box);
      return;
    }

    const [year, month] = value.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1).getDay();
    const totalDays = new Date(year, month, 0).getDate();

    const dates = get("ReadingDates", []);

    ["S", "M", "T", "W", "T", "F", "S"].forEach(day => {
      make("span", day, box);
    });

    for (let i = 0; i < firstDay; i++) {
      make("span", "", box);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date =
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const b = button(box, String(day), () => {
        message(
          "hquP7Calendar",
          dates.includes(date)
            ? `${date}: Reading recorded.`
            : `${date}: No reading record.`
        );
      });

      if (dates.includes(date)) {
        b.classList.add("hqu-p7-success");
        b.title = "Reading recorded";
      }
    }
  });

  /* 30. READING GOAL ACHIEVEMENTS */

  $("hquP7ShowAchievements")?.addEventListener("click", () => {
    const box = clear("hquP7Achievements");
    if (!box) return;

    const history = get("ReadingHistory", []);
    const completed = get("hquPackage6Completed", []);

    make("p", `Tracked reading entries: ${history.length}`, box);
    make("p", `Completed Surahs: ${completed.length}`, box);

    if (history.length >= 10) make("p", "Achievement: 10 reading records!", box);
    if (history.length >= 50) make("p", "Achievement: 50 reading records!", box);
    if (completed.length >= 5) make("p", "Achievement: 5 completed Surahs!", box);
  });

  /* 31. PERSONAL DUA COLLECTION */

  let personalDuas = get("PersonalDuas", []);

  function renderDuas(list = personalDuas, target = "hquP7DuaCollection") {
    const box = clear(target);
    if (!box) return;

    list.forEach((dua, index) => {
      const card = make("div", "", box);

      make("h4", dua.title, card);
      make("p", dua.text, card);

      button(card, dua.favorite ? "★ Favorite" : "☆ Favorite", () => {
        const original = personalDuas.indexOf(dua);
        if (original < 0) return;

        personalDuas[original].favorite = !personalDuas[original].favorite;
        set("PersonalDuas", personalDuas);
        renderDuas();
      });

      button(card, "Delete", () => {
        const original = personalDuas.indexOf(dua);
        if (original < 0) return;

        personalDuas.splice(original, 1);
        set("PersonalDuas", personalDuas);
        renderDuas();
      });
    });

    if (!list.length) make("p", "No personal Duas saved.", box);
  }

  $("hquP7SaveDua")?.addEventListener("click", () => {
    const title = $("hquP7DuaTitle")?.value.trim();
    const duaText = $("hquP7DuaText")?.value.trim();

    if (!title || !duaText) {
      alert("Dua title aur text dono enter karein.");
      return;
    }

    personalDuas.unshift({
      title,
      text: duaText,
      category: "general",
      favorite: false
    });

    set("PersonalDuas", personalDuas);

    $("hquP7DuaTitle").value = "";
    $("hquP7DuaText").value = "";

    renderDuas();
  });

  /* 32. DUA CATEGORIES */

  $("hquP7FilterDuas")?.addEventListener("click", () => {
    const category = $("hquP7DuaCategory")?.value;

    const list = personalDuas.filter(item =>
      category === "all" || item.category === category
    );

    renderDuas(list, "hquP7DuaCategoryResults");
  });

  /* 33. DUA SEARCH */

  $("hquP7SearchDuas")?.addEventListener("click", () => {
    const q = $("hquP7DuaSearch")?.value.trim().toLowerCase();

    const list = personalDuas.filter(item =>
      (item.title + " " + item.text).toLowerCase().includes(q)
    );

    renderDuas(list, "hquP7DuaSearchResults");
  });

  /* 34. DUA FAVORITES */

  $("hquP7ShowDuaFavorites")?.addEventListener("click", () => {
    renderDuas(
      personalDuas.filter(item => item.favorite),
      "hquP7DuaFavorites"
    );
  });

  /* 35. DUA NOTES */

  let duaNotes = get("DuaNotes", []);

  function renderDuaNotes() {
    const box = clear("hquP7DuaNotes");
    if (!box) return;

    duaNotes.forEach((note, index) => {
      const row = make("div", note, box);

      button(row, "Delete", () => {
        duaNotes.splice(index, 1);
        set("DuaNotes", duaNotes);
        renderDuaNotes();
      });
    });
  }

  $("hquP7SaveDuaNote")?.addEventListener("click", () => {
    const note = $("hquP7DuaNote")?.value.trim();
    if (!note) return;

    duaNotes.unshift(note);
    set("DuaNotes", duaNotes);

    $("hquP7DuaNote").value = "";
    renderDuaNotes();
  });

  /* 36. PRAYER LEARNING GUIDE */

  const prayerLessons = {
    wudu: "Wudu learning guide: Learn the steps of ablution from a trusted Islamic teacher or verified source.",
    prayer: "Prayer learning guide: Learn the prayer steps with a reliable teacher and authentic references.",
    rakat: "Rakats information: Check the prayer-specific details from a trusted Islamic reference.",
    dua: "Prayer Duas: Connect a verified Dua dataset to display Arabic text and translations."
  };

  $("hquP7OpenPrayerLesson")?.addEventListener("click", () => {
    const key = $("hquP7PrayerLesson")?.value;

    message(
      "hquP7PrayerLessonInfo",
      prayerLessons[key] || "Lesson select karein."
    );
  });

  /* 37. ISLAMIC KNOWLEDGE LIBRARY */

  $("hquP7SearchKnowledge")?.addEventListener("click", () => {
    const q = $("hquP7KnowledgeSearch")?.value.trim().toLowerCase();
    const box = clear("hquP7KnowledgeResults");
    if (!box) return;

    const results = content.knowledge.filter(item =>
      String(item.title || "").toLowerCase().includes(q) ||
      String(item.text || "").toLowerCase().includes(q)
    );

    if (!results.length) {
      make("p", "Verified knowledge library data not connected or no match.", box);
      return;
    }

    results.forEach(item => {
      make("h4", item.title || "Topic", box);
      make("p", item.text || "", box);
    });
  });

  /* 38. QUIZ CATEGORIES */

  $("hquP7SelectQuizCategory")?.addEventListener("click", () => {
    const category = $("hquP7QuizCategory")?.value;
    set("QuizCategory", category);

    message(
      "hquP7QuizCategoryInfo",
      `Selected category: ${category}. Verified quiz questions are required.`
    );
  });

  /* 39. ADVANCED ISLAMIC QUIZ */

  function renderQuizQuestion() {
    const questionBox = clear("hquP7QuizQuestion");
    const optionsBox = clear("hquP7QuizOptions");

    if (!questionBox || !optionsBox) return;

    const item = quizQuestions[quizIndex];

    if (!item) {
      message("hquP7QuizResult", `Quiz finished. Score: ${quizScore}/${quizQuestions.length}`);
      return;
    }

    quizAnswered = false;

    make("h3", `Question ${quizIndex + 1}`, questionBox);
    make("p", item.question, questionBox);

    item.options.forEach((option, index) => {
      button(optionsBox, option, () => {
        if (quizAnswered) return;

        quizAnswered = true;

        const correct = index === Number(item.answer);

        if (correct) quizScore++;

        message(
          "hquP7QuizResult",
          correct ? "Correct answer!" : "Answer recorded. Continue learning."
        );

        optionsBox.querySelectorAll("button").forEach(b => {
          b.disabled = true;
        });
      });
    });
  }

  $("hquP7StartQuiz")?.addEventListener("click", () => {
    const category = $("hquP7QuizCategory")?.value || "quran";

    quizQuestions = content.quiz.filter(item =>
      item.category === category &&
      typeof item.question === "string" &&
      Array.isArray(item.options) &&
      Number.isInteger(Number(item.answer)) &&
      Number(item.answer) >= 0 &&
      Number(item.answer) < item.options.length
    );

    if (!quizQuestions.length) {
      message(
        "hquP7QuizQuestion",
        "Verified quiz questions for this category are not connected."
      );
      return;
    }

    quizIndex = 0;
    quizScore = 0;

    renderQuizQuestion();
    message("hquP7QuizResult", "Quiz started.");
  });

  $("hquP7NextQuestion")?.addEventListener("click", () => {
    if (!quizQuestions.length) return;

    if (!quizAnswered) {
      message("hquP7QuizResult", "Pehle answer select karein.");
      return;
    }

    quizIndex++;

    if (quizIndex >= quizQuestions.length) {
      const result = {
        score: quizScore,
        total: quizQuestions.length,
        date: new Date().toLocaleDateString()
      };

      let results = get("QuizHistory", []);
      results.unshift(result);
      set("QuizHistory", results);

      message(
        "hquP7QuizResult",
        `Quiz complete! Score: ${quizScore}/${quizQuestions.length}`
      );

      quizQuestions = [];
      return;
    }

    renderQuizQuestion();
  });

  /* 40. QUIZ SCORE HISTORY */

  $("hquP7ShowQuizHistory")?.addEventListener("click", () => {
    const box = clear("hquP7QuizHistory");
    if (!box) return;

    const results = get("QuizHistory", []);

    results.forEach(item => {
      make("p", `${item.score}/${item.total} — ${item.date}`, box);
    });

    if (!results.length) make("p", "No quiz history.", box);
  });

  /* 41. QURAN VOCABULARY LIBRARY */

  $("hquP7ShowVocabulary")?.addEventListener("click", () => {
    const box = clear("hquP7VocabularyLibrary");
    if (!box) return;

    content.vocabulary.forEach(item => {
      make("p", `${item.word} — ${item.meaning}`, box);
    });

    if (!content.vocabulary.length) {
      make("p", "Verified Quran vocabulary dataset not connected.", box);
    }
  });

  /* 42. ARABIC VOCABULARY SEARCH */

  $("hquP7SearchVocabulary")?.addEventListener("click", () => {
    const q = $("hquP7VocabularySearch")?.value.trim().toLowerCase();
    const box = clear("hquP7VocabularyResults");
    if (!box) return;

    const results = content.vocabulary.filter(item =>
      String(item.word || "").toLowerCase().includes(q) ||
      String(item.meaning || "").toLowerCase().includes(q)
    );

    if (!results.length) {
      make("p", "No matching verified vocabulary found.", box);
      return;
    }

    results.forEach(item => {
      const row = make("div", `${item.word} — ${item.meaning}`, box);

      button(row, "☆ Favorite", () => {
        let fav = get("VocabularyFavorites", []);

        if (!fav.some(x => x.word === item.word)) {
          fav.push(item);
          set("VocabularyFavorites", fav);
        }

        renderVocabularyFavorites();
      });
    });
  });

  /* 43. VOCABULARY FAVORITES */

  function renderVocabularyFavorites() {
    const box = clear("hquP7VocabularyFavorites");
    if (!box) return;

    const favorites = get("VocabularyFavorites", []);

    favorites.forEach(item => {
      make("p", `${item.word} — ${item.meaning}`, box);
    });

    if (!favorites.length) make("p", "No vocabulary favorites.", box);
  }

  $("hquP7ShowVocabularyFavorites")?.addEventListener(
    "click",
    renderVocabularyFavorites
  );

  /* 44. ARABIC LEARNING NOTES */

  let arabicNotes = get("ArabicNotes", []);

  function renderArabicNotes() {
    const box = clear("hquP7ArabicNotes");
    if (!box) return;

    arabicNotes.forEach((note, index) => {
      const row = make("div", note, box);

      button(row, "Delete", () => {
        arabicNotes.splice(index, 1);
        set("ArabicNotes", arabicNotes);
        renderArabicNotes();
      });
    });
  }

  $("hquP7SaveArabicNote")?.addEventListener("click", () => {
    const note = $("hquP7ArabicNote")?.value.trim();

    if (!note) return;

    arabicNotes.unshift(note);
    set("ArabicNotes", arabicNotes);

    $("hquP7ArabicNote").value = "";
    renderArabicNotes();
  });

  /* 45. ARABIC LEARNING PROGRESS */

  $("hquP7ShowArabicProgress")?.addEventListener("click", () => {
    const box = clear("hquP7ArabicProgress");
    if (!box) return;

    make("p", `Arabic notes saved: ${arabicNotes.length}`, box);
    make(
      "p",
      `Vocabulary favorites: ${get("VocabularyFavorites", []).length}`,
      box
    );
  });

  /* 46. BACKUP & RESTORE CENTER */

  const packageKeys = [
    "Reciter", "AudioQuality", "DownloadedAudio",
    "AudioQueue", "Playlists", "AudioHistory",
    "SelectedTranslation", "TranslationFavorites",
    "SelectedTafsir", "TafsirFavorites", "TafsirHistory",
    "Revisions", "RevisionSchedule", "MemoryTasks",
    "ReminderTime", "TestHistory", "DailyGoal",
    "WeeklyGoal", "PersonalDuas", "DuaNotes",
    "QuizCategory", "QuizHistory", "ArabicNotes",
    "VocabularyFavorites"
  ];

  function createBackupObject() {
    const data = {};

    packageKeys.forEach(key => {
      data[key] = get(key, null);
    });

    return {
      app: "Holy Quran Ultimate",
      package: 7,
      createdAt: new Date().toISOString(),
      data
    };
  }

  function downloadJSON(filename, data) {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  $("hquP7CreateBackup")?.addEventListener("click", () => {
    const backup = createBackupObject();

    message(
      "hquP7BackupInfo",
      "Backup prepared. Download Backup par click karein."
    );

    window.hquP7PendingBackup = backup;
  });

  $("hquP7DownloadBackup")?.addEventListener("click", () => {
    const backup = window.hquP7PendingBackup || createBackupObject();

    downloadJSON("Holy-Quran-Ultimate-Backup.json", backup);

    message("hquP7BackupInfo", "Backup file export requested.");
  });

  $("hquP7RestoreBackup")?.addEventListener("click", async () => {
    const file = $("hquP7BackupFile")?.files?.[0];

    if (!file) {
      message("hquP7BackupInfo", "Backup JSON file select karein.");
      return;
    }

    try {
      const backup = JSON.parse(await file.text());

      if (
        !backup.data ||
        backup.app !== "Holy Quran Ultimate"
      ) {
        throw new Error("Invalid backup file");
      }

      const approved = confirm(
        "Restore Package 7 backup? Existing Package 7 settings may be overwritten."
      );

      if (!approved) return;

      packageKeys.forEach(key => {
        if (Object.prototype.hasOwnProperty.call(backup.data, key)) {
          set(key, backup.data[key]);
        }
      });

      message("hquP7BackupInfo", "Backup restored. Reload app to refresh all sections.");
    } catch {
      message("hquP7BackupInfo", "Backup file invalid ya unreadable hai.");
    }
  });

  /* 47. EXPORT QURAN NOTES */

  $("hquP7ExportNotes")?.addEventListener("click", () => {
    const notes = {
      package2Notes: get("hquPackage2Notes", []),
      package3Notes: get("hquPackage3Notes", []),
      duaNotes: get("DuaNotes", []),
      arabicNotes: get("ArabicNotes", [])
    };

    downloadJSON("Holy-Quran-Personal-Notes.json", notes);

    message("hquP7ExportInfo", "Notes export file prepared.");
  });

  /* 48. IMPORT PERSONAL DATA */

  $("hquP7ImportData")?.addEventListener("click", async () => {
    const file = $("hquP7ImportFile")?.files?.[0];

    if (!file) {
      message("hquP7ImportInfo", "JSON file select karein.");
      return;
    }

    try {
      const data = JSON.parse(await file.text());

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Invalid file");
      }

      const approved = confirm(
        "Import personal data? Supported Package 7 records may be replaced."
      );

      if (!approved) return;

      let imported = 0;

      packageKeys.forEach(key => {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          set(key, data[key]);
          imported++;
        }
      });

      if (data.data && typeof data.data === "object") {
        packageKeys.forEach(key => {
          if (Object.prototype.hasOwnProperty.call(data.data, key)) {
            set(key, data.data[key]);
            imported++;
          }
        });
      }

      message(
        "hquP7ImportInfo",
        `${imported} supported data fields imported. Reload app if needed.`
      );
    } catch {
      message("hquP7ImportInfo", "Invalid JSON file.");
    }
  });

  /* 49. APP STORAGE INFORMATION */

  $("hquP7CheckAppStorage")?.addEventListener("click", async () => {
    const box = $("hquP7AppStorageInfo");
    if (!box) return;

    box.textContent = "Checking...";

    let total = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && (
        key.startsWith("hqu") ||
        key.startsWith(P)
      )) {
        total += (localStorage.getItem(key) || "").length * 2;
      }
    }

    let extra = "";

    try {
      if (navigator.storage?.estimate) {
        const estimate = await navigator.storage.estimate();

        extra =
          ` Browser estimated usage: ${((estimate.usage || 0) / 1048576).toFixed(2)} MB.`;
      }
    } catch {
      extra = " Browser estimate unavailable.";
    }

    box.textContent =
      `App localStorage estimate: ${(total / 1024).toFixed(2)} KB.` +
      extra;
  });

  /* 50. QURAN APP DATA MANAGER */

  $("hquP7ShowDataManager")?.addEventListener("click", () => {
    const box = clear("hquP7DataManager");
    if (!box) return;

    make("h4", "Personal Data Overview", box);

    packageKeys.forEach(key => {
      const value = get(key, null);

      const count = Array.isArray(value)
        ? value.length
        : value === null ? 0 : 1;

      make("p", `${key}: ${count} record(s)`, box);
    });

    make(
      "p",
      "Use Export All Personal Data to create a backup.",
      box
    );
  });

  $("hquP7ExportAllData")?.addEventListener("click", () => {
    downloadJSON(
      "Holy-Quran-Ultimate-All-Personal-Data.json",
      createBackupObject()
    );
  });

  /* =====================================================
     RECEIVE CURRENT AYAH FROM EXISTING QURAN READER
  ===================================================== */

  document.addEventListener("hqu:ayah-selected", event => {
    const d = event.detail || {};

    currentAyah = {
      surahNumber: Number(d.surahNumber),
      ayahNumber: Number(d.ayahNumber),
      translation: d.translation || "",
      translations: Array.isArray(d.translations)
        ? d.translations
        : []
    };

    if (d.translation) {
      const date = new Date().toISOString().slice(0, 10);

      let history = get("ReadingHistory", []);
      history.unshift({
        surahNumber: currentAyah.surahNumber,
        ayahNumber: currentAyah.ayahNumber,
        date
      });

      history = history.slice(0, 500);
      set("ReadingHistory", history);

      let dates = get("ReadingDates", []);

      if (!dates.includes(date)) {
        dates.push(date);
        set("ReadingDates", dates);
      }
    }
  });

  /* =====================================================
     RECEIVE VERIFIED CONTENT DATA
     EVENT: hqu:p7-content
  ===================================================== */

  document.addEventListener("hqu:p7-content", event => {
    const d = event.detail || {};

    [
      "translations",
      "tafsir",
      "duas",
      "knowledge",
      "quiz",
      "vocabulary"
    ].forEach(key => {
      if (Array.isArray(d[key])) {
        content[key] = d[key];
      }
    });

    console.log("Package 7 verified content received.");
  });

  /* =====================================================
     INITIALIZE PACKAGE 7
  ===================================================== */

  function initialize() {
    const savedReciter = get("Reciter", "");

    if (savedReciter && $("hquP7Reciter")) {
      $("hquP7Reciter").value = savedReciter;
    }

    const quality = get("AudioQuality", "");

    if (quality && $("hquP7AudioQuality")) {
      $("hquP7AudioQuality").value = quality;
    }

    const reminder = get("ReminderTime", "");

    if (reminder && $("hquP7ReminderTime")) {
      $("hquP7ReminderTime").value = reminder;
    }

    renderPlaylists();
    renderQueue();
    renderDownloads();
    renderDuas();
    renderRevisions();
    renderSchedule();
    renderMemoryTasks();
    renderDuaNotes();
    renderArabicNotes();
    renderTestHistory();
    renderTafsirHistory();
    renderTranslationFavorites();
    renderTafsirFavorites();
  }

  initialize();

  console.log(
    "Holy Quran Ultimate — Package 7: 50 Features Initialized!"
  );

})();

/* END PACKAGE 7 JAVASCRIPT */

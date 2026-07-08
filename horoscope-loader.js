async function loadHoroscope(sign) {
    try {
        const response = await fetch("./horoscopes.json?v=" + Date.now());
        const data = await response.json();

        const container = document.getElementById("daily-horoscope");

        if (!container) return;

        container.innerHTML = `
            <h2>🔮 Ημερήσια Πρόβλεψη ${sign}</h2>
            <p>${data.signs[sign] || "Η πρόβλεψη δεν είναι διαθέσιμη."}</p>
        `;

    } catch (err) {
        console.error(err);
    }
}
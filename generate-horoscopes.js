const fs = require("fs");

const signs = [
    "Κριός",
    "Ταύρος",
    "Δίδυμοι",
    "Καρκίνος",
    "Λέων",
    "Παρθένος",
    "Ζυγός",
    "Σκορπιός",
    "Τοξότης",
    "Αιγόκερως",
    "Υδροχόος",
    "Ιχθύες"
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generate(sign) {

    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        try {

            console.log(`Προσπάθεια ${attempt}/${maxAttempts} για ${sign}`);

            const response = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        model: "openai/gpt-oss-120b",

                        temperature: 0.4,

                        max_completion_tokens: 1400,

                        messages: [
                            {
                                role: "system",
                                content:
`Γράφεις περιεχόμενο για ελληνική ιστοσελίδα.

Χρησιμοποίησε αποκλειστικά ελληνική γλώσσα.
Το κείμενο πρέπει να αποτελείται από φυσικές ελληνικές προτάσεις.
Μην χρησιμοποιείς αγγλικές λέξεις ή ξένους χαρακτήρες.
Μην γράφεις ονόματα ή τεχνικούς όρους στα αγγλικά.`
                            },

                            {
                                role: "user",
                                content:
`Γράψε μοναδική ημερήσια πρόβλεψη για το ζώδιο ${sign}.

Χρησιμοποίησε μόνο αυτή τη μορφή:

❤️ Έρωτας:
(κείμενο 130-160 λέξεις)

💼 Καριέρα:
(κείμενο 130-160 λέξεις)

🧠 Διάθεση:
(κείμενο 130-160 λέξεις)

⭐ Συμβουλή:
(κείμενο 130-160 λέξεις)

Γράψε μόνο το τελικό κείμενο της πρόβλεψης.
Μην προσθέσεις σχόλια.`
                            }
                        ]
                    })
                }
            );

            const data = await response.json();

            // -----------------------------
            // RATE LIMIT
            // -----------------------------

            if (
                !response.ok &&
                data?.error?.code === "rate_limit_exceeded"
            ) {

                const errorMessage =
                    data?.error?.message || "";

                console.log(
                    `Rate limit για ${sign}:`
                );

                console.log(errorMessage);

                const match =
                    errorMessage.match(
                        /try again in ([0-9.]+)s/i
                    );

                let waitSeconds = 10;

                if (match) {
                    waitSeconds =
                        Math.ceil(
                            parseFloat(match[1])
                        ) + 2;
                }

                console.log(
                    `Αναμονή ${waitSeconds} δευτερόλεπτα...`
                );

                await sleep(
                    waitSeconds * 1000
                );

                continue;
            }

            // -----------------------------
            // ΑΛΛΟ API ERROR
            // -----------------------------

            if (!response.ok) {

                console.log(
                    "Groq API error:",
                    JSON.stringify(data, null, 2)
                );

                throw new Error(
                    data?.error?.message ||
                    "Groq API error"
                );
            }

            // -----------------------------
            // ΕΛΕΓΧΟΣ ΑΠΑΝΤΗΣΗΣ
            // -----------------------------

            if (
                !data.choices ||
                !data.choices[0] ||
                !data.choices[0].message ||
                !data.choices[0].message.content
            ) {

                console.log(
                    "Μη έγκυρη απάντηση από το Groq:"
                );

                console.log(
                    JSON.stringify(data, null, 2)
                );

                throw new Error(
                    "Δεν επιστράφηκε έγκυρη απάντηση από το Groq."
                );
            }

            const text =
                data.choices[0].message.content.trim();

            // -----------------------------
            // ΕΛΕΓΧΟΣ ΞΕΝΩΝ ΧΑΡΑΚΤΗΡΩΝ
            // -----------------------------

            const textWithoutEmojis =
                text.replace(
                    /❤️|💼|🧠|⭐/g,
                    ""
                );

            const hasForeign =
                /[A-Za-z\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/
                    .test(textWithoutEmojis);

            if (hasForeign) {

                console.log(
                    `Βρέθηκαν ξένοι χαρακτήρες για ${sign}.`
                );

                if (attempt === maxAttempts) {

                    console.log(
                        `Χρησιμοποιείται η τελευταία απάντηση για ${sign}.`
                    );

                    return text;
                }

                await sleep(3000);

                continue;
            }

            // -----------------------------
            // ΕΠΙΤΥΧΙΑ
            // -----------------------------

            console.log(
                `✓ Ολοκληρώθηκε: ${sign}`
            );

            return text;

        } catch (error) {

            console.log(
                `Σφάλμα στην προσπάθεια ${attempt} για ${sign}:`,
                error.message
            );

            if (attempt === maxAttempts) {
                throw error;
            }

            console.log(
                "Αναμονή 5 δευτερολέπτων πριν την επόμενη προσπάθεια..."
            );

            await sleep(5000);
        }
    }
}


// =============================================
// ΚΥΡΙΟ ΠΡΟΓΡΑΜΜΑ
// =============================================

(async () => {

    try {

        const result = {
            date: new Date().toISOString(),
            signs: {}
        };

        // -----------------------------------------
        // Δημιουργία προβλέψεων για όλα τα ζώδια
        // -----------------------------------------

        for (const sign of signs) {

            console.log("");
            console.log("==============================");
            console.log(`Generating: ${sign}`);
            console.log("==============================");

            result.signs[sign] =
                await generate(sign);

            // Μικρή καθυστέρηση ανάμεσα στα ζώδια
            console.log(
                "Αναμονή 5 δευτερολέπτων πριν το επόμενο ζώδιο..."
            );

            await sleep(5000);
        }

        // -----------------------------------------
        // Αποθήκευση horoscopes.json
        // -----------------------------------------

        fs.writeFileSync(
            "horoscopes.json",
            JSON.stringify(
                result,
                null,
                2
            ),
            "utf8"
        );

        console.log(
            "✓ Horoscopes file written successfully."
        );

        // -----------------------------------------
        // Ενημέρωση sitemap.xml
        // -----------------------------------------

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        let sitemap =
            fs.readFileSync(
                "sitemap.xml",
                "utf8"
            );

        const pages = [
            "krios-imerisia.html",
            "tauros-imerisia.html",
            "didymoi-imerisia.html",
            "karkinos-imerisia.html",
            "leon-imerisia.html",
            "parthenos-imerisia.html",
            "zigos-imerisia.html",
            "skorpios-imerisia.html",
            "toxotis-imerisia.html",
            "aigokeros-imerisia.html",
            "idroxoos-imerisia.html",
            "ixthies-imerisia.html"
        ];

        for (const page of pages) {

            const regex = new RegExp(
                `<loc>https://zodiacapp.site/${page}</loc>(\\s*<lastmod>.*?<\\/lastmod>)?`,
                "g"
            );

            sitemap = sitemap.replace(
                regex,
                `<loc>https://zodiacapp.site/${page}</loc>\n    <lastmod>${today}</lastmod>`
            );
        }

        fs.writeFileSync(
            "sitemap.xml",
            sitemap,
            "utf8"
        );

        console.log(
            "✓ Sitemap updated."
        );

        console.log(
            "✓ File written successfully."
        );

    } catch (error) {

        console.error("");
        console.error(
            "================================"
        );
        console.error(
            "ΤΟ SCRIPT ΑΠΕΤΥΧΕ"
        );
        console.error(
            "================================"
        );
        console.error(error);

        process.exit(1);
    }

})();
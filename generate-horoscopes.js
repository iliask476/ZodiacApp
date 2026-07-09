const fs = require('fs');

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

async function generate(sign) {

    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                Authorization:
                    `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                temperature: 0.9,
                messages: [
                    {
                        role: "system",
                        content:
                            "Είσαι επαγγελματίας αστρολόγος."
                    },
                    {
                        role: "user",
                        content:
`Γράψε μοναδική ημερήσια πρόβλεψη για το ζώδιο ${sign}.

Περιέλαβε:
❤️ Έρωτας
💼 Καριέρα
🧠 Διάθεση
⭐ Συμβουλή

Γράψε στα ελληνικά.
Γράψε αποκλειστικά στα ελληνικά.
Μην χρησιμοποιήσεις καμία ξένη λέξη.
Μην βάζεις χαιρετισμούς ή εισαγωγές.`
                    }
                ]
            })
        });

    const data = await response.json();

    return data.choices[0].message.content;
}

(async () => {

    const result = {
        date: new Date().toISOString(),
        signs: {}
    };

    for (const sign of signs) {
        console.log("Generating:", sign);
        result.signs[sign] = await generate(sign);
    }

    console.log(JSON.stringify(result, null, 2));

    fs.writeFileSync(
        "horoscopes.json",
        JSON.stringify(result, null, 2)
    );

    console.log("File written successfully");
})();
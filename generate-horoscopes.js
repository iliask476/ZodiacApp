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

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        try {

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
                        temperature: 0.7,
                        messages: [
                            {
                                role: "system",
                                content:
`Είσαι επαγγελματίας Έλληνας αστρολόγος.

Γράφεις αποκλειστικά στα ελληνικά.
Χρησιμοποιείς μόνο ελληνικούς χαρακτήρες.
Απαγορεύονται όλες οι ξένες λέξεις και οι λατινικοί χαρακτήρες.
Μην χρησιμοποιείς αγγλικά, κινέζικα, ιαπωνικά ή άλλες ξένες γλώσσες.
Το κείμενο πρέπει να μοιάζει με ελληνική αστρολογική πρόβλεψη.`
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

Μην γράψεις εισαγωγή, χαιρετισμό ή επίλογο.
Μην χρησιμοποιήσεις καμία ξένη λέξη ή χαρακτήρα.
Γράψε μόνο στα ελληνικά.`
                            }
                        ]
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                throw new Error("Groq API error");
            }


            const text = data.choices[0].message.content;


            // Έλεγχος για αγγλικά, κινέζικα, ιαπωνικά, κορεάτικα
            const hasForeign =
                /[A-Za-z\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(text);


            if (hasForeign) {
                console.log(
                    `Προσπάθεια ${attempt}: Βρέθηκαν ξένοι χαρακτήρες για ${sign}`
                );

                if (attempt === maxAttempts) {
                    throw new Error(
                        `Δεν δημιουργήθηκε καθαρό ελληνικό κείμενο για ${sign}`
                    );
                }

                continue;
            }


            return text;


        } catch (error) {

            console.log(
                `Σφάλμα στην προσπάθεια ${attempt} για ${sign}:`,
                error.message
            );

            if (attempt === maxAttempts) {
                throw error;
            }
        }
    }
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
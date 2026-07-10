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
                        temperature: 0.4,
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

            if (!response.ok) {
                console.log(data);
                throw new Error("Groq API error");
            }


            const text = data.choices[0].message.content;
            const cleanedText = text.replace(
    /[A-Za-z\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/g,
    ""
);return cleanedText;


            // Έλεγχος για αγγλικά, κινέζικα, ιαπωνικά, κορεάτικα
const hasForeign =
    /[A-Za-z\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(
        text.replace(/❤️|💼|🧠|⭐/g, "")
    );


if (hasForeign) {
    console.log(
        `Προσπάθεια ${attempt}: Βρέθηκαν ξένοι χαρακτήρες για ${sign}`
    );

    if (attempt === maxAttempts) {
        console.log(
            `Χρησιμοποιείται η τελευταία απάντηση για ${sign}`
        );

        return text;
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
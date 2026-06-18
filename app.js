document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form");
    const resultsDiv = document.getElementById("results");
  
    // ✅ ΠΡΑΓΜΑΤΙΚΑ ΖΩΔΙΑ ΠΟΥ ΤΑΙΡΙΑΖΟΥΝ
    const zodiacCompatibility = {
      Κριός: ["Λέων", "Τοξότης", "Δίδυμοι", "Υδροχόος"],
      Ταύρος: ["Παρθένος", "Αιγόκερως", "Καρκίνος", "Ιχθύες"],
      Δίδυμοι: ["Ζυγός", "Υδροχόος", "Κριός", "Λέων"],
      Καρκίνος: ["Σκορπιός", "Ιχθύες", "Ταύρος", "Παρθένος"],
      Λέων: ["Κριός", "Τοξότης", "Δίδυμοι", "Ζυγός"],
      Παρθένος: ["Ταύρος", "Αιγόκερως", "Καρκίνος", "Σκορπιός"],
      Ζυγός: ["Δίδυμοι", "Υδροχόος", "Λέων", "Τοξότης"],
      Σκορπιός: ["Καρκίνος", "Ιχθύες", "Παρθένος", "Αιγόκερως"],
      Τοξότης: ["Κριός", "Λέων", "Ζυγός", "Υδροχόος"],
      Αιγόκερως: ["Ταύρος", "Παρθένος", "Σκορπιός", "Ιχθύες"],
      Υδροχόος: ["Δίδυμοι", "Ζυγός", "Κριός", "Τοξότης"],
      Ιχθύες: ["Καρκίνος", "Σκορπιός", "Ταύρος", "Αιγόκερως"]
    };
  
    // Age compatibility
    function getAgeGroup(age) {
      if (age < 18) return "teen";
      if (age < 30) return "young";
      if (age < 45) return "adult";
      return "mature";
    }
  
    const ageMatches = {
      teen: ["teen", "young"],
      young: ["young", "adult"],
      adult: ["young", "adult", "mature"],
      mature: ["adult", "mature"]
    };



const validZodiacs = [
  "Κριός","Ταύρος","Δίδυμοι","Καρκίνος","Λέων","Παρθένος",
  "Ζυγός","Σκορπιός","Τοξότης","Αιγόκερως","Υδροχόος","Ιχθύες"
];


  
    // SUBMIT
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const zodiacInput = document.getElementById("zodiac").value.trim();
  const ascendantInput = document.getElementById("ascendant").value.trim();

  // ❌ AGE CHECK
  if (!age || age < 18) {
    alert("Η ηλικία πρέπει να είναι 18+");
    return;
  }

  // ❌ EMPTY FIELDS CHECK
  if (!zodiacInput || !ascendantInput) {
    alert("Πρέπει να συμπληρώσεις ζώδιο και ωροσκόπο");
    return;
  }

  const zodiac = capitalize(zodiacInput);
  const ascendant = capitalize(ascendantInput);

  // ❌ VALID ZODIAC CHECK
  if (!validZodiacs.includes(zodiac)) {
    alert("Μη έγκυρο ζώδιο");
    return;
  }

  if (!validZodiacs.includes(ascendant)) {
    alert("Μη έγκυρος ωροσκόπος");
    return;
  }

  const user = {
    age,
    gender: document.getElementById("gender").value,
    preference: document.getElementById("preference").value,
    zodiac,
    ascendant
  };

  const result = calculateMatch(user);
  showResult(result);
});
  
    // CLEAR BUTTON
    clearBtn.addEventListener("click", () => {
      form.reset();
      resultsDiv.innerHTML = "";
    });
  
    // 🔥 MAIN LOGIC
function calculateMatch(user) {

  const zodiacMatches = zodiacCompatibility[user.zodiac] || [];

  const userAgeGroup = getAgeGroup(user.age);
  const compatibleAgeGroups = ageMatches[userAgeGroup] || [];

  // Μέγιστο:
  // 4 συμβατά ζώδια
  // 2 συμβατές ηλικιακές ομάδες
  // 1 ωροσκόπος
  const maxScore = 7;

  const currentScore =
    zodiacMatches.length +
    compatibleAgeGroups.length +
    (user.ascendant ? 1 : 0);

  const score = Math.round((currentScore / maxScore) * 100);

  return {
    zodiacMatches,
    ascendantInfluence: user.ascendant || "Δεν δόθηκε",
    ageMatches: compatibleAgeGroups,
    score
  };
}
  
    // DISPLAY
function showResult(result) {

  resultsDiv.innerHTML = `
    <div class="result-box">
      <p>💘 Συμβατά ζώδια: ${result.zodiacMatches.join(", ")}</p>
      <p>🌙 Ωροσκόπος: ${result.ascendantInfluence}</p>
      <p>🎂 Κατάλληλες ηλικιακές ομάδες: ${result.ageMatches.join(", ")}</p>
      <p>⭐ Score: ${result.score}%</p>
    </div>
  `;
}
  
    // ✅ FIX: κάνει auto σωστό format (Λέων → Λέων)
    function capitalize(str) {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  
  });
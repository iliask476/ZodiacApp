const filterButtons = document.querySelectorAll(".filter-btn");
const zodiacSections = document.querySelectorAll(".zodiac-section");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedSign = button.dataset.sign;


        // Active button

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");


        // Show / hide sections

        zodiacSections.forEach(section => {

            const sectionSign = section.dataset.zodiac;

            if (
                selectedSign === "all" ||
                selectedSign === sectionSign
            ) {
                section.style.display = "block";
            } else {
                section.style.display = "none";
            }

        });

    });

});
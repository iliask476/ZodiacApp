
let currentFont = 100;
let imagesHidden = false;

/* Άνοιγμα / Κλείσιμο menu */

document.getElementById("accessibility-btn").onclick = function(){

    const menu = document.getElementById("accessibility-menu");

    if(menu.style.display === "flex"){
        menu.style.display = "none";
    }
    else{
        menu.style.display = "flex";
    }
};

/* Μεγέθυνση */

function increaseFont(){

    if(!imagesHidden){
        alert("Πρώτα επιλέξτε αφαίρεση εικόνων.");
        return;
    }

    currentFont += 10;

    document.body.style.fontSize = currentFont + "%";
}

/* Σμίκρυνση */

function decreaseFont(){

    if(!imagesHidden){
        alert("Πρώτα επιλέξτε αφαίρεση εικόνων.");
        return;
    }

    currentFont -= 10;

    if(currentFont < 70){
        currentFont = 70;
    }

    document.body.style.fontSize = currentFont + "%";
}

/* Απόκρυψη εικόνων */

function toggleImages(){

    imagesHidden = !imagesHidden;

    document.querySelectorAll("img").forEach(img => {

        img.style.display =
            imagesHidden ? "none" : "";
    });

    document.getElementById("fontPlus").disabled = !imagesHidden;
    document.getElementById("fontMinus").disabled = !imagesHidden;

    if(!imagesHidden){

        currentFont = 100;
        document.body.style.fontSize = "100%";
    }
}

/* Σκούρα αντίθεση */

function toggleDarkContrast(){

    document.body.classList.remove("light-contrast");

    document.body.classList.toggle("dark-contrast");
}

/* Λευκή αντίθεση */

function toggleLightContrast(){

    document.body.classList.remove("dark-contrast");

    document.body.classList.toggle("light-contrast");
}

/* Επαναφορά */

function resetAccessibility(){

    currentFont = 100;

    document.body.style.fontSize = "100%";

    document.body.classList.remove(
        "dark-contrast",
        "light-contrast"
    );

    imagesHidden = false;

    document.querySelectorAll("img").forEach(img => {

        img.style.display = "";
    });

    document.getElementById("fontPlus").disabled = true;
    document.getElementById("fontMinus").disabled = true;
}

document.addEventListener("DOMContentLoaded", function () {

  const modal = document.getElementById("cookieModal");
  const openBtn = document.getElementById("openModal");
  const closeBtn = document.getElementById("closeModal");

  openBtn.addEventListener("click", function(e){
    e.preventDefault();
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", function(){
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  });

  window.addEventListener("click", function(e){
    if(e.target === modal){
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

});
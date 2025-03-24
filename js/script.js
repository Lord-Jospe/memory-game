const soundBackground = new Audio("assets/sounds/lofi-background.mp3"); // Sonido de fondo
soundBackground.loop = true; // Hace que el sonido se repita en bucle


document.getElementById("play-btn").addEventListener("click", function() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("level-screen").classList.remove("hidden");
 // 🔊 Reproducir sonido después de la interacción del usuario
 soundBackground.play().catch(error => console.log("Error al reproducir el audio:", error));  });
  
  document.getElementById("back-btn").addEventListener("click", function() {
    document.getElementById("level-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
  });
  
  document.querySelector(".facil").addEventListener("click", function() {
    window.location.href = "Niveles/index.html?dificultad=facil";
  });
  
  document.querySelector(".medio").addEventListener("click", function() {
    window.location.href = "Niveles/index.html?dificultad=medio";
  });
  
  document.querySelector(".dificil").addEventListener("click", function() {
    window.location.href = "Niveles/index.html?dificultad=dificil";
  });


  
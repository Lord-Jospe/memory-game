// Cargar sonidos
const flipSound = new Audio("/assets/sounds/pop.mp3");  // Sonido al tocar una carta
const matchSound = new Audio("/assets/sounds/acierto.mp3"); // Sonido al hacer pareja
const winSound = new Audio("/assets/sounds/jua.mp3"); // Sonido al ganar

document.addEventListener("DOMContentLoaded", () => {
    // Puedes cambiar esta variable a "facil", "medio" o "dificil"
    const urlParams = new URLSearchParams(window.location.search);
    let dificultad = urlParams.get('dificultad') || 'medio'; // Valor por defecto: medio
    
    // Seleccionar el video y su fuente
    const videoElement = document.getElementById("background-video");
    const videoSource = document.getElementById("video-source");

    // Asignar el video de fondo según la dificultad
    const videos = {
        facil: "/assets/video/facil.mp4",
        medio: "/assets/video/medio.mp4",
        dificil: "/assets/video/medio.mp4"
    };

    videoSource.src = videos[dificultad];
    videoElement.load(); // Cargar el nuevo video
    
    // Variables del timer
    let segundos = 0;
    let minutos = 0;
    let timer;
    let timerActivo = false; // Para evitar que el timer se reinicie al voltear más cartas


    const tablero = document.getElementById("tablero");
    const movimientosContador = document.getElementById("movimientos");
    const mensaje = document.getElementById("mensaje");
    const restartBtn = document.getElementById("restart");
    const backMenuBtn = document.getElementById("back-menu");

    // Elemento donde mostraremos el tiempo
    const tiempoElemento = document.getElementById("tiempo");

    let movimientos = 0;
    let cartasVolteadas = [];
    let parejasEncontradas = 0;

    // Lista de imágenes base (para "medio" y "facil" es suficiente; en "dificil" se repetirán si es necesario)
    const imagenesBase = [
        "pikachu.png", "meme3.png", "ricardo-milos.Gif", 
        "yaoming.png", "chad.png", "emoji.png", 
        "goku.png", "trollface.png", "jerry.png", 
        "frog.png", "meike.jpg", "superman.jpg", 
        "mike.png", "perry.jpg", "chill.png", 
        "gokuuu.jpg", "kevin.png", "meme2.jpg"
    ];

    // Función para actualizar el tiempo
    function actualizarTiempo() {
        segundos++;
        if (segundos === 60) {
            minutos++;
            segundos = 0;
        }
        // Mostrar en formato MM:SS
        tiempoElemento.textContent = 
            (minutos < 10 ? "0" : "") + minutos + ":" + 
            (segundos < 10 ? "0" : "") + segundos;
    }

    // Función para iniciar el timer
    function iniciarTimer() {
        if (!timerActivo) {  // Solo iniciar una vez
            timerActivo = true;
            timer = setInterval(actualizarTiempo, 1000);
        }
    }

    // Configuramos filas y columnas según la dificultad
    let filas, columnas;
    if (dificultad === "facil") {
        filas = 2;
        columnas = 2;
    } else if (dificultad === "medio") {
        filas = 4;
        columnas = 4;
    } else if (dificultad === "dificil") {
        filas = 6;
        columnas = 6;
    }
    
    // Calculamos el total de celdas y ajustamos a un número par (si es impar, restamos 1)
    let totalCeldas = filas * columnas;
    if (totalCeldas % 2 !== 0) {
        totalCeldas -= 1;
    }
    const numParejas = totalCeldas / 2;
    
    // Preparamos el arreglo de imágenes para formar las parejas.
    // Si el número de parejas requerido es mayor a las imágenes disponibles,
    // se repetirán las imágenes hasta completar la cantidad.
    let imagenes = [];
    if (numParejas <= imagenesBase.length) {
        imagenes = imagenesBase.slice(0, numParejas);
    } else {
        // Se agregan imágenes de forma cíclica hasta tener numParejas
        let i = 0;
        while (imagenes.length < numParejas) {
            imagenes.push(imagenesBase[i % imagenesBase.length]);
            i++;
        }
    }
    
    // Duplicamos las imágenes para formar las parejas y luego mezclamos
    let cartas = [...imagenes, ...imagenes];
    cartas.sort(() => Math.random() - 0.5);

    // Ajustamos la grilla en el CSS dinámicamente según el número de columnas
    tablero.style.gridTemplateColumns = `repeat(${columnas}, 100px)`;
    // Opcional: si deseas ajustar el ancho máximo del tablero, puedes hacerlo aquí
    // tablero.style.maxWidth = `${columns * 100 + (columns - 1) * 10}px`;

    function crearTablero() {
        tablero.innerHTML = "";
        // Solo se agregan tantas cartas como totalCeldas (en caso de que se haya restado 1 para hacerlo par)
        cartas.slice(0, totalCeldas).forEach((imagen) => {
            const carta = document.createElement("div");
            carta.classList.add("carta");
            carta.dataset.valor = imagen;

            // Creación de las caras: dorso y frente
            const dorso = document.createElement("div");
            dorso.classList.add("dorso");

            const frente = document.createElement("div");
            frente.classList.add("frente");
            const img = document.createElement("img");
            img.src = `/assets/imgs/${imagen}`;
            frente.appendChild(img);

            carta.appendChild(dorso);
            carta.appendChild(frente);

            carta.addEventListener("click", voltearCarta);
            tablero.appendChild(carta);
        });
    }

    function voltearCarta() {
        //Iniciar timer con la primera carta volteada
        if (!timerActivo) {
            iniciarTimer();
        }
        
        
        if (cartasVolteadas.length < 2 && !this.classList.contains("volteada")) {
            flipSound.play(); // 🔊 Sonido al voltear una carta
            this.classList.add("volteada");
            cartasVolteadas.push(this);
        }

        if (cartasVolteadas.length === 2) {
            movimientos++;
            movimientosContador.textContent = movimientos;


            setTimeout(verificarPareja, 500);
        }
    }

    function verificarPareja() {
        if (cartasVolteadas[0].dataset.valor === cartasVolteadas[1].dataset.valor) {
            matchSound.play(); // 🔊 Sonido instantáneo
            parejasEncontradas++;
            cartasVolteadas = [];

            // Si se han encontrado todas las parejas, muestra el mensaje de felicitación.
            if (parejasEncontradas === numParejas) {
                winSound.play(); // 🔊 Sonido al ganar
                clearInterval(timer); // Detener el timer

                // Mostrar la alerta con SweetAlert
                Swal.fire({
                    title: "🎉 ¡Felicidades!",
                    text: "Has encontrado todas las parejas",
                    icon: "success"
                });
            }
        } else {
            cartasVolteadas.forEach(carta => {
                carta.classList.remove("volteada");
            });
            cartasVolteadas = [];
        }
    }

    restartBtn.addEventListener("click", () => {
        //Reiniciar timer
        clearInterval(timer); // Detener el timer
        segundos = 0;
        minutos = 0;
        timerActivo = false; // Permitir que se reinicie
        tiempoElemento.textContent = "00:00"; // Reiniciar en pantalla

        movimientos = 0;
        movimientosContador.textContent = 0;
        parejasEncontradas = 0;
        // Vuelve a mezclar las cartas y recrea el tablero
        cartas.sort(() => Math.random() - 0.5);
        mensaje.classList.add("oculto");
        crearTablero();
    });

    // Evento para regresar al menú principal
    backMenuBtn.addEventListener("click", () => {
        window.location.href = "../IndexPrincipal.html";
    });

    crearTablero();
});

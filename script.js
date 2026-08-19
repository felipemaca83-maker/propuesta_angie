const $ = id => document.getElementById(id);
const musica = $('musica');
const TIMING = { transition: 800, p2_delay: 2000, p2_scroll: 500, p3_scroll: 55000, final_scroll: 72000, final_exit_delay: 400 };
// 95 y 74
function createParticles() {

    const containers = ['particle-container', 'welcome-particles', 'prep-particles'];
    const colors = ['#ffffff', '#ffebef', '#e3f2fd', '#fff5f8'];

    containers.forEach(id => {
        const container = $(id);
        if (!container) return;

        for (let i = 0; i < 100; i++) {
            const p = document.createElement('div');
            p.className = 'particle';

            const size = Math.random() * 4 + 1 + 'px';
            p.style.width = p.style.height = size;
            p.style.left = Math.random() * 100 + '%';
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.animationDuration = Math.random() * 5 + 5 + 's';
            p.style.animationDelay = Math.random() * 10 + 's';
            container.appendChild(p);
        }
    });
}


function changeScreen(hideId, showId) {
    const hide = $(hideId), show = $(showId);
    const musicaPrevia = $('musica-previa');
    const musicaPrincipal = $('musica');

    // 1. Activar música previa al primer clic (desde Screen Welcome)
    if (hideId === "screen-welcome") {
        musicaPrevia.play().catch(e => console.log("Audio bloqueado aún"));
    }

    // 2. Detener música previa suavemente al salir de indicaciones
    if (hideId === "screen-prep" && showId === "screen-start") {
        fadeOutAudio(musicaPrevia, 2500); // 2.5 segundos de desvanecimiento
    }

    // 3. Iniciar música principal en la Pantalla 1
    // ... dentro de changeScreen ...
    if (hideId === "screen-start") {
        // SEGURO PARA iOS: Pausamos manualmente la previa por si el fade falló
        $('musica-previa').pause();

        musicaPrincipal.play().catch(() => { });
        // $('main-bg-video').play();
    }

    // Animación de transición de pantallas (lo que ya tenías)
    hide.style.opacity = 0;
    setTimeout(() => {
        hide.style.display = 'none';
        show.style.display = 'flex';
        void show.offsetWidth;
        show.style.opacity = 1;
        if (showId === "screen-main") screenMainLogic.init();
        if (showId === "screen-final") screenFinalLogic.init();
    }, 800); // Usando el tiempo de transición estándar
}

const screenMainLogic = {
    init() {
        setTimeout(() => $('main-bg-image').style.opacity = 1, 100);
        document.querySelectorAll('.foto-marco').forEach((f, i) => setTimeout(() => f.style.opacity = 1, 300 + (i * 2000)));
        setTimeout(() => {
            const cont = $('container-1'), text = $('text-1');
            cont.style.opacity = 1;
            text.style.animation = `scrollUpShort ${TIMING.p2_scroll / 1000 + 5}s linear forwards`;
            setTimeout(() => this.showFixed(), TIMING.p2_scroll);
        }, TIMING.p2_delay);
    },

    showFixed() {
        const cont = $('container-1'), fixed = $('fixed-message'), btn = $('btn-next');
        const bgImage = $('main-bg-image'); // Capturamos la imagen de fondo actual

        cont.style.opacity = 0;

        // 1. Ocultamos la imagen de fondo actual rápido (en medio segundo)
        bgImage.style.transition = "opacity 0.5s ease";
        bgImage.style.opacity = 0;

        setTimeout(() => {
            cont.style.display = 'none';

            // 2. Cambiamos la foto por la de ustedes y la hacemos aparecer suavemente
            bgImage.src = "Pictures/madrehija.jpeg"; // <--- PON AQUÍ EL NOMBRE DE TU NUEVA FOTO
            bgImage.style.transition = "opacity 2s ease";
            bgImage.style.opacity = 1;

            // 3. Mostramos el mensaje fijo
            fixed.style.display = 'block';
            setTimeout(() => fixed.style.opacity = 1, 50);

            // Continuamos con el flujo normal para ocultar el mensaje y mostrar el botón
            setTimeout(() => {
                fixed.style.opacity = 0;
                setTimeout(() => {
                    fixed.style.display = 'none';
                    btn.style.display = 'block';
                    void btn.offsetWidth;
                    btn.style.opacity = 1;
                }, 800);
            }, 5000);
        }, 500);
    }
};

// --- LÓGICA DE CARRUSELES
document.querySelectorAll(".carrusel-seccion").forEach(seccion => {
    const slides = seccion.querySelectorAll(".slide");
    const dotsContainer = seccion.querySelector(".dots");
    let current = 0;

    if (dotsContainer) {
        dotsContainer.innerHTML = "";
        slides.forEach((_, i) => {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            if (i === 0) dot.classList.add("activa");
            dotsContainer.appendChild(dot);
        });
    }

    const actualizarDots = () => {
        const dots = dotsContainer.querySelectorAll(".dot");
        dots.forEach((d, i) => d.classList.toggle("activa", i === current));
    };

    seccion.addEventListener("click", (e) => {
        // Evitar que el clic avance la foto si están tocando un botón
        if (e.target.closest('.btn-generic')) return;

        if (current < slides.length - 1) {
            slides[current].classList.remove("activa");
            current++;
            slides[current].classList.add("activa");

            const numSeccion = seccion.getAttribute('data-seccion');


            // Asegúrate de que haya un texto aquí por cada foto que tengas en el HTML
            const textosPorSeccion = {
                "1": [
                    "Toca la foto para avanzar... ✨",
                    "Nuestra primera foto... Recuerdo cuando me pediste tomarla; en el fondo sentí que ahí empezábamos a enmarcar nuestra historia.",
                    "Tu mano entrelazada con la mía... una sensación que sigue siendo inexplicable. Es como si con cada roce, nuestras almas se conectaran perfectamente.",
                    "Aunque mi intuición me decía que el camino no sería fácil, al perderme en esa hermosa mirada tuya encontré toda la luz y la esperanza que necesitaba.",
                    "El día que me diste la confianza de ir a tu casa... Al verte con tu mamá, comprendí que no solo me entregabas tu corazón, sino también tu familia, un tesoro que valoro con el alma.",
                    "Esperaba con ansias cada fin de semana. A tu lado mi mundo se detenía y encontraba paz... Fuiste, eres y siempre serás mi lugar seguro.",
                    "Guardo cada instante y cada foto en mi memoria como si hubiera sido ayer. Y así, admirándote, me sigo enamorando de ti un poco más cada día. ❤️"

                ],

                "2": [
                    "Nuestra historia continuó... ✨",
                    "Ese primer regalo tuyo... un gesto que me tomó por sorpresa. No sabía cómo reaccionar, solo quería abrazarte fuerte por el simple hecho de haber pensado en mí.",
                    "Y no fue el último. Cada detalle tuyo, cada muestra de cariño, solo lograba que me enamorara de ti más y más.",
                    "Cada sorpresa y cada instante a tu lado se convirtieron en un capítulo invaluable, un testimonio puro de nuestro compromiso y amor.",
                    "Así seguimos llenando el alma de recuerdos: riendo, viajando y caminando siempre de la mano...",
                    "Compartiendo nuestras alegrías, creando emociones nuevas y fortaleciendo esto tan hermoso que nos une.",
                    "Son todas esas pequeñas muestras de amor diario las que me hacen sentir el hombre más afortunado del universo.",
                    "Hasta que un día me dejaste conocer tu mundo real. Un mundo que sentí, que viví y del cual me encariñé profundamente.",
                    "Finalmente, me diste el privilegio más grande de todos: conocer tu núcleo, tu motor y tu vida entera...",
                    "Gracias infinitas por confiar en mí y permitirme compartir con tus hermosas niñas. Soy afortunado de tenerlas en mi vida. ❤️"
                ]
            };

            const textoContenedor = seccion.querySelector(".info-slide-externo span");

            if (textoContenedor && textosPorSeccion[numSeccion] && textosPorSeccion[numSeccion][current]) {
                textoContenedor.style.opacity = 0;
                setTimeout(() => {
                    textoContenedor.textContent = textosPorSeccion[numSeccion][current];
                    textoContenedor.style.opacity = 1;
                }, 300); // 300ms de fundido
            }

            actualizarDots();
        }
    });

    const btn = seccion.querySelector(".siguiente-carrusel");
    if (btn) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const nextElement = seccion.nextElementSibling;
            if (nextElement && nextElement.classList.contains('carrusel-seccion')) {
                seccion.style.display = "none";
                seccion.classList.remove("visible");
                nextElement.classList.add("visible");
                nextElement.style.display = "flex";

                // Reiniciar partículas al cambiar de capítulo (opcional para dar un efecto bonito)
                createParticles();
            }
        });
    }
});
const screenFinalLogic = {
    init() {
        const contD = $('container-despedida');
        const textD = $('text-despedida');

        if (!contD || !textD) return; // Evita errores si no encuentra el ID

        // Forzamos que se muestre como bloque (el CSS lo mantiene invisible con opacity: 0)
        contD.style.display = "flex";

        setTimeout(() => {
            // 1. Aparece el contenedor
            contD.style.opacity = 1;

            // 2. Inicia la animación de subir el texto
            textD.style.animation = `scrollUpLong ${TIMING.final_scroll / 1000}s linear forwards`;

            // 3. Después de que termine de subir, ocultamos el texto y mostramos la dedicatoria
            setTimeout(() => {
                contD.style.opacity = 0;

                setTimeout(() => {
                    contD.style.display = "none";
                    const final = $('final-layout');
                    // Imagen de fondo para el "Te amo, Angie Tatiana"
                    final.style.backgroundImage = "url('Pictures/silvia.jpeg')";
                    final.style.display = "flex";
                    void final.offsetWidth;
                    final.style.opacity = 1;
                }, 1500); // 1.5 segundos de desvanecimiento

            }, TIMING.final_exit_delay);

        }, 1000); // Espera 1 segundo al entrar a la pantalla antes de empezar
    }
};

// function playRegalo() {
//     const videoCont = $('video-final-container'), video = $('video-regalo');
//     $('btn-play').style.display = "none";
//     videoCont.style.display = "block";
//     video.play();
//     video.onended = () => {
//         videoCont.style.opacity = 0;
//         setTimeout(() => { videoCont.style.display = "none"; startDespedida(); }, 1000);
//     };
// }

// function startDespedida() {
//     const contD = $('container-despedida'), textD = $('text-despedida');
//     contD.style.display = "block";

//     setTimeout(() => {
//         contD.style.opacity = 1;
//         // La animación usa final_scroll para la VELOCIDAD
//         textD.style.animation = `scrollUpLong ${TIMING.final_scroll / 1000}s linear forwards`;

//         // El cierre usa final_exit_delay para no dejar la pantalla vacía
//         setTimeout(() => {
//             contD.style.opacity = 0;
//             setTimeout(() => {
//                 contD.style.display = "none";
//                 const final = $('final-layout');
//                 final.style.backgroundImage = "url('Pictures/foto_final_dayana.jpeg')";
//                 final.style.display = "flex";
//                 void final.offsetWidth;
//                 final.style.opacity = 1;
//             }, 1500);
//         }, TIMING.final_exit_delay); // <--- Aquí usamos el nuevo tiempo de salida

//     }, 2000);
// }

function fadeOutAudio(audio, duration) {
    // Intentamos el fade normal
    const startVolume = audio.volume;
    const step = startVolume / (duration / 100);

    const fadeInterval = setInterval(() => {
        // Verificamos si el navegador permite cambiar el volumen
        const prevVolume = audio.volume;
        audio.volume = Math.max(0, audio.volume - step);

        // Si el volumen no cambió (bloqueo de iOS) o llegó a 0
        if (audio.volume === prevVolume || audio.volume <= 0) {
            clearInterval(fadeInterval);
            audio.pause();
            audio.currentTime = 0; // Reinicia la canción
            audio.volume = 1;      // Reset para futuros usos
        }
    }, 100);
}

function fadeInAudio(audio, duration) {
    audio.volume = 0;
    const step = 1 / (duration / 100);
    const interval = setInterval(() => {
        if (audio.volume < 1 - step) {
            audio.volume += step;
        } else {
            audio.volume = 1;
            clearInterval(interval);
        }
    }, 100);
}
// function redigirACancion() {
//     // 1. Bajamos el volumen de la música actual suavemente
//     const musicaPrincipal = $('musica');
//     fadeOutAudio(musicaPrincipal, 1500);

//     // 2. Fundido a negro de la pantalla para una transición limpia
//     document.body.style.transition = "opacity 1.5s ease";
//     document.body.style.opacity = 0;

//     // 3. Redirección después de 1.5 segundos
//     setTimeout(() => {
//         window.location.href = "https://www.youtube.com/watch?v=-MsWR_FGa6U&list=RD-MsWR_FGa6U&start_radio=1";
//     }, 1500);
// }

window.onload = createParticles;
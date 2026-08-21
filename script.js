const $ = id => document.getElementById(id);
const musica = $('musica');
const TIMING = { transition: 800, p2_delay: 2000, p2_scroll: 65000, p3_scroll: 55000, final_scroll: 60000, final_exit_delay: 62000 };

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

    // 1. Activar música previa al primer clic
    if (hideId === "screen-welcome") {
        musicaPrevia.play().catch(e => console.log("Audio bloqueado aún"));
    }

    // 2. Detener música previa suavemente
    if (hideId === "screen-prep" && showId === "screen-start") {
        fadeOutAudio(musicaPrevia, 2500); 
    }

    // 3. Iniciar música principal
    if (hideId === "screen-start") {
        $('musica-previa').pause(); // Seguro anti-fallos
        musicaPrincipal.play().catch(() => { });
    }

    // Animación de transición
    hide.style.opacity = 0;
    setTimeout(() => {
        hide.style.display = 'none';
        show.style.display = 'flex';
        void show.offsetWidth;
        show.style.opacity = 1;
        if (showId === "screen-main") screenMainLogic.init();
        if (showId === "screen-final") screenFinalLogic.init();
    }, 800);
}

const screenMainLogic = {

    init() {
        setTimeout(() => $('main-bg-image').style.opacity = 1, 100);
        document.querySelectorAll('.foto-marco').forEach((f, i) => setTimeout(() => f.style.opacity = 1, 300 + (i * 2000)));
        
        setTimeout(() => {
            const cont = $('container-1'), text = $('text-1');
            cont.style.opacity = 1;
            
            // Asignamos el tiempo de la animación (la velocidad de lectura)
            text.style.animation = `scrollUpShort ${TIMING.p2_scroll / 1000}s linear forwards`;
            
            // NUEVO: Escuchamos exactamente cuándo termina la animación
            text.addEventListener('animationend', () => {
                this.showFixed(); // Continúa automáticamente sin delay
            }, { once: true }); // once: true asegura que solo se ejecute una vez
            
        }, TIMING.p2_delay);
    },

    showFixed() {
        const cont = $('container-1'), fixed = $('fixed-message'), btn = $('btn-next');
        const bgImage = $('main-bg-image');
        const collageVideo = $('collage-video'); 

        cont.style.opacity = 0;

        bgImage.style.transition = "opacity 0.5s ease";
        bgImage.style.opacity = 0;

        setTimeout(() => {
            cont.style.display = 'none';

            collageVideo.style.transition = "opacity 2s ease";
            collageVideo.style.opacity = 1;

            let playPromise = collageVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("El navegador bloqueó el video:", error);
                    setTimeout(() => {
                        fixed.style.display = 'block';
                        setTimeout(() => fixed.style.opacity = 1, 50);
                    }, 2000);
                });
            }

            setTimeout(() => {
                fixed.style.display = 'block';
                setTimeout(() => fixed.style.opacity = 1, 50);
            }, 27000);

            // 4. Cuando el video termine, pasamos al botón de continuar
            collageVideo.onended = () => {
                // Agregamos un cronómetro de 2 segundos extra antes de desaparecer
                setTimeout(() => {
                    fixed.style.opacity = 0;
                    setTimeout(() => {
                        fixed.style.display = 'none';
                        btn.style.display = 'flex'; // <--- CAMBIA 'block' POR 'flex' AQUÍ
                        void btn.offsetWidth;
                        btn.style.opacity = 1;
                    }, 800);
                }, 2000); 
            };
        }, 500);
    }
};

// --- LÓGICA DE CARRUSELES
document.querySelectorAll(".carrusel-seccion").forEach(seccion => {
    const slides = seccion.querySelectorAll(".slide");
    const dotsContainer = seccion.querySelector(".dots");
    let current = 0;

    // Los textos exactos para tus 17 fotos
    const textos = [
        "Toca la foto para avanzar... ✨",
        "Nuestra primera foto... Recuerdo cuando me pediste tomarla; en el fondo sentí que ahí empezábamos a enmarcar nuestra historia.",
        "Tu mano entrelazada con la mía... una sensación que sigue siendo inexplicable. Es como si con cada roce, nuestras almas se conectaran perfectamente.",
        "Aunque mi intuición me decía que el camino no sería fácil, al perderme en esa hermosa mirada tuya encontré toda la luz y la esperanza que necesitaba.",
        "El día que me diste la confianza de ir a tu casa... Al verte con tu mamá, comprendí que no solo me entregabas tu corazón, sino también tu familia, un tesoro que valoro con el alma.",
        "Esperaba con ansias cada fin de semana. A tu lado mi mundo se detenía y encontraba paz... Fuiste, eres y siempre serás mi lugar seguro.",
        "Guardo cada instante y cada foto en mi memoria como si hubiera sido ayer. Y así, admirándote, me sigo enamorando de ti un poco más cada día. ❤️",
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
    ];

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
        // Evita que el click en el botón avance el carrusel
        if (e.target.closest('.btn-generic')) return;

        if (current < slides.length - 1) {
            slides[current].classList.remove("activa");
            current++;
            slides[current].classList.add("activa");

            // Capturamos los elementos que queremos ocultar al final
            const titulo = seccion.querySelector('.glow-title');
            const cajaTexto = seccion.querySelector('.info-slide-externo');
            const textoContenedor = seccion.querySelector(".info-slide-externo span");
            const puntos = seccion.querySelector('.dots');

            // Si llegamos al último slide (el botón)
            if (current === slides.length - 1) {
                if (titulo) titulo.style.display = 'none';
                if (cajaTexto) cajaTexto.style.display = 'none';
                if (puntos) puntos.style.display = 'none';
            } else {
                // Si es una foto normal, cambiamos el texto
                if (textoContenedor && textos[current]) {
                    textoContenedor.style.opacity = 0;
                    setTimeout(() => {
                        textoContenedor.textContent = textos[current];
                        textoContenedor.style.opacity = 1;
                    }, 300); // 300ms de desvanecimiento suave
                }
            }
            actualizarDots();
        }
    });
});

const screenFinalLogic = {
    init() {
        const contD = $('container-despedida');
        const textD = $('text-despedida');

        if (!contD || !textD) return; 

        contD.style.display = "flex";

        setTimeout(() => {
            contD.style.opacity = 1;
            textD.style.animation = `scrollUpLong ${TIMING.final_scroll / 1000}s linear forwards`;

            // NUEVO: Escuchamos cuándo termina de subir el texto de despedida
            textD.addEventListener('animationend', () => {
                contD.style.opacity = 0; // Desvanecemos el contenedor del texto

                setTimeout(() => {
                    contD.style.display = "none";
                    const final = $('final-layout');
                    final.style.backgroundImage = "url('Pictures/silvia.jpeg')";
                    final.style.display = "flex";
                    void final.offsetWidth;
                    final.style.opacity = 1;
                }, 1500); // 1.5 segundos para la transición limpia a la foto final
                
            }, { once: true });

        }, 1000); 
    }
};

function fadeOutAudio(audio, duration) {
    const startVolume = audio.volume;
    const step = startVolume / (duration / 100);

    const fadeInterval = setInterval(() => {
        const prevVolume = audio.volume;
        audio.volume = Math.max(0, audio.volume - step);

        if (audio.volume === prevVolume || audio.volume <= 0) {
            clearInterval(fadeInterval);
            audio.pause();
            audio.currentTime = 0; 
            audio.volume = 1;      
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

function abrirPista() {
    // 1. Mostrar la ventana emergente
    const modal = document.getElementById('modal-pista');
    if (modal) modal.style.display = 'flex';

    // 2. Apagar DE GOLPE toda la música y videos sin importar el celular
    document.querySelectorAll('audio, video').forEach(media => {
        media.pause(); 
    });
}

window.onload = createParticles;
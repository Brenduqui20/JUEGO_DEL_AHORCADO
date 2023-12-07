
    const categorias = ['Profesiones', 'Peliculas', 'Colores'];
    const palabras = {
        'Profesiones': ['DOCTOR', 'INGENIERO', 'COCINERO', 'ABOGADO'],
        'Peliculas': ['MATRIX', 'TITANIC', 'INCEPTION', 'AVATAR', '12 HORAS'],
        'Colores': ['AZUL', 'ROJO', 'VERDE', 'MORADO', 'NEGRO', 'BLANCO']
    };


    let palabraSecreta = '';
    let palabraAdivinada = '';
    let letrasIncorrectas = [];
    let letrasCorrectas = [];
    let intentosMaximos = 5;

    let categoria = 0;
    let juegosPerdidos = 0;
    let juegosGanados = 0;
    let intentos = 0;
    let intentosDisponibles = 5;

    let isReady = false;

    $(document).ready(function () {
        initComponents();
        abrirModalCategoria();
    });


    function initComponents() {
        // Añade este código al final de tu script

        document.addEventListener("keydown", function (event) {
            // Obtén la tecla presionada
            const tecla = event.key.toUpperCase();

            // Verifica si la tecla es alfanumérica
            const esAlfanumerica = /^[A-Z0-9]$/.test(tecla);

            if (esAlfanumerica && isReady) {
                // Llama a la función para manejar la letra
                manejarLetra(tecla);
            }
        });

        $('#itemCategoria').on("click", ev => {
            abrirModalCategoria();
        });


        $('#reiniciar').on("click", ev => {
            abrirModalConfirmacionReinicio();
        });

        $('#btnConfirmarReinicio').on("click", ev => {
            reiniciarJuego();
        });

        categorias.forEach(function (categoria, index) {
            const li = $('<li>', {
                class: 'categoria-item',
                text: categoria
            });

            li.on("click", ev => {
                setCategoria(index);
                cerrarModalCategoria();
            });

            $('#listaCategorias').append(li);
        });
        setCategoria(0);
        setJuegosPerdidos(0);
        setJuegosGanados(0);
        setIntentos(0);
        setIntentosDisponibles(5);
        //generarAbecedario();
    }

    function abrirModalCategoria() {
        $('#modalCategoria').modal('show');
        isReady =   false;
    }

    function abrirModalConfirmacionReinicio() {
        $('#modalConfirmacionReinicio').modal('show');
    }

    function cerrarModalConfirmacionReinicio() {
        $('#modalConfirmacionReinicio').modal('hide');
    }

    function cerrarModalCategoria() {
        $('#modalCategoria').modal('hide');
        isReady =   true;
    }

    function setCategoria(index) {
        categoria = index;
        $('#categoriaSeleccionadaElement').text(categorias[categoria]);
        iniciarJuego();
    }

    function setJuegosPerdidos(number) {
        juegosPerdidos = number;
        $('#juegosPerdidosElement').text(juegosPerdidos);
    }

    function setJuegosGanados(number) {
        juegosGanados = number;
        $('#juegosGanadosElement').text(juegosGanados);
    }

    function setIntentos(number) {
        intentos = number;
        $('#intentosElement').text(intentos);
    }

    function setIntentosDisponibles(number) {
        intentosDisponibles = number;
        $('#intentosDisponiblesElement').text(intentosDisponibles);
    }


    function reiniciarJuego() {
        setJuegosGanados(0);
        setJuegosPerdidos(0);
        setIntentos(0);
        cerrarModalConfirmacionReinicio();
        abrirModalCategoria();

        limpiarCanvas();

    }


    // Función para generar palabras aleatorias en función de la categoría
    function generarPalabraAleatoria() {

        const categoriaSeleccionada = categorias[categoria];
        const palabrasCategoria = palabras[categoriaSeleccionada];
        const palabraAleatoria = palabrasCategoria[Math.floor(Math.random() * palabrasCategoria.length)];

        return palabraAleatoria;
    }

    function iniciarJuego() {

       limpiarCanvas();

        // Generar nueva palabra aleatoria
        palabraSecreta = generarPalabraAleatoria().toUpperCase();

        // Reiniciar variables
        palabraAdivinada = '_'.repeat(palabraSecreta.length);
        letrasIncorrectas = [];
        letrasCorrectas = [];
        intentos = 0;
        setIntentos(intentos);
        setIntentosDisponibles(5);

        // Actualizar la interfaz
        actualizarPalabraSecreta();
        actualizarCanvasAhorcado();
        actualizarAbecedario();
        isReady =   true;
    }

    function actualizarPalabraSecreta() {
        const palabraSecretaDiv = $('#palabraSecreta');
        const palabraMostrada = palabraAdivinada.split('').join(' ');
        palabraSecretaDiv.text(palabraMostrada);
    }



    function actualizarAbecedario() {
        const abecedarioDiv = $('#abecedario');
        abecedarioDiv.empty(); // Limpiar abecedario antes de generar nuevos botones

        const abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < abecedario.length; i++) {
            const letra = abecedario[i];

            const btn = $('<button>', {
                class: 'btn btn-secondary m-1 btn-letra',
                id: `letra_${letra}`,
                text: letra,
                click: function () {
                    manejarLetra(letra);
                }
            });

            abecedarioDiv.append(btn);
        }
    }

    function manejarLetra(letra) {
        // Verificar si la letra está en la palabra secreta

        if ($(`#letra_${letra}`).prop('disable')){
            return;
        }

        if (palabraSecreta.includes(letra)) {
            letrasCorrectas.push(letra);

            // Actualizar la palabra adivinada
            for (let i = 0; i < palabraSecreta.length; i++) {
                if (palabraSecreta[i] === letra) {
                    palabraAdivinada = palabraAdivinada.substring(0, i) + letra + palabraAdivinada.substring(i + 1);
                }
            }
        }
        else {
            letrasIncorrectas.push(letra);
            intentos++;
            intentosDisponibles--;
            setIntentos(intentos);
            setIntentosDisponibles(intentosDisponibles);
            //console.log(intentos);

            // Actualizar el canvas del ahorcado
            actualizarCanvasAhorcado();
        }

        // Bloquear botón y cambiar estilo
        bloquearBoton(letra);

        // Actualizar la interfaz
        actualizarPalabraSecreta();

        // Verificar fin de juego
        verificarFinJuego();
    }

    function bloquearBoton(letra) {
        const botonLetra = $(`#letra_${letra}`);

        // Cambiar estilo según si la letra es correcta o incorrecta
        if (palabraSecreta.includes(letra)) {
            botonLetra.removeClass('btn-secondary').addClass('btn-success');
        } else {
            botonLetra.removeClass('btn-secondary').addClass('btn-danger');
        }

        // Deshabilitar el botón después de cambiar el estilo
        botonLetra.prop('disabled', true);

    }


    function verificarFinJuego() {
        if (palabraAdivinada === palabraSecreta) {
            // El usuario ha adivinado la palabra
            juegosGanados += 1;
            setJuegosGanados(juegosGanados);
            $('.btn-letra').prop('disabled', true);

            $('#modalGanado').modal('show');

        } else if (intentos === intentosMaximos) {
            // El usuario ha perdido
            juegosPerdidos += 1;
            setJuegosPerdidos(juegosPerdidos);
            $('.btn-letra').prop('disabled', true);

            $('#modalPerdidoPS').text(palabraSecreta);
            $('#modalPerdido').modal('show');
            isReady =   false;

        }
    }


    function actualizarCanvasAhorcado() {
        const canvas = document.getElementById('canvasAhorcado');
        const ctx = canvas.getContext('2d');

        // Dibujar el ahorcado según los intentos
        switch (intentos) {
            case 1:
                dibujarPies(ctx);
                break;
            case 2:
                dibujarCuerpo(ctx);
                break;
            case 3:
                dibujarManos(ctx);
                break;
            case 4:
                dibujarCuerda(ctx);
                break;
            case 5:
                dibujarCabeza(ctx);
                break;
            default:
                break;
        }
    }


    function dibujarPies(ctx) {

        const img = new Image();
        img.src = 'assets/img/subject_pies.png';
        img.onload = ev => {
            ctx.drawImage(img, 50, 50);
        };
    }

    function dibujarCuerpo(ctx) {
        const img = new Image();
        img.src = 'assets/img/subject_cuerpo.png';
        img.onload = ev => {
            ctx.drawImage(img, 50, 50);
        };
    
    }

    function dibujarManos(ctx) {
        const img = new Image();
        img.src = 'assets/img/subject_brazos.png';
        img.onload = ev => {
            ctx.drawImage(img, 50, 50);
        };
        
    }
  
    function dibujarCuerda(ctx) {
        ctx.strokeStyle = '#3f3535';
        ctx.moveTo(50,500);
        ctx.lineTo(50, 20);
        ctx.lineTo(250, 20);
        ctx.lineTo(250, 60);

        ctx.lineWidth = 15;
        ctx.stroke();
    }

    function dibujarCabeza(ctx) {
        const img = new Image();
        img.src = 'assets/img/subject_cabeza.png';
        img.onload = ev => {
            ctx.drawImage(img, 50, 50);
        };
      
    }


    function limpiarCanvas() {
        const canvas = document.getElementById('canvasAhorcado');
        const ctx = canvas.getContext('2d');

        // Reiniciar el canvas borrando todo el contenido
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
    }

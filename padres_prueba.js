// ============================================================
// PORTAL DE PADRES CEGRAC
// FRONTEND INDEPENDIENTE DE PRUEBA
// ARCHIVO COMPLETO
// ============================================================

// ============================================================
// SOLO EDITA ESTA CONSTANTE
// Debe contener la URL publicada de Portal_Padres_CEGRAC_API
// y terminar en /exec
// ============================================================
const API_PADRES =
  'https://script.google.com/macros/s/AKfycbzot5BIsffX7iD2eVmjHpwB8Tdm3RTbJ8fY54AOsvDWbpOBCE7cooahxbHplrbX2AiuWA/exec';

// ============================================================
// NO MODIFICAR DESDE AQUÍ
// ============================================================
const CLAVE_TOKEN_PADRES_PRUEBA =
  'CEGRAC_TOKEN_PADRES_PRUEBA';

const CLAVE_UID_RECUPERACION_PADRES_PRUEBA =
  'CEGRAC_UID_RECUPERACION_PADRES_PRUEBA';

const MODULOS_CARGADOS_PADRES_PRUEBA =
  new Set();

let MODULO_ACTUAL_PADRES_PRUEBA =
  'asistencia';


// ============================================================
// UTILIDADES
// ============================================================

function elementoPadresPrueba(id) {

  return document.getElementById(id);
}


function textoPadresPrueba(
  valor,
  reemplazo = '—'
) {

  const texto =
    String(valor ?? '').trim();

  return texto || reemplazo;
}


function numeroPadresPrueba(
  valor,
  reemplazo = 0
) {

  const numero =
    Number(valor);

  return Number.isFinite(numero)
    ? numero
    : reemplazo;
}


function primerValorPadresPrueba(
  objeto,
  claves,
  reemplazo = ''
) {

  if (
    !objeto ||
    typeof objeto !== 'object'
  ) {

    return reemplazo;
  }


  for (
    const clave of claves
  ) {

    const valor =
      objeto[clave];


    if (
      valor !== undefined &&
      valor !== null &&
      String(valor).trim() !== ''
    ) {

      return valor;
    }
  }


  return reemplazo;
}


function primerArregloPadresPrueba(
  objeto,
  claves
) {

  if (
    !objeto ||
    typeof objeto !== 'object'
  ) {

    return [];
  }


  for (
    const clave of claves
  ) {

    if (
      Array.isArray(
        objeto[clave]
      )
    ) {

      return objeto[clave];
    }
  }


  return [];
}


function mostrarMensajeElementoPadresPrueba(
  id,
  mensaje,
  tipo = 'info'
) {

  const elemento =
    elementoPadresPrueba(id);


  if (!elemento) {

    return;
  }


  const texto =
    String(
      mensaje || ''
    ).trim();


  elemento.textContent =
    texto;


  elemento.classList.remove(

    'mensaje-exito-padres-prueba',

    'mensaje-error-padres-prueba',

    'mensaje-info-padres-prueba'
  );


  if (!texto) {

    elemento.hidden =
      true;

    return;
  }


  elemento.hidden =
    false;


  const clase =

    tipo === 'exito'

      ? 'mensaje-exito-padres-prueba'

      : tipo === 'error'

        ? 'mensaje-error-padres-prueba'

        : 'mensaje-info-padres-prueba';


  elemento.classList.add(
    clase
  );
}


function mostrarMensajePadresPrueba(
  mensaje,
  tipo = 'info'
) {

  mostrarMensajeElementoPadresPrueba(

    'mensajePadresPrueba',

    mensaje,

    tipo
  );
}


function mostrarMensajeCambioPasswordPadresPrueba(
  mensaje,
  tipo = 'info'
) {

  mostrarMensajeElementoPadresPrueba(

    'mensajeCambioPasswordPadresPrueba',

    mensaje,

    tipo
  );
}


function mostrarMensajeRecuperacionPadresPrueba(
  id,
  mensaje,
  tipo = 'info'
) {

  mostrarMensajeElementoPadresPrueba(

    id,

    mensaje,

    tipo
  );
}


function mostrarMensajeModuloPadresPrueba(
  id,
  mensaje,
  tipo = 'info'
) {

  mostrarMensajeElementoPadresPrueba(

    id,

    mensaje,

    tipo
  );
}


function cambiarEstadoBotonPadresPrueba(
  boton,
  cargando,
  textoCargando,
  textoNormal
) {

  if (!boton) {

    return;
  }


  boton.disabled =
    Boolean(cargando);


  boton.textContent =

    cargando

      ? textoCargando

      : textoNormal;
}


function formatearFechaPadresPrueba(
  valor
) {

  const texto =
    String(valor ?? '').trim();


  if (!texto) {

    return '—';
  }


  const iso =

    texto.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );


  if (iso) {

    return (
      iso[3] +
      '/' +
      iso[2] +
      '/' +
      iso[1]
    );
  }


  const latina =

    texto.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
    );


  if (latina) {

    return (

      latina[1].padStart(
        2,
        '0'
      ) +

      '/' +

      latina[2].padStart(
        2,
        '0'
      ) +

      '/' +

      latina[3]
    );
  }


  const fecha =
    new Date(texto);


  if (
    !Number.isNaN(
      fecha.getTime()
    )
  ) {

    return new Intl.DateTimeFormat(

      'es-MX',

      {
        day:
          '2-digit',

        month:
          '2-digit',

        year:
          'numeric'
      }

    ).format(fecha);
  }


  return texto;
}


function formatearHoraPadresPrueba(
  valor
) {

  const texto =
    String(valor ?? '').trim();


  if (!texto) {

    return '—';
  }


  const hora =

    texto.match(
      /(\d{1,2}):(\d{2})(?::\d{2})?/
    );


  return hora

    ? (
      hora[1].padStart(
        2,
        '0'
      ) +

      ':' +

      hora[2]
    )

    : texto;
}


function formatearCalificacionPadresPrueba(
  valor
) {

  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ''
  ) {

    return '—';
  }


  const numero =
    Number(valor);


  if (
    !Number.isFinite(numero)
  ) {

    return String(valor);
  }


  return Number.isInteger(numero)

    ? String(numero)

    : numero.toFixed(1);
}


function crearCeldaPadresPrueba(
  valor,
  clase = ''
) {

  const celda =

    document.createElement(
      'td'
    );


  celda.textContent =
    textoPadresPrueba(valor);


  if (clase) {

    celda.classList.add(
      clase
    );
  }


  return celda;
}


function mostrarFilaMensajePadresPrueba(
  idCuerpo,
  columnas,
  mensaje
) {

  const cuerpo =

    elementoPadresPrueba(
      idCuerpo
    );


  if (!cuerpo) {

    return;
  }


  cuerpo.replaceChildren();


  const fila =

    document.createElement(
      'tr'
    );


  const celda =

    document.createElement(
      'td'
    );


  celda.colSpan =
    columnas;


  celda.textContent =
    mensaje;


  celda.classList.add(
    'celda-mensaje-tabla-padres-prueba'
  );


  fila.appendChild(
    celda
  );


  cuerpo.appendChild(
    fila
  );
}


function respuestaSesionInvalidaPadresPrueba(
  datos
) {

  const codigo =

    String(

      datos?.codigo ||

      datos?.error ||

      ''

    ).toUpperCase();


  return (

    datos?.sesionValida ===
      false ||

    codigo ===
      'SESION_INVALIDA' ||

    codigo ===
      'TOKEN_INVALIDO' ||

    codigo ===
      'SESION_EXPIRADA'
  );
}


function finalizarSesionInvalidaPadresPrueba(
  mensaje
) {

  sessionStorage.removeItem(
    CLAVE_TOKEN_PADRES_PRUEBA
  );


  MODULOS_CARGADOS_PADRES_PRUEBA.clear();


  ocultarSesionPadresPrueba();


  mostrarMensajePadresPrueba(

    mensaje ||
    'La sesión terminó. Ingresa nuevamente.',

    'info'
  );
}


// ============================================================
// API
// ============================================================

async function enviarPostPadresPrueba(
  datos
) {

  if (
    !String(
      API_PADRES || ''
    ).trim()
  ) {

    throw new Error(
      'Todavía no se ha colocado la URL de la API.'
    );
  }


  const respuesta =

    await fetch(

      API_PADRES,

      {
        method:
          'POST',

        redirect:
          'follow',

        body:
          JSON.stringify(
            datos
          )
      }
    );


  const texto =

    await respuesta.text();


  let json;


  try {

    json =
      JSON.parse(
        texto
      );

  } catch (error) {

    console.error(

      'Respuesta recibida:',

      texto
    );


    throw new Error(
      'El servidor no devolvió una respuesta JSON válida.'
    );
  }


  if (
    !respuesta.ok
  ) {

    throw new Error(

      json.mensaje ||

      'La solicitud terminó con un error HTTP.'
    );
  }


  return json;
}


// ============================================================
// CONTROL DE PANTALLAS DE ACCESO
// ============================================================

function mostrarEncabezadoPublicoPadresPrueba(
  mostrar
) {

  const encabezado =

    elementoPadresPrueba(
      'encabezadoPublicoPadresPrueba'
    );


  if (encabezado) {

    encabezado.hidden =
      !mostrar;
  }
}


function mostrarBotonRecuperacionPadresPrueba(
  mostrar
) {

  const boton =

    elementoPadresPrueba(
      'btnMostrarRecuperacionPadresPrueba'
    );


  if (boton) {

    boton.hidden =
      !mostrar;
  }
}


function ocultarCambioPasswordInicialPadresPrueba() {

  const panel =

    elementoPadresPrueba(
      'panelCambioPasswordPadresPrueba'
    );


  const nuevo =

    elementoPadresPrueba(
      'nuevoPasswordInicialPadresPrueba'
    );


  const confirmar =

    elementoPadresPrueba(
      'confirmarPasswordInicialPadresPrueba'
    );


  if (panel) {

    panel.hidden =
      true;
  }


  if (nuevo) {

    nuevo.value =
      '';
  }


  if (confirmar) {

    confirmar.value =
      '';
  }


  mostrarMensajeCambioPasswordPadresPrueba(

    '',

    'info'
  );
}


function ocultarPanelesRecuperacionPadresPrueba() {

  const solicitar =

    elementoPadresPrueba(
      'panelSolicitarRecuperacionPadresPrueba'
    );


  const restablecer =

    elementoPadresPrueba(
      'panelRestablecerPasswordPadresPrueba'
    );


  if (solicitar) {

    solicitar.hidden =
      true;
  }


  if (restablecer) {

    restablecer.hidden =
      true;
  }


  [

    'codigoRecuperacionPadresPrueba',

    'nuevoPasswordRecuperacionPadresPrueba',

    'confirmarPasswordRecuperacionPadresPrueba'

  ].forEach(

    function (
      id
    ) {

      const campo =

        elementoPadresPrueba(
          id
        );


      if (campo) {

        campo.value =
          '';
      }
    }
  );


  mostrarMensajeRecuperacionPadresPrueba(

    'mensajeSolicitarRecuperacionPadresPrueba',

    '',

    'info'
  );


  mostrarMensajeRecuperacionPadresPrueba(

    'mensajeRestablecerPasswordPadresPrueba',

    '',

    'info'
  );
}


function mostrarCambioPasswordInicialPadresPrueba(
  datos
) {

  ocultarPanelesRecuperacionPadresPrueba();

  mostrarEncabezadoPublicoPadresPrueba(
    true
  );

  mostrarBotonRecuperacionPadresPrueba(
    false
  );


  const login =

    elementoPadresPrueba(
      'formLoginPadresPrueba'
    );


  const panel =

    elementoPadresPrueba(
      'panelPadresPrueba'
    );


  const cambio =

    elementoPadresPrueba(
      'panelCambioPasswordPadresPrueba'
    );


  const alumno =

    elementoPadresPrueba(
      'alumnoCambioPasswordPadresPrueba'
    );


  if (login) {

    login.hidden =
      true;
  }


  if (panel) {

    panel.hidden =
      true;
  }


  if (cambio) {

    cambio.hidden =
      false;
  }


  if (alumno) {

    alumno.textContent =

      datos?.alumno?.nombre

        ? (
          'Alumno: ' +
          datos.alumno.nombre
        )

        : 'Cuenta del Portal de Padres';
  }


  mostrarMensajeCambioPasswordPadresPrueba(

    'Escribe y confirma una nueva contraseña.',

    'info'
  );
}


function mostrarSolicitudRecuperacionPadresPrueba() {

  ocultarCambioPasswordInicialPadresPrueba();

  ocultarPanelesRecuperacionPadresPrueba();

  mostrarEncabezadoPublicoPadresPrueba(
    true
  );

  mostrarBotonRecuperacionPadresPrueba(
    false
  );


  const login =

    elementoPadresPrueba(
      'formLoginPadresPrueba'
    );


  const panel =

    elementoPadresPrueba(
      'panelPadresPrueba'
    );


  const solicitar =

    elementoPadresPrueba(
      'panelSolicitarRecuperacionPadresPrueba'
    );


  const uidLogin =

    String(

      elementoPadresPrueba(
        'uidPadresPrueba'
      )?.value ||

      ''

    ).trim();


  const uidRecuperacion =

    elementoPadresPrueba(
      'uidRecuperacionPadresPrueba'
    );


  if (login) {

    login.hidden =
      true;
  }


  if (panel) {

    panel.hidden =
      true;
  }


  if (solicitar) {

    solicitar.hidden =
      false;
  }


  if (
    uidRecuperacion &&
    uidLogin
  ) {

    uidRecuperacion.value =
      uidLogin;
  }


  mostrarMensajePadresPrueba(

    '',

    'info'
  );


  mostrarMensajeRecuperacionPadresPrueba(

    'mensajeSolicitarRecuperacionPadresPrueba',

    'Escribe el UID del alumno para solicitar el código.',

    'info'
  );
}


function mostrarRestablecimientoRecuperacionPadresPrueba() {

  ocultarCambioPasswordInicialPadresPrueba();

  mostrarEncabezadoPublicoPadresPrueba(
    true
  );

  mostrarBotonRecuperacionPadresPrueba(
    false
  );


  const login =

    elementoPadresPrueba(
      'formLoginPadresPrueba'
    );


  const panel =

    elementoPadresPrueba(
      'panelPadresPrueba'
    );


  const solicitar =

    elementoPadresPrueba(
      'panelSolicitarRecuperacionPadresPrueba'
    );


  const restablecer =

    elementoPadresPrueba(
      'panelRestablecerPasswordPadresPrueba'
    );


  if (login) {

    login.hidden =
      true;
  }


  if (panel) {

    panel.hidden =
      true;
  }


  if (solicitar) {

    solicitar.hidden =
      true;
  }


  if (restablecer) {

    restablecer.hidden =
      false;
  }
}


// ============================================================
// CAMBIO OBLIGATORIO DE CONTRASEÑA
// ============================================================

async function cambiarPasswordInicialPadresPrueba(
  evento
) {

  evento.preventDefault();


  const token =

    sessionStorage.getItem(
      CLAVE_TOKEN_PADRES_PRUEBA
    );


  const nuevo =

    String(

      elementoPadresPrueba(
        'nuevoPasswordInicialPadresPrueba'
      )?.value ||

      ''

    ).trim();


  const confirmar =

    String(

      elementoPadresPrueba(
        'confirmarPasswordInicialPadresPrueba'
      )?.value ||

      ''

    ).trim();


  const boton =

    elementoPadresPrueba(
      'btnCambiarPasswordInicialPadresPrueba'
    );


  if (!token) {

    finalizarSesionInvalidaPadresPrueba();

    return;
  }


  if (
    !nuevo ||
    !confirmar
  ) {

    mostrarMensajeCambioPasswordPadresPrueba(

      'Escribe y confirma la nueva contraseña.',

      'info'
    );


    return;
  }


  if (
    nuevo.length < 6
  ) {

    mostrarMensajeCambioPasswordPadresPrueba(

      'La contraseña debe tener al menos 6 caracteres.',

      'error'
    );


    return;
  }


  if (
    nuevo !== confirmar
  ) {

    mostrarMensajeCambioPasswordPadresPrueba(

      'Las contraseñas no coinciden.',

      'error'
    );


    return;
  }


  if (
    nuevo.toLowerCase() ===
    'escuela'
  ) {

    mostrarMensajeCambioPasswordPadresPrueba(

      'La nueva contraseña debe ser diferente de la contraseña inicial.',

      'error'
    );


    return;
  }


  cambiarEstadoBotonPadresPrueba(

    boton,

    true,

    'Guardando...',

    'Guardar nueva contraseña'
  );


  mostrarMensajeCambioPasswordPadresPrueba(

    'Actualizando la contraseña...',

    'info'
  );


  try {

    const datos =

      await enviarPostPadresPrueba({

        accion:
          'cambiarPasswordInicialPadre',

        token:
          token,

        passwordNuevo:
          nuevo,

        confirmarPassword:
          confirmar
      });


    if (
      !datos.success
    ) {

      if (
        respuestaSesionInvalidaPadresPrueba(
          datos
        )
      ) {

        finalizarSesionInvalidaPadresPrueba(
          datos.mensaje
        );


        return;
      }


      mostrarMensajeCambioPasswordPadresPrueba(

        datos.mensaje ||

        'No fue posible actualizar la contraseña.',

        'error'
      );


      return;
    }


    if (
      !datos.token
    ) {

      throw new Error(
        'El servidor no devolvió el nuevo token de sesión.'
      );
    }


    sessionStorage.setItem(

      CLAVE_TOKEN_PADRES_PRUEBA,

      datos.token
    );


    mostrarSesionPadresPrueba(
      datos
    );


    mostrarMensajePadresPrueba(

      datos.mensaje ||

      'Contraseña actualizada correctamente.',

      'exito'
    );


  } catch (error) {

    console.error(
      error
    );


    mostrarMensajeCambioPasswordPadresPrueba(

      error.message ||

      'No fue posible actualizar la contraseña.',

      'error'
    );


  } finally {

    cambiarEstadoBotonPadresPrueba(

      boton,

      false,

      'Guardando...',

      'Guardar nueva contraseña'
    );
  }
}


// ============================================================
// SESIÓN
// ============================================================

function mostrarSesionPadresPrueba(
  datos
) {

  ocultarCambioPasswordInicialPadresPrueba();

  ocultarPanelesRecuperacionPadresPrueba();

  mostrarEncabezadoPublicoPadresPrueba(
    false
  );

  mostrarBotonRecuperacionPadresPrueba(
    false
  );


  const login =

    elementoPadresPrueba(
      'formLoginPadresPrueba'
    );


  const panel =

    elementoPadresPrueba(
      'panelPadresPrueba'
    );


  const alumno =
    datos?.alumno || {};


  if (login) {

    login.hidden =
      true;
  }


  if (panel) {

    panel.hidden =
      false;
  }


  const nombre =

    elementoPadresPrueba(
      'nombreAlumnoPadresPrueba'
    );


  const grado =

    elementoPadresPrueba(
      'gradoAlumnoPadresPrueba'
    );


  const grupo =

    elementoPadresPrueba(
      'grupoAlumnoPadresPrueba'
    );


  const estado =

    elementoPadresPrueba(
      'estadoSesionPadresPrueba'
    );


  if (nombre) {

    nombre.textContent =

      textoPadresPrueba(

        alumno.nombre,

        'Alumno'
      );
  }


  if (grado) {

    grado.textContent =

      textoPadresPrueba(

        alumno.grado,

        'Sin grado'
      );
  }


  if (grupo) {

    grupo.textContent =

      textoPadresPrueba(

        alumno.grupo,

        'Sin grupo'
      );
  }


  if (estado) {

    estado.textContent =
      'Sesión segura activa.';
  }


  MODULOS_CARGADOS_PADRES_PRUEBA.clear();


  mostrarModuloPadresPrueba(

    'asistencia',

    true
  );
}


function limpiarPortalPadresPrueba() {

  MODULOS_CARGADOS_PADRES_PRUEBA.clear();


  MODULO_ACTUAL_PADRES_PRUEBA =
    'asistencia';


  limpiarAsistenciaPadresPrueba();


  mostrarFilaMensajePadresPrueba(

    'cuerpoTablaReportesPadresPrueba',

    7,

    'Selecciona esta sección para consultar los reportes.'
  );


  mostrarFilaMensajePadresPrueba(

    'cuerpoTablaJustificantesPadresPrueba',

    4,

    'Selecciona esta sección para consultar los justificantes.'
  );


  mostrarFilaMensajePadresPrueba(

    'cuerpoTablaCitatoriosPadresPrueba',

    5,

    'Selecciona esta sección para consultar los citatorios.'
  );


  mostrarFilaMensajePadresPrueba(

    'cuerpoTablaCalificacionesPadresPrueba',

    6,

    'Selecciona esta sección para consultar las calificaciones.'
  );


  [

    'mensajeReportesPadresPrueba',

    'mensajeJustificantesPadresPrueba',

    'mensajeCitatoriosPadresPrueba',

    'mensajeCalificacionesPadresPrueba'

  ].forEach(

    function (
      id
    ) {

      mostrarMensajeModuloPadresPrueba(

        id,

        '',

        'info'
      );
    }
  );


  limpiarRiesgoPadresPrueba();

  limpiarPerfilPadresPrueba();
}


function ocultarSesionPadresPrueba() {

  ocultarCambioPasswordInicialPadresPrueba();

  ocultarPanelesRecuperacionPadresPrueba();

  limpiarPortalPadresPrueba();

  mostrarEncabezadoPublicoPadresPrueba(
    true
  );

  mostrarBotonRecuperacionPadresPrueba(
    true
  );


  const login =

    elementoPadresPrueba(
      'formLoginPadresPrueba'
    );


  const panel =

    elementoPadresPrueba(
      'panelPadresPrueba'
    );


  const uid =

    elementoPadresPrueba(
      'uidPadresPrueba'
    );


  const password =

    elementoPadresPrueba(
      'passwordPadresPrueba'
    );


  if (login) {

    login.hidden =
      false;
  }


  if (panel) {

    panel.hidden =
      true;
  }


  if (uid) {

    uid.value =
      '';
  }


  if (password) {

    password.value =
      '';
  }
}


async function iniciarSesionPadresPrueba(
  evento
) {

  evento.preventDefault();


  const uid =

    String(

      elementoPadresPrueba(
        'uidPadresPrueba'
      )?.value ||

      ''

    ).trim();


  const password =

    String(

      elementoPadresPrueba(
        'passwordPadresPrueba'
      )?.value ||

      ''
    );


  const boton =

    elementoPadresPrueba(
      'btnIngresarPadresPrueba'
    );


  if (
    !uid ||
    !password
  ) {

    mostrarMensajePadresPrueba(

      'Escribe el UID y la contraseña.',

      'info'
    );


    return;
  }


  cambiarEstadoBotonPadresPrueba(

    boton,

    true,

    'Ingresando...',

    'Ingresar'
  );


  mostrarMensajePadresPrueba(

    'Validando la cuenta...',

    'info'
  );


  try {

    const datos =

      await enviarPostPadresPrueba({

        accion:
          'loginPadres',

        uid:
          uid,

        password:
          password
      });


    if (
      !datos.success ||
      !datos.token
    ) {

      mostrarMensajePadresPrueba(

        datos.mensaje ||

        'No fue posible iniciar sesión.',

        'error'
      );


      return;
    }


    sessionStorage.setItem(

      CLAVE_TOKEN_PADRES_PRUEBA,

      datos.token
    );


    sessionStorage.removeItem(

      CLAVE_UID_RECUPERACION_PADRES_PRUEBA
    );


    const campoPassword =

      elementoPadresPrueba(
        'passwordPadresPrueba'
      );


    if (campoPassword) {

      campoPassword.value =
        '';
    }


    if (
      datos.requiereCambioPassword
    ) {

      mostrarCambioPasswordInicialPadresPrueba(
        datos
      );


      mostrarMensajePadresPrueba(

        'Acceso correcto. Debes cambiar la contraseña inicial.',

        'info'
      );


      return;
    }


    mostrarSesionPadresPrueba(
      datos
    );


    mostrarMensajePadresPrueba(

      'Sesión iniciada correctamente.',

      'exito'
    );


  } catch (error) {

    console.error(
      error
    );


    mostrarMensajePadresPrueba(

      error.message ||

      'No fue posible conectar con el servidor.',

      'error'
    );


  } finally {

    cambiarEstadoBotonPadresPrueba(

      boton,

      false,

      'Ingresando...',

      'Ingresar'
    );
  }
}


async function cerrarSesionPadresPrueba() {

  const token =

    sessionStorage.getItem(
      CLAVE_TOKEN_PADRES_PRUEBA
    );


  const boton =

    elementoPadresPrueba(
      'btnCerrarSesionPadresPrueba'
    );


  cambiarEstadoBotonPadresPrueba(

    boton,

    true,

    'Cerrando sesión...',

    'Cerrar sesión'
  );


  try {

    if (token) {

      await enviarPostPadresPrueba({

        accion:
          'cerrarSesionPadres',

        token:
          token
      });
    }


  } catch (error) {

    console.error(
      error
    );


  } finally {

    sessionStorage.removeItem(
      CLAVE_TOKEN_PADRES_PRUEBA
    );


    sessionStorage.removeItem(
      CLAVE_UID_RECUPERACION_PADRES_PRUEBA
    );


    ocultarSesionPadresPrueba();


    mostrarMensajePadresPrueba(

      'Sesión cerrada correctamente.',

      'exito'
    );


    cambiarEstadoBotonPadresPrueba(

      boton,

      false,

      'Cerrando sesión...',

      'Cerrar sesión'
    );
  }
}


async function restaurarSesionPadresPrueba() {

  const token =
    sessionStorage.getItem(
      CLAVE_TOKEN_PADRES_PRUEBA
    );


  if (!token) {

    const uidRecuperacion =
      sessionStorage.getItem(
        CLAVE_UID_RECUPERACION_PADRES_PRUEBA
      );


    if (uidRecuperacion) {

      const campo =
        elementoPadresPrueba(
          'uidRecuperacionPadresPrueba'
        );


      if (campo) {

        campo.value =
          uidRecuperacion;
      }


      mostrarRestablecimientoRecuperacionPadresPrueba();


      mostrarMensajeRecuperacionPadresPrueba(

        'mensajeRestablecerPasswordPadresPrueba',

        'Escribe el código enviado al correo registrado.',

        'info'
      );


      return;
    }


    ocultarSesionPadresPrueba();

    return;
  }


  mostrarMensajePadresPrueba(

    'Verificando la sesión...',

    'info'
  );


  try {

    const validacion =
      await enviarPostPadresPrueba({

        accion:
          'validarSesionPadres',

        token:
          token
      });


    if (
      !validacion.success ||
      !validacion.sesionValida
    ) {

      throw new Error(

        validacion.mensaje ||
        'La sesión ya no es válida.'
      );
    }


    if (
      validacion.requiereCambioPassword
    ) {

      mostrarCambioPasswordInicialPadresPrueba(
        validacion
      );


      mostrarMensajePadresPrueba(

        'Debes cambiar la contraseña inicial para continuar.',

        'info'
      );


      return;
    }


    const respuestaPerfil =
      await enviarPostPadresPrueba({

        accion:
          'obtenerPerfilPadre',

        token:
          token
      });


    if (
      !respuestaPerfil.success ||
      respuestaPerfil.sesionValida === false
    ) {

      throw new Error(

        respuestaPerfil.mensaje ||
        'No fue posible recuperar el perfil.'
      );
    }


    const perfil =
      normalizarPerfilPadresPrueba(
        respuestaPerfil
      );


    mostrarSesionPadresPrueba({

      alumno: {

        nombre:
          perfil.nombreAlumno,

        grado:
          perfil.grado,

        grupo:
          perfil.grupo
      }
    });


    mostrarMensajePadresPrueba(

      'Sesión restaurada correctamente.',

      'exito'
    );


  } catch (error) {

    console.error(
      error
    );


    finalizarSesionInvalidaPadresPrueba(

      'La sesión terminó. Ingresa nuevamente.'
    );
  }
}


// ============================================================
// RECUPERACIÓN DE CONTRASEÑA
// ============================================================

async function solicitarCodigoRecuperacionPadresPrueba(
  evento
) {

  evento.preventDefault();


  const uid =

    String(

      elementoPadresPrueba(
        'uidRecuperacionPadresPrueba'
      )?.value ||

      ''

    ).trim();


  const boton =

    elementoPadresPrueba(
      'btnSolicitarCodigoPadresPrueba'
    );


  if (!uid) {

    mostrarMensajeRecuperacionPadresPrueba(

      'mensajeSolicitarRecuperacionPadresPrueba',

      'Escribe el UID del alumno.',

      'info'
    );


    return;
  }


  cambiarEstadoBotonPadresPrueba(

    boton,

    true,

    'Enviando...',

    'Enviar código'
  );


  mostrarMensajeRecuperacionPadresPrueba(

    'mensajeSolicitarRecuperacionPadresPrueba',

    'Procesando la solicitud...',

    'info'
  );


  try {

    const datos =

      await enviarPostPadresPrueba({

        accion:
          'solicitarCodigoRecuperacionPadre',

        uid:
          uid
      });


    if (
      !datos.success
    ) {

      mostrarMensajeRecuperacionPadresPrueba(

        'mensajeSolicitarRecuperacionPadresPrueba',

        datos.mensaje ||

        'No fue posible procesar la recuperación.',

        'error'
      );


      return;
    }


    sessionStorage.setItem(

      CLAVE_UID_RECUPERACION_PADRES_PRUEBA,

      uid
    );


    mostrarRestablecimientoRecuperacionPadresPrueba();


    mostrarMensajeRecuperacionPadresPrueba(

      'mensajeRestablecerPasswordPadresPrueba',

      datos.mensaje ||

      'Revisa el correo registrado y escribe el código recibido.',

      'exito'
    );


  } catch (error) {

    console.error(
      error
    );


    mostrarMensajeRecuperacionPadresPrueba(

      'mensajeSolicitarRecuperacionPadresPrueba',

      error.message ||

      'No fue posible conectar con el servidor.',

      'error'
    );


  } finally {

    cambiarEstadoBotonPadresPrueba(

      boton,

      false,

      'Enviando...',

      'Enviar código'
    );
  }
}


async function reenviarCodigoRecuperacionPadresPrueba() {

  const uid =

    sessionStorage.getItem(
      CLAVE_UID_RECUPERACION_PADRES_PRUEBA
    );


  const boton =

    elementoPadresPrueba(
      'btnReenviarCodigoPadresPrueba'
    );


  if (!uid) {

    mostrarSolicitudRecuperacionPadresPrueba();


    return;
  }


  cambiarEstadoBotonPadresPrueba(

    boton,

    true,

    'Enviando...',

    'Enviar otro código'
  );


  mostrarMensajeRecuperacionPadresPrueba(

    'mensajeRestablecerPasswordPadresPrueba',

    'Procesando el nuevo envío...',

    'info'
  );


  try {

    const datos =

      await enviarPostPadresPrueba({

        accion:
          'solicitarCodigoRecuperacionPadre',

        uid:
          uid
      });


    mostrarMensajeRecuperacionPadresPrueba(

      'mensajeRestablecerPasswordPadresPrueba',

      datos.mensaje ||

      (
        datos.success

          ? 'Solicitud procesada. Revisa nuevamente el correo registrado.'

          : 'No fue posible procesar la solicitud.'
      ),

      datos.success

        ? 'exito'

        : 'error'
    );


  } catch (error) {

    console.error(
      error
    );


    mostrarMensajeRecuperacionPadresPrueba(

      'mensajeRestablecerPasswordPadresPrueba',

      error.message ||

      'No fue posible conectar con el servidor.',

      'error'
    );


  } finally {

    cambiarEstadoBotonPadresPrueba(

      boton,

      false,

      'Enviando...',

      'Enviar otro código'
    );
  }
}


async function restablecerPasswordRecuperacionPadresPrueba(
  evento
) {

  evento.preventDefault();


  const uid =

    sessionStorage.getItem(
      CLAVE_UID_RECUPERACION_PADRES_PRUEBA
    );


  const codigo =

    String(

      elementoPadresPrueba(
        'codigoRecuperacionPadresPrueba'
      )?.value ||

      ''

    ).replace(
      /\D/g,
      ''
    );


  const nueva =

    String(

      elementoPadresPrueba(
        'nuevoPasswordRecuperacionPadresPrueba'
      )?.value ||

      ''

    ).trim();


  const confirmar =

    String(

      elementoPadresPrueba(
        'confirmarPasswordRecuperacionPadresPrueba'
      )?.value ||

      ''

    ).trim();


  const boton =

    elementoPadresPrueba(
      'btnRestablecerPasswordPadresPrueba'
    );


  if (!uid) {

    mostrarSolicitudRecuperacionPadresPrueba();


    return;
  }


  if (
    codigo.length !== 6
  ) {

    mostrarMensajeRecuperacionPadresPrueba(

      'mensajeRestablecerPasswordPadresPrueba',

      'El código debe contener exactamente seis dígitos.',

      'error'
    );


    return;
  }


  if (
    nueva.length < 8
  ) {

    mostrarMensajeRecuperacionPadresPrueba(

      'mensajeRestablecerPasswordPadresPrueba',

      'La nueva contraseña debe contener al menos 8 caracteres.',

      'error'
    );


    return;
  }


  if (
    nueva.length > 64
  ) {

    mostrarMensajeRecuperacionPadresPrueba(

      'mensajeRestablecerPasswordPadresPrueba',

      'La nueva contraseña es demasiado larga.',

      'error'
    );


    return;
  }


  if (
    nueva !== confirmar
  ) {

    mostrarMensajeRecuperacionPadresPrueba(

      'mensajeRestablecerPasswordPadresPrueba',

      'Las contraseñas no coinciden.',

      'error'
    );


    return;
  }


  if (
    nueva.toLowerCase() ===
    'escuela'
  ) {

    mostrarMensajeRecuperacionPadresPrueba(

      'mensajeRestablecerPasswordPadresPrueba',

      'La nueva contraseña no puede ser la contraseña inicial.',

      'error'
    );


    return;
  }


  cambiarEstadoBotonPadresPrueba(

    boton,

    true,

    'Cambiando...',

    'Cambiar contraseña'
  );


  mostrarMensajeRecuperacionPadresPrueba(

    'mensajeRestablecerPasswordPadresPrueba',

    'Validando el código...',

    'info'
  );


  try {

    const datos =

      await enviarPostPadresPrueba({

        accion:
          'restablecerPasswordPadre',

        uid:
          uid,

        codigo:
          codigo,

        passwordNueva:
          nueva
      });


    if (
      !datos.success
    ) {

      mostrarMensajeRecuperacionPadresPrueba(

        'mensajeRestablecerPasswordPadresPrueba',

        datos.mensaje ||

        'No fue posible restablecer la contraseña.',

        'error'
      );


      return;
    }


    sessionStorage.removeItem(
      CLAVE_UID_RECUPERACION_PADRES_PRUEBA
    );


    ocultarSesionPadresPrueba();


    const campoUID =

      elementoPadresPrueba(
        'uidPadresPrueba'
      );


    if (campoUID) {

      campoUID.value =
        uid;
    }


    mostrarMensajePadresPrueba(

      datos.mensaje ||

      'Contraseña restablecida correctamente. Ya puedes iniciar sesión.',

      'exito'
    );


  } catch (error) {

    console.error(
      error
    );


    mostrarMensajeRecuperacionPadresPrueba(

      'mensajeRestablecerPasswordPadresPrueba',

      error.message ||

      'No fue posible conectar con el servidor.',

      'error'
    );


  } finally {

    cambiarEstadoBotonPadresPrueba(

      boton,

      false,

      'Cambiando...',

      'Cambiar contraseña'
    );
  }
}


function cancelarRecuperacionPadresPrueba() {

  sessionStorage.removeItem(
    CLAVE_UID_RECUPERACION_PADRES_PRUEBA
  );


  ocultarSesionPadresPrueba();


  mostrarMensajePadresPrueba(

    '',

    'info'
  );
}


// ============================================================
// NAVEGACIÓN
// ============================================================

function mostrarModuloPadresPrueba(
  nombre,
  forzar = false
) {

  document
    .querySelectorAll(
      '[data-vista-padres]'
    )
    .forEach(

      function (
        vista
      ) {

        vista.hidden =

          vista.dataset.vistaPadres !==
          nombre;
      }
    );


  document
    .querySelectorAll(
      '[data-modulo-padres]'
    )
    .forEach(

      function (
        boton
      ) {

        const activo =

          boton.dataset.moduloPadres ===
          nombre;


        boton.classList.toggle(

          'activo',

          activo
        );


        boton.setAttribute(

          'aria-current',

          activo

            ? 'page'

            : 'false'
        );
      }
    );


  MODULO_ACTUAL_PADRES_PRUEBA =
    nombre;


  if (
    forzar ||
    !MODULOS_CARGADOS_PADRES_PRUEBA.has(
      nombre
    )
  ) {

    cargarModuloPadresPrueba(

      nombre,

      forzar
    );
  }
}


async function cargarModuloPadresPrueba(
  nombre,
  forzar = false
) {

  if (
    !forzar &&
    MODULOS_CARGADOS_PADRES_PRUEBA.has(
      nombre
    )
  ) {

    return;
  }


  const cargadores = {

    asistencia:
      cargarAsistenciaPadresPrueba,

    reportes:
      cargarReportesPadresPrueba,

    justificantes:
      cargarJustificantesPadresPrueba,

    citatorios:
      cargarCitatoriosPadresPrueba,

    calificaciones:
      cargarCalificacionesPadresPrueba,

    riesgo:
      cargarRiesgoPadresPrueba,

    perfil:
      cargarPerfilPadresPrueba
  };


  if (
    cargadores[nombre]
  ) {

    await cargadores[nombre]();
  }
}


// ============================================================
// ASISTENCIA
// ============================================================

function limpiarAsistenciaPadresPrueba() {

  const valores = {

    totalAsistenciasPadresPrueba:
      '0',

    totalFaltasPadresPrueba:
      '0',

    porcentajeAsistenciaPadresPrueba:
      '0%',

    totalRegistrosAsistenciaPadresPrueba:
      '0'
  };


  Object
    .entries(
      valores
    )
    .forEach(

      function (
        entrada
      ) {

        const id =
          entrada[0];


        const valor =
          entrada[1];


        const elemento =

          elementoPadresPrueba(
            id
          );


        if (elemento) {

          elemento.textContent =
            valor;
        }
      }
    );


  mostrarMensajeModuloPadresPrueba(

    'mensajeAsistenciaPadresPrueba',

    '',

    'info'
  );


  mostrarFilaMensajePadresPrueba(

    'cuerpoTablaAsistenciaPadresPrueba',

    4,

    'Todavía no se ha consultado la asistencia.'
  );
}


function mostrarAsistenciaPadresPrueba(
  historial
) {

  const cuerpo =

    elementoPadresPrueba(
      'cuerpoTablaAsistenciaPadresPrueba'
    );


  if (!cuerpo) {

    return;
  }


  if (
    !historial.length
  ) {

    mostrarFilaMensajePadresPrueba(

      'cuerpoTablaAsistenciaPadresPrueba',

      4,

      'No existen registros de asistencia para mostrar.'
    );


    return;
  }


  cuerpo.replaceChildren();


  historial.forEach(

    function (
      registro
    ) {

      const fila =

        document.createElement(
          'tr'
        );


      fila.appendChild(

        crearCeldaPadresPrueba(

          formatearFechaPadresPrueba(

            primerValorPadresPrueba(

              registro,

              [
                'fecha',
                'fechaClave',
                'FECHA'
              ]
            )
          )
        )
      );


      fila.appendChild(

        crearCeldaPadresPrueba(

          formatearHoraPadresPrueba(

            primerValorPadresPrueba(

              registro,

              [
                'hora',
                'HORA'
              ]
            )
          )
        )
      );


      fila.appendChild(

        crearCeldaPadresPrueba(

          primerValorPadresPrueba(

            registro,

            [
              'estado',
              'estatus',
              'ESTATUS'
            ]
          ),

          'celda-estado-asistencia-padres-prueba'
        )
      );


      fila.appendChild(

        crearCeldaPadresPrueba(

          primerValorPadresPrueba(

            registro,

            [
              'puntualidad',
              'PUNTUALIDAD'
            ]
          )
        )
      );


      cuerpo.appendChild(
        fila
      );
    }
  );
}


async function cargarAsistenciaPadresPrueba() {

  const token =

    sessionStorage.getItem(
      CLAVE_TOKEN_PADRES_PRUEBA
    );


  const boton =

    elementoPadresPrueba(
      'btnActualizarAsistenciaPadresPrueba'
    );


  if (!token) {

    finalizarSesionInvalidaPadresPrueba();


    return;
  }


  cambiarEstadoBotonPadresPrueba(

    boton,

    true,

    'Consultando...',

    'Actualizar'
  );


  mostrarMensajeModuloPadresPrueba(

    'mensajeAsistenciaPadresPrueba',

    'Consultando la asistencia...',

    'info'
  );


  try {

    const datos =

      await enviarPostPadresPrueba({

        accion:
          'obtenerAsistenciaPadre',

        token:
          token
      });


    if (
      !datos.success
    ) {

      if (
        respuestaSesionInvalidaPadresPrueba(
          datos
        )
      ) {

        finalizarSesionInvalidaPadresPrueba(
          datos.mensaje
        );


        return;
      }


      throw new Error(

        datos.mensaje ||

        'No fue posible consultar la asistencia.'
      );
    }


    const historial =

      primerArregloPadresPrueba(

        datos,

        [
          'historial',
          'asistenciasDetalle',
          'registros',
          'datos'
        ]
      );


    const resumen = {

      totalAsistenciasPadresPrueba:

        numeroPadresPrueba(

          primerValorPadresPrueba(

            datos,

            [
              'asistencias',
              'totalAsistencias'
            ],

            0
          )
        ),


      totalFaltasPadresPrueba:

        numeroPadresPrueba(

          primerValorPadresPrueba(

            datos,

            [
              'faltas',
              'inasistencias',
              'totalFaltas'
            ],

            0
          )
        ),


      porcentajeAsistenciaPadresPrueba:

        (
          numeroPadresPrueba(

            primerValorPadresPrueba(

              datos,

              [
                'porcentaje',
                'porcentajeAsistencia'
              ],

              0
            )
          ) +

          '%'
        ),


      totalRegistrosAsistenciaPadresPrueba:

        historial.length
    };


    Object
      .entries(
        resumen
      )
      .forEach(

        function (
          entrada
        ) {

          const id =
            entrada[0];


          const valor =
            entrada[1];


          const elemento =

            elementoPadresPrueba(
              id
            );


          if (elemento) {

            elemento.textContent =
              String(valor);
          }
        }
      );


    mostrarAsistenciaPadresPrueba(
      historial
    );


    MODULOS_CARGADOS_PADRES_PRUEBA.add(
      'asistencia'
    );


    mostrarMensajeModuloPadresPrueba(

      'mensajeAsistenciaPadresPrueba',

      historial.length

        ? 'Información de asistencia actualizada correctamente.'

        : 'Todavía no existen registros de asistencia.',

      'exito'
    );


  } catch (error) {

    console.error(
      error
    );


    mostrarMensajeModuloPadresPrueba(

      'mensajeAsistenciaPadresPrueba',

      error.message ||

      'No fue posible consultar la asistencia.',

      'error'
    );


  } finally {

    cambiarEstadoBotonPadresPrueba(

      boton,

      false,

      'Consultando...',

      'Actualizar'
    );
  }
}


// ============================================================
// TABLAS DE REPORTES, JUSTIFICANTES, CITATORIOS Y CALIFICACIONES
// ============================================================

const CONFIGURACION_TABLAS_PADRES_PRUEBA = {

  reportes: {

    accion:
      'obtenerReportesPadre',

    boton:
      'btnActualizarReportesPadresPrueba',

    mensaje:
      'mensajeReportesPadresPrueba',

    cuerpo:
      'cuerpoTablaReportesPadresPrueba',

    columnas:
      7,

    claves:
      [
        'reportes',
        'datos',
        'registros'
      ],

    consultando:
      'Consultando los reportes escolares...',

    vacio:
      'No existen reportes escolares registrados.',

    singular:
      'reporte',


    fila: function (
      item
    ) {

      return [

        formatearFechaPadresPrueba(

          primerValorPadresPrueba(

            item,

            [
              'fecha',
              'fechaReporte',
              'FECHA'
            ]
          )
        ),


        formatearHoraPadresPrueba(

          primerValorPadresPrueba(

            item,

            [
              'hora',
              'horaReporte',
              'HORA'
            ]
          )
        ),


        primerValorPadresPrueba(

          item,

          [
            'tipo',
            'tipoReporte',
            'TIPO'
          ]
        ),


        primerValorPadresPrueba(

          item,

          [
            'docente',
            'registradoPor',
            'responsable',
            'DOCENTE'
          ]
        ),


        primerValorPadresPrueba(

          item,

          [
            'descripcion',
            'motivo',
            'detalle',
            'DESCRIPCION'
          ]
        ),


        primerValorPadresPrueba(

          item,

          [
            'accionTomada',
            'accion',
            'medida',
            'ACCION_TOMADA'
          ]
        ),


        primerValorPadresPrueba(

          item,

          [
            'estatus',
            'estado',
            'ESTATUS'
          ]
        )
      ];
    }
  },


  justificantes: {

    accion:
      'obtenerJustificantesPadre',

    boton:
      'btnActualizarJustificantesPadresPrueba',

    mensaje:
      'mensajeJustificantesPadresPrueba',

    cuerpo:
      'cuerpoTablaJustificantesPadresPrueba',

    columnas:
      4,

    claves:
      [
        'justificantes',
        'datos',
        'registros'
      ],

    consultando:
      'Consultando los justificantes...',

    vacio:
      'No existen justificantes registrados.',

    singular:
      'justificante',


    fila: function (
      item
    ) {

      let tipo =

        primerValorPadresPrueba(

          item,

          [
            'tipo',
            'tipoJustificante',
            'TIPO'
          ]
        );


      let solicita =

        primerValorPadresPrueba(

          item,

          [
            'solicita',
            'solicitante',
            'SOLICITA'
          ]
        );


      if (
        String(tipo).toUpperCase() ===
          'OTRO' &&
        item.tipoOtro
      ) {

        tipo =
          'Otro: ' +
          item.tipoOtro;
      }


      if (
        String(solicita).toUpperCase() ===
          'OTRO' &&
        item.solicitaOtro
      ) {

        solicita =
          'Otro: ' +
          item.solicitaOtro;
      }


      return [

        formatearFechaPadresPrueba(

          primerValorPadresPrueba(

            item,

            [
              'fecha',
              'fechaJustificante',
              'FECHA'
            ]
          )
        ),


        tipo,


        primerValorPadresPrueba(

          item,

          [
            'motivo',
            'descripcion',
            'MOTIVO'
          ]
        ),


        solicita
      ];
    }
  },


  citatorios: {

    accion:
      'obtenerCitatoriosPadre',

    boton:
      'btnActualizarCitatoriosPadresPrueba',

    mensaje:
      'mensajeCitatoriosPadresPrueba',

    cuerpo:
      'cuerpoTablaCitatoriosPadresPrueba',

    columnas:
      5,

    claves:
      [
        'citatorios',
        'datos',
        'registros'
      ],

    consultando:
      'Consultando los citatorios...',

    vacio:
      'No existen citatorios registrados.',

    singular:
      'citatorio',


    fila: function (
      item
    ) {

      return [

        formatearFechaPadresPrueba(

          primerValorPadresPrueba(

            item,

            [
              'fechaCitatorio',
              'fecha',
              'FECHA_CITATORIO'
            ]
          )
        ),


        formatearHoraPadresPrueba(

          primerValorPadresPrueba(

            item,

            [
              'horaCitatorio',
              'hora',
              'HORA_CITATORIO'
            ]
          )
        ),


        primerValorPadresPrueba(

          item,

          [
            'motivo',
            'descripcion',
            'MOTIVO'
          ]
        ),


        primerValorPadresPrueba(

          item,

          [
            'responsable',
            'registradoPor',
            'RESPONSABLE'
          ]
        ),


        primerValorPadresPrueba(

          item,

          [
            'seguimiento',
            'estatus',
            'observaciones',
            'SEGUIMIENTO'
          ]
        )
      ];
    }
  },


  calificaciones: {

    accion:
      'obtenerCalificacionesPadre',

    boton:
      'btnActualizarCalificacionesPadresPrueba',

    mensaje:
      'mensajeCalificacionesPadresPrueba',

    cuerpo:
      'cuerpoTablaCalificacionesPadresPrueba',

    columnas:
      6,

    claves:
      [
        'calificaciones',
        'datos',
        'materias'
      ],

    consultando:
      'Consultando las calificaciones...',

    vacio:
      'No existen calificaciones registradas.',

    singular:
      'materia',


    fila: function (
      item
    ) {

      return [

        primerValorPadresPrueba(

          item,

          [
            'materia',
            'Materia',
            'MATERIA'
          ]
        ),


        formatearCalificacionPadresPrueba(

          primerValorPadresPrueba(

            item,

            [
              'p1',
              'periodo1',
              'primerPeriodo'
            ]
          )
        ),


        formatearCalificacionPadresPrueba(

          primerValorPadresPrueba(

            item,

            [
              'p2',
              'periodo2',
              'segundoPeriodo'
            ]
          )
        ),


        formatearCalificacionPadresPrueba(

          primerValorPadresPrueba(

            item,

            [
              'p3',
              'periodo3',
              'tercerPeriodo'
            ]
          )
        ),


        formatearCalificacionPadresPrueba(

          primerValorPadresPrueba(

            item,

            [
              'promedio',
              'promedioFinal'
            ]
          )
        ),


        primerValorPadresPrueba(

          item,

          [
            'situacion',
            'estado',
            'estatus'
          ],

          'Sin calificar'
        )
      ];
    }
  }
};


function mostrarTablaModuloPadresPrueba(
  configuracion,
  registros
) {

  const cuerpo =

    elementoPadresPrueba(
      configuracion.cuerpo
    );


  if (!cuerpo) {

    return;
  }


  if (
    !registros.length
  ) {

    mostrarFilaMensajePadresPrueba(

      configuracion.cuerpo,

      configuracion.columnas,

      configuracion.vacio
    );


    return;
  }


  cuerpo.replaceChildren();


  registros.forEach(

    function (
      registro
    ) {

      const fila =

        document.createElement(
          'tr'
        );


      configuracion
        .fila(
          registro
        )
        .forEach(

          function (
            valor,
            indice
          ) {

            let clase =
              '';


            if (
              configuracion ===
              CONFIGURACION_TABLAS_PADRES_PRUEBA.calificaciones
            ) {

              if (
                indice === 4
              ) {

                clase =
                  'celda-promedio-padres-prueba';
              }


              if (
                indice === 5
              ) {

                clase =
                  'celda-situacion-padres-prueba';
              }
            }


            fila.appendChild(

              crearCeldaPadresPrueba(

                valor,

                clase
              )
            );
          }
        );


      cuerpo.appendChild(
        fila
      );
    }
  );
}


async function cargarTablaModuloPadresPrueba(
  nombre
) {

  const configuracion =

    CONFIGURACION_TABLAS_PADRES_PRUEBA[
      nombre
    ];


  const token =

    sessionStorage.getItem(
      CLAVE_TOKEN_PADRES_PRUEBA
    );


  const boton =

    elementoPadresPrueba(
      configuracion.boton
    );


  if (!token) {

    finalizarSesionInvalidaPadresPrueba();


    return;
  }


  cambiarEstadoBotonPadresPrueba(

    boton,

    true,

    'Consultando...',

    'Actualizar'
  );


  mostrarMensajeModuloPadresPrueba(

    configuracion.mensaje,

    configuracion.consultando,

    'info'
  );


  try {

    const datos =

      await enviarPostPadresPrueba({

        accion:
          configuracion.accion,

        token:
          token
      });


    if (
      !datos.success
    ) {

      if (
        respuestaSesionInvalidaPadresPrueba(
          datos
        )
      ) {

        finalizarSesionInvalidaPadresPrueba(
          datos.mensaje
        );


        return;
      }


      throw new Error(

        datos.mensaje ||

        (
          'No fue posible consultar ' +
          nombre +
          '.'
        )
      );
    }


    const registros =

      primerArregloPadresPrueba(

        datos,

        configuracion.claves
      );


    mostrarTablaModuloPadresPrueba(

      configuracion,

      registros
    );


    MODULOS_CARGADOS_PADRES_PRUEBA.add(
      nombre
    );


    mostrarMensajeModuloPadresPrueba(

      configuracion.mensaje,

      registros.length

        ? (
          'Se encontraron ' +
          registros.length +
          ' ' +
          configuracion.singular +
          '(s).'
        )

        : configuracion.vacio,

      'exito'
    );


  } catch (error) {

    console.error(
      error
    );


    mostrarMensajeModuloPadresPrueba(

      configuracion.mensaje,

      error.message ||

      (
        'No fue posible consultar ' +
        nombre +
        '.'
      ),

      'error'
    );


  } finally {

    cambiarEstadoBotonPadresPrueba(

      boton,

      false,

      'Consultando...',

      'Actualizar'
    );
  }
}


function cargarReportesPadresPrueba() {

  return cargarTablaModuloPadresPrueba(
    'reportes'
  );
}


function cargarJustificantesPadresPrueba() {

  return cargarTablaModuloPadresPrueba(
    'justificantes'
  );
}


function cargarCitatoriosPadresPrueba() {

  return cargarTablaModuloPadresPrueba(
    'citatorios'
  );
}


function cargarCalificacionesPadresPrueba() {

  return cargarTablaModuloPadresPrueba(
    'calificaciones'
  );
}


// ============================================================
// RIESGO ESCOLAR
// ============================================================

function limpiarRiesgoPadresPrueba() {

  const tarjeta =

    elementoPadresPrueba(
      'tarjetaRiesgoPadresPrueba'
    );


  const nivel =

    elementoPadresPrueba(
      'nivelRiesgoPadresPrueba'
    );


  const puntaje =

    elementoPadresPrueba(
      'puntajeRiesgoPadresPrueba'
    );


  const lista =

    elementoPadresPrueba(
      'listaMotivosRiesgoPadresPrueba'
    );


  if (tarjeta) {

    tarjeta.className =

      'tarjeta-riesgo-padres-prueba riesgo-sin-datos';
  }


  if (nivel) {

    nivel.textContent =
      'Sin consultar';
  }


  if (puntaje) {

    puntaje.textContent =
      '0';
  }


  if (lista) {

    lista.replaceChildren();


    const item =

      document.createElement(
        'li'
      );


    item.textContent =

      'Todavía no se ha consultado el riesgo escolar.';


    lista.appendChild(
      item
    );
  }


  mostrarMensajeModuloPadresPrueba(

    'mensajeRiesgoPadresPrueba',

    '',

    'info'
  );
}


function mostrarRiesgoPadresPrueba(
  respuesta
) {

  const datos =

    respuesta.riesgo ||

    respuesta;


  const tarjeta =

    elementoPadresPrueba(
      'tarjetaRiesgoPadresPrueba'
    );


  const nivelElemento =

    elementoPadresPrueba(
      'nivelRiesgoPadresPrueba'
    );


  const puntajeElemento =

    elementoPadresPrueba(
      'puntajeRiesgoPadresPrueba'
    );


  const lista =

    elementoPadresPrueba(
      'listaMotivosRiesgoPadresPrueba'
    );


  const nivel =

    String(

      primerValorPadresPrueba(

        datos,

        [
          'nivel',
          'nivelRiesgo',
          'riesgo'
        ],

        'SIN RIESGO'
      )

    )
      .trim()
      .toUpperCase()
      .replace(
        /_/g,
        ' '
      );


  const puntaje =

    numeroPadresPrueba(

      primerValorPadresPrueba(

        datos,

        [
          'puntaje',
          'puntos'
        ],

        0
      )
    );


  const motivos =

    primerArregloPadresPrueba(

      datos,

      [
        'motivos',
        'factores',
        'razones'
      ]
    );


  if (nivelElemento) {

    nivelElemento.textContent =
      nivel;
  }


  if (puntajeElemento) {

    puntajeElemento.textContent =
      String(puntaje);
  }


  if (tarjeta) {

    tarjeta.className =
      'tarjeta-riesgo-padres-prueba';


    tarjeta.classList.add(

      nivel.includes(
        'ALTO'
      )

        ? 'riesgo-alto'

        : nivel.includes(
          'MEDIO'
        )

          ? 'riesgo-medio'

          : nivel.includes(
            'BAJO'
          )

            ? 'riesgo-bajo'

            : 'riesgo-sin-riesgo'
    );
  }


  if (lista) {

    lista.replaceChildren();


    const factores =

      motivos.length

        ? motivos

        : [

          nivel.includes(
            'SIN RIESGO'
          )

            ? 'No se identificaron factores de riesgo.'

            : 'No se recibieron factores detallados.'
        ];


    factores.forEach(

      function (
        motivo
      ) {

        const item =

          document.createElement(
            'li'
          );


        item.textContent =

          typeof motivo === 'object'

            ? textoPadresPrueba(

              primerValorPadresPrueba(

                motivo,

                [
                  'motivo',
                  'descripcion',
                  'texto'
                ]
              )
            )

            : textoPadresPrueba(
              motivo
            );


        lista.appendChild(
          item
        );
      }
    );
  }
}


async function cargarRiesgoPadresPrueba() {

  const token =

    sessionStorage.getItem(
      CLAVE_TOKEN_PADRES_PRUEBA
    );


  const boton =

    elementoPadresPrueba(
      'btnActualizarRiesgoPadresPrueba'
    );


  if (!token) {

    finalizarSesionInvalidaPadresPrueba();


    return;
  }


  cambiarEstadoBotonPadresPrueba(

    boton,

    true,

    'Consultando...',

    'Actualizar'
  );


  mostrarMensajeModuloPadresPrueba(

    'mensajeRiesgoPadresPrueba',

    'Calculando el indicador de riesgo...',

    'info'
  );


  try {

    const datos =

      await enviarPostPadresPrueba({

        accion:
          'obtenerRiesgoAlumnoPadre',

        token:
          token
      });


    if (
      !datos.success
    ) {

      if (
        respuestaSesionInvalidaPadresPrueba(
          datos
        )
      ) {

        finalizarSesionInvalidaPadresPrueba(
          datos.mensaje
        );


        return;
      }


      throw new Error(

        datos.mensaje ||

        'No fue posible consultar el riesgo.'
      );
    }


    mostrarRiesgoPadresPrueba(
      datos
    );


    MODULOS_CARGADOS_PADRES_PRUEBA.add(
      'riesgo'
    );


    mostrarMensajeModuloPadresPrueba(

      'mensajeRiesgoPadresPrueba',

      'Indicador de riesgo actualizado correctamente.',

      'exito'
    );


  } catch (error) {

    console.error(
      error
    );


    mostrarMensajeModuloPadresPrueba(

      'mensajeRiesgoPadresPrueba',

      error.message ||

      'No fue posible consultar el riesgo escolar.',

      'error'
    );


  } finally {

    cambiarEstadoBotonPadresPrueba(

      boton,

      false,

      'Consultando...',

      'Actualizar'
    );
  }
}


// ============================================================
// PERFIL DEL TUTOR
// ============================================================


// ============================================================
// NORMALIZAR LA RESPUESTA DEL PERFIL
// ============================================================

function normalizarPerfilPadresPrueba(
  respuesta
) {

  const perfil =

    respuesta?.perfil &&
    typeof respuesta.perfil === 'object'

      ? respuesta.perfil

      : respuesta || {};


  const alumnoObjeto =

    perfil.alumno &&
    typeof perfil.alumno === 'object'

      ? perfil.alumno

      : {};


  const tutorObjeto =

    perfil.tutor &&
    typeof perfil.tutor === 'object'

      ? perfil.tutor

      : {};


  const nombreAlumno =

    primerValorPadresPrueba(

      alumnoObjeto,

      [
        'nombre',
        'alumno',
        'nombreAlumno',
        'NOMBRE',
        'ALUMNO'
      ],

      primerValorPadresPrueba(

        perfil,

        [
          'nombreAlumno',
          'nombre',
          'ALUMNO'
        ],

        ''
      )
    );


  const grado =

    primerValorPadresPrueba(

      alumnoObjeto,

      [
        'grado',
        'GRADO'
      ],

      primerValorPadresPrueba(

        perfil,

        [
          'grado',
          'GRADO'
        ],

        ''
      )
    );


  const grupo =

    primerValorPadresPrueba(

      alumnoObjeto,

      [
        'grupo',
        'GRUPO'
      ],

      primerValorPadresPrueba(

        perfil,

        [
          'grupo',
          'GRUPO'
        ],

        ''
      )
    );


  const nombreTutor =

    primerValorPadresPrueba(

      tutorObjeto,

      [
        'nombre',
        'nombreTutor',
        'tutor',
        'NOMBRE_TUTOR'
      ],

      primerValorPadresPrueba(

        perfil,

        [
          'nombreTutor',
          'NOMBRE_TUTOR'
        ],

        ''
      )
    );


  const telefonoTutor =

    primerValorPadresPrueba(

      tutorObjeto,

      [
        'telefono',
        'telefonoTutor',
        'TELEFONO_TUTOR'
      ],

      primerValorPadresPrueba(

        perfil,

        [
          'telefonoTutor',
          'telefono',
          'TELEFONO_TUTOR'
        ],

        ''
      )
    );


  const correoTutor =

    primerValorPadresPrueba(

      tutorObjeto,

      [
        'correo',
        'correoTutor',
        'CORREO_TUTOR'
      ],

      primerValorPadresPrueba(

        perfil,

        [
          'correoTutor',
          'correo',
          'CORREO_TUTOR'
        ],

        ''
      )
    );


  const autorizaWhatsApp =

    primerValorPadresPrueba(

      tutorObjeto,

      [
        'autorizaWhatsApp',
        'AUTORIZA_WHATSAPP'
      ],

      primerValorPadresPrueba(

        perfil,

        [
          'autorizaWhatsApp',
          'AUTORIZA_WHATSAPP'
        ],

        'NO'
      )
    );


  return {

    nombreAlumno:
      textoPadresPrueba(
        nombreAlumno
      ),

    grado:
      textoPadresPrueba(
        grado,
        ''
      ),

    grupo:
      textoPadresPrueba(
        grupo,
        ''
      ),

    nombreTutor:
      textoPadresPrueba(
        nombreTutor
      ),

    telefonoTutor:
      String(
        telefonoTutor || ''
      ).trim(),

    correoTutor:
      String(
        correoTutor || ''
      ).trim(),

    autorizaWhatsApp:
      String(
        autorizaWhatsApp || 'NO'
      )
        .trim()
        .toUpperCase() === 'SI'

        ? 'SI'
        : 'NO'
  };
}


// ============================================================
// LIMPIAR PERFIL
// ============================================================

function limpiarPerfilPadresPrueba() {

  const textos = [

    'perfilAlumnoPadresPrueba',

    'perfilGrupoPadresPrueba',

    'perfilTutorPadresPrueba'
  ];


  textos.forEach(

    function (
      id
    ) {

      const elemento =

        elementoPadresPrueba(
          id
        );


      if (elemento) {

        elemento.textContent =
          '—';
      }
    }
  );


  const campos = [

    'telefonoTutorPadresPrueba',

    'correoTutorPadresPrueba',

    'passwordActualPerfilPadresPrueba'
  ];


  campos.forEach(

    function (
      id
    ) {

      const campo =

        elementoPadresPrueba(
          id
        );


      if (campo) {

        campo.value =
          '';
      }
    }
  );


  const autorizaWhatsApp =

    elementoPadresPrueba(
      'autorizaWhatsAppPadresPrueba'
    );


  if (autorizaWhatsApp) {

    autorizaWhatsApp.checked =
      false;
  }


  mostrarMensajeModuloPadresPrueba(

    'mensajePerfilPadresPrueba',

    '',

    'info'
  );
}


// ============================================================
// MOSTRAR DATOS DEL PERFIL
// ============================================================

function mostrarPerfilPadresPrueba(
  respuesta
) {

  const perfil =

    normalizarPerfilPadresPrueba(
      respuesta
    );


  const alumno =

    elementoPadresPrueba(
      'perfilAlumnoPadresPrueba'
    );


  const gradoGrupo =

    elementoPadresPrueba(
      'perfilGrupoPadresPrueba'
    );


  const tutor =

    elementoPadresPrueba(
      'perfilTutorPadresPrueba'
    );


  const telefono =

    elementoPadresPrueba(
      'telefonoTutorPadresPrueba'
    );


  const correo =

    elementoPadresPrueba(
      'correoTutorPadresPrueba'
    );


  const autorizaWhatsApp =

    elementoPadresPrueba(
      'autorizaWhatsAppPadresPrueba'
    );


  if (alumno) {

    alumno.textContent =
      perfil.nombreAlumno;
  }


  if (gradoGrupo) {

    const textoGrupo =

      [
        perfil.grado,
        perfil.grupo
      ]
        .filter(
          Boolean
        )
        .join(
          ' · '
        );


    gradoGrupo.textContent =

      textoGrupo || '—';
  }


  if (tutor) {

    tutor.textContent =
      perfil.nombreTutor;
  }


  if (telefono) {

    telefono.value =
      perfil.telefonoTutor;
  }


  if (correo) {

    correo.value =
      perfil.correoTutor;
  }


  if (autorizaWhatsApp) {

    autorizaWhatsApp.checked =
      perfil.autorizaWhatsApp === 'SI';
  }
}


// ============================================================
// CONSULTAR PERFIL
// ============================================================

async function cargarPerfilPadresPrueba() {

  const token =

    sessionStorage.getItem(
      CLAVE_TOKEN_PADRES_PRUEBA
    );


  const boton =

    elementoPadresPrueba(
      'btnActualizarPerfilPadresPrueba'
    );


  if (!token) {

    finalizarSesionInvalidaPadresPrueba();

    return;
  }


  cambiarEstadoBotonPadresPrueba(

    boton,

    true,

    'Consultando...',

    'Actualizar datos'
  );


  mostrarMensajeModuloPadresPrueba(

    'mensajePerfilPadresPrueba',

    'Consultando los datos del tutor...',

    'info'
  );


  try {

    const datos =

      await enviarPostPadresPrueba({

        accion:
          'obtenerPerfilPadre',

        token:
          token
      });


    if (
      !datos.success
    ) {

      if (
        respuestaSesionInvalidaPadresPrueba(
          datos
        )
      ) {

        finalizarSesionInvalidaPadresPrueba(
          datos.mensaje
        );

        return;
      }


      throw new Error(

        datos.mensaje ||
        'No fue posible consultar el perfil.'
      );
    }


    mostrarPerfilPadresPrueba(
      datos
    );


    MODULOS_CARGADOS_PADRES_PRUEBA.add(
      'perfil'
    );


    mostrarMensajeModuloPadresPrueba(

      'mensajePerfilPadresPrueba',

      '',

      'info'
    );


  } catch (error) {

    console.error(
      error
    );


    mostrarMensajeModuloPadresPrueba(

      'mensajePerfilPadresPrueba',

      error.message ||
      'No fue posible consultar el perfil.',

      'error'
    );


  } finally {

    cambiarEstadoBotonPadresPrueba(

      boton,

      false,

      'Consultando...',

      'Actualizar datos'
    );
  }
}


// ============================================================
// ACTUALIZAR DATOS DEL PERFIL
// ============================================================

async function actualizarPerfilPadresPrueba(
  evento
) {

  evento.preventDefault();


  const token =

    sessionStorage.getItem(
      CLAVE_TOKEN_PADRES_PRUEBA
    );


  const telefono =

    String(

      elementoPadresPrueba(
        'telefonoTutorPadresPrueba'
      )?.value || ''

    ).trim();


  const correo =

    String(

      elementoPadresPrueba(
        'correoTutorPadresPrueba'
      )?.value || ''

    ).trim();


  const autorizaWhatsApp =

    elementoPadresPrueba(
      'autorizaWhatsAppPadresPrueba'
    )?.checked

      ? 'SI'
      : 'NO';


  const passwordActual =

    String(

      elementoPadresPrueba(
        'passwordActualPerfilPadresPrueba'
      )?.value || ''
    );


  const boton =

    elementoPadresPrueba(
      'btnGuardarPerfilPadresPrueba'
    );


  if (!token) {

    finalizarSesionInvalidaPadresPrueba();

    return;
  }


  if (!passwordActual) {

    mostrarMensajeModuloPadresPrueba(

      'mensajePerfilPadresPrueba',

      'Escribe la contraseña actual para autorizar el cambio.',

      'info'
    );

    return;
  }


  if (
    correo &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      correo
    )
  ) {

    mostrarMensajeModuloPadresPrueba(

      'mensajePerfilPadresPrueba',

      'El correo electrónico no tiene un formato válido.',

      'error'
    );

    return;
  }


  cambiarEstadoBotonPadresPrueba(

    boton,

    true,

    'Guardando...',

    'Guardar datos de contacto'
  );


  mostrarMensajeModuloPadresPrueba(

    'mensajePerfilPadresPrueba',

    'Guardando los datos de contacto...',

    'info'
  );


  try {

    const datos =

      await enviarPostPadresPrueba({

        accion:
          'actualizarPerfilPadre',

        token:
          token,

        telefono:
          telefono,

        telefonoTutor:
          telefono,

        correo:
          correo,

        correoTutor:
          correo,

        autorizaWhatsApp:
          autorizaWhatsApp,

        passwordActual:
          passwordActual
      });


    if (
      !datos.success
    ) {

      if (
        respuestaSesionInvalidaPadresPrueba(
          datos
        )
      ) {

        finalizarSesionInvalidaPadresPrueba(
          datos.mensaje
        );

        return;
      }


      mostrarMensajeModuloPadresPrueba(

        'mensajePerfilPadresPrueba',

        datos.mensaje ||
        'No fue posible actualizar los datos.',

        'error'
      );

      return;
    }


    const campoPassword =

      elementoPadresPrueba(
        'passwordActualPerfilPadresPrueba'
      );


    if (campoPassword) {

      campoPassword.value =
        '';
    }


    MODULOS_CARGADOS_PADRES_PRUEBA.delete(
      'perfil'
    );


    await cargarPerfilPadresPrueba();


    const mensajeExitoPerfil =

      datos.mensaje ||
      'Los datos de contacto se actualizaron correctamente.';


    mostrarMensajeModuloPadresPrueba(

      'mensajePerfilPadresPrueba',

      mensajeExitoPerfil,

      'exito'
    );


    window.setTimeout(

      function () {

        const mensajePerfil =

          elementoPadresPrueba(
            'mensajePerfilPadresPrueba'
          );


        if (
          mensajePerfil &&
          mensajePerfil.textContent === mensajeExitoPerfil
        ) {

          mostrarMensajeModuloPadresPrueba(

            'mensajePerfilPadresPrueba',

            '',

            'info'
          );
        }
      },

      4000
    );


  } catch (error) {

    console.error(
      error
    );


    mostrarMensajeModuloPadresPrueba(

      'mensajePerfilPadresPrueba',

      error.message ||
      'No fue posible actualizar los datos.',

      'error'
    );


  } finally {

    cambiarEstadoBotonPadresPrueba(

      boton,

      false,

      'Guardando...',

      'Guardar datos de contacto'
    );
  }
}

// ============================================================
// EVENTOS
// ============================================================

document.addEventListener(

  'DOMContentLoaded',

  function () {

    const eventos = [

      [
        'formLoginPadresPrueba',
        'submit',
        iniciarSesionPadresPrueba
      ],

      [
        'btnCerrarSesionPadresPrueba',
        'click',
        cerrarSesionPadresPrueba
      ],

      [
        'formCambioPasswordPadresPrueba',
        'submit',
        cambiarPasswordInicialPadresPrueba
      ],

      [
        'btnMostrarRecuperacionPadresPrueba',
        'click',
        mostrarSolicitudRecuperacionPadresPrueba
      ],

      [
        'formSolicitarRecuperacionPadresPrueba',
        'submit',
        solicitarCodigoRecuperacionPadresPrueba
      ],

      [
        'btnVolverLoginDesdeRecuperacionPadresPrueba',
        'click',
        cancelarRecuperacionPadresPrueba
      ],

      [
        'formRestablecerPasswordPadresPrueba',
        'submit',
        restablecerPasswordRecuperacionPadresPrueba
      ],

      [
        'btnReenviarCodigoPadresPrueba',
        'click',
        reenviarCodigoRecuperacionPadresPrueba
      ],

      [
        'btnCancelarRecuperacionPadresPrueba',
        'click',
        cancelarRecuperacionPadresPrueba
      ],

      [
        'formActualizarPerfilPadresPrueba',
        'submit',
        actualizarPerfilPadresPrueba
      ]
    ];


    eventos.forEach(

      function (
        configuracion
      ) {

        const id =
          configuracion[0];


        const tipo =
          configuracion[1];


        const funcion =
          configuracion[2];


        const elemento =

          elementoPadresPrueba(
            id
          );


        if (elemento) {

          elemento.addEventListener(

            tipo,

            funcion
          );
        }
      }
    );


    document
      .querySelectorAll(
        '[data-modulo-padres]'
      )
      .forEach(

        function (
          boton
        ) {

          boton.addEventListener(

            'click',

            function () {

              mostrarModuloPadresPrueba(

                boton.dataset.moduloPadres
              );
            }
          );
        }
      );


    const actualizaciones = [

      [
        'btnActualizarAsistenciaPadresPrueba',
        'asistencia'
      ],

      [
        'btnActualizarReportesPadresPrueba',
        'reportes'
      ],

      [
        'btnActualizarJustificantesPadresPrueba',
        'justificantes'
      ],

      [
        'btnActualizarCitatoriosPadresPrueba',
        'citatorios'
      ],

      [
        'btnActualizarCalificacionesPadresPrueba',
        'calificaciones'
      ],

      [
        'btnActualizarRiesgoPadresPrueba',
        'riesgo'
      ],

      [
        'btnActualizarPerfilPadresPrueba',
        'perfil'
      ]
    ];


    actualizaciones.forEach(

      function (
        configuracion
      ) {

        const id =
          configuracion[0];


        const modulo =
          configuracion[1];


        const boton =

          elementoPadresPrueba(
            id
          );


        if (!boton) {

          return;
        }


        boton.addEventListener(

          'click',

          function () {

            MODULOS_CARGADOS_PADRES_PRUEBA.delete(
              modulo
            );


            cargarModuloPadresPrueba(

              modulo,

              true
            );
          }
        );
      }
    );


    restaurarSesionPadresPrueba();
  }
);

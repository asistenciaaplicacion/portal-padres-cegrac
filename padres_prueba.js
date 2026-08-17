// ============================================================
// PORTAL DE PADRES CEGRAC V3
// FRONTEND FINAL
//
// API:
// Portal_Padres_CEGRAC_API v3.0.0
//
// Arquitectura:
// LOGIN
//   ↓
// TOKEN
//   ↓
// EXPEDIENTE COMPLETO
//   ↓
// TODOS LOS MÓDULOS
//
// No se realizan consultas independientes para cada módulo.
// ============================================================


// ============================================================
// CONFIGURACIÓN
// ============================================================

const API_PADRES =
  'https://script.google.com/macros/s/AKfycbx19ZnCy8cW3vij13WhUILuL8RW1vPy9Yar0WanzRAJimWM1E9CIj3NzQb1e5RAmKK4Vg/exec';

const CLAVE_TOKEN_PADRES =
  'CEGRAC_TOKEN_PADRES_V3';

const CLAVE_UID_RECUPERACION =
  'CEGRAC_UID_RECUPERACION_PADRES_V3';


// ============================================================
// ESTADO LOCAL DEL PORTAL
// ============================================================

let EXPEDIENTE_PADRES = null;

let MODULO_ACTUAL_PADRES =
  'resumen';

let EXPEDIENTE_CARGANDO =
  false;


// ============================================================
// UTILIDADES GENERALES
// ============================================================

function elemento(id) {
  return document.getElementById(id);
}


function texto(valor, reemplazo = '—') {

  if (
    valor === undefined ||
    valor === null
  ) {
    return reemplazo;
  }

  const resultado =
    String(valor).trim();

  return resultado || reemplazo;
}


function numero(valor, reemplazo = 0) {

  const resultado =
    Number(valor);

  return Number.isFinite(resultado)
    ? resultado
    : reemplazo;
}


function primerValor(
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


function primerArreglo(
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


function formatearFecha(valor) {

  const valorTexto =
    String(valor ?? '').trim();

  if (!valorTexto) {
    return '—';
  }


  const iso =
    valorTexto.match(
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


  const mexicana =
    valorTexto.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
    );

  if (mexicana) {

    return (
      mexicana[1].padStart(2, '0') +
      '/' +
      mexicana[2].padStart(2, '0') +
      '/' +
      mexicana[3]
    );
  }


  const fecha =
    new Date(valorTexto);

  if (
    !Number.isNaN(
      fecha.getTime()
    )
  ) {

    return new Intl.DateTimeFormat(
      'es-MX',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    ).format(fecha);
  }


  return valorTexto;
}


function formatearHora(valor) {

  const valorTexto =
    String(valor ?? '').trim();

  if (!valorTexto) {
    return '—';
  }

  const hora =
    valorTexto.match(
      /(\d{1,2}):(\d{2})(?::\d{2})?/
    );

  if (!hora) {
    return valorTexto;
  }

  return (
    hora[1].padStart(2, '0') +
    ':' +
    hora[2]
  );
}


function formatearCalificacion(valor) {

  if (
    valor === undefined ||
    valor === null ||
    String(valor).trim() === ''
  ) {
    return '—';
  }

  const numeroValor =
    Number(valor);

  if (
    !Number.isFinite(
      numeroValor
    )
  ) {
    return String(valor);
  }

  return Number.isInteger(
    numeroValor
  )
    ? String(numeroValor)
    : numeroValor.toFixed(1);
}


function cambiarBoton(
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


function mostrarMensaje(
  id,
  mensaje,
  tipo = 'info'
) {

  const campo =
    elemento(id);

  if (!campo) {
    return;
  }

  campo.textContent =
    mensaje || '';

  campo.classList.remove(
    'mensaje-exito-padres-prueba',
    'mensaje-error-padres-prueba',
    'mensaje-info-padres-prueba'
  );

  campo.classList.add(

    tipo === 'exito'
      ? 'mensaje-exito-padres-prueba'

      : tipo === 'error'
        ? 'mensaje-error-padres-prueba'

        : 'mensaje-info-padres-prueba'
  );
}


function crearCelda(
  valor,
  clase = ''
) {

  const celda =
    document.createElement('td');

  celda.textContent =
    texto(valor);

  if (clase) {
    celda.classList.add(clase);
  }

  return celda;
}


function mostrarFilaVacia(
  id,
  columnas,
  mensaje
) {

  const cuerpo =
    elemento(id);

  if (!cuerpo) {
    return;
  }

  cuerpo.replaceChildren();

  const fila =
    document.createElement('tr');

  const celda =
    document.createElement('td');

  celda.colSpan =
    columnas;

  celda.textContent =
    mensaje;

  celda.className =
    'celda-mensaje-tabla-padres-prueba';

  fila.appendChild(celda);

  cuerpo.appendChild(fila);
}


// ============================================================
// API
// ============================================================

async function enviarPost(datos) {

  const respuesta =
    await fetch(
      API_PADRES,
      {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(datos)
      }
    );


  const textoRespuesta =
    await respuesta.text();


  let json;

  try {

    json =
      JSON.parse(
        textoRespuesta
      );

  } catch (error) {

    console.error(
      'Respuesta recibida:',
      textoRespuesta
    );

    throw new Error(
      'El servidor no devolvió una respuesta JSON válida.'
    );
  }


  if (!respuesta.ok) {

    throw new Error(
      json.mensaje ||
      'La solicitud terminó con un error HTTP.'
    );
  }


  return json;
}


// ============================================================
// SESIÓN
// ============================================================

function obtenerToken() {

  return sessionStorage.getItem(
    CLAVE_TOKEN_PADRES
  );
}


function eliminarSesionLocal() {

  sessionStorage.removeItem(
    CLAVE_TOKEN_PADRES
  );

  sessionStorage.removeItem(
    CLAVE_UID_RECUPERACION
  );

  EXPEDIENTE_PADRES =
    null;
}


function sesionInvalida(datos) {

  const codigo =
    String(
      datos?.codigo ||
      datos?.error ||
      ''
    ).toUpperCase();

  return (

    datos?.sesionValida === false ||

    codigo ===
      'SESION_INVALIDA' ||

    codigo ===
      'TOKEN_INVALIDO' ||

    codigo ===
      'SESION_EXPIRADA'
  );
}


function cerrarPortalPorSesionInvalida(
  mensaje
) {

  eliminarSesionLocal();

  ocultarPortal();

  mostrarMensaje(
    'mensajePadresPrueba',
    mensaje ||
      'La sesión terminó. Ingresa nuevamente.',
    'info'
  );
}


// ============================================================
// PANTALLAS DE ACCESO
// ============================================================

function mostrarEncabezadoPublico(
  mostrar
) {

  const encabezado =
    elemento(
      'encabezadoPublicoPadresPrueba'
    );

  if (encabezado) {
    encabezado.hidden =
      !mostrar;
  }
}


function mostrarBotonRecuperacion(
  mostrar
) {

  const boton =
    elemento(
      'btnMostrarRecuperacionPadresPrueba'
    );

  if (boton) {
    boton.hidden =
      !mostrar;
  }
}


function ocultarCambioPassword() {

  const panel =
    elemento(
      'panelCambioPasswordPadresPrueba'
    );

  if (panel) {
    panel.hidden =
      true;
  }

  [
    'nuevoPasswordInicialPadresPrueba',
    'confirmarPasswordInicialPadresPrueba'
  ].forEach(
    function(id) {

      const campo =
        elemento(id);

      if (campo) {
        campo.value =
          '';
      }
    }
  );

  mostrarMensaje(
    'mensajeCambioPasswordPadresPrueba',
    '',
    'info'
  );
}


function ocultarRecuperacion() {

  const solicitar =
    elemento(
      'panelSolicitarRecuperacionPadresPrueba'
    );

  const restablecer =
    elemento(
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
}


function mostrarCambioPassword(
  datos
) {

  ocultarRecuperacion();

  mostrarEncabezadoPublico(true);

  mostrarBotonRecuperacion(false);


  const login =
    elemento(
      'formLoginPadresPrueba'
    );

  const panel =
    elemento(
      'panelPadresPrueba'
    );

  const cambio =
    elemento(
      'panelCambioPasswordPadresPrueba'
    );

  const alumno =
    elemento(
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

        ? 'Alumno: ' +
          datos.alumno.nombre

        : 'Cuenta del Portal de Padres';
  }


  mostrarMensaje(
    'mensajeCambioPasswordPadresPrueba',
    'Escribe y confirma una nueva contraseña.',
    'info'
  );
}


function mostrarSolicitudRecuperacion() {

  ocultarCambioPassword();
  ocultarRecuperacion();

  mostrarEncabezadoPublico(true);
  mostrarBotonRecuperacion(false);


  const login =
    elemento(
      'formLoginPadresPrueba'
    );

  const panel =
    elemento(
      'panelPadresPrueba'
    );

  const solicitar =
    elemento(
      'panelSolicitarRecuperacionPadresPrueba'
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


  const uidLogin =
    String(
      elemento(
        'uidPadresPrueba'
      )?.value || ''
    ).trim();


  const uidRecuperacion =
    elemento(
      'uidRecuperacionPadresPrueba'
    );


  if (
    uidLogin &&
    uidRecuperacion
  ) {

    uidRecuperacion.value =
      uidLogin;
  }


  mostrarMensaje(
    'mensajeSolicitarRecuperacionPadresPrueba',
    'Escribe el UID del alumno para solicitar el código.',
    'info'
  );
}


function mostrarRestablecimientoRecuperacion() {

  ocultarCambioPassword();

  mostrarEncabezadoPublico(true);
  mostrarBotonRecuperacion(false);


  const login =
    elemento(
      'formLoginPadresPrueba'
    );

  const panel =
    elemento(
      'panelPadresPrueba'
    );

  const solicitar =
    elemento(
      'panelSolicitarRecuperacionPadresPrueba'
    );

  const restablecer =
    elemento(
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
// LOGIN
// ============================================================

async function iniciarSesion(evento) {

  evento.preventDefault();

  const uid =
    String(
      elemento('uidPadresPrueba')?.value || ''
    ).trim();

  const password =
    String(
      elemento('passwordPadresPrueba')?.value || ''
    );

  const boton =
    elemento('btnIngresarPadresPrueba');

  if (!uid || !password) {

    mostrarMensaje(
      'mensajePadresPrueba',
      'Escribe el UID y la contraseña.',
      'info'
    );

    return;
  }

  cambiarBoton(
    boton,
    true,
    'Ingresando...',
    'Ingresar'
  );

  mostrarMensaje(
    'mensajePadresPrueba',
    'Validando la cuenta...',
    'info'
  );

  try {

    const datos =
      await enviarPost({

        accion: 'loginPadres',

        uid: uid,

        password: password
      });


    if (
      !datos.success ||
      !datos.token
    ) {

      throw new Error(
        datos.mensaje ||
        'No fue posible iniciar sesión.'
      );
    }


    sessionStorage.setItem(
      CLAVE_TOKEN_PADRES,
      datos.token
    );


    sessionStorage.removeItem(
      CLAVE_UID_RECUPERACION
    );


    const campoPassword =
      elemento('passwordPadresPrueba');

    if (campoPassword) {
      campoPassword.value = '';
    }


    // ========================================================
    // CAMBIO DE CONTRASEÑA INICIAL
    // ========================================================

    if (datos.requiereCambioPassword) {

      mostrarCambioPassword(datos);

      mostrarMensaje(
        'mensajePadresPrueba',
        'Acceso correcto. Debes cambiar la contraseña inicial.',
        'info'
      );

      return;
    }


    // ========================================================
    // MOSTRAR EL PORTAL
    // ========================================================

    mostrarPortal();


    // ========================================================
    // CARGAR EXPEDIENTE COMPLETO
    // ========================================================

    const cargado =
      await cargarExpedienteCompleto(true);


    if (!cargado) {

      mostrarMensaje(
        'mensajePadresPrueba',
        'La sesión inició correctamente, pero no fue posible cargar el expediente escolar.',
        'error'
      );

      return;
    }


    mostrarMensaje(
      'mensajePadresPrueba',
      'Bienvenido al Portal de Padres CEGRAC.',
      'exito'
    );


  } catch (error) {

    console.error(error);

    eliminarSesionLocal();

    mostrarMensaje(
      'mensajePadresPrueba',
      error.message ||
      'No fue posible conectar con el servidor.',
      'error'
    );


  } finally {

    cambiarBoton(
      boton,
      false,
      'Ingresando...',
      'Ingresar'
    );
  }
}


// ============================================================
// CARGA DEL EXPEDIENTE COMPLETO
// ============================================================

async function cargarExpedienteCompleto(
  mostrarCarga = true
) {

  const token =
    obtenerToken();


  if (!token) {

    cerrarPortalPorSesionInvalida();

    return false;
  }


  if (EXPEDIENTE_CARGANDO) {
    return false;
  }


  EXPEDIENTE_CARGANDO =
    true;


  const boton =
    elemento(
      'btnActualizarExpedientePadresPrueba'
    );


  if (mostrarCarga) {

    cambiarBoton(
      boton,
      true,
      'Actualizando...',
      'Actualizar información'
    );

    mostrarMensaje(
      'mensajePadresPrueba',
      'Consultando el expediente escolar...',
      'info'
    );
  }


  try {

    const respuesta =
      await enviarPost({

        accion:
          'obtenerExpedienteAlumnoPadre',

        token:
          token
      });


    if (
      !respuesta.success
    ) {

      if (
        sesionInvalida(
          respuesta
        )
      ) {

        cerrarPortalPorSesionInvalida(
          respuesta.mensaje
        );

        return false;
      }


      throw new Error(
        respuesta.mensaje ||
        'No fue posible obtener el expediente escolar.'
      );
    }


    if (
      respuesta.sesionValida === false
    ) {

      cerrarPortalPorSesionInvalida(
        respuesta.mensaje
      );

      return false;
    }


    EXPEDIENTE_PADRES =
      normalizarExpediente(
        respuesta
      );


    renderizarExpediente();


    mostrarMensaje(
      'mensajePadresPrueba',
      'Información escolar actualizada correctamente.',
      'exito'
    );


    return true;


  } catch (error) {

    console.error(error);

    mostrarMensaje(
      'mensajePadresPrueba',
      error.message ||
        'No fue posible consultar el expediente.',
      'error'
    );

    return false;


  } finally {

    EXPEDIENTE_CARGANDO =
      false;


    if (mostrarCarga) {

      cambiarBoton(
        boton,
        false,
        'Actualizando...',
        'Actualizar información'
      );
    }
  }
}


// ============================================================
// NORMALIZACIÓN DEL EXPEDIENTE V3
//
// Se acepta tanto:
// respuesta directamente
// como:
// respuesta.expediente
//
// Esto permite que el Portal sea resistente a la envoltura
// JSON utilizada por el backend.
// ============================================================

function normalizarExpediente(
  respuesta
) {

  const expediente =
    (
      respuesta?.expediente &&
      typeof respuesta.expediente === 'object'
    )
      ? respuesta.expediente
      : respuesta;


  const alumnoOrigen =
    (
      expediente?.alumno &&
      typeof expediente.alumno === 'object'
    )
      ? expediente.alumno
      : {};


  const tutorOrigen =
    (
      expediente?.tutor &&
      typeof expediente.tutor === 'object'
    )
      ? expediente.tutor
      : (
        expediente?.perfil?.tutor &&
        typeof expediente.perfil.tutor === 'object'
      )
        ? expediente.perfil.tutor
        : {};


  const asistenciaOrigen =
    (
      expediente?.asistencia &&
      typeof expediente.asistencia === 'object'
    )
      ? expediente.asistencia
      : {};


  const calificacionesOrigen =
    (
      expediente?.calificaciones &&
      typeof expediente.calificaciones === 'object'
    )
      ? expediente.calificaciones
      : {};


  const riesgoOrigen =
    (
      expediente?.riesgo &&
      typeof expediente.riesgo === 'object'
    )
      ? expediente.riesgo
      : {};


  const alumnoNombre =
    typeof expediente?.alumno === 'string'
      ? expediente.alumno
      : primerValor(
          alumnoOrigen,
          [
            'nombre',
            'alumno',
            'nombreAlumno',
            'ALUMNO'
          ],
          ''
        );


  const grado =
    primerValor(
      alumnoOrigen,
      [
        'grado',
        'GRADO'
      ],
      expediente?.grado || ''
    );


  const grupo =
    primerValor(
      alumnoOrigen,
      [
        'grupo',
        'GRUPO'
      ],
      expediente?.grupo || ''
    );


  const nombreTutor =
    primerValor(
      tutorOrigen,
      [
        'nombre',
        'nombreTutor',
        'tutor',
        'NOMBRE_TUTOR'
      ],
      primerValor(
        expediente?.perfil || {},
        [
          'nombreTutor',
          'NOMBRE_TUTOR'
        ],
        ''
      )
    );


  const telefonoTutor =
    primerValor(
      tutorOrigen,
      [
        'telefono',
        'telefonoTutor',
        'TELEFONO_TUTOR'
      ],
      primerValor(
        expediente?.perfil || {},
        [
          'telefonoTutor',
          'telefono',
          'TELEFONO_TUTOR'
        ],
        ''
      )
    );


  const correoTutor =
    primerValor(
      tutorOrigen,
      [
        'correo',
        'correoTutor',
        'CORREO_TUTOR'
      ],
      primerValor(
        expediente?.perfil || {},
        [
          'correoTutor',
          'correo',
          'CORREO_TUTOR'
        ],
        ''
      )
    );


  const asistenciaHistorial =
    primerArreglo(
      asistenciaOrigen,
      [
        'historial',
        'asistenciasDetalle',
        'registros',
        'datos'
      ]
    ).length

      ? primerArreglo(
          asistenciaOrigen,
          [
            'historial',
            'asistenciasDetalle',
            'registros',
            'datos'
          ]
        )

      : primerArreglo(
          expediente,
          [
            'historialAsistencia',
            'asistenciasDetalle'
          ]
        );


  const reportes =
    primerArreglo(
      expediente,
      [
        'reportes',
        'reportesAlumnos'
      ]
    );


  const justificantes =
    primerArreglo(
      expediente,
      [
        'justificantes'
      ]
    );


  const citatorios =
    primerArreglo(
      expediente,
      [
        'citatorios'
      ]
    );


  const pasesSalida =
    primerArreglo(
      expediente,
      [
        'pasesSalida',
        'pases_salida',
        'pases'
      ]
    );


  const seguimientos =
    primerArreglo(
      expediente,
      [
        'seguimientos',
        'seguimientoTutorial',
        'seguimiento'
      ]
    );


  const materias =
    primerArreglo(
      calificacionesOrigen,
      [
        'materias',
        'calificaciones',
        'registros',
        'datos'
      ]
    ).length

      ? primerArreglo(
          calificacionesOrigen,
          [
            'materias',
            'calificaciones',
            'registros',
            'datos'
          ]
        )

      : primerArreglo(
          expediente,
          [
            'materias',
            'calificaciones'
          ]
        );


  return {

    success:
      true,

    sesionValida:
      expediente.sesionValida !== false,

    cicloEscolar:
      texto(
        expediente.cicloEscolar,
        '2026-2027'
      ),

    alumno: {

      uid:
        primerValor(
          alumnoOrigen,
          [
            'uid',
            'RFID',
            'id'
          ],
          expediente.uid || ''
        ),

      nombre:
        texto(
          alumnoNombre,
          'Alumno'
        ),

      grado:
        texto(
          grado,
          ''
        ),

      grupo:
        texto(
          grupo,
          ''
        )
    },

    tutor: {

      nombre:
        texto(
          nombreTutor,
          ''
        ),

      telefono:
        texto(
          telefonoTutor,
          ''
        ),

      correo:
        texto(
          correoTutor,
          ''
        )
    },

    asistencia: {

      asistencias:
        numero(
          primerValor(
            asistenciaOrigen,
            [
              'asistencias',
              'totalAsistencias'
            ],
            expediente.asistencias || 0
          )
        ),

      faltas:
        numero(
          primerValor(
            asistenciaOrigen,
            [
              'faltas',
              'inasistencias',
              'totalFaltas'
            ],
            expediente.faltas || 0
          )
        ),

      porcentaje:
        numero(
          primerValor(
            asistenciaOrigen,
            [
              'porcentaje',
              'porcentajeAsistencia'
            ],
            expediente.porcentajeAsistencia || 0
          )
        ),

      historial:
        asistenciaHistorial
    },

    reportes:
      reportes,

    justificantes:
      justificantes,

    citatorios:
      citatorios,

    calificaciones: {

      materias:
        materias,

      promedioGeneral:
        numero(
          primerValor(
            calificacionesOrigen,
            [
              'promedioGeneral',
              'promedio',
              'promedioFinal'
            ],
            expediente.promedioGeneral || 0
          )
        )
    },

    pasesSalida:
      pasesSalida,

    seguimientos:
      seguimientos,

    riesgo: {

      nivel:
        texto(
          primerValor(
            riesgoOrigen,
            [
              'nivel',
              'nivelRiesgo',
              'riesgo'
            ],
            expediente.nivelRiesgo ||
            expediente.riesgo ||
            'SIN RIESGO'
          ),
          'SIN RIESGO'
        )
          .toUpperCase()
          .replace(
            /_/g,
            ' '
          ),

      puntaje:
        numero(
          primerValor(
            riesgoOrigen,
            [
              'puntaje',
              'puntos'
            ],
            expediente.puntajeRiesgo || 0
          )
        ),

      motivos:
        primerArreglo(
          riesgoOrigen,
          [
            'motivos',
            'factores',
            'razones'
          ]
        ),

      indicadores:
        riesgoOrigen.indicadores || {}
    }
  };
}


// ============================================================
// RENDERIZADO GENERAL
// ============================================================

function renderizarExpediente() {

  if (
    !EXPEDIENTE_PADRES
  ) {
    return;
  }


  renderizarIdentidad();

  renderizarResumen();

  renderizarAsistencia();

  renderizarReportes();

  renderizarJustificantes();

  renderizarCitatorios();

  renderizarCalificaciones();

  renderizarPasesSalida();

  renderizarSeguimientos();

  renderizarRiesgo();

  renderizarPerfil();
}


// ============================================================
// IDENTIDAD
// ============================================================

function renderizarIdentidad() {

  const alumno =
    EXPEDIENTE_PADRES.alumno;


  const nombre =
    elemento(
      'nombreAlumnoPadresPrueba'
    );

  const grado =
    elemento(
      'gradoAlumnoPadresPrueba'
    );

  const grupo =
    elemento(
      'grupoAlumnoPadresPrueba'
    );


  if (nombre) {
    nombre.textContent =
      texto(
        alumno.nombre,
        'Alumno'
      );
  }

  if (grado) {
    grado.textContent =
      texto(
        alumno.grado,
        'Sin grado'
      );
  }

  if (grupo) {
    grupo.textContent =
      texto(
        alumno.grupo,
        'Sin grupo'
      );
  }


  const ciclo =
    elemento(
      'cicloEscolarPadresPrueba'
    );

  if (ciclo) {
    ciclo.textContent =
      EXPEDIENTE_PADRES.cicloEscolar;
  }
}


// ============================================================
// RESUMEN
// ============================================================

function renderizarResumen() {

  const asistencia =
    EXPEDIENTE_PADRES.asistencia;


  const valores = {

    resumenAsistenciasPadresPrueba:
      asistencia.asistencias,

    resumenFaltasPadresPrueba:
      asistencia.faltas,

    resumenPorcentajePadresPrueba:
      asistencia.porcentaje + '%',

    resumenReportesPadresPrueba:
      EXPEDIENTE_PADRES.reportes.length,

    resumenCitatoriosPadresPrueba:
      EXPEDIENTE_PADRES.citatorios.length,

    resumenPromedioPadresPrueba:
      EXPEDIENTE_PADRES.calificaciones
        .promedioGeneral > 0

        ? formatearCalificacion(
            EXPEDIENTE_PADRES
              .calificaciones
              .promedioGeneral
          )

        : '—',

    resumenRiesgoPadresPrueba:
      EXPEDIENTE_PADRES.riesgo.nivel
  };


  Object.entries(
    valores
  ).forEach(
    function([id, valor]) {

      const campo =
        elemento(id);

      if (campo) {
        campo.textContent =
          String(valor);
      }
    }
  );
}


// ============================================================
// ASISTENCIA
// ============================================================

function renderizarAsistencia() {

  const asistencia =
    EXPEDIENTE_PADRES.asistencia;


  const valores = {

    totalAsistenciasPadresPrueba:
      asistencia.asistencias,

    totalFaltasPadresPrueba:
      asistencia.faltas,

    porcentajeAsistenciaPadresPrueba:
      asistencia.porcentaje + '%',

    totalRegistrosAsistenciaPadresPrueba:
      asistencia.historial.length
  };


  Object.entries(
    valores
  ).forEach(
    function([id, valor]) {

      const campo =
        elemento(id);

      if (campo) {
        campo.textContent =
          String(valor);
      }
    }
  );


  const cuerpo =
    elemento(
      'cuerpoTablaAsistenciaPadresPrueba'
    );


  if (!cuerpo) {
    return;
  }


  if (
    !asistencia.historial.length
  ) {

    mostrarFilaVacia(
      'cuerpoTablaAsistenciaPadresPrueba',
      4,
      'No existen registros de asistencia para mostrar.'
    );

    return;
  }


  cuerpo.replaceChildren();


  asistencia.historial.forEach(
    function(registro) {

      const fila =
        document.createElement('tr');


      fila.appendChild(
        crearCelda(
          formatearFecha(
            primerValor(
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
        crearCelda(
          formatearHora(
            primerValor(
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
        crearCelda(
          primerValor(
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
        crearCelda(
          primerValor(
            registro,
            [
              'puntualidad',
              'PUNTUALIDAD'
            ]
          )
        )
      );


      cuerpo.appendChild(fila);
    }
  );
}


// ============================================================
// TABLAS GENERALES
// ============================================================

function renderizarTabla(
  id,
  registros,
  columnas,
  mensajeVacio,
  construirFila
) {

  const cuerpo =
    elemento(id);

  if (!cuerpo) {
    return;
  }


  if (!registros.length) {

    mostrarFilaVacia(
      id,
      columnas,
      mensajeVacio
    );

    return;
  }


  cuerpo.replaceChildren();


  registros.forEach(
    function(registro) {

      const fila =
        document.createElement('tr');


      construirFila(
        registro,
        fila
      );


      cuerpo.appendChild(fila);
    }
  );
}


// ============================================================
// REPORTES
// ============================================================

function renderizarReportes() {

  renderizarTabla(

    'cuerpoTablaReportesPadresPrueba',

    EXPEDIENTE_PADRES.reportes,

    7,

    'No existen reportes escolares registrados.',

    function(item, fila) {

      fila.appendChild(
        crearCelda(
          formatearFecha(
            primerValor(
              item,
              [
                'fecha',
                'fechaReporte',
                'FECHA'
              ]
            )
          )
        )
      );


      fila.appendChild(
        crearCelda(
          formatearHora(
            primerValor(
              item,
              [
                'hora',
                'horaReporte',
                'HORA'
              ]
            )
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'tipo',
              'tipoReporte',
              'TIPO'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'docente',
              'registradoPor',
              'responsable',
              'DOCENTE'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'descripcion',
              'motivo',
              'detalle',
              'DESCRIPCION'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'accionTomada',
              'accion',
              'medida',
              'ACCION_TOMADA'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'estatus',
              'estado',
              'ESTATUS'
            ]
          )
        )
      );
    }
  );
}


// ============================================================
// JUSTIFICANTES
// ============================================================

function renderizarJustificantes() {

  renderizarTabla(

    'cuerpoTablaJustificantesPadresPrueba',

    EXPEDIENTE_PADRES.justificantes,

    4,

    'No existen justificantes registrados.',

    function(item, fila) {

      let tipo =
        primerValor(
          item,
          [
            'tipo',
            'tipoJustificante',
            'TIPO'
          ]
        );


      let solicita =
        primerValor(
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


      fila.appendChild(
        crearCelda(
          formatearFecha(
            primerValor(
              item,
              [
                'fecha',
                'fechaJustificante',
                'FECHA'
              ]
            )
          )
        )
      );


      fila.appendChild(
        crearCelda(tipo)
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'motivo',
              'descripcion',
              'MOTIVO'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(solicita)
      );
    }
  );
}


// ============================================================
// CITATORIOS
// ============================================================

function renderizarCitatorios() {

  renderizarTabla(

    'cuerpoTablaCitatoriosPadresPrueba',

    EXPEDIENTE_PADRES.citatorios,

    5,

    'No existen citatorios registrados.',

    function(item, fila) {

      fila.appendChild(
        crearCelda(
          formatearFecha(
            primerValor(
              item,
              [
                'fechaCitatorio',
                'fecha',
                'FECHA_CITATORIO'
              ]
            )
          )
        )
      );


      fila.appendChild(
        crearCelda(
          formatearHora(
            primerValor(
              item,
              [
                'horaCitatorio',
                'hora',
                'HORA_CITATORIO'
              ]
            )
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'motivo',
              'descripcion',
              'MOTIVO'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'responsable',
              'registradoPor',
              'RESPONSABLE'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'seguimiento',
              'estatus',
              'observaciones',
              'SEGUIMIENTO'
            ]
          )
        )
      );
    }
  );
}


// ============================================================
// CALIFICACIONES
// ============================================================

function renderizarCalificaciones() {

  const materias =
    EXPEDIENTE_PADRES
      .calificaciones
      .materias;


  renderizarTabla(

    'cuerpoTablaCalificacionesPadresPrueba',

    materias,

    6,

    'No existen calificaciones registradas.',

    function(item, fila) {

      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'materia',
              'Materia',
              'MATERIA'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          formatearCalificacion(
            primerValor(
              item,
              [
                'p1',
                'periodo1',
                'primerPeriodo'
              ]
            )
          )
        )
      );


      fila.appendChild(
        crearCelda(
          formatearCalificacion(
            primerValor(
              item,
              [
                'p2',
                'periodo2',
                'segundoPeriodo'
              ]
            )
          )
        )
      );


      fila.appendChild(
        crearCelda(
          formatearCalificacion(
            primerValor(
              item,
              [
                'p3',
                'periodo3',
                'tercerPeriodo'
              ]
            )
          )
        )
      );


      fila.appendChild(
        crearCelda(
          formatearCalificacion(
            primerValor(
              item,
              [
                'promedio',
                'promedioFinal'
              ]
            )
          ),
          'celda-promedio-padres-prueba'
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'situacion',
              'estado',
              'estatus'
            ],
            'Sin calificar'
          ),
          'celda-situacion-padres-prueba'
        )
      );
    }
  );


  const promedio =
    elemento(
      'promedioGeneralPadresPrueba'
    );


  if (promedio) {

    promedio.textContent =
      EXPEDIENTE_PADRES
        .calificaciones
        .promedioGeneral > 0

        ? formatearCalificacion(
            EXPEDIENTE_PADRES
              .calificaciones
              .promedioGeneral
          )

        : '—';
  }
}


// ============================================================
// PASES DE SALIDA
// ============================================================

function renderizarPasesSalida() {

  renderizarTabla(

    'cuerpoTablaPasesSalidaPadresPrueba',

    EXPEDIENTE_PADRES.pasesSalida,

    6,

    'No existen pases de salida registrados.',

    function(item, fila) {

      fila.appendChild(
        crearCelda(
          formatearFecha(
            primerValor(
              item,
              [
                'fecha',
                'FECHA'
              ]
            )
          )
        )
      );


      fila.appendChild(
        crearCelda(
          formatearHora(
            primerValor(
              item,
              [
                'hora',
                'HORA'
              ]
            )
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'motivo',
              'descripcion',
              'MOTIVO'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'persona',
              'autorizadoPor',
              'responsable',
              'NOMBRE_AUTORIZA'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'horaSalida',
              'HORA_SALIDA'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'estatus',
              'estado',
              'ESTATUS'
            ]
          )
        )
      );
    }
  );
}


// ============================================================
// SEGUIMIENTO TUTORIAL
// ============================================================

function renderizarSeguimientos() {

  renderizarTabla(

    'cuerpoTablaSeguimientoPadresPrueba',

    EXPEDIENTE_PADRES.seguimientos,

    6,

    'No existen registros de seguimiento tutorial.',

    function(item, fila) {

      fila.appendChild(
        crearCelda(
          formatearFecha(
            primerValor(
              item,
              [
                'fecha',
                'FECHA'
              ]
            )
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'tipo',
              'tipoSeguimiento',
              'TIPO'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'motivo',
              'descripcion',
              'MOTIVO'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'responsable',
              'docente',
              'RESPONSABLE'
            ]
          )
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'proximoSeguimiento',
              'fechaProxima',
              'FECHA_PROXIMA'
            ]
          )
            ? formatearFecha(
                primerValor(
                  item,
                  [
                    'proximoSeguimiento',
                    'fechaProxima',
                    'FECHA_PROXIMA'
                  ]
                )
              )
            : '—'
        )
      );


      fila.appendChild(
        crearCelda(
          primerValor(
            item,
            [
              'estatus',
              'estado',
              'ESTATUS'
            ]
          )
        )
      );
    }
  );
}


// ============================================================
// RIESGO
// ============================================================

function renderizarRiesgo() {

  const riesgo =
    EXPEDIENTE_PADRES.riesgo;


  const tarjeta =
    elemento(
      'tarjetaRiesgoPadresPrueba'
    );

  const nivel =
    elemento(
      'nivelRiesgoPadresPrueba'
    );

  const puntaje =
    elemento(
      'puntajeRiesgoPadresPrueba'
    );

  const lista =
    elemento(
      'listaMotivosRiesgoPadresPrueba'
    );


  if (nivel) {
    nivel.textContent =
      riesgo.nivel;
  }


  if (puntaje) {
    puntaje.textContent =
      String(
        riesgo.puntaje
      );
  }


  if (tarjeta) {

    tarjeta.className =
      'tarjeta-riesgo-padres-prueba';


    tarjeta.classList.add(

      riesgo.nivel.includes('ALTO')
        ? 'riesgo-alto'

        : riesgo.nivel.includes('MEDIO')
          ? 'riesgo-medio'

          : riesgo.nivel.includes('BAJO')
            ? 'riesgo-bajo'

            : 'riesgo-sin-riesgo'
    );
  }


  if (lista) {

    lista.replaceChildren();


    const motivos =
      riesgo.motivos.length

        ? riesgo.motivos

        : [
            riesgo.nivel.includes(
              'SIN RIESGO'
            )
              ? 'No se identificaron factores de riesgo.'
              : 'No se recibieron factores detallados.'
          ];


    motivos.forEach(
      function(motivo) {

        const item =
          document.createElement('li');


        item.textContent =

          typeof motivo === 'object'

            ? texto(
                primerValor(
                  motivo,
                  [
                    'motivo',
                    'descripcion',
                    'texto'
                  ]
                )
              )

            : texto(
                motivo
              );


        lista.appendChild(item);
      }
    );
  }


  const indicadores =
    riesgo.indicadores || {};


  const inasistencias =
    elemento(
      'indicadorInasistenciasPadresPrueba'
    );

  const reportes =
    elemento(
      'indicadorReportesRiesgoPadresPrueba'
    );

  const citatorios =
    elemento(
      'indicadorCitatoriosRiesgoPadresPrueba'
    );

  const pases =
    elemento(
      'indicadorPasesRiesgoPadresPrueba'
    );


  if (inasistencias) {
    inasistencias.textContent =
      numero(
        indicadores.inasistencias,
        EXPEDIENTE_PADRES.asistencia.faltas
      );
  }

  if (reportes) {
    reportes.textContent =
      numero(
        indicadores.reportes,
        EXPEDIENTE_PADRES.reportes.length
      );
  }

  if (citatorios) {
    citatorios.textContent =
      numero(
        indicadores.citatorios,
        EXPEDIENTE_PADRES.citatorios.length
      );
  }

  if (pases) {
    pases.textContent =
      numero(
        indicadores.pasesSalida,
        EXPEDIENTE_PADRES.pasesSalida.length
      );
  }
}


// ============================================================
// PERFIL
// ============================================================

function renderizarPerfil() {

  const perfil =
    EXPEDIENTE_PADRES;


  const alumno =
    elemento(
      'perfilAlumnoPadresPrueba'
    );

  const gradoGrupo =
    elemento(
      'perfilGrupoPadresPrueba'
    );

  const tutor =
    elemento(
      'perfilTutorPadresPrueba'
    );

  const telefono =
    elemento(
      'telefonoTutorPadresPrueba'
    );

  const correo =
    elemento(
      'correoTutorPadresPrueba'
    );


  if (alumno) {

    alumno.textContent =
      texto(
        perfil.alumno.nombre
      );
  }


  if (gradoGrupo) {

    gradoGrupo.textContent =
      [
        perfil.alumno.grado,
        perfil.alumno.grupo
      ]
        .filter(Boolean)
        .join(' · ') || '—';
  }


  if (tutor) {

    tutor.textContent =
      texto(
        perfil.tutor.nombre
      );
  }


  if (telefono) {

    telefono.value =
      perfil.tutor.telefono === '—'
        ? ''
        : perfil.tutor.telefono;
  }


  if (correo) {

    correo.value =
      perfil.tutor.correo === '—'
        ? ''
        : perfil.tutor.correo;
  }
}


// ============================================================
// MOSTRAR / OCULTAR PORTAL
// ============================================================

function mostrarPortal() {

  ocultarCambioPassword();
  ocultarRecuperacion();

  mostrarEncabezadoPublico(false);
  mostrarBotonRecuperacion(false);


  const login =
    elemento(
      'formLoginPadresPrueba'
    );

  const panel =
    elemento(
      'panelPadresPrueba'
    );


  if (login) {
    login.hidden =
      true;
  }

  if (panel) {
    panel.hidden =
      false;
  }


  mostrarModulo(
    'resumen'
  );
}


function ocultarPortal() {

  const login =
    elemento(
      'formLoginPadresPrueba'
    );

  const panel =
    elemento(
      'panelPadresPrueba'
    );


  if (login) {
    login.hidden =
      false;
  }

  if (panel) {
    panel.hidden =
      true;
  }


  mostrarEncabezadoPublico(true);
  mostrarBotonRecuperacion(true);


  limpiarPortal();
}


function limpiarPortal() {

  EXPEDIENTE_PADRES =
    null;


  const campos =
    [
      'nombreAlumnoPadresPrueba',
      'gradoAlumnoPadresPrueba',
      'grupoAlumnoPadresPrueba',
      'cicloEscolarPadresPrueba'
    ];


  campos.forEach(
    function(id) {

      const campo =
        elemento(id);

      if (campo) {
        campo.textContent =
          '—';
      }
    }
  );


  [
    'cuerpoTablaAsistenciaPadresPrueba',
    'cuerpoTablaReportesPadresPrueba',
    'cuerpoTablaJustificantesPadresPrueba',
    'cuerpoTablaCitatoriosPadresPrueba',
    'cuerpoTablaCalificacionesPadresPrueba',
    'cuerpoTablaPasesSalidaPadresPrueba',
    'cuerpoTablaSeguimientoPadresPrueba'
  ].forEach(
    function(id) {

      const cuerpo =
        elemento(id);

      if (cuerpo) {
        cuerpo.replaceChildren();
      }
    }
  );


  const riesgo =
    elemento(
      'nivelRiesgoPadresPrueba'
    );

  if (riesgo) {
    riesgo.textContent =
      'Sin consultar';
  }


  const puntaje =
    elemento(
      'puntajeRiesgoPadresPrueba'
    );

  if (puntaje) {
    puntaje.textContent =
      '0';
  }


  [
    'telefonoTutorPadresPrueba',
    'correoTutorPadresPrueba',
    'passwordActualPerfilPadresPrueba'
  ].forEach(
    function(id) {

      const campo =
        elemento(id);

      if (campo) {
        campo.value =
          '';
      }
    }
  );
}


// ============================================================
// NAVEGACIÓN
// ============================================================

function mostrarModulo(
  nombre
) {

  document
    .querySelectorAll(
      '[data-vista-padres]'
    )
    .forEach(
      function(vista) {

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
      function(boton) {

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


  MODULO_ACTUAL_PADRES =
    nombre;
}


// ============================================================
// ACTUALIZAR EXPEDIENTE
// ============================================================

async function actualizarExpediente() {

  await cargarExpedienteCompleto(
    true
  );
}


// ============================================================
// CAMBIO DE CONTRASEÑA INICIAL
// ============================================================

async function cambiarPasswordInicial(
  evento
) {

  evento.preventDefault();


  const token =
    obtenerToken();


  if (!token) {

    cerrarPortalPorSesionInvalida();

    return;
  }


  const nuevo =
    String(
      elemento(
        'nuevoPasswordInicialPadresPrueba'
      )?.value || ''
    ).trim();


  const confirmar =
    String(
      elemento(
        'confirmarPasswordInicialPadresPrueba'
      )?.value || ''
    ).trim();


  const boton =
    elemento(
      'btnCambiarPasswordInicialPadresPrueba'
    );


  if (
    !nuevo ||
    !confirmar
  ) {

    mostrarMensaje(
      'mensajeCambioPasswordPadresPrueba',
      'Escribe y confirma la nueva contraseña.',
      'info'
    );

    return;
  }


  if (
    nuevo.length < 6
  ) {

    mostrarMensaje(
      'mensajeCambioPasswordPadresPrueba',
      'La contraseña debe tener al menos 6 caracteres.',
      'error'
    );

    return;
  }


  if (
    nuevo !== confirmar
  ) {

    mostrarMensaje(
      'mensajeCambioPasswordPadresPrueba',
      'Las contraseñas no coinciden.',
      'error'
    );

    return;
  }


  if (
    nuevo.toLowerCase() ===
    'escuela'
  ) {

    mostrarMensaje(
      'mensajeCambioPasswordPadresPrueba',
      'La nueva contraseña debe ser diferente de la contraseña inicial.',
      'error'
    );

    return;
  }


  cambiarBoton(
    boton,
    true,
    'Guardando...',
    'Guardar nueva contraseña'
  );


  try {

    const datos =
      await enviarPost({

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
        sesionInvalida(
          datos
        )
      ) {

        cerrarPortalPorSesionInvalida(
          datos.mensaje
        );

        return;
      }


      throw new Error(
        datos.mensaje ||
        'No fue posible actualizar la contraseña.'
      );
    }


    if (
      !datos.token
    ) {

      throw new Error(
        'El servidor no devolvió el nuevo token de sesión.'
      );
    }


    sessionStorage.setItem(
      CLAVE_TOKEN_PADRES,
      datos.token
    );


    ocultarCambioPassword();

    await cargarExpedienteCompleto(
      true
    );


  } catch (error) {

    console.error(error);

    mostrarMensaje(
      'mensajeCambioPasswordPadresPrueba',
      error.message ||
        'No fue posible actualizar la contraseña.',
      'error'
    );


  } finally {

    cambiarBoton(
      boton,
      false,
      'Guardando...',
      'Guardar nueva contraseña'
    );
  }
}


// ============================================================
// RECUPERACIÓN
// ============================================================

async function solicitarCodigoRecuperacion(
  evento
) {

  evento.preventDefault();


  const uid =
    String(
      elemento(
        'uidRecuperacionPadresPrueba'
      )?.value || ''
    ).trim();


  const boton =
    elemento(
      'btnSolicitarCodigoPadresPrueba'
    );


  if (!uid) {

    mostrarMensaje(
      'mensajeSolicitarRecuperacionPadresPrueba',
      'Escribe el UID del alumno.',
      'info'
    );

    return;
  }


  cambiarBoton(
    boton,
    true,
    'Enviando...',
    'Enviar código'
  );


  try {

    const datos =
      await enviarPost({

        accion:
          'solicitarCodigoRecuperacionPadre',

        uid:
          uid
      });


    if (
      !datos.success
    ) {

      throw new Error(
        datos.mensaje ||
        'No fue posible procesar la solicitud.'
      );
    }


    sessionStorage.setItem(
      CLAVE_UID_RECUPERACION,
      uid
    );


    mostrarRestablecimientoRecuperacion();


    mostrarMensaje(
      'mensajeRestablecerPasswordPadresPrueba',
      datos.mensaje ||
        'Revisa el correo registrado y escribe el código recibido.',
      'exito'
    );


  } catch (error) {

    console.error(error);

    mostrarMensaje(
      'mensajeSolicitarRecuperacionPadresPrueba',
      error.message ||
        'No fue posible conectar con el servidor.',
      'error'
    );


  } finally {

    cambiarBoton(
      boton,
      false,
      'Enviando...',
      'Enviar código'
    );
  }
}


async function reenviarCodigoRecuperacion() {

  const uid =
    sessionStorage.getItem(
      CLAVE_UID_RECUPERACION
    );


  const boton =
    elemento(
      'btnReenviarCodigoPadresPrueba'
    );


  if (!uid) {

    mostrarSolicitudRecuperacion();

    return;
  }


  cambiarBoton(
    boton,
    true,
    'Enviando...',
    'Enviar otro código'
  );


  try {

    const datos =
      await enviarPost({

        accion:
          'solicitarCodigoRecuperacionPadre',

        uid:
          uid
      });


    mostrarMensaje(
      'mensajeRestablecerPasswordPadresPrueba',
      datos.mensaje ||
        (
          datos.success
            ? 'Solicitud procesada. Revisa nuevamente el correo.'
            : 'No fue posible procesar la solicitud.'
        ),
      datos.success
        ? 'exito'
        : 'error'
    );


  } catch (error) {

    console.error(error);

    mostrarMensaje(
      'mensajeRestablecerPasswordPadresPrueba',
      error.message ||
        'No fue posible conectar con el servidor.',
      'error'
    );


  } finally {

    cambiarBoton(
      boton,
      false,
      'Enviando...',
      'Enviar otro código'
    );
  }
}


async function restablecerPassword(
  evento
) {

  evento.preventDefault();


  const uid =
    sessionStorage.getItem(
      CLAVE_UID_RECUPERACION
    );


  const codigo =
    String(
      elemento(
        'codigoRecuperacionPadresPrueba'
      )?.value || ''
    ).replace(
      /\D/g,
      ''
    );


  const nueva =
    String(
      elemento(
        'nuevoPasswordRecuperacionPadresPrueba'
      )?.value || ''
    ).trim();


  const confirmar =
    String(
      elemento(
        'confirmarPasswordRecuperacionPadresPrueba'
      )?.value || ''
    ).trim();


  const boton =
    elemento(
      'btnRestablecerPasswordPadresPrueba'
    );


  if (!uid) {

    mostrarSolicitudRecuperacion();

    return;
  }


  if (
    codigo.length !== 6
  ) {

    mostrarMensaje(
      'mensajeRestablecerPasswordPadresPrueba',
      'El código debe contener exactamente seis dígitos.',
      'error'
    );

    return;
  }


  if (
    nueva.length < 8
  ) {

    mostrarMensaje(
      'mensajeRestablecerPasswordPadresPrueba',
      'La nueva contraseña debe contener al menos 8 caracteres.',
      'error'
    );

    return;
  }


  if (
    nueva.length > 64
  ) {

    mostrarMensaje(
      'mensajeRestablecerPasswordPadresPrueba',
      'La nueva contraseña es demasiado larga.',
      'error'
    );

    return;
  }


  if (
    nueva !== confirmar
  ) {

    mostrarMensaje(
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

    mostrarMensaje(
      'mensajeRestablecerPasswordPadresPrueba',
      'La nueva contraseña no puede ser la contraseña inicial.',
      'error'
    );

    return;
  }


  cambiarBoton(
    boton,
    true,
    'Cambiando...',
    'Cambiar contraseña'
  );


  try {

    const datos =
      await enviarPost({

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

      throw new Error(
        datos.mensaje ||
        'No fue posible restablecer la contraseña.'
      );
    }


    sessionStorage.removeItem(
      CLAVE_UID_RECUPERACION
    );


    ocultarPortal();


    const campoUID =
      elemento(
        'uidPadresPrueba'
      );

    if (campoUID) {
      campoUID.value =
        uid;
    }


    mostrarMensaje(
      'mensajePadresPrueba',
      datos.mensaje ||
        'Contraseña restablecida correctamente. Ya puedes iniciar sesión.',
      'exito'
    );


  } catch (error) {

    console.error(error);

    mostrarMensaje(
      'mensajeRestablecerPasswordPadresPrueba',
      error.message ||
        'No fue posible conectar con el servidor.',
      'error'
    );


  } finally {

    cambiarBoton(
      boton,
      false,
      'Cambiando...',
      'Cambiar contraseña'
    );
  }
}


// ============================================================
// ACTUALIZAR PERFIL
// ============================================================

async function actualizarPerfil(
  evento
) {

  evento.preventDefault();


  const token =
    obtenerToken();


  if (!token) {

    cerrarPortalPorSesionInvalida();

    return;
  }


  const telefono =
    String(
      elemento(
        'telefonoTutorPadresPrueba'
      )?.value || ''
    ).trim();


  const correo =
    String(
      elemento(
        'correoTutorPadresPrueba'
      )?.value || ''
    ).trim();


  const passwordActual =
    String(
      elemento(
        'passwordActualPerfilPadresPrueba'
      )?.value || ''
    );


  const boton =
    elemento(
      'btnGuardarPerfilPadresPrueba'
    );


  if (!passwordActual) {

    mostrarMensaje(
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

    mostrarMensaje(
      'mensajePerfilPadresPrueba',
      'El correo electrónico no tiene un formato válido.',
      'error'
    );

    return;
  }


  cambiarBoton(
    boton,
    true,
    'Guardando...',
    'Guardar datos de contacto'
  );


  try {

    const datos =
      await enviarPost({

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

        passwordActual:
          passwordActual
      });


    if (
      !datos.success
    ) {

      if (
        sesionInvalida(
          datos
        )
      ) {

        cerrarPortalPorSesionInvalida(
          datos.mensaje
        );

        return;
      }


      throw new Error(
        datos.mensaje ||
        'No fue posible actualizar los datos.'
      );
    }


    const passwordCampo =
      elemento(
        'passwordActualPerfilPadresPrueba'
      );

    if (passwordCampo) {
      passwordCampo.value =
        '';
    }


    await cargarExpedienteCompleto(
      true
    );


    mostrarModulo(
      'perfil'
    );


    mostrarMensaje(
      'mensajePerfilPadresPrueba',
      datos.mensaje ||
        'Los datos de contacto se actualizaron correctamente.',
      'exito'
    );


  } catch (error) {

    console.error(error);

    mostrarMensaje(
      'mensajePerfilPadresPrueba',
      error.message ||
        'No fue posible actualizar los datos.',
      'error'
    );


  } finally {

    cambiarBoton(
      boton,
      false,
      'Guardando...',
      'Guardar datos de contacto'
    );
  }
}


// ============================================================
// CERRAR SESIÓN
// ============================================================

async function cerrarSesion() {

  const token =
    obtenerToken();


  const boton =
    elemento(
      'btnCerrarSesionPadresPrueba'
    );


  cambiarBoton(
    boton,
    true,
    'Cerrando sesión...',
    'Cerrar sesión'
  );


  try {

    if (token) {

      await enviarPost({

        accion:
          'cerrarSesionPadres',

        token:
          token
      });
    }


  } catch (error) {

    console.error(error);


  } finally {

    eliminarSesionLocal();

    ocultarPortal();


    mostrarMensaje(
      'mensajePadresPrueba',
      'Sesión cerrada correctamente.',
      'exito'
    );


    cambiarBoton(
      boton,
      false,
      'Cerrando sesión...',
      'Cerrar sesión'
    );
  }
}


// ============================================================
// VALIDAR / RESTAURAR SESIÓN
// ============================================================

async function restaurarSesion() {

  const token =
    obtenerToken();


  if (!token) {

    ocultarPortal();

    return;
  }


  mostrarMensaje(
    'mensajePadresPrueba',
    'Verificando la sesión...',
    'info'
  );


  try {

    const validacion =
      await enviarPost({

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


    // ========================================================
    // SI DEBE CAMBIAR CONTRASEÑA
    // ========================================================

    if (
      validacion.requiereCambioPassword
    ) {

      mostrarCambioPassword(
        validacion
      );

      return;
    }


    // ========================================================
    // MOSTRAR PORTAL
    // ========================================================

    mostrarPortal();


    // ========================================================
    // CARGAR EXPEDIENTE COMPLETO
    // ========================================================

    const cargado =
      await cargarExpedienteCompleto(false);


    if (!cargado) {

      throw new Error(
        'No fue posible cargar el expediente escolar.'
      );
    }


    mostrarMensaje(
      'mensajePadresPrueba',
      'Sesión restaurada correctamente.',
      'exito'
    );


  } catch (error) {

    console.error(error);

    eliminarSesionLocal();

    ocultarPortal();

    mostrarMensaje(
      'mensajePadresPrueba',
      'La sesión terminó. Ingresa nuevamente.',
      'info'
    );
  }
}


// ============================================================
// EVENTOS
// ============================================================

document.addEventListener(
  'DOMContentLoaded',
  function() {


    // LOGIN
    const formularioLogin =
      elemento(
        'formLoginPadresPrueba'
      );

    if (formularioLogin) {

      formularioLogin.addEventListener(
        'submit',
        iniciarSesion
      );
    }


    // CERRAR SESIÓN
    const cerrar =
      elemento(
        'btnCerrarSesionPadresPrueba'
      );

    if (cerrar) {

      cerrar.addEventListener(
        'click',
        cerrarSesion
      );
    }


    // CAMBIO PASSWORD
    const formularioCambio =
      elemento(
        'formCambioPasswordPadresPrueba'
      );

    if (formularioCambio) {

      formularioCambio.addEventListener(
        'submit',
        cambiarPasswordInicial
      );
    }


    // RECUPERACIÓN
    const mostrarRecuperacion =
      elemento(
        'btnMostrarRecuperacionPadresPrueba'
      );

    if (mostrarRecuperacion) {

      mostrarRecuperacion.addEventListener(
        'click',
        mostrarSolicitudRecuperacion
      );
    }


    const formularioSolicitar =
      elemento(
        'formSolicitarRecuperacionPadresPrueba'
      );

    if (formularioSolicitar) {

      formularioSolicitar.addEventListener(
        'submit',
        solicitarCodigoRecuperacion
      );
    }


    const formularioRestablecer =
      elemento(
        'formRestablecerPasswordPadresPrueba'
      );

    if (formularioRestablecer) {

      formularioRestablecer.addEventListener(
        'submit',
        restablecerPassword
      );
    }


    const reenviar =
      elemento(
        'btnReenviarCodigoPadresPrueba'
      );

    if (reenviar) {

      reenviar.addEventListener(
        'click',
        reenviarCodigoRecuperacion
      );
    }


    const cancelar =
      elemento(
        'btnCancelarRecuperacionPadresPrueba'
      );

    if (cancelar) {

      cancelar.addEventListener(
        'click',
        function() {

          sessionStorage.removeItem(
            CLAVE_UID_RECUPERACION
          );

          ocultarPortal();

          mostrarMensaje(
            'mensajePadresPrueba',
            '',
            'info'
          );
        }
      );
    }


    const volverLogin =
      elemento(
        'btnVolverLoginDesdeRecuperacionPadresPrueba'
      );

    if (volverLogin) {

      volverLogin.addEventListener(
        'click',
        function() {

          sessionStorage.removeItem(
            CLAVE_UID_RECUPERACION
          );

          ocultarPortal();
        }
      );
    }


    // PERFIL
    const formularioPerfil =
      elemento(
        'formActualizarPerfilPadresPrueba'
      );

    if (formularioPerfil) {

      formularioPerfil.addEventListener(
        'submit',
        actualizarPerfil
      );
    }


    // ACTUALIZAR EXPEDIENTE
    const actualizar =
      elemento(
        'btnActualizarExpedientePadresPrueba'
      );

    if (actualizar) {

      actualizar.addEventListener(
        'click',
        actualizarExpediente
      );
    }


    // MENÚ
    document
      .querySelectorAll(
        '[data-modulo-padres]'
      )
      .forEach(
        function(boton) {

          boton.addEventListener(
            'click',
            function() {

              mostrarModulo(
                boton.dataset.moduloPadres
              );
            }
          );
        }
      );


    // BOTONES ACTUALIZAR DE LOS MÓDULOS
    //
    // Todos utilizan el mismo expediente completo.
    document
      .querySelectorAll(
        '[data-actualizar-expediente]'
      )
      .forEach(
        function(boton) {

          boton.addEventListener(
            'click',
            actualizarExpediente
          );
        }
      );


    // ESTADO INICIAL
    ocultarPortal();


    // RESTAURAR SESIÓN
    restaurarSesion();

  }
);
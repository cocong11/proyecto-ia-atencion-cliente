function obtenerNumero(id) {
  return Number(document.getElementById(id).value);
}

function obtenerTexto(id) {
  return document.getElementById(id).value.trim();
}

function mostrarError(mensaje) {
  const error = document.getElementById("mensajeError");
  error.textContent = mensaje;
  error.style.display = "block";
}

function limpiarError() {
  const error = document.getElementById("mensajeError");
  error.textContent = "";
  error.style.display = "none";
}

function validarCamposNumericos() {
  const campos = [
    "ticketsMensuales",
    "consultasPorTicket",
    "tokensEntrada",
    "tokensSalida",
    "tiempoActual",
    "tiempoEsperado",
    "costeHora"
  ];

  for (const campo of campos) {
    const elemento = document.getElementById(campo);
    const valor = elemento.value;

    if (valor === "") {
      mostrarError("Todos los campos numéricos son obligatorios.");
      elemento.focus();
      return false;
    }

    if (isNaN(Number(valor))) {
      mostrarError("Introduce solo números válidos.");
      elemento.focus();
      return false;
    }

    if (Number(valor) < 0) {
      mostrarError("Los valores no pueden ser negativos.");
      elemento.focus();
      return false;
    }
  }

  const tiempoActual = obtenerNumero("tiempoActual");
  const tiempoEsperado = obtenerNumero("tiempoEsperado");

  if (tiempoEsperado > tiempoActual) {
    mostrarError("Revisa los tiempos: el tiempo esperado con IA es mayor que el tiempo actual.");
    return false;
  }

  limpiarError();
  return true;
}

function calcularConsultasMensuales(ticketsMensuales, consultasPorTicket) {
  return ticketsMensuales * consultasPorTicket;
}

function calcularTokensEntrada(consultasMensuales, tokensEntradaPorConsulta) {
  return consultasMensuales * tokensEntradaPorConsulta;
}

function calcularTokensSalida(consultasMensuales, tokensSalidaPorConsulta) {
  return consultasMensuales * tokensSalidaPorConsulta;
}

function calcularAhorroBruto(ticketsMensuales, tiempoActual, tiempoEsperado, costeHora) {
  const minutosAhorrados = ticketsMensuales * (tiempoActual - tiempoEsperado);
  const horasAhorradas = minutosAhorrados / 60;
  const ahorroBruto = horasAhorradas * costeHora;

  return {
    minutosAhorrados,
    horasAhorradas,
    ahorroBruto
  };
}

function formatearNumero(valor) {
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 2
  }).format(valor);
}

function formatearEuros(valor) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2
  }).format(valor);
}

function calcularResultados() {
  if (!validarCamposNumericos()) {
    return null;
  }

  const ticketsMensuales = obtenerNumero("ticketsMensuales");
  const consultasPorTicket = obtenerNumero("consultasPorTicket");
  const tokensEntrada = obtenerNumero("tokensEntrada");
  const tokensSalida = obtenerNumero("tokensSalida");
  const tiempoActual = obtenerNumero("tiempoActual");
  const tiempoEsperado = obtenerNumero("tiempoEsperado");
  const costeHora = obtenerNumero("costeHora");

  const consultasMensuales = calcularConsultasMensuales(ticketsMensuales, consultasPorTicket);
  const tokensEntradaMensuales = calcularTokensEntrada(consultasMensuales, tokensEntrada);
  const tokensSalidaMensuales = calcularTokensSalida(consultasMensuales, tokensSalida);
  const ahorro = calcularAhorroBruto(ticketsMensuales, tiempoActual, tiempoEsperado, costeHora);

  document.getElementById("resultadoConsultas").textContent = formatearNumero(consultasMensuales);
  document.getElementById("resultadoTokensEntrada").textContent = formatearNumero(tokensEntradaMensuales);
  document.getElementById("resultadoTokensSalida").textContent = formatearNumero(tokensSalidaMensuales);
  document.getElementById("resultadoMinutos").textContent = formatearNumero(ahorro.minutosAhorrados) + " min";
  document.getElementById("resultadoHoras").textContent = formatearNumero(ahorro.horasAhorradas) + " h";
  document.getElementById("resultadoAhorro").textContent = formatearEuros(ahorro.ahorroBruto);

  return {
    ticketsMensuales,
    consultasPorTicket,
    tokensEntrada,
    tokensSalida,
    tiempoActual,
    tiempoEsperado,
    costeHora,
    consultasMensuales,
    tokensEntradaMensuales,
    tokensSalidaMensuales,
    minutosAhorrados: ahorro.minutosAhorrados,
    horasAhorradas: ahorro.horasAhorradas,
    ahorroBruto: ahorro.ahorroBruto
  };
}

function generarResumen() {
  const resultados = calcularResultados();

  if (!resultados) {
    return;
  }

  const datosPersonales = document.getElementById("datosPersonales").value;
  const revisionHumana = document.getElementById("revisionHumana").value;
  const trazabilidad = document.getElementById("trazabilidad").value;

  const alternativa = document.getElementById("alternativa").value;
  const motivoDecision = obtenerTexto("motivoDecision");
  const riesgoPrincipal = obtenerTexto("riesgoPrincipal");
  const controlPropuesto = obtenerTexto("controlPropuesto");
  const metricaExito = obtenerTexto("metricaExito");

  const resumen = `
Resumen del análisis de integración de IA generativa en atención al cliente

1. Datos introducidos
- Tickets mensuales: ${formatearNumero(resultados.ticketsMensuales)}
- Consultas por ticket: ${formatearNumero(resultados.consultasPorTicket)}
- Tokens de entrada por consulta: ${formatearNumero(resultados.tokensEntrada)}
- Tokens de salida por consulta: ${formatearNumero(resultados.tokensSalida)}
- Tiempo actual por ticket: ${formatearNumero(resultados.tiempoActual)} minutos
- Tiempo esperado con IA: ${formatearNumero(resultados.tiempoEsperado)} minutos
- Coste hora del agente: ${formatearEuros(resultados.costeHora)}
- Datos personales: ${datosPersonales}
- Revisión humana: ${revisionHumana}
- Necesidad de trazabilidad: ${trazabilidad}

2. Resultados calculados
- Consultas mensuales estimadas: ${formatearNumero(resultados.consultasMensuales)}
- Tokens de entrada mensuales: ${formatearNumero(resultados.tokensEntradaMensuales)}
- Tokens de salida mensuales: ${formatearNumero(resultados.tokensSalidaMensuales)}
- Minutos ahorrados: ${formatearNumero(resultados.minutosAhorrados)}
- Horas ahorradas: ${formatearNumero(resultados.horasAhorradas)}
- Ahorro humano bruto estimado: ${formatearEuros(resultados.ahorroBruto)}

3. Comparación de alternativas
La API externa de IA puede ser más rápida de implantar y tener menor coste inicial, pero puede presentar más riesgos de dependencia del proveedor, trazabilidad, protección de datos y coste variable al escalar.

La plataforma cloud gestionada puede requerir mayor esfuerzo inicial, pero ofrece más control técnico, mejor trazabilidad, monitorización, seguridad y gobierno de la solución.

4. Mini-RAID
- Riesgo: ${obtenerTexto("raidRiesgoDesc")} Impacto: ${document.getElementById("raidRiesgoImpacto").value}. Acción: ${obtenerTexto("raidRiesgoAccion")}
- Supuesto: ${obtenerTexto("raidSupuestoDesc")} Impacto: ${document.getElementById("raidSupuestoImpacto").value}. Acción: ${obtenerTexto("raidSupuestoAccion")}
- Incidencia: ${obtenerTexto("raidIncidenciaDesc")} Impacto: ${document.getElementById("raidIncidenciaImpacto").value}. Acción: ${obtenerTexto("raidIncidenciaAccion")}
- Dependencia: ${obtenerTexto("raidDependenciaDesc")} Impacto: ${document.getElementById("raidDependenciaImpacto").value}. Acción: ${obtenerTexto("raidDependenciaAccion")}

5. Decisión final
Se recomienda la alternativa: ${alternativa}.

Motivo principal:
${motivoDecision}

Riesgo principal:
${riesgoPrincipal}

Control propuesto:
${controlPropuesto}

Métrica de éxito:
${metricaExito}

Advertencia:
Este análisis no debe incluir datos personales reales ni información confidencial.
`.trim();

  document.getElementById("resumenFinal").value = resumen;
}

function copiarResumen() {
  const resumen = document.getElementById("resumenFinal");
  const mensaje = document.getElementById("mensajeCopiado");

  if (resumen.value.trim() === "") {
    mensaje.textContent = "Primero genera el resumen.";
    mensaje.style.display = "block";
    return;
  }

  resumen.select();
  document.execCommand("copy");

  mensaje.textContent = "Resumen copiado correctamente.";
  mensaje.style.display = "block";
}

document.getElementById("btnCalcular").addEventListener("click", calcularResultados);
document.getElementById("btnResumen").addEventListener("click", generarResumen);
document.getElementById("btnCopiar").addEventListener("click", copiarResumen);

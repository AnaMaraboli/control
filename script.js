$(document).ready(function() {
    $("#verificacion-cumplimiento").show();

    // Manejo del formulario de verificación de cumplimiento
    $("#cumplimiento-form").on("submit", function(e) {
        e.preventDefault();
        const codigoEtica = $("#codigo-etica").val();
        const evaluacionRiesgos = $("#evaluacion-riesgos").val();

        if (codigoEtica === "si" && evaluacionRiesgos === "si") {
            $("#verificacion-cumplimiento").hide();
            $("#auditoria-form").show();
        } else {
            alert("Debe haber un código de ética y una evaluación de riesgos para continuar.");
        }
    });

    // Manejo del formulario de auditoría COSO
    $("#coso-form").on("submit", function(e) {
        e.preventDefault();

        let puntajes = [];
        const componentes = [
            'entorno_control_1', 'entorno_control_2',
            'evaluacion_riesgos_1', 'evaluacion_riesgos_2',
            'actividades_control_1', 'actividades_control_2',
            'informacion_comunicacion_1', 'informacion_comunicacion_2',
            'supervision_1', 'supervision_2'
        ];

        // Calcular puntajes
        componentes.forEach(function(componente) {
            const puntaje = parseInt($(`select[name="${componente}"]`).val());
            puntajes.push(puntaje);
        });

        const sumaPuntajes = puntajes.reduce((a, b) => a + b, 0);
        const promedio = (sumaPuntajes / puntajes.length).toFixed(2);
        let nivelCumplimiento;

        // Determinar el nivel de cumplimiento
        if (promedio >= 4.5) {
            nivelCumplimiento = "Alto";
        } else if (promedio >= 3.5) {
            nivelCumplimiento = "Satisfactorio";
        } else if (promedio >= 2.5) {
            nivelCumplimiento = "Medio";
        } else if (promedio >= 1.5) {
            nivelCumplimiento = "Bajo";
        } else {
            nivelCumplimiento = "Muy Bajo";
        }

        // Generar informe
        let informe = `<p>Nivel de Cumplimiento: <strong>${nivelCumplimiento}</strong></p>`;
        informe += `<p>Puntaje Promedio: <strong>${promedio}</strong></p>`;

        $("#resultados-contenido").html(informe);

        // Crear gráfico
        const ctx = document.getElementById('grafico').getContext('2d');
        const grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: componentes.map(c => c.replace(/_/g, ' ').replace(/(\d)/g, ' $1')),
                datasets: [{
                    label: 'Puntajes por Componente',
                    data: puntajes,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        $("#resultados-contenido").append("<br>");
        $("#auditoria-form").hide();
        $("#informe-resultados").show();
    });

    // Manejo del botón para nueva auditoría
    $("#nueva-auditoria").on("click", function() {
        $("#informe-resultados").hide();
        $("#verificacion-cumplimiento").show();
        $("#cumplimiento-form")[0].reset();
        $("#coso-form")[0].reset();
    });
});

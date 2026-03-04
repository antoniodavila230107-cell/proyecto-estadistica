/**
 * Práctica Individual: Web App de Probabilidad y Estadística
 * Este script contiene la lógica para cálculos estadísticos, 
 * generación de gráficos y operaciones probabilísticas. [cite: 1, 6]
 */

let myChart = null;

// --- GESTIÓN DE DATOS --- [cite: 12]

function procesarManual() {
    const input = document.getElementById('dataInput').value;
    const datos = input.split(',').map(Number).filter(n => !isNaN(n));
    if(datos.length < 20) return alert("Mínimo 20 datos requeridos según la rúbrica."); [cite: 12]
    ejecutarAnalisis(datos);
}

function generarAleatorios() {
    // Genera 20 números aleatorios entre 1 y 50 [cite: 12]
    const datos = Array.from({length: 20}, () => Math.floor(Math.random() * 50) + 1);
    document.getElementById('dataInput').value = datos.join(', ');
    ejecutarAnalisis(datos);
}

// --- CÁLCULOS ESTADÍSTICOS --- [cite: 13, 15]

function ejecutarAnalisis(datos) {
    datos.sort((a, b) => a - b);
    const n = datos.length;

    // Media, Mediana, Moda y Rango [cite: 13]
    const media = datos.reduce((a, b) => a + b) / n;
    const rango = Math.max(...datos) - Math.min(...datos);
    
    // Mediana
    const mitad = Math.floor(n / 2);
    const mediana = n % 2 !== 0 ? datos[mitad] : (datos[mitad - 1] + datos[mitad]) / 2;

    // Moda
    const frecs = {};
    datos.forEach(x => frecs[x] = (frecs[x] || 0) + 1);
    let maxFrec = 0;
    let modas = [];
    for(let x in frecs) {
        if(frecs[x] > maxFrec) { maxFrec = frecs[x]; modas = [x]; }
        else if(frecs[x] === maxFrec) { modas.push(x); }
    }

    // Actualizar UI de medidas [cite: 13]
    document.getElementById('resMedia').innerText = media.toFixed(2);
    document.getElementById('resMediana').innerText = mediana;
    document.getElementById('resModa').innerText = modas.join(', ');
    document.getElementById('resRango').innerText = rango;

    // TABLA DE FRECUENCIAS (fi, fr, Fi, Fr) [cite: 15]
    const tbody = document.querySelector('#tablaFrecuencias tbody');
    tbody.innerHTML = "";
    let Fi = 0;
    
    // Para el Pareto necesitamos las etiquetas ordenadas por frecuencia de mayor a menor [cite: 19]
    const labelsOrdenadasPareto = Object.keys(frecs).sort((a, b) => frecs[b] - frecs[a]);

    Object.keys(frecs).forEach(x => {
        let fi = frecs[x];
        let fr = fi / n;
        Fi += fi;
        let Fr = Fi / n;
        
        tbody.innerHTML += `<tr>
            <td>${x}</td>
            <td>${fi}</td>
            <td>${fr.toFixed(2)}</td>
            <td>${Fi}</td>
            <td>${Fr.toFixed(2)}</td>
        </tr>`;
    });

    renderGraficoMaestro(frecs, datos);
}

// --- GRÁFICOS (Pareto, Histograma, Ojiva) --- [cite: 16, 18, 19]

function renderGraficoMaestro(frecuencias, datosTotales) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    if(myChart) myChart.destroy();

    // Preparación para Diagrama de Pareto (Orden descendente) [cite: 19]
    const labelsPareto = Object.keys(frecuencias).sort((a, b) => frecuencias[b] - frecuencias[a]);
    const dataPareto = labelsPareto.map(l => frecuencias[l]);
    
    // Cálculo de Frecuencia Acumulada % para la Ojiva [cite: 18]
    let acumulado = 0;
    const total = datosTotales.length;
    const dataOjiva = dataPareto.map(v => {
        acumulado += v;
        return (acumulado / total) * 100;
    });

    myChart = new Chart(ctx, {
        data: {
            labels: labelsPareto,
            datasets: [
                {
                    type: 'bar',
                    label: 'Frecuencia (Histograma/Pareto)',
                    data: dataPareto,
                    backgroundColor: 'rgba(37, 99, 235, 0.6)',
                    order: 2
                },
                {
                    type: 'line',
                    label: 'Línea de Pareto / Ojiva (%)',
                    data: dataOjiva,
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    yAxisID: 'y-pct',
                    order: 1,
                    tension: 0.3
                }
            ]
        },
        options: {
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Frecuencia Absoluta' } },
                'y-pct': { position: 'right', max: 100, title: { display: true, text: 'Porcentaje %' } }
            }
        }
    });
}

// --- PROBABILIDAD Y CONJUNTO --- [cite: 20, 22, 23, 25]

function factorial(n) { return (n <= 1) ? 1 : n * factorial(n - 1); }

function calcularCombinatoria() {
    const n = parseInt(document.getElementById('nVal').value);
    const r = parseInt(document.getElementById('rVal').value);
    if(r > n) return alert("r no puede ser mayor que n");

    const nPr = factorial(n) / factorial(n - r); // Permutaciones [cite: 25]
    const nCr = nPr / factorial(r);              // Combinaciones [cite: 25]

    document.getElementById('resPerm').innerText = nPr;
    document.getElementById('resComb').innerText = nCr;
}

function calcularConjuntos() {
    const a = document.getElementById('conjuntoA').value.split(',').map(x => x.trim());
    const b = document.getElementById('conjuntoB').value.split(',').map(x => x.trim());
    const setA = new Set(a);
    const setB = new Set(b);

    const union = new Set([...setA, ...setB]);
    const inter = a.filter(x => setB.has(x));
    const dif = a.filter(x => !setB.has(x));

    document.getElementById('resUnion').innerText = `{ ${Array.from(union).join(', ')} }`;
    document.getElementById('resInter').innerText = `{ ${[...new Set(inter)].join(', ')} }`;
    document.getElementById('resDif').innerText = `{ ${[...new Set(dif)].join(', ')} }`;
}

function calcularProbabilidad() {
    const fav = parseFloat(document.getElementById('favorables').value);
    const tot = parseFloat(document.getElementById('totales').value);
    if(tot === 0) return;
    document.getElementById('resProb').innerText = ((fav/tot)*100).toFixed(2) + "%";
}

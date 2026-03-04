/**
 * Lógica funcional para la Web App de Probabilidad y Estadística.
 * Incluye cálculos descriptivos, gráficos dinámicos y probabilidad.
 */

let myChart = null;

// --- 1. GESTIÓN DE DATOS ---
function procesarManual() {
    const input = document.getElementById('dataInput').value;
    const datos = input.split(',').map(Number).filter(n => !isNaN(n));
    if(datos.length < 20) return alert("Error: Se requieren al menos 20 datos.");
    ejecutarAnalisis(datos);
}

function generarAleatorios() {
    const datos = Array.from({length: 20}, () => Math.floor(Math.random() * 100) + 1);
    document.getElementById('dataInput').value = datos.join(', ');
    ejecutarAnalisis(datos);
}

// --- 2. CÁLCULOS ESTADÍSTICOS Y TABLA ---
function ejecutarAnalisis(datos) {
    datos.sort((a, b) => a - b);
    const n = datos.length;

    // Media, Mediana y Rango
    const media = datos.reduce((a, b) => a + b) / n;
    const rango = Math.max(...datos) - Math.min(...datos);
    const mitad = Math.floor(n / 2);
    const mediana = n % 2 !== 0 ? datos[mitad] : (datos[mitad - 1] + datos[mitad]) / 2;

    // Moda
    const frecs = {};
    datos.forEach(x => frecs[x] = (frecs[x] || 0) + 1);
    let maxF = 0; let modas = [];
    for(let x in frecs) {
        if(frecs[x] > maxF) { maxF = frecs[x]; modas = [x]; }
        else if(frecs[x] === maxF) { modas.push(x); }
    }

    // Actualizar Interfaz
    document.getElementById('resMedia').innerText = media.toFixed(2);
    document.getElementById('resMediana').innerText = mediana;
    document.getElementById('resModa').innerText = modas.join(', ');
    document.getElementById('resRango').innerText = rango;

    // Generar Tabla de Frecuencias
    const tbody = document.querySelector('#tablaFrecuencias tbody');
    tbody.innerHTML = "";
    let Fi = 0;
    Object.keys(frecs).forEach(x => {
        let fi = frecs[x];
        let fr = fi / n;
        Fi += fi;
        tbody.innerHTML += `<tr><td>${x}</td><td>${fi}</td><td>${fr.toFixed(2)}</td><td>${Fi}</td><td>${(Fi/n).toFixed(2)}</td></tr>`;
    });

    renderGraficoPareto(frecs, datos);
}

// --- 3. GRÁFICOS (Histograma, Pareto y Ojiva combinados) ---
function renderGraficoPareto(frecuencias, datosTotales) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    if(myChart) myChart.destroy();

    const labels = Object.keys(frecuencias).sort((a, b) => frecuencias[b] - frecuencias[a]);
    const dataAbs = labels.map(l => frecuencias[l]);
    let ac = 0;
    const dataRelAc = dataAbs.map(v => { ac += v; return (ac / datosTotales.length) * 100; });

    myChart = new Chart(ctx, {
        data: {
            labels: labels,
            datasets: [
                { type: 'bar', label: 'Frecuencia (Pareto)', data: dataAbs, backgroundColor: '#2563eb' },
                { type: 'line', label: 'Ojiva (%)', data: dataRelAc, borderColor: '#ef4444', yAxisID: 'y2' }
            ]
        },
        options: { scales: { y2: { position: 'right', max: 100 } } }
    });
}

// --- 4. PROBABILIDAD, CONJUNTOS Y CONTEO ---
function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }

function calcularCombinatoria() {
    const n = parseInt(document.getElementById('nVal').value);
    const r = parseInt(document.getElementById('rVal').value);
    if(r > n) return alert("n debe ser mayor a r");
    const nPr = factorial(n) / factorial(n - r);
    document.getElementById('resPerm').innerText = nPr;
    document.getElementById('resComb').innerText = nPr / factorial(r);
}

function calcularConjuntos() {
    const a = document.getElementById('conjuntoA').value.split(',').map(s => s.trim());
    const b = document.getElementById('conjuntoB').value.split(',').map(s => s.trim());
    const setA = new Set(a); const setB = new Set(b);

    document.getElementById('resUnion').innerText = `{ ${[...new Set([...a, ...b])].join(', ')} }`;
    document.getElementById('resInter').innerText = `{ ${a.filter(x => setB.has(x)).join(', ')} }`;
    document.getElementById('resDif').innerText = `{ ${a.filter(x => !setB.has(x)).join(', ')} }`;
}

function calcularProbabilidad() {
    const f = parseFloat(document.getElementById('favorables').value);
    const t = parseFloat(document.getElementById('totales').value);
    document.getElementById('resProb').innerText = t > 0 ? ((f/t)*100).toFixed(2) + "%" : "0%";
}

// --- 5. REGLA MULTIPLICATIVA Y ÁRBOL ---
function calcularReglaMultiplicativa() {
    const pa = parseFloat(document.getElementById('probA').value) || 0;
    const pb_a = parseFloat(document.getElementById('probB').value) || 0;
    const res = pa * pb_a;

    document.getElementById('resMulti').innerText = res.toFixed(4);
    document.getElementById('treeVisual').innerHTML = 
        `Inicio\n` +
        ` ├── P(A): ${pa.toFixed(2)} ──┐\n` +
        ` │                   ├── P(B|A): ${pb_a.toFixed(2)}  => P(A∩B): ${res.toFixed(4)}\n` +
        ` │                   └── P(B'|A): ${(1-pb_a).toFixed(2)} => P(A∩B'): ${(pa*(1-pb_a)).toFixed(4)}\n` +
        ` └── P(A'): ${(1-pa).toFixed(2)}`;
}

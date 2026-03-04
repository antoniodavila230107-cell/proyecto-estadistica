// VERIFICACIÓN DE CARGA
document.getElementById('status').style.background = '#dcfce7';
document.getElementById('status').style.color = '#166534';
document.getElementById('status').innerText = '✅ Script Cargado Correctamente';

let myChart = null;

// --- FUNCIONES DE DATOS ---
function procesarManual() {
    const val = document.getElementById('dataInput').value;
    const datos = val.split(',').map(Number).filter(n => !isNaN(n));
    if (datos.length < 20) return alert("Se requieren mínimo 20 datos[cite: 12].");
    analizar(datos);
}

function generarAleatorios() {
    const datos = Array.from({length: 20}, () => Math.floor(Math.random() * 50) + 1);
    document.getElementById('dataInput').value = datos.join(', ');
    analizar(datos);
}

// --- LÓGICA ESTADÍSTICA ---
function analizar(datos) {
    datos.sort((a, b) => a - b);
    const n = datos.length;

    // Medidas [cite: 13, 32]
    const media = datos.reduce((a, b) => a + b) / n;
    const rango = Math.max(...datos) - Math.min(...datos);
    const mitad = Math.floor(n / 2);
    const mediana = n % 2 !== 0 ? datos[mitad] : (datos[mitad - 1] + datos[mitad]) / 2;

    document.getElementById('resMedia').innerText = media.toFixed(2);
    document.getElementById('resMediana').innerText = mediana;
    document.getElementById('resRango').innerText = rango;

    // Frecuencias [cite: 15, 32]
    const frec = {};
    datos.forEach(x => frec[x] = (frec[x] || 0) + 1);
    
    const tbody = document.querySelector('#tablaFrecuencias tbody');
    tbody.innerHTML = "";
    let Fi = 0;
    
    // Para Pareto (ordenar de mayor a menor frecuencia) [cite: 19]
    const labelsPareto = Object.keys(frec).sort((a,b) => frec[b] - frec[a]);
    
    Object.keys(frec).forEach(x => {
        let f = frec[x];
        Fi += f;
        tbody.innerHTML += `<tr><td>${x}</td><td>${f}</td><td>${(f/n).toFixed(2)}</td><td>${Fi}</td><td>${(Fi/n).toFixed(2)}</td></tr>`;
    });

    graficar(frec, datos, labelsPareto);
}

// --- GRÁFICOS COMBINADOS (30%) ---
function graficar(frec, datos, labels) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    if (myChart) myChart.destroy();

    const dataAbs = labels.map(l => frec[l]);
    let suma = 0;
    const dataAcum = dataAbs.map(v => { suma += v; return (suma / datos.length) * 100; });

    myChart = new Chart(ctx, {
        data: {
            labels: labels,
            datasets: [
                { type: 'bar', label: 'Histograma/Pareto', data: dataAbs, backgroundColor: '#3b82f6' },
                { type: 'line', label: 'Polígono/Ojiva (%)', data: dataAcum, borderColor: '#ef4444', yAxisID: 'y2' }
            ]
        },
        options: { scales: { y2: { position: 'right', max: 100 } } }
    });
}

// --- PROBABILIDAD Y CONTEO ---
function fact(n) { return n <= 1 ? 1 : n * fact(n - 1); }

function calcularCombinatoria() {
    const n = parseInt(document.getElementById('nVal').value);
    const r = parseInt(document.getElementById('rVal').value);
    if (r > n) return alert("n debe ser mayor que r");
    const p = fact(n) / fact(n - r);
    document.getElementById('resPerm').innerText = p;
    document.getElementById('resComb').innerText = p / fact(r);
}

function calcularConjuntos() {
    const a = document.getElementById('conjuntoA').value.split(',').map(x => x.trim());
    const b = document.getElementById('conjuntoB').value.split(',').map(x => x.trim());
    const inter = a.filter(x => b.includes(x));
    document.getElementById('resInter').innerText = `{ ${[...new Set(inter)].join(', ')} }`;
}

function calcularArbol() {
    const pa = parseFloat(document.getElementById('pA').value);
    const pba = parseFloat(document.getElementById('pBA').value);
    const res = pa * pba;
    document.getElementById('treeDisplay').innerText = 
        `Inicio\n └── P(A)=${pa}\n      └── P(B|A)=${pba} ==> P(A∩B)=${res.toFixed(3)}`;
}
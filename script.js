let myChart = null;

function procesarManual() {
    const input = document.getElementById('dataInput').value;
    const datos = input.split(',').map(Number).filter(n => !isNaN(n));
    if(datos.length < 20) return alert("Debes ingresar al menos 20 datos [cite: 11, 12]");
    ejecutarAnalisis(datos);
}

function generarAleatorios() {
    const datos = Array.from({length: 20}, () => Math.floor(Math.random() * 50) + 1);
    document.getElementById('dataInput').value = datos.join(', ');
    ejecutarAnalisis(datos);
}

function ejecutarAnalisis(datos) {
    datos.sort((a, b) => a - b);
    
    // 1. Medidas de Tendencia [cite: 13]
    const n = datos.length;
    const media = datos.reduce((a, b) => a + b) / n;
    const rango = Math.max(...datos) - Math.min(...datos);
    
    document.getElementById('resMedia').innerText = media.toFixed(2);
    document.getElementById('resRango').innerText = rango;

    // 2. Tabla de Frecuencias [cite: 15]
    const frecuencias = {};
    datos.forEach(x => frecuencias[x] = (frecuencias[x] || 0) + 1);
    
    const tbody = document.querySelector('#tablaFrecuencias tbody');
    tbody.innerHTML = "";
    
    let Fi = 0;
    Object.keys(frecuencias).forEach(x => {
        let fi = frecuencias[x];
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

    renderGrafico(frecuencias);
}

// 3. Permutaciones y Combinaciones [cite: 25]
function factorial(num) {
    if (num <= 1) return 1;
    return num * factorial(num - 1);
}

function calcularCombinatoria() {
    const n = parseInt(document.getElementById('nVal').value);
    const r = parseInt(document.getElementById('rVal').value);
    
    if(r > n) return alert("r no puede ser mayor que n");

    const nPr = factorial(n) / factorial(n - r);
    const nCr = nPr / factorial(r);

    document.getElementById('resPerm').innerText = nPr;
    document.getElementById('resComb').innerText = nCr;
}

function renderGrafico(frecuencias) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    if(myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(frecuencias),
            datasets: [{
                label: 'Frecuencia Absoluta (Histograma)',
                data: Object.values(frecuencias),
                backgroundColor: 'rgba(37, 99, 235, 0.5)'
            }]
        }
    });

}
// Operaciones con Conjuntos [cite: 20]
function calcularConjuntos() {
    const a = document.getElementById('conjuntoA').value.split(',').map(x => x.trim());
    const b = document.getElementById('conjuntoB').value.split(',').map(x => x.trim());
    
    const setA = new Set(a);
    const setB = new Set(b);

    // Unión
    const union = new Set([...setA, ...setB]);
    document.getElementById('resUnion').innerText = `{ ${Array.from(union).join(', ')} }`;

    // Intersección
    const interseccion = a.filter(x => setB.has(x));
    document.getElementById('resInter').innerText = `{ ${[...new Set(interseccion)].join(', ')} }`;

    // Diferencia (A - B)
    const diferencia = a.filter(x => !setB.has(x));
    document.getElementById('resDif').innerText = `{ ${[...new Set(diferencia)].join(', ')} }`;
}

// Probabilidad Simple [cite: 22]
function calcularProbabilidad() {
    const fav = parseFloat(document.getElementById('favorables').value);
    const tot = parseFloat(document.getElementById('totales').value);
    
    if (tot === 0) return alert("El total no puede ser cero");
    
    const resultado = (fav / tot) * 100;
    document.getElementById('resProb').innerText = resultado.toFixed(2) + "%";
}

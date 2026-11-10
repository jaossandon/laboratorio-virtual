// main.js
document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('tabla-periodica');
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    
    const inspectorPanel = document.getElementById('inspectorPanel');
    const closeInspectorBtn = document.getElementById('closeInspector');
    
    const elemZBadge = document.getElementById('elemZBadge');
    const elemNameTitle = document.getElementById('elemNameTitle');
    const elemSymbolSubtitle = document.getElementById('elemSymbolSubtitle');
    const elemMasa = document.getElementById('elemMasa');
    const elemFamilia = document.getElementById('elemFamilia');
    const isotoposList = document.getElementById('isotoposList');
    
    const canvasContainer = document.getElementById('canvasContainer');
    const btnBackToTable = document.getElementById('btnBackToTable');
    const simTitle = document.getElementById('simTitle');
    const simDetails = document.getElementById('simDetails');

    // 1. Renderizar la tabla periódica inicial
    function renderizarTabla(elementosFiltrados = elementosData) {
        gridContainer.innerHTML = '';
        
        elementosData.forEach(el => {
            const ficha = document.createElement('div');
            ficha.className = `elemento ${el.familia}`;
            ficha.style.gridColumn = el.col;
            ficha.style.gridRow = el.row;
            ficha.dataset.z = el.z;
            ficha.dataset.simbolo = el.simbolo.toLowerCase();
            ficha.dataset.nombre = el.nombre.toLowerCase();
            ficha.dataset.familia = el.familia;

            ficha.innerHTML = `
                <div class="numero">${el.z}</div>
                <div class="simbolo">${el.simbolo}</div>
                <div class="nombre">${el.nombre}</div>
                <div class="masa">${el.masa}</div>
            `;

            ficha.addEventListener('click', () => abrirInspector(el));
            gridContainer.appendChild(ficha);
        });
    }

    renderizarTabla();

    // 2. Abrir Panel Lateral de Inspección
    function abrirInspector(el) {
        elemZBadge.innerText = `Z = ${el.z}`;
        elemNameTitle.innerText = el.nombre;
        elemSymbolSubtitle.innerText = el.simbolo;
        elemMasa.innerText = `${el.masa} u`;
        elemFamilia.innerText = formatearNombreFamilia(el.familia);

        // Generar botones de isótopos
        isotoposList.innerHTML = '';
        if (el.isotopos && el.isotopos.length > 0) {
            el.isotopos.forEach(iso => {
                const btn = document.createElement('button');
                btn.className = 'btn-isotopo';
                btn.innerHTML = `<span>${iso.nombre}</span> <span style="color:#64748b; font-size:12px;">p⁺: ${iso.protones} | n⁰: ${iso.neutrones}</span>`;
                btn.addEventListener('click', () => {
                    lanzarSimulacion3D(el, iso);
                });
                isotoposList.appendChild(btn);
            });
        } else {
            isotoposList.innerHTML = `<p style="font-size:12px; color:var(--text-muted);">Sin isótopos registrados.</p>`;
        }

        inspectorPanel.classList.add('active');
    }

    closeInspectorBtn.addEventListener('click', () => {
        inspectorPanel.classList.remove('active');
    });

    function formatearNombreFamilia(familia) {
        const nombres = {
            'no-metal': 'No Metal',
            'gas-noble': 'Gas Noble',
            'alcalino': 'Metal Alcalino',
            'alcalinoterreo': 'Metal Alcalinotérreo',
            'transicion': 'Metal de Transición',
            'post-transicion': 'Metal Post-transición',
            'metaloide': 'Metaloide',
            'halogeno': 'Halógeno',
            'lantanido': 'Lantánido',
            'actinido': 'Actínido'
        };
        return nombres[familia] || familia;
    }

    // 3. Lanzar Vista 3D
    function lanzarSimulacion3D(el, iso) {
        inspectorPanel.classList.remove('active');
        canvasContainer.style.display = 'block';
        
        simTitle.innerText = `${el.nombre} — ${iso.nombre}`;
        simDetails.innerHTML = `
            <span class="particle-badge"><span class="p-dot">●</span> Protones: ${iso.protones}</span>
            <span class="particle-badge"><span class="n-dot">●</span> Neutrones: ${iso.neutrones}</span>
            <span class="particle-badge"><span class="e-dot">●</span> Electrones: ${el.z}</span>
        `;

        construirAtomo3D(iso.protones, iso.neutrones, el.z);
    }

    // Cierre seguro de la vista 3D
    btnBackToTable.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Ocultar el contenedor de pantalla completa
        canvasContainer.style.display = 'none';
        
        // Detener el motor 3D para liberar recursos
        if (typeof detenerSimulacion3D === 'function') {
            detenerSimulacion3D();
        }
    });

    // 4. Buscador y Filtros en tiempo real
    function filtrarElementos() {
        const query = searchInput.value.toLowerCase().trim();
        const familiaSeleccionada = filterSelect.value;
        const fichas = gridContainer.querySelectorAll('.elemento');

        fichas.forEach(ficha => {
            const z = ficha.dataset.z;
            const simbolo = ficha.dataset.simbolo;
            const nombre = ficha.dataset.nombre;
            const familia = ficha.dataset.familia;

            const coincideTexto = query === '' || z.includes(query) || simbolo.includes(query) || nombre.includes(query);
            const coincideFamilia = familiaSeleccionada === 'todos' || familia === familiaSeleccionada;

            if (coincideTexto && coincideFamilia) {
                ficha.classList.remove('dimmed');
            } else {
                ficha.classList.add('dimmed');
            }
        });
    }

    searchInput.addEventListener('input', filtrarElementos);
    filterSelect.addEventListener('change', filtrarElementos);
})
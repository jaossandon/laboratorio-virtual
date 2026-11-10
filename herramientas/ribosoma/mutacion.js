/* =========================================
   FÁBRICA DE PROTEÍNAS: MODO MUTACIÓN EN EL ADN
   El estudiante cambia letras de la hebra codificante del ADN
   (la hebra molde cambia sola), compara la proteína original
   con la mutada y aprende qué tipo de mutación ocurrió.
   Luego puede fabricarla en 3D: transcripción y traducción.
   Funciona junto a ribosoma.js (usa su cuadro de ARNm).
   ========================================= */

(function () {
    const entradaARNm = document.getElementById('entrada-arnm');
    const btnSecuencia = document.getElementById('btn-secuencia');
    const notaSecuencia = document.getElementById('nota-secuencia');
    const cajaSecuencia = document.getElementById('mut-secuencia');
    const cajaResultado = document.getElementById('mut-resultado');
    const btnComparar = document.getElementById('mut-comparar');
    const btnDeshacer = document.getElementById('mut-deshacer');
    const btnFabricar = document.getElementById('mut-fabricar');
    const escena3D = document.getElementById('fabrica');

    /* ---------- Código genético ---------- */
    const ABREV = {
        F: 'Phe', L: 'Leu', S: 'Ser', Y: 'Tyr', C: 'Cys', W: 'Trp', P: 'Pro', H: 'His',
        Q: 'Gln', R: 'Arg', I: 'Ile', M: 'Met', T: 'Thr', N: 'Asn', K: 'Lys', V: 'Val',
        A: 'Ala', D: 'Asp', E: 'Glu', G: 'Gly'
    };
    const NOMBRE = {
        Phe: 'Fenilalanina', Leu: 'Leucina', Ser: 'Serina', Tyr: 'Tirosina', Cys: 'Cisteína',
        Trp: 'Triptófano', Pro: 'Prolina', His: 'Histidina', Gln: 'Glutamina', Arg: 'Arginina',
        Ile: 'Isoleucina', Met: 'Metionina', Thr: 'Treonina', Asn: 'Asparagina', Lys: 'Lisina',
        Val: 'Valina', Ala: 'Alanina', Asp: 'Ácido aspártico', Glu: 'Ácido glutámico', Gly: 'Glicina'
    };
    const BASES = 'UCAG';
    const LETRAS = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
    const CODIGO = {};
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            for (let m = 0; m < 4; m++) {
                CODIGO[BASES[i] + BASES[j] + BASES[m]] = LETRAS[16 * i + 4 * j + m];
            }
        }
    }
    const SIGUIENTE = { A: 'T', T: 'G', G: 'C', C: 'A' };       // cada clic cambia la letra del ADN
    const COMPLEMENTO_ADN = { A: 'T', T: 'A', G: 'C', C: 'G' };

    // El ARNm tiene la misma secuencia que la hebra codificante, pero con U en lugar de T
    function aARN(s) { return s.replace(/T/g, 'U'); }
    function esTermino(c) { return CODIGO[c] === '*'; }
    function abrev(c) { return ABREV[CODIGO[c]]; }
    function aaTexto(c) { return esTermino(c) ? 'codón de término' : NOMBRE[abrev(c)] + ' (' + abrev(c) + ')'; }
    function tripleteTexto(adn) { return '<strong>' + adn + '</strong> (en el ARNm: ' + aARN(adn) + ')'; }

    function limpiarTexto(t) {
        return t.toUpperCase().replace(/\s+/g, '').replace(/U/g, 'T');
    }

    // Transcribe el ADN a ARNm y lo lee desde el primer AUG, de 3 en 3, hasta un codón de término
    function traducir(adn) {
        const s = aARN(adn);
        const inicio = s.indexOf('AUG');
        if (inicio < 0) return { inicio: -1, codones: [], proteina: [], termino: false };
        const codones = [];
        for (let i = inicio; i + 3 <= s.length; i += 3) {
            const c = s.substring(i, i + 3);
            codones.push(c);
            if (esTermino(c)) {
                return { inicio: inicio, codones: codones, proteina: codones.slice(0, -1).map(abrev), termino: true, fin: i + 3 };
            }
        }
        return { inicio: inicio, codones: codones, proteina: codones.map(abrev), termino: false };
    }

    /* ---------- Estado (secuencias de la hebra codificante del ADN) ---------- */
    let original = limpiarTexto(entradaARNm.value);
    let mutada = original.split('');
    let fabricando = false;

    /* ---------- Dibujar el ADN: arriba la hebra codificante, abajo la molde ---------- */
    function letra(i) {
        const b = mutada[i];
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'mut-letra base-' + b.toLowerCase() + (b !== original[i] ? ' cambiada' : '');
        boton.textContent = b;
        boton.title = 'Clic para cambiar esta letra del ADN';
        boton.addEventListener('click', function () {
            mutada[i] = SIGUIENTE[mutada[i]];
            dibujarSecuencia();
            cajaResultado.innerHTML = '<p class="mut-aviso">Cambiaste el ADN. Ahora presiona <strong>"Comparar proteínas"</strong>.</p>';
            btnFabricar.disabled = true;
        });
        return boton;
    }

    function letraMolde(i) {
        const b = COMPLEMENTO_ADN[mutada[i]];
        const s = document.createElement('span');
        s.className = 'mut-molde-letra base-' + b.toLowerCase() + (mutada[i] !== original[i] ? ' cambiada' : '');
        s.textContent = b;
        return s;
    }

    function grupo(desde, hasta, clase, titulo) {
        const g = document.createElement('div');
        g.className = 'mut-grupo ' + (clase || '');
        if (titulo) g.title = titulo;
        const arriba = document.createElement('div');
        arriba.className = 'mut-hebra';
        const abajo = document.createElement('div');
        abajo.className = 'mut-hebra';
        for (let i = desde; i < hasta; i++) {
            arriba.appendChild(letra(i));
            abajo.appendChild(letraMolde(i));
        }
        g.appendChild(arriba);
        g.appendChild(abajo);
        return g;
    }

    function dibujarSecuencia() {
        cajaSecuencia.innerHTML = '';
        const t = traducir(original);
        if (t.inicio < 0 || !t.termino) {
            cajaSecuencia.appendChild(grupo(0, original.length, '', ''));
            return;
        }
        if (t.inicio > 0) cajaSecuencia.appendChild(grupo(0, t.inicio, 'fuera', 'Antes del inicio: no se traduce'));
        for (let c = 0; c < t.codones.length; c++) {
            const desde = t.inicio + c * 3;
            let clase = '';
            if (c === 0) clase = 'inicio';
            if (c === t.codones.length - 1) clase = 'termino';
            cajaSecuencia.appendChild(grupo(desde, desde + 3, clase, 'Triplete ' + (c + 1)));
        }
        if (t.fin < original.length) cajaSecuencia.appendChild(grupo(t.fin, original.length, 'fuera', 'Después del término: no se traduce'));
    }

    /* ---------- Comparar y explicar ---------- */
    function filaProteina(titulo, proteina, otra, termino) {
        let html = '<div class="mut-fila"><span class="mut-etq">' + titulo + '</span>';
        if (!proteina.length && !termino) {
            html += '<span class="mut-chip fin">No se fabrica proteína</span>';
        }
        proteina.forEach(function (aa, i) {
            const distinto = otra[i] !== aa;
            html += '<span class="mut-chip' + (distinto ? ' distinto' : '') + '">' + aa + '</span>';
        });
        if (termino) html += '<span class="mut-chip fin">Término</span>';
        else if (proteina.length) html += '<span class="mut-chip distinto">Sin término…</span>';
        return html + '</div>';
    }

    function comparar() {
        const sMut = mutada.join('');
        const a = traducir(original);
        const b = traducir(sMut);
        const cambios = [];
        for (let i = 0; i < original.length; i++) if (original[i] !== mutada[i]) cambios.push(i);

        let tipo = '';
        let explicacion = '';
        let puedeFabricar = false;

        // Triplete que cambió (si hay un solo cambio dentro de la zona que se lee)
        let tripA = '', tripB = '';
        if (cambios.length === 1 && a.inicio >= 0) {
            const pos = cambios[0];
            const desde = a.inicio + Math.floor((pos - a.inicio) / 3) * 3;
            tripA = original.substring(desde, desde + 3);
            tripB = sMut.substring(desde, desde + 3);
        }
        const codA = aARN(tripA), codB = aARN(tripB);
        const dentro = cambios.length > 0 && cambios.every(function (i) { return i >= a.inicio && i < a.fin; });

        if (!cambios.length) {
            tipo = 'Sin cambios';
            explicacion = 'Todavía no cambias ninguna letra. Haz clic en una letra de la hebra codificante del ADN para mutarla.';
        } else if (b.inicio < 0) {
            tipo = 'Pérdida del codón de inicio';
            explicacion = 'La mutación destruyó el triplete de inicio <strong>ATG</strong> del ADN (en el ARNm, <strong>AUG</strong>). Sin codón de inicio, el ribosoma no sabe dónde empezar a leer y <strong>no se fabrica la proteína</strong>.';
        } else if (b.inicio > a.inicio) {
            tipo = 'Pérdida del codón de inicio';
            explicacion = 'La mutación destruyó el triplete de inicio <strong>ATG</strong> original (en el ARNm, AUG). El ribosoma empieza a leer en el siguiente AUG que encuentra, más adelante, así que <strong>cambia el marco de lectura</strong> y la proteína resulta muy distinta (o no se completa).';
            puedeFabricar = b.termino;
        } else if (b.inicio < a.inicio) {
            tipo = 'Nuevo codón de inicio';
            explicacion = 'La mutación creó un <strong>ATG</strong> en el ADN (un AUG en el ARNm) antes del original. El ribosoma empieza a leer ahí, así que <strong>cambia el marco de lectura</strong>: los codones se agrupan distinto y la proteína resulta muy diferente.';
            puedeFabricar = b.termino;
        } else if (!b.termino) {
            tipo = 'Pérdida del codón de término';
            explicacion = 'La mutación eliminó el codón de término y en el resto del gen no aparece otro. El ribosoma <strong>no encuentra dónde detenerse</strong> y la proteína no se libera correctamente.';
        } else if (!dentro) {
            tipo = 'Mutación fuera de la zona que se traduce';
            explicacion = 'Cambiaste letras que quedan <strong>antes del inicio o después del codón de término</strong>. Esa parte se copia al ARNm, pero el ribosoma no la traduce, por eso la proteína <strong>no cambia</strong>.';
            puedeFabricar = true;
        } else if (b.proteina.join() === a.proteina.join()) {
            tipo = 'Mutación silenciosa';
            explicacion = (tripA
                ? 'El triplete ' + tripleteTexto(tripA) + ' cambió a ' + tripleteTexto(tripB) + ', pero ambos codifican <strong>' + aaTexto(codA) + '</strong>. '
                : 'Los tripletes cambiaron, pero siguen codificando los mismos aminoácidos. ') +
                'El código genético es <strong>redundante</strong> (varios codones para un mismo aminoácido), así que la proteína <strong>no cambia</strong>.';
            puedeFabricar = true;
        } else if (b.proteina.length < a.proteina.length && a.proteina.slice(0, b.proteina.length).join() === b.proteina.join()) {
            tipo = 'Mutación sin sentido';
            explicacion = (tripA ? 'El triplete ' + tripleteTexto(tripA) + ', que codifica ' + aaTexto(codA) + ', se transformó en ' + tripleteTexto(tripB) + ', un codón de término. ' : 'Apareció un codón de término antes de tiempo. ') +
                'El ribosoma <strong>se detiene antes</strong> y la proteína queda incompleta: tiene ' + b.proteina.length + ' de ' + a.proteina.length + ' aminoácidos, y lo más probable es que no funcione.';
            puedeFabricar = true;
        } else if (b.proteina.length > a.proteina.length) {
            tipo = 'Proteína alargada';
            explicacion = 'La mutación eliminó el codón de término original, pero más adelante hay otro. El ribosoma sigue leyendo y la proteína queda <strong>más larga de lo normal</strong>.';
            puedeFabricar = true;
        } else {
            tipo = 'Mutación de cambio de sentido';
            explicacion = (tripA ? 'El triplete ' + tripleteTexto(tripA) + ', que codifica ' + aaTexto(codA) + ', pasó a ser ' + tripleteTexto(tripB) + ', que codifica ' + aaTexto(codB) + '. ' : 'Algunos codones ahora codifican aminoácidos distintos. ') +
                'La proteína tiene el mismo largo, pero con <strong>un aminoácido distinto</strong>. Eso puede cambiar su forma y su función; así ocurre, por ejemplo, en la anemia falciforme.';
            puedeFabricar = true;
        }

        let html = '<p class="mut-tipo">' + tipo + '</p>';
        if (cambios.length) {
            html += filaProteina('Original', a.proteina, b.proteina, a.termino);
            html += filaProteina('Mutada', b.inicio < 0 ? [] : b.proteina, a.proteina, b.inicio >= 0 && b.termino);
        }
        html += '<p class="mut-explicacion">' + explicacion + '</p>';
        if (cambios.length) {
            html += '<p class="mut-explicacion">Como el cambio está en el <strong>ADN</strong>, todas las copias de ARNm que se transcriban de este gen llevarán la mutación.</p>';
        }
        if (puedeFabricar) html += '<p class="mut-aviso">Presiona <strong>"Fabricar la proteína mutada"</strong> para transcribir el gen mutado y armar la proteína en 3D.</p>';
        cajaResultado.innerHTML = html;
        btnFabricar.disabled = !puedeFabricar;
    }

    /* ---------- Botones ---------- */
    btnComparar.addEventListener('click', comparar);

    btnDeshacer.addEventListener('click', function () {
        mutada = original.split('');
        dibujarSecuencia();
        cajaResultado.innerHTML = '';
        btnFabricar.disabled = true;
    });

    btnFabricar.addEventListener('click', function () {
        fabricando = true;
        entradaARNm.value = aARN(mutada.join(''));
        btnSecuencia.click();
        escena3D.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Cuando el estudiante usa otra secuencia arriba, el modo mutación parte desde ella
    new MutationObserver(function () {
        if (notaSecuencia.classList.contains('error')) return;
        if (fabricando) {
            fabricando = false;
            return;
        }
        original = limpiarTexto(entradaARNm.value);
        mutada = original.split('');
        dibujarSecuencia();
        cajaResultado.innerHTML = '';
        btnFabricar.disabled = true;
    }).observe(notaSecuencia, { childList: true, subtree: true, characterData: true });

    /* ---------- Inicio ---------- */
    btnFabricar.disabled = true;
    dibujarSecuencia();
})();
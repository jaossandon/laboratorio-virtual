/* =========================================
   FÁBRICA DE PROTEÍNAS: DEL ADN A LA PROTEÍNA EN 3D
   1) Transcripción: la ARN polimerasa abre la hélice de ADN
      y el estudiante elige cada nucleótido del ARNm.
   2) Traducción: el estudiante ensambla el ribosoma, elige
      el ARNt correcto, forma el enlace, avanza y termina.
   También puede escribir su propio ARNm y cambiar la velocidad.
   Requiere Three.js (r128).
   ========================================= */

(function () {
    const contenedor = document.getElementById('contenedor-lienzo');
    const textoEstado = document.getElementById('estado');
    const textoProteina = document.getElementById('proteina');
    const textoPuntaje = document.getElementById('puntaje');
    const btnAccion = document.getElementById('btn-accion');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnVista = document.getElementById('btn-vista');
    const chkAuto = document.getElementById('modo-auto');
    const entradaARNm = document.getElementById('entrada-arnm');
    const btnSecuencia = document.getElementById('btn-secuencia');
    const btnAzar = document.getElementById('btn-azar');
    const notaSecuencia = document.getElementById('nota-secuencia');
    const rangoVelocidad = document.getElementById('rango-velocidad');
    const valorVelocidad = document.getElementById('valor-velocidad');

    if (!window.THREE) {
        textoEstado.textContent = 'No se pudo cargar Three.js. Revisa tu conexión a internet y recarga la página.';
        return;
    }

    /* ---------- Colores ---------- */
    const COLOR_BASE = { A: '#10B981', U: '#F59E0B', G: '#8B5CF6', C: '#0EA5E9' };
    const COLOR_ADN = { A: '#10B981', T: '#EF4444', G: '#8B5CF6', C: '#0EA5E9' };
    const COMPLEMENTO = { A: 'U', U: 'A', G: 'C', C: 'G' };
    const COMPLEMENTO_ADN = { A: 'T', T: 'A', G: 'C', C: 'G' };
    const NOMBRE_BASE = { A: 'Adenina', U: 'Uracilo', G: 'Guanina', C: 'Citosina', T: 'Timina' };
    const COLOR_AA = ['#6B1C2F', '#D4AF37', '#0EA5E9', '#10B981', '#8B5CF6', '#F97316', '#EC4899', '#14B8A6'];
    const CREMA = 0xF3E3B5;

    /* ---------- Código genético ---------- */
    const NOMBRES = {
        F: ['Phe', 'Fenilalanina'], L: ['Leu', 'Leucina'], S: ['Ser', 'Serina'],
        Y: ['Tyr', 'Tirosina'], C: ['Cys', 'Cisteína'], W: ['Trp', 'Triptófano'],
        P: ['Pro', 'Prolina'], H: ['His', 'Histidina'], Q: ['Gln', 'Glutamina'],
        R: ['Arg', 'Arginina'], I: ['Ile', 'Isoleucina'], M: ['Met', 'Metionina'],
        T: ['Thr', 'Treonina'], N: ['Asn', 'Asparagina'], K: ['Lys', 'Lisina'],
        V: ['Val', 'Valina'], A: ['Ala', 'Alanina'], D: ['Asp', 'Ácido aspártico'],
        E: ['Glu', 'Ácido glutámico'], G: ['Gly', 'Glicina']
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

    function aminoacido(codon) {
        const letra = CODIGO[codon];
        if (letra === '*') return null;
        return {
            abrev: NOMBRES[letra][0],
            nombre: NOMBRES[letra][1],
            color: COLOR_AA['ACDEFGHIKLMNPQRSTVWY'.indexOf(letra) % COLOR_AA.length]
        };
    }

    function anticodonDe(codon) {
        return codon.split('').map(function (b) { return COMPLEMENTO[b]; }).join('');
    }

    /* ---------- Secuencia de ARNm (se puede cambiar) ---------- */
    let PREVIO = 'GC';
    let CODONES = ['AUG', 'UUC', 'GGA', 'AAA', 'UGG', 'CAC', 'UAA'];
    let POSTERIOR = 'GCA';
    let ARNM = PREVIO + CODONES.join('') + POSTERIOR;
    const MAX_CODONES = 20;

    // Revisa lo que escribió el estudiante y busca el marco de lectura
    function leerSecuencia(texto) {
        const s = texto.toUpperCase().replace(/\s+/g, '').replace(/T/g, 'U');
        if (!s) return { error: 'Escribe una secuencia de ARNm.' };
        if (!/^[AUGC]+$/.test(s)) return { error: 'Usa solo las letras A, U, G y C.' };
        const inicio = s.indexOf('AUG');
        if (inicio < 0) return { error: 'Falta el codón de inicio AUG: el ribosoma no sabe dónde empezar a leer.' };
        const codones = [];
        for (let i = inicio; i + 3 <= s.length; i += 3) {
            const c = s.substring(i, i + 3);
            codones.push(c);
            if (CODIGO[c] === '*') {
                if (codones.length > MAX_CODONES) return { error: 'Usa como máximo ' + MAX_CODONES + ' codones entre el inicio y el término.' };
                return { previo: s.substring(0, inicio), codones: codones, posterior: s.substring(i + 3) };
            }
        }
        return { error: 'Falta un codón de término (UAA, UAG o UGA) después del AUG, contando de 3 en 3 desde el AUG.' };
    }

    /* ---------- Escena ---------- */
    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xf8fafc);
    contenedor.appendChild(renderer.domElement);

    escena.add(new THREE.AmbientLight(0xffffff, 0.75));
    const luz = new THREE.DirectionalLight(0xffffff, 0.8);
    luz.position.set(6, 12, 10);
    escena.add(luz);

    const mundo = new THREE.Group();
    escena.add(mundo);

    /* ---------- Cámara que gira y sigue la acción ---------- */
    const OBJETIVO = new THREE.Vector3(1.5, 2.5, 0);
    const OBJETIVO_ANGOSTO = new THREE.Vector3(1.5, 0.5, 0);   // en celulares, las moléculas a elegir van abajo
    let angosto = false;
    const objetivo = OBJETIVO.clone();
    const objetivoDeseado = OBJETIVO.clone();
    const VISTA = { yaw: 0.22, pitch: 0.18 };
    let yaw = VISTA.yaw, pitch = VISTA.pitch;
    let distancia = 22, distanciaBase = 22, zoomManual = false;
    let zoomEtapa = 1, zoomDeseado = 1;

    function ubicarCamara() {
        camara.position.set(
            objetivo.x + distancia * Math.sin(yaw) * Math.cos(pitch),
            objetivo.y + distancia * Math.sin(pitch),
            objetivo.z + distancia * Math.cos(yaw) * Math.cos(pitch)
        );
        camara.lookAt(objetivo);
    }

    function ajustarTamano() {
        const ancho = contenedor.clientWidth;
        // En celulares la escena es más alta que ancha; en pantallas grandes, apaisada
        angosto = ancho < 600;
        const alto = angosto ? Math.round(ancho * 1.15) : Math.max(360, Math.min(600, ancho * 0.56));
        renderer.setSize(ancho, alto);
        camara.aspect = ancho / alto;
        camara.updateProjectionMatrix();
        // Distancia para que quepan el ribosoma y las moléculas a elegir
        const medioAncho = angosto ? 8.5 : 15.5;
        distanciaBase = Math.max(19, medioAncho / (Math.tan(THREE.MathUtils.degToRad(21)) * camara.aspect));
        if (!zoomManual) distancia = distanciaBase * zoomEtapa;
    }

    /* ---------- Ayudas para crear objetos ---------- */
    const GEO = {
        caja: new THREE.BoxGeometry(1, 1, 1),
        esfera: new THREE.SphereGeometry(1, 40, 24),
        cil: new THREE.CylinderGeometry(1, 1, 1, 20)
    };

    function malla(geo, color, opacidad) {
        const op = opacidad === undefined ? 1 : opacidad;
        const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.45, metalness: 0.05, transparent: true, opacity: op });
        mat.userData.base = op;
        return new THREE.Mesh(geo, mat);
    }

    const texturas = {};
    function etiqueta(texto, color, tam, fondo) {
        const clave = texto + color + (fondo || '');
        let tex = texturas[clave];
        if (!tex) {
            const c = document.createElement('canvas');
            const g = c.getContext('2d');
            g.font = '700 72px Inter, sans-serif';
            const ancho = Math.ceil(g.measureText(texto).width) + 48;
            c.width = ancho;
            c.height = 112;
            if (fondo) {
                g.fillStyle = fondo;
                g.beginPath();
                g.moveTo(24, 6);
                g.arcTo(ancho - 6, 6, ancho - 6, 106, 24);
                g.arcTo(ancho - 6, 106, 6, 106, 24);
                g.arcTo(6, 106, 6, 6, 24);
                g.arcTo(6, 6, ancho - 6, 6, 24);
                g.fill();
            }
            g.font = '700 72px Inter, sans-serif';
            g.fillStyle = color;
            g.textAlign = 'center';
            g.textBaseline = 'middle';
            g.fillText(texto, ancho / 2, 60);
            tex = new THREE.CanvasTexture(c);
            tex.minFilter = THREE.LinearFilter;
            tex.userData = { proporcion: ancho / 112 };
            texturas[clave] = tex;
        }
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
        mat.userData.base = 1;
        const s = new THREE.Sprite(mat);
        s.scale.set(tam * tex.userData.proporcion, tam, 1);
        s.renderOrder = 10;
        return s;
    }

    function fijarOpacidad(obj, a) {
        obj.traverse(function (o) {
            if (o.material) o.material.opacity = Math.max(0, a) * o.material.userData.base;
        });
    }

    function fijarBrillo(obj, color) {
        obj.traverse(function (o) {
            if (o.material && o.material.emissive) o.material.emissive.setHex(color);
        });
    }

    function suave(p) {
        return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    }

    const EJE_Y = new THREE.Vector3(0, 1, 0);
    function orientar(c, a, b) {
        const d = new THREE.Vector3().subVectors(b, a);
        const largo = d.length();
        c.position.copy(a).addScaledVector(d, 0.5);
        c.scale.set(0.09, largo, 0.09);
        if (largo > 0.0001) c.quaternion.setFromUnitVectors(EJE_Y, d.normalize());
    }

    /* ---------- ARNm ---------- */
    const grupoARNm = new THREE.Group();
    mundo.add(grupoARNm);
    let nucleotidos = [];
    let L = PREVIO.length;

    function nucleotidoARN(grupo, b, x) {
        const caja = malla(GEO.caja, COLOR_BASE[b]);
        caja.scale.set(0.82, 0.62, 0.5);
        caja.position.set(x, 0.35, 0);
        grupo.add(caja);
        const s = etiqueta(b, '#ffffff', 0.5);
        s.position.set(x, 0.35, 0.3);
        grupo.add(s);
        return caja;
    }

    function construirARNm() {
        while (grupoARNm.children.length) grupoARNm.remove(grupoARNm.children[0]);
        nucleotidos = [];
        L = PREVIO.length;

        const esqueleto = malla(GEO.cil, 0x94a3b8);
        esqueleto.scale.set(0.1, ARNM.length, 0.1);
        esqueleto.rotation.z = Math.PI / 2;
        esqueleto.position.x = (ARNM.length - 1) / 2 - (L + 1);
        grupoARNm.add(esqueleto);

        for (let n = 0; n < ARNM.length; n++) {
            nucleotidos.push(nucleotidoARN(grupoARNm, ARNM[n], n - (L + 1)));
        }

        const e5 = etiqueta("5'", '#64748b', 0.5);
        e5.position.set(-L - 2, 0.35, 0);
        const e3 = etiqueta("3'", '#64748b', 0.5);
        e3.position.set(ARNM.length - L - 1, 0.35, 0);
        const eArnm = etiqueta('ARNm', '#64748b', 0.5);
        eArnm.position.set(-L - 1, -0.6, 0);
        grupoARNm.add(e5, e3, eArnm);

        construirADN();
    }

    /* ---------- ADN: el gen que se transcribe ---------- */
    const ADN_IZQ = 'TATA';   // zona donde se une la ARN polimerasa (promotor)
    const ADN_DER = 'CTTA';
    const EXTRA = ADN_IZQ.length;
    const Y_ADN = 2.4, RADIO_ADN = 1.1;
    const ABAJO_Q = new THREE.Quaternion().setFromUnitVectors(EJE_Y, new THREE.Vector3(0, -1, 0));
    const grupoADN = new THREE.Group();
    mundo.add(grupoADN);
    const grupoTranscrito = new THREE.Group();
    mundo.add(grupoTranscrito);
    let pares = [];
    let unionesCod = [], unionesMol = [];
    let etqADN = null;
    let pPol = 0, burbuja = 0, giro = 0, opacidadADN = 1;

    function xGen(g) {
        return g - EXTRA - (L + 1);
    }

    function nuevaHebra(letra, colorEsqueleto) {
        const bola = malla(GEO.esfera, colorEsqueleto);
        bola.scale.setScalar(0.2);
        const base = malla(GEO.caja, COLOR_ADN[letra]);
        const etq = etiqueta(letra, '#ffffff', 0.42, COLOR_ADN[letra]);
        grupoADN.add(bola, base, etq);
        return { bola: bola, base: base, etq: etq, letra: letra };
    }

    function construirADN() {
        while (grupoADN.children.length) grupoADN.remove(grupoADN.children[0]);
        while (grupoTranscrito.children.length) grupoTranscrito.remove(grupoTranscrito.children[0]);
        pares = [];
        unionesCod = [];
        unionesMol = [];
        const codificante = ADN_IZQ + ARNM.replace(/U/g, 'T') + ADN_DER;
        for (let g = 0; g < codificante.length; g++) {
            const b = codificante[g];
            pares.push({
                x: xGen(g),
                cod: nuevaHebra(b, 0x94a3b8),
                mol: nuevaHebra(COMPLEMENTO_ADN[b], 0x334155)
            });
            if (g > 0) {
                const u1 = malla(GEO.cil, 0x94a3b8);
                const u2 = malla(GEO.cil, 0x334155);
                grupoADN.add(u1, u2);
                unionesCod.push(u1);
                unionesMol.push(u2);
            }
        }
        etqADN = {
            adn: etiqueta('ADN (gen)', '#334155', 0.6),
            cod: etiqueta('Hebra codificante', '#64748b', 0.42, '#ffffff'),
            mol: etiqueta('Hebra molde', '#334155', 0.42, '#ffffff'),
            arn: etiqueta('ARNm en formación', '#8a6d14', 0.42, '#ffffff')
        };
        grupoADN.add(etqADN.adn, etqADN.cod, etqADN.mol);
        grupoTranscrito.add(etqADN.arn);
    }

    function ubicarHebra(h, desde, q, a, aEtq, brillo) {
        h.bola.position.copy(desde);
        h.base.quaternion.copy(q);
        const dir = EJE_Y.clone().applyQuaternion(q);
        h.base.position.copy(desde).addScaledVector(dir, 0.5);
        h.base.scale.set(0.42, 0.95, 0.26);
        h.etq.position.copy(h.base.position);
        h.etq.position.z += 0.3;
        h.bola.material.opacity = a;
        h.base.material.opacity = a;
        h.etq.material.opacity = aEtq;
        h.base.material.emissive.setRGB(brillo, brillo, brillo);
    }

    // Ubica cada par de bases: cerrado forma la hélice; cerca de la polimerasa se abre
    function ubicarADN(tiempo) {
        if (!pares.length) return;
        const pulso = fase === 'esperaNucleotido' ? (Math.sin(tiempo * 5) + 1) * 0.25 : 0;
        const resaltar = fase === 'adn' && hover === 'adn' ? 0.12 : 0;
        const cods = [], mols = [];
        pares.forEach(function (p, g) {
            const th = p.x * Math.PI / 5 + giro;
            const o = suave(burbuja * Math.max(0, Math.min(1, (4 - Math.abs(p.x - pPol)) / 1.5)));
            const cC = new THREE.Vector3(p.x, Y_ADN + RADIO_ADN * Math.cos(th), RADIO_ADN * Math.sin(th));
            const mC = new THREE.Vector3(p.x, Y_ADN - RADIO_ADN * Math.cos(th), -RADIO_ADN * Math.sin(th));
            const c = cC.clone().lerp(new THREE.Vector3(p.x, 4.3, -1.6), o);
            const m = mC.clone().lerp(new THREE.Vector3(p.x, 1.9, 0), o);
            const qC = new THREE.Quaternion().setFromUnitVectors(EJE_Y, new THREE.Vector3().subVectors(mC, cC).normalize()).slerp(ABAJO_Q, o);
            const qM = new THREE.Quaternion().setFromUnitVectors(EJE_Y, new THREE.Vector3().subVectors(cC, mC).normalize()).slerp(ABAJO_Q, o);
            const actual = g === j + EXTRA;
            ubicarHebra(p.cod, c, qC, opacidadADN, o * 0.7 * opacidadADN, resaltar);
            ubicarHebra(p.mol, m, qM, opacidadADN, o * opacidadADN, resaltar + (actual ? pulso : 0));
            cods.push(c);
            mols.push(m);
        });
        unionesCod.forEach(function (u, i) { orientar(u, cods[i], cods[i + 1]); u.material.opacity = opacidadADN; });
        unionesMol.forEach(function (u, i) { orientar(u, mols[i], mols[i + 1]); u.material.opacity = opacidadADN; });

        etqADN.adn.position.set(pares[0].x - 2.6, Y_ADN, 0);
        etqADN.adn.material.opacity = opacidadADN * (1 - burbuja);
        etqADN.cod.position.set(pPol - 5.8, 4.6, -1.6);
        etqADN.cod.material.opacity = opacidadADN * burbuja;
        etqADN.mol.position.set(pPol - 5.8, 1.9, 0.6);
        etqADN.mol.material.opacity = opacidadADN * burbuja;
        etqADN.arn.position.set(pPol - 3.4, -0.45, 0);
        etqADN.arn.material.opacity = opacidadADN * burbuja * (j > 2 ? 1 : 0);
    }

    construirARNm();

    /* ---------- ARN polimerasa ---------- */
    const polimerasa = new THREE.Group();
    const mallaPol = malla(GEO.esfera, 0x14B8A6, 0.25);
    mallaPol.scale.set(1.8, 1.6, 1.5);
    mallaPol.material.depthWrite = false;
    const etqPol = etiqueta('ARN polimerasa', '#0f766e', 0.5);
    etqPol.position.set(0, -2.3, 0.8);
    polimerasa.add(mallaPol, etqPol);
    mundo.add(polimerasa);
    const Y_POL = 1.3;

    // Hueco dorado que muestra dónde se unirá el próximo nucleótido de ARN
    const hueco = malla(GEO.caja, 0xD4AF37, 0.5);
    hueco.scale.set(0.82, 0.62, 0.5);
    hueco.visible = false;
    mundo.add(hueco);

    /* ---------- Ribosoma ---------- */
    const grupoMayor = new THREE.Group();
    const mallaMayor = malla(GEO.esfera, 0x6B1C2F, 0.2);
    mallaMayor.scale.set(6.2, 3.4, 3.6);
    mallaMayor.material.depthWrite = false;
    const etqMayor = etiqueta('Subunidad mayor', '#6B1C2F', 0.6);
    etqMayor.position.set(4.6, 3.3, 0);
    grupoMayor.add(mallaMayor, etqMayor);
    mundo.add(grupoMayor);

    const grupoMenor = new THREE.Group();
    const mallaMenor = malla(GEO.esfera, 0xD4AF37, 0.35);
    mallaMenor.scale.set(5.6, 1.3, 3.2);
    mallaMenor.material.depthWrite = false;
    const etqMenor = etiqueta('Subunidad menor', '#8a6d14', 0.6);
    etqMenor.position.set(7.2, -1.3, 0);
    grupoMenor.add(mallaMenor, etqMenor);
    [['E', -3], ['P', 0], ['A', 3]].forEach(function (s) {
        const e = etiqueta('Sitio ' + s[0], '#8a6d14', 0.5, '#ffffff');
        e.position.set(s[1], -0.9, 2.4);
        grupoMenor.add(e);
    });
    mundo.add(grupoMenor);

    const Y_MAYOR = 3.6, Y_MENOR = -1.3;
    const SEP_MAYOR = 2.6, SEP_MENOR = -2.2;

    /* ---------- Nucleótidos para elegir (transcripción) ---------- */
    function crearNucleotido(b) {
        const g = new THREE.Group();
        const caja = malla(GEO.caja, b === 'T' ? COLOR_ADN.T : COLOR_BASE[b]);
        caja.scale.set(1.1, 1.1, 0.6);
        const letra = etiqueta(b, '#ffffff', 0.75);
        letra.position.z = 0.35;
        const nombre = etiqueta(NOMBRE_BASE[b], '#475569', 0.36);
        nombre.position.y = -0.95;
        g.add(caja, letra, nombre);
        return g;
    }

    /* ---------- ARNt, aminoácidos y factor de liberación ---------- */
    function crearBola(aa) {
        const g = new THREE.Group();
        const e = malla(GEO.esfera, aa.color);
        e.scale.setScalar(0.5);
        g.add(e);
        g.add(etiqueta(aa.abrev, '#ffffff', 0.4));
        return g;
    }

    function crearARNt(anticodon, aa) {
        const g = new THREE.Group();
        for (let i = 0; i < 3; i++) {
            const b = anticodon[i];
            const caja = malla(GEO.caja, COLOR_BASE[b]);
            caja.scale.set(0.82, 0.5, 0.5);
            caja.position.set(i - 1, 1.05, 0);
            g.add(caja);
            const s = etiqueta(b, '#ffffff', 0.48);
            s.position.set(i - 1, 1.05, 0.3);
            g.add(s);
        }
        const barra = malla(GEO.caja, CREMA);
        barra.scale.set(2.8, 0.28, 0.45);
        barra.position.y = 1.45;
        const cuerpo = malla(GEO.cil, CREMA);
        cuerpo.scale.set(0.32, 1.9, 0.32);
        cuerpo.position.y = 2.45;
        const cabeza = malla(GEO.esfera, CREMA);
        cabeza.scale.setScalar(0.42);
        cabeza.position.y = 3.45;
        const tallo = malla(GEO.cil, CREMA);
        tallo.scale.set(0.12, 0.7, 0.12);
        tallo.position.y = 4.0;
        g.add(barra, cuerpo, cabeza, tallo);
        [-0.85, 0.85].forEach(function (x) {
            const brazo = malla(GEO.esfera, CREMA);
            brazo.scale.set(0.5, 0.42, 0.42);
            brazo.position.set(x, 2.5, 0);
            const union = malla(GEO.cil, CREMA);
            union.scale.set(0.14, 0.9, 0.14);
            union.rotation.z = Math.PI / 2;
            union.position.set(x / 2, 2.5, 0);
            g.add(brazo, union);
        });
        g.userData.anticodon = anticodon;
        g.userData.aa = aa;
        if (aa) {
            const bola = crearBola(aa);
            bola.position.y = 4.65;
            g.add(bola);
            g.userData.bola = bola;
        }
        return g;
    }

    function crearFactor() {
        const g = new THREE.Group();
        const caja = malla(GEO.caja, 0x64748b);
        caja.scale.set(2.2, 3.2, 1);
        caja.position.y = 2.6;
        const t1 = etiqueta('Factor de', '#ffffff', 0.45);
        t1.position.set(0, 3.0, 0.6);
        const t2 = etiqueta('liberación', '#ffffff', 0.45);
        t2.position.set(0, 2.3, 0.6);
        g.add(caja, t1, t2);
        return g;
    }

    function arribaDe(tr) {
        return tr.position.clone().add(new THREE.Vector3(0, 4.65, 0));
    }

    /* ---------- Cadena de aminoácidos ---------- */
    const grupoCadena = new THREE.Group();
    mundo.add(grupoCadena);
    let cadena = [];
    let enlaces = [];
    let nombresCadena = [];

    function agregarACadena(aa) {
        const b = crearBola(aa);
        grupoCadena.add(b);
        cadena.push(b);
        nombresCadena.push(aa.abrev);
        if (cadena.length > 1) {
            const c = malla(GEO.cil, 0x64748b);
            grupoCadena.add(c);
            enlaces.push(c);
        }
    }

    function separacion(j) {
        return new THREE.Vector3(-0.6 * j - (j % 2) * 0.25, 0.85 * j, 0.35 * j);
    }

    function ubicarCadena(ancla) {
        const n = cadena.length;
        cadena.forEach(function (b, i) {
            b.position.copy(ancla).add(separacion(n - 1 - i));
        });
        enlaces.forEach(function (c, i) {
            orientar(c, cadena[i].position, cadena[i + 1].position);
        });
    }

    /* ---------- Estado ---------- */
    const DURACION = {
        abre: 1800, coloca: 650, exporta: 2600,
        ensambla: 2000, llega: 1500, enlace: 1300, trasloca: 1400, sale: 1100, termino: 1500, libera: 2600
    };
    const TRANSCRIPCION = ['adn', 'abre', 'esperaNucleotido', 'coloca', 'esperaSalida'];
    const ESPERA_AUTO = 1600;
    const POS_CAND = [
        new THREE.Vector3(8.0, 5.0, 1.5),
        new THREE.Vector3(11.6, 5.0, 1.5),
        new THREE.Vector3(9.8, 1.2, 2.5)
    ];
    const POS_CAND_ANGOSTO = [
        new THREE.Vector3(-4.0, -7.0, 1.5),
        new THREE.Vector3(1.5, -7.0, 1.5),
        new THREE.Vector3(7.0, -7.0, 1.5)
    ];

    let velocidad = 1;
    let fase = 'adn', inicioFase = 0;
    let k = 0;
    let j = 0;
    let trnas = [], candidatos = [], descartados = [];
    let portador = null, entrante = null, saliente = null, factor = null, elegidoNuc = null;
    let anclaDesde = null, arnmX0 = 0, polDesde = 0;
    let aciertos = 0, intentos = 0;
    let mensajeExtra = '';
    let hover = null;
    let autoTranscribir = false;

    function limpiar(obj) {
        if (obj && obj.parent) obj.parent.remove(obj);
    }

    function quitarTranscrito() {
        grupoTranscrito.children.slice().forEach(function (o) {
            if (o !== etqADN.arn) grupoTranscrito.remove(o);
        });
    }

    function reiniciar() {
        trnas.concat(candidatos, descartados, [factor, elegidoNuc]).forEach(limpiar);
        cadena.concat(enlaces).forEach(limpiar);
        trnas = []; candidatos = []; descartados = [];
        cadena = []; enlaces = []; nombresCadena = [];
        factor = null; entrante = null; saliente = null; elegidoNuc = null;
        k = 0;
        grupoARNm.position.x = 0;
        grupoCadena.position.set(0, 0, 0);

        // Traducción: queda preparada para cuando llegue el ARNm
        const met = crearARNt(anticodonDe('AUG'), null);
        mundo.add(met);
        trnas.push(met);
        portador = met;
        agregarACadena(aminoacido('AUG'));
        grupoMayor.position.y = Y_MAYOR + SEP_MAYOR;
        grupoMenor.position.y = Y_MENOR + SEP_MENOR;
        fijarOpacidad(grupoMayor, 0);
        fijarOpacidad(grupoMenor, 0);
        fijarOpacidad(grupoARNm, 0);
        fijarOpacidad(met, 0);
        fijarOpacidad(grupoCadena, 0);

        // Transcripción: se parte desde el ADN cerrado
        quitarTranscrito();
        j = 0;
        autoTranscribir = false;
        burbuja = 0;
        giro = 0;
        opacidadADN = 1;
        pPol = xGen(0) - 2;
        grupoADN.position.set(0, 0, 0);
        polimerasa.position.set(pPol, Y_POL, 0);
        fijarOpacidad(polimerasa, 0);

        mensajeExtra = '';
        cambiarFase('adn');
    }

    function cambiarFase(nombre) {
        fase = nombre;
        inicioFase = performance.now();
        if (nombre === 'enlace') anclaDesde = arribaDe(portador);
        if (nombre === 'trasloca') {
            arnmX0 = grupoARNm.position.x;
            trnas.forEach(function (tr) { tr.userData.x0 = tr.position.x; });
        }
        if (nombre === 'sale') {
            saliente = trnas.find(function (tr) { return tr.position.x < -1; });
            if (saliente) saliente.userData.p0 = saliente.position.clone();
        }
        if (nombre === 'llega' || nombre === 'termino') {
            const obj = nombre === 'llega' ? entrante : factor;
            obj.userData.desde = obj.position.clone();
            obj.userData.escalaDesde = obj.scale.x;
        }
        if (nombre === 'coloca') polDesde = pPol;
        actualizarInterfaz();
        actualizarProteina();
    }
    /* ---------- Transcripción: elegir nucleótidos ---------- */
    function prepararNucleotido() {
        const correcta = ARNM[j];
        const letras = ['A', 'U', 'G', 'C', 'T'].sort(function () { return Math.random() - 0.5; });
        candidatos = letras.map(function (b, i) {
            const obj = crearNucleotido(b);
            const pos = new THREE.Vector3(pPol + (i - 2) * 2.0, 7.0, 0.8);
            obj.position.copy(pos);
            obj.userData.opcion = { letra: b, correcta: b === correcta };
            obj.userData.base = pos;
            obj.userData.escala = 1;
            obj.userData.fase0 = Math.random() * 6;
            mundo.add(obj);
            return obj;
        });
        cambiarFase('esperaNucleotido');
    }

    function elegirNucleotido(obj) {
        const op = obj.userData.opcion;
        const molde = pares[j + EXTRA].mol.letra;
        intentos++;
        if (op.correcta) {
            aciertos++;
            mensajeExtra = '';
            descartados = candidatos.filter(function (c) { return c !== obj; });
            candidatos = [];
            fijarBrillo(obj, 0x000000);
            elegidoNuc = obj;
            obj.userData.desde = obj.position.clone();
            cambiarFase('coloca');
        } else {
            obj.userData.error = performance.now();
            if (op.letra === 'T') {
                mensajeExtra = '<strong>No.</strong> El ARN <strong>no tiene timina (T)</strong>. Frente a una A del ADN, el ARN pone <strong>uracilo (U)</strong>.';
            } else {
                mensajeExtra = '<strong>No.</strong> ' + NOMBRE_BASE[op.letra] + ' (' + op.letra + ') no se aparea con ' + NOMBRE_BASE[molde] + ' (' + molde + '). En la transcripción: A del ADN con U del ARN, T con A, G con C y C con G.';
            }
            actualizarInterfaz();
        }
        actualizarPuntaje();
    }

    /* ---------- Traducción: moléculas para elegir ---------- */
    function codonAlAzar() {
        const lista = Object.keys(CODIGO).filter(function (c) { return CODIGO[c] !== '*'; });
        return lista[Math.floor(Math.random() * lista.length)];
    }

    function distractores(correcto, cantidad) {
        const elegidos = [];
        const usado = function (c) {
            return c === correcto || elegidos.indexOf(c) >= 0 ||
                (aminoacido(correcto) && aminoacido(c).abrev === aminoacido(correcto).abrev);
        };
        // Uno parecido: cambia una sola letra del codón correcto
        for (let intento = 0; intento < 20 && elegidos.length < 1; intento++) {
            const pos = Math.floor(Math.random() * 3);
            const nueva = BASES[Math.floor(Math.random() * 4)];
            const c = correcto.substring(0, pos) + nueva + correcto.substring(pos + 1);
            if (CODIGO[c] !== '*' && !usado(c)) elegidos.push(c);
        }
        while (elegidos.length < cantidad) {
            const c = codonAlAzar();
            if (!usado(c)) elegidos.push(c);
        }
        return elegidos;
    }

    function mostrarCandidatos(codon) {
        const opciones = [];
        if (aminoacido(codon)) {
            opciones.push({ tipo: 'arnt', codon: codon, correcta: true });
            distractores(codon, 2).forEach(function (c) { opciones.push({ tipo: 'arnt', codon: c, correcta: false }); });
        } else {
            opciones.push({ tipo: 'factor', correcta: true });
            distractores(codon, 2).forEach(function (c) { opciones.push({ tipo: 'arnt', codon: c, correcta: false }); });
        }
        opciones.sort(function () { return Math.random() - 0.5; });

        const posiciones = angosto ? POS_CAND_ANGOSTO : POS_CAND;
        candidatos = opciones.map(function (op, i) {
            const obj = op.tipo === 'factor' ? crearFactor() : crearARNt(anticodonDe(op.codon), aminoacido(op.codon));
            obj.scale.setScalar(0.78);
            obj.position.copy(posiciones[i]);
            obj.userData.opcion = op;
            obj.userData.base = posiciones[i].clone();
            obj.userData.escala = 0.78;
            obj.userData.fase0 = Math.random() * 6;
            mundo.add(obj);
            return obj;
        });
    }

    function prepararSiguiente() {
        const codon = CODONES[k + 1];
        mostrarCandidatos(codon);
        cambiarFase(aminoacido(codon) ? 'esperaARNt' : 'esperaTermino');
    }

    function elegir(obj) {
        if (fase === 'esperaNucleotido') {
            elegirNucleotido(obj);
            return;
        }
        if (fase !== 'esperaARNt' && fase !== 'esperaTermino') return;
        const op = obj.userData.opcion;
        const codon = CODONES[k + 1];
        intentos++;
        if (op.correcta) {
            aciertos++;
            mensajeExtra = '';
            descartados = candidatos.filter(function (c) { return c !== obj; });
            candidatos = [];
            fijarBrillo(obj, 0x000000);
            if (op.tipo === 'factor') {
                factor = obj;
                cambiarFase('termino');
            } else {
                entrante = obj;
                cambiarFase('llega');
            }
        } else {
            obj.userData.error = performance.now();
            if (fase === 'esperaTermino') {
                mensajeExtra = '<strong>No.</strong> Ningún ARNt tiene un anticodón para un codón de término. Busca otra molécula.';
            } else {
                mensajeExtra = '<strong>No.</strong> El anticodón <strong>' + obj.userData.anticodon + '</strong> no es complementario a <strong>' + codon + '</strong>. Recuerda: A se aparea con U, y G con C.';
            }
            actualizarInterfaz();
        }
        actualizarPuntaje();
    }

    /* ---------- Acciones ---------- */
    function accion() {
        if (fase === 'adn') cambiarFase('abre');
        else if (fase === 'esperaNucleotido') {
            autoTranscribir = true;
            actualizarInterfaz();
        }
        else if (fase === 'esperaSalida') cambiarFase('exporta');
        else if (fase === 'inicio') cambiarFase('ensambla');
        else if (fase === 'esperaEnlace') cambiarFase('enlace');
        else if (fase === 'esperaAvance') cambiarFase('trasloca');
        else if (fase === 'fin') reiniciar();
    }

    function accionAutomatica() {
        if (fase === 'esperaNucleotido' || fase === 'esperaARNt' || fase === 'esperaTermino') {
            const correcta = candidatos.find(function (c) { return c.userData.opcion.correcta; });
            if (correcta) elegir(correcta);
        } else {
            accion();
        }
    }

    function terminarFase() {
        switch (fase) {
            case 'abre':
                prepararNucleotido();
                break;
            case 'coloca':
                descartados.forEach(limpiar);
                descartados = [];
                limpiar(elegidoNuc);
                elegidoNuc = null;
                nucleotidoARN(grupoTranscrito, ARNM[j], xGen(j + EXTRA));
                j++;
                if (j < ARNM.length) {
                    prepararNucleotido();
                } else {
                    autoTranscribir = false;
                    cambiarFase('esperaSalida');
                }
                break;
            case 'exporta':
                quitarTranscrito();
                fijarOpacidad(grupoARNm, 1);
                cambiarFase('inicio');
                break;
            case 'ensambla':
                prepararSiguiente();
                break;
            case 'llega':
                descartados.forEach(limpiar);
                descartados = [];
                trnas.push(entrante);
                mensajeExtra = '';
                cambiarFase('esperaEnlace');
                break;
            case 'enlace':
                agregarACadena(entrante.userData.aa);
                limpiar(entrante.userData.bola);
                portador = entrante;
                cambiarFase('esperaAvance');
                break;
            case 'trasloca':
                k++;
                cambiarFase('sale');
                break;
            case 'sale':
                limpiar(saliente);
                trnas = trnas.filter(function (tr) { return tr !== saliente; });
                mensajeExtra = '';
                prepararSiguiente();
                break;
            case 'termino':
                descartados.forEach(limpiar);
                descartados = [];
                mensajeExtra = '';
                cambiarFase('libera');
                break;
            case 'libera':
                cambiarFase('fin');
                break;
        }
    }

    /* ---------- Animación de cada fase ---------- */
    function aplicar(e) {
        switch (fase) {
            case 'abre':
                pPol = xGen(0) - 2 + (EXTRA + 2) * e;
                burbuja = e;
                fijarOpacidad(polimerasa, e);
                break;
            case 'coloca': {
                const destino = new THREE.Vector3(xGen(j + EXTRA), 0.35, 0);
                elegidoNuc.position.lerpVectors(elegidoNuc.userData.desde, destino, e);
                elegidoNuc.scale.setScalar(1 - 0.25 * e);
                descartados.forEach(function (d) { fijarOpacidad(d, 1 - e); });
                pPol = polDesde + e;
                break;
            }
            case 'exporta':
                burbuja = 1 - e;
                opacidadADN = 1 - e;
                grupoADN.position.set(0, 2 * e, -5 * e);
                fijarOpacidad(polimerasa, 1 - e);
                polimerasa.position.y = Y_POL + 3 * e;
                fijarOpacidad(grupoARNm, e);
                fijarOpacidad(grupoMayor, 0.5 * e);
                fijarOpacidad(grupoMenor, 0.5 * e);
                break;
            case 'ensambla':
                grupoMayor.position.y = Y_MAYOR + SEP_MAYOR * (1 - e);
                grupoMenor.position.y = Y_MENOR + SEP_MENOR * (1 - e);
                fijarOpacidad(grupoMayor, 0.5 + 0.5 * e);
                fijarOpacidad(grupoMenor, 0.5 + 0.5 * e);
                trnas[0].position.set(0, 3 * (1 - e), 0);
                fijarOpacidad(trnas[0], e);
                fijarOpacidad(grupoCadena, e);
                break;
            case 'llega':
            case 'termino': {
                const obj = fase === 'llega' ? entrante : factor;
                const destino = new THREE.Vector3(3, 0, 0);
                obj.position.lerpVectors(obj.userData.desde, destino, e);
                obj.position.y += Math.sin(Math.PI * e) * 2;
                obj.scale.setScalar(obj.userData.escalaDesde + (1 - obj.userData.escalaDesde) * e);
                descartados.forEach(function (d) { fijarOpacidad(d, 1 - e); });
                break;
            }
            case 'trasloca':
                grupoARNm.position.x = arnmX0 - 3 * e;
                trnas.forEach(function (tr) { tr.position.x = tr.userData.x0 - 3 * e; });
                break;
            case 'sale':
                if (saliente) {
                    saliente.position.copy(saliente.userData.p0).add(new THREE.Vector3(-2.5 * e, 4 * e, 2 * e));
                    fijarOpacidad(saliente, 1 - e);
                }
                break;
            case 'libera':
                grupoCadena.position.set(-3 * e, 5 * e, 3 * e);
                fijarOpacidad(grupoCadena, 1 - e);
                grupoMayor.position.y = Y_MAYOR + SEP_MAYOR * e;
                grupoMenor.position.y = Y_MENOR + SEP_MENOR * e;
                fijarOpacidad(grupoMayor, 1 - 0.5 * e);
                fijarOpacidad(grupoMenor, 1 - 0.5 * e);
                trnas.forEach(function (tr) { fijarOpacidad(tr, 1 - e); });
                if (factor) fijarOpacidad(factor, 1 - e);
                break;
        }
    }

    function actualizar(ahora, dt) {
        let dur = DURACION[fase];
        if (dur && fase === 'coloca' && (autoTranscribir || chkAuto.checked)) dur *= 0.45;
        if (dur) {
            const t = (ahora - inicioFase) / (dur / velocidad);
            aplicar(suave(Math.min(1, t)));
            if (t >= 1) terminarFase();
        } else if (fase === 'esperaNucleotido' && autoTranscribir && ahora - inicioFase > 150 / velocidad) {
            accionAutomatica();
        } else if (chkAuto.checked && ahora - inicioFase > (fase === 'esperaNucleotido' ? 450 : ESPERA_AUTO) / velocidad) {
            accionAutomatica();
        }

        // ADN y ARN polimerasa
        if (fase === 'adn') giro += dt * 0.4;
        polimerasa.position.x = pPol;
        const tiempo = ahora / 1000;
        ubicarADN(tiempo);
        hueco.visible = fase === 'esperaNucleotido';
        if (hueco.visible) {
            hueco.position.set(xGen(j + EXTRA), 0.35, 0);
            hueco.material.opacity = 0.25 + 0.15 * (Math.sin(tiempo * 5) + 1);
        }

        // Ubicar la cadena sobre el ARNt que la sostiene
        let ancla = arribaDe(portador);
        if (fase === 'enlace') {
            const destino = arribaDe(entrante).add(separacion(1));
            const e = suave(Math.min(1, (ahora - inicioFase) / (DURACION.enlace / velocidad)));
            ancla = anclaDesde.clone().lerp(destino, e);
        }
        ubicarCadena(ancla);

        // Moléculas para elegir: flotan, crecen con el cursor y tiemblan si son incorrectas
        candidatos.forEach(function (c) {
            c.position.copy(c.userData.base);
            c.position.y += Math.sin(tiempo * 1.6 + c.userData.fase0) * 0.15;
            c.scale.setScalar(c.userData.escala * (c === hover ? 1.13 : 1));
            const err = c.userData.error ? ahora - c.userData.error : Infinity;
            if (err < 700) {
                c.position.x += Math.sin(err / 25) * 0.18;
                fijarBrillo(c, 0x7f1d1d);
            } else {
                fijarBrillo(c, c === hover ? 0x3b2a05 : 0x000000);
            }
        });

        // El codón del sitio A brilla mientras se espera una elección
        const esperando = fase === 'esperaARNt' || fase === 'esperaTermino';
        const brillo = esperando ? (Math.sin(tiempo * 5) + 1) * 0.25 : 0;
        nucleotidos.forEach(function (n, i) {
            const enA = i >= L + 3 * (k + 1) && i < L + 3 * (k + 2);
            n.material.emissive.setRGB(enA ? brillo : 0, enA ? brillo : 0, enA ? brillo : 0);
        });

        // En el inicio, el ribosoma se resalta al pasar el cursor
        const resaltar = fase === 'inicio' && hover === 'ribosoma';
        fijarBrillo(grupoMayor, resaltar ? 0x331018 : 0x000000);
        fijarBrillo(grupoMenor, resaltar ? 0x332a0a : 0x000000);

        // La cámara sigue la etapa: ADN completo, la polimerasa o el ribosoma
        if (fase === 'adn') {
            objetivoDeseado.set((pares[0].x + pares[pares.length - 1].x) / 2, Y_ADN, 0);
            zoomDeseado = 1.25;
        } else if (TRANSCRIPCION.indexOf(fase) >= 0) {
            objetivoDeseado.set(pPol + 0.5, 3.0, 0);
            zoomDeseado = angosto ? 1.0 : 0.72;
        } else {
            objetivoDeseado.copy(angosto ? OBJETIVO_ANGOSTO : OBJETIVO);
            zoomDeseado = 1;
        }
        const f = 1 - Math.exp(-dt * 3);
        objetivo.lerp(objetivoDeseado, f);
        zoomEtapa += (zoomDeseado - zoomEtapa) * f;
        if (!zoomManual) distancia = distanciaBase * zoomEtapa;
    }

    /* ---------- Textos e interfaz ---------- */
    function aaTexto(aa) {
        return '<strong>' + aa.nombre + ' (' + aa.abrev + ')</strong>';
    }

    function actualizarInterfaz() {
        const codonA = CODONES[k + 1];
        let html = '';
        let boton = '';
        let activo = false;

        switch (fase) {
            case 'adn':
                html = 'Estamos en el <strong>núcleo</strong> de la célula. Esta doble hélice es un <strong>gen</strong> de ADN. <strong>Haz clic en el ADN</strong> (o en el botón) para que la <strong>ARN polimerasa</strong> se una y comience la <strong>transcripción</strong>.';
                boton = 'Iniciar transcripción';
                activo = true;
                break;
            case 'esperaNucleotido': {
                const molde = pares[j + EXTRA].mol.letra;
                html = (j === 0 ? 'La ARN polimerasa abrió la doble hélice. ' : '') +
                    'Lee la <strong>hebra molde</strong>: en esta posición hay <strong>' + NOMBRE_BASE[molde] + ' (' + molde + ')</strong>. ' +
                    '<strong>Haz clic en el nucleótido de ARN</strong> que se aparea con ella. (Nucleótido ' + (j + 1) + ' de ' + ARNM.length + ')';
                boton = autoTranscribir ? 'Transcribiendo...' : 'Completar transcripción';
                activo = !autoTranscribir;
                break;
            }
            case 'esperaSalida':
                html = '<strong>¡ARNm listo!</strong> Copiaste el gen: el ARNm tiene la misma secuencia que la hebra codificante, pero con <strong>U en lugar de T</strong>. Ahora el ARNm debe salir del núcleo hacia el <strong>citoplasma</strong>, donde están los ribosomas.';
                boton = 'Llevar el ARNm al ribosoma';
                activo = true;
                break;
            case 'inicio':
                html = 'El ARNm salió del núcleo y llegó al citoplasma. Las dos subunidades del ribosoma están separadas. <strong>Haz clic en el ribosoma</strong> (o en el botón) para ensamblarlo sobre el ARNm.';
                boton = 'Ensamblar ribosoma';
                activo = true;
                break;
            case 'esperaARNt':
                html = (k === 0
                    ? 'El ribosoma se ensambló y el primer ARNt trajo <strong>Metionina (Met)</strong> al codón de inicio <strong>AUG</strong>, en el sitio P. '
                    : 'El ribosoma avanzó y el ARNt vacío salió por el sitio E. ') +
                    'El codón del sitio A es <strong>' + codonA + '</strong>: <strong>haz clic en el ARNt</strong> cuyo anticodón sea complementario.';
                boton = 'Elige una molécula en la escena';
                break;
            case 'esperaEnlace': {
                const aa = entrante.userData.aa;
                html = '<strong>¡Correcto!</strong> El anticodón <strong>' + entrante.userData.anticodon + '</strong> se aparea con el codón <strong>' + codonA + '</strong> y trae ' + aaTexto(aa) + '. Ahora <strong>forma el enlace peptídico</strong>.';
                boton = 'Formar enlace peptídico';
                activo = true;
                break;
            }
            case 'esperaAvance':
                html = 'La cadena pasó al aminoácido del sitio A, unida por un <strong>enlace peptídico</strong>. Ahora <strong>haz avanzar el ribosoma</strong> un codón (3 nucleótidos).';
                boton = 'Avanzar el ribosoma';
                activo = true;
                break;
            case 'esperaTermino':
                html = 'El ribosoma avanzó y el ARNt vacío salió por el sitio E. El codón del sitio A es <strong>' + codonA + '</strong>, un <strong>codón de término</strong>. ¿Qué molécula entra al sitio A? <strong>Haz clic en la correcta.</strong>';
                boton = 'Elige una molécula en la escena';
                break;
            case 'fin':
                html = '<strong>¡Proteína terminada!</strong> El factor de liberación separa la proteína del último ARNt y el ribosoma se desarma. Proteína formada: <strong>' + nombresCadena.join(' – ') + '</strong>.';
                boton = 'Comenzar de nuevo';
                activo = true;
                break;
            case 'abre':
                html = 'La ARN polimerasa se une al ADN y separa sus dos hebras, como si abriera un cierre...';
                break;
            case 'coloca':
                html = 'El nucleótido se une a la cadena de ARN que se está formando y la ARN polimerasa avanza al siguiente...';
                break;
            case 'exporta':
                html = 'El ARNm se separa del ADN, la doble hélice se vuelve a cerrar y el ARNm sale del núcleo hacia el citoplasma...';
                break;
            case 'ensambla':
                html = 'Las subunidades se unen sobre el ARNm y llega el primer ARNt con Metionina...';
                break;
            case 'llega':
                html = 'El ARNt entra al sitio A y su anticodón se aparea con el codón...';
                break;
            case 'enlace':
                html = 'Se forma el enlace peptídico: la cadena pasa al aminoácido del sitio A...';
                break;
            case 'trasloca':
            case 'sale':
                html = 'Translocación: el ribosoma avanza 3 nucleótidos sobre el ARNm...';
                break;
            case 'termino':
                html = 'El factor de liberación entra al sitio A...';
                break;
            case 'libera':
                html = 'La proteína se libera y las subunidades se separan...';
                break;
        }

        if (mensajeExtra) html = mensajeExtra + '<br>' + html;
        textoEstado.innerHTML = html;
        btnAccion.textContent = boton || 'Animando...';
        btnAccion.disabled = !activo;
    }

    function actualizarProteina() {
        const antes = TRANSCRIPCION.indexOf(fase) >= 0 || fase === 'exporta';
        textoProteina.textContent = antes ? '—' : nombresCadena.join(' – ');
    }

    function actualizarPuntaje() {
        textoPuntaje.textContent = 'Elecciones correctas: ' + aciertos + ' de ' + intentos;
    }

    /* ---------- Mouse y toque: girar, acercar y hacer clic ---------- */
    const lienzo = renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const puntero = new THREE.Vector2();
    let arrastre = null;

    function objetoBajo(e) {
        const r = lienzo.getBoundingClientRect();
        puntero.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        puntero.y = -((e.clientY - r.top) / r.height) * 2 + 1;
        raycaster.setFromCamera(puntero, camara);

        if (fase === 'esperaNucleotido' || fase === 'esperaARNt' || fase === 'esperaTermino') {
            const mallas = [];
            candidatos.forEach(function (c) {
                c.traverse(function (o) { if (o.isMesh) { o.userData.dueno = c; mallas.push(o); } });
            });
            const hit = raycaster.intersectObjects(mallas, false)[0];
            return hit ? hit.object.userData.dueno : null;
        }
        if (fase === 'adn') {
            const mallas = grupoADN.children.filter(function (o) { return o.isMesh; });
            return raycaster.intersectObjects(mallas, false).length ? 'adn' : null;
        }
        if (fase === 'inicio') {
            return raycaster.intersectObjects([mallaMayor, mallaMenor], false).length ? 'ribosoma' : null;
        }
        return null;
    }

    // En celulares y tablets: dos dedos para acercar o alejar (pellizcar)
    const toques = new Map();
    let pellizco = null;

    function distanciaToques() {
        const p = Array.from(toques.values());
        return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
    }

    lienzo.addEventListener('pointerdown', function (e) {
        toques.set(e.pointerId, { x: e.clientX, y: e.clientY });
        lienzo.setPointerCapture(e.pointerId);
        if (toques.size === 2) {
            pellizco = { d: Math.max(1, distanciaToques()), dist: distancia };
            arrastre = null;
            zoomManual = true;
            return;
        }
        arrastre = { x: e.clientX, y: e.clientY, movido: false };
    });

    lienzo.addEventListener('pointermove', function (e) {
        if (toques.has(e.pointerId)) toques.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pellizco && toques.size >= 2) {
            const nueva = pellizco.dist * pellizco.d / Math.max(1, distanciaToques());
            distancia = Math.max(distanciaBase * 0.4, Math.min(distanciaBase * 1.6, nueva));
            return;
        }
        if (arrastre) {
            const dx = e.clientX - arrastre.x;
            const dy = e.clientY - arrastre.y;
            if (Math.abs(dx) + Math.abs(dy) > 4) arrastre.movido = true;
            if (arrastre.movido) {
                yaw -= dx * 0.008;
                pitch = Math.max(-0.25, Math.min(1.0, pitch + dy * 0.006));
                arrastre.x = e.clientX;
                arrastre.y = e.clientY;
                lienzo.style.cursor = 'grabbing';
            }
            return;
        }
        hover = objetoBajo(e);
        lienzo.style.cursor = hover ? 'pointer' : 'grab';
    });

    lienzo.addEventListener('pointercancel', function (e) {
        toques.delete(e.pointerId);
        if (toques.size < 2) pellizco = null;
        arrastre = null;
    });

    lienzo.addEventListener('pointerup', function (e) {
        toques.delete(e.pointerId);
        if (pellizco) {
            if (toques.size < 2) pellizco = null;
            arrastre = null;
            return;
        }
        const fueClic = arrastre && !arrastre.movido;
        arrastre = null;
        lienzo.style.cursor = 'grab';
        if (!fueClic) return;
        const obj = objetoBajo(e);
        if (obj === 'ribosoma' || obj === 'adn') accion();
        else if (obj) elegir(obj);
    });

    lienzo.addEventListener('wheel', function (e) {
        e.preventDefault();
        zoomManual = true;
        distancia = Math.max(distanciaBase * 0.4, Math.min(distanciaBase * 1.6, distancia * (1 + e.deltaY * 0.001)));
    }, { passive: false });

    btnAccion.addEventListener('click', accion);
    btnReiniciar.addEventListener('click', function () {
        aciertos = 0;
        intentos = 0;
        actualizarPuntaje();
        reiniciar();
    });
    btnVista.addEventListener('click', function () {
        yaw = VISTA.yaw;
        pitch = VISTA.pitch;
        zoomManual = false;
    });
    chkAuto.addEventListener('change', function () {
        inicioFase = Math.min(inicioFase, performance.now());
    });

    /* ---------- Velocidad ---------- */
    rangoVelocidad.addEventListener('input', function () {
        const nueva = parseFloat(rangoVelocidad.value);
        const ahora = performance.now();
        // Mantiene el avance de la fase actual al cambiar la velocidad
        inicioFase = ahora - (ahora - inicioFase) * velocidad / nueva;
        velocidad = nueva;
        valorVelocidad.textContent = String(nueva).replace('.', ',') + '×';
    });

    /* ---------- Escribir tu propio ARNm ---------- */
    function usarSecuencia(texto) {
        const r = leerSecuencia(texto);
        if (r.error) {
            notaSecuencia.innerHTML = '<strong>Revisa tu secuencia:</strong> ' + r.error;
            notaSecuencia.classList.add('error');
            return;
        }
        PREVIO = r.previo;
        CODONES = r.codones;
        POSTERIOR = r.posterior;
        ARNM = PREVIO + CODONES.join('') + POSTERIOR;
        entradaARNm.value = ARNM;
        notaSecuencia.classList.remove('error');
        notaSecuencia.innerHTML = 'El ribosoma leerá <strong>' + CODONES.length + ' codones</strong>: ' + CODONES.join(' ') + '. Primero haz clic en el ADN para transcribir el gen.';
        construirARNm();
        aciertos = 0;
        intentos = 0;
        actualizarPuntaje();
        reiniciar();
    }

    function secuenciaAlAzar() {
        const sentido = Object.keys(CODIGO).filter(function (c) { return CODIGO[c] !== '*' && c !== 'AUG'; });
        const terminos = ['UAA', 'UAG', 'UGA'];
        let s = 'GC' + 'AUG';
        const n = 4 + Math.floor(Math.random() * 4);
        for (let i = 0; i < n; i++) s += sentido[Math.floor(Math.random() * sentido.length)];
        return s + terminos[Math.floor(Math.random() * 3)] + 'GCA';
    }

    btnSecuencia.addEventListener('click', function () { usarSecuencia(entradaARNm.value); });
    entradaARNm.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') usarSecuencia(entradaARNm.value);
    });
    btnAzar.addEventListener('click', function () { usarSecuencia(secuenciaAlAzar()); });

    /* ---------- Inicio ---------- */
    // En pantallas táctiles, la ayuda habla de pellizcar en vez de la rueda del mouse
    const ayuda = document.querySelector('.fab-ayuda');
    if (ayuda && window.matchMedia('(pointer: coarse)').matches) {
        ayuda.textContent = 'Arrastra para girar · Pellizca para acercar';
    }

    let ultimo = performance.now();
    function cuadro(ahora) {
        const dt = Math.min(0.05, Math.max(0, (ahora - ultimo) / 1000));
        ultimo = ahora;
        actualizar(ahora, dt);
        ubicarCamara();
        renderer.render(escena, camara);
        requestAnimationFrame(cuadro);
    }

    new ResizeObserver(ajustarTamano).observe(contenedor);
    reiniciar();
    objetivo.set((pares[0].x + pares[pares.length - 1].x) / 2, Y_ADN, 0);
    zoomEtapa = 1.25;
    ajustarTamano();
    actualizarPuntaje();
    requestAnimationFrame(cuadro);
})();
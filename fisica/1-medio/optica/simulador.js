/* =========================================
   SIMULADOR: FORMACIÓN DE IMÁGENES
   Ecuación: 1/f = 1/dₒ + 1/dᵢ    Aumento: m = -dᵢ/dₒ
   Convención: f > 0 convergente (lente convergente, espejo cóncavo)
               f < 0 divergente (lente divergente, espejo convexo)
   ========================================= */

(function () {
    const lienzo = document.getElementById('lienzo');
    const ctx = lienzo.getContext('2d');
    const contenedor = document.getElementById('contenedor-lienzo');

    const COLOR = {
        objeto: '#10B981',
        imagen: '#DC2626',
        rayos: ['#F59E0B', '#8B5CF6', '#0EA5E9'],
        eje: '#94A3B8',
        instrumento: '#6B1C2F',
        texto: '#334155',
        lente: '#0EA5E9'
    };

    const INSTRUMENTOS = {
        'lente-conv':   { lente: true,  signo: 1 },
        'lente-div':    { lente: true,  signo: -1 },
        'espejo-conc':  { lente: false, signo: 1 },
        'espejo-conv':  { lente: false, signo: -1 },
        'espejo-plano': { lente: false, signo: 0 }
    };

    const SITUACIONES = {
        lupa:       { tipo: 'lente-conv',  d: 60,  h: 30, f: 100, texto: 'Lupa: el objeto se ubica entre el foco y la lente convergente. Se forma una imagen virtual, derecha y mayor, por eso vemos los detalles más grandes.' },
        camara:     { tipo: 'lente-conv',  d: 340, h: 80, f: 70,  texto: 'Cámara fotográfica: el objeto está lejos, más allá de 2F. La lente forma una imagen real, invertida y menor sobre el sensor.' },
        proyector:  { tipo: 'lente-conv',  d: 95,  h: 25, f: 70,  texto: 'Proyector: el objeto (la diapositiva) está entre F y 2F. Se forma una imagen real, invertida y mucho mayor sobre la pantalla.' },
        retrovisor: { tipo: 'espejo-conv', d: 250, h: 70, f: 90,  texto: 'Retrovisor de auto: el espejo convexo forma una imagen virtual, derecha y menor, lo que permite ver un campo de visión más amplio.' },
        maquillaje: { tipo: 'espejo-conc', d: 50,  h: 35, f: 90,  texto: 'Espejo de maquillaje: el rostro está entre el foco y el espejo cóncavo. La imagen es virtual, derecha y mayor.' },
        miopia:     { tipo: 'lente-div',   d: 200, h: 60, f: 100, texto: 'Lentes para miopía: la lente divergente separa los rayos para que la imagen se forme más atrás, sobre la retina. Siempre da una imagen virtual, derecha y menor.' }
    };

    const estado = {
        tipo: 'lente-conv',
        d: 150,
        h: 50,
        f: 100,
        rayos: [true, true, true],
        animar: true,
        medidas: true,
        arrastre: null,
        desafio: null,
        aciertos: 0,
        intentos: 0
    };

    let W = 800, H = 440, escala = 1;

    /* ---------- Coordenadas ---------- */
    function X(x) { return W / 2 + x * escala; }
    function Y(y) { return H / 2 - y * escala; }
    function aMundo(px, py) { return { x: (px - W / 2) / escala, y: (H / 2 - py) / escala }; }

    function ajustarTamano() {
        const ancho = contenedor.clientWidth;
        const alto = Math.max(340, Math.min(560, ancho * 0.56));
        const dpr = window.devicePixelRatio || 1;
        W = ancho;
        H = alto;
        lienzo.width = ancho * dpr;
        lienzo.height = alto * dpr;
        lienzo.style.height = alto + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        escala = W / 820;
    }

    /* ---------- Física ---------- */
    function calcular() {
        const ins = INSTRUMENTOS[estado.tipo];
        const d = estado.d, h = estado.h;
        if (ins.signo === 0) {
            return { plano: true, f: Infinity, fe: 1e7, di: -d, hi: h, m: 1 };
        }
        const f = ins.signo * estado.f;
        if (Math.abs(d - f) < 0.5) {
            return { f: f, fe: f, di: Infinity, hi: Infinity, m: Infinity };
        }
        const di = (f * d) / (d - f);
        const m = -di / d;
        return { f: f, fe: f, di: di, hi: m * h, m: m };
    }

    function describir(r) {
        if (!isFinite(r.di)) return null;
        const tipo = r.di < 0 ? 'Virtual' : 'Real';
        const orientacion = r.m > 0 ? 'Derecha' : 'Invertida';
        let tamano = 'Igual';
        if (Math.abs(r.m) > 1.02) tamano = 'Mayor';
        if (Math.abs(r.m) < 0.98) tamano = 'Menor';
        return { tipo: tipo, orientacion: orientacion, tamano: tamano };
    }

    /* ---------- Rayos (se calculan como lente y se reflejan si es espejo) ---------- */
    function calcularRayos(r) {
        const d = estado.d, h = estado.h, fe = r.fe;
        const P = [-d, h];
        const virtual = isFinite(r.di) && r.di < 0;
        const img = [r.di, r.hi];
        const LEJOS = 2000;
        const rayos = [];

        // 1. Rayo paralelo: llega paralelo al eje y sale pasando por el foco
        const dir1 = fe > 0 ? [fe, -h] : [-fe, h];
        const t1 = LEJOS / dir1[0];
        const r1 = [
            { a: P, b: [0, h], tipo: 'entra' },
            { a: [0, h], b: [dir1[0] * t1, h + dir1[1] * t1], tipo: 'sale' }
        ];
        if (fe < 0) r1.push({ a: [0, h], b: [fe, 0], tipo: 'virtual' });
        else if (virtual) r1.push({ a: [0, h], b: img, tipo: 'virtual' });
        rayos.push(r1);

        // 2. Rayo central: pasa por el centro óptico (o llega al vértice del espejo)
        const t2 = LEJOS / d;
        const r2 = [
            { a: P, b: [0, 0], tipo: 'entra' },
            { a: [0, 0], b: [d * t2, -h * t2], tipo: 'sale' }
        ];
        if (virtual) r2.push({ a: [0, 0], b: img, tipo: 'virtual' });
        rayos.push(r2);

        // 3. Rayo focal: pasa (o apunta) al foco y sale paralelo al eje
        if (!r.plano && isFinite(r.di)) {
            const y0 = (-h * fe) / (d - fe);
            const r3 = [
                { a: P, b: [0, y0], tipo: 'entra' },
                { a: [0, y0], b: [LEJOS, y0], tipo: 'sale' }
            ];
            if (fe < 0) r3.push({ a: [0, y0], b: [-fe, 0], tipo: 'guia' });
            if (virtual) r3.push({ a: [0, y0], b: img, tipo: 'virtual' });
            rayos.push(r3);
        } else {
            rayos.push([]);
        }

        // En los espejos la luz se devuelve: se reflejan los tramos de salida
        if (!INSTRUMENTOS[estado.tipo].lente) {
            rayos.forEach(function (rayo) {
                rayo.forEach(function (s) {
                    if (s.tipo === 'sale' || s.tipo === 'virtual') {
                        s.a = [-s.a[0], s.a[1]];
                        s.b = [-s.b[0], s.b[1]];
                    }
                });
            });
        }
        return rayos;
    }

    /* ---------- Dibujo ---------- */
    function linea(x1, y1, x2, y2, color, ancho, guiones) {
        ctx.beginPath();
        ctx.moveTo(X(x1), Y(y1));
        ctx.lineTo(X(x2), Y(y2));
        ctx.strokeStyle = color;
        ctx.lineWidth = ancho;
        ctx.setLineDash(guiones || []);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function flechaEnMedio(s, color) {
        const mx = (X(s.a[0]) + X(s.b[0])) / 2;
        const my = (Y(s.a[1]) + Y(s.b[1])) / 2;
        let px = mx, py = my;
        if (s.tipo === 'sale') {
            const largo = Math.hypot(X(s.b[0]) - X(s.a[0]), Y(s.b[1]) - Y(s.a[1]));
            const k = Math.min(1, 90 / largo);
            px = X(s.a[0]) + (X(s.b[0]) - X(s.a[0])) * k;
            py = Y(s.a[1]) + (Y(s.b[1]) - Y(s.a[1])) * k;
        }
        const ang = Math.atan2(Y(s.b[1]) - Y(s.a[1]), X(s.b[0]) - X(s.a[0]));
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(-5, -5);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    function dibujarFlecha(x, y, color, virtual, etiqueta) {
        const x0 = X(x), y0 = Y(0), y1 = Y(y);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x0, y1);
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.setLineDash(virtual ? [7, 6] : []);
        ctx.stroke();
        ctx.setLineDash([]);
        const dir = y >= 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(x0, y1);
        ctx.lineTo(x0 - 8, y1 + 12 * dir);
        ctx.lineTo(x0 + 8, y1 + 12 * dir);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.globalAlpha = virtual ? 0.6 : 1;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.font = '600 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        // La etiqueta nunca se sale del dibujo (importante en celulares)
        const mitad = ctx.measureText(etiqueta).width / 2 + 4;
        const tx = Math.max(mitad, Math.min(W - mitad, x0));
        const ty = y1 - 10 * dir - (dir < 0 ? -4 : 0);
        ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
        ctx.fillRect(tx - mitad, ty - 12, mitad * 2, 16);
        ctx.fillStyle = color;
        ctx.fillText(etiqueta, tx, ty);
    }

    function dibujarInstrumento() {
        const ins = INSTRUMENTOS[estado.tipo];
        const alto = Math.min(170, (H / 2 - 20) / escala);
        const x0 = X(0), arriba = Y(alto), abajo = Y(-alto);
        const k = 14;
        ctx.lineWidth = 3;
        ctx.strokeStyle = COLOR.instrumento;

        if (estado.tipo === 'lente-conv') {
            ctx.beginPath();
            ctx.moveTo(x0, arriba);
            ctx.quadraticCurveTo(x0 + k * 2, H / 2, x0, abajo);
            ctx.quadraticCurveTo(x0 - k * 2, H / 2, x0, arriba);
            ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
            ctx.fill();
            ctx.strokeStyle = COLOR.lente;
            ctx.stroke();
        } else if (estado.tipo === 'lente-div') {
            ctx.beginPath();
            ctx.moveTo(x0 - k, arriba);
            ctx.lineTo(x0 + k, arriba);
            ctx.quadraticCurveTo(x0 + 2, H / 2, x0 + k, abajo);
            ctx.lineTo(x0 - k, abajo);
            ctx.quadraticCurveTo(x0 - 2, H / 2, x0 - k, arriba);
            ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
            ctx.fill();
            ctx.strokeStyle = COLOR.lente;
            ctx.stroke();
        } else {
            const curva = estado.tipo === 'espejo-conc' ? -k : estado.tipo === 'espejo-conv' ? k : 0;
            ctx.beginPath();
            ctx.moveTo(x0 + curva, arriba);
            ctx.quadraticCurveTo(x0 - curva, H / 2, x0 + curva, abajo);
            ctx.stroke();
            // Rayado en la parte de atrás del espejo
            ctx.lineWidth = 1.5;
            for (let py = arriba + 6; py < abajo; py += 12) {
                const t = (py - arriba) / (abajo - arriba);
                const xb = (1 - t) * (1 - t) * (x0 + curva) + 2 * (1 - t) * t * (x0 - curva) + t * t * (x0 + curva);
                ctx.beginPath();
                ctx.moveTo(xb + 2, py);
                ctx.lineTo(xb + 10, py - 8);
                ctx.stroke();
            }
        }
        if (!ins.lente) {
            ctx.font = '600 11px Inter, sans-serif';
            ctx.fillStyle = COLOR.instrumento;
            ctx.textAlign = 'left';
            ctx.fillText('V', x0 + 6, H / 2 + 14);
        }
    }

    function puntosFocales(r) {
        if (r.plano) return [];
        const f = r.f, ins = INSTRUMENTOS[estado.tipo];
        if (ins.lente) {
            const a = Math.abs(f);
            return [
                { x: -a, etiqueta: 'F', arrastrable: true },
                { x: a, etiqueta: "F'", arrastrable: true },
                { x: -2 * a, etiqueta: '2F' },
                { x: 2 * a, etiqueta: "2F'" }
            ];
        }
        return [
            { x: -f, etiqueta: 'F', arrastrable: true },
            { x: -2 * f, etiqueta: 'C' }
        ];
    }

    function dibujarMedidas(r, verImagen) {
        const yb = Y(0) + 34;
        ctx.font = '600 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        // dₒ
        cota(X(-estado.d), X(0), yb, COLOR.objeto, 'dₒ = ' + Math.round(estado.d) + ' cm');
        // dᵢ
        if (verImagen && isFinite(r.di)) {
            const xi = INSTRUMENTOS[estado.tipo].lente ? r.di : -r.di;
            if (Math.abs(xi) < 1000) {
                cota(X(0), X(xi), yb + 22, COLOR.imagen, 'dᵢ = ' + formato(r.di, 0) + ' cm');
            }
        }
    }

    function cota(x1, x2, y, color, texto) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y - 5); ctx.lineTo(x1, y + 5);
        ctx.moveTo(x2, y - 5); ctx.lineTo(x2, y + 5);
        ctx.moveTo(x1, y); ctx.lineTo(x2, y);
        ctx.stroke();
        const tx = Math.max(50, Math.min(W - 50, (x1 + x2) / 2));
        const ancho = ctx.measureText(texto).width + 10;
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(tx - ancho / 2, y - 8, ancho, 16);
        ctx.fillStyle = color;
        ctx.fillText(texto, tx, y + 4);
    }

    function dibujar(tiempo) {
        const r = calcular();
        const ins = INSTRUMENTOS[estado.tipo];
        const oculto = estado.desafio && !estado.desafio.revelado;

        ctx.clearRect(0, 0, W, H);

        // Cuadrícula suave
        ctx.strokeStyle = '#eef2f6';
        ctx.lineWidth = 1;
        const paso = 50 * escala;
        for (let x = W / 2 % paso; x < W; x += paso) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = H / 2 % paso; y < H; y += paso) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Eje principal
        ctx.beginPath();
        ctx.moveTo(0, Y(0)); ctx.lineTo(W, Y(0));
        ctx.strokeStyle = COLOR.eje;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Zona detrás del espejo
        if (!ins.lente) {
            ctx.fillStyle = 'rgba(148, 163, 184, 0.08)';
            ctx.fillRect(X(0), 0, W - X(0), H);
        }

        // Rayos
        if (!oculto) {
            const rayos = calcularRayos(r);
            rayos.forEach(function (rayo, i) {
                if (!estado.rayos[i]) return;
                const color = COLOR.rayos[i];
                rayo.forEach(function (s) {
                    if (s.tipo === 'virtual' || s.tipo === 'guia') {
                        ctx.globalAlpha = 0.75;
                        linea(s.a[0], s.a[1], s.b[0], s.b[1], color, 1.5, [6, 6]);
                        ctx.globalAlpha = 1;
                        return;
                    }
                    if (estado.animar) {
                        ctx.globalAlpha = 0.35;
                        linea(s.a[0], s.a[1], s.b[0], s.b[1], color, 2);
                        ctx.globalAlpha = 1;
                        ctx.beginPath();
                        ctx.moveTo(X(s.a[0]), Y(s.a[1]));
                        ctx.lineTo(X(s.b[0]), Y(s.b[1]));
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 3;
                        ctx.setLineDash([10, 16]);
                        ctx.lineDashOffset = -(tiempo || 0) * 0.06;
                        ctx.stroke();
                        ctx.setLineDash([]);
                        ctx.lineDashOffset = 0;
                    } else {
                        linea(s.a[0], s.a[1], s.b[0], s.b[1], color, 2);
                    }
                    flechaEnMedio(s, color);
                });
            });
        }

        // Instrumento
        dibujarInstrumento();

        // Focos
        puntosFocales(r).forEach(function (p) {
            ctx.beginPath();
            ctx.arc(X(p.x), Y(0), p.arrastrable ? 6 : 4, 0, Math.PI * 2);
            ctx.fillStyle = p.arrastrable ? COLOR.instrumento : '#64748b';
            ctx.fill();
            if (p.arrastrable) {
                ctx.beginPath();
                ctx.arc(X(p.x), Y(0), 10, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(107, 28, 47, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            ctx.font = '700 12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = COLOR.texto;
            ctx.fillText(p.etiqueta, X(p.x), Y(0) + 24);
        });

        // Objeto
        dibujarFlecha(-estado.d, estado.h, COLOR.objeto, false, 'Objeto');
        ctx.beginPath();
        ctx.arc(X(-estado.d), Y(estado.h), 7, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = COLOR.objeto;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Medidas primero, para que la etiqueta de la imagen quede encima
        if (estado.medidas) dibujarMedidas(r, !oculto);

        // Imagen
        if (!oculto && isFinite(r.di)) {
            const xi = ins.lente ? r.di : -r.di;
            if (Math.abs(xi) < 1000 && Math.abs(r.hi) < 2000) {
                dibujarFlecha(xi, r.hi, COLOR.imagen, r.di < 0, r.di < 0 ? 'Imagen virtual' : 'Imagen real');
            }
        }

        if (!oculto && !isFinite(r.di)) {
            ctx.font = '600 13px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = COLOR.imagen;
            const aviso = 'El objeto está en el foco: los rayos salen paralelos y no se forma imagen';
            if (ctx.measureText(aviso).width < W - 20) {
                ctx.fillText(aviso, W / 2, 24);
            } else {
                // En pantallas angostas el aviso va en dos líneas
                ctx.font = '600 12px Inter, sans-serif';
                ctx.fillText('El objeto está en el foco:', W / 2, 22);
                ctx.fillText('los rayos salen paralelos y no se forma imagen', W / 2, 38);
            }
        }

        requestAnimationFrame(dibujar);
    }

    /* ---------- Resultados en pantalla ---------- */
    function formato(n, dec) {
        return n.toFixed(dec).replace('.', ',');
    }

    function actualizarTextos() {
        const r = calcular();
        const ins = INSTRUMENTOS[estado.tipo];
        document.getElementById('valor-d').textContent = Math.round(estado.d) + ' cm';
        document.getElementById('valor-h').textContent = Math.round(estado.h) + ' cm';
        document.getElementById('valor-f').textContent = Math.round(estado.f) + ' cm';
        document.getElementById('rango-d').value = estado.d;
        document.getElementById('rango-h').value = estado.h;
        document.getElementById('rango-f').value = estado.f;
        document.getElementById('grupo-f').classList.toggle('deshabilitado', ins.signo === 0);
        document.getElementById('nombre-r2').textContent = ins.lente ? 'Rayo por el centro óptico' : 'Rayo al vértice';

        const oculto = estado.desafio && !estado.desafio.revelado;
        const desc = describir(r);
        const campos = {
            'res-tipo': desc ? desc.tipo : '—',
            'res-orientacion': desc ? desc.orientacion : '—',
            'res-tamano': desc ? desc.tamano : '—',
            'res-di': isFinite(r.di) ? formato(r.di, 1) + ' cm' : 'Infinita',
            'res-m': isFinite(r.m) ? formato(r.m, 2) : '—'
        };
        Object.keys(campos).forEach(function (id) {
            document.getElementById(id).textContent = oculto ? '?' : campos[id];
        });

        const ec = document.getElementById('ecuacion');
        if (oculto) {
            ec.textContent = 'Predice la imagen y luego presiona "Comprobar".';
        } else if (r.plano) {
            ec.textContent = 'En un espejo plano la imagen está a la misma distancia detrás del espejo: dᵢ = −dₒ = ' + formato(r.di, 0) + ' cm, y el aumento es m = 1.';
        } else if (!isFinite(r.di)) {
            ec.textContent = '1/f = 1/dₒ + 1/dᵢ  →  como dₒ = f, 1/dᵢ = 0: la imagen se forma en el infinito.';
        } else {
            ec.textContent = '1/f = 1/dₒ + 1/dᵢ  →  1/(' + formato(r.f, 0) + ') = 1/' + formato(estado.d, 0) + ' + 1/dᵢ  →  dᵢ = ' + formato(r.di, 1) + ' cm.   Aumento: m = −dᵢ/dₒ = ' + formato(r.m, 2);
        }
    }

    /* ---------- Controles ---------- */
    function elegirInstrumento(tipo) {
        estado.tipo = tipo;
        document.querySelectorAll('#instrumentos button').forEach(function (b) {
            b.classList.toggle('activo', b.dataset.tipo === tipo);
        });
        actualizarTextos();
    }

    document.querySelectorAll('#instrumentos button').forEach(function (b) {
        b.addEventListener('click', function () {
            if (bloqueado()) return;
            elegirInstrumento(b.dataset.tipo);
            limpiarSituacion();
        });
    });

    [['rango-d', 'd'], ['rango-h', 'h'], ['rango-f', 'f']].forEach(function (par) {
        document.getElementById(par[0]).addEventListener('input', function (e) {
            if (bloqueado()) { actualizarTextos(); return; }
            estado[par[1]] = parseFloat(e.target.value);
            actualizarTextos();
        });
    });

    ['ver-r1', 'ver-r2', 'ver-r3'].forEach(function (id, i) {
        document.getElementById(id).addEventListener('change', function (e) {
            estado.rayos[i] = e.target.checked;
        });
    });
    document.getElementById('ver-animacion').addEventListener('change', function (e) { estado.animar = e.target.checked; });
    document.getElementById('ver-medidas').addEventListener('change', function (e) { estado.medidas = e.target.checked; });

    /* ---------- Arrastrar en el lienzo ---------- */
    function posicion(e) {
        const rect = lienzo.getBoundingClientRect();
        return { px: e.clientX - rect.left, py: e.clientY - rect.top };
    }

    // Con el dedo la zona para agarrar es más grande que con el mouse
    let radio = 16;

    function queHay(px, py) {
        const ox = X(-estado.d), oy = Y(estado.h);
        if (Math.hypot(px - ox, py - oy) < radio) return 'objeto';
        if (Math.abs(px - ox) < radio * 0.65 && py > Math.min(oy, Y(0)) && py < Math.max(oy, Y(0))) return 'objeto';
        const r = calcular();
        const hit = puntosFocales(r).find(function (p) {
            return p.arrastrable && Math.hypot(px - X(p.x), py - Y(0)) < radio - 2;
        });
        return hit ? 'foco' : null;
    }

    lienzo.addEventListener('pointerdown', function (e) {
        if (bloqueado()) return;
        radio = e.pointerType === 'touch' ? 28 : 16;
        const p = posicion(e);
        estado.arrastre = queHay(p.px, p.py);
        if (estado.arrastre) {
            lienzo.setPointerCapture(e.pointerId);
            lienzo.style.cursor = 'grabbing';
            limpiarSituacion();
        }
    });

    lienzo.addEventListener('pointermove', function (e) {
        const p = posicion(e);
        if (!estado.arrastre) {
            lienzo.style.cursor = queHay(p.px, p.py) && !bloqueado() ? 'grab' : 'default';
            return;
        }
        const m = aMundo(p.px, p.py);
        if (estado.arrastre === 'objeto') {
            estado.d = Math.round(Math.max(10, Math.min(380, -m.x)));
            estado.h = Math.round(Math.max(10, Math.min(120, m.y)));
        } else {
            estado.f = Math.round(Math.max(20, Math.min(250, Math.abs(m.x))));
        }
        actualizarTextos();
    });

    function soltar() {
        estado.arrastre = null;
        lienzo.style.cursor = 'default';
    }
    lienzo.addEventListener('pointerup', soltar);
    lienzo.addEventListener('pointercancel', soltar);

    /* ---------- Situaciones reales ---------- */
    function limpiarSituacion() {
        document.querySelectorAll('#situaciones button').forEach(function (b) { b.classList.remove('activo'); });
    }

    document.querySelectorAll('#situaciones button').forEach(function (b) {
        b.addEventListener('click', function () {
            if (bloqueado()) return;
            const s = SITUACIONES[b.dataset.caso];
            estado.d = s.d; estado.h = s.h; estado.f = s.f;
            elegirInstrumento(s.tipo);
            limpiarSituacion();
            b.classList.add('activo');
            document.getElementById('texto-situacion').textContent = s.texto;
        });
    });

    /* ---------- Modo desafío ---------- */
    const panelDesafio = document.getElementById('panel-desafio');
    const btnDesafio = document.getElementById('btn-desafio');

    function bloqueado() {
        return estado.desafio && !estado.desafio.revelado;
    }

    function azar(min, max) { return Math.round(min + Math.random() * (max - min)); }

    function nuevoDesafio() {
        const tipos = ['lente-conv', 'lente-conv', 'lente-div', 'espejo-conc', 'espejo-conc', 'espejo-conv'];
        let tipo, d, f, r;
        do {
            tipo = tipos[azar(0, tipos.length - 1)];
            f = azar(60, 140);
            d = azar(30, 340);
            estado.tipo = tipo; estado.d = d; estado.f = f;
            r = calcular();
        } while (!isFinite(r.di) || Math.abs(r.di) > 380 || Math.abs(Math.abs(r.m) - 1) < 0.08 || Math.abs(r.m) > 3.5);
        estado.h = azar(30, 60);
        estado.desafio = { revelado: false, respuestas: {} };
        elegirInstrumento(tipo);
        document.querySelectorAll('.sim-pregunta button').forEach(function (b) { b.className = ''; });
        document.getElementById('feedback').textContent = '';
        actualizarTextos();
    }

    btnDesafio.addEventListener('click', function () {
        if (estado.desafio) {
            estado.desafio = null;
            panelDesafio.hidden = true;
            btnDesafio.textContent = 'Modo desafío';
            actualizarTextos();
        } else {
            panelDesafio.hidden = false;
            btnDesafio.textContent = 'Salir del desafío';
            limpiarSituacion();
            nuevoDesafio();
        }
    });

    document.querySelectorAll('.sim-pregunta').forEach(function (grupo) {
        grupo.querySelectorAll('button').forEach(function (b) {
            b.addEventListener('click', function () {
                if (!estado.desafio || estado.desafio.revelado) return;
                grupo.querySelectorAll('button').forEach(function (x) { x.classList.remove('elegido'); });
                b.classList.add('elegido');
                estado.desafio.respuestas[grupo.dataset.clave] = b.dataset.valor;
            });
        });
    });

    document.getElementById('btn-comprobar').addEventListener('click', function () {
        if (!estado.desafio || estado.desafio.revelado) return;
        const resp = estado.desafio.respuestas;
        if (!resp.tipo || !resp.orientacion || !resp.tamano) {
            document.getElementById('feedback').textContent = 'Responde las tres preguntas antes de comprobar.';
            return;
        }
        const correcta = describir(calcular());
        let buenas = 0;
        document.querySelectorAll('.sim-pregunta').forEach(function (grupo) {
            const clave = grupo.dataset.clave;
            grupo.querySelectorAll('button').forEach(function (b) {
                b.classList.remove('elegido');
                if (b.dataset.valor === correcta[clave]) b.classList.add('correcto');
                else if (b.dataset.valor === resp[clave]) b.classList.add('incorrecto');
            });
            if (resp[clave] === correcta[clave]) buenas++;
        });
        estado.intentos += 3;
        estado.aciertos += buenas;
        estado.desafio.revelado = true;
        document.getElementById('puntaje').textContent = 'Aciertos: ' + estado.aciertos + ' de ' + estado.intentos;
        document.getElementById('feedback').textContent = buenas === 3
            ? '¡Excelente! Acertaste las tres características. Observa los rayos para confirmar por qué.'
            : 'Acertaste ' + buenas + ' de 3. Observa dónde se cruzan los rayos (o sus prolongaciones) para entender la respuesta.';
        actualizarTextos();
    });

    document.getElementById('btn-nuevo').addEventListener('click', nuevoDesafio);

    /* ---------- Inicio ---------- */
    new ResizeObserver(ajustarTamano).observe(contenedor);
    ajustarTamano();
    actualizarTextos();
    requestAnimationFrame(dibujar);
})();
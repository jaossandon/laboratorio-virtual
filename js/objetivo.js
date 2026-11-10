/* =========================================
   OBJETIVO DE LA CLASE: botón "Copiar"
   Sirve para todas las animaciones con OA.
   El botón lleva data-copiar="id-del-texto" y copia
   todo el texto de ese bloque (objetivo + indicador).
   ========================================= */

(function () {
    function textoLimpio(elemento) {
        return Array.from(elemento.querySelectorAll('p'))
            .map(function (p) { return p.innerText.replace(/\s+/g, ' ').trim(); })
            .join('\n');
    }

    function copiarRespaldo(texto) {
        const area = document.createElement('textarea');
        area.value = texto;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        document.body.removeChild(area);
    }

    function avisar(boton) {
        boton.textContent = '¡Copiado!';
        boton.classList.add('copiado');
        setTimeout(function () {
            boton.textContent = 'Copiar';
            boton.classList.remove('copiado');
        }, 1800);
    }

    document.querySelectorAll('.btn-copiar').forEach(function (boton) {
        boton.addEventListener('click', function () {
            const bloque = document.getElementById(boton.dataset.copiar);
            if (!bloque) return;
            const texto = textoLimpio(bloque);
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(texto).then(function () { avisar(boton); }, function () {
                    copiarRespaldo(texto);
                    avisar(boton);
                });
            } else {
                copiarRespaldo(texto);
                avisar(boton);
            }
        });
    });
})();
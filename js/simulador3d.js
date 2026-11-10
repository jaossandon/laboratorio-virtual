let scene, camera, renderer, atomGroup;
let animationId = null;

function initSimulador3D() {
    const container = document.getElementById('canvasContainer');
    if (scene) return;

    scene = new THREE.Scene();
    
    // Zoom aumentado: Cámara en Z=15 en lugar de 28
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15; 

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Iluminación ajustada para resaltar los reflejos en fondo claro
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.9);
    pointLight.position.set(15, 15, 15);
    scene.add(pointLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.4);
    fillLight.position.set(-15, -15, 15);
    scene.add(fillLight);

    atomGroup = new THREE.Group();
    scene.add(atomGroup);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate3D();
}

function construirAtomo3D(protones, neutrones, electrones) {
    initSimulador3D();
    
    while(atomGroup.children.length > 0) {
        atomGroup.remove(atomGroup.children[0]);
    }

    // Materiales modernos (Cerámica/Polímero)
    const matProton = new THREE.MeshPhysicalMaterial({ color: 0xef4444, metalness: 0.1, roughness: 0.3, clearcoat: 1.0 });
    const matNeutron = new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, metalness: 0.1, roughness: 0.3, clearcoat: 1.0 });
    const matElectron = new THREE.MeshPhysicalMaterial({ color: 0xfacc15, metalness: 0.2, roughness: 0.2, clearcoat: 1.0 });
    
    // Órbitas en gris oscuro para contrastar con el fondo claro
    const matOrbita = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.3 });

    // Esferas más suaves (más polígonos)
    const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32); 

    // 1. Núcleo Atómico
    const nucleusGroup = new THREE.Group();
    const totalNucleones = protones + neutrones;
    
    for (let i = 0; i < totalNucleones; i++) {
        const isProton = i < protones;
        const mesh = new THREE.Mesh(sphereGeo, isProton ? matProton : matNeutron);
        
        if (totalNucleones === 1) {
            mesh.position.set(0, 0, 0);
        } else {
            // Núcleo un poco más compacto
            const radius = Math.cbrt(totalNucleones) * 0.38 * Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            mesh.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
        }
        nucleusGroup.add(mesh);
    }
    atomGroup.add(nucleusGroup);

    // 2. Modelo de Bohr (Órbitas y Electrones)
    const capas = [2, 8, 18, 32, 32, 18, 8];
    let remElectrones = electrones;
    let capaIdx = 0;

    while (remElectrones > 0 && capaIdx < capas.length) {
        const eInShell = Math.min(remElectrones, capas[capaIdx]);
        // Órbitas más comprimidas para ajustarse al nuevo Zoom
        const radiusOrbit = 2.5 + (capaIdx * 1.6);

        const points = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(angle) * radiusOrbit, Math.sin(angle) * radiusOrbit, 0));
        }
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
        const orbitLine = new THREE.Line(orbitGeo, matOrbita);

        const orbitGroup = new THREE.Group();
        orbitGroup.add(orbitLine);

        for (let i = 0; i < eInShell; i++) {
            const eMesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 24), matElectron);
            const angle = (i / eInShell) * Math.PI * 2;
            eMesh.position.set(Math.cos(angle) * radiusOrbit, Math.sin(angle) * radiusOrbit, 0);
            orbitGroup.add(eMesh);
        }

        orbitGroup.rotation.x = Math.random() * Math.PI;
        orbitGroup.rotation.y = Math.random() * Math.PI;
        orbitGroup.userData.speed = 0.012 - (capaIdx * 0.0015);

        atomGroup.add(orbitGroup);
        remElectrones -= eInShell;
        capaIdx++;
    }
}

function animate3D() {
    animationId = requestAnimationFrame(animate3D);
    if (atomGroup) {
        atomGroup.rotation.y += 0.002;
        atomGroup.rotation.x += 0.001;

        for (let i = 1; i < atomGroup.children.length; i++) {
            const orbit = atomGroup.children[i];
            if (orbit.userData.speed) {
                orbit.rotation.z += orbit.userData.speed;
            }
        }
    }
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function detenerSimulacion3D() {
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}
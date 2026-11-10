// data.js
const elementosData = [
    // Fila 1
    { z: 1, simbolo: 'H', nombre: 'Hidrógeno', masa: '1.008', familia: 'no-metal', col: 1, row: 1, isotopos: [
        { nombre: 'Protio (H-1)', protones: 1, neutrones: 0 },
        { nombre: 'Deuterio (H-2)', protones: 1, neutrones: 1 },
        { nombre: 'Tritio (H-3)', protones: 1, neutrones: 2 }
    ]},
    { z: 2, simbolo: 'He', nombre: 'Helio', masa: '4.0026', familia: 'gas-noble', col: 18, row: 1, isotopos: [
        { nombre: 'Helio-3', protones: 2, neutrones: 1 },
        { nombre: 'Helio-4', protones: 2, neutrones: 2 }
    ]},
    // Fila 2
    { z: 3, simbolo: 'Li', nombre: 'Litio', masa: '6.94', familia: 'alcalino', col: 1, row: 2, isotopos: [
        { nombre: 'Litio-6', protones: 3, neutrones: 3 },
        { nombre: 'Litio-7', protones: 3, neutrones: 4 }
    ]},
    { z: 4, simbolo: 'Be', nombre: 'Berilio', masa: '9.0122', familia: 'alcalinoterreo', col: 2, row: 2, isotopos: [
        { nombre: 'Berilio-9', protones: 4, neutrones: 5 }
    ]},
    { z: 5, simbolo: 'B', nombre: 'Boro', masa: '10.81', familia: 'metaloide', col: 13, row: 2, isotopos: [
        { nombre: 'Boro-10', protones: 5, neutrones: 5 },
        { nombre: 'Boro-11', protones: 5, neutrones: 6 }
    ]},
    { z: 6, simbolo: 'C', nombre: 'Carbono', masa: '12.011', familia: 'no-metal', col: 14, row: 2, isotopos: [
        { nombre: 'Carbono-12', protones: 6, neutrones: 6 },
        { nombre: 'Carbono-13', protones: 6, neutrones: 7 },
        { nombre: 'Carbono-14 (Radioactivo)', protones: 6, neutrones: 8 }
    ]},
    { z: 7, simbolo: 'N', nombre: 'Nitrógeno', masa: '14.007', familia: 'no-metal', col: 15, row: 2, isotopos: [
        { nombre: 'Nitrógeno-14', protones: 7, neutrones: 7 },
        { nombre: 'Nitrógeno-15', protones: 7, neutrones: 8 }
    ]},
    { z: 8, simbolo: 'O', nombre: 'Oxígeno', masa: '15.999', familia: 'no-metal', col: 16, row: 2, isotopos: [
        { nombre: 'Oxígeno-16', protones: 8, neutrones: 8 },
        { nombre: 'Oxígeno-17', protones: 8, neutrones: 9 },
        { nombre: 'Oxígeno-18', protones: 8, neutrones: 10 }
    ]},
    { z: 9, simbolo: 'F', nombre: 'Flúor', masa: '18.998', familia: 'halogeno', col: 17, row: 2, isotopos: [
        { nombre: 'Flúor-19', protones: 9, neutrones: 10 }
    ]},
    { z: 10, simbolo: 'Ne', nombre: 'Neón', masa: '20.180', familia: 'gas-noble', col: 18, row: 2, isotopos: [
        { nombre: 'Neón-20', protones: 10, neutrones: 10 },
        { nombre: 'Neón-22', protones: 10, neutrones: 12 }
    ]},
    // Fila 3
    { z: 11, simbolo: 'Na', nombre: 'Sodio', masa: '22.990', familia: 'alcalino', col: 1, row: 3, isotopos: [{ nombre: 'Sodio-23', protones: 11, neutrones: 12 }] },
    { z: 12, simbolo: 'Mg', nombre: 'Magnesio', masa: '24.305', familia: 'alcalinoterreo', col: 2, row: 3, isotopos: [{ nombre: 'Magnesio-24', protones: 12, neutrones: 12 }] },
    { z: 13, simbolo: 'Al', nombre: 'Aluminio', masa: '26.982', familia: 'post-transicion', col: 13, row: 3, isotopos: [{ nombre: 'Aluminio-27', protones: 13, neutrones: 14 }] },
    { z: 14, simbolo: 'Si', nombre: 'Silicio', masa: '28.085', familia: 'metaloide', col: 14, row: 3, isotopos: [{ nombre: 'Silicio-28', protones: 14, neutrones: 14 }] },
    { z: 15, simbolo: 'P', nombre: 'Fósforo', masa: '30.974', familia: 'no-metal', col: 15, row: 3, isotopos: [{ nombre: 'Fósforo-31', protones: 15, neutrones: 16 }] },
    { z: 16, simbolo: 'S', nombre: 'Azufre', masa: '32.06', familia: 'no-metal', col: 16, row: 3, isotopos: [{ nombre: 'Azufre-32', protones: 16, neutrones: 16 }] },
    { z: 17, simbolo: 'Cl', nombre: 'Cloro', masa: '35.45', familia: 'halogeno', col: 17, row: 3, isotopos: [{ nombre: 'Cloro-35', protones: 17, neutrones: 18 }, { nombre: 'Cloro-37', protones: 17, neutrones: 20 }] },
    { z: 18, simbolo: 'Ar', nombre: 'Argón', masa: '39.95', familia: 'gas-noble', col: 18, row: 3, isotopos: [{ nombre: 'Argón-40', protones: 18, neutrones: 22 }] },
    // Fila 4
    { z: 19, simbolo: 'K', nombre: 'Potasio', masa: '39.098', familia: 'alcalino', col: 1, row: 4, isotopos: [{ nombre: 'Potasio-39', protones: 19, neutrones: 20 }] },
    { z: 20, simbolo: 'Ca', nombre: 'Calcio', masa: '40.078', familia: 'alcalinoterreo', col: 2, row: 4, isotopos: [{ nombre: 'Calcio-40', protones: 20, neutrones: 20 }] },
    { z: 21, simbolo: 'Sc', nombre: 'Escandio', masa: '44.956', familia: 'transicion', col: 3, row: 4, isotopos: [{ nombre: 'Escandio-45', protones: 21, neutrones: 24 }] },
    { z: 22, simbolo: 'Ti', nombre: 'Titanio', masa: '47.867', familia: 'transicion', col: 4, row: 4, isotopos: [{ nombre: 'Titanio-48', protones: 22, neutrones: 26 }] },
    { z: 23, simbolo: 'V', nombre: 'Vanadio', masa: '50.942', familia: 'transicion', col: 5, row: 4, isotopos: [{ nombre: 'Vanadio-51', protones: 23, neutrones: 28 }] },
    { z: 24, simbolo: 'Cr', nombre: 'Cromo', masa: '51.996', familia: 'transicion', col: 6, row: 4, isotopos: [{ nombre: 'Cromo-52', protones: 24, neutrones: 28 }] },
    { z: 25, simbolo: 'Mn', nombre: 'Manganeso', masa: '54.938', familia: 'transicion', col: 7, row: 4, isotopos: [{ nombre: 'Manganeso-55', protones: 25, neutrones: 30 }] },
    { z: 26, simbolo: 'Fe', nombre: 'Hierro', masa: '55.845', familia: 'transicion', col: 8, row: 4, isotopos: [{ nombre: 'Hierro-56', protones: 26, neutrones: 30 }, { nombre: 'Hierro-54', protones: 26, neutrones: 28 }] },
    { z: 27, simbolo: 'Co', nombre: 'Cobalto', masa: '58.933', familia: 'transicion', col: 9, row: 4, isotopos: [{ nombre: 'Cobalto-59', protones: 27, neutrones: 32 }] },
    { z: 28, simbolo: 'Ni', nombre: 'Níquel', masa: '58.693', familia: 'transicion', col: 10, row: 4, isotopos: [{ nombre: 'Níquel-58', protones: 28, neutrones: 30 }] },
    { z: 29, simbolo: 'Cu', nombre: 'Cobre', masa: '63.546', familia: 'transicion', col: 11, row: 4, isotopos: [{ nombre: 'Cobre-63', protones: 29, neutrones: 34 }, { nombre: 'Cobre-65', protones: 29, neutrones: 36 }] },
    { z: 30, simbolo: 'Zn', nombre: 'Zinc', masa: '65.38', familia: 'transicion', col: 12, row: 4, isotopos: [{ nombre: 'Zinc-64', protones: 30, neutrones: 34 }] },
    { z: 31, simbolo: 'Ga', nombre: 'Galio', masa: '69.723', familia: 'post-transicion', col: 13, row: 4, isotopos: [{ nombre: 'Galio-69', protones: 31, neutrones: 38 }] },
    { z: 32, simbolo: 'Ge', nombre: 'Germanio', masa: '72.630', familia: 'metaloide', col: 14, row: 4, isotopos: [{ nombre: 'Germanio-74', protones: 32, neutrones: 42 }] },
    { z: 33, simbolo: 'As', nombre: 'Arsénico', masa: '74.922', familia: 'metaloide', col: 15, row: 4, isotopos: [{ nombre: 'Arsénico-75', protones: 33, neutrones: 42 }] },
    { z: 34, simbolo: 'Se', nombre: 'Selenio', masa: '78.971', familia: 'no-metal', col: 16, row: 4, isotopos: [{ nombre: 'Selenio-80', protones: 34, neutrones: 46 }] },
    { z: 35, simbolo: 'Br', nombre: 'Bromo', masa: '79.904', familia: 'halogeno', col: 17, row: 4, isotopos: [{ nombre: 'Bromo-79', protones: 35, neutrones: 44 }] },
    { z: 36, simbolo: 'Kr', nombre: 'Kriptón', masa: '83.798', familia: 'gas-noble', col: 18, row: 4, isotopos: [{ nombre: 'Kriptón-84', protones: 36, neutrones: 48 }] },
    // Fila 5
    { z: 37, simbolo: 'Rb', nombre: 'Rubidio', masa: '85.468', familia: 'alcalino', col: 1, row: 5, isotopos: [{ nombre: 'Rubidio-85', protones: 37, neutrones: 48 }] },
    { z: 38, simbolo: 'Sr', nombre: 'Estroncio', masa: '87.62', familia: 'alcalinoterreo', col: 2, row: 5, isotopos: [{ nombre: 'Estroncio-88', protones: 38, neutrones: 50 }] },
    { z: 39, simbolo: 'Y', nombre: 'Itrio', masa: '88.906', familia: 'transicion', col: 3, row: 5, isotopos: [{ nombre: 'Itrio-89', protones: 39, neutrones: 50 }] },
    { z: 40, simbolo: 'Zr', nombre: 'Circonio', masa: '91.224', familia: 'transicion', col: 4, row: 5, isotopos: [{ nombre: 'Circonio-90', protones: 40, neutrones: 50 }] },
    { z: 41, simbolo: 'Nb', nombre: 'Niobio', masa: '92.906', familia: 'transicion', col: 5, row: 5, isotopos: [{ nombre: 'Niobio-93', protones: 41, neutrones: 52 }] },
    { z: 42, simbolo: 'Mo', nombre: 'Molibdeno', masa: '95.95', familia: 'transicion', col: 6, row: 5, isotopos: [{ nombre: 'Molibdeno-98', protones: 42, neutrones: 56 }] },
    { z: 43, simbolo: 'Tc', nombre: 'Tecnecio', masa: '[98]', familia: 'transicion', col: 7, row: 5, isotopos: [{ nombre: 'Tecnecio-98', protones: 43, neutrones: 55 }] },
    { z: 44, simbolo: 'Ru', nombre: 'Rutenio', masa: '101.07', familia: 'transicion', col: 8, row: 5, isotopos: [{ nombre: 'Rutenio-102', protones: 44, neutrones: 58 }] },
    { z: 45, simbolo: 'Rh', nombre: 'Rodio', masa: '102.91', familia: 'transicion', col: 9, row: 5, isotopos: [{ nombre: 'Rodio-103', protones: 45, neutrones: 58 }] },
    { z: 46, simbolo: 'Pd', nombre: 'Paladio', masa: '106.42', familia: 'transicion', col: 10, row: 5, isotopos: [{ nombre: 'Paladio-106', protones: 46, neutrones: 60 }] },
    { z: 47, simbolo: 'Ag', nombre: 'Plata', masa: '107.87', familia: 'transicion', col: 11, row: 5, isotopos: [{ nombre: 'Plata-107', protones: 47, neutrones: 60 }, { nombre: 'Plata-109', protones: 47, neutrones: 62 }] },
    { z: 48, simbolo: 'Cd', nombre: 'Cadmio', masa: '112.41', familia: 'transicion', col: 12, row: 5, isotopos: [{ nombre: 'Cadmio-114', protones: 48, neutrones: 66 }] },
    { z: 49, simbolo: 'In', nombre: 'Indio', masa: '114.82', familia: 'post-transicion', col: 13, row: 5, isotopos: [{ nombre: 'Indio-115', protones: 49, neutrones: 66 }] },
    { z: 50, simbolo: 'Sn', nombre: 'Estaño', masa: '118.71', familia: 'post-transicion', col: 14, row: 5, isotopos: [{ nombre: 'Estaño-120', protones: 50, neutrones: 70 }] },
    { z: 51, simbolo: 'Sb', nombre: 'Antimonio', masa: '121.76', familia: 'metaloide', col: 15, row: 5, isotopos: [{ nombre: 'Antimonio-121', protones: 51, neutrones: 70 }] },
    { z: 52, simbolo: 'Te', nombre: 'Telurio', masa: '127.60', familia: 'metaloide', col: 16, row: 5, isotopos: [{ nombre: 'Telurio-130', protones: 52, neutrones: 78 }] },
    { z: 53, simbolo: 'I', nombre: 'Yodo', masa: '126.90', familia: 'halogeno', col: 17, row: 5, isotopos: [{ nombre: 'Yodo-127', protones: 53, neutrones: 74 }] },
    { z: 54, simbolo: 'Xe', nombre: 'Xenón', masa: '131.29', familia: 'gas-noble', col: 18, row: 5, isotopos: [{ nombre: 'Xenón-132', protones: 54, neutrones: 78 }] },
    // Fila 6
    { z: 55, simbolo: 'Cs', nombre: 'Cesio', masa: '132.91', familia: 'alcalino', col: 1, row: 6, isotopos: [{ nombre: 'Cesio-133', protones: 55, neutrones: 78 }] },
    { z: 56, simbolo: 'Ba', nombre: 'Bario', masa: '137.33', familia: 'alcalinoterreo', col: 2, row: 6, isotopos: [{ nombre: 'Bario-138', protones: 56, neutrones: 82 }] },
    { z: 72, simbolo: 'Hf', nombre: 'Hafnio', masa: '178.49', familia: 'transicion', col: 4, row: 6, isotopos: [{ nombre: 'Hafnio-180', protones: 72, neutrones: 108 }] },
    { z: 73, simbolo: 'Ta', nombre: 'Tantalio', masa: '180.95', familia: 'transicion', col: 5, row: 6, isotopos: [{ nombre: 'Tantalio-181', protones: 73, neutrones: 108 }] },
    { z: 74, simbolo: 'W', nombre: 'Wolframio', masa: '183.84', familia: 'transicion', col: 6, row: 6, isotopos: [{ nombre: 'Wolframio-184', protones: 74, neutrones: 110 }] },
    { z: 75, simbolo: 'Re', nombre: 'Renio', masa: '186.21', familia: 'transicion', col: 7, row: 6, isotopos: [{ nombre: 'Renio-187', protones: 75, neutrones: 112 }] },
    { z: 76, simbolo: 'Os', nombre: 'Osmio', masa: '190.23', familia: 'transicion', col: 8, row: 6, isotopos: [{ nombre: 'Osmio-192', protones: 76, neutrones: 116 }] },
    { z: 77, simbolo: 'Ir', nombre: 'Iridio', masa: '192.22', familia: 'transicion', col: 9, row: 6, isotopos: [{ nombre: 'Iridio-193', protones: 77, neutrones: 116 }] },
    { z: 78, simbolo: 'Pt', nombre: 'Platino', masa: '195.08', familia: 'transicion', col: 10, row: 6, isotopos: [{ nombre: 'Platino-195', protones: 78, neutrones: 117 }] },
    { z: 79, simbolo: 'Au', nombre: 'Oro', masa: '196.97', familia: 'transicion', col: 11, row: 6, isotopos: [{ nombre: 'Oro-197', protones: 79, neutrones: 118 }] },
    { z: 80, simbolo: 'Hg', nombre: 'Mercurio', masa: '200.59', familia: 'transicion', col: 12, row: 6, isotopos: [{ nombre: 'Mercurio-202', protones: 80, neutrones: 122 }] },
    { z: 81, simbolo: 'Tl', nombre: 'Talio', masa: '204.38', familia: 'post-transicion', col: 13, row: 6, isotopos: [{ nombre: 'Talio-205', protones: 81, neutrones: 124 }] },
    { z: 82, simbolo: 'Pb', nombre: 'Plomo', masa: '207.2', familia: 'post-transicion', col: 14, row: 6, isotopos: [{ nombre: 'Plomo-208', protones: 82, neutrones: 126 }] },
    { z: 83, simbolo: 'Bi', nombre: 'Bismuto', masa: '208.98', familia: 'post-transicion', col: 15, row: 6, isotopos: [{ nombre: 'Bismuto-209', protones: 83, neutrones: 126 }] },
    { z: 84, simbolo: 'Po', nombre: 'Polonio', masa: '[209]', familia: 'post-transicion', col: 16, row: 6, isotopos: [{ nombre: 'Polonio-209', protones: 84, neutrones: 125 }] },
    { z: 85, simbolo: 'At', nombre: 'Astato', masa: '[210]', familia: 'halogeno', col: 17, row: 6, isotopos: [{ nombre: 'Astato-210', protones: 85, neutrones: 125 }] },
    { z: 86, simbolo: 'Rn', nombre: 'Radón', masa: '[222]', familia: 'gas-noble', col: 18, row: 6, isotopos: [{ nombre: 'Radón-222', protones: 86, neutrones: 136 }] },
    // Fila 7
    { z: 87, simbolo: 'Fr', nombre: 'Francio', masa: '[223]', familia: 'alcalino', col: 1, row: 7, isotopos: [{ nombre: 'Francio-223', protones: 87, neutrones: 136 }] },
    { z: 88, simbolo: 'Ra', nombre: 'Radio', masa: '[226]', familia: 'alcalinoterreo', col: 2, row: 7, isotopos: [{ nombre: 'Radio-226', protones: 88, neutrones: 138 }] },
    { z: 104, simbolo: 'Rf', nombre: 'Rutherfordio', masa: '[267]', familia: 'transicion', col: 4, row: 7, isotopos: [{ nombre: 'Rutherfordio-267', protones: 104, neutrones: 163 }] },
    { z: 105, simbolo: 'Db', nombre: 'Dubnio', masa: '[268]', familia: 'transicion', col: 5, row: 7, isotopos: [{ nombre: 'Dubnio-268', protones: 105, neutrones: 163 }] },
    { z: 106, simbolo: 'Sg', nombre: 'Seaborgio', masa: '[269]', familia: 'transicion', col: 6, row: 7, isotopos: [{ nombre: 'Seaborgio-269', protones: 106, neutrones: 163 }] },
    { z: 107, simbolo: 'Bh', nombre: 'Bohrio', masa: '[270]', familia: 'transicion', col: 7, row: 7, isotopos: [{ nombre: 'Bohrio-270', protones: 107, neutrones: 163 }] },
    { z: 108, simbolo: 'Hs', nombre: 'Hassio', masa: '[277]', familia: 'transicion', col: 8, row: 7, isotopos: [{ nombre: 'Hassio-277', protones: 108, neutrones: 169 }] },
    { z: 109, simbolo: 'Mt', nombre: 'Meitnerio', masa: '[278]', familia: 'transicion', col: 9, row: 7, isotopos: [{ nombre: 'Meitnerio-278', protones: 109, neutrones: 169 }] },
    { z: 110, simbolo: 'Ds', nombre: 'Darmstadtio', masa: '[281]', familia: 'transicion', col: 10, row: 7, isotopos: [{ nombre: 'Darmstadtio-281', protones: 110, neutrones: 171 }] },
    { z: 111, simbolo: 'Rg', nombre: 'Roentgenio', masa: '[282]', familia: 'transicion', col: 11, row: 7, isotopos: [{ nombre: 'Roentgenio-282', protones: 111, neutrones: 171 }] },
    { z: 112, simbolo: 'Cn', nombre: 'Copernicio', masa: '[285]', familia: 'transicion', col: 12, row: 7, isotopos: [{ nombre: 'Copernicio-285', protones: 112, neutrones: 173 }] },
    { z: 113, simbolo: 'Nh', nombre: 'Nihonio', masa: '[286]', familia: 'post-transicion', col: 13, row: 7, isotopos: [{ nombre: 'Nihonio-286', protones: 113, neutrones: 173 }] },
    { z: 114, simbolo: 'Fl', nombre: 'Flerovio', masa: '[289]', familia: 'post-transicion', col: 14, row: 7, isotopos: [{ nombre: 'Flerovio-289', protones: 114, neutrones: 175 }] },
    { z: 115, simbolo: 'Mc', nombre: 'Moscovio', masa: '[290]', familia: 'post-transicion', col: 15, row: 7, isotopos: [{ nombre: 'Moscovio-290', protones: 115, neutrones: 175 }] },
    { z: 116, simbolo: 'Lv', nombre: 'Livermorio', masa: '[293]', familia: 'post-transicion', col: 16, row: 7, isotopos: [{ nombre: 'Livermorio-293', protones: 116, neutrones: 177 }] },
    { z: 117, simbolo: 'Ts', nombre: 'Teneso', masa: '[294]', familia: 'halogeno', col: 17, row: 7, isotopos: [{ nombre: 'Teneso-294', protones: 117, neutrones: 177 }] },
    { z: 118, simbolo: 'Og', nombre: 'Oganesón', masa: '[294]', familia: 'gas-noble', col: 18, row: 7, isotopos: [{ nombre: 'Oganesón-294', protones: 118, neutrones: 176 }] },
    
    // Lantánidos (Fila 9)
    { z: 57, simbolo: 'La', nombre: 'Lantano', masa: '138.91', familia: 'lantanido', col: 4, row: 9, isotopos: [{ nombre: 'Lantano-139', protones: 57, neutrones: 82 }] },
    { z: 58, simbolo: 'Ce', nombre: 'Cerio', masa: '140.12', familia: 'lantanido', col: 5, row: 9, isotopos: [{ nombre: 'Cerio-140', protones: 58, neutrones: 82 }] },
    { z: 59, simbolo: 'Pr', nombre: 'Praseodimio', masa: '140.91', familia: 'lantanido', col: 6, row: 9, isotopos: [{ nombre: 'Praseodimio-141', protones: 59, neutrones: 82 }] },
    { z: 60, simbolo: 'Nd', nombre: 'Neodimio', masa: '144.24', familia: 'lantanido', col: 7, row: 9, isotopos: [{ nombre: 'Neodimio-142', protones: 60, neutrones: 82 }] },
    { z: 61, simbolo: 'Pm', nombre: 'Prometio', masa: '[145]', familia: 'lantanido', col: 8, row: 9, isotopos: [{ nombre: 'Prometio-145', protones: 61, neutrones: 84 }] },
    { z: 62, simbolo: 'Sm', nombre: 'Samario', masa: '150.36', familia: 'lantanido', col: 9, row: 9, isotopos: [{ nombre: 'Samario-152', protones: 62, neutrones: 90 }] },
    { z: 63, simbolo: 'Eu', nombre: 'Europio', masa: '151.96', familia: 'lantanido', col: 10, row: 9, isotopos: [{ nombre: 'Europio-153', protones: 63, neutrones: 90 }] },
    { z: 64, simbolo: 'Gd', nombre: 'Gadolinio', masa: '157.25', familia: 'lantanido', col: 11, row: 9, isotopos: [{ nombre: 'Gadolinio-158', protones: 64, neutrones: 94 }] },
    { z: 65, simbolo: 'Tb', nombre: 'Terbio', masa: '158.93', familia: 'lantanido', col: 12, row: 9, isotopos: [{ nombre: 'Terbio-159', protones: 65, neutrones: 94 }] },
    { z: 66, simbolo: 'Dy', nombre: 'Disprosio', masa: '162.50', familia: 'lantanido', col: 13, row: 9, isotopos: [{ nombre: 'Disprosio-164', protones: 66, neutrones: 98 }] },
    { z: 67, simbolo: 'Ho', nombre: 'Holmio', masa: '164.93', familia: 'lantanido', col: 14, row: 9, isotopos: [{ nombre: 'Holmio-165', protones: 67, neutrones: 98 }] },
    { z: 68, simbolo: 'Er', nombre: 'Erbio', masa: '167.26', familia: 'lantanido', col: 15, row: 9, isotopos: [{ nombre: 'Erbio-166', protones: 68, neutrones: 98 }] },
    { z: 69, simbolo: 'Tm', nombre: 'Tulio', masa: '168.93', familia: 'lantanido', col: 16, row: 9, isotopos: [{ nombre: 'Tulio-169', protones: 69, neutrones: 100 }] },
    { z: 70, simbolo: 'Yb', nombre: 'Iterbio', masa: '173.05', familia: 'lantanido', col: 17, row: 9, isotopos: [{ nombre: 'Iterbio-174', protones: 70, neutrones: 104 }] },
    { z: 71, simbolo: 'Lu', nombre: 'Lutecio', masa: '174.97', familia: 'lantanido', col: 18, row: 9, isotopos: [{ nombre: 'Lutecio-175', protones: 71, neutrones: 104 }] },
    
    // Actínidos (Fila 10)
    { z: 89, simbolo: 'Ac', nombre: 'Actinio', masa: '[227]', familia: 'actinido', col: 4, row: 10, isotopos: [{ nombre: 'Actinio-227', protones: 89, neutrones: 138 }] },
    { z: 90, simbolo: 'Th', nombre: 'Torio', masa: '232.04', familia: 'actinido', col: 5, row: 10, isotopos: [{ nombre: 'Torio-232', protones: 90, neutrones: 142 }] },
    { z: 91, simbolo: 'Pa', nombre: 'Protactinio', masa: '231.04', familia: 'actinido', col: 6, row: 10, isotopos: [{ nombre: 'Protactinio-231', protones: 91, neutrones: 140 }] },
    { z: 92, simbolo: 'U', nombre: 'Uranio', masa: '238.03', familia: 'actinido', col: 7, row: 10, isotopos: [{ nombre: 'Uranio-238', protones: 92, neutrones: 146 }, { nombre: 'Uranio-235', protones: 92, neutrones: 143 }] },
    { z: 93, simbolo: 'Np', nombre: 'Neptunio', masa: '[237]', familia: 'actinido', col: 8, row: 10, isotopos: [{ nombre: 'Neptunio-237', protones: 93, neutrones: 144 }] },
    { z: 94, simbolo: 'Pu', nombre: 'Plutonio', masa: '[244]', familia: 'actinido', col: 9, row: 10, isotopos: [{ nombre: 'Plutonio-244', protones: 94, neutrones: 150 }] },
    { z: 95, simbolo: 'Am', nombre: 'Americio', masa: '[243]', familia: 'actinido', col: 10, row: 10, isotopos: [{ nombre: 'Americio-243', protones: 95, neutrones: 148 }] },
    { z: 96, simbolo: 'Cm', nombre: 'Curio', masa: '[247]', familia: 'actinido', col: 11, row: 10, isotopos: [{ nombre: 'Curio-247', protones: 96, neutrones: 151 }] },
    { z: 97, simbolo: 'Bk', nombre: 'Berkelio', masa: '[247]', familia: 'actinido', col: 12, row: 10, isotopos: [{ nombre: 'Berkelio-247', protones: 97, neutrones: 150 }] },
    { z: 98, simbolo: 'Cf', nombre: 'Californio', masa: '[251]', familia: 'actinido', col: 13, row: 10, isotopos: [{ nombre: 'Californio-251', protones: 98, neutrones: 153 }] },
    { z: 99, simbolo: 'Es', nombre: 'Einstenio', masa: '[252]', familia: 'actinido', col: 14, row: 10, isotopos: [{ nombre: 'Einstenio-252', protones: 99, neutrones: 153 }] },
    { z: 100, simbolo: 'Fm', nombre: 'Fermio', masa: '[257]', familia: 'actinido', col: 15, row: 10, isotopos: [{ nombre: 'Fermio-257', protones: 100, neutrones: 157 }] },
    { z: 101, simbolo: 'Md', nombre: 'Mendelevio', masa: '[258]', familia: 'actinido', col: 16, row: 10, isotopos: [{ nombre: 'Mendelevio-258', protones: 101, neutrones: 157 }] },
    { z: 102, simbolo: 'No', nombre: 'Nobelio', masa: '[259]', familia: 'actinido', col: 17, row: 10, isotopos: [{ nombre: 'Nobelio-259', protones: 102, neutrones: 157 }] },
    { z: 103, simbolo: 'Lr', nombre: 'Lawrencio', masa: '[266]', familia: 'actinido', col: 18, row: 10, isotopos: [{ nombre: 'Lawrencio-266', protones: 103, neutrones: 163 }] }
];
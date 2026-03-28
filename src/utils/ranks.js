// src/utils/ranks.js

export const rankImages = {
  'OMEYOCAN': '/ranks/omeyocan.png',
  'HUEY TLATOANI': '/ranks/huey_tlatoani.png',
  'TLATOANI': '/ranks/tlatoani.png',
  'IMPERIO': '/ranks/imperio.png',
  'MEXICA': '/ranks/mexica.png',
  'TONATIUH': '/ranks/tonatiuh.png',
  'QUETZALCOATL': '/ranks/quetzalcoatl.png',
  'HUITZILOPOCHTLI': '/ranks/huitzilopochtli.png',
  'TLAOCEL': '/ranks/tlaocel.png',
  'TEZCATLIPOCA': '/ranks/tezcatlipoca.png',
  'XIPE TOTEC': '/ranks/xipe_totec.png',
  'XOCHIPILLI': '/ranks/xochipilli.png',
  'TLAZOLTEOTL': '/ranks/tlazolteotl.png',
  'MIXCOATL': '/ranks/mixcoatl.png',
  'TLATOQUE': '/ranks/tlatoque.png',
  'TLAMACAZQUI': '/ranks/tlamacazqui.png',
  'TLAHUICOLE': '/ranks/tlahuicole.png',

  'CIHUACOATL I': '/ranks/cihuacoatl1.png',
  'CIHUACOATL II': '/ranks/cihuacoatl2.png',
  'CIHUACOATL III': '/ranks/cihuacoatl3.png',

  'TLACATECATL I': '/ranks/tlacatecatl1.png',
  'TLACATECATL II': '/ranks/tlacatecatl2.png',
  'TLACATECATL III': '/ranks/tlacatecatl3.png',

  'OCELOTL I': '/ranks/ocelotl1.png',
  'OCELOTL II': '/ranks/ocelotl2.png',
  'OCELOTL III': '/ranks/ocelotl3.png',
  'OCELOTL IV': '/ranks/ocelotl4.png',
  'OCELOTL V': '/ranks/ocelotl5.png',

  'CUAUHTLI I': '/ranks/cuauhtli1.png',
  'CUAUHTLI II': '/ranks/cuauhtli2.png',
  'CUAUHTLI III': '/ranks/cuauhtli3.png',
  'CUAUHTLI IV': '/ranks/cuauhtli4.png',
  'CUAUHTLI V': '/ranks/CUAUHTLI V.png',

  'YAOTL': '/ranks/YAOTL.png',
  'GUERRERO': '/ranks/GUERRERO.png',
  'TELPOCHCALLI': '/ranks/TELPOCHCALLI.png',
  'CALMECAC': '/ranks/CALMECAC.png',
  'POCTECA': '/ranks/POCTECA.png',
  'MERCADER': '/ranks/MERCADER.png',
  'ARTESANO': '/ranks/ARTESANO.png',
  'CAMPESINO': '/ranks/CAMPESINO.png',
  'MAIZ': '/ranks/MAIZ.png',
  'MAGUEY': '/ranks/MAGUEY.png',
  'NOPAL': '/ranks/NOPAL.png',
  'QUETZAL': '/ranks/QUETZAL.png',
  'GUACAMAYA': '/ranks/GUACAMAYA.png',
  'VENADO': '/ranks/VENADO.png',
  'COYOTE': '/ranks/COYOTE.png',
  'TLACUACHE': '/ranks/TLACUACHE.png',
  'AJOLOTE': '/ranks/AJOLOTE.png',
  'XOLOITZCUINTLE': '/ranks/XOLOITZCUINTLE.png',
};

export const getRankImage = (rankName) => {
  if (!rankName) return '/ranks/default.png';

  const clean = rankName
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' '); // limpia espacios raros

  console.log("BUSCANDO:", clean);

  return rankImages[clean] || '/ranks/default.png';
};
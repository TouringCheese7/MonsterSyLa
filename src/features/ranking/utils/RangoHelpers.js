export function getRangoIcon(rango) {

  if (!rango) return "/assets_rangos/TELPOCHCALLI V.png";

  const clean = rango.toUpperCase();

  const map = {

"NOPAL": "/assets_rangos/NOPAL.png",
"MAGUEY": "/assets_rangos/MAGUEY.png",
"MAIZ": "/assets_rangos/MAIZ.png",
"QUETZAL": "/assets_rangos/QUETZAL.png",
"GUACAMAYA": "/assets_rangos/GUACAMAYA.png",
"VENADO": "/assets_rangos/VENADO.png",
"COYOTE": "/assets_rangos/COYOTE.png",
"TLACUACHE": "/assets_rangos/TLACUACHE.png",
"AJOLOTE": "/assets_rangos/AJOLOTE.png",

  };

  return map[clean] || "/assets_rangos/XOLOITZCUINTLE.png";

}
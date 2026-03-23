import React from "react";

const ranks = [
{ name:"XOLOITZCUINTLE", elo:0 },
{ name:"AJOLOTE", elo:100 },
{ name:"TLACUACHE", elo:200 },
{ name:"COYOTE", elo:300 },
{ name:"VENADO", elo:400 },
{ name:"GUACAMAYA", elo:500 },
{ name:"QUETZAL", elo:600 },
{ name:"NOPAL", elo:700 },
{ name:"MAGUEY", elo:800 },
{ name:"MAIZ", elo:900 },

{ name:"CAMPESINO", elo:1000 },
{ name:"ARTESANO", elo:1100 },
{ name:"MERCADER", elo:1200 },
{ name:"POCTECA", elo:1300 },
{ name:"CALMECAC", elo:1400 },
{ name:"TELPOCHCALLI", elo:1500 },
{ name:"GUERRERO", elo:1600 },
{ name:"YAOTL", elo:1700 },

{ name:"CUAUHTLI V", elo:1800 },
{ name:"CUAUHTLI IV", elo:1900 },
{ name:"CUAUHTLI III", elo:2000 },
{ name:"CUAUHTLI II", elo:2100 },
{ name:"CUAUHTLI I", elo:2200 },

{ name:"OCELOTL V", elo:2300 },
{ name:"OCELOTL IV", elo:2400 },
{ name:"OCELOTL III", elo:2500 },
{ name:"OCELOTL II", elo:2600 },
{ name:"OCELOTL I", elo:2700 },

{ name:"TLACATECATL III", elo:2800 },
{ name:"TLACATECATL II", elo:2900 },
{ name:"TLACATECATL I", elo:3000 },

{ name:"CIHUACOATL III", elo:3100 },
{ name:"CIHUACOATL II", elo:3200 },
{ name:"CIHUACOATL I", elo:3300 },

{ name:"TLAHUICOLE", elo:3400 },
{ name:"TLAMACAZQUI", elo:3500 },
{ name:"TLATOQUE", elo:3600 },

{ name:"MIXCOATL", elo:3700 },
{ name:"TLAZOLTEOTL", elo:3800 },
{ name:"XOCHIPILLI", elo:3900 },
{ name:"XIPE TOTEC", elo:4000 },

{ name:"TEZCATLIPOCA", elo:4100 },
{ name:"TLAOCEL", elo:4200 },
{ name:"HUITZILOPOCHTLI", elo:4300 },
{ name:"QUETZALCOATL", elo:4400 },

{ name:"TONATIUH", elo:4500 },

{ name:"MEXICA", elo:4600 },
{ name:"IMPERIO", elo:4700 },
{ name:"TLATOANI", elo:4800 },
{ name:"HUEY TLATOANI", elo:4900 },

{ name:"OMEYOCAN", elo:5000 }
]

export default function RankProgress({ elo }) {

const currentIndex = ranks.findIndex((r,i)=> elo >= r.elo && (i === ranks.length-1 || elo < ranks[i+1].elo))

const nextRank = ranks[currentIndex+1]

const progress = nextRank 
? ((elo - ranks[currentIndex].elo) / (nextRank.elo - ranks[currentIndex].elo)) * 100
: 100

return (

<div className="bg-[#050505] border border-green-500/20 rounded-2xl p-6">

<h3 className="text-green-500 font-black uppercase text-xs tracking-widest mb-6">
Progreso de Rango
</h3>

<div className="mb-4">

<div className="flex justify-between text-xs text-gray-400 mb-2">
<span>{ranks[currentIndex].name}</span>
<span>{nextRank ? nextRank.name : "MAX"}</span>
</div>

<div className="w-full h-3 bg-black rounded-full overflow-hidden border border-green-500/20">

<div
className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
style={{width:`${progress}%`}}
></div>

</div>

</div>

<div className="text-xs text-gray-500 font-mono">
ELO actual: {Math.round(elo)}
</div>

</div>

)
}
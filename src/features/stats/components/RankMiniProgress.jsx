const ranks = [
  { name: "XOLOITZCUINTLE", min: 0 },
  { name: "AJOLOTE", min: 100 },
  { name: "TLACUACHE", min: 200 },
  { name: "COYOTE", min: 300 },
  { name: "VENADO", min: 400 },
  { name: "GUACAMAYA", min: 500 },
  { name: "QUETZAL", min: 600 },
  { name: "NOPAL", min: 700 },
  { name: "MAGUEY", min: 800 },
  { name: "MAIZ", min: 900 },
  { name: "CAMPESINO", min: 1000 },
  { name: "ARTESANO", min: 1100 },
  { name: "MERCADER", min: 1200 },
  { name: "POCTECA", min: 1300 },
  { name: "CALMECAC", min: 1400 },
  { name: "TELPOCHCALLI", min: 1500 },
  { name: "GUERRERO", min: 1600 },
  { name: "YAOTL", min: 1700 },
  { name: "CUAUHTLI V", min: 1800 },
  { name: "CUAUHTLI IV", min: 1900 },
  { name: "CUAUHTLI III", min: 2000 },
  { name: "CUAUHTLI II", min: 2100 },
  { name: "CUAUHTLI I", min: 2200 },
  { name: "OCELOTL V", min: 2300 },
  { name: "OCELOTL IV", min: 2400 },
  { name: "OCELOTL III", min: 2500 },
  { name: "OCELOTL II", min: 2600 },
  { name: "OCELOTL I", min: 2700 },
  { name: "TLACATECATL III", min: 2800 },
  { name: "TLACATECATL II", min: 2900 },
  { name: "TLACATECATL I", min: 3000 },
  { name: "CIHUACOATL III", min: 3100 },
  { name: "CIHUACOATL II", min: 3200 },
  { name: "CIHUACOATL I", min: 3300 },
  { name: "TLAHUICOLE", min: 3400 },
  { name: "TLAMACAZQUI", min: 3500 },
  { name: "TLATOQUE", min: 3600 },
  { name: "MIXCOATL", min: 3700 },
  { name: "TLAZOLTEOTL", min: 3800 },
  { name: "XOCHIPILLI", min: 3900 },
  { name: "XIPE TOTEC", min: 4000 },
  { name: "TEZCATLIPOCA", min: 4100 },
  { name: "TLAOCEL", min: 4200 },
  { name: "HUITZILOPOCHTLI", min: 4300 },
  { name: "QUETZALCOATL", min: 4400 },
  { name: "TONATIUH", min: 4500 },
  { name: "MEXICA", min: 4600 },
  { name: "IMPERIO", min: 4700 },
  { name: "TLATOANI", min: 4800 },
  { name: "HUEY TLATOANI", min: 4900 },
  { name: "OMEYOCAN", min: 5000 }
];

export default function RankMiniProgress({ elo }) {

  const currentIndex = ranks.findIndex((r, i) => {
    const next = ranks[i + 1];
    return elo >= r.min && (!next || elo < next.min);
  });

  const current = ranks[currentIndex];
  const next = ranks[currentIndex + 1];

  let progress = 100;

  if (next) {
    progress = ((elo - current.min) / (next.min - current.min)) * 100;
  }

  return (
    <div className="w-full mt-2">

      <div className="flex justify-between text-[9px] text-gray-500">
        <span>{current?.name}</span>
        <span>{next?.name || "MAX"}</span>
      </div>

      <div className="w-full h-1 bg-green-900/40 rounded overflow-hidden">
        <div
          className="h-full bg-green-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

    </div>
  );
}
// src/components/GlowLine.jsx
export default function GlowLine() {
  return (
    <div className="w-full relative h-[2px] my-6 flex items-center justify-center">
      {/* Halo de luz (el brillo difuminado) */}
      <div 
        className="absolute w-full h-[40px] opacity-40"
        style={{
          background: 'radial-gradient(ellipse at center, #22c55e 0%, transparent 70%)',
          filter: 'blur(15px)',
        }}
      ></div>

      {/* La línea central sólida */}
      <div 
        className="absolute w-full h-[1px] bg-[#22c55e]"
        style={{
          boxShadow: '0 0 10px #22c55e, 0 0 5px #22c55e',
        }}
      ></div>
    </div>
  )
}
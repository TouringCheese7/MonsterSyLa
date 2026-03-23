import React, { useState } from "react"
import { getRangoIcon } from "../../ranking/utils/RangoHelpers"
import { useClan } from "../../../context/ClanContext" // 🔥
import { useNavigate } from "react-router-dom" // 🔥

export default function SearchBar({
value,
onChange,
players,
placeholder
}){

const [isOpen,setIsOpen] = useState(false)

const { clanSlug } = useClan() // 🔥
const navigate = useNavigate() // 🔥

const results =
value.length > 1
? players
.filter(p =>

(p.player_name?.toLowerCase().includes(value.toLowerCase())) ||

(p.player_tag?.toLowerCase().includes(value.toLowerCase())) ||

(p.rango?.toLowerCase().includes(value.toLowerCase()))

)
.slice(0,6)
: []

function go(tag){

if(!clanSlug) return

navigate(`/${clanSlug}/players/${tag.replace("#","")}`)
setIsOpen(false)

}

function handleKey(e){

if(e.key==="Enter" && results.length>0){

go(results[0].player_tag)

}

}

return(

<div className="relative w-full">

<input
type="text"
placeholder={placeholder}
value={value}
onChange={(e)=>{
onChange(e.target.value)
setIsOpen(true)
}}
onFocus={()=>setIsOpen(true)}
onBlur={()=>setTimeout(()=>setIsOpen(false),200)}
onKeyDown={handleKey}
className="
w-full
bg-[#080808]
border border-white/5
rounded-2xl
py-4 px-6
text-xs
font-black
tracking-widest
uppercase
focus:border-green-500/40
outline-none
transition
"
/>

{isOpen && results.length>0 &&(

<div className="
absolute
top-full
mt-2
w-full
bg-[#0a0a0a]
border border-white/10
rounded-xl
z-[100]
shadow-2xl
overflow-hidden
">

{results.map(p=>(

<div
key={p.player_tag}
onClick={()=>go(p.player_tag)}
className="
flex items-center gap-4
p-4
hover:bg-green-500/10
cursor-pointer
transition
border-b border-white/5
last:border-0
"
>

<img
src={getRangoIcon(p.rango)}
className="w-8 h-8 object-contain"
/>

<div className="flex flex-col">

<span className="text-xs font-bold uppercase">
{p.player_name}
</span>

<span className="text-[10px] text-green-500 font-mono">
{p.player_tag}
</span>

</div>

<span className="ml-auto text-[9px] text-gray-500 font-bold uppercase">
Perfil →
</span>

</div>

))}

</div>

)}

</div>

)

}
import { useState, useEffect } from "react"
import { supabase } from "../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import { getRangoIcon } from "../features/ranking/utils/RangoHelpers"
import { useClan } from "../context/ClanContext" // 🔥 IMPORTANTE

export default function GlobalSearch(){

const [open,setOpen] = useState(false)
const [query,setQuery] = useState("")
const [players,setPlayers] = useState([])

const navigate = useNavigate()
const { clanSlug } = useClan() // 🔥 AQUÍ

useEffect(()=>{

function handleKey(e){

if(e.ctrlKey && e.key==="k"){

e.preventDefault()
setOpen(o=>!o)

}

if(e.key==="Escape"){

setOpen(false)

}

}

window.addEventListener("keydown",handleKey)

return ()=> window.removeEventListener("keydown",handleKey)

},[])


useEffect(()=>{

async function fetchPlayers(){

const {data} = await supabase
.from("view_players_full")
.select("*")

setPlayers(data || [])

}

fetchPlayers()

},[])


const results =
query.length>1
? players.filter(p =>

p.player_name?.toLowerCase().includes(query.toLowerCase()) ||

p.player_tag?.toLowerCase().includes(query.toLowerCase()) ||

p.rango?.toLowerCase().includes(query.toLowerCase())

).slice(0,6)
: []


// 🔥 ARREGLADO
function go(tag){

if(!clanSlug) return

setOpen(false)
navigate(`/${clanSlug}/players/${tag.replace("#","")}`)

}


if(!open) return null


return(

<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-40 z-[999]">

<div className="w-[600px] bg-[#050505] border border-green-500/30 rounded-xl overflow-hidden">

<input
autoFocus
value={query}
onChange={(e)=>setQuery(e.target.value)}
placeholder="Buscar jugador, tag o rango..."
className="w-full bg-[#080808] px-6 py-4 outline-none border-b border-white/10 text-sm"
/>

<div className="max-h-[300px] overflow-y-auto">

{results.map(p=>(

<div
key={p.player_tag}
onClick={()=>go(p.player_tag)}
className="flex items-center gap-4 px-6 py-4 hover:bg-green-500/10 cursor-pointer"
>

<img
src={getRangoIcon(p.rango)}
className="w-8 h-8 object-contain"
/>

<div>

<p className="text-sm font-bold">{p.player_name}</p>
<p className="text-xs text-green-500 font-mono">{p.player_tag}</p>

</div>

<span className="ml-auto text-xs text-gray-500">
Perfil →
</span>

</div>

))}

</div>

</div>

</div>

)

}
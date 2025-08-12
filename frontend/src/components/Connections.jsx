import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addConnection } from "../utils/connectionSlice"


export const Connections = () => {
   const dispatch = useDispatch()
   const connections = useSelector(store=>store.connection)
   

    const fetchConnections = async ()=>{
      try {
        const res = await axios.get(BASE_URL+"/user/connections",{withCredentials: true});
        
dispatch(addConnection(res?.data?.filteredConnections))

    } catch (error) {
        console.error(error)
    }   
    }

    useEffect(()=>{
        fetchConnections()
    },[])

    if(!connections)return;
    if(connections.length ===0 )return(
      <h1 className="flex justify-center text-3xl mt-4 font-bold">No connection found!</h1>
    )

  return (
    <div>
<h1 className="text-center my-4 text-3xl font-bold">Connections</h1>
<div>{connections.map((connection)=>{
  const {firstName,lastName,about,age,gender,photoUrl,skills}=connection
  return<div className="card card-side bg-base-300 shadow-sm w-1/2 mx-auto mb-4">
<figure className="w-56 h-60 flex-shrink-0">
  <img
    className="w-full h-full justify-center items-center object-cover rounded-l-lg"
    src={photoUrl}
    alt={firstName}
  />
</figure>
  <div className="card-body">
    <h2 className="card-title">{firstName + " "+ lastName}</h2>
    {gender && age && <h2 className="card-title">{age + " "+ gender}</h2>}
    <p>{about}</p>
    <div className="flex justify-between"><div>
          {skills.map((s,i) => (
            <span key={i} className="badge mr-2">{s}</span>
          ))}
        </div>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Chat</button>
    </div></div>
    
  </div>
</div>
})}</div>

    </div>
  )
}

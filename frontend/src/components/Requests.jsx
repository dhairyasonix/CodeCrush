import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests, removeRequest } from '../utils/requestSlice'
import { useNavigate } from 'react-router-dom'

const Requests = () => {
  const dispatch =useDispatch()
  const requests = useSelector(store=>store.requests)
  const navigate = useNavigate()

  const reviewRequest = async(status,_id)=>{
    try {
        await axios.post(BASE_URL+"/request/review/"+status+"/"+_id,{},{withCredentials:true})
       dispatch(removeRequest(_id))
    } catch (error) {
      console.error(error)
    }
   
  }

  const fetchRequest = async()=>{
    try {
      const res = await axios.get(BASE_URL+"/user/requests/received",{withCredentials:true});
      
dispatch(addRequests(res?.data?.data))

    } catch (error) {
      console.error(error)
    }


  }
  useEffect(()=>{
    fetchRequest()
  },[])
  const requestHints = [
  "Keep your profile complete and add attractive photos.",
  "Be active on the feed to get noticed by more users.",
  "Send thoughtful connection requests to increase your chances of getting one back."
];


if(!requests)return;
    if(requests.length ===0 )return(
     <div className="flex flex-col items-center justify-center mt-20">
  <h1 className="text-2xl font-bold mb-4">📭 No Requests Found</h1>
  <p className="text-lg text-center mx-4 text-gray-500 mb-8">
    Looks like no one has sent you a request yet. Check back later or explore the feed.
  </p>
  
  <div className="flex gap-4">
    <button 
      className="btn btn-primary"
      onClick={() => navigate("/feed")}
    >
      🔍 Explore Feed
    </button>
    <button 
      className="btn btn-secondary"
      onClick={() => navigate("/profile")}
    >
      ✏️ Update Profile
    </button>
  </div>

  <div className="bg-base-200 shadow-md rounded-lg p-6 max-w-lg mx-auto mt-10">
    <h2 className="text-lg font-bold mb-4 text-center">
      💡 Tips to Get Requests
    </h2>
    <ul className="list-disc list-outside pl-6 space-y-2 text-gray-500">
      {requestHints.map((hint, idx) => (
        <li key={idx} className="pl-2 -indent-2">
          {hint}
        </li>
      ))}
    </ul>
  </div>
</div>
    )

  return (
    <div>
<h1 className="text-center my-4 text-3xl font-bold">Requests</h1>
<div>{requests.map((request)=>{
  const {_id,firstName,lastName,about,age,gender,photoUrl,skills}=request.fromUserId

  return<div key={_id} className="card card-side bg-base-300 shadow-sm w-[90%] md:w-1/2 mx-auto mb-4">
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
    <div>
          {skills.map((s,index) => (
            <span key={index} className="badge mr-2">{s}</span>
          ))}
        </div>
    <div className="card-actions justify-end">
      <button className="btn btn-secondary" 
      onClick={()=>reviewRequest("rejected",request._id)}>Reject</button>
      <button className="btn btn-primary"
      onClick={()=>reviewRequest("accepted",request._id)}>Accept</button>
    </div>
  </div>
</div>
})}</div>

    </div>
  )
}

export default Requests
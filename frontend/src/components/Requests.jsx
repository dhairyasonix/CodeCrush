import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests, removeRequest } from '../utils/requestSlice'

const Requests = () => {
  const dispatch =useDispatch()
  const requests = useSelector(store=>store.requests)

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


if(!requests)return;
    if(requests.length ===0 )return(
      <h1 className='flex justify-center text-3xl mt-4 font-bold w-full'>No Request found!</h1>
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
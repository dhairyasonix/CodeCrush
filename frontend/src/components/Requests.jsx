import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests } from '../utils/requestSlice'

const Requests = () => {
  const dispatch =useDispatch()
  const requests = useSelector(store=>store.requests)

  const fetchRequest = async()=>{
    try {
      const res = await axios.get(BASE_URL+"/user/requests/received",{withCredentials:true});
      console.log(res)
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
      <h1>No Request found!</h1>
    )

  return (
    <div>
<h1 className="text-center my-4 text-3xl font-bold">Requests</h1>
<div>{requests.map((request)=>{
  const {firstName,lastName,about,age,gender,photoUrl,skills}=request.fromUserId

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
    <div>
          {skills.map((s,i) => (
            <span key={i} className="badge mr-2">{s}</span>
          ))}
        </div>
    <div className="card-actions justify-end">
      <button className="btn btn-secondary">Reject</button>
      <button className="btn btn-primary">Accept</button>
    </div>
  </div>
</div>
})}</div>

    </div>
  )
}

export default Requests
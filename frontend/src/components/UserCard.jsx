import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";

export const UserCard = ({ user = {}, hideActions}) => {
  const {_id, photoUrl, firstName,lastName,gender,age,skills,about } = user;
  const dispatch  = useDispatch()

  const hendleSendRequest = async(status,userId)=>{
    dispatch(removeUserFromFeed(userId))
    try {
      await axios.post(BASE_URL+"/request/send/"+status+"/"+userId,{},{
        withCredentials:true
      })
      
  }
     catch (error) {
      console.error(error)
      dispatch(addFeed(userId));

    // Optional: show user feedback
    alert("Something went wrong. Please try again.");
    }
  }
 
  return (
    <div className="card bg-base-300 w-full md:w-80 shadow-sm">
      <figure>
        <img className="w-full" src={photoUrl} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
         {firstName +' '+ lastName}
          
        </h2>
        {gender && age && (
            <div>
              <span>{age}</span> <span>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>

            </div>
          )}
        <p>
          {about}
        </p>
        <div>
          {skills.map((s,i) => (
            <span key={i} className="badge mr-2 my-1">{s}</span>
          ))}
        </div>
        {!hideActions && <div className="card-actions justify-center">
          <button className="btn btn-secondary" 
          onClick={()=>hendleSendRequest("ignored",_id)}>Ignore</button>
          <button className="btn btn-primary"
          onClick={()=>hendleSendRequest("interested",_id)}>Interested</button>
        </div>}
      </div> 
    </div>
  );
};

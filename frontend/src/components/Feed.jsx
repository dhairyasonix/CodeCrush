import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { UserCard } from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    
   
    try {


      const res = await axios.get(
        BASE_URL + "/user/feed",
        
        {
         withCredentials: true,
        }
      );
      
      dispatch(addFeed(res?.data?.users));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if(!feed){getFeed();}
    
  }, []);

  if(!feed) return;
  if(feed.length === 0) return <div className="mt-10">
     <h1 className="text-center my-4 text-3xl font-bold">Feed</h1>
    <h1 className=" flex justify-center text-xl mt-[15%] ">No users found at the moment. Please check back later.</h1></div> 

  return feed && (<div className="flex justify-center mt-10">
    
    <UserCard user={feed[0]}  hideActions={false}/></div>);
};

export default Feed;

import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";

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
      console.log(res.data)
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if(!feed){getFeed();}
    
  }, []);

  return <div>Feed</div>;
};

export default Feed;

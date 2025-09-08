import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, clearFeed } from "../utils/feedSlice";
import { UserCard } from "./UserCard";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const navigate =useNavigate()
  const user = useSelector((store) => store.user);
  

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
  if (user) {
    getFeed();
  } else {
    dispatch(clearFeed());
  }
}, [user, dispatch]);

  const hints = [
    "Add photos or complete your profile to get better matches.",
    "Invite friends to join the app - more users mean more feed.",
    "Send messages to your current connections to stay active.",
    "Check back later - new users join every day!"
  ];

  if (!feed) return;
  if (feed.length === 0)
    return (
         <div className="flex flex-col items-center justify-center mx-4 lg:mx-auto mt-10 md:mt-20">
      <h1 className="text-2xl font-bold mb-4">🎉 You’re all caught up!</h1>
      <p className="text-lg text-center mx-4 text-gray-500 mb-8">
        No new people to show right now. In the meantime, check your connections.
      </p>
      
      <div className="flex gap-4">
        <button 
          className="btn btn-primary"
          onClick={() => navigate("/connections")}connections page
        >
          💌 View Connections
        </button>
        <button 
          className="btn btn-secondary"
         onClick={() => navigate("/profile")}
        >
           Update Profile
        </button>
      </div>
      <div className="bg-base-200 shadow-md rounded-lg p-6 max-w-lg mx-auto mt-10">
      <h2 className="text-lg font-bold mb-4 text-center">💡 Tips to Get More Matches</h2>
     <ul className="list-disc list-outside pl-6 space-y-2 text-gray-500">
  {hints.map((hint, idx) => (
    <li key={idx} className="pl-2 -indent-2">
      {hint}
    </li>
  ))}
</ul>
    </div>
    </div>
    );

  return (
    feed && (
      <div className="flex justify-center my-5 lg:mt-10 px-4">
        <UserCard user={feed[0]} hideActions={false} />
      </div>
    )
  );
};

export default Feed;

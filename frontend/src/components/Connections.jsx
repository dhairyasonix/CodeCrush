import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

export const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnection(res?.data?.filteredConnections));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0)
    return (
      <h1 className="flex justify-center text-3xl mt-4 font-bold">
        No connection found!
      </h1>
    );

  return (
    <div>
      <h1 className="text-center my-4 text-3xl font-bold">Connections</h1>
      <div>
        {connections.map((connection) => {
          const { _id,firstName, lastName, about, age, gender, photoUrl, skills } =
            connection;
          return (
            <div key={_id} className="card card-side bg-base-300 shadow-sm w-[90%] md:w-1/2 mx-auto mb-4">
              <figure className="w-32 h-44 md:w-56 md:h-64
               flex-shrink-0">
                <img
                  className="w-full h-full justify-center items-center object-cover rounded-l-lg"
                  src={photoUrl}
                  alt={firstName}
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">{firstName + " " + lastName}</h2>
                {gender && age && (
                  <h2 className="card-title">{age + " " + gender}</h2>
                )}
                <p className="hidden md:block">{about}</p>
                <div className="flex justify-between">
                  <div>
                    {skills.map((s, i) => (
                      <span key={i} className="badge mr-2">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="card-actions justify-end">
                    <Link to={"/chat/" + _id} href="">
                      <button className="btn btn-primary">Chat</button>{" "}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import { removeUser } from "../utils/userSlice"
import { clearFeed } from "../utils/feedSlice"

export const NavBar = () => {
  const user = useSelector((store) => store.user)
  const requests = useSelector((store) => store.requests)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const totalRequest = requests?.length

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        }
      )
      dispatch(clearFeed())
      dispatch(removeUser())
      navigate("/login")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to="/feed" className="btn btn-ghost text-xl">
          💟CodeCrush
        </Link>
      </div>
      {user && (
        <div className="flex gap-2 items-center">
          <div>Hi, {user.firstName}</div>
          <div className="dropdown dropdown-end mx-5 relative">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar relative"
            >
              <div className="w-10 rounded-full">
                <img alt="profile photo" src={user.photoUrl} />
              </div>
              {totalRequest > 0 && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-red-600 border"></span>
              )}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-md md:menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to="/feed">Feed</Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">
                  Requests{" "}
                  <span className="text-red-600 font-semibold">
                    {totalRequest > 0 && totalRequest}
                  </span>
                </Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

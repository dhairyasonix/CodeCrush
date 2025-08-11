import  { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("dhairya@gmail.com");
  const [password, setPassword] = useState("Dhairya@123");
  const [error,setError]=useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();

   const validateForm = (email, pass) => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/.test(pass);
    if(!emailValid){setError("Invalid Email"); 
      return false}
    if(!passValid){setError("Invalid Password")
      return false
    }
    setError("")
    return true
  };

  const handleLogin = async () => {
    if(!validateForm(emailId,password)) return;
    try {
      const res = await axios.post(
        BASE_URL+"/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(res.data));
     return navigate("/feed")
    } catch (error) {
      setError(error?.response?.data || "Something went wrong")
     
    }
  };

  return (
    <div className=" card card-border bg-base-300 w-96 mx-auto mt-[5%] ">
      <div className="card-body">
        <h2 className="card-title justify-center">Login</h2>

        <div>
          <div>
            <label className="input validator my-4 w-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                value={emailId}
                onChange={(e) => {
                  setEmailId(e.target.value);
                }}
                type="email"
                placeholder="Email"
                required
              />
            </label>
            <div className="validator-hint hidden">
              Enter valid email address
            </div>
          </div>
          <div>
            <label className="input validator my-4 w-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle
                    cx="16.5"
                    cy="7.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                </g>
              </svg>
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("")
                }}
                type="password"
                required
                placeholder="Password"
                minLength="5"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}"
                title="Must be more than 5 characters, including number, lowercase letter, uppercase letter"
              />
            </label>

            <div className="validator-hint hidden">
              Enter valid password
            </div>
          </div>
        </div>
<p className="text-[oklch(71%_0.194_13.428)]">{error}</p>
        <div className="card-actions  justify-center">
          <button onClick={handleLogin} className="btn btn-wide bg-blue-500">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

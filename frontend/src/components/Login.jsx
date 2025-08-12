import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName,setFirstName]=useState("")
  const [lastName,setLastName]=useState("")
  const [error, setError] = useState("");
  const [isLogInForm, setIsLoginForm]= useState(true)
  const [showPassword, setShowPassword]= useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = (email, pass) => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/.test(pass);
    if (!emailValid) {
      setError("Invalid Email");
      return false;
    }
    if (!passValid) {
      setError("Invalid Password");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm(emailId, password)) return;
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (error) {
      setError(error?.response?.data || "Something went wrong");
      
    }
  };

 const handleSignUp = async()=>{
  if (!validateForm(emailId, password)) return;
  try {
    const res = await axios.post(BASE_URL+"/signup",{
    firstName,
    lastName,
    emailId,
    password
  },{
    withCredentials:true
  });
  dispatch(addUser(res.data));
 
      navigate("/profile");
  } catch (error) {
    setError(error?.response?.data || "Something went wrong");
  }
  
 }

  return (
    <div className="card bg-base-300 w-96 mx-auto mt-[5%]">
      <div className="card-body">

        <h2 className="text-lg text-center justify-center mb-4">💟CodeCrush</h2>
        <h2 className="card-title justify-center text-xl"> {isLogInForm? "Login":"SignUp"}</h2>

        
        <div className="mt-6">
         {!isLogInForm&&<><div>
            <label className="input validator w-full items-center gap-2">
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
              value={firstName}
              onChange={(e)=>setFirstName(e.target.value)}
                type="text"
                required
                placeholder="First Name"
                pattern="[A-Za-z][A-Za-z\-]*"
                minLength="3"
                maxLength="30"
                title="Only letters"
              />
            </label>
            <p className="validator-hint text-sm text-gray-400">
              Must be 3 to 30 characters containing only letters
            </p>
          </div>

         
          <div>
            <label className="input validator w-full items-center gap-2">
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </g>
              </svg>
              <input
              value={lastName}
              onChange={(e)=>setLastName(e.target.value)}
                type="text"
                required
                placeholder="Last Name"
                pattern="[A-Za-z][A-Za-z\-]*"
                minLength="3"
                maxLength="30"
                title="Only letters"
              />
            </label>
            <p className="validator-hint text-sm text-gray-400">
              Must be 3 to 30 characters containing only letters
            </p>
          </div>
</>}
          
         
          <div>
            <label className="input validator w-full items-center gap-2">
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
                onChange={(e) => setEmailId(e.target.value)}
                type="email"
                placeholder="Email"
                required
              />
            </label>
            <p className="validator-hint text-sm text-gray-400">
              Enter valid email address
            </p>
          </div>

         
          <div>
            <label className="input validator w-full items-center gap-2">
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
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </g>
              </svg>
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                type={showPassword?"text":"password"}
                required
                placeholder="Password"
                minLength="5"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}"
                title="Must be more than 5 characters, including number, lowercase letter, uppercase letter"
              />
              <button
          type="button"
           onMouseDown={(e) => {
    e.preventDefault(); 
  }}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            // Eye Open
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            // Eye Closed
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.24-3.63m2.122-1.743A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.958 9.958 0 01-4.094 5.227M15 12a3 3 0 00-4.243-4.243M3 3l18 18"
              />
            </svg>
          )}
        </button>
            </label>
            <p className="validator-hint text-sm text-gray-400">
              Enter valid password
            </p>
          </div>
        </div>

      
        {error && <p className="text-red-400 text-center">{error}</p>}

        
        <div className="card-actions justify-center">
          <button onClick={isLogInForm? handleLogin:handleSignUp} className="btn btn-wide bg-blue-500">
            {isLogInForm? "Login":"SignUp"}
          </button>
        </div>
        <div className="text-center">
  <span
    className="cursor-pointer w-fit inline-block my-2"
    onClick={() => setIsLoginForm((pre) => !pre)}
  >
    {isLogInForm ? "New user? Signup here" : "Existing user? Login now"}
  </span>
</div>
      </div>
    </div>
  );
};

export default Login;

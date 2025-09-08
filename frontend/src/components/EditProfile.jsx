import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { UserCard } from "./UserCard";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age );
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast]= useState(false)

  const dispatch = useDispatch();

  const validateForm = () => {
    if (!firstName.trim()) return setError("First name is required");
    if (!lastName.trim()) return setError("Last name is required");
    if (!age ||  age < 18 || age >100) return setError("Valid age is required");
    if (!gender) return setError("Gender is required");
    if (skills.length > 5) return setError("maximum 5 skills allowed");
    
    setError("");
    return true;
  };

  const handleAddSkill = () => {
    
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill) => {
    if(skills.length <7){setError('')}
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender: gender.toLowerCase(),
          about,
          skills,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className=" flex md:flex-row flex-col justify-center gap-10 m-4">
      {showToast && <div className="toast toast-top toast-center z-10">
                <div className="alert alert-success">
          <span>Profile updated successfully.</span>
        </div>
      </div>}
      <div className="card card-border bg-base-300 md:w-96 w-full  ">
        <div className="card-body p-4">
          <h2 className="card-title justify-center text-lg">Edit Profile</h2>

          {/* First Name */}
          <label className="input validator my-1 w-full">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              placeholder="First Name"
              required
            />
          </label>

          {/* Last Name */}
          <label className="input validator my-1 w-full">
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              placeholder="Last Name"
              required
            />
          </label>
          <label className="input validator my-1 w-full">
            <input
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              type="text"
              placeholder="Photo Url"
              required
            />
          </label>

          {/* Age */}
          <label className="input validator my-1 w-full">
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              type="number"
              placeholder="Age"
              required
              min="18"
              max="100"
            />
          </label>

          {/* Gender */}
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="select select-bordered my-1 w-full"
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          {/* About */}
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="textarea textarea-bordered my-1 w-full"
            placeholder="About yourself"
            rows={1} // reduced from 3
          ></textarea>

          {/* Skills */}
          <div>
            <label className="input validator my-1 w-full flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                type="text"
                placeholder="Add skill"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn btn-sm btn-primary"
              >
                Add
              </button>
            </label>
            <div className="flex flex-wrap gap-1 mt-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="badge badge-outline gap-1 cursor-pointer hover:text-red-400"
                  onClick={() => handleRemoveSkill(skill)}
                >
                  {skill} ✕
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-[oklch(71%_0.194_13.428)] mt-1">{error}</p>
          )}

          {/* Save Button */}
          <div className="card-actions justify-center mt-2">
            <button
              onClick={handleSaveProfile}
              className="btn btn-wide bg-blue-500"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
      <UserCard
        user={{ firstName, lastName, gender, age, skills, about, photoUrl }}
        hideActions={true}
      />
    </div>
  );
};

export default EditProfile;

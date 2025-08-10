export const UserCard = ({ user = {}, hideActions}) => {
  const { photoUrl, firstName,lastName,gender,age,skills,about } = user;
 
  return (
    <div className="card bg-base-300 w-80 shadow-sm">
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
            <span key={i} className="badge mr-2">{s}</span>
          ))}
        </div>
        {!hideActions && <div className="card-actions justify-center">
          <button className="btn btn-secondary">Ignore</button>
          <button className="btn btn-primary">Interested</button>
        </div>}
      </div>
    </div>
  );
};

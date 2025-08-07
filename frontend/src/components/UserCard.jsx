

export const UserCard = ({user}) => {
  const{photoUrl,firstName} = user
  const age =20;
  const gender= "Male"
  return (
    <div className="card bg-base-300 w-96 shadow-sm">
  <figure>
    <img className="w-[80%]"
      src={photoUrl}
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title"><span>{firstName},</span> 
    {gender&& age && <div><span>{age}</span> <span>{gender}</span></div>}
    </h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div className="card-actions justify-center">
      <button className="btn btn-secondary">Ignore</button>
      <button className="btn btn-primary">Interested</button>
    </div>
  </div>
</div>
  )
}

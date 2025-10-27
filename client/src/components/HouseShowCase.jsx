import HalfImageCard from './HalfImageCard.jsx';
const HouseShowCase = () => {
  let imageList=['https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.countryliving.com%2Fhome-design%2Fg61548644%2Fhouse-styles-guide%2F&psig=AOvVaw0kTHNq7MdmXTPCALeJqTg_&ust=1761435077140000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCOipzpL_vZADFQAAAAAdAAAAABAE',
  'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bhg.com%2Fhome-improvement%2Fexteriors%2Fcurb-appeal%2Fhouse-styles%2F&psig=AOvVaw0kTHNq7MdmXTPCALeJqTg_&ust=1761435077140000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCOipzpL_vZADFQAAAAAdAAAAABAL',
  'https://www.google.com/url?sa=i&url=https%3A%2F%2Fhousely.com%2Ftypes-of-houses%2F&psig=AOvVaw0kTHNq7MdmXTPCALeJqTg_&ust=1761435077140000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCOipzpL_vZADFQAAAAAdAAAAABAV']
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
       <div className="flex flex-row items-center gap-8">
        {imageList.map((image, index) => (
          <HalfImageCard key={index} imageUrl={image} />
        ))}
      </div>
      <div className="h-screen"></div>
    </div>
  );
};

export default HouseShowCase;  

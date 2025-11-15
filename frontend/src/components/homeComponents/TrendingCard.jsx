const TrendingCard = ({ image, title, description, date }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-[300px] shrink-0">
      <img src={image} alt={title} className="w-full h-56 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <p className="text-gray-600 text-xs">{date}</p>
      </div>
    </div>
  );
};

export default TrendingCard;

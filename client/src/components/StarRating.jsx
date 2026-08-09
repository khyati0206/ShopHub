const StarRating = ({ rating, reviewCount, size = 'sm' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const sizeClass = size === 'lg' ? 'text-lg' : 'text-sm';

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <span key={i} className={`text-amazon-orange ${sizeClass}`}>&#9733;</span>
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <span key={i} className={`text-amazon-orange ${sizeClass}`}>&#9733;</span>
      );
    } else {
      stars.push(
        <span key={i} className={`text-gray-300 ${sizeClass}`}>&#9733;</span>
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {reviewCount !== undefined && (
        <span className="text-xs text-blue-600 hover:text-orange-700 cursor-pointer">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;

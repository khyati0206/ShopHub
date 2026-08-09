import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    title: 'Summer Tech Sale',
    subtitle: 'Up to 40% off electronics',
    link: '/products?category=Electronics&featured=deals',
    image: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop',
    bg: 'from-blue-900 to-blue-700',
  },
  {
    title: 'Home Essentials',
    subtitle: 'Upgrade your kitchen & living space',
    link: '/products?category=Home%20%26%20Kitchen',
    image: 'https://images.pexels.com/photos/4226766/pexels-photo-4226766.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop',
    bg: 'from-green-900 to-green-700',
  },
  {
    title: 'Fashion Finds',
    subtitle: 'Trending styles at unbeatable prices',
    link: '/products?category=Fashion',
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop',
    bg: 'from-purple-900 to-purple-700',
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <Link
            key={index}
            to={slide.link}
            className="w-full shrink-0 relative h-48 sm:h-64 md:h-80"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-60`} />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">{slide.title}</h2>
              <p className="text-lg md:text-xl text-white/90">{slide.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === current ? 'bg-amazon-orange' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroCarousel;

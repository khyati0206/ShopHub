import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductSkeleton';

const categories = [
  { name: 'Electronics', slug: 'Electronics', image: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', color: 'bg-blue-100' },
  { name: 'Books', slug: 'Books', image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', color: 'bg-green-100' },
  { name: 'Home & Kitchen', slug: 'Home & Kitchen', image: 'https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', color: 'bg-yellow-100' },
  { name: 'Fashion', slug: 'Fashion', image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', color: 'bg-pink-100' },
];

const ProductSection = ({ title, featured, linkTo }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products', {
          params: { featured, limit: 8 },
        });
        setProducts(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [featured]);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {linkTo && (
          <Link to={linkTo} className="text-sm text-blue-600 hover:text-orange-700 hover:underline">
            See all
          </Link>
        )}
      </div>
      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

const HomePage = () => {
  return (
    <div>
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${encodeURIComponent(cat.slug)}`}
              className={`${cat.color} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow`}
            >
              <img src={cat.image} alt={cat.name} className="w-full h-32 object-cover" />
              <div className="p-3 text-center">
                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                <span className="text-sm text-blue-600">Shop now</span>
              </div>
            </Link>
          ))}
        </div>

        <ProductSection title="Deals of the Day" featured="deals" linkTo="/products?featured=deals" />
        <ProductSection title="Recommended for You" featured="recommended" linkTo="/products?featured=recommended" />
        <ProductSection title="Best Sellers" featured="bestseller" linkTo="/products?featured=bestseller" />
      </div>
    </div>
  );
};

export default HomePage;

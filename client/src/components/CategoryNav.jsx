import { Link } from 'react-router-dom';

const categories = [
  { name: 'All', slug: '' },
  { name: 'Electronics', slug: 'Electronics' },
  { name: 'Books', slug: 'Books' },
  { name: 'Home & Kitchen', slug: 'Home & Kitchen' },
  { name: 'Fashion', slug: 'Fashion' },
];

const CategoryNav = () => {
  return (
    <nav className="bg-amazon-dark text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 overflow-x-auto py-2 text-sm scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={cat.slug ? `/products?category=${encodeURIComponent(cat.slug)}` : '/products'}
              className="whitespace-nowrap hover:text-amazon-orange transition-colors py-1"
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/products?featured=deals" className="whitespace-nowrap hover:text-amazon-orange transition-colors py-1 font-medium">
            Today&apos;s Deals
          </Link>
          <Link to="/products?featured=bestseller" className="whitespace-nowrap hover:text-amazon-orange transition-colors py-1">
            Best Sellers
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;

import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-amazon-dark text-white mt-auto">
      <div className="bg-amazon-navy py-4 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm hover:underline"
        >
          Back to top
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-3 text-sm">Get to Know Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><span className="hover:underline cursor-pointer">About ShopHub</span></li>
              <li><span className="hover:underline cursor-pointer">Careers</span></li>
              <li><span className="hover:underline cursor-pointer">Press Releases</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-sm">Make Money with Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><span className="hover:underline cursor-pointer">Sell on ShopHub</span></li>
              <li><span className="hover:underline cursor-pointer">Become an Affiliate</span></li>
              <li><span className="hover:underline cursor-pointer">Advertise Your Products</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-sm">ShopHub Payment</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><span className="hover:underline cursor-pointer">ShopHub Rewards</span></li>
              <li><span className="hover:underline cursor-pointer">Shop with Points</span></li>
              <li><span className="hover:underline cursor-pointer">Reload Balance</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-sm">Let Us Help You</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/orders" className="hover:underline">Your Orders</Link></li>
              <li><span className="hover:underline cursor-pointer">Shipping Rates & Policies</span></li>
              <li><span className="hover:underline cursor-pointer">Returns & Replacements</span></li>
              <li><span className="hover:underline cursor-pointer">Help</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-600 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-bold mb-2">
            <span className="text-amazon-orange">Shop</span>Hub
          </p>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ShopHub Clone. For educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

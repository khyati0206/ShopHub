import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-amazon-navy text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 py-2">
          <button
            className="lg:hidden p-2 hover:bg-white/10 rounded"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-1 shrink-0">
            <span className="text-2xl font-bold text-amazon-orange">Shop</span>
            <span className="text-2xl font-bold">Hub</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-3xl">
            <div className="flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ShopHub"
                className="flex-1 px-4 py-2 text-gray-900 rounded-l-md focus:outline-none"
              />
              <button
                type="submit"
                className="bg-amazon-orange hover:bg-amazon-orange-hover px-5 rounded-r-md transition-colors"
              >
                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center gap-4 ml-auto">
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex flex-col items-start hover:outline hover:outline-1 hover:outline-white p-1 rounded"
              >
                <span className="text-xs text-gray-300">
                  Hello, {user ? user.name.split(' ')[0] : 'Sign in'}
                </span>
                <span className="text-sm font-bold flex items-center gap-1">
                  Account & Lists
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white text-gray-900 rounded shadow-lg py-2 z-50">
                  {user ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowAccountMenu(false)}>Your Profile</Link>
                      <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowAccountMenu(false)}>Your Orders</Link>
                      <button onClick={() => { logout(); setShowAccountMenu(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowAccountMenu(false)}>Sign In</Link>
                      <Link to="/register" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setShowAccountMenu(false)}>Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/orders" className="flex flex-col items-start hover:outline hover:outline-1 hover:outline-white p-1 rounded">
              <span className="text-xs text-gray-300">Returns</span>
              <span className="text-sm font-bold">& Orders</span>
            </Link>

            <Link to="/cart" className="flex items-end gap-1 hover:outline hover:outline-1 hover:outline-white p-1 rounded relative">
              <div className="relative">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amazon-orange text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold hidden lg:inline">Cart</span>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSearch} className="sm:hidden pb-2">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ShopHub"
              className="flex-1 px-4 py-2 text-gray-900 rounded-l-md focus:outline-none"
            />
            <button type="submit" className="bg-amazon-orange px-4 rounded-r-md">
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {showMobileMenu && (
        <div className="lg:hidden bg-amazon-dark px-4 py-3 space-y-2">
          <Link to="/cart" className="block py-2" onClick={() => setShowMobileMenu(false)}>Cart ({itemCount})</Link>
          <Link to="/orders" className="block py-2" onClick={() => setShowMobileMenu(false)}>Orders</Link>
          {user ? (
            <>
              <Link to="/profile" className="block py-2" onClick={() => setShowMobileMenu(false)}>Profile</Link>
              <button onClick={() => { logout(); setShowMobileMenu(false); }} className="block py-2 text-red-400">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2" onClick={() => setShowMobileMenu(false)}>Sign In</Link>
              <Link to="/register" className="block py-2" onClick={() => setShowMobileMenu(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

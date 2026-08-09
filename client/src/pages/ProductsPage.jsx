import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ProductSkeleton';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || '';
  const q = searchParams.get('q') || '';
  const featured = searchParams.get('featured') || '';
  const sort = searchParams.get('sort') || '';
  const page = searchParams.get('page') || '1';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const brand = searchParams.get('brand') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (category) params.category = category;
        if (q) params.q = q;
        if (featured) params.featured = featured;
        if (sort) params.sort = sort;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minRating) params.minRating = minRating;
        if (brand) params.brand = brand;

        const { data } = await api.get('/products', { params });
        setProducts(data.products);
        setBrands(data.brands);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, q, featured, sort, page, minPrice, maxPrice, minRating, brand]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const toggleBrand = (brandName) => {
    const current = brand ? brand.split(',') : [];
    const updated = current.includes(brandName)
      ? current.filter((b) => b !== brandName)
      : [...current, brandName];
    updateFilter('brand', updated.join(','));
  };

  const title = q
    ? `Results for "${q}"`
    : category
    ? category
    : featured
    ? featured.charAt(0).toUpperCase() + featured.slice(1)
    : 'All Products';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600">{pagination.total} results</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="md:hidden btn-secondary text-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </button>
          <select
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="input-field w-auto text-sm"
          >
            <option value="">Sort by: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-6 sticky top-32">
            <div>
              <h3 className="font-bold mb-3">Price</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="input-field text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3">Customer Review</h3>
              {[4, 3.5, 3].map((rating) => (
                <label key={rating} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === String(rating)}
                    onChange={() => updateFilter('minRating', String(rating))}
                  />
                  <span className="text-sm">{rating}+ Stars</span>
                </label>
              ))}
              {minRating && (
                <button onClick={() => updateFilter('minRating', '')} className="text-xs text-blue-600 hover:underline">
                  Clear
                </button>
              )}
            </div>

            {brands.length > 0 && (
              <div>
                <h3 className="font-bold mb-3">Brand</h3>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {brands.map((b) => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={brand.split(',').includes(b)}
                        onChange={() => toggleBrand(b)}
                      />
                      <span className="text-sm">{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No products found</p>
              <button
                onClick={() => setSearchParams({})}
                className="mt-4 btn-primary"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFilter('page', String(p))}
                      className={`px-3 py-1 rounded ${
                        Number(page) === p
                          ? 'bg-amazon-orange text-gray-900 font-bold'
                          : 'bg-white border hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

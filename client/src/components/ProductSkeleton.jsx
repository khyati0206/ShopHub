const ProductSkeleton = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
    <div className="aspect-square bg-gray-200 rounded mb-3" />
    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2" />
    <div className="h-6 bg-gray-200 rounded w-1/3" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

export default ProductSkeleton;

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  DEFAULT_PAGE,
  getMockData,
  MockData,
  MockDataResponse,
} from './data/mockData';
import Loading from './components/Loading';
import Card from './components/Card';

const App: React.FC = () => {
  const [products, setProducts] = useState<MockData[]>([]);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastProductElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    setLoading(true);
    getMockData(page)
      .then((res: MockDataResponse) => {
        setProducts((prevProducts) => [...prevProducts, ...res.datas]);
        setHasMore(!res.isEnd);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, [page]);

  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="App">
      <div className="container mx-auto p-4">
        <div className="bg-pink-500 shadow-md z-10 sticky top-0">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">Product List</h1>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">
                Total Price: ${totalPrice.toFixed(2)}
              </p>
              <p className="text-sm">Loaded Products: {products.length}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {products.map((product, index) => (
            <Card
              key={product.productId}
              ref={index === products.length - 1 ? lastProductElementRef : null}
              name={product.productName}
              price={product.price}
              date={product.boughtDate}
            />
          ))}
        </div>
        {loading && <Loading />}
        {!hasMore && (
          <div className="text-center py-4">No more products to load.</div>
        )}
      </div>
    </div>
  );
};

export default App;

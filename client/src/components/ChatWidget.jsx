import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductImage';
import { formatPrice } from '../utils/helpers';

const ProductRecommendation = ({ rec, onAddToCart }) => {
  const product = rec.product;
  if (!product) return null;

  return (
    <div className="bg-white rounded-lg border p-3 mt-2 max-w-xs">
      <Link to={`/products/${product._id}`} className="flex gap-3">
        <ProductImage
          src={product.images?.[0]}
          alt={product.title}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-clamp-2 hover:text-orange-700">{product.title}</p>
          <p className="text-sm font-bold text-red-700">{formatPrice(product.price)}</p>
        </div>
      </Link>
      {rec.reason && (
        <p className="text-xs text-gray-500 mt-1">{rec.reason}</p>
      )}
      <button
        onClick={() => onAddToCart(product._id)}
        className="mt-2 w-full text-xs btn-primary py-1.5"
      >
        Add to Cart
      </button>
    </div>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your ShopHub shopping assistant. Ask me to find products — like \"laptop under ₹50,000 for gaming\" or \"best books for kids\".",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const { data } = await api.post('/ai-assistant/chat', {
        message: userMessage,
        conversationHistory: history,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          recommendations: data.recommendations,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm having trouble right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(productId);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Added to your cart!' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Failed to add to cart. Please try again.' },
      ]);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[calc(100vw-2rem)] sm:w-96 h-[500px] bg-white rounded-lg shadow-2xl border z-50 flex flex-col overflow-hidden">
          <div className="bg-amazon-navy text-white px-4 py-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm">ShopHub Assistant</h3>
              <p className="text-xs text-gray-300">AI-powered product finder</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 p-1 rounded"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-amazon-orange text-gray-900'
                      : 'bg-white border text-gray-800'
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.recommendations?.map((rec, j) => (
                    <ProductRecommendation
                      key={j}
                      rec={rec}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-lg px-4 py-2 text-sm text-gray-500">
                  <div className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products..."
              className="flex-1 input-field text-sm py-2"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-amazon-orange hover:bg-amazon-orange-hover px-4 rounded-md disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-amazon-orange hover:bg-amazon-orange-hover rounded-full shadow-lg flex items-center justify-center z-50 transition-transform hover:scale-105"
        aria-label="Open shopping assistant"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  );
};

export default ChatWidget;

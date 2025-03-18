import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`); // Adjusted to match your route
        if (!response.ok) {
          const text = await response.text(); // Log raw response for debugging
          console.log('Raw response:', text);
          throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col">
        <p>{error || 'Product not found'}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Main Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Product Image */}
            <div>
              <img 
                src={product.imageUrl || '/placeholder.png'} 
                alt={product.name} 
                className="w-full h-96 object-cover rounded-lg mb-4"
              />
              {/* Note: No additional images array in this version */}
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              <p className="text-2xl font-semibold mb-4">
                ${product.price.toFixed(2)}
                {product.discount > 0 && (
                  <span className="text-sm text-muted-foreground line-through ml-2">
                    ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="text-sm text-green-600 ml-2">
                    {product.discount}% off
                  </span>
                )}
              </p>

              {/* Note: No description field in this version */}
              <div className="mb-6">
                <p className="text-sm">
                  Category: <span className="font-medium">{product.category.name}</span>
                </p>
                {/* Note: No stock field in this version */}
              </div>

              <Button size="lg">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
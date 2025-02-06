"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  mainImage: string;
  firstImage: string;
  secondImage: string;
  thirdImage: string;
  fourthImage: string;
  fifthImage: string;
  title: string;
  description: string;
  category: string;
  price: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading("true");
        const res = await axios.get("/api/getProduct");
        setProducts(res.data.products);
        setLoading(null);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProducts();
  }, []);

  const handleWishlist = async (productId: string) => {
    if (loading === productId) return; // Prevent multiple clicks
    setLoading(productId);

    try {
      const res = await axios.post(`/api/wishlist?id=${productId}`);
      const { isWishlisted } = res.data;

      setWishlistedItems(
        (prev) =>
          isWishlisted
            ? [...prev, productId] // Add to wishlist
            : prev.filter((id) => id !== productId) // Remove from wishlist
      );
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="sm:py-20 py-10 sm:px-10 px-5 grid sm:grid-cols-3 grid-cols-1 gap-20">
      {products.map((product) => (
        <div
          className="card card-compact bg-base-100 w-full shadow-xl"
          key={product.id}
        >
          <figure>
            <img src={product.mainImage} alt={product.title} />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{product.title}</h2>
            <p>{product.description}</p>
            <span className="text-lg text-orange-600 font-bold">
              ₹{product.price}
            </span>
            <div className="card-actions justify-between items-center mt-5">
              <Heart
                className={`w-6 h-6 hover:cursor-pointer transition-all ${
                  wishlistedItems.includes(product.id)
                    ? "text-red-600"
                    : "text-slate-600"
                } ${loading === product.id ? "animate-pulse" : ""}`}
                onClick={() => handleWishlist(product.id)}
              />
              <Link
                href={{
                  pathname: "/buyingSection",
                  query: { ...product },
                }}
              >
                <button className="btn btn-primary">Buy Now</button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

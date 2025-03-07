"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

interface Product {
  id: string;
  mainImage: string;
  title: string;
  description: string;
  price: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [wishlist, setWishlist] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading("true");
        const res = await axios.get("/api/getProduct");
        const filteredProducts = res.data.products.filter((product: Product) =>
          product.description.toLowerCase().includes(search.toLowerCase())
        );

        setProducts(filteredProducts);
        setLoading(null);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProducts();
  }, [search]);

  const handleSearch = async () => {
    try {
      setLoading("true");
      const res = await axios.get("/api/getProduct");
      const filteredProducts = res.data.products.filter((product: Product) =>
        product.description.toLowerCase().includes(search.toLowerCase())
      );

      setProducts(filteredProducts);
      setLoading(null);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleWishlist = async (productId: string) => {
    try {
      setLoading("true");
      const res = await axios.post("/api/addWishlist", { productId });
      console.log(res.data);
      setWishlist((prev) => ({ ...prev, [productId]: true }));
      setLoading(null);
    } catch (error) {
      console.error(error);
      setLoading(null);
    }
  };

  const checkWishlistStatus = async (productId: string) => {
    try {
      setLoading("true");
      const res = await axios.post("/api/getWishlist", { productId });
      setWishlist((prev) => ({ ...prev, [productId]: res.data.isWishlisted }));
      setLoading(null);
    } catch (error) {
      console.error(error);
      setLoading(null);
    }
  };

  useEffect(() => {
    products.forEach((product) => {
      checkWishlistStatus(product.id);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:w-[600px] w-full sm:mt-10 mt-5 sm:px-10 px-5 flex justify-center items-center gap-2">
        <input
          type="text"
          placeholder="Search products"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="cursor-pointer bg-slate-800 h-10 w-10 rounded-md py-2 px-2"
          onClick={handleSearch}
        >
          <FaSearch className="text-white text-xl" />
        </button>
      </div>
      <div className="sm:py-10 py-5 sm:px-10 px-5 grid sm:grid-cols-3 grid-cols-1 gap-20">
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
              <div className="card-actions mt-5 flex items-center justify-between">
                <Link
                  href={{
                    pathname: "/buyingSection",
                    query: { ...product },
                  }}
                >
                  <button className="btn btn-primary">Buy Now</button>
                </Link>
                <FaHeart
                  className={`text-2xl hover:cursor-pointer ${
                    wishlist[product.id] ? "text-red-600" : "text-white"
                  }`}
                  onClick={() => handleWishlist(product.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

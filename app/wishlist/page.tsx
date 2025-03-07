"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Product {
  product: {
    id: string;
    mainImage: string;
    title: string;
    description: string;
    price: string;
  };
}

function Wishlist() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/getAllWishlist");
        setProducts(res.data.items);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const deleteProduct = async (productId: string) => {
    try {
      setRemoveLoading(true);
      await axios.post("/api/deleteWishlist", { productId });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.product.id !== productId)
      );
      setRemoveLoading(false);
    } catch (error) {
      console.error(error);
      setRemoveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-600"></div>
      </div>
    );
  }
  return (
    <div>
      {removeLoading && (
        <div className="flex items-center justify-center mt-5">
          <span className="loading loading-spinner sm:loading-lg loading-md"></span>
        </div>
      )}
      <div className="sm:py-10 py-5 sm:px-10 px-5 grid sm:grid-cols-3 grid-cols-1 gap-20">
        {products.map((product) => (
          <div
            className="card card-compact bg-base-100 w-full shadow-xl"
            key={product.product.id}
          >
            <figure>
              <img
                src={product.product.mainImage}
                alt={product.product.title}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.product.title}</h2>
              <p>{product.product.description}</p>
              <span className="text-lg text-orange-600 font-bold">
                ₹{product.product.price}
              </span>
              <div className="card-actions mt-5 flex items-center justify-between">
                <Link
                  href={{
                    pathname: "/buyingSection",
                    query: { ...product.product },
                  }}
                >
                  <button className="btn btn-primary">Buy Now</button>
                </Link>
                <button
                  className="btn btn-error"
                  onClick={() => deleteProduct(product.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;

"use client";

import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
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

function Category() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean | null>(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/getProduct");
        const filteredProducts = res.data.products.filter((product: Product) =>
          product.category.toLowerCase().includes(category.toLowerCase())
        );

        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    getProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }
  return (
    <div>
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
              <div className="card-actions mt-5">
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
    </div>
  );
}

function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Category />
    </Suspense>
  );
}

export default CategoryPage;

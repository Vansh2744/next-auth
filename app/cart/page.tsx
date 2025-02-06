"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface Product {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    mainImage: string;
  };
}

function Cart() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading as true
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/getCartItems");
        setProducts(res.data.products);

        // Initialize quantity for each product
        const initialQuantities: { [key: string]: number } = {};
        res.data.products.forEach((product: Product) => {
          initialQuantities[product.product.id] = 1;
        });

        setQuantities(initialQuantities);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    fetchProducts();
  }, []);

  // Calculate total whenever quantities or products change
  useEffect(() => {
    if (products.length > 0) {
      const newTotal = products.reduce(
        (acc, item) =>
          acc + item.product.price * (quantities[item.product.id] || 1),
        0
      );
      setTotal(newTotal);
    }
  }, [quantities, products]);

  const increment = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min((prev[id] || 1) + 1, 10),
    }));
  };

  const decrement = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1),
    }));
  };

  const handleRemoveCart = async (id: string) => {
    try {
      const res = await axios.post("/api/removeCart", { id });
      console.log(res.data);
      setProducts(products.filter((item) => item.product.id !== id));
    } catch (error) {}
  };

  return (
    <div className="flex sm:flex-row flex-col sm:px-10 px-5 py-10 gap-10">
      {loading ? (
        <div className="flex justify-center items-center h-screen w-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        <>
          <div className="relative flex flex-col gap-10">
            {products.map((item) => (
              <div
                className="relative bg-base-100 sm:w-[900px] w-full shadow-xl flex sm:flex-row flex-col gap-10"
                key={item?.product.id}
              >
                <figure>
                  <img
                    src={item.product.mainImage}
                    alt={item.product.title}
                    className="sm:h-[400px] h-[250px] sm:w-[700px] w-full"
                  />
                </figure>
                <div className="w-full flex flex-col sm:gap-10 gap-5 py-5 sm:px-0 px-3">
                  <div className="sm:relative flex flex-col gap-5">
                    <Button
                      className="absolute w-8 h-8 sm:top-0 top-2 sm:right-5 right-2 text-xl"
                      onClick={() => handleRemoveCart(item.product.id)}
                    >
                      x
                    </Button>
                    <h2 className="sm:text-3xl text-xl font-extrabold">
                      {item.product.title}
                    </h2>
                    <p className="sm:text-xl text-md">
                      {item.product.description}
                    </p>
                    <h2 className="sm:text-3xl text-xl font-extrabold">
                      ₹{item.product.price}
                    </h2>
                  </div>
                  <div className="flex">
                    <div
                      className="bg-slate-300 text-slate-600 sm:h-10 h-5 sm:w-10 w-5 flex justify-center items-center sm:text-3xl text-xl font-extrabold hover:cursor-pointer"
                      onClick={() => increment(item.product.id)}
                    >
                      +
                    </div>
                    <div className="bg-slate-600 sm:h-10 h-5 sm:w-10 w-5 flex justify-center items-center sm:text-xl text-md font-extrabold">
                      {quantities[item.product.id]}
                    </div>
                    <div
                      className="bg-slate-300 text-slate-600 sm:h-10 h-5 sm:w-10 w-5 flex justify-center items-center sm:text-3xl text-xl font-extrabold hover:cursor-pointer"
                      onClick={() => decrement(item.product.id)}
                    >
                      -
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-slate-600 w-full h-full p-10 flex flex-col gap-10">
            <h2 className="text-3xl font-extrabold">Order Summary</h2>
            <div className="flex flex-col gap-5">
              {products.map((item) => (
                <div className="flex justify-between" key={item?.product.id}>
                  <p className="text-xl">{item.product.title}</p>
                  <p className="text-xl">
                    ₹{item.product.price * (quantities[item.product.id] || 1)}
                  </p>
                </div>
              ))}
              <p className="text-2xl font-bold mt-5">Total: ₹{total}</p>
            </div>
            <button className="bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

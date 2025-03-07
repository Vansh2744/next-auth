"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Order {
  address: string;
  name: string;
  state: string;
  pincode: string;
  phone: string;
  product: {
    title: string;
    description: string;
    mainImage: string;
    price: number;
  };
}

function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/getOrders");
        setOrders(res.data.orders);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-600"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-10 px-10 py-10">
      {orders.map((order, index) => (
        <div key={index} className="bg-slate-600 flex sm:flex-row flex-col gap-10 sm:items-center sm:justify-normal justify-center sm:pr-5">
          <Image
            src={order.product.mainImage}
            height={100}
            width={100}
            alt="not found"
            className="sm:w-[300px] w-full"
          />
          <div className="text-xl sm:p-0 p-5">
            <p className="font-bold">{order.product.title}</p>
            <p>{order.product.description}</p>
            <p className="text-2xl font-extrabold">-/{order.product.price}</p>
          </div>
          <div className="text-xl sm:p-0 p-5">
            <p>{order.name}</p>
            <p>{order.address}</p>
            <p>{order.state}</p>
            <p>{order.pincode}</p>
            <p>{order.phone}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Order;

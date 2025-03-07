"use client";

import React, { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

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

function PaymentPage() {
  const [data, setData] = useState({
    name: "",
    address: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const productParams = searchParams.get("products");
  const total = searchParams.get("total");

  const router = useRouter();

  useEffect(() => {
    if (productParams) {
      try {
        const parsedProducts: Product[] = JSON.parse(productParams);
        setProducts(parsedProducts);
      } catch (error) {
        console.error("Failed to parse products:", error);
      }
    }
  }, [productParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      data.name === "" ||
      data.address === "" ||
      data.state === "" ||
      data.pincode === "" ||
      data.phone === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    if (data.pincode.length !== 6) {
      toast.error("Please enter a valid pincode");
      return;
    }

    if (data.phone.length !== 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/order", {
        name: data.name,
        address: data.address,
        state: data.state,
        pincode: data.pincode,
        phone: data.phone,
        products,
      });

      setLoading(false);
      toast.success("Order Placed Successfully");
      router.push("/order");
    } catch (error) {
      console.error(error);
      setLoading(false);
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
    <div className="h-full w-full flex flex-col items-center py-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-10">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Full Name</legend>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="input"
            placeholder="Full Name"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Address</legend>
          <input
            type="text"
            name="address"
            value={data.address}
            onChange={handleChange}
            className="input"
            placeholder="Address"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">State</legend>
          <input
            type="text"
            name="state"
            value={data.state}
            onChange={handleChange}
            className="input"
            placeholder="State"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">PIN Code</legend>
          <input
            type="text"
            name="pincode"
            value={data.pincode}
            onChange={handleChange}
            className="input"
            placeholder="PIN Code"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Phone Number</legend>
          <input
            type="text"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            className="input"
            placeholder="Phone Number"
          />
        </fieldset>

        <button
          className="btn mt-5 bg-orange-600 hover:bg-orange-500"
          type="submit"
        >
          Place Order
        </button>
      </form>
      <h1 className="text-2xl font-bold">
        <span className="text-orange-600">Total Amount : </span>-/{total}
      </h1>
    </div>
  );
}

function PaymentSuspense() {
  return (
    <Suspense>
      <PaymentPage />
    </Suspense>
  );
}

export default PaymentSuspense;

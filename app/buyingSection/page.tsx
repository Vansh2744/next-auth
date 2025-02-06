"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function Buying() {
  const { user } = useUser();
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const price = searchParams.get("price");
  const mainImage = searchParams.get("mainImage") ?? "";
  const firstImage = searchParams.get("firstImage") ?? "";
  const secondImage = searchParams.get("secondImage") ?? "";
  const thirdImage = searchParams.get("thirdImage") ?? "";
  const fourthImage = searchParams.get("fourthImage") ?? "";
  const fifthImage = searchParams.get("fifthImage") ?? "";

  const [frameImage, setFrameImage] = useState(mainImage);
  const [gotoCart, setGotoCart] = useState(false);
  const [locading, setLoading] = useState(false);

  const handleCart = async () => {
    try {
      if (user) {
        setLoading(true);
        const res = await axios.post("/api/addToCart", { id });
        console.log(res.data);
        setLoading(false);
        window.location.reload();
        toast.success("Product Added To Cart");
      } else {
        toast.error("Please Login First");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const cart = async () => {
      try {
        if (user) {
          const res = await axios.get(`/api/getCart?id=${id}`);
          setGotoCart(res.data.cart);
        } else {
          setGotoCart(false);
        }
      } catch (error) {
        console.error(error);
        setGotoCart(false);
      }
    };

    cart();
  }, [user]);

  const checkUser = () => {
    if (!user) {
      toast.error("Please Login First");
    }
  };

  if (locading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="px-5 py-10">
      <div className="py-10 px-10 sm:visible sm:block hidden">
        <div className="flex gap-10 items-center bg-slate-600 h-[600px]">
          <Image
            src={frameImage}
            width={600}
            height={600}
            alt="Not Found"
            className="h-[600px] w-[600px]"
          />
          <div className="flex flex-col gap-10 py-5">
            <p className="text-3xl font-bold">{title}</p>
            <p className="text-xl">{description}</p>
            <p className="text-4xl font-bold">-/{price}</p>
            {!gotoCart ? (
              <Button className="w-40 bg-yellow-500" onClick={handleCart}>
                Add To Cart
              </Button>
            ) : (
              ""
            )}
            <div className="w-full flex flex-col items-center mt-10">
              {gotoCart ? (
                <Button
                  className="bg-yellow-600 w-[400px] item-center hover:bg-yellow-500"
                  onClick={() => {
                    router.push("/cart");
                  }}
                >
                  GO TO CART
                </Button>
              ) : (
                <Button
                  className="bg-orange-600 w-[400px] item-center hover:bg-orange-500"
                  onClick={checkUser}
                >
                  Buy Now
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <Image
            src={mainImage}
            width={100}
            height={100}
            alt="Not Found"
            onClick={() => {
              setFrameImage(mainImage);
            }}
            className="hover:cursor-pointer"
          />
          <Image
            src={firstImage}
            width={100}
            height={100}
            alt="Not Found"
            onClick={() => {
              setFrameImage(firstImage);
            }}
            className="hover:cursor-pointer"
          />
          <Image
            src={secondImage}
            width={100}
            height={100}
            alt="Not Found"
            onClick={() => {
              setFrameImage(secondImage);
            }}
            className="hover:cursor-pointer"
          />
          <Image
            src={thirdImage}
            width={100}
            height={100}
            alt="Not Found"
            onClick={() => {
              setFrameImage(thirdImage);
            }}
            className="hover:cursor-pointer"
          />
          <Image
            src={fourthImage}
            width={100}
            height={100}
            alt="Not Found"
            onClick={() => {
              setFrameImage(fourthImage);
            }}
            className="hover:cursor-pointer"
          />
          <Image
            src={fifthImage}
            width={100}
            height={100}
            alt="Not Found"
            onClick={() => {
              setFrameImage(fifthImage);
            }}
            className="hover:cursor-pointer"
          />
        </div>
      </div>
      <div className="card bg-base-100 w-full shadow-xl sm:hidden visible">
        <figure>
          <Image src={frameImage} alt="Shoes" width={100} height={100} />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <div className="card-actions justify-end mt-5">
            {!gotoCart ? (
              <Button
                className="bg-orange-600 w-[400px] item-center hover:bg-orange-500"
                onClick={handleCart}
              >
                Add To Cart
              </Button>
            ) : (
              <Button
                className="bg-yellow-600 w-[400px] item-center hover:bg-yellow-500"
                onClick={() => {
                  router.push("/cart");
                }}
              >
                GO TO CART
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-3 w-full justify-center items-center sm:hidden visible">
        <div className="flex gap-3">
          <Image
            src={mainImage}
            width={50}
            height={50}
            alt="Not Found"
            onClick={() => {
              setFrameImage(mainImage);
            }}
            className="hover:cursor-pointer h-20 w-20 rounded-full"
          />
          <Image
            src={firstImage}
            width={100}
            height={100}
            alt="Not Found"
            onClick={() => {
              setFrameImage(firstImage);
            }}
            className="hover:cursor-pointer h-20 w-20 rounded-full"
          />
          <Image
            src={secondImage}
            width={100}
            height={100}
            alt="Not Found"
            onClick={() => {
              setFrameImage(secondImage);
            }}
            className="hover:cursor-pointer h-20 w-20 rounded-full"
          />
        </div>
        <div className="flex gap-3">
          <Image
            src={thirdImage}
            width={100}
            height={100}
            alt="Not Found"
            onClick={() => {
              setFrameImage(thirdImage);
            }}
            className="hover:cursor-pointer h-20 w-20 rounded-full"
          />
          <Image
            src={fourthImage}
            width={100}
            height={100}
            alt="Not Found"
            onClick={() => {
              setFrameImage(fourthImage);
            }}
            className="hover:cursor-pointer h-20 w-20 rounded-full"
          />
          <Image
            src={fifthImage}
            width={100}
            height={100}
            alt="Not Found"
            onClick={() => {
              setFrameImage(fifthImage);
            }}
            className="hover:cursor-pointer h-20 w-20 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

function BuyingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Buying />
    </Suspense>
  );
}

export default BuyingPage;

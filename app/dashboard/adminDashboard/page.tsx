"use client";

import React, { useState, FormEvent, useRef } from "react";
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import toast from "react-hot-toast";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

interface ImageUploadResponse {
  fileId: string;
  name: string;
  url: string;
  height?: number;
  width?: number;
  size?: number;
  filePath?: string;
}

interface AuthResponse {
  signature: string;
  expire: number;
  token: string;
}

interface Error {
  message: string;
}

function Admin() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [firstImage, setFirstImage] = useState<string | null>(null);
  const [secondImage, setSecondImage] = useState<string | null>(null);
  const [thirdImage, setThirdImage] = useState<string | null>(null);
  const [fourthImage, setFourthImage] = useState<string | null>(null);
  const [fifthImage, setFifthImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const mainImageRef = useRef<HTMLInputElement>(null);
  const firstImageRef = useRef<HTMLInputElement>(null);
  const secondImageRef = useRef<HTMLInputElement>(null);
  const thirdImageRef = useRef<HTMLInputElement>(null);
  const fourthImageRef = useRef<HTMLInputElement>(null);
  const fifthImageRef = useRef<HTMLInputElement>(null);

  const authenticator = async (): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/auth");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data: AuthResponse = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error}`);
    }
  };

  const onError = (err: Error) => {
    setUploading(false);
    console.log("Error", err);
  };

  const onMainImageSuccess = (res: ImageUploadResponse) => {
    setMainImage(res.url);
  };

  const onFirstImageSuccess = (res: ImageUploadResponse) => {
    setFirstImage(res.url);
  };

  const onSecondImageSuccess = (res: ImageUploadResponse) => {
    setSecondImage(res.url);
  };

  const onThirdImageSuccess = (res: ImageUploadResponse) => {
    setThirdImage(res.url);
  };

  const onFourthImageSuccess = (res: ImageUploadResponse) => {
    setFourthImage(res.url);
  };

  const onFifthImageSuccess = (res: ImageUploadResponse) => {
    setFifthImage(res.url);
  };

  const handleSubmit = async (e: FormEvent) => {
    setUploading(true);
    e.preventDefault();
    try {
      const upload = async () => {
        await axios.post("/api/upload", {
          mainImage,
          firstImage,
          secondImage,
          thirdImage,
          fourthImage,
          fifthImage,
          title,
          description,
          category,
          price,
        });
        setUploading(false);
        setUploaded(true);
        toast.success("Product Uploaded Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      };

      upload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ImageKitProvider
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <div className="flex flex-col items-center pb-16">
        <h1 className="sm:text-3xl text-2xl font-bold mt-10">
          Admin Dashboard
        </h1>
        <div className="bg-slate-700 flex flex-col gap-5 items-center sm:w-[600px] w-[330px] py-10 mt-10 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-5 sm:w-[500px]">
            <IKUpload
              ref={mainImageRef}
              style={{ display: "none" }}
              onError={onError}
              onSuccess={onMainImageSuccess}
              folder="ecommerce"
            />
            <Button
              className="sm:w-[500px] w-[300px] sm:text-lg text-sm bg-orange-600 font-bold"
              onClick={() => mainImageRef.current?.click()}
            >
              Upload Main Image
            </Button>

            <IKUpload
              ref={firstImageRef}
              style={{ display: "none" }}
              onError={onError}
              onSuccess={onFirstImageSuccess}
              folder="ecommerce"
            />
            <Button
              className="sm:w-[500px] w-[300px] sm:text-lg text-sm bg-orange-600 font-bold"
              onClick={() => firstImageRef.current?.click()}
            >
              Upload First Image
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 sm:w-[500px]">
            <IKUpload
              ref={secondImageRef}
              style={{ display: "none" }}
              onError={onError}
              onSuccess={onSecondImageSuccess}
              folder="ecommerce"
            />
            <Button
              className="sm:w-[500px] w-[300px] sm:text-lg text-sm bg-orange-600 font-bold"
              onClick={() => secondImageRef.current?.click()}
            >
              Upload Second Image
            </Button>

            <IKUpload
              ref={thirdImageRef}
              style={{ display: "none" }}
              onError={onError}
              onSuccess={onThirdImageSuccess}
              folder="ecommerce"
            />
            <Button
              className="sm:w-[500px] w-[300px] sm:text-lg text-sm bg-orange-600 font-bold"
              onClick={() => thirdImageRef.current?.click()}
            >
              Upload Third Image
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 sm:w-[500px]">
            <IKUpload
              ref={fourthImageRef}
              style={{ display: "none" }}
              onError={onError}
              onSuccess={onFourthImageSuccess}
              folder="ecommerce"
            />
            <Button
              className="sm:w-[500px] w-[300px] sm:text-lg text-sm bg-orange-600 font-bold"
              onClick={() => fourthImageRef.current?.click()}
            >
              Upload Fourth Image
            </Button>

            <IKUpload
              ref={fifthImageRef}
              style={{ display: "none" }}
              onError={onError}
              onSuccess={onFifthImageSuccess}
              folder="ecommerce"
            />
            <Button
              className="sm:w-[500px] w-[300px] sm:text-lg text-sm bg-orange-600 font-bold"
              onClick={() => fifthImageRef.current?.click()}
            >
              Upload Fifth Image
            </Button>
          </div>
          <form
            onSubmit={handleSubmit}
            className="text-black sm:w-[500px] w-[300px] flex flex-col gap-5"
          >
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="sm:text-lg text-sm"
            />
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="sm:text-lg text-sm"
            />
            <Input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="sm:text-lg text-sm"
            />
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="sm:w-[500px] w-[300px]">
                    {!category ? "Category" : category}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="">
                    <div className="flex flex-col cursor-pointer sm:w-[500px] w-[300px]">
                      <NavigationMenuLink
                        className="hover:bg-slate-200"
                        onClick={() => setCategory("Electronics")}
                      >
                        Electronics
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        className="hover:bg-slate-200"
                        onClick={() => setCategory("Beauty")}
                      >
                        Beauty
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        className="hover:bg-slate-200"
                        onClick={() => setCategory("Fashion")}
                      >
                        Fashion
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        className="hover:bg-slate-200"
                        onClick={() => setCategory("Sports")}
                      >
                        Sports
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        className="hover:bg-slate-200"
                        onClick={() => setCategory("Toys")}
                      >
                        Toys
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Button type="submit">Submit</Button>
          </form>
          {uploading && (
            <div className="w-[500px] bg-slate-300 overflow-hidden rounded-2xl">
              <div className="bg-slate-300 w-[500px] animate-scrollText flex gap-5">
                <div className="w-52 h-5 bg-green-400 rounded-2xl"></div>
              </div>
            </div>
          )}
          {uploaded && (
            <div className="bg-green-500 w-[500px] h-5 rounded-2xl"></div>
          )}
          {}
        </div>
      </div>
    </ImageKitProvider>
  );
}

export default Admin;

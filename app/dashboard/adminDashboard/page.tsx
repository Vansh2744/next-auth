"use client";

import React, { useState, FormEvent } from "react";
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
  const [frontSide, setFrontSide] = useState<string | null>(null);
  const [leftSide, setLeftSide] = useState<string | null>(null);
  const [rightSide, setRightSide] = useState<string | null>(null);
  const [backSide, setBackSide] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

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

  const onImageSuccess = (res: ImageUploadResponse) => {
    setFrontSide(res.url);
  };

  const onLeftImageSuccess = (res: ImageUploadResponse) => {
    setLeftSide(res.url);
  };

  const onRightImageSuccess = (res: ImageUploadResponse) => {
    setRightSide(res.url);
  };

  const onBackImageSuccess = (res: ImageUploadResponse) => {
    setBackSide(res.url);
  };

  const handleSubmit = async (e: FormEvent) => {
    setUploading(true);
    e.preventDefault();
    try {
      const upload = async () => {
        await axios.post("/api/upload", {
          frontSide,
          leftSide,
          rightSide,
          backSide,
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
      <div className="flex flex-col items-center">
        <div className="bg-slate-700 flex flex-col gap-5 items-center sm:w-[600px] w-[330px] py-10 mt-10">
          <div className="flex flex-col gap-1 sm:w-[500px] w-[300px]">
            <span className="sm:text-xl text-lg font-bold">
              FrontSide Image :
            </span>
            <IKUpload
              fileName="productimage.jpg"
              onError={onError}
              onSuccess={onImageSuccess}
            />
          </div>
          <div className="flex flex-col gap-1 sm:w-[500px] w-[300px]">
            <span className="sm:text-xl text-lg font-bold">
              LeftSide Image :
            </span>
            <IKUpload
              fileName="productimage.jpg"
              onError={onError}
              onSuccess={onLeftImageSuccess}
            />
          </div>
          <div className="flex flex-col gap-1 sm:w-[500px] w-[300px]">
            <span className="sm:text-xl text-lg font-bold">
              RightSide Image :
            </span>
            <IKUpload
              fileName="productimage.jpg"
              onError={onError}
              onSuccess={onRightImageSuccess}
            />
          </div>
          <div className="flex flex-col gap-1 sm:w-[500px] w-[300px]">
            <span className="sm:text-xl text-lg font-bold">
              BackSide Image :
            </span>
            <IKUpload
              fileName="productimage.jpg"
              onError={onError}
              onSuccess={onBackImageSuccess}
            />
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
            />
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <Input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
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

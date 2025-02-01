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
  const [frontSide, setFrontSide] = useState("");
  const [leftSide, setLeftSide] = useState("");
  const [rightSide, setRightSide] = useState("");
  const [backSide, setBackSide] = useState("");
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
    console.log("Success", res);
  };

  const onLeftImageSuccess = (res: any) => {
    setLeftSide(res.url);
    console.log("Success", res);
  };

  const onRightImageSuccess = (res: any) => {
    setRightSide(res.url);
    console.log("Success", res);
  };

  const onBackImageSuccess = (res: any) => {
    setBackSide(res.url);
    console.log("Success", res);
  };

  const onUploadingStart = () => {
    setUploading(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const upload = async () => {
        const res = await axios.post("/api/upload", {
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
        console.log(res);
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
      <div>
        <IKUpload
          fileName="productimage.jpg"
          onError={onError}
          onSuccess={onImageSuccess}
          onUploadStart={onUploadingStart}
        />
        <IKUpload
          fileName="productimage.jpg"
          onError={onError}
          onSuccess={onLeftImageSuccess}
          onUploadStart={onUploadingStart}
        />
        <IKUpload
          fileName="productimage.jpg"
          onError={onError}
          onSuccess={onRightImageSuccess}
          onUploadStart={onUploadingStart}
        />
        <IKUpload
          fileName="productimage.jpg"
          onError={onError}
          onSuccess={onBackImageSuccess}
          onUploadStart={onUploadingStart}
        />
        <form onSubmit={handleSubmit} className="text-black">
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
          <NavigationMenu className="float-right mr-2">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  {!category ? "Category" : category}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col cursor-pointer">
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
          <h1 className="bg-gray-500 w-[400px] mt-10 px-6 py-2 font-bold text-lg">
            Uploading....
          </h1>
        )}
        {uploaded && (
          <h1 className="bg-green-500 w-[400px] mt-10 px-6 py-2 font-bold text-lg">
            Image Uploaded
          </h1>
        )}
        {}
      </div>
    </ImageKitProvider>
  );
}

export default Admin;

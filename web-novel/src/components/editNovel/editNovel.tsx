//editnovel.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";

interface NovelData {
  name: string;
  detail: string;
  type: string;
  status: string;
  tags: string[];
  image_novel?: string;
  rate?: string; // Add rate field
  category?: string; // Add category field
}

const INITIAL_STATE: NovelData = {
  name: "",
  detail: "",
  type: "novel",
  status: "ongoing",
  tags: [],
  rate: "", // Add default rate
  category: "", // Add default category
};

// Add these interfaces for Rate and Category data
interface Rate {
  _id: string;
  name: string;
}

interface Category {
  id: string | number;
  _id: string;
  name: string;
  nameThai: string;
}

export default function EditNovel({ id }: { id: string }): JSX.Element {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [novelData, setNovelData] = useState<NovelData>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [rates, setRates] = useState<Rate[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Add this useEffect to fetch rates and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratesResponse, categoriesResponse] = await Promise.all([
          fetch("/api/rates"),
          fetch("/api/categories"),
        ]);

        const ratesData = await ratesResponse.json();
        const categoriesData = await categoriesResponse.json();
        console.log(categoriesData);
        setRates(ratesData.rates || []);
        setCategories(categoriesData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load rates and categories");
      }
    };

    fetchData();
  }, []);

  console.log(categories);

  // For EditNovel, update the useEffect that fetches novel data:
  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const response = await fetch(`/api/novels/${id}`);
        const data = await response.json();

        if (data.novel) {
          setNovelData({
            name: data.novel.name || "",
            detail: data.novel.detail || "",
            type: data.novel.type || "novel",
            status: data.novel.status || "ongoing",
            tags: Array.isArray(data.novel.tags) ? data.novel.tags : [],
            image_novel: data.novel.image_novel,
            rate: data.novel.rate?._id || "", // Add rate
            category: data.novel.category?._id || "", // Add category
          });
        }
      } catch (error) {
        console.error("Error fetching novel:", error);
        setError("Failed to load novel data");
      }
    };

    if (id) {
      fetchNovel();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/novels/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novelData),
      });

      const data = await response.json();

      // console.log(data);

      if (response.ok) {
        router.push(`/book/${id}`);
      } else {
        throw new Error(data.message || "Failed to update novel");
      }
    } catch (error) {
      console.error("Error updating novel:", error);
      setError("Failed to update novel. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !novelData.tags.includes(tagInput.trim())) {
      setNovelData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNovelData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSelectChange =
    (field: keyof NovelData) => (e: { target: { value: string } }) => {
      setNovelData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") {
    router.push("/login");
  }

  // console.log(novelData);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold mb-6">Edit Novel</h1>

              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Novel Name"
                  value={novelData.name}
                  onChange={(e) =>
                    setNovelData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full"
                />

                <Textarea
                  label="Description"
                  value={novelData.detail}
                  onChange={(e) =>
                    setNovelData((prev) => ({
                      ...prev,
                      detail: e.target.value,
                    }))
                  }
                  required
                  className="w-full"
                />

                <Select
                  label="Type"
                  selectedKeys={[novelData.type]}
                  onChange={(e) => handleSelectChange("type")(e)}
                  className="w-full"
                >
                  <SelectItem key="novel" value="novel">
                    Novel
                  </SelectItem>
                  <SelectItem key="webtoon" value="webtoon">
                    Webtoon
                  </SelectItem>
                </Select>

                <Select
                  label="Status"
                  selectedKeys={[novelData.status]}
                  onChange={(e) => handleSelectChange("status")(e)}
                  className="w-full"
                >
                  <SelectItem key="ongoing" value="ongoing">
                    Ongoing
                  </SelectItem>
                  <SelectItem key="completed" value="completed">
                    Completed
                  </SelectItem>
                  <SelectItem key="dropped" value="dropped">
                    Dropped
                  </SelectItem>
                </Select>
                <Select
                  label="Rate"
                  selectedKeys={novelData.rate ? [novelData.rate] : []}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setNovelData((prev) => ({
                      ...prev,
                      rate: selectedValue,
                    }));
                  }}
                  className="w-full"
                >
                  {rates.map((rate) => (
                    <SelectItem key={rate._id} value={rate._id}>
                      {rate.name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Category"
                  selectedKeys={novelData.category ? [novelData.category] : []}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setNovelData((prev) => ({
                      ...prev,
                      category: selectedValue,
                    }));
                  }}
                  className="w-full"
                >
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nameThai
                        ? `${category.name} (${category.nameThai})`
                        : category.name}
                    </SelectItem>
                  ))}
                </Select>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      label="Add Tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="self-end"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {novelData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" isLoading={isLoading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

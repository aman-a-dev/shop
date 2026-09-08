"use server";

import { put, del } from "@vercel/blob";

export async function uploadImage(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "Image must be less than 5MB" };
    }

    const blob = await put(`products/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("uploadImage error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

export async function deleteImage(url: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await del(url);
    return { success: true };
  } catch (error) {
    console.error("deleteImage error:", error);
    return { success: false, error: "Failed to delete image" };
  }
}

export async function deleteImages(urls: string[]): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await Promise.all(urls.map((url) => del(url)));
    return { success: true };
  } catch (error) {
    console.error("deleteImages error:", error);
    return { success: false, error: "Failed to delete images" };
  }
}

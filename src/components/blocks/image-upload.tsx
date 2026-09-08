"use client";

import { useState, useRef } from "react";
import { uploadImage, deleteImage } from "@/lib/blob";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (value.length >= maxImages) {
      toast.add({
        type: "error",
        title: "Error",
        description: `Maximum ${maxImages} images allowed`,
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);
    if (result.success && result.url) {
      onChange([...value, result.url]);
      toast.add({
        type: "success",
        title: "Success",
        description: "Image uploaded successfully",
      });
    } else {
      toast.add({
        type: "error",
        title: "Error",
        description: result.error || "Failed to upload image",
      });
    }
    setUploading(false);
  };

  const handleRemoveImage = async (url: string) => {
    // Delete from blob storage
    const result = await deleteImage(url);
    if (result.success) {
      onChange(value.filter((u) => u !== url));
    } else {
      toast.add({
        type: "error",
        title: "Error",
        description: "Failed to delete image",
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`Image ${index + 1}`}
              className="size-20 rounded-md border object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 size-6 rounded-full shadow-sm"
              onClick={() => handleRemoveImage(url)}
            >
              <X className="size-3" />
            </Button>
          </div>
        ))}
        {value.length < maxImages && (
          <div
            className={cn(
              "relative flex size-20 cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50",
              uploading && "opacity-50 pointer-events-none",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            ) : (
              <ImagePlus className="size-6 text-muted-foreground" />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = "";
              }}
            />
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {value.length}/{maxImages} images • Drag & drop or click to upload
      </p>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    accept?: string;
    maxSize?: number; // in MB
    folder: string;
    label: string;
    currentFile?: string;
    required?: boolean;
}

export function FileUpload({
    onUploadComplete,
    accept = "image/*,application/pdf",
    maxSize = 5,
    folder,
    label,
    currentFile,
    required = false,
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentFile || null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback(
        async (file: File) => {
            // Validate file size
            if (file.size > maxSize * 1024 * 1024) {
                toast.error(`File size must be less than ${maxSize}MB`);
                return;
            }

            // Validate file type
            const acceptedTypes = accept.split(",").map((t) => t.trim());
            const fileType = file.type;
            const isValid = acceptedTypes.some((type) => {
                if (type.endsWith("/*")) {
                    return fileType.startsWith(type.replace("/*", ""));
                }
                return fileType === type;
            });

            if (!isValid) {
                toast.error("Invalid file type");
                return;
            }

            setUploading(true);

            try {
                const url = await uploadToCloudinary(file, folder);
                setPreview(url);
                onUploadComplete(url);
                toast.success("File uploaded successfully");
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("Failed to upload file");
            } finally {
                setUploading(false);
            }
        },
        [accept, maxSize, folder, onUploadComplete]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file) {
                handleFile(file);
            }
        },
        [handleFile]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                handleFile(file);
            }
        },
        [handleFile]
    );

    const handleRemove = useCallback(() => {
        setPreview(null);
        onUploadComplete("");
    }, [onUploadComplete]);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </label>

            {preview ? (
                <div className="relative border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {preview.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-16 w-16 object-cover rounded"
                                />
                            ) : (
                                <FileIcon className="h-16 w-16 text-muted-foreground" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">File uploaded</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {preview}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleRemove}
                            disabled={uploading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                        isDragging
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/50",
                        uploading && "opacity-50 cursor-not-allowed"
                    )}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => {
                        if (!uploading) {
                            document.getElementById(`file-input-${folder}`)?.click();
                        }
                    }}
                >
                    <input
                        id={`file-input-${folder}`}
                        type="file"
                        accept={accept}
                        onChange={handleChange}
                        className="hidden"
                        disabled={uploading}
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">
                                    Drop file here or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Max size: {maxSize}MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

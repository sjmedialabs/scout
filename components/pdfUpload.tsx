"use client";

import { useState } from "react";

interface PdfUploadProps {
  maxSizeMB?: number;
  onUploadSuccess: (fileUrl: string) => void;
  placeholderText?: string;
}

export default function PdfUpload({
  maxSizeMB = 5,
  onUploadSuccess,
  placeholderText = "Upload Project Brief, wireframes, or reference materials (PDF / JPG / PNG)",
}: PdfUploadProps) {

  const [files, setFiles] = useState<
    { name: string; url?: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FILE UPLOAD ---------------- */
  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // update uploaded file url
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name ? { ...f, url: data.url } : f
        )
      );

      // send latest uploaded file to parent
      onUploadSuccess(data.url);

    } catch (err: any) {
      setError(err.message);
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const validateAndUpload = (selectedFiles: FileList | File[]) => {
    setError(null);

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    Array.from(selectedFiles).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        setError("Only PDF, JPG, PNG files allowed");
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size should not exceed ${maxSizeMB} MB`);
        return;
      }

      setFiles((prev) => [...prev, { name: file.name }]);
      uploadFile(file);
    });
  };

  /* ---------------- INPUT CHANGE ---------------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setLoading(true);
    validateAndUpload(e.target.files);
    setLoading(false);
  };

  /* ---------------- DRAG EVENTS ---------------- */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setLoading(true);
    validateAndUpload(e.dataTransfer.files);
    setLoading(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /* ---------------- REMOVE FILE ---------------- */
  const handleRemove = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
    onUploadSuccess("");
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border border-[#D0D5DD] rounded-lg p-6 text-center space-y-4 transition hover:bg-gray-50"
    >
      <p className="text-sm text-gray-500">
        {placeholderText}
      </p>

      {/* Hidden input */}
      <input
        type="file"
        multiple
        accept="application/pdf,image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
        id="pdf-upload"
      />

      {/* Button */}
      <label
        htmlFor="pdf-upload"
        className="inline-block px-4 py-2 bg-[#D1E9FC] text-[#000] text-[12px] rounded-xl border-[#D0D5DD] font-semibold cursor-pointer"
      >
        Choose Files
      </label>

      {/* Uploaded files list */}
      {/* {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.name}>
              <p className="text-sm text-gray-700">{file.name}</p>

              <button
                type="button"
                onClick={() => handleRemove(file.name)}
                className="text-sm text-red-600 underline cursor-pointer"
              >
                Remove File
              </button>

              {file.url && (
                <p className="text-sm text-green-600">
                  Uploaded Successfully:{" "}
                  <a href={file.url} target="_blank" className="underline">
                    View File
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )} */}

      {files.length > 0 && (
  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3">
    {files.map((file) => (
      <div
        key={file.name}
        className="border border-[#D0D5DD] rounded-lg p-3 text-left bg-white shadow-sm"
      >
        {/* File Name */}
        <p className="text-sm font-medium text-gray-700 truncate">
          {file.name}
        </p>

        {/* Success */}
        {file.url && (
          <a
            href={file.url}
            target="_blank"
            className="text-xs text-green-600 underline"
          >
            View File
          </a>
        )}

        {/* Remove */}
        <button
          type="button"
          onClick={() => handleRemove(file.name)}
          className="block text-xs text-red-600 underline mt-1 cursor-pointer"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
)}

      {loading && (
        <p className="text-sm text-blue-600 animate-pulse">
          Uploading...
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
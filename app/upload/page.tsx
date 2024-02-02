"use client";
// import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadFile() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "text/html": [".html", ".htm"],
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      setSelectedFile(URL.createObjectURL(acceptedFiles[0]));
      setFile(acceptedFiles[0]);
      uploadFile(acceptedFiles[0]);
    },
  });

  const uploadFile = async (acceptedFile: File) => {
    if (!acceptedFile) return;
    // const formData = new FormData();
    // formData.append("file", acceptedFile);
    // formData.append("x-file-name", acceptedFile.name);
    // setLoading(true);
    // try {
    //   const response = await fetch("/api/upload", {
    //     method: "POST",
    //     body: formData,
    //     headers: {
    //       "x-file-name": acceptedFile.name,
    //     },
    //   });
    //   if (!response.ok) throw new Error("Upload failed");
    //   const data = await response.json();
    //   console.log(data, "****");
    //   // setFileId(data.uuid);
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   setLoading(false);
    // }

    try {
      const data = new FormData();
      data.set("file", acceptedFile);

      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    return () => {
      setSelectedFile(null);
      setFile(null);
      setLoading(false);
      setFileId(null);
    };
  }, []);

  return (
    <main className="">
      <div className="flex flex-col justify-center  pt-4 px-60">
        <h1 className="text-2xl font-bold">Upload Files</h1>
        <div className="px-2">
          <div
            {...getRootProps()}
            className="mt-2 mb-4 border border-neutral-200 p-12 "
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag & drop files here, or click to select files</p>
              )}
            </div>
          </div>

          {selectedFile && <h2 className="text-2xl font-bold mb-4">Preview</h2>}

          {selectedFile && (
            <div className="">
              <div className="flex justify-between">
                <div className="p-4">
                  {file && file.type.startsWith("image/") && (
                    <figure className=" mb-4 w-fit text-center">
                      <Image
                        src={selectedFile}
                        alt="Selected"
                        width={400}
                        height={300}
                      />
                      <figcaption>{file.name}</figcaption>
                    </figure>
                  )}

                  {file && file.type.startsWith("application/") && (
                    <figure className="border-2 border-red-200 mb-4 w-fit text-center">
                      <p>pdf</p>
                      <figcaption className="text-center text-gray-500 font-medium">
                        {file.name}
                      </figcaption>
                    </figure>
                  )}
                </div>

                {/* this div is file status, name, title, size, length */}
                <div className=" p-4 pl-8 w-full">
                  <div className="mb-4">
                    {loading && !fileId && (
                      <button className=" rounded-md bg-gray-300 p-1 px-2 text-xs hover:cursor-pointer">
                        Uploading...
                      </button>
                    )}

                    {fileId && (
                      <button className=" rounded-md bg-gray-300 p-1 px-2 text-xs hover:cursor-pointer">
                        Saved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

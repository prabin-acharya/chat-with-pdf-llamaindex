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
  const [query, setQuery] = useState<string>();
  const [answer, setAnswer] = useState<string>("");
  const [previousQuery, setPreviousQuery] = useState<string>();
  const [serverFileId, setServerFileId] = useState<string>();

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

      const response = await res.json();
      console.log(response);
      setServerFileId(response.file);

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

  const handleAsk = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/llama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, fileId: serverFileId }),
      });
      const data = await response.json();
      setAnswer(data.response);

      setPreviousQuery(query);
      setQuery("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // <main className="flex min-h-screen flex-col items-center justify-between p-24">

  return (
    <main className="flex py-4 mx-auto border-2 flex-col text-white">
      <div className="flex flex-col justify-center  pt-4 px-60">
        <h1 className="text-2xl font-bold">Learning RAG With LlamaIndex</h1>
        {/* <h1 className="text-2xl font-bold">Upload Files</h1> */}
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
                <p>Drag & drop a here, or click to select file (pdf) </p>
              )}
            </div>
          </div>

          {/* {selectedFile && <h2 className="text-2xl font-bold mb-4">Preview</h2>} */}

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

          <div className=" p-4 pl-8 w-full border-2">
            <input
              type="text"
              placeholder="Ask a question.."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-2/3 outline-none border-gray-700 focus:border text-xl p-2"
            />
            <button
              onClick={handleAsk}
              className="p-3 bg-sky-700 m-2 rounded-md text-white"
            >
              Send
            </button>

            {answer && (
              <div>
                <p>Query: {previousQuery}</p>
                <p>Answer: {answer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";
// import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadFile() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [previousQuery, setPreviousQuery] = useState<string>();
  const [serverFileId, setServerFileId] = useState<string>();
  const [isLoading, setIsLoading] = useState<Boolean>(false);

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
    if (!file) return;

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/llama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, fileId: serverFileId }),
      });

      const data = await response.json();
      setAnswer(data.response);
      setIsLoading(false);

      setPreviousQuery(query);
      setQuery("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatFileName = (fileName: string, maxLength = 36) => {
    if (fileName.length <= maxLength) {
      return fileName;
    }

    const truncatedName = fileName.substring(0, maxLength - 3) + "...";
    const fileExtension = fileName.split(".").pop();

    return truncatedName + "." + fileExtension;
  };
  return (
    <main className="flex min-h-screen py-4 flex-col items-center text-white">
      <div className="flex flex-col justify-center pt-4 w-1/2 ">
        <h1 className="text-3xl font-bol text-amber-700 font-bold py-3">
          RAG With LlamaIndex
        </h1>
        <div className="px-2">
          <h2 className="font-semibold ">Upload a file</h2>
          <div
            {...getRootProps()}
            className="mt-2 mb-4  p-8 bg-slate-700 rounded-md"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag & drop a file here, or click to select file (pdf) </p>
              )}
            </div>
          </div>

          {/* {selectedFile && <h2 className="text-2xl font-bold mb-4">Preview</h2>} */}

          {selectedFile && (
            <>
              <div className="flex">
                {file && file.type.startsWith("application/") && (
                  <div className="w-full p-2 rounded-md mb-4">
                    <span className="text-centertext-gray-500 font-medium p-3 pr-16 rounded bg-slate-700 border-amber-700 border-2">
                      {formatFileName(file.name)}
                    </span>
                  </div>
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
            </>
          )}

          <div className="py-8 w-full">
            <h2>Enter a query:</h2>
            <div className="">
              <input
                type="text"
                placeholder="Ask a question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-2/3 outline-none border border-slate-500  focus:border-gray-400 text-base p-2 rounded-md bg-slate-700"
              />
              <button
                onClick={handleAsk}
                className="p-2 px-6 m-4 h-fit bg-slate-800 border border-slate-500 hover:border-amber-700 rounded-md text-white"
              >
                Send
              </button>
            </div>

            {isLoading && (
              <div className="flex text-white items-center justify-center p-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <style>{`.spinner_HIK5{transform-origin:center;animation:spinner_XVY9 1s cubic-bezier(0.36,.6,.31,1) infinite;} @keyframes spinner_XVY9{50%{transform:rotate(180deg)}100%{transform:rotate(360deg)}}`}</style>
                  <circle cx="12" cy="12" r="3" fill="white" />
                  <g className="spinner_HIK5">
                    <circle cx="4" cy="12" r="3" fill="white" />
                    <circle cx="20" cy="12" r="3" fill="white" />
                  </g>
                </svg>
              </div>
            )}

            {answer && (
              <div className="border p-4 bg-slate-700 rounded-lg mt-2">
                <div className="py-2">
                  <span className="font-semibold">Your Query:</span>{" "}
                  <p className="inline">{previousQuery} </p>
                </div>
                <div>
                  <span className="font-semibold">Answer: </span>{" "}
                  <p className="inline">{answer}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

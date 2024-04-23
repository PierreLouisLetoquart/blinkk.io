"use client";

import * as React from "react";

export function Search() {
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const [results, setResults] = React.useState<any>();

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setIsLoading(true);
      console.log("Searching for:", input);
      const response = await fetch("http://localhost:3000/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (results) {
    return (
      <div className="min-h-screen flex flex-col py-24 max-w-4xl mx-auto">
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="h-screen grid place-items-center">
      <div
        className={
          "w-full max-w-[569px] rounded-lg pl-2 pr-1 py-1 border-2 border-double border-zinc-300"
        }
      >
        <form
          onSubmit={handleSubmit}
          className="w-full flex items-center gap-3"
        >
          <input
            value={input}
            onChange={handleInputChange}
            type="text"
            placeholder="What are we looking for today?"
            className="w-full bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none text-sm px-1"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-zinc-800 w-[110px] text-zinc-100 rounded-md text-sm px-4 py-2 hover:bg-zinc-800/[0.9] disabled:bg-zinc-800/[0.85]"
          >
            {isLoading ? "Loading" : "Search"}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useDebounce } from "use-debounce";

import { Input } from "@/components/ui/input";

interface searchProps {
  search?: string;
  repoId?: string;
}
function SearchCommits({ search, repoId }: searchProps) {
  const router = useRouter();
  const initialRender = useRef(true);

  const [text, setText] = useState(search);
  const [query] = useDebounce(text, 750);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (!query) {
      // If there is no search query, check if repoId is available
      if (repoId) {
        router.push(`/${repoId}`);
      }
    } else {
      // If there is a search query, include it in the route
      router.push(`${repoId}/?search=${query}`);
    }
  }, [query, router, repoId]);

  return (
    <div>
      <Input
        value={text}
        placeholder="Search commits..."
        type="text"
        className="w-full"
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}

export default SearchCommits;

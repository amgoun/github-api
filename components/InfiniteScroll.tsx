"use client";

import { useEffect, useState } from "react";

import { ClipLoader } from "react-spinners";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Commit } from "@/lib/types";
import { fetchCommits } from "@/lib/getData";

interface InfiniteScrollCommitsProps {
  repoId?: string;
  initialPage: number;
  initialCommits: Commit[];
  initialSearchTerm?: string;
}
const InfiniteScrollCommits: React.FC<InfiniteScrollCommitsProps> = ({
  repoId,
  initialPage,
  initialSearchTerm,
}) => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState<boolean>(false);

  const [searchTerm] = useState<string | undefined>(initialSearchTerm);

  useEffect(() => {
    const loadMoreCommits = async () => {
      if (repoId) {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 200)); // delay to not hit rate-limit
        const nextPageCommits = await fetchCommits(
          repoId,
          page + 1,
          searchTerm
        );
        setCommits((prevCommits) => [...prevCommits, ...nextPageCommits]);
        setPage((prevPage) => prevPage + 1);

        setLoading(false);
      }
    };

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMoreCommits();
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, repoId, searchTerm]);

  // Filter commits based on the search term
  const filteredCommits = searchTerm
    ? commits.filter((commit: Commit) =>
        commit.commit.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : commits;

  return (
    <>
      <div className="mt-16 flex flex-col max-w-[80%]">
        {commits.length > 0 ? (
          <div>
            {filteredCommits.map((commit: Commit, index: number) => (
              <Card className="flex mb-4" key={`${commit.sha}-${index}`}>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {commit.commit.author.name}
                  </CardTitle>
                  <CardDescription>{commit.commit.message}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          // Check if loading is true to avoid displaying "No commits found" prematurely
          !loading && ""
        )}
        {loading && (
          <div className="flex justify-center mt-4">
            <ClipLoader color="#4F46E5" loading={loading} size={35} />
          </div>
        )}
      </div>
    </>
  );
};

export default InfiniteScrollCommits;

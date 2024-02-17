import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { fetchCommits } from "@/lib/getData";
import { Commit } from "@/lib/types";
import SearchCommits from "@/components/searchCommits";
import InfiniteScrollCommits from "@/components/InfiniteScroll";

export type PageProps = {
  params: { id: string | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
};
async function page(props: PageProps) {
  const search =
    typeof props?.searchParams?.search === "string"
      ? props?.searchParams.search
      : undefined;

  const repoId: string | undefined = Array.isArray(props?.params.id)
    ? props?.params.id[0] // Use the first element if it's an array
    : props?.params.id;

  let filtredCommits: Commit[] = [];

  if (repoId) {
    const commits = await fetchCommits(repoId, 1);
    //filter commits based on search term
    filtredCommits = search
      ? commits.filter((commit: Commit) =>
          commit.commit.message.toLowerCase().includes(search.toLowerCase())
        )
      : commits;
  } else {
    console.error("repository id not defined ");
  }

  return (
    <div className="flex flex-col items-center">
      <div className=" flext py-6 justify-between w-[80%]">
        <div className="mr-4">
          <Link href="/">
            <Button className="capitalize " variant="outline">
              back
            </Button>
          </Link>
        </div>
        <div className=" w-full mt-4npm ">
          <SearchCommits search={search} repoId={repoId} />
        </div>
      </div>
      <div className="mt-16 flext flex-col max-w-[80%]">
        {filtredCommits.slice(0.1).map((commit: Commit) => (
          <Card className="flex mb-4" key={commit.sha}>
            <CardHeader>
              <CardTitle className="text-xl ">
                {" "}
                {commit.commit.author.name}{" "}
              </CardTitle>
              <CardDescription>{commit.commit.message}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <InfiniteScrollCommits
        repoId={repoId ? String(repoId) : undefined}
        initialPage={1}
        initialCommits={filtredCommits}
        initialSearchTerm={search}
      />
    </div>
  );
}

export default page;

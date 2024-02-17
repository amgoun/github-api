import { Commit } from "./types";
export async function getData() {
  const res = await fetch(`https://api.github.com/repositories`);
  if (!res) {
    throw new Error("Failed to Fetch Data");
  }

  return res.json();
}

export async function fetchCommits(
  repoId: string,
  page:number,
  search?:string
  ): Promise<Commit[]> {
  try {
    // fetch repo details
    const responseRepo = await fetch(
      `https://api.github.com/repositories/${repoId}`
    );
    const repoDetails = await responseRepo.json();

    // Fetch commits for the repository with optional search term
    const responseCommits = await fetch(
      `https://api.github.com/repos/${repoDetails.full_name}/commits`
    );

    const commits = responseCommits.json();

    return commits;
  } catch (error) {
    console.log("error featching commits", error);
    throw error;
  }
}

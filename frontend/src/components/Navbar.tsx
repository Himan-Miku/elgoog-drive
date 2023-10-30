"use client";
import Logout from "./Logout";
import { useSession } from "next-auth/react";
import algoliasearch from "algoliasearch/lite";
import { firestoreData } from "./NewItem";
import { AlgoliaStore } from "@/context/AlgoliaContext";

interface SearchResultData {
  readonly objectID: string;
  path: string;
  lastModified: number;
}

interface SearchResultItem extends SearchResultData, firestoreData {}

export type SearchResults = SearchResultItem[];

const Navbar = () => {
  const { queryy, searchResults, setQueryy, setSearchResults } = AlgoliaStore();
  const { data: session } = useSession();

  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!
  );
  const index = searchClient.initIndex("objects");

  async function search() {
    if (queryy.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const result = await index.search(queryy);
      setSearchResults(result.hits as SearchResults);
    } catch (error) {
      console.error("Error Searching with Algolia : ", error);
    }
  }

  console.log("Algolia SearchResults : ", searchResults);

  return (
    <div className="flex justify-between w-full items-center py-3 md:px-14 h-full">
      <div className="flex gap-3 min-w-fit md:w-[35rem] bg-custom-backg rounded-3xl px-3 py-1">
        <div className="rounded-full min-w-fit p-2 group hover:bg-custom-nav">
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            focusable="false"
            className="fill-[#e6e6e6] group-hover:fill-custom-green"
          >
            <path d="M20.49,19l-5.73-5.73C15.53,12.2,16,10.91,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.41,0,2.7-0.47,3.77-1.24L19,20.49L20.49,19z M5,9.5C5,7.01,7.01,5,9.5,5S14,7.01,14,9.5S11.99,14,9.5,14S5,11.99,5,9.5z"></path>
          </svg>
        </div>
        <input
          type="search"
          className="w-full focus:outline-none caret-white bg-custom-backg font-semibold text-[#e6e6e6] placeholder:font-semibold"
          placeholder="Search in Drive"
          value={queryy}
          onChange={(e) => setQueryy(e.target.value)}
          onKeyUp={search}
        />
      </div>
      <Logout image={session?.user?.image!} />
    </div>
  );
};

export default Navbar;

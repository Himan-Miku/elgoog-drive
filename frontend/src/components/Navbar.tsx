"use client";
import Logout from "./Logout";
import { useSession } from "next-auth/react";
import algoliasearch from "algoliasearch/lite";
import { firestoreData } from "./NewItem";
import { AlgoliaStore } from "@/context/AlgoliaContext";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { IResizeContext, resizeContext } from "@/context/ResizeContext";
import { SidebarStore } from "@/context/SidebarContext";
import SidebarItems from "./SidebarItems";
import Sidebar from "./Sidebar";

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
  const pathname = usePathname();
  const { isMobile } = resizeContext() as IResizeContext;
  const { setShowSidebar, showSidebar } = SidebarStore();

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
      let userPrefix = session?.user?.email?.split("@")[0] || "";
      const queryToSend = `${userPrefix}/${queryy}`;
      const result = await index.search(queryToSend);
      setSearchResults(result.hits as SearchResults);
    } catch (error) {
      console.error("Error Searching with Algolia : ", error);
    }
  }

  console.log("Algolia SearchResults : ", searchResults);

  return (
    <div className="flex justify-between w-full items-center py-3 md:px-14 px-2 h-full">
      <div className="flex gap-3 md:w-[35rem] w-72 bg-custom-backg rounded-3xl px-3 py-1">
        <>
          <div
            onClick={() => {
              setShowSidebar(!showSidebar);
            }}
            className="md:hidden block rounded-full min-w-fit p-2 group hover:bg-custom-nav"
          >
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              focusable="false"
              className={clsx("fill-[#e6e6e6] group-hover:fill-custom-green", {
                "fill-gray-600": pathname != "/",
              })}
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </svg>
          </div>
          {showSidebar && (
            <div className="absolute top-0 left-0  z-10">
              <Sidebar />
            </div>
          )}
        </>

        <div className="hidden md:block rounded-full min-w-fit p-2 group hover:bg-custom-nav">
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            focusable="false"
            className={clsx("fill-[#e6e6e6] group-hover:fill-custom-green", {
              "fill-gray-600": pathname != "/",
            })}
          >
            <path d="M20.49,19l-5.73-5.73C15.53,12.2,16,10.91,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.41,0,2.7-0.47,3.77-1.24L19,20.49L20.49,19z M5,9.5C5,7.01,7.01,5,9.5,5S14,7.01,14,9.5S11.99,14,9.5,14S5,11.99,5,9.5z"></path>
          </svg>
        </div>

        <input
          type="search"
          className={clsx(
            "w-full focus:outline-none caret-white bg-custom-backg font-semibold text-[#e6e6e6] md:placeholder:text-base placeholder:text-sm placeholder:font-semibold",
            {
              "placeholder:text-gray-600 placeholder:font-light":
                pathname != "/",
            }
          )}
          placeholder={
            pathname != "/"
              ? "Search in Drive from My Drive Tab"
              : "Search in Drive"
          }
          value={queryy}
          onChange={(e) => setQueryy(e.target.value)}
          onKeyUp={search}
          disabled={pathname != "/"}
        />
      </div>
      <Logout image={session?.user?.image!} />
    </div>
  );
};

export default Navbar;

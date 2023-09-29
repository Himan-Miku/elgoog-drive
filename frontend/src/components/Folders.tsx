import FoldersContent from "./FoldersContent";

export type foldersData = {
  folders_vec: Array<string>;
};

const fetchFolders = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/fetchFolders");
    if (res.ok) {
      const data = (await res.json()) as foldersData;
      console.log(data);
      return data;
    } else {
      console.error("Fetch failed with status:", res.status);
      throw new Error("Fetch failed");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export default async function Folders() {
  const data = await fetchFolders();

  console.log("data from fn : ", data);

  return (
    <>
      <div className="px-11 py-2 font-semibold text-[#e6e6e6]">Folders</div>
      <div className="flex gap-6 px-8 py-3">
        <FoldersContent data={data} />
      </div>
    </>
  );
}

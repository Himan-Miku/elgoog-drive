type foldersData = {
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

export default async function FoldersContent() {
  const data = await fetchFolders();

  console.log("data from fn : ", data);

  return (
    <div>
      {data.folders_vec?.map((folName, index) => {
        return <h1 key={index}>{folName}</h1>;
      })}
    </div>
  );
}

import { getServerSession } from "next-auth";
import ObjectCards from "./ObjectCards";

const list_objects = async (name: string) => {
  const res = await fetch(`http://localhost:8000/api/getObjects?name=${name}`, {
    cache: "no-store",
  });
  const data = (await res.json()) as Array<string>;
  return data;
};

const MyDriveContent = async () => {
  const session = await getServerSession();
  let username = session?.user?.name?.split(" ")[0];
  const data = await list_objects(username!);

  console.log("Data from MyDriveContent : ", data);

  return (
    <div className="px-8 py-2 grid grid-cols-5 gap-4">
      <ObjectCards data={data} />
    </div>
  );
};

export default MyDriveContent;

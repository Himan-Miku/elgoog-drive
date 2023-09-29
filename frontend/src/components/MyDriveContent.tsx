const list_objects = async () => {
  const res = await fetch("http://localhost:8000/api/getObjects", {
    cache: "no-store",
  });
  const data = (await res.json()) as Array<string>;
  return data;
};

const MyDriveContent = async () => {
  const data = await list_objects();

  return (
    <div className="px-8 py-2 grid grid-cols-4 gap-4">
      {data?.map((obj, index) => {
        return (
          <div key={index} className="w-full bg-custom-nav p-3 rounded-xl">
            {obj}
          </div>
        );
      })}
    </div>
  );
};

export default MyDriveContent;

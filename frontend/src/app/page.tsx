import MyDrive from "@/components/MyDrive";

export default function Home() {
  return (
    <main>
      <div className="My-Drive">
        <MyDrive />
      </div>
      <div className="My-Drive-content"></div>
      <div className="Folders"></div>
      <div className="Folders-content"></div>
      <div className="Files"></div>
      <div className="Files-content"></div>
    </main>
  );
}

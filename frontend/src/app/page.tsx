import Folders from "@/components/Folders";
import MyDrive from "@/components/MyDrive";
import MyDriveContent from "@/components/MyDriveContent";

export default function Home() {
  return (
    <main>
      <div className="My-Drive">
        <MyDrive />
      </div>
      <div className="My-Drive-content">
        <MyDriveContent />
      </div>
      <div className="Folders-content">
        <Folders />
      </div>
    </main>
  );
}

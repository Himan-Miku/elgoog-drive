import Folders from "@/components/Folders";
import FoldersContent from "@/components/FoldersContent";
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
      <div className="Folders">
        <Folders />
      </div>
      <div className="Folders-content">
        <FoldersContent />
      </div>
      <div className="Files"></div>
      <div className="Files-content"></div>
    </main>
  );
}

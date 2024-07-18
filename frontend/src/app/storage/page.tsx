import Storage from "@/components/Storage";
import StorageList from "@/components/StorageList";

export default function StoragePage() {
  return (
    <div className="md:px-10 px-4 md:py-7 py-5 flex flex-col md:gap-6 gap-3">
      <div>
        <Storage />
      </div>
      <div>
        <StorageList />
      </div>
    </div>
  );
}

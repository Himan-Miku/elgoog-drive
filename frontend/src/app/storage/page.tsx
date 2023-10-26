import Storage from "@/components/Storage";
import StorageList from "@/components/StorageList";

export default function StoragePage() {
  return (
    <div className="px-10 py-7 flex flex-col gap-6">
      <div>
        <Storage />
      </div>
      <div>
        <StorageList />
      </div>
    </div>
  );
}

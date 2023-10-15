interface FolderPageProps {
  params: {
    folderName: string;
  };
}

const FolderPage = ({ params: { folderName } }: FolderPageProps) => {
  return <div>FolderPage : {folderName}</div>;
};

export default FolderPage;

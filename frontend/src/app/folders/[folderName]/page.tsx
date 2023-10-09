import { FC } from "react";

interface pageProps {
  params: {
    folderName: string;
  };
}

const FolderSlugPage: FC<pageProps> = ({ params: { folderName } }) => {
  return <div>FolderSlugPage : {folderName}</div>;
};

export default FolderSlugPage;

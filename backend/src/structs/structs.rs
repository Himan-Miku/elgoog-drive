use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Metadata {
    pub name: String,
    pub content_type: String,
    pub size: u32,
    pub user: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FolderName {
    #[serde(rename = "folderName")]
    pub folder_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FoldersArray {
    pub folders_vec: Vec<String>,
}

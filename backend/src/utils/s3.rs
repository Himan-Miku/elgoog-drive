use aws_sdk_s3::types::{Delete, ObjectIdentifier};
use aws_sdk_s3::{presigning::PresigningConfig, Client, Error};
use std::time::Duration;

pub async fn show_folders(
    client: &Client,
    bucket: &str,
    user: &String,
) -> Result<Vec<String>, Error> {
    let mut folders: Vec<String> = Vec::new();
    let prefix = format!("{}/", user);

    let objects = client
        .list_objects_v2()
        .bucket(bucket)
        .prefix(&prefix)
        .delimiter("/")
        .send()
        .await?;
    for obj in objects.common_prefixes().unwrap_or_default() {
        let folder_name = obj.prefix().unwrap();
        folders.push(folder_name.to_owned());
    }

    println!("Folders: {:?}", folders);

    Ok(folders)
}

pub async fn list_all_objects(
    client: &Client,
    bucket: &str,
    user: &String,
) -> Result<Vec<String>, Error> {
    let mut obj_vec: Vec<String> = Vec::new();

    let objects = client.list_objects_v2().bucket(bucket).send().await?;

    for obj in objects.contents().unwrap_or_default() {
        let key = obj.key().unwrap_or_default().to_owned();
        if key.starts_with(user) {
            obj_vec.push(key);
        }
    }
    println!("obj_vec : {:?}", obj_vec);

    Ok(obj_vec)
}

pub async fn delete_objects(
    client: &Client,
    bucket: &str,
    objects: Vec<String>,
) -> Result<(), Error> {
    let mut delete_objects: Vec<ObjectIdentifier> = vec![];

    for obj in objects {
        let obj_id = ObjectIdentifier::builder().set_key(Some(obj)).build();
        delete_objects.push(obj_id);
    }

    let delete = Delete::builder().set_objects(Some(delete_objects)).build();

    client
        .delete_objects()
        .bucket(bucket)
        .delete(delete)
        .send()
        .await?;

    println!("Objects deleted.");

    Ok(())
}

pub async fn delete_object_using_key(
    client: &Client,
    bucket: &str,
    object_key: &String,
) -> Result<(), Error> {
    client
        .delete_object()
        .bucket(bucket)
        .key(object_key)
        .send()
        .await?;

    println!("Object Deleted");

    Ok(())
}

pub async fn get_object_uri(
    client: &Client,
    bucket: &str,
    object_key: &str,
    expires_in: u64,
) -> Result<String, Box<dyn std::error::Error>> {
    let expiry_time = Duration::from_secs(expires_in);

    let presigned_request = client
        .get_object()
        .bucket(bucket)
        .key(object_key)
        .presigned(PresigningConfig::expires_in(expiry_time)?)
        .await?;

    println!("Object URI : {}", presigned_request.uri());

    Ok(presigned_request.uri().to_string())
}

pub async fn put_object_uri(
    client: &Client,
    bucket: &str,
    object_key: &str,
    content_type: &str,
    expires_in: u64,
) -> Result<String, Box<dyn std::error::Error>> {
    let expiry_time = Duration::from_secs(expires_in);

    let presigned_request = client
        .put_object()
        .bucket(bucket)
        .key(object_key)
        .content_type(content_type)
        .presigned(PresigningConfig::expires_in(expiry_time)?)
        .await?;

    println!("Put Object URI : {}", presigned_request.uri());

    Ok(presigned_request.uri().to_string())
}

pub async fn create_folder_for_s3(
    client: &Client,
    bucket: &str,
    folder_name: &str,
) -> Result<(), Error> {
    let _res = client
        .put_object()
        .bucket(bucket)
        .key(folder_name)
        .send()
        .await?;

    println!("Folder created");

    Ok(())
}

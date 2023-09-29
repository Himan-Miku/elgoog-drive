use aws_sdk_s3::{presigning::PresigningConfig, Client, Error};
use std::time::Duration;

pub async fn show_folders(client: &Client, bucket: &str) -> Result<Vec<String>, Error> {
    let mut folders: Vec<String> = Vec::new();

    let objects = client
        .list_objects_v2()
        .bucket(bucket)
        .prefix("")
        .delimiter("/")
        .send()
        .await?;
    for obj in objects.common_prefixes().unwrap_or_default() {
        let folder_name = obj.prefix().unwrap();
        folders.push(folder_name.to_owned());
    }
    println!("{:?}", folders);

    Ok(folders)
}

pub async fn get_object_uri(
    client: &Client,
    bucket: &str,
    object_key: &str,
    expires_in: u64,
) -> Result<(), Box<dyn std::error::Error>> {
    let expiry_time = Duration::from_secs(expires_in);

    let presigned_request = client
        .get_object()
        .bucket(bucket)
        .key(object_key)
        .presigned(PresigningConfig::expires_in(expiry_time)?)
        .await?;

    println!("Object URI : {}", presigned_request.uri());

    Ok(())
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
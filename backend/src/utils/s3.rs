use aws_sdk_s3::{presigning::PresigningConfig, Client, Error};
use std::time::Duration;

pub async fn show_objects(client: &Client, bucket: &str) -> Result<(), Error> {
    let objects = client.list_objects_v2().bucket(bucket).send().await?;
    println!("Objects are : ");
    for obj in objects.contents().unwrap_or_default() {
        println!("{:?}", obj.key().unwrap());
    }

    Ok(())
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

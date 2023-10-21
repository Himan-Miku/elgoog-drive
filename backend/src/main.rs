use actix_cors::Cors;
use actix_web::{delete, get, post, web, App, HttpResponse, HttpServer, Responder};
use aws_sdk_s3::Client;
use uuid::Uuid;

use structs::structs::{
    DownloadObj, FolderName, FoldersArray, GetObjectsParams, Metadata, SentMetadata,
};
use utils::s3::{
    create_folder_for_s3, delete_object_using_key, get_object_uri, list_all_objects,
    put_object_uri, show_folders,
};

mod structs;
mod utils;

#[get("/api/getObjects")]
async fn get_objects(name: web::Query<GetObjectsParams>) -> impl Responder {
    let user = &name.name;
    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);
    let obj_vec = list_all_objects(&client, "elgoog-drive", user)
        .await
        .unwrap();
    HttpResponse::Ok().json(obj_vec)
}

#[post("/api/getMetadata")]
async fn get_metadata(metadata: web::Json<Metadata>) -> impl Responder {
    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);
    let Metadata {
        name,
        content_type,
        user,
        ..
    } = metadata.into_inner();
    let actual_name = name.split('.').collect::<Vec<&str>>();
    let new_uuid = Uuid::new_v4()
        .to_string()
        .chars()
        .take(6)
        .collect::<String>();
    let user_name = user.split(" ").collect::<Vec<&str>>();
    let formated_string = format!(
        "{}/{}-{}.{}",
        user_name.first().unwrap(),
        actual_name.first().unwrap(),
        new_uuid,
        actual_name.last().unwrap()
    );
    let obj_key = formated_string.as_str();
    let presigned_put_uri =
        put_object_uri(&client, "elgoog-drive", obj_key, content_type.as_str(), 60)
            .await
            .unwrap();

    let sent_metadata = SentMetadata {
        obj_key: formated_string,
        presigned_put_uri,
    };

    HttpResponse::Created().json(sent_metadata)
}

#[get("/api/fetchFolders")]
async fn fetch_folders() -> impl Responder {
    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);
    let folders = show_folders(&client, "elgoog-drive").await.unwrap();

    let folders_array = FoldersArray {
        folders_vec: folders,
    };

    HttpResponse::Ok().json(folders_array)
}

#[post("/api/downloadObject")]
async fn download_object(key_json: web::Json<DownloadObj>) -> impl Responder {
    let DownloadObj { obj_key } = key_json.into_inner();

    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);

    let presigned_get_uri = get_object_uri(&client, "elgoog-drive", obj_key.as_str(), 60)
        .await
        .unwrap();
    HttpResponse::Created().json(presigned_get_uri)
}

#[post("/api/createFolder")]
async fn create_folder(folder_name: web::Json<FolderName>) -> impl Responder {
    let FolderName { folder_name } = folder_name.into_inner();

    let folder_name = format!("{}/", folder_name);
    let folder_name_str = folder_name.as_str();

    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);

    create_folder_for_s3(&client, "elgoog-drive", folder_name_str)
        .await
        .unwrap();

    println!("folder name: {}", folder_name);

    HttpResponse::Created().json(folder_name)
}

#[delete("/api/deleteObject/{user}/{object_key}")]
async fn remove_object(path: web::Path<(String, String)>) -> impl Responder {
    let (user, object_key) = path.into_inner();

    let key = format!("{}/{}", user, object_key);

    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);

    delete_object_using_key(&client, "elgoog-drive", &key)
        .await
        .unwrap();

    HttpResponse::Ok().body("Object Deleted")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // show_folders(&client, "elgoog-drive").await.unwrap();
    // get_object_uri(&client, "elgoog-drive", "Google-Drive-logo.png", 60)
    //     .await
    //     .unwrap();
    // put_object_uri(&client, "elgoog-drive", "images/h.png", "image/png", 3600)
    //     .await
    //     .unwrap();

    HttpServer::new(|| {
        let cors = Cors::permissive();

        App::new()
            .wrap(cors)
            .service(create_folder)
            .service(fetch_folders)
            .service(get_metadata)
            .service(get_objects)
            .service(remove_object)
            .service(download_object)
    })
    .bind("localhost:8000")?
    .run()
    .await
}

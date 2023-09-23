use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use aws_sdk_s3::Client;
use serde::{Deserialize, Serialize};
use utils::s3::{create_folder_for_s3, show_folders};

mod utils;

#[derive(Debug, Serialize, Deserialize)]
struct Intro {
    name: String,
    number: i32,
}

#[derive(Debug, Serialize, Deserialize)]
struct FolderName {
    #[serde(rename = "folderName")]
    folder_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct FoldersArray {
    folders_vec: Vec<String>,
}

#[get("/api/hello")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello World")
}

#[get("/api/jsonRes")]
async fn json_res() -> impl Responder {
    let res = Intro {
        name: String::from("Himan"),
        number: 7,
    };
    HttpResponse::Ok().json(res)
}

#[post("/api/up")]
async fn up_shit(intro: web::Json<Intro>) -> impl Responder {
    let got_intro = intro.into_inner();
    HttpResponse::Created().json(got_intro)
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
            .service(hello)
            .service(json_res)
            .service(up_shit)
            .service(create_folder)
            .service(fetch_folders)
    })
    .bind("localhost:8000")?
    .run()
    .await
}

use actix_cors::Cors;
use actix_web::{delete, get, post, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use actix_web_prom::PrometheusMetricsBuilder;
use aws_sdk_s3::Client;
use prometheus::Gauge;
use std::thread;
use std::time::Duration;
use systemstat::{Platform, System};
use uuid::Uuid;

use structs::structs::{
    DownloadObj, FolderName, FoldersArray, GetObjectsParams, Metadata, SentMetadata,
};
use utils::s3::{
    create_folder_for_s3, delete_object_using_key, delete_objects, get_object_uri,
    list_all_objects, put_object_uri, show_folders,
};

mod structs;
mod utils;

#[get("/")]
async fn hello_from_backend() -> impl Responder {
    HttpResponse::Ok().body("Hello There")
}

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
        sent_from,
        ..
    } = metadata.into_inner();
    let actual_name = name.split('.').collect::<Vec<&str>>();
    let new_uuid = Uuid::new_v4()
        .to_string()
        .chars()
        .take(6)
        .collect::<String>();
    let user_name = user.split("@").collect::<Vec<&str>>();

    let formated_string: String;

    if sent_from.starts_with("/folders/") {
        let inner_folder = sent_from.split("/").collect::<Vec<&str>>();

        formated_string = format!(
            "{}/{}/{}-{}.{}",
            user_name.first().unwrap(),
            inner_folder.last().unwrap().replace("%20", " "),
            actual_name.first().unwrap(),
            new_uuid,
            actual_name.last().unwrap()
        );
    } else {
        formated_string = format!(
            "{}/{}-{}.{}",
            user_name.first().unwrap(),
            actual_name.first().unwrap(),
            new_uuid,
            actual_name.last().unwrap()
        );
    }

    let obj_key = formated_string.as_str();
    let presigned_put_uri =
        put_object_uri(&client, "elgoog-drive", obj_key, content_type.as_str(), 60)
            .await
            .unwrap();

    let sent_metadata = SentMetadata {
        obj_key: formated_string,
        presigned_put_uri,
        user_name: user_name[0].to_string(),
        sent_from,
    };

    HttpResponse::Created().json(sent_metadata)
}

#[get("/api/fetchFolders")]
async fn fetch_folders(name: web::Query<GetObjectsParams>) -> impl Responder {
    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);
    let user = &name.name;
    let folders = show_folders(&client, "elgoog-drive", user).await.unwrap();

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

    let presigned_get_uri = get_object_uri(&client, "elgoog-drive", obj_key.as_str(), 30)
        .await
        .unwrap();
    HttpResponse::Created().json(presigned_get_uri)
}

#[post("/api/shareObject")]
async fn share_object(key_json: web::Json<DownloadObj>) -> impl Responder {
    let DownloadObj { obj_key } = key_json.into_inner();

    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);

    let presigned_get_uri = get_object_uri(&client, "elgoog-drive", obj_key.as_str(), 432000)
        .await
        .unwrap();
    HttpResponse::Created().json(presigned_get_uri)
}

#[post("/api/createFolder")]
async fn create_folder(folder_name: web::Json<FolderName>) -> impl Responder {
    let FolderName { folder_name, user } = folder_name.into_inner();

    let user_name = user.split("@").collect::<Vec<&str>>();
    let user_name = user_name.first().unwrap();

    let folder_name = format!("{}/{}/", user_name, folder_name);
    let folder_name_str = folder_name.as_str();

    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);

    create_folder_for_s3(&client, "elgoog-drive", folder_name_str)
        .await
        .unwrap();

    let folder_data = FolderName {
        folder_name,
        user: user_name.to_string(),
    };

    println!("folder data to send: {:?}", &folder_data);

    HttpResponse::Created().json(folder_data)
}

#[delete("/api/deleteObject/{path:.+}")]
async fn remove_object(req: HttpRequest) -> Result<HttpResponse, actix_web::Error> {
    let path = req.match_info().get("path").unwrap_or("");
    let parts: Vec<&str> = path.split('/').collect();

    let mut key = String::new();

    if parts.len() == 3 {
        let user = parts[0];
        let folder_name = parts[1];
        let object_key = parts[2];

        key = format!("{}/{}/{}", user, folder_name, object_key);
    } else if parts.len() == 2 {
        let user = parts[0];
        let object_key = parts[1];

        key = format!("{}/{}", user, object_key);
    }

    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);

    delete_object_using_key(&client, "elgoog-drive", &key)
        .await
        .unwrap();

    Ok(HttpResponse::Ok().body("Object Deleted"))
}

#[delete("/api/deleteFolder/{user}/{object_key}")]
async fn remove_folder(path: web::Path<(String, String)>) -> impl Responder {
    let (user, object_key) = path.into_inner();

    let folder_key = format!("{}/{}/", user, object_key);

    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);

    let mut obj_vec = list_all_objects(&client, "elgoog-drive", &folder_key)
        .await
        .unwrap();
    obj_vec.push(folder_key);

    delete_objects(&client, "elgoog-drive", obj_vec)
        .await
        .unwrap();

    HttpResponse::Ok().body("Folder Deleted with its files")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let sys = System::new();

    let prometheus = PrometheusMetricsBuilder::new("api")
        .endpoint("/metrics")
        .build()
        .unwrap();

    let cpu_usage = Gauge::new("cpu_usage", "Current CPU usage in percent").unwrap();
    let mem_usage = Gauge::new("mem_usage", "Current memory usage in percent").unwrap();

    prometheus
        .registry
        .register(Box::new(cpu_usage.clone()))
        .unwrap();

    prometheus
        .registry
        .register(Box::new(mem_usage.clone()))
        .unwrap();
    thread::spawn(move || loop {
        match sys.cpu_load_aggregate() {
            Ok(cpu) => {
                thread::sleep(Duration::from_secs(1));
                let cpu = cpu.done().unwrap();
                cpu_usage.set(f64::trunc(
                    ((cpu.system * 100.0) + (cpu.user * 100.0)).into(),
                ));
            }
            Err(x) => println!("\nCPU load: error: {}", x),
        }
        match sys.memory() {
            Ok(mem) => {
                let memory_used = mem.total.0 - mem.free.0;
                let pourcentage_used = (memory_used as f64 / mem.total.0 as f64) * 100.0;
                mem_usage.set(f64::trunc(pourcentage_used));
            }
            Err(x) => println!("\nMemory: error: {}", x),
        }
    });

    HttpServer::new(move || {
        let cors = Cors::permissive();

        App::new()
            .wrap(prometheus.clone())
            .wrap(cors)
            .service(create_folder)
            .service(fetch_folders)
            .service(get_metadata)
            .service(get_objects)
            .service(remove_object)
            .service(remove_folder)
            .service(download_object)
            .service(hello_from_backend)
            .service(share_object)
    })
    .bind("0.0.0.0:8000")?
    .run()
    .await
}

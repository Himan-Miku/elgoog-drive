use std::time::Duration;

use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use aws_sdk_s3::{presigning::PresigningConfig, Client, Error};
use serde::{Deserialize, Serialize};

async fn show_objects(client: &Client, bucket: &str) -> Result<(), Error> {
    let objects = client.list_objects_v2().bucket(bucket).send().await?;
    println!("Objects are : ");
    for obj in objects.contents().unwrap_or_default() {
        println!("{:?}", obj.key().unwrap());
    }

    Ok(())
}

async fn get_object_uri(
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

#[derive(Debug, Serialize, Deserialize)]
struct Intro {
    name: String,
    number: i32,
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

#[actix_web::main]
async fn main() -> Result<(), std::io::Error> {
    let shared_config = aws_config::load_from_env().await;
    let client = Client::new(&shared_config);

    show_objects(&client, "elgoog-drive").await.unwrap();

    HttpServer::new(|| App::new().service(hello).service(json_res).service(up_shit))
        .bind("127.0.0.1:8000")?
        .run()
        .await
}

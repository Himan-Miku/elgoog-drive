use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use aws_sdk_s3::Client;
use serde::{Deserialize, Serialize};
use utils::s3::{get_object_uri, show_objects};

mod utils;

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
    get_object_uri(&client, "elgoog-drive", "Google-Drive-logo.png", 60)
        .await
        .unwrap();

    HttpServer::new(|| App::new().service(hello).service(json_res).service(up_shit))
        .bind("127.0.0.1:8000")?
        .run()
        .await
}

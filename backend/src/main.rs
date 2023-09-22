use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};

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
    HttpServer::new(|| App::new().service(hello).service(json_res).service(up_shit))
        .bind("127.0.0.1:8000")?
        .run()
        .await
}

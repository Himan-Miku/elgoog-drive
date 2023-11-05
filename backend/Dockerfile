# Build stage
FROM rust:1.68.2 as builder

WORKDIR /app

# Copy the source code
COPY . .

# Build the application
RUN cargo build --release


# Production stage
FROM debian:bullseye-slim

# Install CA certificates
RUN apt-get update && apt-get install -y ca-certificates

WORKDIR /usr/local/bin

COPY --from=builder /app/target/release/backend .

CMD ["./backend"]
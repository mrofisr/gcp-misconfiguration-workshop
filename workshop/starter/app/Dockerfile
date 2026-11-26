FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download || true
COPY . .
RUN CGO_ENABLED=0 go build -o /server .

FROM gcr.io/distroless/static-debian12:nonroot
WORKDIR /app
COPY --from=build /server /app/server
# VULNERABILITY: the placeholder key is baked into the container image.
COPY keys/lab-key.json /app/keys/lab-key.json
USER nonroot:nonroot
EXPOSE 8080
ENTRYPOINT ["/app/server"]

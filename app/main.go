// INTENTIONALLY VULNERABLE lab app. Do not use outside the workshop.
package main

import (
	"context"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"

	"cloud.google.com/go/storage"
	"google.golang.org/api/option"
)

// VULNERABILITY: a long-lived service-account key path is hardcoded in source.
// A placeholder file is shipped in the container image for the lab.
const hardcodedKeyPath = "keys/lab-key.json"

var page = template.Must(template.New("page").Parse(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Lab file browser</title>
  <script src="https://unpkg.com/htmx.org@1.9.12"></script>
  <style>body{font-family:system-ui;max-width:720px;margin:2rem auto}li{margin:.3rem 0}</style>
</head>
<body>
  <h1>Lab file browser</h1>
  <p>Bucket: <code>{{.Bucket}}</code></p>
  <button hx-get="/files" hx-target="#files">List files</button>
  <ul id="files"></ul>
  <p><a href="/file?name=welcome.txt">Open welcome.txt</a></p>
</body>
</html>`))

func newStorageClient(ctx context.Context) (*storage.Client, error) {
	// VULNERABILITY: prefer a hardcoded key file committed with the app.
	if _, err := os.Stat(hardcodedKeyPath); err == nil {
		client, err := storage.NewClient(ctx, option.WithCredentialsFile(hardcodedKeyPath))
		if err == nil {
			log.Printf("using hardcoded key at %s", hardcodedKeyPath)
			return client, nil
		}
		log.Printf("hardcoded key unusable (%v); falling back to ADC", err)
	}
	// FIX: in the repaired app, only this ADC path remains.
	return storage.NewClient(ctx)
}

func bucketName() string {
	if name := os.Getenv("BUCKET_NAME"); name != "" {
		return name
	}
	return "gdg-semarang-lab-files"
}

func listFiles(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	client, err := newStorageClient(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer client.Close()

	it := client.Bucket(bucketName()).Objects(ctx, nil)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	for {
		obj, err := it.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			fmt.Fprintf(w, "<li>error: %v</li>", err)
			break
		}
		fmt.Fprintf(w, `<li><a href="/file?name=%s">%s</a></li>`, obj.Name, obj.Name)
	}
}

func openFile(w http.ResponseWriter, r *http.Request) {
	// VULNERABILITY 1: no authorization check — anyone can request any object.
	// VULNERABILITY 2: the object name is used unsanitized from the query string.
	name := r.URL.Query().Get("name")

	ctx := r.Context()
	client, err := newStorageClient(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer client.Close()

	reader, err := client.Bucket(bucketName()).Object(name).NewReader(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	defer reader.Close()

	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	if _, err := io.Copy(w, reader); err != nil {
		log.Printf("copy failed: %v", err)
	}
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		if err := page.Execute(w, map[string]string{"Bucket": bucketName()}); err != nil {
			log.Printf("template failed: %v", err)
		}
	})
	mux.HandleFunc("/files", listFiles)
	mux.HandleFunc("/file", openFile)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}

# Plain-language glossary

Read this first. Every word used in the lab is explained here in everyday language.

| Word | Plain meaning | Where you will see it |
|---|---|---|
| **Cloud** | Computers and storage that belong to someone else (Google) and that you rent by the minute. | Intro |
| **Google Cloud / GCP** | Google's version of the cloud. It is the place that holds your bucket and app. | Intro |
| **Project** | The container that holds everything for this lab. The organizer already made it. | Setup |
| **Bucket** | A folder in Google Cloud where files live. "Cloud Storage bucket" is the full name. | Fix 1 |
| **Public bucket** | A folder anyone on the internet can open. In this lab that is a mistake you will fix. | Fix 1 |
| **IAM** | "Who is allowed to do what." Like a guest list for the cloud. | Fix 1 |
| **Permission / role** | A line on the guest list, such as "may read files" or "may do everything." | Fix 1 |
| **Service account** | A robot user that the app uses instead of a person. | Fix 1 |
| **Key / credential** | A password for a robot user. Putting it in code is a mistake you will fix. | Fix 2 |
| **Terraform** | A text file that describes the cloud resources you want. Running `apply` makes them real. | Fix 1 |
| **App** | The small web page you will open in a browser. It lists files from the bucket. | Fix 2 |
| **HTMX** | A small way for a web page to update part of itself without a full reload. You do not need to learn it. | Fix 2 |
| **Cloud Run** | The place Google runs your app for you. It stops when nobody uses it. | Setup, Fix 2 |
| **gcloud** | A command you type to ask Google Cloud questions from your terminal. | Verification |
| **MCP** | A bridge that lets the AI assistant use tools such as `gcloud` for you. | Setup |
| **ADC** | "Application Default Credentials" — the normal sign-in the app uses after you remove the hardcoded key. | Fix 2 |
| **doctor / plan / apply / destroy** | Check / preview / create / remove. Four commands used in this lab. | Everywhere |

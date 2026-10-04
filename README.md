# AWS DevOps CI/CD Project

An end-to-end CI/CD workflow that automates deployment of a Node.js application to an existing AWS EC2 server. GitHub stores the source, Jenkins coordinates the pipeline, Docker builds the application image, Docker Hub hosts it, and Ansible deploys it. Nginx serves public HTTP traffic and forwards it to the application. Terraform tracks the existing EC2 instance.

## Project overview

```text
GitHub → Jenkins → Docker build → Docker Hub → Ansible → AWS EC2
                                                        ↓
Browser → HTTP :80 → Nginx reverse proxy → Node.js :3000

Terraform → tracks the existing EC2 infrastructure
```

## Tools and responsibilities

| Tool | Use in this project |
|---|---|
| Node.js | Runs the web application and `/health` endpoint |
| GitHub | Stores the source code on the `main` branch |
| Jenkins | Checks out code, builds and pushes the image, and starts deployment |
| Docker | Packages the application into a container |
| Docker Hub | Stores the published container image |
| Ansible | Pulls the image and replaces the running container |
| AWS EC2 | Hosts the application and deployment components |
| Nginx | Accepts HTTP on port 80 and proxies requests to port 3000 |
| Terraform | Imports and tracks the existing EC2 instance |

## Environment

- **Cloud:** AWS EC2
- **Operating system:** Amazon Linux 2023
- **Region:** `ap-south-1` (Mumbai)
- **Application port:** `3000`
- **Public web port:** `80`
- **GitHub repository:** [sandy1876/aws-devops-student-project](https://github.com/sandy1876/aws-devops-student-project)
- **Docker Hub image:** `sandy1876/aws-devops-student-project:latest`

## CI/CD workflow

1. Jenkins checks out the `main` branch from GitHub.
2. Jenkins builds the Docker image from the repository's `Dockerfile`.
3. Jenkins authenticates to Docker Hub using a Jenkins credential and pushes the image.
4. Jenkins runs the Ansible playbook.
5. Ansible pulls the latest image, removes the old container, and starts a replacement named `aws-devops-container`.
6. Nginx routes public HTTP requests on port 80 to the application on port 3000.

The Jenkins job is named `AWS-DevOps-Project`. Its stages are **Checkout**, **Build Docker Image**, **Push to Docker Hub**, and **Deploy with Ansible**.

## Application check

The Node.js app listens on port 3000. Its health endpoint returns a JSON status:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{"status":"UP"}
```

After configuring Nginx and allowing HTTP through the AWS security group and Linux firewall, the app can be opened using the EC2 instance's public IP address.

## Terraform

Terraform was used to bring the existing EC2 instance under infrastructure tracking rather than creating another instance. The documented workflow was to configure the AWS provider for `ap-south-1`, import the instance, validate the configuration, and review the plan.

```bash
terraform validate
terraform plan
```

The documented plan result was **“No changes”**, indicating that the configuration matched the imported infrastructure at that time.

## Reported results

- Jenkins pipeline completed with `Finished: SUCCESS`.
- Ansible completed with `ok=4`, `changed=3`, `unreachable=0`, and `failed=0`.
- The application health endpoint returned `{"status":"UP"}`.
- The application was reached through the EC2 public IP.
- Terraform reported no infrastructure changes.

## Repository contents

The project documentation identifies these application files:

```text
app.js
package.json
Dockerfile
test/app.test.js
```

The deployment setup also uses a Jenkins pipeline, an Ansible inventory and playbook, Nginx configuration, and Terraform configuration. Exact paths for those deployment files were not specified in the project notes.

## Security notes

- Store Docker Hub credentials in Jenkins Credentials; do not commit passwords, tokens, private keys, or AWS credentials to the repository.
- The documented AWS security group allows inbound HTTP on port 80. Restrict SSH access to trusted IP addresses.
- Review the Terraform plan before applying infrastructure changes.
- The deployment uses the `latest` image tag; a versioned tag can make releases easier to identify and roll back.

## Skills demonstrated

CI/CD, Jenkins, Git/GitHub, Docker, Docker Hub, Ansible, AWS EC2, Nginx reverse proxy, Linux firewall configuration, Terraform import and planning, and application health checks.

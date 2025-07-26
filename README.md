Image Upload System - Backend
This is the backend component of the Image Upload System, built with NestJS. It handles image uploads, processing (conversion to WebP), storage, retrieval, and deletion.

Features
Image Upload API: Accepts JPEG, PNG, and WebP image files.

Image Validation: Validates file types and sizes (10MB limit) during upload.


Image Optimization: Converts uploaded images to WebP format using sharp for efficient storage and delivery. 


File Storage: Stores both the original raw image and the converted WebP image on the local filesystem. 


Database Integration: Uses Prisma ORM with a PostgreSQL database to store image metadata (filename, original name, mimetype, size, path, upload time, deletion status). 


Image Retrieval: Provides endpoints to fetch all uploaded image metadata and to serve individual WebP or raw image files. 

Delete Functionality: Supports two types of deletion:


Soft Delete (Trash): Updates deletedStatus and deletedAt fields in the database, marking the image as trashed without removing the file. 


Permanent Delete: Removes the image file from the filesystem and its corresponding record from the database. 

CORS Enabled: Configured to allow cross-origin requests from the frontend application.

Fastify Integration: Utilizes Fastify as the underlying HTTP server for high performance.

Technologies Used
NestJS

Fastify

Prisma (ORM)

PostgreSQL (Database)

@fastify/multipart (for handling file uploads)


sharp (for image processing and WebP conversion) 


uuid (for generating unique identifiers) 

Setup and Installation
Clone the repository:

Bash

git clone <backend-repository-url>
cd <backend-repository-folder>
Install dependencies:

Bash

npm install
# or
yarn install
Set up your PostgreSQL database:

Ensure PostgreSQL is running on your system.

Create a new database (e.g., image_upload_db).

Create a .env file in the root of the project and add your database connection string and port:

Code snippet

DATABASE_URL="postgresql://user:password@localhost:5432/image_upload_db?schema=public"
PORT=3001
Replace user, password, localhost:5432, and image_upload_db with your actual database credentials.

Run Prisma Migrations:

Bash

npx prisma migrate dev --name init
This command will create the images table in your database, as defined in prisma/schema.prisma.

Create an uploads directory:
The application stores uploaded images in an uploads directory one level above the project root. Create this directory manually:

Bash

mkdir ../uploads
Ensure that the NestJS application process has write permissions to this directory.

Run the backend server:

Bash

npm run start:dev
# or
yarn start:dev
The backend server will start and listen on http://localhost:3001 (or the port you specified in your .env file). You should see a message similar to "Application is running on: http://localhost:3001" in your console.

API Endpoints
The backend exposes the following RESTful API endpoints:

POST /api/images/upload

Description: Uploads a new image file.

Request: multipart/form-data with a field named file.

Response: 200 OK with success message and uploaded image metadata, or 400 Bad Request on failure.

GET /api/images

Description: Retrieves metadata for all uploaded images, including URLs to access their WebP and raw versions.

Response: 200 OK with a list of image objects.

GET /api/images/:id

Description: Serves a specific image file by its database ID. This will typically serve the WebP version.

Response: The image file content. 404 Not Found if the image or file does not exist.

POST /api/images/trash/:id

Description: Performs a soft delete on an image, marking it as 'trashed' in the database.

Response: 200 OK on success, or 400 Bad Request on failure.

DELETE /api/images/:id

Description: Permanently deletes an image file from the filesystem and its record from the database.

Response: 200 OK on success, or 400 Bad Request on failure.

GET /api/images/webp/:filename

Description: Serves the WebP optimized version of an image file directly by its generated filename.

Response: The WebP image file content. 404 Not Found if the file does not exist.

GET /api/images/raw/:filename

Description: Serves the original raw (unprocessed) version of an image file for download by its original filename.

Response: The raw image file content with Content-Disposition header for download. 404 Not Found if the file does not exist.

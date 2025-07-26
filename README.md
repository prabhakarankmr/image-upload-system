
# Image Upload System - Backend 🚀

This is the robust backend component of our Image Upload System, meticulously crafted with **NestJS**. It's the powerhouse that handles all the heavy lifting: image uploads, intelligent processing, secure storage, efficient retrieval, and flexible deletion options.

## ✨ Features

  * **Image Upload API**: Accepts popular image formats like JPEG, PNG, and WebP, ensuring broad compatibility.
  * [cite\_start]**Image Validation**: Rigorous validation checks for file types and sizes (up to 10MB limit) during upload, maintaining data integrity[cite: 2].
  * **Image Optimization**: Automatically converts uploaded images to highly efficient WebP format using `sharp`, significantly reducing file sizes and boosting delivery performance 🚀.
  * **File Storage**: Stores both the original raw image and the optimized WebP version on the local filesystem, providing flexibility for different use cases.
  * **Database Integration**: Seamlessly integrates with a **PostgreSQL** database via **Prisma ORM** to meticulously store all image metadata (filename, original name, mimetype, size, path, upload time, deletion status) 💾.
  * **Image Retrieval**: Provides dedicated endpoints to fetch all uploaded image metadata, and to serve individual WebP or raw image files on demand 🖼️.
  * **Flexible Delete Functionality**:
      * **Soft Delete (Trash)**: Updates `deletedStatus` and `deletedAt` fields in the database, effectively marking the image as 'trashed' without immediate removal from storage. Perfect for recovery options\! 🗑️.
      * **Permanent Delete**: Completely removes the image file from the filesystem and its corresponding record from the database, ensuring clean data management 🔥.
  * [cite\_start]**CORS Enabled**: Pre-configured to allow smooth and secure cross-origin requests from your frontend application 🔗[cite: 2].
  * [cite\_start]**Fastify Integration**: Utilizes **Fastify** as the underlying HTTP server, delivering blazing-fast performance and responsiveness ⚡[cite: 2].

## 🛠️ Technologies Used

  * **NestJS**: A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
  * **Fastify**: A fast and low-overhead web framework for Node.js, ensuring high throughput.
  * **Prisma (ORM)**: A next-generation ORM for Node.js and TypeScript, simplifying database access.
  * **PostgreSQL (Database)**: A powerful, open-source object-relational database system.
  * `@fastify/multipart`: Essential plugin for handling `multipart/form-data` file uploads.
  * `sharp`: High-performance Node.js image processing, ideal for image optimization.
  * `uuid`: For generating unique identifiers, crucial for unique filenames.

## 🚀 Setup and Installation

Get your backend up and running in a few simple steps\!

1.  **Clone the repository:**

    ```bash
    git clone <backend-repository-url>
    cd <backend-repository-folder>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up your PostgreSQL database:**

      * Ensure **PostgreSQL** is actively running on your system.
      * Create a brand new database (e.g., `image_upload_db`).
      * Create a `.env` file in the root of your project and add your database connection string and desired port:
        ```env
        DATABASE_URL="postgresql://user:password@localhost:5432/image_upload_db?schema=public"
        PORT=3001
        ```
        *(**Remember to replace** `user`, `password`, `localhost:5432`, and `image_upload_db` with your actual database credentials\!)*

4.  **Run Prisma Migrations:**

    ```bash
    npx prisma migrate dev --name init
    ```

    This powerful command will automatically create the `images` table in your database, as meticulously defined in your `prisma/schema.prisma` file.

5.  **Create an `uploads` directory:**
    The application stores all uploaded images in an `uploads` directory located one level *above* your project root. Manually create this directory:

    ```bash
    mkdir ../uploads
    ```

    🚨 **Important:** Ensure that the NestJS application process has the necessary **write permissions** to this directory\!

6.  **Run the backend server:**

    ```bash
    npm run start:dev
    # or
    yarn start:dev
    ```

    Your backend server will spring to life and listen on `http://localhost:3001` (or the port you've specified in your `.env` file). You should see a confirmation message like "Application is running on: http://localhost:3001" in your console. 🎉

## 🌐 API Endpoints

The backend proudly exposes the following **RESTful API endpoints** for seamless interaction:

  * ### `POST /api/images/upload`

      * **Description**: Uploads a brand new image file to the system.
      * **Request**: `multipart/form-data` with a field ingeniously named `file`.
      * **Response**: `200 OK` with a success message and the valuable metadata of your freshly uploaded image, or `400 Bad Request` if something goes awry.

  * ### `GET /api/images`

      * **Description**: Retrieves a comprehensive list of metadata for all uploaded images, thoughtfully including convenient URLs to access their optimized WebP and original raw versions.
      * **Response**: `200 OK` with a delightful array of image objects.

  * ### `GET /api/images/:id`

      * **Description**: Serves a specific image file by its unique database ID. By default, this will efficiently serve the optimized WebP version.
      * **Response**: The raw image file content itself. Expect a `404 Not Found` if the image or file decides to play hide-and-seek.

  * ### `POST /api/images/trash/:id`

      * **Description**: Performs a **soft delete** on an image, gracefully marking it as 'trashed' within the database. The file remains on storage, ready for potential recovery.
      * **Response**: `200 OK` on a successful trashing, or `400 Bad Request` if the trash bin is uncooperative.

  * ### `DELETE /api/images/:id`

      * **Description**: **Permanently deletes** an image file from the filesystem and its corresponding record from the database. Use with caution\!.
      * **Response**: `200 OK` for a clean permanent deletion, or `400 Bad Request` if the deletion encounters an obstacle.

  * ### `GET /api/images/webp/:filename`

      * **Description**: Serves the **WebP optimized version** of an image file directly, accessible by its generated unique filename.
      * **Response**: The WebP image file content. `404 Not Found` if the optimized file is elusive.

  * ### `GET /api/images/raw/:filename`

      * **Description**: Serves the **original raw (unprocessed) version** of an image file, primarily intended for direct download, by its original filename.
      * **Response**: The raw image file content, accompanied by a `Content-Disposition` header for seamless downloading. `404 Not Found` if the raw file is missing.

GET /api/images/raw/:filename

Description: Serves the original raw (unprocessed) version of an image file for download by its original filename.

Response: The raw image file content with Content-Disposition header for download. 404 Not Found if the file does not exist.

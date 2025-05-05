# Blog Website API Documentation

## 1. Overview

This API provides CRUD (Create, Read, Update, Delete) functionality for managing blog posts on a website. It uses RESTful principles and returns JSON-formatted data.  The API is designed for use by both frontend applications and other backend systems.


## 2. Available Endpoints

All endpoints are prefixed with `/api/v1/posts`.

| Method | Endpoint           | Description                               | Authentication |
|--------|--------------------|-------------------------------------------|-----------------|
| `GET`  | `/`                | Retrieve a list of blog posts.             | None            |
| `GET`  | `/{id}`            | Retrieve a specific blog post by ID.       | None            |
| `POST` | `/`                | Create a new blog post.                    | API Key         |
| `PUT`  | `/{id}`            | Update an existing blog post by ID.       | API Key         |
| `DELETE`| `/{id}`            | Delete a blog post by ID.                 | API Key         |


## 3. Request/Response Formats

All requests and responses use JSON.


## 4. Field Descriptions

**Blog Post Object:**

| Field      | Type        | Description                                  | Required? |
|------------|-------------|----------------------------------------------|------------|
| `id`       | Integer     | Unique identifier of the blog post.           | No (GET,PUT) |
| `title`    | String      | Title of the blog post.                       | Yes (POST, PUT) |
| `content`  | String      | Content of the blog post (HTML allowed).     | Yes (POST, PUT) |
| `author`   | String      | Author of the blog post.                     | Yes (POST, PUT) |
| `created_at`| Datetime    | Date and time the post was created.          | No (read-only) |
| `updated_at`| Datetime    | Date and time the post was last updated.      | No (read-only) |


## 5. Example Requests and Responses

**5.1 Get a List of Blog Posts:**

* **Request:**
  ```
  GET /api/v1/posts
  ```

* **Response (Example):**
  ```json
  [
    {
      "id": 1,
      "title": "My First Blog Post",
      "content": "<p>This is the content of my first blog post.</p>",
      "author": "John Doe",
      "created_at": "2024-07-26T10:00:00Z",
      "updated_at": "2024-07-26T10:00:00Z"
    },
    {
      "id": 2,
      "title": "Second Post",
      "content": "<p>This is the second post.</p>",
      "author": "Jane Smith",
      "created_at": "2024-07-27T12:30:00Z",
      "updated_at": "2024-07-27T12:30:00Z"
    }
  ]
  ```

**5.2 Create a New Blog Post:**

* **Request:**
  ```
  POST /api/v1/posts
  API-Key: YOUR_API_KEY
  Content-Type: application/json

  {
    "title": "New Blog Post",
    "content": "<p>This is the content of my new blog post.</p>",
    "author": "John Doe"
  }
  ```

* **Response (Example):**
  ```json
  {
    "id": 3,
    "title": "New Blog Post",
    "content": "<p>This is the content of my new blog post.</p>",
    "author": "John Doe",
    "created_at": "2024-07-28T15:45:00Z",
    "updated_at": "2024-07-28T15:45:00Z"
  }
  ```


## 6. Authentication Requirements

All write operations (POST, PUT, DELETE) require an API key. The API key should be included in the `API-Key` header of the request.


## 7. Error Handling

Errors are returned as JSON objects with the following structure:

```json
{
  "error": "Error message",
  "code": 400 // Example error code
}
```

Example Error Codes:

* `400`: Bad Request (invalid input)
* `401`: Unauthorized (missing or invalid API key)
* `404`: Not Found (blog post not found)
* `500`: Internal Server Error


## 8. Rate Limiting Information

The API has a rate limit of 100 requests per minute per API key.  If the rate limit is exceeded, a `429 Too Many Requests` error will be returned with details on the remaining requests and the reset time.  The response will include headers indicating the rate limit status, like `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`.

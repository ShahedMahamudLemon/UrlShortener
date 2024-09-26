# URL Shortener Service

A URL shortener service built using **Node.js**, **Express**, and **MongoDB**. It generates unique short URLs of fixed 6-character length for each long URL and ensures uniqueness through Base62 encoding combined with random string generation.

## Project Structure

```
.
├── controllers/        # Logic for URL shortening and redirection
├── models/             # Mongoose schema for storing URLs
├── public/             # Frontend files (HTML, JS)
├── routes/             # API routes for URL operations
├── test/               # Test files using Jest and Supertest
├── server.js           # Main server file
├── .env                # Environment variables (DB, port, base URL)
└── README.md           # Project documentation
```

## Features

- Generates a 6-character unique short URL.
- Validates URLs before shortening.
- Handles collisions in URL generation with a retry mechanism.
- Ensures that the same long URL returns the same short URL.
- Redirects short URLs to the original long URL.
- Ensures URL validation with custom logic for proper URL formatting.

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ShahedMahamudLemon/UrlShortner
   cd UrlShortner
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following content:

   ```
   MONGO_URI=mongodb://localhost:27017/urlShortener
   BASE_URL=http://localhost:3000
   PORT=3000
   ```

4. **Run MongoDB**:
   Make sure MongoDB is installed and running locally, or set up a MongoDB Atlas connection and replace `MONGO_URI` with the appropriate connection string.

5. **Start the server**:

   ```bash
   npm start
   ```

6. **Access the app**:

   - **Frontend**: Visit `http://localhost:3000` in your browser to access the UI for shortening URLs.
   - **API Endpoints**:
     - `POST /shorten`: Shortens a URL. Example request body:
       ```json
       { "longUrl": "https://example.com" }
       ```
     - `GET /:code`: Redirects to the original URL based on the short code.

7. **Run tests**:

   ```bash
   npm test
   ```

## API Example

- **POST /shorten**

  - **Request**:
    ```json
    {
      "longUrl": "https://www.example.com/trytest1252/2733/77"
    }
    ```
  - **Response**:
    ```json
    {
      "_id": "64f3bf2e9e3c8b0012345678",
      "longUrl": "https://www.example.com/trytest1252/2733/77",
      "shortUrl": "http://localhost:3000/abc123",
      "urlCode": "abc123",
      "date": "2024-09-25T12:34:56.789Z"
    }
    ```

- **GET /abc123**
  - Redirects the user to `https://www.example.com`.

## URL Validation

The service includes custom validation using a regular expression. This ensures that malformed URLs (e.g., `htt://bad-url`) are caught and rejected with a `400 Bad Request` response.

## Uniqueness Handling

- Short URLs are generated using a **Base62 encoding** of the current timestamp.
- To ensure that no duplicate codes are generated, the code is checked against the database, and a new one is generated in case of a collision.
- The `urlCode` field is indexed and marked as unique in the MongoDB schema for additional protection against collisions.

## Example Workflow

1. Enter a long URL in the form (or through the API), click "Shorten URL".
2. The service returns a 6-character short URL.
3. You can click or access the short URL to verify redirection to the original long URL.

## Dependencies

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building the API and handling routing.
- **MongoDB**: Database for storing URL mappings.
- **Mongoose**: ODM library for MongoDB.
- **valid-url**: For validating URL formats.
- **Dotenv**: For environment variable management.
- **Jest**: Testing framework.
- **Supertest**: HTTP assertions and testing.

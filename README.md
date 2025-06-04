# News Aggregator API

The **News Aggregator API** is a backend service that allows users to manage their preferences, fetch news articles based on those preferences, mark articles as read or favorite, and search for news using keywords. It also includes a caching mechanism to reduce external API calls.

---

## Project Overview

This project is designed to provide a personalized news aggregation service. Users can:

- Sign up and log in using JWT-based authentication.
- Manage their preferences for news categories.
- Fetch news articles based on their preferences.
- Mark articles as read or favorite.
- Search for news articles using keywords.
- Benefit from a caching mechanism to reduce external API calls and improve performance.

---

## Installation Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd news-aggregator-api
   ```
2. Install dependencies:
   npm install
3. Create a .env file in the root directory and add the following environment variables:
   port=3000
   MongoDbUrl=<your-mongodb-url>
   saltRounds=10
   jwtSecret=<your-jwt-secret>
   jwtExpiration=1h
   newsApiKey=<your-news-api-key>
4. start the server
   npm start

## API Endpoints

# Authentication:

1. POST /users/signup
   Register a new user.
   Request Body:
   {
   "name": "John Doe",
   "email": "john@example.com",
   "password": "password123",
   "preferences": ["movies", "sports"]
   }
2. POST /users/login
   Login with email and password.
   Request Body:
   {
   "email": "john@example.com",
   "password": "password123"
   }

# Preferences

1. GET /users/preferences
   Fetch user preferences.
   Headers:
   {
   "Authorization": "Bearer <token>"
   }
2. PUT /users/preferences
   Update user preferences.
   Request Body:
   {
   "preferences": ["movies", "comics", "games"]
   }

# News

GET /news
Fetch news articles based on user preferences.
Headers:
{
"Authorization": "Bearer <token>"
}

1. GET /news/read
   Fetch all read news articles.

2. POST /news/:id/read
   Mark a news article as read.

3. GET /news/favorites
   Fetch all favorite news articles.

4. POST /news/:id/favorite
   Mark a news article as favorite.

5. GET /news/search/:keyword
   Search for news articles using a keyword.

## Caching Mechanism

The API uses node-cache to cache news sources for 1 hour.
The cache is updated periodically using a scheduler defined in cacheUpdateScedulers.js.

## Testing

Run the test suite using the following command:
npm test

## Project Structure

news-aggregator-api/
├── app.js # Main application file
├── controllers/ # Contains business logic for routes
│ ├── authControllers.js
│ ├── newsControllers.js
│ └── preferencesControllers.js
├── middleware/ # Middleware for authentication and validation
│ ├── isAuthenticated.js
│ └── validationChecks.js
├── models/ # Mongoose models
│ └── user.js
├── routes/ # Route definitions
│ ├── auth.js
│ ├── news.js
│ └── preferences.js
├── taskSchedulers/ # Task schedulers for periodic tasks
│ └── cacheUpdateScedulers.js
├── test/ # Test files
│ └── server.test.js
├── utils/ # Utility files
│ └── constants.js
├── .env # Environment variables
├── .gitignore # Git ignore file
├── package.json # Project metadata and dependencies
└── README.md # Project documentation

## Dependencies

1. Express: Web framework for Node.js.
2. Mongoose: MongoDB object modeling tool.
3. JWT: For user authentication.
4. Node-Cache: In-memory caching.
5. Axios: For making HTTP requests.
6. Bcrypt: For password hashing.

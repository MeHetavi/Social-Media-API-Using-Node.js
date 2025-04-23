# Social Media API Using Node.js

A RESTful API for a social media platform built with Node.js, Express, and PostgreSQL. This API provides endpoints for user management, posts, likes, and comments functionality.

## Features

- User authentication using JWT
- CRUD operations for posts
- Like/unlike functionality
- Comment system
- Input validation
- Error handling
- Database persistence using PostgreSQL

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/social-media-api.git
cd social-media-api
```

2. Install dependencies:
```bash
npm install
```
`

3. Initialize the database:
```bash
npm run db:init
```

## API Endpoints

### Authentication
- `POST /signup` - Register a new user
- `POST /login` - Login and receive JWT token
- `GET /user` - Dashboard
- `PUT /user` - Edit user
- `GET /allUsers`

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get a specific post
- `POST /posts` - Create a new post
- `PUT /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post

### Likes
- `POST /like/:id` - Like a post
- `DELETE /like/:id` - Unlike a post

### Comments
- `POST /comment/:id` - Add a comment to a post
- `GET /comment/:id` - Get comments for a post
- `DELETE /comment/:id` - Delete a comment

## Request & Response Examples

### Register a New User
```bash
POST /register
Content-Type: application/json

{
  "username": "johndoe",
  "firstname": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "dob": "1990-01-01",
  "gender": "male"
}
```

### Create a New Post
```bash
POST /posts
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "caption": "My First Post",
  "image": ["path/to/image.jpg",...]
}
```

## Error Handling

The API uses standard HTTP status codes for error handling:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- Password hashing using bcrypt
- JWT for authentication
- Input validation and sanitization
- Protected routes using middleware

## Database Schema

```sql
Users
- id (PK)
- fullName
- username
- email
- password
- createdAt
- updatedAt

Posts
- id (PK)
- caption
- likes_count
- comments_count
- createdBy (FK to Users)
- createdAt
- updatedAt

Likes
- id (PK)
- forPost (FK to Posts)
- createdBy (FK to Users)
- createdAt
- updatedAt

Comments
- id (PK)
- comment
- forPost (FK to Posts)
- createdBy (FK to Users)
- createdAt
- updatedAt
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

Your Name - [Your GitHub Profile](https://github.com/mehetavi)

## Acknowledgments

- Express.js
- Sequelize
- JWT
- PostgreSQL

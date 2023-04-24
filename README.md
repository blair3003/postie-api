# Postie API

A progessive web application, built using the MERN stack, that provides a community of authenticated users to post and comment on images.

## The API

The Postie API is a RESTful API built using Node.js with the Express.js framework. Data is stored in MongoDB, and the application interfaces with the document database via the Mongoose library.

[Postie API →](https://postie-api.onrender.com)

## Features

Features of the API include:

- **Authentication and authorisation** - Users can register and log in to create new posts and add comments.
- **Access tokens** - Access tokens are created using JWT on log in, and sent securely with every request to access a protected route.
- **Persistent login** - A cookie is used to refresh the user's access token after it expires, avoiding the need to log in again.
- **Custom Middleware** - Custom middleware is used to verify access tokens, limit file upload types and sizes, and log events to the server.
- **Multipart Form Data** - Multipart/form-data is accepted and processed using the Multer middleware.
- **Image upload** - Images are stored as raw buffer data in the database, removing the need to use a file storage system such as S3 buckets.

## Endpoints

/				GET			index
/auth			POST		login
/auth/refresh	GET			refresh
/auth/register	POST		register
/auth/logout	POST		logout
/images/{id}	GET			view image
/posts			GET			all posts
/posts			POST		create post*
/posts			PATCH		update post*
/posts			DELETE		delete post*
/posts/{id}		GET			view post
/posts/comments	POST		create comment*
/posts/comments	DELETE		delete comment*
/users			GET			all users*
/users			PATCH		update user*
/users			DELETE		delete user*
/users/{id}		GET			view user

\**Protected routes
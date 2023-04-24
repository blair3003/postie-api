# Postie API

A progessive web application, built using the MERN stack, that provides a community of authenticated users to post and comment on images.

## The API

The Postie API is a RESTful API built using Node.js with the Express.js framework. Data is stored in MongoDB, and the application interfaces with the document database via the Mongoose library.

## Features

Features of the API include:

- **Authentication and authorisation** - Users can register and log in to create new posts and add comments.
- **Access tokens** - Access tokens are created using JWT on log in, and sent securely with every request to access a protected route.
- **Persistent login** - A cookie is used to refresh the user's access token after it expires, avoiding the need to log in again.
- **Middleware** - Middleware is used to verify access tokens, limit file upload types and sizes, and log events to the server.
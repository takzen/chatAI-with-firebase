# AI Chat Application with Firebase Authentication

This project is a full-stack application that allows users to interact with AI chat features. Firebase is used for authentication, and MongoDB handles the data storage for chat history and user-related data.

---

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
5. [Running the Project](#running-the-project)
6. [Environment Variables](#environment-variables)

---

## Features

- **User Authentication**: Firebase Authentication is used to manage user sign-in and sign-up.
- **AI Chat**: Chat with an AI-powered assistant that provides responses based on user input.
- **Chat History**: Persistent chat history stored in MongoDB.
- **Responsive Design**: Fully responsive UI for seamless interaction across devices.
- **Image Upload**: Integration with ImageKit for handling image uploads.

---

## Technologies Used

### Frontend

- React 18
- React Router DOM 6
- React Query for data fetching and state management
- Styled-components for styling

### Backend

- Express.js
- MongoDB with Mongoose for database operations
- Firebase Admin SDK for authentication
- ImageKit for image handling

### Development Tools

- Vite for frontend development
- ESLint for code linting
- Nodemon for backend development

---

## Project Structure

### Frontend

```plaintext
src/
  |- routes/
      |- homepage/
      |- dashboardPage/
      |- chatPage/
      |- signInPage/
      |- signUpPage/
  |- layouts/
      |- RootLayout.js
      |- DashboardLayout.js
  |- index.css
  |- index.js
```

### Backend

```plaintext
src/
  |- models/
      |- chat.js
      |- userChats.js
  |- index.js
  |- .env
  |- service_account.json
```

---

## Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB instance running
- Firebase project set up with a service account JSON file
- ImageKit account (optional for image uploads)

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```env
   VITE_API_URL=http://localhost:3000
   VITE_IMAGE_KIT_PUBLIC_KEY=<your_imagekit_public_key>
   VITE_IMAGE_KIT_URL_ENDPOINT=<your_imagekit_url_endpoint>
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```env
   MONGO=<your_mongodb_connection_string>
   CLIENT_URL=http://localhost:5173
   IMAGE_KIT_ENDPOINT=<your_imagekit_endpoint>
   IMAGE_KIT_PUBLIC_KEY=<your_imagekit_public_key>
   IMAGE_KIT_PRIVATE_KEY=<your_imagekit_private_key>
   PORT=3000
   ```

4. Add the Firebase service account JSON file to the backend directory and name it `service_account.json`.

5. Start the backend server:

   ```bash
   npm run start
   ```

---

## Running the Project

1. Start the backend server:

   ```bash
   cd backend
   npm run start
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

---

## Environment Variables

| Variable                | Description                       |
| ----------------------- | --------------------------------- |
| `MONGO`                 | Connection string for MongoDB     |
| `CLIENT_URL`            | URL of the frontend application   |
| `IMAGE_KIT_ENDPOINT`    | Endpoint for ImageKit integration |
| `IMAGE_KIT_PUBLIC_KEY`  | Public key for ImageKit           |
| `IMAGE_KIT_PRIVATE_KEY` | Private key for ImageKit          |
| `PORT`                  | Port for the backend server       |

---

Feel free to contribute to the project by submitting issues or pull requests!

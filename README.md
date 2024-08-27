# Grindset

## Overview

This project is built using [Next.js](https://nextjs.org/) and [Firebase](https://firebase.google.com/). It leverages the powerful combination of Next.js for server-rendered React applications and Firebase for backend services like authentication, Firestore, and hosting.

## Features

- **Next.js**: Server-side rendering, static site generation, and API routes.
- **Firebase**: Authentication, Firestore database, hosting, and more.
- **Real-time Updates**: Using Firestore's real-time capabilities.
- **Secure Authentication**: Managed with Firebase Authentication.
- **Hosting**: Deployed with Firebase Hosting for fast and secure delivery.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deployment)
- [Git](https://git-scm.com/) (for version control)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/CharathDev/workout-app.git
   cd workout-app
   ```

2. **Install all dependencies**

   ```bash
   npm install
   ```

3. **Set up the firebase config variables**
   Create a Firebase project in the Firebase Console.

   Add your Firebase project's configuration to a .env.local file at the root of your project:

   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Run the developtment server**

   ```bash
   npm run dev
   ```

5. **Open the developtment server**

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

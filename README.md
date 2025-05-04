# FeedMessage

FeedMessage is an anonymous social messaging platform that allows users to send and receive messages while keeping their identity private. Built with modern web technologies like Next.js, Tailwind CSS, and MongoDB, it offers a secure and user-friendly experience. Key features include anonymous messaging, user authentication with NextAuth.js, customizable settings, and responsive design. The platform also integrates with services like Resend API for email notifications and Google GenAI for AI-powered message suggestions. This project is built using modern web technologies and provides a seamless user experience.

## Features

- **Anonymous Messaging**: Send and receive messages without revealing your identity.
- **User Authentication**: Secure sign-up and sign-in using NextAuth.js.
- **Message Management**: View, delete, and manage messages in a user-friendly dashboard.
- **Customizable Settings**: Toggle message acceptance status.
- **Responsive Design**: Fully responsive UI for all devices.
- **AI-Powered Suggestions**: Leverage Google GenAI to provide intelligent message suggestions for users.

## Tech Stack

- **FullStack Framework**: Next.js
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js
- **Authentication**: NextAuth.js with JSON Web Tokens (JWT)
- **Email Service**: Resend API
- **Validation**: Zod
- **Package Manager**: npm
- **Version Control**: Git
- **Database**: MongoDB (or any other supported database)


## Folder Structure

```
feedmessage/
├── src/
│   ├── app/                                # Next.js app directory
│   │   ├── (auth)/                         # Authentication-related pages
│   │   │   ├── sign-in/                    # Sign-in page
│   │   │   ├── sign-up/                    # Sign-up page
│   │   │   └── verify/                     # Verification pages
│   │   │       └── [username]/             # Dynamic username verification page
│   │   ├── (app)/                          # Main application pages
│   │   │   ├── page.tsx                    # Main page
│   │   │   └── dashboard/                  # Dashboard pages
│   │   │       └── page.tsx                # Dashboard main page
│   │   ├── api/                            # API routes
│   │   │   ├── accept-messages/            # Accept messages API
│   │   │   ├── auth/                       # Authentication API
│   │   │   │   └── [...nextauth]/          # NextAuth.js dynamic route
│   │   │   ├── check-username-unique/      # Check username uniqueness API
│   │   │   ├── delete-message/             # Delete message API
│   │   │   │   └── [messageId]/            # Dynamic message ID route
│   │   │   ├── get-messages/               # Get messages API
│   │   │   ├── getUserByEmail/             # Get user by email API
│   │   │   ├── resend-otp/                 # Resend OTP API
│   │   │   │   └── [username]/             # Dynamic username route
│   │   │   ├── send-message/               # Send message API
│   │   │   ├── sign-up/                    # Sign-up API
│   │   │   ├── suggest-messages/           # Suggest messages API
│   │   │   └── verify-code/                # Verify code API
│   ├── components/                         # Reusable UI components
│   ├── context/                            # Context providers
│   ├── data/                               # Static data files
│   ├── helpers/                            # Helper functions
│   ├── lib/                                # Library utilities
│   ├── models/                             # Mongoose models
│   ├── schemas/                            # Zod validation schemas
│   ├── types/                              # TypeScript types
│   └── emails/                             # Email templates
├── public/                                 # Public assets
├── package.json                            # Project dependencies
├── tsconfig.json                           # TypeScript configuration
├── next.config.js                          # Next.js configuration
└── README.md                               # Project documentation
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/feedmessage.git
   cd feedmessage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   RESEND_API_KEY=your_resend_api_key
   GEMINI_API_KEY=your_google_genai_api_key
   BASE_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm start`: Start the production server.
- `npm run lint`: Run ESLint to check for code quality issues.

## API Endpoints

### Authentication
- `POST /api/sign-up`: Sign up a new user.
- `POST /api/auth/signin`: Sign in an existing user.
- `POST /api/verify-code`: Verify user account.

### Messages
- `GET /api/get-messages`: Fetch user messages.
- `POST /api/send-message`: Send a new message.
- `DELETE /api/delete-message/:id`: Delete a message.

### Settings
- `GET /api/accept-messages`: Get message acceptance status.
- `POST /api/accept-messages`: Update message acceptance status.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Resend API](https://resend.com/)
- [Google GenAI](https://cloud.google.com/genai)

---

## Improvement

1. Ensure user confirms email explicitly when trying to resend OTP. Update the backend to handle this scenario.

2. Improve the signup process by suggesting unique names and usernames for users.

3. Add more required fields to the signup form, such as phone number, date of birth, and profile picture upload.

4. Implement rate limiting for OTP resend requests to prevent abuse.

5. Enhance the dashboard to display user statistics, such as the number of messages sent and received.

6. Add a feature to allow users to block or report abusive messages.

7. Improve the email templates for better branding and user engagement.

---

Feel free to reach out if you have any questions or suggestions!

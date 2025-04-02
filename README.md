Finance App

Overview

Finance App is a web application built with React, Vite, and TypeScript that helps users track their income, expenses, and budgets efficiently. The app provides an intuitive interface to manage personal finances, ensuring users can monitor their financial health in real-time.



Features

User Authentication: Secure login and registration using AuthContext, with session storage in localStorage.

Protected Routes: Restricts access to certain pages if the user is not logged in.

Income & Expense Tracking: Users can add, edit, and delete income and expense transactions.

Budget Management: Set and manage monthly budgets.

Data Persistence: Saves user data in localStorage for easy retrieval.

Responsive UI: Built with shadcn components for a modern and accessible design.


Tech Stack

Frontend: React (Vite, TypeScript)

State Management: React Context API (AuthContext for authentication)

UI Library: shadcn

Storage: localStorage
 
style: tailwind Css


Installation

Clone the repository:

git clone https://github.com/ansariazaz/finance-app.git
cd finance

Install dependencies:

npm install

Start the development server:

npm run dev

Usage

Register or log in to access the dashboard.

Add income and expense transactions.

Set budgets and track expenses accordingly.

View your financial summary in a user-friendly dashboard.

Folder Structure

├── src
│   ├── components  # Reusable UI components
│   ├── context     # Authentication context 
│   ├── pages       # Application pages (Dashboard, Login, Register, etc.)
│   ├── services    # finance data 
│   ├── lib         # Utility functions
│   └── main.tsx    # Application entry point
├── public          # Static assets
├── package.json    # Project dependencies and scripts
└── README.md       # Project documentation

Authentication & Route Protection

The app uses AuthContext to handle user authentication.

User data (login state) is stored in localStorage.

Protected routes restrict access to authenticated users only.
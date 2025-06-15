# Magazine CMS - Client

A modern React-based frontend for a Magazine Content Management System.

## Features

- User Authentication (Login/Register)
- Role-based access (Admin/Writer)
- Article Management (Create, Edit, Delete)
- Issue Management
- Image Upload Support
- Rich Text Editor
- Responsive Design
- Custom Utility CSS

## Tech Stack

- React
- React Router
- Custom CSS Utilities
- Parcel Bundler

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd magazine-cms-client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
API_URL=https://cms-magzine-1.onrender.com
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:1234`

## Available Scripts

- `npm run dev` - Start development server
- `npm start` - Alias for `npm run dev`
- `npm run build` - Build for production
- `npm run clean` - Clean build files and dependencies

## Environment Variables

Create a `.env` file with the following variables:

```
API_URL=<your-api-url>
```

## Project Structure

```
src/
  ├── api.js          # API configuration and helpers
  ├── app.js          # Main app component
  ├── index.js        # Entry point
  ├── router.js       # Route definitions
  ├── index.css       # Global styles
  ├── components/     # Reusable components
  └── pages/          # Page components
      ├── login.js
      ├── register.js
      ├── dashboard.js
      ├── CreateArticle.js
      ├── EditArticle.js
      ├── CreateIssue.js
      └── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

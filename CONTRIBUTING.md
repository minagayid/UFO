# Contributing to UFO

Thank you for your interest in contributing to UFO (Ultimate Financial Operations)! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/UFO.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `cd frontend && npm install`

## Development Workflow

### Running Locally

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
cd frontend
npm run build
npm run preview
```

## Commit Guidelines

- Use clear, descriptive commit messages
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- Example: `feat(dashboard): add revenue forecast chart`

## Pull Request Process

1. Update the README.md if making documentation changes
2. Ensure all tests pass: `npm run build && npm run preview`
3. Check for console logs and TODO comments
4. Request review from maintainers
5. Address feedback promptly

## Code Standards

### TypeScript
- Strict mode enabled
- Proper type annotations
- No `any` types without justification

### React
- Functional components with hooks
- Proper prop typing
- Meaningful component names

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Maintain dark mode support

## Security

- Never commit sensitive data (.env files, API keys)
- Use environment variables for secrets
- Run `npm audit` before submitting PR
- Report security vulnerabilities privately

## Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for >80% code coverage

## Documentation

- Add JSDoc comments to functions
- Update README for new features
- Include examples when applicable

## Questions?

Feel free to open an issue for discussion or clarification.

Thank you for contributing! 🚀

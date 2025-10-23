# Contributing to Clip Generator

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Use the bug report template
3. Include:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check if the feature has already been suggested
2. Use the feature request template
3. Clearly describe:
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative solutions considered
   - Additional context

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Update documentation
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development Setup

See [SETUP.md](SETUP.md) for detailed setup instructions.

## Coding Standards

### JavaScript/Node.js
- Use ES6+ features
- Follow Airbnb style guide
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

### React
- Use functional components with hooks
- Keep components under 200 lines
- Use PropTypes or TypeScript
- Follow component naming conventions
- Write reusable components

### Python
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Keep functions under 50 lines
- Use meaningful variable names

## Project Structure

```
slop/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── video-processor/   # Python video processing
└── docs/              # Documentation
```

## Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
npm test
```

### Python
```bash
cd video-processor
pytest
```

## Commit Messages

Use conventional commit format:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(frontend): add video preview component
fix(backend): resolve CORS issue
docs(api): update endpoint documentation
```

## Documentation

- Update README.md for user-facing changes
- Update API.md for API changes
- Add JSDoc/docstrings for new code
- Include code examples where helpful

## Areas for Contribution

### High Priority
- [ ] Implement real AI-powered clip selection
- [ ] Add user authentication
- [ ] Improve video processing performance
- [ ] Add more social media platforms
- [ ] Implement batch processing

### Medium Priority
- [ ] Add video editing features
- [ ] Improve caption accuracy
- [ ] Add custom branding options
- [ ] Create mobile app
- [ ] Add analytics dashboard

### Low Priority
- [ ] Add more video effects
- [ ] Support more video formats
- [ ] Add video templates
- [ ] Implement scheduling
- [ ] Add collaboration features

## Questions?

Feel free to open an issue with the "question" label.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing! 🎉

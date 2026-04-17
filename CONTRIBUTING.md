# Contributing to KulPik

Thank you for your interest in contributing to KulPik! This guide will help you get started.

---

## Code of Conduct

- Be respectful and inclusive
- Welcome beginners and help them learn
- Focus on constructive feedback
- Respect diverse perspectives and experiences

---

## How to Contribute

### 1. Report Bugs

Create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Python version, Node version)
- Screenshots if applicable

### 2. Suggest Features

Create an issue with:
- Feature name and description
- Use case and benefits
- Possible implementation approach
- Any alternatives considered

### 3. Submit Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Write/update tests
5. Commit with clear messages
6. Push to your fork
7. Submit a pull request

---

## Development Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- Git
- Supabase account (free tier)

### Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/kulpik.git
cd kulpik

# Install dependencies
pip install -r requirements.txt
cd web && npm install && cd ..

# Setup environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Verify setup
bash scripts/deploy-check.sh
```

### Run Locally

```bash
# Backend
python curation_server.py

# Frontend (in another terminal)
cd web && npm run dev
```

---

## Code Standards

### Python

- Follow PEP 8 style guide
- Use type hints where possible
- Write docstrings for functions and classes
- Keep functions focused and under 50 lines
- Use meaningful variable names

Example:

```python
def search_laptops(query: str, limit: int = 10) -> list[dict]:
    """
    Search for laptops using EXA API.

    Args:
        query: Search query string
        limit: Maximum number of results (default: 10)

    Returns:
        List of laptop dictionaries from EXA search
    """
    # Implementation
    pass
```

### JavaScript/TypeScript

- Use TypeScript over JavaScript when possible
- Follow ESLint rules
- Use functional components in React
- Keep components under 200 lines
- Use meaningful component and variable names

### Git Commits

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "fix: resolve CORS error when calling backend API"
git commit -m "feat: add vector search support for laptop recommendations"
git commit -m "docs: update deployment guide with Railway instructions"

# Bad
git commit -m "fixed stuff"
git commit -m "update"
```

---

## Testing

### Python Tests

```bash
# Run all tests
python -m pytest

# Run specific test file
python -m pytest tests/test_auto_curation.py

# Run with coverage
python -m pytest --cov=.
```

### Frontend Tests

```bash
cd web

# Run tests
npm test

# Run with coverage
npm run test:coverage
```

### Manual Testing

Before submitting PR:

- [ ] Run `bash scripts/deploy-check.sh` - all checks pass
- [ ] Test backend API endpoints manually
- [ ] Test frontend UI flows
- [ ] Verify no console errors
- [ ] Test on different screen sizes
- [ ] Ensure no exposed API keys in code

---

## Pull Request Process

1. **Update documentation** if you changed functionality
2. **Add tests** for new features
3. **Ensure CI passes** (GitHub Actions will run automatically)
4. **Request review** from maintainers
5. **Address feedback** promptly and respectfully
6. **Squash commits** if requested by maintainers

### PR Template

When creating a PR, include:

- **Description**: What does this PR do?
- **Related Issues**: Link to any related issues
- **Testing**: How did you test this?
- **Screenshots**: For UI changes
- **Breaking Changes**: List any breaking changes
- **Checklist**:
  - [ ] Tests added/updated
  - [ ] Documentation updated
  - [ ] No exposed credentials
  - [ ] Code follows style guidelines

---

## Architecture Overview

```
kulpik/
├── web/                    # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages and API routes
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities
│   └── package.json
├── scripts/                # Deployment and utility scripts
├── docs/                   # Documentation
├── supabase/               # Database migrations
├── auto_curation.py        # Auto-curation system
├── curation_server.py      # Flask API backend
├── manual_curator.py       # Manual data entry tool
├── requirements.txt        # Python dependencies
└── package.json            # Project metadata
```

---

## Common Tasks

### Add New API Endpoint

1. Add route in `curation_server.py`
2. Add error handling and validation
3. Write tests
4. Update API documentation
5. Test with curl or Postman

### Add New Database Table

1. Create migration in `supabase/migrations/`
2. Add RLS policies
3. Update schema documentation
4. Test migration locally
5. Add Supabase client queries in code

### Add New Frontend Page

1. Create page in `web/src/app/`
2. Add navigation if needed
3. Test responsive design
4. Add loading states and error handling
5. Test with mock data

---

## Getting Help

- **Documentation**: `/docs/` directory
- **Issues**: https://github.com/verrysimatupang99/kulpik/issues
- **Discussions**: GitHub Discussions tab
- **Email**: Contact repository owner

---

## Recognition

Contributors will be added to the README.md hall of fame!

Thank you for contributing to KulPik! 🎉

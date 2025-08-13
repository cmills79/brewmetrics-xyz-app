# Deployment Checklist for BrewMetrics

## Required Files for Web Server:

### Static Knowledge Base (Must Upload):
```
/AI-Brewmaster_Knowledge_Base/
├── styles/
├── troubleshooting/
├── ingredients/
├── recipes/
└── *.md files
```

### Application Files:
```
/public/
├── offline-knowledge-base.js
├── ai-brewmaster.js
├── brewing_knowledge_expansion.js
├── dashboard.html
└── all other app files
```

## Web Server Configuration:
- Serve `.md` files with `text/plain` MIME type
- Enable CORS for knowledge base directory
- Ensure all files are publicly accessible

## Firebase Configuration:
- Firestore for inventory/user data (already configured)
- Authentication (already configured)
- Functions (already configured)

## Testing Deployment:
1. Upload all files to web server
2. Test knowledge base loading: `yoursite.com/AI-Brewmaster_Knowledge_Base/styles/hazy_ipa.md`
3. Verify AI Assistant loads knowledge base
4. Test inventory integration with Firebase
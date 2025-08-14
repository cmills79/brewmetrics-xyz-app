# Firebase Setup Guide for BrewMetrics

## Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Logged into Firebase CLI (`firebase login`)

## 1. Initialize Firebase Services

Run these commands in your project root directory:

```bash
# Navigate to project directory
cd c:\Users\Clay\source\repos\brewmetrics-xyz-app

# Initialize Firebase (select existing project: brewmetrics-xyz-web)
firebase init

# When prompted, select:
# ✓ Firestore: Configure security rules and indexes files
# ✓ Functions: Configure a Cloud Functions directory and its files  
# ✓ Hosting: Configure files for Firebase Hosting
# ✓ Storage: Configure a security rules file for Cloud Storage

# Use existing project: brewmetrics-xyz-web
# Accept default settings for all prompts
```

## 2. Deploy Firestore Database

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore
```

## 3. Deploy Cloud Storage

```bash
# Deploy Storage rules
firebase deploy --only storage
```

## 4. Deploy Cloud Functions

```bash
# Install function dependencies
cd functions
npm install

# Return to root and deploy functions
cd ..
firebase deploy --only functions
```

## 5. Deploy Hosting (Optional)

```bash
# Deploy web app to Firebase Hosting
firebase deploy --only hosting
```

## 6. Verify Setup

After deployment, verify in Firebase Console:

1. **Firestore Database**: https://console.firebase.google.com/project/brewmetrics-xyz-web/firestore
2. **Cloud Storage**: https://console.firebase.google.com/project/brewmetrics-xyz-web/storage
3. **Cloud Functions**: https://console.firebase.google.com/project/brewmetrics-xyz-web/functions

## Database Collections Structure

Your Firestore will have these collections:
- `users` - User profiles and settings
- `batches` - Brewing batch data
- `inventory` - Ingredient inventory
- `equipment` - Brewery equipment setup
- `analytics` - Usage analytics and metrics

## Storage Buckets Structure

Your Cloud Storage will have these folders:
- `users/{userId}/` - User-specific files
- `brewery-logos/{userId}/` - Brewery logo uploads
- `batch-photos/{userId}/{batchId}/` - Batch photo uploads
- `public/` - Public assets

## Security Rules

- **Firestore**: Users can only access their own data
- **Storage**: Users can only upload/access their own files
- **Functions**: Authenticated access required for most operations

## Next Steps

1. Run the setup commands above
2. Test the application with Firebase services
3. Monitor usage in Firebase Console
4. Set up billing alerts for your $300 credit

Your BrewMetrics app is now ready for production use!
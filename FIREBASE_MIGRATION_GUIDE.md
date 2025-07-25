# Firebase Project Migration Guide

## Option 1: Manual Migration (Recommended)

### **1. Export Data from brewmetrics-xyz-app**
```bash
# Export Firestore data
firebase use brewmetrics-xyz-app
firebase firestore:export gs://brewmetrics-xyz-app.appspot.com/exports/

# Export Authentication users
# (Manual process via Firebase Console)
```

### **2. Import to brewmetrics-xyz-app-e8d51**
```bash
# Switch to target project
firebase use brewmetrics-xyz-app-e8d51

# Import Firestore data
firebase firestore:import gs://brewmetrics-xyz-app-e8d51.appspot.com/exports/

# Import users manually via Firebase Console
```

### **3. Update Configuration**
- Copy Firebase config from old project
- Update API keys and service accounts
- Migrate Cloud Functions
- Transfer BigQuery datasets

## Option 2: Keep Current Setup (Easiest)

**Recommendation**: Keep using `brewmetrics-xyz-app-e8d51`

### **Why This is Better:**
- ✅ No data loss risk
- ✅ No downtime
- ✅ Existing users/data preserved
- ✅ All integrations work

### **To Clean Up Project Name:**
1. Go to Firebase Console
2. Project Settings → General
3. Change "Project name" to "BrewMetrics"
4. Keep Project ID as `brewmetrics-xyz-app-e8d51`

## Option 3: Create New Clean Project

### **Steps:**
1. Create `brewmetrics-xyz-app` project
2. Set up fresh Firebase config
3. Deploy clean codebase
4. Migrate essential data only

### **Pros:**
- Clean project ID
- Fresh start
- No legacy issues

### **Cons:**
- Lose all existing data
- Need to reconfigure everything
- Users need to re-register

## **Recommendation: Keep Current Project**

The project ID `brewmetrics-xyz-app-e8d51` works perfectly fine. The `-e8d51` suffix doesn't affect functionality and users never see it. Focus on app features rather than cosmetic project naming.
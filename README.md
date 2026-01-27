# admin
dashboard admin

#- `testimoniForm.js`: Logic and template for Testimoni input.

### Google Sign-In Integration
- **Google Identity Services**: Use the latest GIS library.
- **Client ID**: `712946684527-tt76rf23aa7esbc7ivvpuia7skv3kdra.apps.googleusercontent.com`
- **Flow**:
    1. Show login overlay if not authenticated.
    2. User signs in with Google.
    3. Extract `name` and `picture` from JWT payload.
    4. Update Top Bar UI and hide overlay.

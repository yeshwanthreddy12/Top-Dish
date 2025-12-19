# Security Notes

## API Key Security

This application uses client-side API keys for:
- **Google Places API**: Designed for client-side use with HTTP referrer restrictions
- **Hugging Face API**: Free tier token for client-side inference

### Recommended Security Measures

1. **Google Places API Key Restrictions:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to APIs & Services → Credentials
   - Click on your API key
   - Under "Application restrictions", select "HTTP referrers (web sites)"
   - Add your domain: `https://yeshwanthreddy12.github.io/*`
   - Save changes

2. **Hugging Face Token:**
   - Use a token with minimal permissions (Read only)
   - Consider rotating tokens periodically
   - Monitor usage in Hugging Face dashboard

3. **GitHub Secret Scanning:**
   - GitHub may flag these keys in the built files
   - This is expected for client-side API keys
   - You can allow the secret in GitHub's security settings if needed

### Alternative Approach (Future Enhancement)

For better security, consider:
- Using a serverless function (Vercel, Netlify) as a proxy
- Implementing rate limiting
- Using API key rotation


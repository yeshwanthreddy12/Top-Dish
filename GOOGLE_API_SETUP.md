# Google Places API Setup Guide

## Fixing "CORS error" or "API may be blocking requests"

If you're seeing errors like "Google Places API may be blocking requests" or CORS errors, follow these steps:

## Step 1: Enable Required APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Library**
4. Search for and **Enable** these APIs:
   - ✅ **Places API** (required)
   - ✅ **Places API (New)** (recommended)
   - ✅ **Maps JavaScript API** (optional, for autocomplete)

## Step 2: Configure API Key Restrictions

1. Go to **APIs & Services** → **Credentials**
2. Click on your API key
3. Under **API restrictions**:
   - Select **Restrict key**
   - Check these APIs:
     - ✅ Places API
     - ✅ Places API (New)
   - Click **Save**

4. Under **Application restrictions**:
   
   **Option A: For Development (Less Secure)**
   - Select **None** (for testing only)
   - Click **Save**
   
   **Option B: For Production (Recommended)**
   - Select **HTTP referrers (web sites)**
   - Click **Add an item** and add:
     - `http://localhost:*` (for local development)
     - `http://127.0.0.1:*` (for local development)
     - `https://yeshwanthreddy12.github.io/*` (for GitHub Pages)
     - `https://*.github.io/*` (if you want to allow all GitHub Pages)
   - Click **Save**

## Step 3: Verify Your API Key

1. Make sure your API key is correct in:
   - `.env` file: `VITE_GOOGLE_PLACES_API_KEY=your_key_here`
   - GitHub Secrets: `GOOGLE_PLACES_API_KEY` (for production)

2. The API key should start with `AIza...`

## Step 4: Check Billing

1. Go to **Billing** in Google Cloud Console
2. Make sure billing is enabled (even with free tier, you need a billing account)
3. Check that you haven't exceeded the free tier ($200/month credit)

## Step 5: Test the API

After making changes, wait 1-2 minutes for changes to propagate, then:

1. Open your app
2. Open browser console (F12)
3. Try searching for a restaurant
4. Check for any error messages

## Common Issues:

### "REQUEST_DENIED"
- API not enabled → Enable Places API
- Wrong API key → Check your key
- API restrictions → Check API restrictions settings

### "OVER_QUERY_LIMIT"
- Quota exceeded → Check billing/usage
- Too many requests → Wait and try again

### CORS Errors
- HTTP referrer restrictions → Add your domain to allowed referrers
- API key restrictions → Set Application restrictions correctly

## Quick Fix Checklist:

- [ ] Places API is enabled
- [ ] API key has Places API in API restrictions
- [ ] Application restrictions set to "None" OR includes your domains
- [ ] API key is correct in `.env` and GitHub Secrets
- [ ] Billing is enabled
- [ ] Waited 1-2 minutes after making changes

## Still Having Issues?

1. Check browser console for specific error messages
2. Verify API key in Google Cloud Console → Credentials
3. Test API key directly: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant&key=YOUR_KEY`
4. Check Google Cloud Console → APIs & Services → Dashboard for API usage


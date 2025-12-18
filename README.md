# 🍽️ Top Dish

Discover the most loved dishes at any restaurant by analyzing Google reviews with AI.

## Features

- 🔍 Search any restaurant by name
- 📊 Analyze Google reviews to find top dishes
- 🎯 Filter by dish categories (Appetizers, Main Courses, Desserts, etc.)
- 🤖 Powered by AI (Hugging Face or OpenAI)
- 🎨 Clean, modern UI
- 🆓 Free hosting on GitHub Pages

## Setup

### Prerequisites

- Node.js 18+ installed
- Google Places API key ([Get one here](https://developers.google.com/maps/documentation/places/web-service/get-api-key))
- Hugging Face API key ([Get a free one here](https://huggingface.co/settings/tokens)) or OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Top-Dish
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key
VITE_LLM_PROVIDER=huggingface
```

**Optional:** To use OpenAI instead:
```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_LLM_PROVIDER=openai
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment to GitHub Pages

1. **Set up GitHub Secrets:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `GOOGLE_PLACES_API_KEY`: Your Google Places API key
     - `HUGGINGFACE_API_KEY`: Your Hugging Face API key (or `OPENAI_API_KEY` if using OpenAI)

2. **Update repository name in `vite.config.js`:**
   - Change `base: '/Top-Dish/'` to match your repository name

3. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (created automatically by the workflow)
   - Folder: `/ (root)`

5. **Access your site:**
   - Your site will be available at `https://<username>.github.io/Top-Dish/`

## How It Works

1. **Restaurant Search**: Uses Google Places API to find the restaurant and fetch reviews
2. **Category Extraction**: AI analyzes reviews to identify available dish categories
3. **Dish Analysis**: AI processes reviews to find the top 2 dishes in selected categories
4. **Results Display**: Shows the most mentioned and highly rated dishes

## LLM Provider Configuration

The app supports multiple LLM providers through an abstraction layer:

### Hugging Face (Free Tier)
- Default provider
- Uses Mistral-7B-Instruct model
- Free tier available
- Set `VITE_LLM_PROVIDER=huggingface`

### OpenAI
- More reliable and faster
- Requires paid API key
- Set `VITE_LLM_PROVIDER=openai` and provide `VITE_OPENAI_API_KEY`

## Project Structure

```
Top-Dish/
├── src/
│   ├── components/
│   │   ├── RestaurantInput.jsx
│   │   ├── CategorySelection.jsx
│   │   └── Results.jsx
│   ├── services/
│   │   ├── api.js          # Google Places API integration
│   │   └── llmService.js   # LLM abstraction layer
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
├── index.html
├── vite.config.js
└── package.json
```

## API Costs

- **Google Places API**: Pay-as-you-go, but has a free tier ($200 credit/month)
- **Hugging Face**: Free tier available
- **OpenAI**: Pay-per-use (GPT-3.5-turbo is very affordable)

## Troubleshooting

### "Restaurant not found"
- Try including the city/state in the restaurant name
- Ensure your Google Places API key is valid and has the Places API enabled

### "Failed to analyze dishes"
- Check your LLM API key (Hugging Face or OpenAI)
- For Hugging Face, the model might be loading (first request can take time)
- Check browser console for detailed error messages

### Build fails on GitHub Actions
- Ensure all secrets are set correctly
- Check that the repository name matches the `base` path in `vite.config.js`

## License

MIT


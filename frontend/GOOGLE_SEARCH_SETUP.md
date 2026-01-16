# Google Custom Search API Setup Guide

## Overview
The Explore section now uses Google Custom Search JSON API to dynamically fetch archaeological sites. No more hardcoded database!

## Setup Steps

### 1. Create a Google Cloud Project
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project
- Enable the Custom Search API

### 2. Get API Key
- In Google Cloud Console → Credentials
- Create an API key (restrict to Custom Search API)
- Copy the API key

### 3. Create Custom Search Engine
- Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
- Create a new search engine
- Set search results to include Wikipedia and archaeological sites
- Copy the Search Engine ID (cx parameter)

### 4. Configure Environment Variables
Create/Update `frontend/.env.local`:
```
REACT_APP_GOOGLE_API_KEY=your_api_key_here
REACT_APP_SEARCH_ENGINE_ID=your_search_engine_id_here
```

### 5. Restart Frontend Server
```bash
cd frontend
npm start
```

## How It Works

1. User enters search query (e.g., "Taj Mahal")
2. Search query is sent to Google Custom Search API
3. API returns up to 2 most relevant archaeological sites
4. Results display with:
   - Site name
   - Description (from search snippet)
   - Link to the actual article
   - Archaeological site image
5. Clicking result opens the full article

## Features
✅ Dynamic searching - no hardcoded database
✅ Real-time results from Google index
✅ Returns first 2 most relevant results
✅ Direct links to Wikipedia or article sources
✅ Professional presentation with images

## Limitations
- Free tier: 100 queries per day
- Premium tier: $5 per 1000 queries
- Consider caching results for frequently searched sites

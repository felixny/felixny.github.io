# Portfolio Analytics Setup Guide

This guide provides multiple options for tracking visitors to your portfolio website.

## Option 1: Google Analytics 4 (Recommended)

### Setup Steps:
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for your portfolio
3. Get your Measurement ID (starts with G-)
4. Update the Analytics component:

```typescript
// In /src/components/Analytics.tsx
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual ID
```

### Benefits:
- Professional analytics dashboard
- Detailed visitor insights
- Conversion tracking
- Real-time data
- Free up to 10 million events/month

## Option 2: Simple Analytics (Privacy-focused)

### Setup Steps:
1. Go to [Simple Analytics](https://simpleanalytics.com/)
2. Create account and add your domain
3. Get your tracking code
4. Add to your layout:

```typescript
// Add to layout.tsx
<Script
  src="https://scripts.simpleanalytics.com/hello.js"
  strategy="afterInteractive"
/>
```

### Benefits:
- Privacy-focused (no cookies)
- GDPR compliant
- Clean, simple dashboard
- $9/month

## Option 3: Plausible Analytics

### Setup Steps:
1. Go to [Plausible](https://plausible.io/)
2. Create account and add your domain
3. Get your tracking code
4. Add to your layout:

```typescript
// Add to layout.tsx
<Script
  src="https://plausible.io/js/script.js"
  data-domain="yourdomain.com"
  strategy="afterInteractive"
/>
```

### Benefits:
- Privacy-focused
- Lightweight (1.4KB)
- No cookies or personal data collection
- $9/month

## Option 4: Built-in Simple Tracking (Already Implemented)

The portfolio already includes basic tracking that logs to the browser console:

### Features:
- Page view counter (stored in localStorage)
- Click tracking for buttons and links
- Console logging for debugging

### To view data:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Refresh the page to see tracking data

## Option 5: Custom Analytics with Supabase

For more advanced tracking, you can create a custom analytics system:

### Setup Steps:
1. Create a Supabase project
2. Create an analytics table:

```sql
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50),
  event_data JSONB,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Create an analytics service:

```typescript
// analytics.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const trackEvent = async (eventType: string, eventData: any) => {
  await supabase
    .from('analytics')
    .insert([
      {
        event_type: eventType,
        event_data: eventData,
        user_agent: navigator.userAgent,
        referrer: document.referrer
      }
    ])
}
```

## Current Implementation

The portfolio currently includes:
- ✅ Basic page view tracking
- ✅ Click event tracking
- ✅ Console logging for debugging
- 🔄 Ready for Google Analytics integration

## Recommendations

For a professional portfolio, I recommend:

1. **Google Analytics 4** - Best for detailed insights and it's free
2. **Simple Analytics** - If you prefer privacy-focused analytics
3. **Built-in tracking** - For basic monitoring without external services

## Next Steps

1. Choose your preferred analytics solution
2. Follow the setup steps above
3. Test the tracking on your deployed site
4. Monitor your analytics dashboard regularly

## Privacy Considerations

- All analytics solutions should comply with GDPR/CCPA
- Consider adding a privacy policy to your portfolio
- Inform visitors about data collection (if required)
- Use privacy-focused solutions if you prefer minimal data collection

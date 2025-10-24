"use client";

import { useEffect } from "react";

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: {
      (...args: any[]): void;
      q: any[];
    };
  }
}

// Google Analytics 4 component
export function GoogleAnalytics() {
  useEffect(() => {
    // Replace 'G-XXXXXXXXXX' with your actual GA4 measurement ID
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
    
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.gtag = window.gtag || function() {
      (window.gtag.q = window.gtag.q || []).push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);

    return () => {
      // Cleanup function
      document.head.removeChild(script);
    };
  }, []);

  return null;
}

// Simple page view counter (stored in localStorage)
export function PageViewCounter() {
  useEffect(() => {
    const views = localStorage.getItem('portfolio_views');
    const newViews = views ? parseInt(views) + 1 : 1;
    localStorage.setItem('portfolio_views', newViews.toString());
    
    console.log(`Portfolio viewed ${newViews} times`);
  }, []);

  return null;
}

// Simple analytics component that tracks basic interactions
export function SimpleAnalytics() {
  useEffect(() => {
    // Track page load
    console.log('Portfolio loaded at:', new Date().toISOString());
    
    // Track button clicks
    const trackClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const text = target.textContent || target.getAttribute('href') || 'unknown';
      console.log(`Clicked: ${text} at ${new Date().toISOString()}`);
    };

    // Add click listeners to important elements
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach(button => {
      button.addEventListener('click', trackClick);
    });

    return () => {
      // Cleanup listeners
      buttons.forEach(button => {
        button.removeEventListener('click', trackClick);
      });
    };
  }, []);

  return null;
}

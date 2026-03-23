# CV Builder App

An AI-powered CV generator that builds a tailored resume in <5 minutes based on your X (Twitter) profile and a target company's job requirements. Built with Next.js 14, NextAuth.js, and Groq AI.

## Quick Start

1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env.local` and add your API keys:
   - **Groq API Key**: Get it free from [console.groq.com](https://console.groq.com)
   - **X API Keys**: Get OAuth 2.0 & Bearer credentials from [developer.twitter.com](https://developer.twitter.com)
   - **NextAuth Secret**: Run `openssl rand -base64 32` or add any random string
4. Run `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Features
- **X Profile Analysis**: Reads your posts/bio to extract skills and strengths
- **Company Intelligence**: Analyzes a target company's X account to understand hiring needs
- **AI Skill Matching**: Uses Groq (`llama-3.3-70b-versatile`) to write tailored CV copy
- **PDF Export**: Generate a beautiful, print-ready PDF CV instantly
- **Manual Overrides**: Fallbacks for users who prefer to type their skills and job description manually without using X.

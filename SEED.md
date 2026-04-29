# Database Seeding Guide

## Overview
The seed script populates the MongoDB database with initial course data. This is useful for development, testing, and fresh deployments.

## Files Created/Modified

### 1. **scripts/seed.ts**
- Contains all course seed data (6 complete courses)
- Connects to MongoDB using the DATABASE_URI
- Clears existing courses before inserting new ones
- Provides detailed console output for each step

### 2. **package.json**
- Added `"seed": "tsx scripts/seed.ts"` script

## Course Data Included

The seed includes 6 courses:
1. **Python Programming: Basic to Advanced** - Software Engineering, Beginner
2. **AI: DSML & Deep Learning Engineer** - AI & Data Science, Advanced
3. **Generative & Agentic AI Engineer** - AI & Data Science, Advanced
4. **MERN Stack: Full-Stack Web Development** - Software Engineering, Intermediate
5. **Digital Marketing Mastery** - Digital Marketing, Beginner
6. **UI/UX Designing** - Creative Design, Beginner

Each course includes:
- Title, slug, category, description
- Level (Beginner/Intermediate/Advanced), duration
- Curriculum modules with topics
- Instructor information
- Features list
- Thumbnail path

## How to Use

### 1. **Install Dependencies**
```bash
npm install
```
Make sure you have `tsx` installed (usually included with Next.js projects).

### 2. **Set Environment Variable**
Ensure your `.env.local` file contains:
```
DATABASE_URI=your_mongodb_connection_string
```

### 3. **Run the Seed**
```bash
npm run seed
```

### Expected Output
```
✅ Connected to MongoDB
🗑️  Cleared existing courses
✅ Seeded 6 courses successfully
   - Python Programming: Basic to Advanced (python-programming-basic-to-advanced)
   - AI: DSML & Deep Learning Engineer (ai-dsml-deep-learning-engineer)
   - Generative & Agentic AI Engineer (generative-agentic-ai-engineer)
   - MERN Stack: Full-Stack Web Development (mern-stack-full-stack-web-development)
   - Digital Marketing Mastery (digital-marketing-mastery)
   - UI/UX Designing (ui-ux-designing)
✅ Disconnected from MongoDB
```

## Integration with CoursesPageClient

The seeded courses are automatically available in:
- **src/app/courses/page.tsx** - Course listing page
- **src/app/courses/CoursesPageClient.tsx** - Course filtering and display

The page fetches courses from the database and displays them with:
- Course cards with thumbnails
- Category filtering
- Search functionality
- Course details

## Database Schema

Courses are stored in MongoDB with the following schema:
```typescript
{
  title: String (required, unique)
  slug: String (required, unique)
  category: String (enum: AI & Data Science, Software Engineering, Creative Design, Digital Marketing, Business Intelligence)
  description: String (required)
  price: Number (default: 0)
  enrollmentFee: Number (default: 0)
  level: String (enum: Beginner, Intermediate, Advanced)
  duration: String
  thumbnail: String
  features: [String]
  curriculum: [{
    title: String,
    topics: [String]
  }]
  instructor: {
    name: String,
    bio: String,
    avatar: String
  }
  isPublished: Boolean (default: true)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## Notes

- The seed script **clears all existing courses** before inserting. Modify if you want to preserve existing data.
- Courses are marked as `isPublished: true` by default.
- Instructor avatars and course thumbnails reference paths in your `public/` folder.
- The script is safe to run multiple times - it will reset the database each time.

## Troubleshooting

### Error: "DATABASE_URI is not defined"
- Check that `.env.local` has the `DATABASE_URI` variable set
- Verify the connection string is correct

### Error: "tsx not found"
- `tsx` should be installed as part of Next.js setup
- If missing, install: `npm install -D tsx`

### Courses not appearing on the page
- Run the seed script: `npm run seed`
- Check MongoDB connection is working
- Verify courses are in the database: `db.courses.find()` in MongoDB CLI

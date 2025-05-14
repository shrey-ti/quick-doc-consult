# Supabase Setup

## Environment Variables
To run this application, you need to set up a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8080
LOG_LEVEL=debug

# Replace these with your actual Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Getting Supabase Credentials
1. Sign up at [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Project Settings > API
4. Copy the URL and anon/public key
5. Add them to your .env file

## Setting up the Database
Use the schema defined in `db-schema.sql` to set up your Supabase database tables. 
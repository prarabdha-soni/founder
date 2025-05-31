export const FREE_SETUP_STEPS = {
  STEP_1_DATABASE: {
    service: "Supabase",
    steps: [
      "1. Go to supabase.com and create free account",
      "2. Create new project (gets PostgreSQL + pgvector automatically)", 
      "3. Copy connection string from Settings > Database",
      "4. Enable pgvector: SQL Editor > Run: CREATE EXTENSION vector;",
      "5. Run your schema.sql file in SQL Editor"
    ],
    free_limits: "500MB storage, unlimited API requests"
  },

  STEP_2_HOSTING: {
    service: "Vercel", 
    steps: [
      "1. Connect GitHub repo to Vercel",
      "2. Set environment variables (OPENAI_API_KEY, DATABASE_URL)", 
      "3. Deploy automatically on git push",
      "4. Get free SSL + CDN"
    ],
    free_limits: "100GB bandwidth, unlimited deployments"
  },

  STEP_3_VECTOR_SEARCH: {
    service: "pgvector in Supabase",
    steps: [
      "1. Already included in Supabase PostgreSQL",
      "2. Create vector columns: ALTER TABLE conversations ADD COLUMN embedding vector(1536);",
      "3. Create vector index: CREATE INDEX ON conversations USING ivfflat (embedding vector_cosine_ops);",
      "4. No separate ChromaDB server needed!"
    ],
    benefit: "Saves $30-70/month compared to separate vector DB"
  },

  STEP_4_AUTHENTICATION: {
    service: "Supabase Auth",
    steps: [
      "1. Already included in Supabase project",
      "2. Configure providers in Auth > Settings",
      "3. Add RLS policies for multi-tenant security", 
      "4. Use Supabase client for auth in your app"
    ],
    free_limits: "50,000 monthly active users"
  }
}; 
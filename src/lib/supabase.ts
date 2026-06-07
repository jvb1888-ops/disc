import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hexckqodwlvzqvvxthxc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleGNrcW9kd2x2enF2dnh0aHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTA4MjYsImV4cCI6MjA5NjQyNjgyNn0.MMQquU2wWWOqEtfw665_5Z-G-NX_msM9usecYhgw270'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase

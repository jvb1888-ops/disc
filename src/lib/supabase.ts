import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://hexckqodwlvzqvvxthxc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleGNrcW9kd2x2enF2dnh0aHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTA4MjYsImV4cCI6MjA5NjQyNjgyNn0.MMQquU2wWWOqEtfw665_5Z-G-NX_msM9usecYhgw270'
)

export default supabase

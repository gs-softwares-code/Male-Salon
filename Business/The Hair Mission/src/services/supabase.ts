import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://hkvhnrnmosysmsyyyqyg.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdmhucm5tb3N5c21zeXl5cXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3MDcyOTQsImV4cCI6MjExMDI4MzI5NH0.zRdLnKASEMIitORT9d8Q_kllomHUiO9Ac-QO3rM0iHU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

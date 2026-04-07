import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Reading migration file...');
    const migrationPath = join(
      dirname(dirname(fileURLToPath(import.meta.url))),
      'supabase',
      'migrations',
      '20260406000000_create_recurring_transactions.sql'
    );

    const sql = readFileSync(migrationPath, 'utf8');

    console.log('Applying migration to Supabase...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql doesn't exist, we need to run it differently
      console.log('Attempting direct SQL execution...');

      // Split by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        const { error: stmtError } = await supabase.rpc('exec', {
          query: statement
        });

        if (stmtError) {
          console.error('Error executing statement:', stmtError);
          throw stmtError;
        }
      }
    }

    console.log('✓ Migration applied successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    console.log('\nPlease run this SQL manually in the Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
    process.exit(1);
  }
}

runMigration();

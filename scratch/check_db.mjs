import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

// Manually parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length) {
    env[key.trim()] = value.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkColumn() {
  console.log(`Checking profiles table at ${supabaseUrl}...`);
  
  // Try to select the referral_code column
  const { data, error } = await supabase
    .from('profiles')
    .select('referral_code')
    .limit(1);

  if (error) {
    if (error.code === 'PGRST204' || error.message.includes('column "referral_code" does not exist')) {
      console.log('\n❌ COLUMN MISSING: The "referral_code" column does NOT exist in the "profiles" table.');
    } else {
      console.error('\nError checking column:', error.message);
    }
  } else {
    console.log('\n✅ COLUMN EXISTS: The "referral_code" column is present in the "profiles" table.');
  }
}

checkColumn();

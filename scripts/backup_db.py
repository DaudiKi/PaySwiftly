import os
import subprocess
import datetime
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

# Load env from parent dir if running from scripts/
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Configuration
DB_URL = os.getenv("DATABASE_URL")  # Expecting the full postgres:// connection string
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Needs Service Role to write to backups bucket usually

if not DB_URL:
    print("Error: DATABASE_URL is not set.")
    exit(1)

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Supabase credentials not set.")
    exit(1)

def backup_database():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"backup_{timestamp}.sql"
    
    print(f"Starting backup: {filename}")
    
    # 1. Run pg_dump
    # Note: 'pg_dump' must be in the system PATH
    try:
        with open(filename, 'w') as f:
            env = os.environ.copy()
            # pg_dump often needs password in env var if not in connection string
            # But DATABASE_URL usually has it.
            subprocess.run(
                ['pg_dump', DB_URL, '-F', 'p', '-f', filename], 
                check=True, 
                env=env
            )
        print("pg_dump successful.")
    except Exception as e:
        print(f"Error running pg_dump: {e}")
        return

    # 2. Upload to Supabase Storage
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Ensure bucket exists (this might fail if already exists or no permissions, ignore if so)
        # supabase.storage.create_bucket('backups') 
        
        with open(filename, 'rb') as f:
            print("Uploading to Supabase Storage...")
            supabase.storage.from_('backups').upload(
                path=filename,
                file=f,
                file_options={"content-type": "application/sql"}
            )
        print(f"Backup uploaded successfully: {filename}")
        
        # 3. Cleanup local file
        os.remove(filename)
        print("Local backup file cleaned up.")
        
    except Exception as e:
        print(f"Error uploading backup: {e}")

if __name__ == "__main__":
    backup_database()

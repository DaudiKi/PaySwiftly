import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables explicitly from the root .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Supabase credentials not found in environment variables.")
    exit(1)

supabase: Client = create_client(url, key)

def get_driver_by_phone(phone_number: str):
    try:
        response = supabase.table("drivers").select("*").eq("phone", phone_number).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Error querying Supabase: {e}")
        return None

if __name__ == "__main__":
    PHONE = "254740915456"
    print(f"Searching for driver with phone: {PHONE}...")
    driver = get_driver_by_phone(PHONE)
    
    if driver:
        print(f"\nFOUND DRIVER!")
        print(f"Name: {driver.get('name')}")
        print(f"Driver ID: {driver.get('id')}")
        print(f"Email: {driver.get('email')}")
    else:
        print("\nDriver not found.")

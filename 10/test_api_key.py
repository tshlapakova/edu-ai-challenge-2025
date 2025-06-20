#!/usr/bin/env python3
"""
Simple script to test OpenAI API key validity
"""

import getpass
from openai import OpenAI

def test_api_key():
    print("🔑 Testing OpenAI API Key")
    print("=" * 40)
    
    try:
        # Get API key from user
        api_key = getpass.getpass("Enter your OpenAI API key: ")
        
        if not api_key.strip():
            print("❌ Error: Empty API key")
            return False
            
        # Check API key format
        if not api_key.startswith('sk-'):
            print("❌ Error: API key should start with 'sk-'")
            print("   Example format: sk-1234567890abcdef...")
            return False
            
        if len(api_key) < 40:
            print("❌ Error: API key seems too short")
            print("   OpenAI API keys are usually 51+ characters long")
            return False
            
        print("✅ API key format looks correct")
        print("🧪 Testing API connection...")
        
        # Create OpenAI client
        client = OpenAI(api_key=api_key)
        
        # Test with a minimal API call
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "user", "content": "Say 'Hello'"}
            ],
            max_tokens=5,
            temperature=0
        )
        
        print("✅ API key is valid!")
        print("✅ Your account has credits available!")
        print("✅ Connection successful!")
        print(f"   Response: {response.choices[0].message.content}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\n🔧 Troubleshooting steps:")
        print("1. Check if your API key is correct (starts with sk-)")
        print("2. Verify your OpenAI account has credits")
        print("3. Check your internet connection")
        print("4. Visit https://platform.openai.com/account/billing to check credits")
        print("5. Visit https://platform.openai.com/api-keys to verify your key")
        return False

if __name__ == "__main__":
    test_api_key()
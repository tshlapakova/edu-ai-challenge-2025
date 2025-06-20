#!/usr/bin/env python3
"""
Console-based Product Search Tool
Uses OpenAI function calling to filter products based on natural language preferences.
"""

import json
import os
import sys
from typing import List, Dict, Any
from openai import OpenAI
import getpass

def load_products(file_path: str) -> List[Dict[str, Any]]:
    """Load products from JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            products = json.load(file)
        return products
    except FileNotFoundError:
        print(f"Error: Could not find products file at {file_path}")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in {file_path}")
        sys.exit(1)

def get_openai_client() -> OpenAI:
    """Get OpenAI client with API key from user input."""
    api_key = getpass.getpass("Please enter your OpenAI API key: ")
    if not api_key.strip():
        print("Error: API key is required")
        sys.exit(1)
    
    return OpenAI(api_key=api_key)

def filter_products_function_schema():
    """Define the function schema for OpenAI function calling."""
    return {
        "name": "filter_products",
        "description": "Filter products based on user preferences like category, price range, rating, and stock status",
        "parameters": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "description": "Product category (Electronics, Fitness, Kitchen, Books, Clothing)",
                    "enum": ["Electronics", "Fitness", "Kitchen", "Books", "Clothing"]
                },
                "max_price": {
                    "type": "number",
                    "description": "Maximum price filter"
                },
                "min_price": {
                    "type": "number",
                    "description": "Minimum price filter"
                },
                "min_rating": {
                    "type": "number",
                    "description": "Minimum rating filter (0-5)"
                },
                "in_stock_only": {
                    "type": "boolean",
                    "description": "Filter for only in-stock products"
                },
                "keywords": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Keywords to search in product names"
                }
            },
            "required": []
        }
    }

def filter_products(products: List[Dict[str, Any]], filters: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Filter products based on the criteria extracted by OpenAI."""
    filtered = products.copy()
    
    # Filter by category
    if filters.get("category"):
        filtered = [p for p in filtered if p["category"] == filters["category"]]
    
    # Filter by price range
    if filters.get("max_price") is not None:
        filtered = [p for p in filtered if p["price"] <= filters["max_price"]]
    
    if filters.get("min_price") is not None:
        filtered = [p for p in filtered if p["price"] >= filters["min_price"]]
    
    # Filter by minimum rating
    if filters.get("min_rating") is not None:
        filtered = [p for p in filtered if p["rating"] >= filters["min_rating"]]
    
    # Filter by stock status
    if filters.get("in_stock_only"):
        filtered = [p for p in filtered if p["in_stock"]]
    
    # Filter by keywords in product name
    if filters.get("keywords"):
        keywords = [kw.lower() for kw in filters["keywords"]]
        filtered = [p for p in filtered if any(kw in p["name"].lower() for kw in keywords)]
    
    return filtered

def display_results(products: List[Dict[str, Any]]):
    """Display filtered products in structured format."""
    if not products:
        print("\nNo products found matching your criteria.")
        return
    
    print(f"\nFiltered Products:")
    print("-" * 50)
    
    for i, product in enumerate(products, 1):
        stock_status = "In Stock" if product["in_stock"] else "Out of Stock"
        print(f"{i}. {product['name']} - ${product['price']:.2f}, Rating: {product['rating']}, {stock_status}")

def main():
    """Main application loop."""
    print("=" * 60)
    print("🔍 Product Search Tool")
    print("=" * 60)
    print("Search for products using natural language!")
    print("Example: 'I need a smartphone under $800 with good rating'")
    print("=" * 60)
    
    # Load products
    products_file = "products.json"
    if not os.path.exists(products_file):
        print(f"Error: {products_file} not found in current directory")
        sys.exit(1)
    
    products = load_products(products_file)
    print(f"Loaded {len(products)} products from database.")
    
    # Get OpenAI client
    client = get_openai_client()
    
    while True:
        print("\n" + "-" * 60)
        user_query = input("Enter your product preferences (or 'quit' to exit): ").strip()
        
        if user_query.lower() in ['quit', 'exit', 'q']:
            print("Thank you for using Product Search Tool!")
            break
        
        if not user_query:
            print("Please enter your preferences.")
            continue
        
        print("\n🤖 Processing your request...")
        
        try:
            # Create the system message with product context
            system_message = f"""You are a product search assistant. You have access to {len(products)} products across categories: Electronics, Fitness, Kitchen, Books, and Clothing.

Each product has: name, category, price, rating (0-5), and in_stock status.

Based on the user's natural language query, extract the relevant filtering criteria and call the filter_products function with appropriate parameters.

Available categories: Electronics, Fitness, Kitchen, Books, Clothing

Be intelligent about interpreting natural language:
- "cheap" or "affordable" might mean max_price around 50
- "expensive" or "premium" might mean min_price around 200
- "good rating" might mean min_rating of 4.0
- "great" or "excellent" rating might mean min_rating of 4.5
- "smartphone", "phone" should look for keywords like ["smartphone", "phone"]
- "laptop", "computer" should look for keywords like ["laptop", "computer"]
- etc.
"""
            
            # Make API call with function calling
            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_query}
                ],
                functions=[filter_products_function_schema()],
                function_call={"name": "filter_products"}
            )
            
            # Extract function call arguments
            if response.choices[0].message.function_call:
                function_args = json.loads(response.choices[0].message.function_call.arguments)
                print(f"🔍 Extracted filters: {function_args}")
                
                # Filter products using the extracted criteria
                filtered_products = filter_products(products, function_args)
                
                # Display results
                display_results(filtered_products)
            else:
                print("❌ Could not extract search criteria from your query. Please try rephrasing.")
                print("Example: 'I want electronics under $100 with good rating'")
        
        except Exception as e:
            print(f"❌ Error processing request: {str(e)}")
            print("Please check your API key and try again.")

if __name__ == "__main__":
    main()
# Product Search Tool

A console-based product search tool that uses OpenAI's function calling to filter products based on natural language preferences.

## Features

- **Natural Language Processing**: Use natural language to describe what you're looking for
- **OpenAI Function Calling**: Leverages OpenAI's function calling to intelligently extract search criteria
- **Multiple Filters**: Supports filtering by category, price range, rating, stock status, and keywords
- **Interactive Console**: Easy-to-use command-line interface

## Prerequisites

Before running the application, ensure you have:

1. **Python 3.7 or higher** installed on your system
   - Check version: `python --version`
   - Download from: https://www.python.org/downloads/

2. **OpenAI API Key**
   - Sign up at: https://platform.openai.com/
   - Navigate to API Keys section
   - Create a new API key
   - Keep it secure - you'll need it when running the application

3. **Command Line Access**
   - Windows: Command Prompt or PowerShell
   - macOS/Linux: Terminal

## Installation Guide

### Step 1: Navigate to the Project Directory

Open your command line and navigate to the project folder:

```bash
# Windows
cd D:\edu-ai-challenge-2025\10

# macOS/Linux (adjust path as needed)
cd /path/to/edu-ai-challenge-2025/10
```

### Step 2: Verify Required Files

Ensure all required files are present:
- `product_search.py` (main application)
- `products.json` (product database)
- `requirements.txt` (dependencies)

```bash
# List files to verify
dir          # Windows
ls -la       # macOS/Linux
```

### Step 3: Install Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

**If you encounter issues:**
- Try using `pip3` instead of `pip`
- On some systems, use `python -m pip install -r requirements.txt`
- If permission errors occur, try `pip install --user -r requirements.txt`

### Step 4: Verify Installation

Test if dependencies are installed correctly:

```bash
python -c "from openai import OpenAI; print('Installation successful!')"
```

## Detailed Usage Instructions

### Starting the Application

1. **Launch the application:**
   ```bash
   python product_search.py
   ```

2. **You should see the welcome screen:**
   ```
   ============================================================
   🔍 Product Search Tool
   ============================================================
   Search for products using natural language!
   Example: 'I need a smartphone under $800 with good rating'
   ============================================================
   Loaded 50 products from database.
   ```

3. **Enter your OpenAI API key:**
   - The application will prompt: `Please enter your OpenAI API key:`
   - Type or paste your API key (characters won't be visible for security)
   - Press Enter

### Making Search Queries

4. **Enter your search preferences:**
   - The application will show: `Enter your product preferences (or 'quit' to exit):`
   - Type your request in natural language
   - Press Enter

### Example Search Sessions

#### Example 1: Basic Price and Category Search
```
Enter your product preferences (or 'quit' to exit): I want electronics under $100

🤖 Processing your request...
🔍 Extracted filters: {"category": "Electronics", "max_price": 100}

Filtered Products:
--------------------------------------------------
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Bluetooth Speaker - $49.99, Rating: 4.4, In Stock
3. Gaming Mouse - $59.99, Rating: 4.3, In Stock
4. External Hard Drive - $89.99, Rating: 4.4, In Stock
5. Portable Charger - $29.99, Rating: 4.2, In Stock
```

#### Example 2: Rating and Stock Filter
```
Enter your product preferences (or 'quit' to exit): Show me fitness equipment with excellent ratings that's in stock

🤖 Processing your request...
🔍 Extracted filters: {"category": "Fitness", "min_rating": 4.5, "in_stock_only": true}

Filtered Products:
--------------------------------------------------
1. Dumbbell Set - $149.99, Rating: 4.7, In Stock
2. Exercise Bike - $499.99, Rating: 4.5, In Stock
3. Foam Roller - $24.99, Rating: 4.5, In Stock
```

#### Example 3: Keyword Search
```
Enter your product preferences (or 'quit' to exit): I need a smartphone under $800

🤖 Processing your request...
🔍 Extracted filters: {"keywords": ["smartphone"], "max_price": 800}

Filtered Products:
--------------------------------------------------
1. Smartphone - $799.99, Rating: 4.5, Out of Stock
```

### Exiting the Application

To exit the application, type any of the following:
- `quit`
- `exit`
- `q`

The application will display: `Thank you for using Product Search Tool!`

## Available Product Categories

The application searches through 50 products across the following categories:

- **Electronics** (10 products): Wireless Headphones, Gaming Laptop, Smart Watch, Bluetooth Speaker, 4K Monitor, Smartphone, Noise-Cancelling Headphones, Gaming Mouse, External Hard Drive, Portable Charger
- **Fitness** (10 products): Yoga Mat, Treadmill, Dumbbell Set, Exercise Bike, Resistance Bands, Kettlebell, Foam Roller, Pull-up Bar, Jump Rope, Ab Roller
- **Kitchen** (10 products): Blender, Air Fryer, Microwave Oven, Coffee Maker, Toaster, Electric Kettle, Rice Cooker, Pressure Cooker, Dishwasher, Refrigerator
- **Books** (10 products): Novel: The Great Adventure, Programming Guide, Cookbook: Easy Recipes, History of Science, Self-Help Guide, Fantasy Novel, Biography: An Inspiring Life, Mystery Novel, Children's Picture Book, Science Fiction Novel
- **Clothing** (10 products): Men's T-Shirt, Women's Dress, Men's Jeans, Women's Jacket, Men's Shoes, Women's Sandals, Men's Hoodie, Women's Scarf, Men's Socks, Women's Hat

## Natural Language Query Examples

### By Category
- "Show me all electronics"
- "I need fitness equipment"
- "Find kitchen appliances"
- "I want to buy some books"
- "Show me clothing items"

### By Price Range
- "I want something under $50"
- "Show me expensive items over $500"
- "Find products between $100 and $300"
- "I need affordable options under $25"

### By Rating
- "Show me highly rated products"
- "I want items with excellent reviews"
- "Find products with rating above 4.5"
- "Show me good quality items"

### By Stock Status
- "Show me only in-stock items"
- "I need products available now"
- "What's available for immediate purchase"

### Complex Queries
- "I need affordable electronics under $100 with good ratings that are in stock"
- "Show me premium fitness equipment over $200 with excellent reviews"
- "Find kitchen appliances under $150 that are highly rated and available"
- "I want books about programming or science that are affordable"

## Troubleshooting

### Common Issues and Solutions

#### 1. "ModuleNotFoundError: No module named 'openai'"
**Problem:** OpenAI package not installed
**Solution:**
```bash
pip install openai
# or
pip install -r requirements.txt
```

#### 2. "Error: Could not find products file"
**Problem:** Running from wrong directory or products.json missing
**Solution:**
- Ensure you're in the correct directory: `cd D:\edu-ai-challenge-2025\10`
- Verify products.json exists: `ls products.json` (macOS/Linux) or `dir products.json` (Windows)

#### 3. "Error: API key is required"
**Problem:** Empty or invalid API key
**Solution:**
- Ensure you have a valid OpenAI API key
- Copy the key carefully (no extra spaces)
- Verify your OpenAI account has credits

#### 4. API Connection Errors
**Problem:** Network or API issues
**Solution:**
- Check your internet connection
- Verify your API key is still valid
- Check OpenAI service status: https://status.openai.com/

#### 5. "Could not extract search criteria"
**Problem:** Query too vague or unclear
**Solution:**
- Be more specific in your request
- Use examples provided in this guide
- Include specific criteria (price, category, rating)

### Getting Help

If you continue to experience issues:
1. Verify all prerequisites are met
2. Check that all files are in the correct location
3. Ensure your OpenAI API key is valid and has credits
4. Try the example queries provided above

## How It Works

1. **Input Processing**: The tool accepts natural language input from the user
2. **AI Analysis**: OpenAI's gpt-4.1-mini model analyzes the input and extracts filtering criteria
3. **Function Calling**: The extracted criteria are passed to a filtering function using OpenAI's function calling feature
4. **Product Filtering**: Products are filtered based on the AI-extracted criteria (no manual filtering logic)
5. **Results Display**: Matching products are displayed in a structured format

## Technical Details

- **Model Used**: gpt-4.1-mini with function calling
- **Function Schema**: Supports category, max_price, min_price, min_rating, in_stock_only, and keywords filters
- **Security**: API key is requested each time and not stored in code
- **Data Source**: Local products.json file with 50 sample products
- **Output Format**: Structured list with product name, price, rating, and stock status

## Important Notes

- **Security**: The application prompts for your OpenAI API key each time for security reasons
- **No Manual Filtering**: All filtering is done through OpenAI function calling as required
- **Data Source**: The tool uses the products.json file as its product database
- **Exit Commands**: Type 'quit', 'exit', or 'q' to exit the application
- **API Costs**: Each query uses OpenAI API credits (typically very small cost per query)
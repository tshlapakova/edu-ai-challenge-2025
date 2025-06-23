# Sample Outputs - Product Search Tool

This document shows sample outputs from running the Product Search Tool with various natural language queries.

## Application Startup

```
============================================================
🔍 Product Search Tool
============================================================
Search for products using natural language!
Example: 'I need a smartphone under $800 with good rating'
============================================================
Loaded 50 products from database.
Please enter your OpenAI API key: [HIDDEN]
```

## Sample Search Sessions

### Session 1: Electronics Under $100

```
------------------------------------------------------------
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

### Session 2: Specific Product Search - Smartphone

```
------------------------------------------------------------
Enter your product preferences (or 'quit' to exit): I want a smartphone

🤖 Processing your request...
🔍 Extracted filters: {"keywords": ["smartphone"]}

Filtered Products:
--------------------------------------------------
1. Smartphone - $799.99, Rating: 4.5, Out of Stock
```

### Session 3: Laptop Search  

```
------------------------------------------------------------
Enter your product preferences (or 'quit' to exit): I need a laptop under $3000

🤖 Processing your request...
🔍 Extracted filters: {"keywords": ["laptop"], "max_price": 3000}

Filtered Products:
--------------------------------------------------
1. Gaming Laptop - $1299.99, Rating: 4.8, Out of Stock
```

### Session 4: Headphones Search (Accurate Results)

```
------------------------------------------------------------
Enter your product preferences (or 'quit' to exit): Show me headphones

🤖 Processing your request...
🔍 Extracted filters: {"keywords": ["headphones"]}

Filtered Products:
--------------------------------------------------
1. Wireless Headphones - $99.99, Rating: 4.5, In Stock
2. Noise-Cancelling Headphones - $299.99, Rating: 4.8, In Stock
```
#!/usr/bin/env python3
"""
Service Analyzer Console Application
Generates comprehensive markdown reports for services/products from multiple perspectives.
"""

import sys
import os
from openai import OpenAI
import getpass

def get_openai_client():
    """Get OpenAI client with user-provided API key."""
    print("🔑 OpenAI API Key Required")
    print("Please enter your OpenAI API key (input will be hidden):")
    api_key = getpass.getpass("API Key: ")
    
    if not api_key.strip():
        print("❌ Error: API key cannot be empty")
        return None
    
    try:
        client = OpenAI(api_key=api_key)
        # Test the API key with a simple request
        client.models.list()
        print("✅ API key validated successfully")
        return client
    except Exception as e:
        print(f"❌ Error: Invalid API key or connection failed: {str(e)}")
        return None

def create_analysis_prompt(input_text, is_service_name=False):
    """Create the prompt for AI analysis."""
    
    if is_service_name:
        base_prompt = f"""
You are tasked with creating a comprehensive analysis of the service/product: "{input_text}".

Based on your knowledge of this service/product, generate a detailed markdown report covering all the specified sections.
"""
    else:
        base_prompt = f"""
You are tasked with analyzing the following service/product description and creating a comprehensive report:

INPUT TEXT:
{input_text}

Based on this description and any additional knowledge you may have about this service/product, generate a detailed markdown report covering all the specified sections.
"""
    
    analysis_requirements = """
Please create a comprehensive markdown-formatted analysis report that includes the following sections:

## Brief History
- Founding year and key milestones
- Important events in the company's development
- Evolution of the service/product

## Target Audience
- Primary user segments
- Demographics and characteristics of typical users
- Market positioning

## Core Features
- Top 2-4 key functionalities
- Main capabilities that define the service
- Primary use cases

## Unique Selling Points
- Key differentiators from competitors
- What makes this service/product stand out
- Competitive advantages

## Business Model
- How the service makes money
- Revenue streams
- Pricing strategy (if known)

## Tech Stack Insights
- Technologies likely used or known to be used
- Technical architecture hints
- Platform and infrastructure details

## Perceived Strengths
- Mentioned positives or standout features
- User-praised aspects
- Market advantages

## Perceived Weaknesses
- Cited drawbacks or limitations
- Common user complaints or concerns
- Areas for improvement

Please ensure each section is well-detailed and informative. Use markdown formatting with proper headers, bullet points, and emphasis where appropriate. If specific information is not available, make reasonable inferences based on industry standards and similar services, but clearly indicate when you're making educated assumptions.
"""
    
    return base_prompt + analysis_requirements

def generate_report(client, input_text, is_service_name=False):
    """Generate the comprehensive report using OpenAI."""
    print("🤖 Generating comprehensive analysis report...")
    print("⏳ This may take a moment...")
    
    try:
        prompt = create_analysis_prompt(input_text, is_service_name)
        
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are an expert business and technology analyst. You provide comprehensive, accurate, and well-structured reports about services and products."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2500,
            temperature=0.7
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"❌ Error generating report: {str(e)}")
        return None

def save_report_to_file(report, filename):
    """Save the report to a markdown file."""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"📁 Report saved to: {filename}")
        return True
    except Exception as e:
        print(f"❌ Error saving report: {str(e)}")
        return False

def determine_input_type(user_input):
    """Determine if input is likely a service name or description text."""
    # Simple heuristic: if input is short and doesn't contain common description words, treat as service name
    description_indicators = ['provides', 'offers', 'allows', 'enables', 'helps', 'service', 'platform', 'solution', 'company', 'we', 'our']
    
    word_count = len(user_input.split())
    has_description_words = any(word.lower() in user_input.lower() for word in description_indicators)
    
    # If it's short (1-3 words) and doesn't have description indicators, likely a service name
    if word_count <= 3 and not has_description_words:
        return True  # Service name
    
    # If it has description words or is longer, likely a description
    return False  # Description text

def main():
    """Main application function."""
    print("=" * 60)
    print("🔍 SERVICE ANALYZER - Comprehensive Report Generator")
    print("=" * 60)
    print()
    print("This application generates detailed markdown reports for services/products")
    print("from business, technical, and user perspectives.")
    print()
    
    # Get OpenAI client
    client = get_openai_client()
    if not client:
        print("Exiting due to API key issues.")
        return
    
    print()
    print("📝 INPUT OPTIONS:")
    print("1. Enter a known service name (e.g., 'Spotify', 'Notion', 'Netflix')")
    print("2. Paste service/product description text")
    print()
    
    # Get user input
    print("Please enter your input:")
    user_input = input("> ").strip()
    
    if not user_input:
        print("❌ Error: Input cannot be empty")
        return
    
    # Determine input type
    is_service_name = determine_input_type(user_input)
    
    if is_service_name:
        print(f"🏷️  Detected as service name: '{user_input}'")
    else:
        print("📋 Detected as service description text")
    
    print()
    
    # Generate report
    report = generate_report(client, user_input, is_service_name)
    
    if not report:
        print("Failed to generate report.")
        return
    
    print()
    print("=" * 60)
    print("📊 GENERATED REPORT")
    print("=" * 60)
    print()
    print(report)
    print()
    print("=" * 60)
    
    # Ask if user wants to save to file
    save_choice = input("\n💾 Would you like to save this report to a file? (y/n): ").strip().lower()
    
    if save_choice in ['y', 'yes']:
        # Generate filename based on input
        if is_service_name:
            filename = f"{user_input.replace(' ', '_').lower()}_analysis_report.md"
        else:
            filename = "service_analysis_report.md"
        
        save_report_to_file(report, filename)
    
    print()
    print("✅ Analysis complete! Thank you for using Service Analyzer.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Application interrupted by user. Goodbye!")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        sys.exit(1) 
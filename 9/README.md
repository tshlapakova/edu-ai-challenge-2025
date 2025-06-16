# Service Analyzer - Comprehensive Report Generator

A lightweight console application that generates detailed markdown reports for services and products from multiple perspectives including business, technical, and user-focused viewpoints.

## 🚀 Quick Start

### Prerequisites
- **Python 3.7 or higher** installed on your system
- **OpenAI API key** with access to GPT models
- **Internet connection** for API calls

### Installation & Setup

1. **Verify Python Installation**
   ```bash
   python --version
   ```
   If Python is not installed, download it from [python.org](https://www.python.org/downloads/)

2. **Navigate to Application Directory**
   ```bash
   cd path/to/your/9/folder
   ```

3. **Install Required Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   This will install the OpenAI Python library.

4. **Get Your OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Sign in or create an account
   - Navigate to "API Keys" section
   - Click "Create new secret key"
   - Copy the generated key (starts with `sk-`)

## 🔧 How to Run the Application

### Step 1: Start the Application
```bash
python main.py
```

### Step 2: Enter API Key
- The application will prompt: `🔑 OpenAI API Key Required`
- Enter your OpenAI API key (input will be hidden for security)
- If valid, you'll see: `✅ API key validated successfully`

### Step 3: Choose Input Type
The application accepts two types of input:

**Option 1: Service Name**
- Enter a known service name like:
  - `Spotify`
  - `Netflix`
  - `Notion`
  - `GitHub`
  - `Slack`

**Option 2: Service Description**
- Paste detailed text describing a service or product
- Can be from "About Us" pages, product descriptions, etc.

### Step 4: View & Save Report
- The application will generate a comprehensive report
- Review the report in your terminal
- Choose whether to save it as a markdown file

## 📝 Example Usage Sessions

### Example 1: Analyzing Spotify
```
🔍 SERVICE ANALYZER - Comprehensive Report Generator
============================================================

🔑 OpenAI API Key Required
Please enter your OpenAI API key (input will be hidden):
API Key: ************************
✅ API key validated successfully

📝 INPUT OPTIONS:
1. Enter a known service name (e.g., 'Spotify', 'Notion', 'Netflix')
2. Paste service/product description text

Please enter your input:
> Spotify

🏷️ Detected as service name: 'Spotify'

🤖 Generating comprehensive analysis report...
⏳ This may take a moment...

============================================================
📊 GENERATED REPORT
============================================================

# Spotify Analysis Report

## Brief History
- Founded in 2006 by Daniel Ek and Martin Lorentzon in Stockholm, Sweden
- Launched publicly in 2008 in Europe
- Expanded to the US in 2011
[... detailed report continues ...]

============================================================

💾 Would you like to save this report to a file? (y/n): y
📁 Report saved to: spotify_analysis_report.md

✅ Analysis complete! Thank you for using Service Analyzer.
```

### Example 2: Analyzing Custom Service Description
```
Please enter your input:
> Our platform provides AI-powered customer service automation that helps businesses reduce response times by 80% while maintaining high satisfaction scores. We integrate with popular CRM systems and offer real-time analytics.

📋 Detected as service description text

🤖 Generating comprehensive analysis report...
⏳ This may take a moment...

[Generated report based on the description]

💾 Would you like to save this report to a file? (y/n): n

✅ Analysis complete! Thank you for using Service Analyzer.
```

## 📊 Report Structure

Every generated report includes these 8 comprehensive sections:

1. **Brief History** - Founding year, milestones, evolution
2. **Target Audience** - User segments, demographics, market positioning  
3. **Core Features** - Top 2-4 key functionalities
4. **Unique Selling Points** - Competitive differentiators and advantages
5. **Business Model** - Revenue streams and pricing strategy
6. **Tech Stack Insights** - Technologies used, architecture details
7. **Perceived Strengths** - Standout features and market advantages
8. **Perceived Weaknesses** - Limitations and improvement areas

## 🔧 Features

- ✅ **Dual Input Support**: Service names OR detailed descriptions
- ✅ **Intelligent Detection**: Automatically determines input type
- ✅ **Comprehensive Analysis**: 8-section detailed reports
- ✅ **Secure API Handling**: Hidden key input for security
- ✅ **File Export**: Optional markdown file saving
- ✅ **Error Handling**: Robust error management and user feedback
- ✅ **Modern UI**: Clean terminal interface with emojis and formatting

## 🛠️ Troubleshooting

### Common Issues & Solutions

**❌ "Invalid API key or connection failed"**
- Verify your API key is correct (starts with `sk-`)
- Check your internet connection
- Ensure your OpenAI account has sufficient credits
- Verify API key has access to GPT models

**❌ "Python not found" or "python: command not found"**
- Install Python from [python.org](https://www.python.org/downloads/)
- Make sure Python is added to your system PATH
- Try using `python3` instead of `python`

**❌ "No module named 'openai'"**
- Run: `pip install -r requirements.txt`
- If pip is not found, install it or use: `python -m pip install -r requirements.txt`

**❌ Application hangs during report generation**
- This is normal for comprehensive reports (can take 30-60 seconds)
- Wait for the API response
- Check your internet connection

**❌ "Error saving report"**
- Check if you have write permissions in the current directory
- Ensure the filename doesn't contain invalid characters
- Try running as administrator (Windows) or with sudo (Mac/Linux)

### Performance Tips
- Reports typically take 30-60 seconds to generate
- Longer/more detailed input may take additional time
- Ensure stable internet connection for best results

## 📋 Requirements

- **Python**: 3.7 or higher
- **Dependencies**: OpenAI Python library (≥1.0.0)
- **API Access**: Valid OpenAI API key with GPT model access
- **System**: Windows, macOS, or Linux
- **Internet**: Required for API calls

## 📁 File Structure

```
9/
├── main.py           # Main application file
├── requirements.txt  # Python dependencies
└── README.md        # This documentation
```

## 🔒 Security Notes

- API keys are never stored or logged
- Input is hidden when entering API key
- No sensitive data is cached
- All API communications use HTTPS

## 💡 Tips for Best Results

1. **For Service Names**: Use well-known services for more accurate analysis
2. **For Descriptions**: Provide detailed, comprehensive text (200+ words ideal)
3. **API Key**: Ensure your OpenAI account has sufficient credits
4. **File Saving**: Choose descriptive filenames when saving reports
5. **Multiple Runs**: You can analyze different services in the same session

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all requirements are met
3. Ensure your API key is valid and has credits
4. Check your internet connection

---

**Ready to analyze services?** Run `python main.py` to get started! 🚀 
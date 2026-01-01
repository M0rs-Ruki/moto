# Bulk Upload Instructions for Digital Enquiry / Field Inquiry

## How to Use the Sample File

1. **Open the CSV file** in Excel or Google Sheets
2. **Replace `REPLACE_WITH_YOUR_MODEL_NAME`** with your actual vehicle model names
3. **Save as Excel format** (.xlsx) if needed
4. **Upload** via the Bulk Upload feature

## Finding Your Model Names

### Option 1: From Global Settings
1. Go to **Dashboard → Global Settings**
2. Click on **Categories & Models** tab
3. Look at the models listed under each category
4. Copy the **exact Model name** (not the Category name)

### Option 2: From Digital Enquiry Page
1. Go to **Dashboard → Digital Enquiry**
2. Click **Create Inquiry**
3. Look at the **Model to be Delivered** section
4. See the model names listed there

## Important Notes

- **Model names must match EXACTLY** (case-insensitive but spelling must match)
- Use only the **Model name**, not the Category name
- Example: If you have Category "Car" with Model "Sedan 2024", use **"Sedan 2024"** in the CSV
- If a model name doesn't match, that row will be skipped with an error

## CSV Column Requirements

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| Date | Yes | Date of enquiry | 2025-01-15 |
| Name | Yes | Full name (will be split: first word = firstName, rest = lastName) | John Doe |
| WhatsApp Number | Yes | Phone number | 1234567890 |
| Location | No | Address/location | New York |
| Model | Yes | **Vehicle Model name (must exist in database)** | Sedan 2024 |
| Source | No | Lead source name (uses default if not found) | Instagram |

## Example with Real Data

If your models are:
- "City 2024"
- "Fortuner 2024"  
- "Civic 2025"

Your CSV should look like:
```csv
Date,Name,WhatsApp Number,Location,Model,Source
2025-01-15,John Doe,1234567890,New York,City 2024,Instagram
2025-01-16,Jane Smith,9876543210,Los Angeles,Fortuner 2024,Facebook
2025-01-17,Robert Johnson,5551234567,Chicago,Civic 2025,Website
```

## Troubleshooting

**Error: "Model 'X' not found"**
- Check the model name spelling
- Make sure you're using the Model name, not Category name
- Go to Global Settings to see all available models

**All rows failed**
- Check that you have at least one model created in Global Settings
- Verify the Model column has the correct names


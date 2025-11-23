# Batch Import Guide

## Overview

The batch import feature allows you to create multiple customized presentations at once by uploading a CSV file with contact information. This is perfect for sending presentations to many recipients efficiently.

## How to Use

### Step 1: Prepare Your CSV File

Create a CSV file with the following columns:

- **name** (required) - The recipient's name
- **email** (optional) - The recipient's email address
- **store link** (optional) - A custom store/product link for this recipient

#### Example CSV:

```csv
name,email,store link
John Doe,john@example.com,https://store.com/john
Jane Smith,jane@example.com,https://store.com/jane
Bob Johnson,bob@example.com,https://store.com/bob
Alice Williams,alice@example.com,
```

**Note:** Column names are case-insensitive and can be:
- `name`, `nombre`, `recipient name`, `recipient_name`
- `email`, `correo`, `recipient email`, `recipient_email`
- `store link`, `store_link`, `link`, `url`

### Step 2: Access Batch Import

1. Log in to your dashboard
2. Click the **"📥 Batch Import Contacts"** button at the top of the "Create New Presentation" section
3. The batch import form will appear

### Step 3: Upload and Preview

1. Click "Choose File" and select your CSV file
2. The system will parse and validate your contacts
3. Review the preview table:
   - Valid contacts show a green checkmark
   - Invalid contacts show errors (e.g., missing name, invalid email)
4. Select a template from the dropdown
5. Optionally set a default store link (used if a contact doesn't have one)

### Step 4: Import

1. Click **"Import X Contacts"** button
2. The system will create a presentation instance for each contact
3. Wait for processing to complete (this may take a moment for large batches)

### Step 5: Review Results

After import completes, you'll see:
- **Successful imports** - List of all created presentations with share links
- **Failed imports** - List of contacts that couldn't be processed with error messages
- **Download Results CSV** - Download a CSV with all results including share links

## Features

### ✅ What Gets Created

For each contact, the system creates:
- A presentation record in the database
- A presentation instance with:
  - Unique share token
  - Recipient name (replaces `{{recipientName}}` in templates)
  - Recipient email (if provided)
  - Store link (from CSV or default)
  - Status: "draft"

### 📋 Share Links

Each successful import generates a unique share link:
```
https://yourdomain.com/view/[unique-token]
```

You can:
- Copy individual links from the results table
- Download the results CSV to get all links at once
- Find links later in your dashboard under "Sent Presentations"

### 🔄 Status Tracking

All instances are created with status "draft". You can:
- View them in your dashboard
- Copy share links
- Send links to recipients manually
- Track when they're viewed/completed

## Best Practices

### CSV File Tips

1. **Use UTF-8 encoding** to handle special characters correctly
2. **Remove empty rows** - they'll be skipped but may cause confusion
3. **Validate emails** before importing (the system will catch invalid formats)
4. **Keep file size reasonable** - For very large batches (1000+), consider splitting into multiple files

### Import Tips

1. **Test with a small file first** (5-10 contacts) to verify everything works
2. **Review validation errors** before importing - fix issues in your CSV
3. **Use default store link** if most contacts share the same link
4. **Download results CSV** immediately after import to save all share links

### Performance

- Small batches (< 50 contacts): Processes in seconds
- Medium batches (50-200 contacts): May take 30-60 seconds
- Large batches (200+ contacts): Consider splitting into multiple imports

**Note:** The system processes contacts sequentially to avoid overwhelming the database. Very large batches may take several minutes.

## Troubleshooting

### "No contacts found in file"
- Check that your CSV has a header row
- Ensure the "name" column exists
- Verify the file isn't empty

### "CSV must contain a 'name' column"
- Your CSV needs a column with one of these names: `name`, `nombre`, `recipient name`, `recipient_name`
- Check for typos in the header row

### "Invalid email format"
- Email addresses must be in format: `user@domain.com`
- Check for typos or extra spaces

### "Template not found"
- Make sure you've selected a template from the dropdown
- The template must exist in the system

### Import Failures

If some contacts fail to import:
- Check the error message in the "Failed Imports" table
- Common issues:
  - Missing required name field
  - Database connection issues
  - Duplicate share tokens (rare, auto-retries)
- Fix the issues in your CSV and re-import only the failed contacts

## Future Enhancements

Potential improvements (not yet implemented):
- Email sending directly from the system
- Excel (.xlsx) file support
- Background job processing for very large batches
- Import templates/saved configurations
- Bulk status updates
- Analytics dashboard for batch imports

## Example Use Cases

### Sales Team
Import a list of prospects and send personalized presentations to each one.

### Event Follow-up
After a webinar or event, import attendee list and send follow-up presentations.

### Product Launch
Import customer list and send product announcement presentations.

### Marketing Campaign
Import lead list and send campaign-specific presentations.

## Support

If you encounter issues:
1. Check the error messages in the import results
2. Verify your CSV format matches the example
3. Try importing a smaller test file first
4. Check browser console for detailed error messages


# Icon and Metadata Setup Guide

This document explains the icon and metadata setup for PresenT.

## Automatic Icon Generation

Next.js 13+ App Router automatically generates icons from:
- `src/app/icon.tsx` - Generates `/favicon.ico` and `/icon.png` (32x32)
- `src/app/apple-icon.tsx` - Generates `/apple-touch-icon.png` (180x180)

These are generated at build time automatically.

## Static Icon Files Needed

For full compatibility across all platforms, you should also create these static PNG files in the `public/` directory:

### Required Files:

1. **`public/icon-192.png`** (192x192 pixels)
   - For Android home screen and PWA
   - Use the same design as the logo: gradient background (indigo to purple) with white document icon

2. **`public/icon-512.png`** (512x512 pixels)
   - For Android home screen and PWA
   - Larger version of the same design

3. **`public/favicon.ico`** (16x16, 32x32, 48x48 - multi-size ICO file)
   - Traditional favicon for browsers
   - Can be generated from the PNG files using online tools

### How to Generate These Files:

#### Option 1: Using Online Tools
1. Create a 512x512 PNG with:
   - Background: Linear gradient from `#4f46e5` (indigo) to `#7c3aed` (purple)
   - Icon: White document/presentation icon (same as in Logo component)
   - Rounded corners: 6px border radius
2. Use an online tool like:
   - [Favicon.io](https://favicon.io/favicon-converter/)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - Upload your 512x512 PNG and generate all sizes

#### Option 2: Using Image Editing Software
1. Create a 512x512 canvas
2. Apply gradient background: `#4f46e5` to `#7c3aed`
3. Add the document icon (white, centered)
4. Export as PNG at different sizes:
   - 192x192 → `icon-192.png`
   - 512x512 → `icon-512.png`
   - 16x16, 32x32, 48x48 → Convert to ICO format → `favicon.ico`

#### Option 3: Using the Logo Component
You can take a screenshot of the Logo component at different sizes and use those as your icon files.

## Design Specifications

- **Colors:**
  - Primary: `#4f46e5` (Indigo-600)
  - Secondary: `#7c3aed` (Purple-600)
  - Icon: White (`#ffffff`)

- **Icon Design:**
  - Document/presentation icon (same SVG path as in Logo component)
  - Centered on gradient background
  - Rounded corners: 6px for small icons, 20px for large icons

- **Background:**
  - Linear gradient: `135deg` from indigo to purple
  - For PNG files, ensure the gradient is visible

## Testing

After adding the files, test:

1. **Browser Tab:** Check if favicon appears in browser tab
2. **Mobile Home Screen:** Add to home screen on iOS/Android
3. **Social Media:** Test link previews on:
   - Twitter/X
   - Facebook
   - LinkedIn
   - WhatsApp
   - Slack
4. **PWA:** Check if the app can be installed as a PWA

## Current Setup

✅ Metadata configured in `src/app/layout.tsx`
✅ Open Graph tags configured
✅ Twitter Card tags configured
✅ Manifest.json created
✅ Dynamic icon generation (icon.tsx, apple-icon.tsx)
✅ Dynamic OG image generation (og-image route)
✅ SVG icon created

⏳ Static PNG files need to be created (see above)

## Environment Variable

Make sure to set `NEXT_PUBLIC_SITE_URL` in your `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

This is used for absolute URLs in Open Graph metadata.


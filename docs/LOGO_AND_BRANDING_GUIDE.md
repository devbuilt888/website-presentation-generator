# Logo & Branding Guide

## Recommended Logo Design

Based on the dark, sleek, award-winning design of your application, here are the recommended logo and color specifications:

### Color Palette

**Primary Colors:**
- **Indigo**: `#6366f1` (Primary action color)
- **Purple**: `#8b5cf6` (Secondary accent)
- **Slate**: `#0f172a` to `#1e293b` (Background gradients)

**Accent Colors:**
- **Emerald/Teal**: `#10b981`, `#14b8a6` (Success states)
- **White/Slate**: `#ffffff`, `#f8fafc` (Text on dark)
- **Indigo Light**: `#818cf8` (Hover states)

### Logo Style Recommendations

#### Option 1: Modern Minimalist (Recommended)
- **Style**: Clean, geometric icon with gradient
- **Colors**: Indigo to Purple gradient (`#6366f1` → `#8b5cf6`)
- **Shape**: Rounded square or circle with document/presentation icon
- **Typography**: Sans-serif, bold, gradient text
- **Effect**: Subtle glow, glassmorphism

#### Option 2: Abstract Symbol
- **Style**: Abstract geometric shape representing presentation/slides
- **Colors**: Same gradient palette
- **Shape**: Overlapping rectangles or layers
- **Typography**: Modern, tech-forward font

#### Option 3: Letter Mark
- **Style**: Stylized letter (P for Presentation)
- **Colors**: Gradient fill with glow
- **Shape**: Bold, rounded letterform
- **Typography**: Custom letter with gradient

### Logo Implementation

A logo component has been created at `src/components/Logo.tsx` with:
- Gradient indigo-purple background
- Document/presentation icon
- Glow effects matching the app design
- Responsive sizing (sm, md, lg)
- Integrated with the dashboard header

### Brand Colors for Logo

**Best Matching Colors:**
1. **Primary Gradient**: `from-indigo-600 to-purple-600`
2. **Accent Glow**: `indigo-500/30` to `purple-500/30`
3. **Text**: White with gradient overlay (`from-white via-indigo-200 to-purple-200`)

### Logo Placement

- **Header**: Top-left corner (implemented)
- **Favicon**: Simplified version for browser tab
- **Loading States**: Animated version
- **Email Templates**: Simplified version

### Design Principles

1. **Consistency**: Matches the dark theme and gradient aesthetic
2. **Visibility**: High contrast on dark backgrounds
3. **Modern**: Clean, minimal, tech-forward
4. **Scalable**: Works at all sizes (favicon to hero)
5. **Memorable**: Distinctive but not overwhelming

### Recommended Logo Variations

1. **Full Logo**: Icon + Text "PresenT" (current implementation)
2. **Icon Only**: Just the gradient square with document icon
3. **Text Only**: Gradient text "PresenT" without icon
4. **Monochrome**: Single color version for single-color applications

### Typography for Logo

- **Font**: Modern sans-serif (Inter, Poppins, or custom)
- **Weight**: Bold (700-800)
- **Style**: Gradient text effect
- **Letter Spacing**: Slightly condensed for tech feel

### Implementation Notes

The logo component is already integrated into the dashboard header. To use it elsewhere:

```tsx
import Logo from '@/components/Logo';

// Small size
<Logo size="sm" />

// Medium size (default)
<Logo size="md" />

// Large size
<Logo size="lg" />
```

### Future Enhancements

Consider adding:
- Animated logo for loading states
- Logo variations for different contexts
- Custom SVG logo file
- Brand guidelines document
- Logo usage examples


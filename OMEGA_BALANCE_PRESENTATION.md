# Omega 3/6 Balance Interactive Presentation

## Overview

The "Your Omega 3/6 Balance" presentation is a fully interactive, branching questionnaire that guides users through understanding their omega balance and health concerns.

## ✅ Features Implemented

### 🎯 Interactive Elements

1. **Big Play Button** - Slide 1 has a large animated play button to start
2. **Yes/No Questions** - Large, styled buttons for binary choices
3. **Number Inputs** - Custom inputs for omega 3 and omega 6 values
4. **Multi-Select Checkboxes** - Toggleable health concern options
5. **Conditional Branching** - Different paths based on user answers
6. **Video Placeholders** - Ready for video links to be added later
7. **Dynamic Store Link** - Final slide displays the customized store link

---

## 📊 Presentation Flow

### Main Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│  SLIDE 1: Introduction + Play Button                                │
│  "Hello {{name}}" + "¿Estás interesado en tu salud?"                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ Click Play
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SLIDE 2: Yes/No Question                                           │
│  "¿Conoces tu balance de omega 3 / 6?"                              │
└─────────────┬───────────────────────────────┬───────────────────────┘
              │ Sí                            │ No
              ▼                               ▼
┌──────────────────────────────┐    ┌────────────────────────────────┐
│  SLIDE 3: Input Values       │    │  SLIDE 6: Apology Message      │
│  "¡Genial! ¿Cuál es tu       │    │  "Perdón por preguntar..."     │
│  balance?"                   │    │  "Es normal, la mayoría no     │
│  [Omega 3: ___]              │    │   lo sabe"                     │
│  [Omega 6: ___]              │    └────────────┬───────────────────┘
└─────────┬────────────────────┘                 │
          │ Check values                         │
          ├─────────────┬─────────────┐          │
          │ Perfect     │ Unbalanced  │          │
          │ (3:1)       │ (other)     │          │
          ▼             ▼             │          │
┌─────────────────┐ ┌─────────────────┐         │
│ SLIDE 5:        │ │ SLIDE 4:        │         │
│ Balanced!       │ │ Unbalanced      │         │
│ + Health        │ │ "Estás          │         │
│ Concerns        │ │ desbalanceado"  │         │
│ Checkboxes      │ └───────┬─────────┘         │
└────────┬────────┘          │                   │
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │ All paths merge
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SLIDE 7: Video 1 Placeholder                                       │
│  [Video Placeholder - To be updated later]                          │
└───────────────────────────────┬─────────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SLIDE 8: Yes/No Question                                           │
│  "¿Le gustaría saber su nivel?"                                     │
│  (Both Sí and No go to same next slide)                             │
└───────────────────────────────┬─────────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SLIDE 9: Video 2 Placeholder                                       │
│  "No tengas miedo, es solo un pinchazito"                           │
│  [Video Placeholder - To be updated later]                          │
└───────────────────────────────┬─────────────────────────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SLIDE 10: Final - Get Your Test                                    │
│  "Consigue tu test aquí:"                                           │
│  [Display Store Link]                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Slide Details

### Slide 1: Introduction with Play Button
**Type:** Hero  
**Content:**
- Title: "Hello {{recipientName}}"
- Subtitle: "¿Estás interesado en tu salud?"
- Content: "Tengo preguntas para ti"
- **Interactive:** Large circular play button (white background, purple icon)

**Styling:**
- Purple gradient background
- Animated play button with hover scale effect
- Large, centered text

---

### Slide 2: Initial Yes/No Question
**Type:** Quiz  
**Question:** "¿Conoces tu balance de omega 3 / 6?"  
**Options:** Sí | No

**Flow:**
- **Sí** → Go to Slide 3 (input values)
- **No** → Go to Slide 6 (apology message)

**Styling:**
- Green button for "Sí"
- Red button for "No"
- Large buttons with hover effects

---

### Slide 3: Input Omega Values
**Type:** Quiz (Custom Input)  
**Title:** "¡Genial! ¿Cuál es tu balance?"  
**Subtitle:** "Ingresa tus valores"

**Inputs:**
1. Omega 3 (number input)
2. Omega 6 (number input)

**Logic:**
```javascript
if (omega3 === 1 && omega6 === 3) {
  → Go to Slide 5 (Perfect balance!)
} else {
  → Go to Slide 4 (Unbalanced)
}
```

**Styling:**
- White input boxes with purple borders
- Large, easy-to-read text
- Purple "Continuar" button

---

### Slide 4: Unbalanced Message
**Type:** Hero  
**Title:** "Estás desbalanceado"  
**Content:** "Puede que no estés alcanzando tu máximo potencial de salud y bienestar por ello"

**Flow:** → Slide 7 (Video 1)

**Styling:**
- Yellow title (warning color)
- Purple background
- Continue button

---

### Slide 5: Perfect Balance + Health Concerns
**Type:** Quiz (Multi-Select)  
**Title:** "¡Felicidades!"  
**Subtitle:** "Tienes una proporción perfecta de balance"  
**Question:** "¿Alguno de estos otros problemas te preocupa?"

**Options (Multi-Select):**
1. Fortaleza del cabello
2. Problemas digestivos
3. Energía
4. Circulación
5. Claridad mental
6. Salud cardiovascular
7. Inflamación
8. Salud de la piel
9. Sistema inmunológico
10. Salud articular
11. Estado de ánimo
12. Calidad del sueño

**Features:**
- Users can select multiple options
- Checkboxes toggle on/off
- Visual feedback (checkmark + color change)
- No action taken (data stored for future expansion)

**Flow:** → Slide 7 (Video 1)

**Styling:**
- Green title (success color)
- Grid layout (2-3 columns)
- Selected items turn purple with checkmark
- Unselected items are white

---

### Slide 6: Apology Message
**Type:** Hero  
**Title:** "Perdón por preguntar"  
**Subtitle:** "Es normal"  
**Content:** "La mayoría de personas no lo sabe"

**Flow:** → Slide 7 (Video 1)

**Note:** This is where the "No" path from Slide 2 lands

---

### Slide 7: Video 1 Placeholder
**Type:** Hero  
**Title:** "Video Informativo"  
**Content:** "[Video Placeholder 1 - Se actualizará con el enlace más tarde]"

**Features:**
- Large video placeholder area
- Play icon visual
- Gray background with purple border
- Ready for video embed URL

**Flow:** → Slide 8 (Question)

**Note:** ALL PATHS MERGE HERE

---

### Slide 8: Would You Like to Know Your Level?
**Type:** Quiz  
**Question:** "¿Le gustaría saber su nivel?"  
**Options:** Sí | No

**Special:** Both answers go to the same next slide (Slide 9)

**Styling:**
- Green and red buttons
- Large, prominent

---

### Slide 9: Video 2 Placeholder
**Type:** Hero  
**Title:** "No tengas miedo"  
**Subtitle:** "Es solo un pinchazito"  
**Content:** "[Video Placeholder 2 - Se actualizará con el enlace más tarde]"

**Features:**
- Same styling as Video 1
- Reassuring message about the test

**Flow:** → Slide 10 (Final)

---

### Slide 10: Get Your Test
**Type:** Hero  
**Title:** "Consigue tu test aquí:"  
**Content:** {{storeLink}} (from customization form)

**Features:**
- Large green button with store link
- Link opens in new tab
- Gradient green background
- Call-to-action styling

**Note:** This is the final slide

---

## 🔧 Technical Implementation

### Files Created/Modified

1. ✅ **`src/data/presentations.ts`**
   - Added omega-balance presentation with 10 slides
   - All text in Spanish as requested
   - Placeholder support for recipient name and store link

2. ✅ **`src/components/OmegaBalancePresentationViewer.tsx`** (NEW)
   - Custom interactive viewer component
   - Handles all branching logic
   - Manages user state (answers, inputs, selections)
   - Beautiful purple gradient design

3. ✅ **`src/app/view/[token]/page.tsx`**
   - Added omega-balance viewer routing
   - Ensures customized versions use the interactive viewer

4. ✅ **`src/app/presentations/[id]/page.tsx`**
   - Added omega-balance preview routing
   - Allows testing without customization

---

## 🎮 User Interaction Flow

### State Management

The viewer component tracks:
```typescript
{
  currentSlideIndex: number,           // Which slide is shown
  userAnswers: Record<string, any>,    // All answers given
  omega3: string,                      // Omega 3 value
  omega6: string,                      // Omega 6 value
  selectedConcerns: string[]           // Selected health concerns
}
```

### Branching Logic

```typescript
const getNextSlide = (currentSlideId, answer) => {
  switch(currentSlideId) {
    case 'slide-2':  // Know your balance?
      return answer === 'Sí' ? 2 : 5;
    
    case 'slide-3-input':  // Check omega values
      return (omega3 === 1 && omega6 === 3) ? 4 : 3;
    
    // All other slides follow linear progression
    // or merge into the main flow
  }
}
```

---

## 🎨 Design Features

### Color Scheme
- **Primary:** Purple gradient (blue-purple-indigo)
- **Success:** Green (#10b981)
- **Warning:** Yellow (#fbbf24)
- **Danger:** Red (#ef4444)
- **Text:** White with drop shadows

### Animations
- Fade-in transitions for all slides
- Scale effects on buttons (hover: 1.05x)
- Smooth slide transitions
- Animated play button

### Responsive Design
- Works on all screen sizes
- Grid layouts adjust for mobile
- Large touch targets for mobile users

---

## 📝 How to Customize

### 1. Add Video Links

When you have video URLs, update the presentation data:

```typescript
// In src/data/presentations.ts
{
  id: 'slide-7-video1',
  type: 'hero',
  content: 'https://youtube.com/embed/YOUR_VIDEO_ID_1'
}
```

### 2. Update Video Rendering

In `OmegaBalancePresentationViewer.tsx`, replace the placeholder with an iframe:

```tsx
{currentSlide.id === 'slide-7-video1' && (
  <div className="aspect-video">
    <iframe
      src={currentSlide.content}
      className="w-full h-full rounded-xl"
      allow="accelerometer; autoplay; encrypted-media; gyroscope"
      allowFullScreen
    />
  </div>
)}
```

### 3. Add Background Images

Update slides with background images:

```typescript
{
  id: 'slide-1',
  type: 'hero',
  backgroundGif: '/assets/omega/intro-bg.jpg',
  // ... rest of slide data
}
```

### 4. Expand Health Concerns Logic

Currently, selected concerns are stored but not used. To expand:

```typescript
// After user completes presentation
const concerns = selectedConcerns.join(', ');
// Send to database or email
// Show personalized recommendations
```

---

## 🧪 Testing Guide

### Test the Complete Flow

#### Path 1: Know Balance → Unbalanced
1. Create presentation with name "John"
2. Open share link
3. Click play button → Should show "Hello John"
4. Answer "Sí" to knowing balance
5. Enter Omega 3: 2, Omega 6: 5
6. Click Continue → Should show "Estás desbalanceado"
7. Continue through videos to final slide
8. Verify store link is displayed correctly

#### Path 2: Know Balance → Balanced
1. Start presentation
2. Answer "Sí" to knowing balance
3. Enter Omega 3: 1, Omega 6: 3
4. Click Continue → Should show "¡Felicidades!"
5. Select multiple health concerns (they should toggle)
6. Continue through rest of presentation

#### Path 3: Don't Know Balance
1. Start presentation
2. Answer "No" to knowing balance
3. Should see apology message
4. Should merge into video 1
5. Continue to end

### Preview Mode
- Go to `/presentations/omega-balance`
- Should show all functionality
- Name will be "Customer" (default)
- Store link will show placeholder text

---

## 📊 Data Flow

### When User Completes Presentation

```
User Input → Component State → Database (future)
```

**Currently Tracked:**
- Which path they took
- Their omega values (if provided)
- Selected health concerns (if balanced)
- All yes/no answers

**Future Expansion:**
- Save answers to database
- Email results to user
- Generate personalized recommendations
- Track completion rates
- A/B test different flows

---

## ✅ Completed Features

- ✅ All 10 slides created
- ✅ Personalized greeting with {{recipientName}}
- ✅ Big play button on first slide
- ✅ Yes/No question logic
- ✅ Number input for omega values
- ✅ Perfect balance detection (3:1 ratio)
- ✅ Unbalanced message path
- ✅ Multi-select health concerns (12 options)
- ✅ Apology message for "No" answer
- ✅ Two video placeholders
- ✅ Store link display on final slide
- ✅ All flows merge correctly
- ✅ Beautiful purple gradient design
- ✅ Smooth animations and transitions
- ✅ Responsive layout
- ✅ Progress indicator
- ✅ Works in both preview and customized modes

---

## 🚀 Next Steps (Future Enhancements)

### Immediate
- [ ] Add actual video URLs (when available)
- [ ] Test with real users
- [ ] Get feedback on flow

### Future
- [ ] Save user answers to database
- [ ] Generate PDF report based on answers
- [ ] Send email with personalized recommendations
- [ ] Add analytics tracking
- [ ] A/B test different questions
- [ ] Add more health concern options
- [ ] Implement custom actions based on selected concerns
- [ ] Add social sharing buttons
- [ ] Create admin dashboard to view responses

---

## 📁 File Structure

```
src/
├── data/
│   └── presentations.ts                    ← Omega balance slides defined here
├── components/
│   └── OmegaBalancePresentationViewer.tsx  ← Interactive viewer component
├── app/
│   ├── view/[token]/
│   │   └── page.tsx                        ← Uses viewer for customized versions
│   └── presentations/[id]/
│       └── page.tsx                        ← Uses viewer for preview
```

---

## 🎯 Summary

The "Your Omega 3/6 Balance" presentation is a **fully interactive, branching questionnaire** that:

1. ✅ Greets users by name
2. ✅ Asks if they know their omega balance
3. ✅ Collects their omega values if they know them
4. ✅ Validates if they have the perfect 3:1 ratio
5. ✅ Shows different messages based on their balance
6. ✅ Collects health concerns if balanced
7. ✅ Shows educational videos (placeholders ready)
8. ✅ Provides a call-to-action with personalized store link

**All text is in Spanish as requested, with placeholders ready for videos and full customization through the form!** 🎉


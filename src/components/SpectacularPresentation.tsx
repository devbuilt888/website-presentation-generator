'use client';

import { generateAdvancedCSS } from '../styles/advanced-design-system';

interface SpectacularPresentationProps {
  templateData: any;
  styleConfig: any;
  customEffects: any;
  presentationSlides: any[];
}

export const generateSpectacularPresentationHTML = ({
  templateData,
  styleConfig,
  customEffects,
  presentationSlides
}: SpectacularPresentationProps) => {
  const advancedCSS = generateAdvancedCSS(styleConfig);
  
  // Helper to construct asset URL for HTML generation
  const getAssetUrlForHTML = (path: string): string => {
    if (!path) return path;
    if (/^https?:\/\//i.test(path)) return path;
    const base = process.env.NEXT_PUBLIC_ASSET_BASE?.replace(/\/$/, '');
    if (base) {
      const clean = path.replace(/^\//, '');
      return `${base}/${clean}`;
    }
    return path;
  };
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${templateData.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Lato:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        ${advancedCSS}
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            overflow-x: hidden;
            font-family: var(--font-family);
            background: var(--color-background);
        }
        
        .presentation-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .slide {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        /* Personalized Hero Slide Styles */
        .personalized-hero-slide {
            position: relative;
            overflow: hidden;
            background: #000;
        }
        
        .personalized-hero-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${presentationSlides[0]?.backgroundGif ? getAssetUrlForHTML(presentationSlides[0].backgroundGif) : ''}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            animation: personalizedZoomAnimation 10s ease-in-out;
        }
        
        .personalized-hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%);
            z-index: 2;
        }
        
        .personalized-hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
            max-width: 1200px;
            padding: 2rem;
            margin: 0 auto;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .personalized-welcome {
            font-size: 5rem;
            font-weight: bold;
            margin-bottom: 2rem;
            color: white;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
            line-height: 1.1;
            opacity: 0;
            animation: fadeInWelcome 1s ease-out 3s forwards;
        }
        
        .demo-interface {
            display: flex;
            align-items: center;
            gap: 3rem;
            margin-top: 2rem;
            opacity: 0;
            animation: fadeInDemo 1s ease-out 4s forwards;
        }
        
        .demo-text-box {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 1.5rem;
            padding: 2rem;
            text-align: center;
            min-width: 300px;
        }
        
        .demo-start-button {
            font-size: 2rem;
            font-weight: bold;
            color: white;
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            border: none;
            border-radius: 1rem;
            padding: 1.5rem 3rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .demo-start-button:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }
        
        .user-info {
            margin-top: 1rem;
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.8);
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
        }
        
        .user-name {
            font-weight: bold;
            color: white;
            margin-bottom: 0.5rem;
        }
        
        .user-email {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .play-button {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            position: relative;
        }
        
        .play-button:hover {
            transform: scale(1.1);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }
        
        .play-triangle {
            width: 0;
            height: 0;
            border-left: 30px solid white;
            border-top: 20px solid transparent;
            border-bottom: 20px solid transparent;
            margin-left: 8px;
        }
        
        @keyframes personalizedZoomAnimation {
            0% {
                transform: scale(1.5) translateX(0) translateY(0);
                filter: brightness(1.2) contrast(1.1);
            }
            30% {
                transform: scale(1.2) translateX(-2%) translateY(-1%);
                filter: brightness(1.1) contrast(1.05);
            }
            60% {
                transform: scale(1.1) translateX(-4%) translateY(-2%);
                filter: brightness(1.05) contrast(1.02);
            }
            100% {
                transform: scale(1) translateX(0) translateY(0);
                filter: brightness(1) contrast(1);
            }
        }
        
        @keyframes fadeInWelcome {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInDemo {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Animated Hero Slide Styles */
        .animated-hero-slide {
            position: relative;
            overflow: hidden;
            background: #000;
        }
        
        .animated-hero-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('${presentationSlides[0]?.backgroundGif ? getAssetUrlForHTML(presentationSlides[0].backgroundGif) : ''}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            animation: cameraMovement 8s ease-in-out infinite;
        }
        
        .animated-hero-background.camera-position-2 {
            animation: cameraMovement2 3s ease-in-out forwards;
        }
        
        .animated-hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%);
            z-index: 2;
        }
        
        .animated-hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
            max-width: 1000px;
            padding: 2rem;
            margin: 0 auto;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .animated-hero-title {
            font-size: 4.5rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
            color: white;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
            line-height: 1.1;
            opacity: 0;
            animation: fadeInTitle 1s ease-out 2s forwards;
        }
        
        .animated-hero-subtitle {
            font-size: 1.75rem;
            margin-bottom: 2rem;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 300;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
            opacity: 0;
            animation: fadeInSubtitle 1s ease-out 3s forwards;
        }
        
        .animated-hero-description {
            font-size: 1.5rem;
            margin-bottom: 3rem;
            color: rgba(255, 255, 255, 0.8);
            max-width: 600px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
            opacity: 0;
            animation: fadeInDescription 1s ease-out 4s forwards;
        }
        
        @keyframes cameraMovement {
            0% {
                transform: scale(1) translateX(0) translateY(0) rotate(0deg);
                filter: brightness(1) contrast(1);
            }
            15% {
                transform: scale(1.05) translateX(-1%) translateY(-0.5%) rotate(0.5deg);
                filter: brightness(1.05) contrast(1.05);
            }
            30% {
                transform: scale(1.15) translateX(-3%) translateY(-2%) rotate(1deg);
                filter: brightness(1.1) contrast(1.1);
            }
            45% {
                transform: scale(1.25) translateX(-6%) translateY(-4%) rotate(1.5deg);
                filter: brightness(1.15) contrast(1.15);
            }
            60% {
                transform: scale(1.2) translateX(-4%) translateY(-3%) rotate(1deg);
                filter: brightness(1.1) contrast(1.1);
            }
            75% {
                transform: scale(1.1) translateX(-2%) translateY(-1.5%) rotate(0.5deg);
                filter: brightness(1.05) contrast(1.05);
            }
            90% {
                transform: scale(1.05) translateX(-1%) translateY(-0.5%) rotate(0.2deg);
                filter: brightness(1.02) contrast(1.02);
            }
            100% {
                transform: scale(1) translateX(0) translateY(0) rotate(0deg);
                filter: brightness(1) contrast(1);
            }
        }
        
        @keyframes fadeInTitle {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInSubtitle {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInDescription {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes cameraMovement2 {
            0% {
                transform: scale(1.25) translateX(-6%) translateY(-4%) rotate(1.5deg);
                filter: brightness(1.15) contrast(1.15);
            }
            50% {
                transform: scale(1.1) translateX(3%) translateY(-2%) rotate(-0.5deg);
                filter: brightness(1.1) contrast(1.1);
            }
            100% {
                transform: scale(1.05) translateX(1%) translateY(-1%) rotate(-0.2deg);
                filter: brightness(1.05) contrast(1.05);
            }
        }
        
        /* Hero Slide Styles */
        .hero-slide {
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
            position: relative;
        }
        
        .hero-slide::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.2;
            pointer-events: none;
        }
        
        .hero-content {
            text-align: center;
            max-width: 1000px;
            padding: 2rem;
            z-index: 10;
            position: relative;
        }
        
        .hero-title {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
            color: white;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            line-height: 1.1;
        }
        
        .hero-subtitle {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 300;
        }
        
        .hero-description {
            font-size: 1.25rem;
            margin-bottom: 3rem;
            color: rgba(255, 255, 255, 0.8);
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .hero-image-container {
            position: relative;
            margin: 2rem auto;
            max-width: 600px;
        }
        
        .hero-image {
            width: 100%;
            height: 500px;
            object-fit: cover;
            border-radius: 2rem;
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.3);
            border: 4px solid rgba(255, 255, 255, 0.2);
            position: relative;
            z-index: 5;
        }
        
        .hero-image::after {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
            border-radius: 2rem;
            z-index: -1;
            opacity: 0.3;
        }
        
        /* Split Slide Styles */
        .split-slide {
            background: white;
            color: #333;
        }
        
        .split-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            height: 100vh;
            width: 100%;
        }
        
        .split-image {
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .split-image::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%);
            z-index: 1;
        }
        
        .split-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: relative;
            z-index: 2;
        }
        
        .split-text {
            padding: 4rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: white;
            position: relative;
        }
        
        .split-text::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(to bottom, var(--color-primary), var(--color-secondary));
        }
        
        .split-title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 2rem;
            color: #333;
        }
        
        .split-description {
            font-size: 1.25rem;
            line-height: 1.6;
            color: #666;
        }
        
        /* Grid Slide Styles */
        .grid-slide {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 4rem;
        }
        
        .grid-content {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .grid-title {
            font-size: 3rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 3rem;
            color: #333;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 1.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
        }
        
        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .feature-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: #333;
        }
        
        .feature-description {
            color: #666;
            line-height: 1.6;
        }
        
        /* Interactive Slide Styles */
        .interactive-slide {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem;
        }
        
        .interactive-content {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .interactive-title {
            font-size: 3rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .interactive-description {
            font-size: 1.25rem;
            text-align: center;
            margin-bottom: 3rem;
            opacity: 0.9;
        }
        
        .question-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 1.5rem;
            padding: 2rem;
            margin-bottom: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .question-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1.5rem;
            color: white;
        }
        
        .options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .option-button {
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 1rem;
            padding: 1.5rem;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            font-weight: 500;
        }
        
        .option-button:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .option-button.selected {
            background: rgba(255, 255, 255, 0.3);
            border-color: white;
            transform: scale(1.05);
        }
        
        /* Stats Slide Styles */
        .stats-slide {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem;
        }
        
        .stats-content {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .stats-title {
            font-size: 3rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .stats-description {
            font-size: 1.25rem;
            text-align: center;
            margin-bottom: 4rem;
            opacity: 0.9;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 1.5rem;
            padding: 2rem;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .stat-number {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: white;
        }
        
        .stat-label {
            font-size: 1.25rem;
            opacity: 0.9;
        }
        
        /* Timeline Slide Styles */
        .timeline-slide {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            color: #333;
            padding: 4rem;
        }
        
        .timeline-content {
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .timeline-title {
            font-size: 3rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 2rem;
            color: #333;
        }
        
        .timeline-description {
            font-size: 1.25rem;
            text-align: center;
            margin-bottom: 4rem;
            color: #666;
        }
        
        .timeline-container {
            position: relative;
            padding-left: 2rem;
        }
        
        .timeline-container::before {
            content: '';
            position: absolute;
            left: 1rem;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(to bottom, var(--color-primary), var(--color-secondary));
            border-radius: 2px;
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 3rem;
            padding-left: 3rem;
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -1.5rem;
            top: 0.5rem;
            width: 1rem;
            height: 1rem;
            background: var(--color-primary);
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 0 0 4px var(--color-primary);
        }
        
        .timeline-year {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--color-primary);
            margin-bottom: 0.5rem;
        }
        
        .timeline-item-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            color: #333;
        }
        
        .timeline-item-description {
            color: #666;
            line-height: 1.6;
        }
        
        /* Testimonials Slide Styles */
        .testimonials-slide {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 4rem;
        }
        
        .testimonials-content {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .testimonials-title {
            font-size: 3rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .testimonials-description {
            font-size: 1.25rem;
            text-align: center;
            margin-bottom: 4rem;
            opacity: 0.9;
        }
        
        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }
        
        .testimonial-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 1.5rem;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
        }
        
        .testimonial-card::before {
            content: '"';
            position: absolute;
            top: -0.5rem;
            left: 1rem;
            font-size: 4rem;
            color: var(--color-primary);
            opacity: 0.3;
        }
        
        .testimonial-quote {
            font-size: 1.125rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
            font-style: italic;
        }
        
        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .testimonial-avatar {
            font-size: 2rem;
        }
        
        .testimonial-info h4 {
            font-weight: bold;
            margin-bottom: 0.25rem;
        }
        
        .testimonial-info p {
            opacity: 0.8;
            font-size: 0.875rem;
        }
        
        /* Contact Slide Styles */
        .contact-slide {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 4rem;
        }
        
        .contact-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        
        .contact-title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 2rem;
        }
        
        .contact-description {
            font-size: 1.25rem;
            margin-bottom: 3rem;
            opacity: 0.9;
        }
        
        .contact-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
        }
        
        .contact-item {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 1rem;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .contact-item h3 {
            font-size: 1.25rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .contact-item p {
            opacity: 0.8;
        }
        
        /* Controls */
        .slide-controls {
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 1rem;
            z-index: 1001;
        }
        
        .control-btn {
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .control-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
        
        .slide-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 8px;
            background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
            transition: width 0.3s ease;
            z-index: 1001;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .slide-indicator {
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 1rem;
            font-size: 0.875rem;
            z-index: 1001;
        }
        
        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.8s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards; }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .hero-title { font-size: 2.5rem; }
            .hero-subtitle { font-size: 1.25rem; }
            .hero-description { font-size: 1rem; }
            .split-content { grid-template-columns: 1fr; }
            .split-text { padding: 2rem; }
            .grid-slide, .interactive-slide, .contact-slide { padding: 2rem; }
            .hero-image { height: 250px; }
        }
    </style>
</head>
<body>
    <div class="presentation-container">
        <div class="slide-progress" id="progress"></div>
        <div class="slide-indicator" id="indicator">1 / 10</div>
        
        <!-- Personalized Hero Slide -->
        <div class="slide personalized-hero-slide" id="slide-0">
            <div class="personalized-hero-background"></div>
            <div class="personalized-hero-overlay"></div>
            <div class="personalized-hero-content">
                <h1 class="personalized-welcome">${presentationSlides[0].title}</h1>
                <div class="demo-interface">
                    <div class="demo-text-box">
                        <button class="demo-start-button" onclick="startDemo()">${presentationSlides[0].subtitle}</button>
                        <div class="user-info">
                            <div class="user-name">${presentationSlides[0].userName}</div>
                            <div class="user-email">${presentationSlides[0].userEmail}</div>
                        </div>
                    </div>
                    <div class="play-button" onclick="startDemo()">
                        <div class="play-triangle"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Animated Hero Slide -->
        <div class="slide animated-hero-slide" id="slide-1" style="display: none;">
            <div class="animated-hero-background"></div>
            <div class="animated-hero-overlay"></div>
            <div class="animated-hero-content">
                <h1 class="animated-hero-title">${presentationSlides[1].title}</h1>
                <h2 class="animated-hero-subtitle">${presentationSlides[1].subtitle}</h2>
                <p class="animated-hero-description">${presentationSlides[1].content}</p>
            </div>
        </div>
        
        <!-- Hero Slide -->
        <div class="slide hero-slide" id="slide-2" style="display: none;">
            <div class="hero-content">
                <h1 class="hero-title animate-fadeIn">${presentationSlides[2].title}</h1>
                <h2 class="hero-subtitle animate-slideUp" style="animation-delay: 0.3s;">${presentationSlides[2].subtitle}</h2>
                <p class="hero-description animate-slideUp" style="animation-delay: 0.6s;">${presentationSlides[2].content}</p>
                ${templateData.heroImage ? `
                <div class="hero-image-container animate-scaleIn" style="animation-delay: 0.9s;">
                    <img src="${templateData.heroImage}" alt="Hero" class="hero-image">
                </div>
                ` : ''}
            </div>
        </div>
        
        <!-- About Slide -->
        <div class="slide split-slide" id="slide-3" style="display: none;">
            <div class="split-content">
                <div class="split-image">
                    ${templateData.heroImage ? `<img src="${templateData.heroImage}" alt="About">` : `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 4rem;">
                        🏢
                    </div>
                    `}
                </div>
                <div class="split-text">
                    <h1 class="split-title animate-slideInRight">${presentationSlides[3].title}</h1>
                    <p class="split-description animate-slideInRight" style="animation-delay: 0.3s;">${presentationSlides[3].content}</p>
                </div>
            </div>
        </div>
        
        <!-- Features Slide -->
        <div class="slide grid-slide" id="slide-4" style="display: none;">
            <div class="grid-content">
                <h1 class="grid-title animate-fadeIn">${presentationSlides[4].title}</h1>
                <p class="text-center text-xl mb-8 animate-slideUp" style="animation-delay: 0.3s;">${presentationSlides[4].content}</p>
                <div class="features-grid">
                    ${presentationSlides[4].features.map((feature: any, index: number) => `
                    <div class="feature-card animate-scaleIn" style="animation-delay: ${0.5 + index * 0.2}s;">
                        <div class="feature-icon">${feature.icon}</div>
                        <h3 class="feature-title">${feature.title}</h3>
                        <p class="feature-description">${feature.description}</p>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Stats Slide -->
        <div class="slide stats-slide" id="slide-5" style="display: none;">
            <div class="stats-content">
                <h1 class="stats-title animate-fadeIn">${presentationSlides[5].title}</h1>
                <p class="stats-description animate-slideUp" style="animation-delay: 0.3s;">${presentationSlides[5].content}</p>
                <div class="stats-grid">
                    ${presentationSlides[5].stats.map((stat: any, index: number) => `
                    <div class="stat-card animate-scaleIn" style="animation-delay: ${0.6 + index * 0.2}s;">
                        <div class="stat-icon">${stat.icon}</div>
                        <div class="stat-number">${stat.number}</div>
                        <div class="stat-label">${stat.label}</div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Timeline Slide -->
        <div class="slide timeline-slide" id="slide-6" style="display: none;">
            <div class="timeline-content">
                <h1 class="timeline-title animate-fadeIn">${presentationSlides[6].title}</h1>
                <p class="timeline-description animate-slideUp" style="animation-delay: 0.3s;">${presentationSlides[6].content}</p>
                <div class="timeline-container animate-slideUp" style="animation-delay: 0.6s;">
                    ${presentationSlides[6].timeline.map((item: any, index: number) => `
                    <div class="timeline-item animate-slideInLeft" style="animation-delay: ${0.9 + index * 0.3}s;">
                        <div class="timeline-year">${item.year}</div>
                        <div class="timeline-item-title">${item.title}</div>
                        <div class="timeline-item-description">${item.description}</div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Testimonials Slide -->
        <div class="slide testimonials-slide" id="slide-7" style="display: none;">
            <div class="testimonials-content">
                <h1 class="testimonials-title animate-fadeIn">${presentationSlides[7].title}</h1>
                <p class="testimonials-description animate-slideUp" style="animation-delay: 0.3s;">${presentationSlides[7].content}</p>
                <div class="testimonials-grid">
                    ${presentationSlides[7].testimonials.map((testimonial: any, index: number) => `
                    <div class="testimonial-card animate-scaleIn" style="animation-delay: ${0.6 + index * 0.2}s;">
                        <div class="testimonial-quote">${testimonial.quote}</div>
                        <div class="testimonial-author">
                            <div class="testimonial-avatar">${testimonial.avatar}</div>
                            <div class="testimonial-info">
                                <h4>${testimonial.author}</h4>
                                <p>${testimonial.role}</p>
                            </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Interactive Slide -->
        <div class="slide interactive-slide" id="slide-8" style="display: none;">
            <div class="interactive-content">
                <h1 class="interactive-title animate-fadeIn">${presentationSlides[8].title}</h1>
                <p class="interactive-description animate-slideUp" style="animation-delay: 0.3s;">${presentationSlides[8].content}</p>
                ${presentationSlides[8].questions.map((question: any, qIndex: number) => `
                <div class="question-container animate-slideUp" style="animation-delay: ${0.6 + qIndex * 0.3}s;">
                    <h3 class="question-title">${question.question}</h3>
                    <div class="options-grid">
                        ${question.options.map((option: any, oIndex: number) => `
                        <button class="option-button animate-scaleIn" 
                                style="animation-delay: ${0.9 + qIndex * 0.3 + oIndex * 0.1}s;"
                                onclick="selectOption('${question.id}', '${option.id}', '${option.value}')">
                            ${option.text}
                        </button>
                        `).join('')}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Contact Slide -->
        <div class="slide contact-slide" id="slide-9" style="display: none;">
            <div class="contact-content">
                <h1 class="contact-title animate-fadeIn">${presentationSlides[9].title}</h1>
                <p class="contact-description animate-slideUp" style="animation-delay: 0.3s;">${presentationSlides[9].content}</p>
                <div class="contact-info animate-slideUp" style="animation-delay: 0.6s;">
                    <div class="contact-item">
                        <h3>Email</h3>
                        <p>${presentationSlides[9].contactInfo.email}</p>
                    </div>
                    <div class="contact-item">
                        <h3>Phone</h3>
                        <p>${presentationSlides[9].contactInfo.phone}</p>
                    </div>
                    <div class="contact-item">
                        <h3>Website</h3>
                        <p>${presentationSlides[9].contactInfo.website}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="slide-controls">
            <button class="control-btn" onclick="previousSlide()">Previous</button>
            <button class="control-btn" onclick="togglePlayPause()" id="playPauseBtn">Pause</button>
            <button class="control-btn" onclick="nextSlide()">Next</button>
        </div>
    </div>

    <script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        let interval = null;
        let progress = 0;
        let isPlaying = false;
        let userAnswers = {};
        
        const slideDurations = [10000, 8000, 5000, 4000, 6000, 5000, 7000, 6000, 8000, 4000];
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'flex' : 'none';
            });
            document.getElementById('indicator').textContent = \`\${index + 1} / \${totalSlides}\`;
            updateProgress();
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
            progress = 0;
        }
        
        function previousSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
            progress = 0;
        }
        
        function updateProgress() {
            const progressBar = document.getElementById('progress');
            const duration = slideDurations[currentSlide];
            const progressPercent = (progress / duration) * 100;
            progressBar.style.width = progressPercent + '%';
        }
        
        function startPresentation() {
            if (interval) clearInterval(interval);
            interval = setInterval(() => {
                progress += 100;
                updateProgress();
                if (progress >= slideDurations[currentSlide]) {
                    nextSlide();
                    progress = 0;
                }
            }, 100);
        }
        
        function stopPresentation() {
            if (interval) clearInterval(interval);
        }
        
        function togglePlayPause() {
            const btn = document.getElementById('playPauseBtn');
            if (isPlaying) {
                stopPresentation();
                btn.textContent = 'Play';
                isPlaying = false;
            } else {
                startPresentation();
                btn.textContent = 'Pause';
                isPlaying = true;
            }
        }
        
        function selectOption(questionId, optionId, value) {
            // Remove previous selection for this question
            const questionContainer = document.querySelector(\`[onclick*="\${questionId}"]\`).closest('.question-container');
            const buttons = questionContainer.querySelectorAll('.option-button');
            buttons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selection to clicked button
            event.target.classList.add('selected');
            
            // Store the answer
            userAnswers[questionId] = { optionId, value };
            console.log('User selected:', { questionId, optionId, value });
            console.log('All answers:', userAnswers);
        }
        
        function startDemo() {
            console.log('Demo started by user');
            // Auto-advance to next slide
            nextSlide();
        }
        
        // Initialize
        showSlide(0);
        
        // Trigger second camera position after text appears (5 seconds)
        setTimeout(() => {
            const background = document.querySelector('.animated-hero-background');
            if (background) {
                background.classList.add('camera-position-2');
            }
        }, 5000);
        
        // Auto-play after 2 seconds
        setTimeout(() => {
            isPlaying = true;
            startPresentation();
        }, 2000);
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') previousSlide();
            if (e.key === ' ') {
                e.preventDefault();
                togglePlayPause();
            }
        });
    </script>
</body>
</html>`;
};

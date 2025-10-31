/**
 * Utility functions for Text-to-Speech using ElevenLabs API
 */

let currentAudio: HTMLAudioElement | null = null;

/**
 * Stops any currently playing audio
 */
export function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Extracts the main text from a slide to be read aloud
 * Priority: title > subtitle > content
 */
export function extractSlideText(slide: {
  title?: string;
  subtitle?: string;
  content?: string;
}): string {
  // Priority: title > subtitle > content
  if (slide.title && slide.title.trim()) {
    return slide.title.trim();
  }
  if (slide.subtitle && slide.subtitle.trim()) {
    return slide.subtitle.trim();
  }
  if (slide.content && slide.content.trim()) {
    // Remove HTML tags if present (from highlights)
    return slide.content.replace(/<[^>]*>/g, '').trim();
  }
  return '';
}

/**
 * Converts text to speech and plays it
 * @param text - The text to convert to speech
 * @returns Promise that resolves when audio starts playing
 */
export async function speakText(text: string): Promise<void> {
  // Stop any currently playing audio
  stopCurrentAudio();

  if (!text || text.trim().length === 0) {
    return;
  }

  try {
    // Call our API route to get audio
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('TTS API error:', error);
      return;
    }

    // Create audio blob and play it
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    // Clean up the object URL when audio ends
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(audioUrl);
      if (currentAudio === audio) {
        currentAudio = null;
      }
    });

    // Handle errors
    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      URL.revokeObjectURL(audioUrl);
      if (currentAudio === audio) {
        currentAudio = null;
      }
    });

    // Play the audio
    await audio.play();
  } catch (error) {
    console.error('Error in speakText:', error);
  }
}


// Translation map for presentation text (Spanish to English)
// Brand names and proper nouns are preserved

const brandNames = new Set([
  'Zinzino', 'VITAS', 'BalanceOil', 'BalanceOil+', 'ZinoBiotic+', 'Xtend', 'Viv^+',
  'Omega-3', 'Omega-6', 'omega-3', 'omega-6', 'EE.UU.', 'CPZ', 'ADN'
]);

const translations: Record<string, string> = {
  // Slide titles and content
  'Queremos sentirnos bien, estar en forma y sanos': 'We want to feel good, be fit and healthy',
  'Sin embargo, los problemas de salud aumentan.': 'However, health problems are increasing.',
  'Es el momento de preguntarse por qué': 'It\'s time to ask why',
  'Que tu alimento sea tu medicina y tu medicina tu alimento': 'Let your food be your medicine and your medicine be your food',
  'Solíamos obtener nuestros alimentos de la naturaleza': 'We used to get our food from nature',
  'Hoy en día comemos alimentos preparados por el ser humano': 'Today we eat food prepared by humans',
  'La historia del equilibrio entre omega-6 y omega-3': 'The history of the balance between omega-6 and omega-3',
  '¿Cuáles son las consecuencias de un desequilibrio de omega-6 y omega-3?': 'What are the consequences of an imbalance between omega-6 and omega-3?',
  'Así es como afecta a las células de nuestro organismo': 'This is how it affects the cells of our organism',
  '¿Está donde quería estar o se encuentra en la zona de riesgo?': 'Are you where you wanted to be or are you in the risk zone?',
  '¿Sabes tu proporción de Omega-3 y Omega-6?': 'Do you know your Omega-3 and Omega-6 ratio?',
  '¿Le gustaría hacerse una prueba para conocer sus resultados?': 'Would you like to take a test to know your results?',
  'Las pruebas las analiza nuestro laboratorio asociado independientemente: Servicios Analíticos VITAS': 'Tests are analyzed by our independent partner laboratory: Servicios Analíticos VITAS',
  'Los resultados de más de 1.500.000 pruebas realizadas muestran un mundo en desequilibrio': 'The results of more than 1,500,000 tests performed show a world in imbalance',
  'Obtenga sus resultados personales': 'Get your personal results',
  'Obtenga sus resultados personales y siga su proceso': 'Get your personal results and follow your progress',
  'Podemos devolverle el equilibrio en 120 días': 'We can restore your balance in 120 days',
  'Es fresco y muy saludable': 'It\'s fresh and very healthy',
  'Nuestros productos son probados por terceros y han sido fabricados de la mejor manera y con el máximo cuidado': 'Our products are tested by third parties and have been manufactured in the best way and with maximum care',
  'Hay ventajas saludables para cada etapa vital': 'There are health advantages for each life stage',
  'El 95 % de las personas que toman suplementos de Zinzino Balance recuperan el equilibrio en 120 días': '95% of people who take Zinzino Balance supplements regain balance in 120 days',
  'Alcanzar un equilibrio entre el omega-6 y el omega-3 es el primer paso para sentirse bien, estar en forma y sano': 'Achieving a balance between omega-6 and omega-3 is the first step to feeling good, being fit and healthy',
  'Protocolo de salud de Zinzino': 'Zinzino Health Protocol',
  'Protocolo de salud premium': 'Premium Health Protocol',
  'Obtenga sus productos gratis': 'Get your products for free',
  'Haga sus sueños realidad': 'Make your dreams come true',
  'Demos forma al futuro de la nutrición juntos': 'Let\'s shape the future of nutrition together',
  'Hello Miguel': 'Hola Miguel',
  'Discover Your Health Journey': 'Descubre tu Viaje de Salud',
  'Experience our amazing health and wellness solutions': 'Experimenta nuestras increíbles soluciones de salud y bienestar',
  'Contacta a quien te mandó esto': 'Contact who sent you this',
  // Reverse translations (English to Spanish)
  'Hola Miguel': 'Hello Miguel',
  'Descubre tu Viaje de Salud': 'Discover Your Health Journey',
  'Experimenta nuestras increíbles soluciones de salud y bienestar': 'Experience our amazing health and wellness solutions',
  'Comprar producto': 'Buy Product',
  'Sí': 'Yes',
  'No': 'No',
  'We hope you liked the presentation': 'We hope you liked the presentation',
  'For more information or to get in touch, choose an option below.': 'For more information or to get in touch, choose an option below.',
  'More Information': 'More Information',
  'Contact The Sender': 'Contact The Sender',
  
  // Subtexts and labels
  '-Hipócrates': '-Hippocrates',
  '460-370 a.C': '460-370 BC',
  'Formación del ADN': 'DNA Formation',
  'La ciencia recomienda': 'Science recommends',
  'El punto de inflexión': 'The turning point',
  'Aumento por década (EE.UU.)': 'Increase per decade (USA)',
  
  // Common phrases
  'y sanos': 'and healthy',
  'los problemas de salud': 'health problems',
  'preguntarse por qué': 'ask why',
  'sea tu medicina': 'be your medicine',
  'tu alimento': 'your food',
  'de la naturaleza': 'from nature',
  'preparados por el ser humano': 'prepared by humans',
  'omega-6 y omega-3': 'omega-6 and omega-3',
  'a las células de nuestro organismo': 'to the cells of our organism',
  'en la zona de riesgo': 'in the risk zone',
  'para conocer sus resultados': 'to know your results',
  'servicios analiticos VITAS': 'Servicios Analíticos VITAS',
  '1.500.000': '1,500,000',
  'en desequilibrio': 'in imbalance',
  'resultados personales': 'personal results',
  'y siga su proceso': 'and follow your progress',
  'en 120 días': 'in 120 days',
  'y muy saludable': 'and very healthy',
  'han sido fabricados de la mejor manera y con el máximo cuidado': 'have been manufactured in the best way and with maximum care',
  'ventajas saludables': 'health advantages',
  'recuperan el equilibrio en 120 días': 'regain balance in 120 days',
  'el primer paso para sentirse bien, estar en forma y sano': 'the first step to feeling good, being fit and healthy',
  'premium': 'premium',
  'sueños realidad': 'dreams come true',
  'juntos': 'together',
};

// Helper function to translate text while preserving brand names
export function translateText(text: string, isTranslated: boolean): string {
  if (!isTranslated || !text) return text;
  
  // Split text into words and preserve HTML tags if present
  const hasHTML = /<[^>]+>/g.test(text);
  if (hasHTML) {
    // Handle HTML content (like bold tags)
    let result = text;
    // Try to translate the entire phrase first
    if (translations[text]) {
      return translations[text];
    }
    // If not found, translate word by word while preserving HTML
    const tempText = text.replace(/<[^>]+>/g, '');
    const translated = translateText(tempText, true);
    // Re-apply HTML structure - this is simplified, might need more sophisticated parsing
    return translated;
  }
  
  // Check if exact phrase exists in translations
  if (translations[text.trim()]) {
    return translations[text.trim()];
  }
  
  // Try to translate sentence by sentence
  const sentences = text.split(/([.!?]+\s*)/);
  let result = '';
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i].trim();
    if (sentence) {
      if (translations[sentence]) {
        result += translations[sentence];
      } else {
        // Translate word by word, preserving brand names
        const words = sentence.split(/(\s+)/);
        result += words.map(word => {
          const cleanWord = word.trim();
          if (!cleanWord || /^\s+$/.test(word)) return word;
          
          // Check if it's a brand name
          if (brandNames.has(cleanWord) || /^[A-Z][a-z]+(\+)?$/.test(cleanWord)) {
            return word;
          }
          
          // Try to find translation for the word or phrase
          const lowerWord = cleanWord.toLowerCase();
          for (const [spanish, english] of Object.entries(translations)) {
            if (spanish.toLowerCase().includes(lowerWord) || lowerWord.includes(spanish.toLowerCase())) {
              // This is a simplified approach - ideally would do better matching
              return word;
            }
          }
          
          // For now, keep untranslated words (could enhance with a dictionary later)
          return word;
        }).join('');
      }
      if (sentences[i + 1]) result += sentences[i + 1];
    } else {
      result += sentences[i];
    }
  }
  
  return result || text;
}

// Simple word-level translation fallback (basic Spanish to English common words)
const wordTranslations: Record<string, string> = {
  'Queremos': 'We want',
  'sentirnos': 'to feel',
  'bien': 'good',
  'estar': 'to be',
  'en forma': 'in shape',
  'sanos': 'healthy',
  'problemas': 'problems',
  'salud': 'health',
  'aumentan': 'increase',
  'momento': 'moment',
  'preguntarse': 'to ask',
  'alimento': 'food',
  'medicina': 'medicine',
  'Solíamos': 'We used to',
  'obtener': 'obtain',
  'nuestros': 'our',
  'alimentos': 'foods',
  'naturaleza': 'nature',
  'Hoy': 'Today',
  'día': 'day',
  'comemos': 'we eat',
  'preparados': 'prepared',
  'ser': 'being',
  'humano': 'human',
};

// Enhanced translation with fallback to word-level
export function translateTextEnhanced(text: string, isTranslated: boolean): string {
  if (!isTranslated || !text) return text;
  
  // Clean text from HTML for processing
  const htmlMatches: Array<{ tag: string; index: number }> = [];
  let cleanText = text;
  let htmlIndex = 0;
  
  // Extract HTML tags
  const htmlTags = text.match(/<[^>]+>/g) || [];
  const textWithoutHTML = text.replace(/<[^>]+>/g, '');
  
  // Try exact phrase match first
  const exactMatch = translations[textWithoutHTML.trim()];
  if (exactMatch) {
    return exactMatch;
  }
  
  // Try partial matches (substrings)
  for (const [spanish, english] of Object.entries(translations)) {
    if (textWithoutHTML.includes(spanish)) {
      return textWithoutHTML.replace(spanish, english);
    }
  }
  
  // Word-by-word translation with brand name preservation
  const words = textWithoutHTML.split(/(\s+|[,.:;!?])/);
  const translatedWords = words.map(word => {
    const trimmed = word.trim();
    if (!trimmed) return word;
    
    // Preserve brand names and numbers
    if (brandNames.has(trimmed) || /^\d+[.,]?\d*$/.test(trimmed) || /^[A-Z][a-z]*\+?$/.test(trimmed)) {
      return word;
    }
    
    // Check word translations
    if (wordTranslations[trimmed]) {
      return word.replace(trimmed, wordTranslations[trimmed]);
    }
    
    // Keep original if no translation found (likely a brand name or proper noun)
    return word;
  });
  
  // Reconstruct with HTML if it existed
  let result = translatedWords.join('');
  // Simple approach: if we had HTML, try to re-apply it (this is a simplified version)
  // For full HTML support, would need more sophisticated parsing
  
  return result || text;
}


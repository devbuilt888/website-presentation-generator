export interface Presentation {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  slides: PresentationSlide[];
}

export interface PresentationSlide {
  id: string;
  type: 'personalized-hero' | 'animated-hero' | 'hero' | 'split' | 'grid' | 'stats' | 'timeline' | 'testimonials' | 'questionnaire' | 'contact' | 'quiz';
  title: string;
  subtitle?: string;
  content: string;
  duration: number;
  backgroundGif?: string;
  userName?: string;
  userEmail?: string;
  image?: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  stats?: Array<{
    icon: string;
    number: string;
    label: string;
  }>;
  timeline?: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
    avatar: string;
  }>;
  questions?: Array<{
    question: string;
    options: string[];
  }>;
}

// Sample presentations data
export const presentations: Presentation[] = [
  {
    id: 'zinzino-mex',
    title: 'Customer Presentation MEX - Zinzino',
    description: 'Presentation for Zinzino Mexico customers',
    createdAt: new Date().toISOString(),
    slides: [
      {
        id: 'slide-1',
        type: 'personalized-hero',
        title: 'Hello {{recipientName}}',
        subtitle: 'Discover Your Health Journey',
        content: 'Experience our amazing health and wellness solutions',
        backgroundGif: '/assets/presentation1/CPZslide1Bg.png',
        userName: 'Customer',
        userEmail: 'customer@example.com',
        duration: 10000
      },
      {
        id: 'slide-2',
        type: 'animated-hero',
        title: 'Queremos sentirnos bien, estar en forma y sanos',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide2Bg.png',
        duration: 8000
      },
      {
        id: 'slide-3',
        type: 'hero',
        title: 'Sin embargo, los problemas de salud aumentan.',
        subtitle: '',
        content: 'Es el momento de preguntarse por qué',
        backgroundGif: '/assets/presentation1/slide3.jpeg',
        duration: 6000
      },
      {
        id: 'slide-4',
        type: 'split',
        title: 'Que tu alimento sea tu medicina y tu medicina tu alimento',
        content: '-Hipócrates\n460-370 a.C',
        backgroundGif: '/assets/presentation1/CPZslide4Bg.png',
        duration: 6000
      },
      {
        id: 'slide-5',
        type: 'grid',
        title: 'Solíamos obtener nuestros alimentos de la naturaleza',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide5Bg.png',
        features: [
          { icon: '🧬', title: 'Health Tests', description: 'Comprehensive health testing' },
          { icon: '💊', title: 'Supplements', description: 'Premium nutritional supplements' },
          { icon: '📊', title: 'Personalized Plans', description: 'Customized health recommendations' }
        ],
        duration: 8000
      },
      {
        id: 'slide-6',
        type: 'hero',
        title: 'Hoy en día comemos alimentos preparados por el ser humano',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide6Bg.png',
        duration: 7000
      },
      {
        id: 'slide-7',
        type: 'hero',
        title: 'La historia del equilibrio entre omega-6 y omega-3',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/slide7bg.png',
        duration: 5000
      },
      {
        id: 'slide-8',
        type: 'hero',
        title: '¿Cuáles son las consecuencias de un desequilibrio de omega-6 y omega-3?',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide8Bg.png',
        duration: 7000
      },
      {
        id: 'slide-9',
        type: 'grid',
        title: 'Así es como afecta a las células de nuestro organismo',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide9Bg.png',
        features: [
          { icon: '🐟', title: 'Omega-3', description: 'High-quality fish oil supplements' },
          { icon: '🌿', title: 'Natural Extracts', description: 'Pure botanical extracts' },
          { icon: '⚡', title: 'Energy Support', description: 'Natural energy boosters' }
        ],
        duration: 8000
      },
      {
        id: 'slide-10',
        type: 'hero',
        title: '¿Está donde quería estar o se encuentra en la zona de riesgo?',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide10Bg.png',
        duration: 7000
      },
      {
        id: 'slide-10-quiz',
        type: 'quiz',
        title: '¿Sabes tu proporción de Omega-3 y Omega-6?',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/slide10Pre.png',
        duration: 10000
      },
      {
        id: 'slide-11',
        type: 'hero',
        title: '¿Le gustaría hacerse una prueba para conocer sus resultados?',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide11Bg.png',
        duration: 6000
      },
      {
        id: 'slide-12',
        type: 'hero',
        title: 'Las pruebas las analiza nuestro laboratorio asociado independientemente: Servicios Analíticos VITAS',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide12Bg.png',
        duration: 6000
      },
      {
        id: 'slide-13',
        type: 'hero',
        title: 'Los resultados de más de 1.500.000 pruebas realizadas muestran un mundo en desequilibrio',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide13Bg.png',
        duration: 7000
      },
      {
        id: 'slide-14',
        type: 'hero',
        title: 'Obtenga sus resultados personales',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide14Bg.png',
        duration: 8000
      },
      {
        id: 'slide-15',
        type: 'hero',
        title: 'Obtenga sus resultados personales y siga su proceso',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide15Bg.png',
        duration: 7000
      },
      {
        id: 'slide-16',
        type: 'hero',
        title: 'Podemos devolverle el equilibrio en 120 días',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide16Bg.png',
        duration: 6000
      },
      {
        id: 'slide-17',
        type: 'hero',
        title: '',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide17Bg.png',
        duration: 7000
      },
      {
        id: 'slide-18',
        type: 'hero',
        title: '',
        subtitle: '',
        content: '',
        backgroundGif: '/assets/presentation1/CPZslide18Bg.png',
        duration: 5000
      }
      ,
      // 19-21 blank
      { id: 'slide-19', type: 'hero', title: 'Es fresco y muy saludable', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide19bg.png', duration: 5000 },
      { id: 'slide-20', type: 'hero', title: 'BalanceOil+', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide20bg.png', image: '/assets/presentation1/image92.png', duration: 5000 },
      { id: 'slide-21', type: 'hero', title: 'Nuestros productos son probados por terceros y han sido fabricados de la mejor manera y con el máximo cuidado', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide21bg.png', duration: 5000 },
      // 22 full background
      { id: 'slide-22', type: 'hero', title: 'Hay ventajas saludables para cada etapa vital', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide22bg.png', duration: 6000 },
      // 23 blank
      { id: 'slide-23', type: 'hero', title: 'Estas 18 afirmaciones <strong>aprobadas por la EFSA</strong>', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide23bg.png', duration: 5000 },
      // 24 full background
      { id: 'slide-24', type: 'hero', title: 'El 95 % de las personas que toman suplementos de Zinzino Balance recuperan el equilibrio en 120 días', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide24bg.jpeg', duration: 6000 },
      // 25 full background
      { id: 'slide-25', type: 'hero', title: 'Alcanzar un equilibrio entre el omega-6 y el omega-3 es el primer paso para sentirse bien, estar en forma y sano', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide25bg.jpeg', duration: 6000 },
      // 26, 27, 30 half-right background
      { id: 'slide-26', type: 'half-right', title: 'ZinoBiotic+', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide26bg.jpeg', duration: 6000 },
      { id: 'slide-27', type: 'half-right', title: 'Xtend', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide27bg.jpeg', duration: 6000 },
      // 28-29 blank (commented out for later use)
      // { id: 'slide-28', type: 'hero', title: 'Protocolo de salud de Zinzino', subtitle: '', content: '', backgroundGif: '', duration: 5000 },
      // { id: 'slide-29', type: 'hero', title: 'Protocolo de salud premium', subtitle: '', content: '', backgroundGif: '', duration: 5000 },
      { id: 'slide-30', type: 'half-right', title: 'Viv^+', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide30bg.jpg', duration: 6000 },
      // 31 not specified - commented out for later use
      // { id: 'slide-31', type: 'hero', title: 'BalanceOil+ Kit with Test', subtitle: '', content: '', backgroundGif: '', duration: 5000 },
      // 32 blank
      { id: 'slide-32', type: 'hero', title: 'Obtenga sus productos gratis', subtitle: '', content: '', backgroundGif: '/assets/presentation1/image103.jpeg', duration: 5000 },
      // 33, 34, 35 full backgrounds
      { id: 'slide-33', type: 'hero', title: 'Haga sus sueños realidad', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide33bg.jpeg', duration: 6000 },
      { id: 'slide-34', type: 'hero', title: 'Demos forma al futuro de la nutrición juntos', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide34bg.jpeg', duration: 6000 },
      { id: 'slide-35', type: 'hero', title: '', subtitle: '', content: '', backgroundGif: '/assets/presentation1/slide35bg.jpeg', duration: 6000 },
      // 36 final message slide
      { id: 'slide-36', type: 'final', title: 'We hope you liked the presentation', subtitle: '', content: 'For more information or to get in touch, choose an option below.', backgroundGif: '', duration: 8000 }
    ]
  },
  {
    id: 'super-presentation-pro',
    title: 'How to use PresenT - Tutorial',
    description: 'Learn how to create and share presentations with PresenT',
    createdAt: new Date().toISOString(),
    slides: [
      {
        id: 'slide-1',
        type: 'hero',
        title: 'How to use PresenT',
        subtitle: 'Welcome to the Presentation Maker Tutorial',
        content: 'Learn how to create stunning presentations and share them with your contacts',
        duration: 6000
      },
      {
        id: 'slide-2',
        type: 'hero',
        title: 'Step 1',
        subtitle: 'Create a New Presentation',
        content: 'To create a new presentation, click on the + button at the top of your dashboard and choose from the available templates',
        duration: 8000
      },
      {
        id: 'slide-3',
        type: 'hero',
        title: 'Step 2',
        subtitle: 'Fill Out the Details',
        content: 'Fill out the details of the person you want to send the presentation to. Enter their name, email, and any custom information',
        duration: 8000
      },
      {
        id: 'slide-4',
        type: 'hero',
        title: 'Step 3',
        subtitle: 'Share the Presentation',
        content: 'Share them the link or send it to their email (to be implemented soon). You can copy the share link and send it directly',
        duration: 8000
      },
      {
        id: 'slide-5',
        type: 'hero',
        title: 'Batch Import',
        subtitle: 'Send Multiple Presentations at Once',
        content: 'You can send batches of presentations at once, using Excel sheets of contacts or by typing them out together as text',
        duration: 8000
      },
      {
        id: 'slide-6',
        type: 'hero',
        title: 'Batch Import Step 1',
        subtitle: 'Select Your Input Method',
        content: 'Click on the Batch Import Contacts button that looks like the one above, then select if you want to upload a CSV file or enter contacts as text',
        duration: 8000
      },
      {
        id: 'slide-7',
        type: 'hero',
        title: 'Batch Import Step 2',
        subtitle: 'Upload and Send',
        content: 'Upload the contacts (CSV file or text input), review them, and click "Send in Batch" to create all presentations at once',
        duration: 8000
      }
    ]
  },
  {
    id: 'forest-night-journey',
    title: 'How to use PresenT - Tutorial',
    description: 'Learn how to create and share presentations with PresenT',
    createdAt: new Date().toISOString(),
    slides: [
      {
        id: 'slide-1',
        type: 'hero',
        title: 'How to use PresenT',
        subtitle: 'Welcome to the Presentation Maker Tutorial',
        content: 'Learn how to create stunning presentations and share them with your contacts',
        duration: 6000
      },
      {
        id: 'slide-2',
        type: 'hero',
        title: 'Step 1',
        subtitle: 'Create a New Presentation',
        content: 'To create a new presentation, click on the + button at the top of your dashboard and choose from the available templates',
        duration: 8000
      },
      {
        id: 'slide-3',
        type: 'hero',
        title: 'Step 2',
        subtitle: 'Fill Out the Details',
        content: 'Fill out the details of the person you want to send the presentation to. Enter their name, email, and any custom information',
        duration: 8000
      },
      {
        id: 'slide-4',
        type: 'hero',
        title: 'Step 3',
        subtitle: 'Share the Presentation',
        content: 'Share them the link or send it to their email (to be implemented soon). You can copy the share link and send it directly',
        duration: 8000
      },
      {
        id: 'slide-5',
        type: 'hero',
        title: 'Batch Import',
        subtitle: 'Send Multiple Presentations at Once',
        content: 'You can send batches of presentations at once, using Excel sheets of contacts or by typing them out together as text',
        duration: 8000
      },
      {
        id: 'slide-6',
        type: 'hero',
        title: 'Batch Import Step 1',
        subtitle: 'Select Your Input Method',
        content: 'Click on the Batch Import Contacts button that looks like the one above, then select if you want to upload a CSV file or enter contacts as text',
        duration: 8000
      },
      {
        id: 'slide-7',
        type: 'hero',
        title: 'Batch Import Step 2',
        subtitle: 'Upload and Send',
        content: 'Upload the contacts (CSV file or text input), review them, and click "Send in Batch" to create all presentations at once',
        duration: 8000
      }
    ]
  },
  {
    id: 'omega-balance',
    title: 'Your Omega 3/6 Balance',
    description: 'Understanding your omega-6 and omega-3 fatty acid balance for optimal health',
    createdAt: new Date().toISOString(),
    slides: [
      {
        id: 'slide-1',
        type: 'hero',
        title: 'Hola {{recipientName}}',
        subtitle: '¿Estás interesado en tu salud?',
        content: 'Tengo preguntas para ti',
        duration: 0
      },
      {
        id: 'slide-2',
        type: 'quiz',
        title: '¿Conoces tu balance de omega 6 / 3?',
        subtitle: '',
        content: '',
        duration: 0,
        questions: [
          {
            question: '¿Conoces tu balance de omega 6 / 3?',
            options: ['Sí', 'No']
          }
        ]
      },
      {
        id: 'slide-3-input',
        type: 'quiz',
        title: '¡Genial! ¿Cuál es tu balance?',
        subtitle: 'Ingresa tus valores',
        content: '',
        duration: 0,
        questions: [
          {
            question: 'Omega 6',
            options: []
          },
          {
            question: 'Omega 3',
            options: []
          }
        ]
      },
      {
        id: 'slide-4-unbalanced',
        type: 'hero',
        title: 'Estás desbalanceado',
        subtitle: '',
        content: 'Puede que no estés alcanzando tu máximo potencial de salud y bienestar por ello',
        duration: 0
      },
      {
        id: 'slide-5-balanced',
        type: 'quiz',
        title: '¡Felicidades!',
        subtitle: 'Tienes una proporción perfecta de balance',
        content: '¿Alguno de estos otros problemas te preocupa?',
        duration: 0,
        questions: [
          {
            question: 'Selecciona los que apliquen:',
            options: [
              'Fortaleza del cabello',
              'Problemas digestivos',
              'Energía',
              'Circulación',
              'Claridad mental',
              'Salud cardiovascular',
              'Inflamación',
              'Salud de la piel',
              'Sistema inmunológico',
              'Salud articular',
              'Estado de ánimo',
              'Calidad del sueño'
            ]
          }
        ]
      },
      {
        id: 'slide-6-apology',
        type: 'hero',
        title: 'Perdón por preguntar',
        subtitle: 'Es normal',
        content: 'La mayoría de personas no lo sabe',
        duration: 0
      },
      {
        id: 'slide-7-video1',
        type: 'hero',
        title: 'Este video explica la importancia de este equilibrio de tus niveles de Omega 6 y 3',
        subtitle: '',
        content: '[Video Placeholder 1 - Se actualizará con el enlace más tarde]',
        duration: 0
      },
      {
        id: 'slide-8-question',
        type: 'quiz',
        title: '¿Le gustaría saber su nivel?',
        subtitle: '',
        content: '',
        duration: 0,
        questions: [
          {
            question: '¿Le gustaría saber su nivel?',
            options: ['Sí', 'No']
          }
        ]
      },
      {
        id: 'slide-9-video2',
        type: 'hero',
        title: 'No tengas miedo',
        subtitle: 'Es solo un pinchazito',
        content: '[Video Placeholder 2 - Se actualizará con el enlace más tarde]',
        duration: 0
      },
      {
        id: 'slide-10-final',
        type: 'hero',
        title: 'Consigue tu test aquí:',
        subtitle: '',
        content: '{{storeLink}}',
        duration: 0
      }
    ]
  },
  {
    id: 'omega-balance-space',
    title: 'Your Omega 3/6 Balance - Space Edition',
    description: 'Understanding your omega-6 and omega-3 fatty acid balance with a stunning space-themed experience',
    createdAt: new Date().toISOString(),
    slides: [
      {
        id: 'slide-1',
        type: 'hero',
        title: 'Hola {{recipientName}}',
        subtitle: '¿Estás interesado en tu salud?',
        content: 'Tengo preguntas para ti',
        duration: 0
      },
      {
        id: 'slide-2',
        type: 'quiz',
        title: '¿Conoces tu balance de omega 6 / 3?',
        subtitle: '',
        content: '',
        duration: 0,
        questions: [
          {
            question: '¿Conoces tu balance de omega 6 / 3?',
            options: ['Sí', 'No']
          }
        ]
      },
      {
        id: 'slide-3-input',
        type: 'quiz',
        title: '¡Genial! ¿Cuál es tu balance?',
        subtitle: 'Ingresa tus valores',
        content: '',
        duration: 0,
        questions: [
          {
            question: 'Omega 6',
            options: []
          },
          {
            question: 'Omega 3',
            options: []
          }
        ]
      },
      {
        id: 'slide-4-unbalanced',
        type: 'hero',
        title: 'Estás desbalanceado',
        subtitle: '',
        content: 'Puede que no estés alcanzando tu máximo potencial de salud y bienestar por ello',
        duration: 0
      },
      {
        id: 'slide-5-balanced',
        type: 'quiz',
        title: '¡Felicidades!',
        subtitle: 'Tienes una proporción perfecta de balance',
        content: '¿Alguno de estos otros problemas te preocupa?',
        duration: 0,
        questions: [
          {
            question: 'Selecciona los que apliquen:',
            options: [
              'Fortaleza del cabello',
              'Problemas digestivos',
              'Energía',
              'Circulación',
              'Claridad mental',
              'Salud cardiovascular',
              'Inflamación',
              'Salud de la piel',
              'Sistema inmunológico',
              'Salud articular',
              'Estado de ánimo',
              'Calidad del sueño'
            ]
          }
        ]
      },
      {
        id: 'slide-6-apology',
        type: 'hero',
        title: 'Perdón por preguntar',
        subtitle: 'Es normal',
        content: 'La mayoría de personas no lo sabe',
        duration: 0
      },
      {
        id: 'slide-7-video1',
        type: 'hero',
        title: 'Así se explica la importancia del equilibrio entre Omega 6 y 3',
        subtitle: '',
        content: '',
        duration: 0
      },
      {
        id: 'slide-8-question',
        type: 'quiz',
        title: '¿Le gustaría saber su nivel?',
        subtitle: '',
        content: '',
        duration: 0,
        questions: [
          {
            question: '¿Le gustaría saber su nivel?',
            options: ['Sí', 'No']
          }
        ]
      },
      {
        id: 'slide-9-video2',
        type: 'hero',
        title: 'No tengas miedo',
        subtitle: 'Es solo un pinchazito',
        content: '[Video Placeholder 2 - Se actualizará con el enlace más tarde]',
        duration: 0
      },
      {
        id: 'slide-10-final',
        type: 'hero',
        title: 'Consigue tu test aquí:',
        subtitle: '',
        content: '{{storeLink}}',
        duration: 0
      }
    ]
  },
  {
    id: 'omega-balance-plus',
    title: 'Your Omega 3/6 Balance +',
    description: 'Understanding your omega-6 and omega-3 fatty acid balance with immersive 3D floating assets',
    createdAt: new Date().toISOString(),
    slides: [
      {
        id: 'slide-1',
        type: 'hero',
        title: 'Hola {{recipientName}}',
        subtitle: '¿Estás interesado en tu salud?',
        content: 'Tengo preguntas para ti',
        duration: 0
      },
      {
        id: 'slide-2',
        type: 'quiz',
        title: '¿Conoces tu balance de omega 6 / 3?',
        subtitle: '',
        content: '',
        duration: 0,
        questions: [
          {
            question: '¿Conoces tu balance de omega 6 / 3?',
            options: ['Sí', 'No']
          }
        ]
      },
      {
        id: 'slide-3-input',
        type: 'quiz',
        title: '¡Genial! ¿Cuál es tu balance?',
        subtitle: 'Ingresa tus valores',
        content: '',
        duration: 0,
        questions: [
          {
            question: 'Omega 6',
            options: []
          },
          {
            question: 'Omega 3',
            options: []
          }
        ]
      },
      {
        id: 'slide-4-unbalanced',
        type: 'hero',
        title: 'Estás desbalanceado',
        subtitle: '',
        content: 'Puede que no estés alcanzando tu máximo potencial de salud y bienestar por ello',
        duration: 0
      },
      {
        id: 'slide-5-balanced',
        type: 'quiz',
        title: '¡Felicidades!',
        subtitle: 'Tienes una proporción perfecta de balance',
        content: '¿Alguno de estos otros problemas te preocupa?',
        duration: 0,
        questions: [
          {
            question: 'Selecciona los que apliquen:',
            options: [
              'Fortaleza del cabello',
              'Problemas digestivos',
              'Energía',
              'Circulación',
              'Claridad mental',
              'Salud cardiovascular',
              'Inflamación',
              'Salud de la piel',
              'Sistema inmunológico',
              'Salud articular',
              'Estado de ánimo',
              'Calidad del sueño'
            ]
          }
        ]
      },
      {
        id: 'slide-6-apology',
        type: 'hero',
        title: 'Perdón por preguntar',
        subtitle: 'Es normal',
        content: 'La mayoría de personas no lo sabe',
        duration: 0
      },
      {
        id: 'slide-7-video1',
        type: 'hero',
        title: 'Este video explica la importancia de este equilibrio de tus niveles de Omega 6 y 3',
        subtitle: '',
        content: '[Video Placeholder 1 - Se actualizará con el enlace más tarde]',
        duration: 0
      },
      {
        id: 'slide-8-question',
        type: 'quiz',
        title: '¿Le gustaría saber su nivel?',
        subtitle: '',
        content: '',
        duration: 0,
        questions: [
          {
            question: '¿Le gustaría saber su nivel?',
            options: ['Sí', 'No']
          }
        ]
      },
      {
        id: 'slide-9-video2',
        type: 'hero',
        title: 'No tengas miedo',
        subtitle: 'Es solo un pinchazito',
        content: '[Video Placeholder 2 - Se actualizará con el enlace más tarde]',
        duration: 0
      },
      {
        id: 'slide-10-final',
        type: 'hero',
        title: 'Consigue tu test aquí:',
        subtitle: '',
        content: '{{storeLink}}',
        duration: 0
      }
    ]
  },
  {
    id: 'omega-balance-new',
    title: 'Your Omega 3/6 Balance New',
    description: 'Understanding your omega-6 and omega-3 fatty acid balance with elegant pattern backgrounds',
    createdAt: new Date().toISOString(),
    slides: [
      {
        id: 'slide-1',
        type: 'hero',
        title: 'Hola {{recipientName}}',
        subtitle: '¿Estás interesado en tu salud?',
        content: 'Tengo preguntas para ti',
        duration: 0
      },
      {
        id: 'slide-2',
        type: 'quiz',
        title: '¿Conoces tu balance de omega 6 / 3?',
        subtitle: '',
        content: '',
        duration: 0,
        questions: [
          {
            question: '¿Conoces tu balance de omega 6 / 3?',
            options: ['Sí', 'No']
          }
        ]
      },
      {
        id: 'slide-3-input',
        type: 'quiz',
        title: '¡Genial! ¿Cuál es tu balance?',
        subtitle: 'Ingresa tus valores',
        content: '',
        duration: 0,
        questions: [
          {
            question: 'Omega 6',
            options: []
          },
          {
            question: 'Omega 3',
            options: []
          }
        ]
      },
      {
        id: 'slide-4-unbalanced',
        type: 'hero',
        title: 'Estás desbalanceado',
        subtitle: '',
        content: 'Puede que no estés alcanzando tu máximo potencial de salud y bienestar por ello',
        duration: 0
      },
      {
        id: 'slide-5-balanced',
        type: 'quiz',
        title: '¡Felicidades!',
        subtitle: 'Tienes una proporción perfecta de balance',
        content: '¿Alguno de estos otros problemas te preocupa?',
        duration: 0,
        questions: [
          {
            question: 'Selecciona los que apliquen:',
            options: [
              'Fortaleza del cabello',
              'Problemas digestivos',
              'Energía',
              'Circulación',
              'Claridad mental',
              'Salud cardiovascular',
              'Inflamación',
              'Salud de la piel',
              'Sistema inmunológico',
              'Salud articular',
              'Estado de ánimo',
              'Calidad del sueño'
            ]
          }
        ]
      },
      {
        id: 'slide-6-apology',
        type: 'hero',
        title: 'Perdón por preguntar',
        subtitle: 'Es normal',
        content: 'La mayoría de personas no lo sabe',
        duration: 0
      },
      {
        id: 'slide-7-video1',
        type: 'hero',
        title: 'Este video explica la importancia de este equilibrio de tus niveles de Omega 6 y 3',
        subtitle: '',
        content: '[Video Placeholder 1 - Se actualizará con el enlace más tarde]',
        duration: 0
      },
      {
        id: 'slide-8-question',
        type: 'quiz',
        title: '¿Le gustaría saber su nivel?',
        subtitle: '',
        content: '',
        duration: 0,
        questions: [
          {
            question: '¿Le gustaría saber su nivel?',
            options: ['Sí', 'No']
          }
        ]
      },
      {
        id: 'slide-9-video2',
        type: 'hero',
        title: 'No tengas miedo',
        subtitle: 'Es solo un pinchazito',
        content: '[Video Placeholder 2 - Se actualizará con el enlace más tarde]',
        duration: 0
      },
      {
        id: 'slide-10-final',
        type: 'hero',
        title: 'Consigue tu test aquí:',
        subtitle: '',
        content: '{{storeLink}}',
        duration: 0
      }
    ]
  }
];

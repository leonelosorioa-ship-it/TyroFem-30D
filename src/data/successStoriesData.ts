export interface SuccessStory {
  id: string;
  name: string;
  age: string;
  city: string;
  category: 'tiroides_metabolismo' | 'desbalance_menopausia' | 'fatiga_energia' | 'inflamacion_digestion';
  categoryLabel: string;
  categoryIcon: string;
  initialSymptom: string;
  storyQuote: string;
  fullTestimonial: string;
  keyResults: string[];
  daysCompleted: number;
  rating: number;
  verifiedPurchase: boolean;
  avatarBg: string;
  avatarInitials: string;
  favoriteRecipe: string;
  whatsappQuote?: string;
  date: string;
}

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    name: 'Martha Cecilia Restrepo',
    age: '52 años',
    city: 'Medellín, Antioquia',
    category: 'tiroides_metabolismo',
    categoryLabel: 'Tiroides & Metabolismo',
    categoryIcon: '🦋',
    initialSymptom: 'Hipotiroidismo, metabolismo estancado y lentitud',
    storyQuote: 'Por fin sentí que mi cuerpo despertó. En el día 12 la pesadez en las piernas y la fatiga matutina desaparecieron.',
    fullTestimonial: 'Llevaba más de 4 años diagnosticada con hipotiroidismo y aunque tomaba mi tratamiento médico, siempre sentía que mi digestión estaba paralizada y no bajaba ni un gramo. Empecé el Reto 30D de Tyruss Full mezclándolo con el smoothie verde de piña y linaza. Al día 7 ya no me sentía hinchada y al terminar el día 30 recuperé la vitalidad que no sentía hace una década.',
    keyResults: [
      'Digestión activa todos los días sin laxantes',
      'Desinflamación abdominal notable (-5 cm)',
      'Mayor lucidez mental y energía constante'
    ],
    daysCompleted: 30,
    rating: 5,
    verifiedPurchase: true,
    avatarBg: 'bg-emerald-600',
    avatarInitials: 'MR',
    favoriteRecipe: 'Smoothie Verde Tiroides con Espinaca & Piña',
    whatsappQuote: '“Marié, te juro que es la mejor inversión en mi salud. Ya pedí mi segundo frasco con la promo de 3x2.”',
    date: 'Completado hace 2 semanas'
  },
  {
    id: 'story-2',
    name: 'Claudia Patricia Gómez',
    age: '49 años',
    city: 'Bogotá, D.C.',
    category: 'desbalance_menopausia',
    categoryLabel: 'Balance Hormonal & Sofocos',
    categoryIcon: '🌸',
    initialSymptom: 'Sofocos nocturnos intensos, irritabilidad y mal dormir',
    storyQuote: 'Dormir 7 horas seguidas sin despertarme empapada en sudor fue el mayor regalo del programa.',
    fullTestimonial: 'Los bochornos me despertaban hasta 4 veces por noche y al día siguiente no rendía en mi trabajo. Una amiga de la oficina me recomendó ColShopi y el batido Tyruss Full. El protocolo de hidratación de 2L junto con la toma antes del desayuno me estabilizó el ánimo y los sofocos bajaron en un 90% en la tercera semana.',
    keyResults: [
      'Disminución del 90% en sofocos nocturnos',
      'Sueño profundo y reparador',
      'Estabilidad emocional y menor ansiedad por dulce'
    ],
    daysCompleted: 30,
    rating: 5,
    verifiedPurchase: true,
    avatarBg: 'bg-rose-600',
    avatarInitials: 'CG',
    favoriteRecipe: 'Batido Hormonas en Calma con Crema de Coco',
    whatsappQuote: '“Por fin una guía paso a paso que no te deja sola. El calendario diario me mantuvo motivada.”',
    date: 'Completado hace 1 mes'
  },
  {
    id: 'story-3',
    name: 'Yolanda Mercedes Cuéllar',
    age: '44 años',
    city: 'Cali, Valle del Cauca',
    category: 'inflamacion_digestion',
    categoryLabel: 'Desinflamación & Digestión',
    categoryIcon: '🌿',
    initialSymptom: 'Colon irritable crónico, gases y distensión severa',
    storyQuote: 'Cerrar el botón del pantalón en las tardes sin dolor ni abdomen inflado como balón fue mi gran victoria.',
    fullTestimonial: 'Cualquier comida me caía pesada y terminaba las tardes con un dolor punzante en el abdomen. Con la fibra soluble, la chlorella y la espirulina de Tyruss Full sentí un alivio que no conseguí con pastas costosas. El recetario antiinflamatorio de la app me enseñó a combinar los alimentos correctamente.',
    keyResults: [
      'Cero distensión abdominal después del almuerzo',
      'Flora intestinal protegida y tránsito regular',
      'Menos pesadez post-comidas'
    ],
    daysCompleted: 30,
    rating: 5,
    verifiedPurchase: true,
    avatarBg: 'bg-teal-600',
    avatarInitials: 'YC',
    favoriteRecipe: 'Infusión Digestiva Dorada con Cúrcuma & Tyruss',
    whatsappQuote: '“La textura y el sabor con leche de almendras queda delicioso. Es mi desayuno obligado.”',
    date: 'Completado hace 3 semanas'
  },
  {
    id: 'story-4',
    name: 'Luz Marina Beltrán',
    age: '56 años',
    city: 'Bucaramanga, Santander',
    category: 'fatiga_energia',
    categoryLabel: 'Energía & Vitalidad',
    categoryIcon: '⚡',
    initialSymptom: 'Agotamiento crónico desde las 2 PM, pesadez y desánimo',
    storyQuote: 'Antes necesitaba 4 tazas de café para aguantar el día. Hoy tengo energía natural desde las 6 AM.',
    fullTestimonial: 'A mis 56 años sentía que la energía se me escapaba a media mañana. Estaba escéptica porque he probado muchos productos por internet, pero el respaldo de INVIMA y la atención por WhatsApp de Marié me dieron total confianza. Al día 15 del reto subía escaleras sin fatiga y con ganas de hacer caminata.',
    keyResults: [
      'Energía sostenida sin picos de ansiedad ni taquicardias',
      'Mayor claridad mental y concentración',
      'Mejor rendimiento en caminatas matutinas'
    ],
    daysCompleted: 30,
    rating: 5,
    verifiedPurchase: true,
    avatarBg: 'bg-amber-600',
    avatarInitials: 'LB',
    favoriteRecipe: 'Smoothie Energía Vital con Avena & Frutos Rojos',
    whatsappQuote: '“Mi esposo también empezó a tomarlo al ver mis cambios de ánimo y vitalidad.”',
    date: 'Completado hace 5 días'
  },
  {
    id: 'story-5',
    name: 'Adriana Lucía Pardo',
    age: '38 años',
    city: 'Pereira, Risaralda',
    category: 'tiroides_metabolismo',
    categoryLabel: 'Tiroides & Metabolismo',
    categoryIcon: '🦋',
    initialSymptom: 'Caída de cabello, retención de líquidos en tobillos y piel reseca',
    storyQuote: 'El Selenio y Yodo orgánico marcaron la diferencia. Mi piel y mi cabello recuperaron su brillo.',
    fullTestimonial: 'Sentía las piernas hinchadas al final de la jornada y el cepillo lleno de cabellos. Al entender con las guías diarias cómo actúa el selenio y la espirulina en el balance tiroideo, fui muy juiciosa con la toma de 15g cada mañana. Al día 20 mis tobillos estaban totalmente desinflamados y mi piel mucho más hidratada.',
    keyResults: [
      'Cero retención de líquidos en tobillos',
      'Piel más luminosa y cabello con menos quiebre',
      'Adherencia del 100% en el seguimiento diario'
    ],
    daysCompleted: 30,
    rating: 5,
    verifiedPurchase: true,
    avatarBg: 'bg-emerald-700',
    avatarInitials: 'AP',
    favoriteRecipe: 'Bowl Antiinflamatorio con Semillas de Chía & Tyruss',
    whatsappQuote: '“El seguimiento de la App con el candado de 24 horas te obliga a ser constante y eso hace la magia.”',
    date: 'Completado hace 1 mes'
  },
  {
    id: 'story-6',
    name: 'Esperanza Duarte',
    age: '53 años',
    city: 'Barranquilla, Atlántico',
    category: 'desbalance_menopausia',
    categoryLabel: 'Balance Hormonal & Sofocos',
    categoryIcon: '🌸',
    initialSymptom: 'Ganas de llorar sin motivo, cambios bruscos de humor y calores',
    storyQuote: 'Recuperé la paz interior y mi familia notó el cambio desde la segunda semana.',
    fullTestimonial: 'La etapa de la menopausia me estaba afectando no solo el cuerpo sino la convivencia familiar por la irritabilidad constante. El apoyo emocional que brinda Marié en el chat sumado al polvo nutricional Tyruss Full me dieron la estabilidad que necesitaba. Cumplí los 30 días sin saltarme ninguno.',
    keyResults: [
      'Equilibrio emocional y serenidad',
      'Disminución de bochornos en clima cálido',
      'Alivio de tensión muscular en cuello'
    ],
    daysCompleted: 30,
    rating: 5,
    verifiedPurchase: true,
    avatarBg: 'bg-purple-700',
    avatarInitials: 'ED',
    favoriteRecipe: 'Smoothie Refrescante de Coco & Hierbabuena',
    whatsappQuote: '“Gracias ColShopi por crear algo pensado de verdad para nosotras las mujeres.”',
    date: 'Completado hace 2 semanas'
  }
];

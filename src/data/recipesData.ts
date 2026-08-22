import { Recipe } from '../types';

export const RECIPES_DATA: Recipe[] = [
  {
    id: 'smoothie-verde-tiroides',
    title: 'Batido Verde Tiroides-Active 🦋',
    category: 'tiroides',
    categoryLabel: 'Tiroides & Metabolismo',
    tag: 'Despertar Metabólico',
    prepTime: '5 minutos',
    servings: '1 porción grande',
    description: 'La combinación estrella para estimular la conversión de hormona tiroidea T4 a T3, activar el gasto calórico basal y desinflamar la pared intestinal.',
    tyrussDose: '1 y ¼ cucharada dosificadora de Tyruss Full (Sabor Manzana-Piña)',
    ingredients: [
      '1 y ¼ scoop de Tyruss Full (aporta Selenio, Yodo orgánico, Espirulina y Chlorella)',
      '1/2 manzana verde en cubos (con cáscara para fibra)',
      '1 puñado generoso de espinacas frescas baby',
      '1 trocito pequeño de jengibre fresco (1 cm)',
      'Jugo de 1/2 limón recién exprimido',
      '250 ml de agua purificada o agua de coco natural',
      '3 cubos de hielo'
    ],
    stepByStep: [
      'Lava bien las espinacas y la manzana verde.',
      'Coloca en el vaso de la licuadora el agua, las espinacas, el jengibre y la manzana.',
      'Licúa a velocidad media durante 30 segundos hasta obtener una textura verde uniforme.',
      'Añade el scoop y cuarto de Tyruss Full y los cubos de hielo.',
      'Licúa a velocidad baja durante 20-30 segundos para no calentar la mezcla y conservar todos los antioxidantes.',
      'Sirve inmediatamente y disfrútalo preferiblemente en ayunas o como desayuno.'
    ],
    clinicalBenefit: 'El yodo y selenio de Tyruss Full se unen con los flavonoides de la manzana verde y el gingerol del jengibre para reducir la inflamación tiroidea y combatir la fatiga.',
    accentColor: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'smoothie-hormonas-calma',
    title: 'Smoothie Hormonas en Calma 🌸',
    category: 'hormonas',
    categoryLabel: 'Balance Hormonal & Sofocos',
    tag: 'Control de Sofocos & Ánimo',
    prepTime: '4 minutos',
    servings: '1 porción cremosa',
    description: 'Especialmente formulado para regular la temperatura corporal, amortiguar calores diurnos o nocturnos y nutrir la producción de progesterona.',
    tyrussDose: '1 y ¼ cucharada dosificadora de Tyruss Full',
    ingredients: [
      '1 y ¼ scoop de Tyruss Full',
      '1/2 taza de frutos rojos congelados (arándanos, moras o fresas)',
      '200 ml de leche de coco sin azúcar o leche de almendras',
      '1 cucharadita de semillas de chía o linaza molida',
      'Una pizca de canela en polvo',
      'Hielo al gusto'
    ],
    stepByStep: [
      'Vierte la leche de coco vegetal y los frutos rojos congelados en la licuadora.',
      'Agrega la cucharadita de semillas de chía y la pizca de canela.',
      'Añade tu dosis de Tyruss Full.',
      'Procesa a alta potencia durante 45 segundos hasta obtener una consistencia tipo frappé.',
      'Decora con 2 arándanos encima y bebe a pequeños sorbos conscientes.'
    ],
    clinicalBenefit: 'Los lignanos de la linaza sumados a las antocianinas de los frutos rojos y las grasas saludables de coco estabilizan los receptores estrogénicos disminuyendo los sofocos.',
    accentColor: 'from-rose-500 to-pink-700'
  },
  {
    id: 'smoothie-digestivo',
    title: 'Bebida Digestiva Anti-inflamatoria 🌿',
    category: 'digestivo',
    categoryLabel: 'Digestión & Detox',
    tag: 'Vientre Plano & Cero Gases',
    prepTime: '4 minutos',
    servings: '1 vaso grande',
    description: 'El rescate perfecto para días de pesadez estomacal, digestión lenta o estreñimiento. Elimina la hinchazón en cuestión de horas.',
    tyrussDose: '1 y ¼ cucharada dosificadora de Tyruss Full',
    ingredients: [
      '1 y ¼ scoop de Tyruss Full',
      '1 rodaja gruesa de piña fresca natural',
      '1/3 de pepino con piel (bien lavado)',
      '1 pizca de cúrcuma en polvo con una micro pizca de pimienta',
      '250 ml de agua bien fría',
      'Hojitas de menta fresca'
    ],
    stepByStep: [
      'Corta la piña y el pepino en trozos medianos.',
      'Coloca en la licuadora con el agua fría y licúa hasta que quede bien líquido.',
      'Incorpora Tyruss Full, la cúrcuma y las hojitas de menta.',
      'Bate a velocidad suave por 20 segundos.',
      'Disfruta 30 minutos antes del almuerzo o a media tarde para una digestión sumamente ligera.'
    ],
    clinicalBenefit: 'La bromelina natural de la piña potencia las enzimas digestivas, mientras la clorofila y la fibra de avena/linaza de Tyruss Full aceleran el tránsito intestinal.',
    accentColor: 'from-lime-500 to-emerald-700'
  },
  {
    id: 'bowl-energetico',
    title: 'Bowl Energético Matutino con Avena ⚡',
    category: 'energia',
    categoryLabel: 'Energía & Masa Muscular',
    tag: 'Saciedad Prolongada 4h+',
    prepTime: '6 minutos',
    servings: '1 bowl completo',
    description: 'Ideal para mañanas con días largos de trabajo o estudio. Provee energía sostenida durante más de 4 horas sin caídas de azúcar ni ansiedad.',
    tyrussDose: '1 y ¼ cucharada dosificadora de Tyruss Full',
    ingredients: [
      '1 y ¼ scoop de Tyruss Full',
      '3 cucharadas de avena en hojuelas integrales (hidratadas)',
      '150 ml de leche vegetal tibia o fría',
      '1/2 banano en rodajas',
      '6 almendras picadas o nueces del nogal',
      '1 cucharadita de semillas de girasol o calabaza'
    ],
    stepByStep: [
      'En un bowl, mezcla la avena con la leche vegetal.',
      'Disuelve el Tyruss Full revolviendo con una cuchara hasta formar una crema homogénea y aromática.',
      'Decora en la superficie con las rodajas de banano, las almendras picadas y las semillas.',
      'Espolvorea un toque de canela y disfruta con cuchara masticando despacio.'
    ],
    clinicalBenefit: 'Aporte balanceado de proteína vegetal de arveja, colágeno y carbohidratos complejos de absorción lenta que nutren la masa muscular y evitan la fatiga.',
    accentColor: 'from-amber-500 to-orange-700'
  },
  {
    id: 'elixir-nocturno',
    title: 'Elíxir Nocturno Reparador y Sueño Profundo 🌙',
    category: 'noche',
    categoryLabel: 'Descanso & Sistema Nervioso',
    tag: 'Inductor de Sueño & Melatonina',
    prepTime: '5 minutos',
    servings: '1 taza reconfortante',
    description: 'Tómalo tibio 1 hora antes de acostarte. Relaja la musculatura, silencia la mente acelerada y previene despertares con calor a mitad de la noche.',
    tyrussDose: '1 cucharada dosificadora de Tyruss Full',
    ingredients: [
      '1 scoop de Tyruss Full',
      '200 ml de infusión tibia de manzanilla o flor de azahar (no hirviendo)',
      '1 chorrito de leche de almendras o avena',
      '1/4 cucharadita de canela de ceilán',
      '1 toque de esencia de vainilla natural (opcional)'
    ],
    stepByStep: [
      'Prepara tu infusión de manzanilla y déjala reposar hasta que esté tibia (aprox. 45°C).',
      'En una taza, agrega el chorrito de leche vegetal y el scoop de Tyruss Full.',
      'Vierte la infusión tibia mientras revuelves con un batidor espumador o cuchara.',
      'Agrega la canela y la vainilla.',
      'Tómalo lentamente en un ambiente con luces tenues, sin mirar el celular.'
    ],
    clinicalBenefit: 'El magnesio quelado, la vitamina B6 y la apigenina de la manzanilla facilitan la liberación endógena de GABA para un sueño reparador sin sensación de pesadez matutina.',
    accentColor: 'from-indigo-600 to-purple-800'
  }
];

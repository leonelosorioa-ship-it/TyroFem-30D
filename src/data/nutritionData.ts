import { ProductPackage } from '../types';

export const NUTRITIONAL_FACTS = {
  servingSize: '1 y 1/4 Cucharadas dosificadoras (30 g)',
  servingsPerContainer: 'Aproximadamente 25 porciones',
  netWeight: '500 gramos',
  flavor: 'Deliciosa mezcla refrescante de Piña y Manzana',
  appearance: 'Polvo fino blanco de alta solubilidad',
  shelfLife: '24 meses',
  invimaRecord: 'RSA-0021928-2022',
  manufacturer: 'Laboratorio Unmerco / Natura Trends para ColShopi Tienda',
  qualities: [
    '100% Libre de Soya',
    'Sin Maltodextrina',
    'Sin Azúcares Añadidos',
    'Sin Químicos Agresivos',
    'Apto para Digestión Sensible'
  ],
  tableRows: [
    { nutrient: 'Calorías (Kcal)', per100g: '189', perServing: '38 kcal' },
    { nutrient: 'Grasa total', per100g: '20 g', perServing: '4 g' },
    { nutrient: 'Grasa saturada', per100g: '1 g', perServing: '0.2 g' },
    { nutrient: 'Grasa trans', per100g: '0.0 mg', perServing: '0.0 mg' },
    { nutrient: 'Carbohidratos totales', per100g: '20 g', perServing: '4 g' },
    { nutrient: 'Fibra dietaria', per100g: '30 g', perServing: '6 g (24% VD)' },
    { nutrient: 'Azúcares totales (naturales de frutas)', per100g: '18 g', perServing: '3.6 g' },
    { nutrient: 'Azúcares añadidos', per100g: '0.0 g', perServing: '0.0 g (0%)' },
    { nutrient: 'Proteína vegetal y colágeno', per100g: '5 g', perServing: '1.2 g' },
    { nutrient: 'Sodio', per100g: '128 mg', perServing: '26 mg' },
    { nutrient: 'Potasio', per100g: '188 mg', perServing: '37.6 mg' },
    { nutrient: 'Vitamina A', per100g: '1250 µg ER', perServing: '250 µg ER' },
    { nutrient: 'Vitamina C / Ácido ascórbico', per100g: '150 mg', perServing: '30 mg' },
    { nutrient: 'Calcio', per100g: '122 mg', perServing: '24 mg' },
    { nutrient: 'Hierro (fumarato ferroso)', per100g: '59 mg', perServing: '12 mg' },
    { nutrient: 'Vitamina D', per100g: '25 µg', perServing: '5 µg' },
    { nutrient: 'Vitamina E', per100g: '60 mg', perServing: '12 mg' },
    { nutrient: 'Vitamina B1 (Tiamina)', per100g: '1.7 mg', perServing: '0.34 mg' },
    { nutrient: 'Vitamina B2 (Riboflavina)', per100g: '2.0 mg', perServing: '0.4 mg' },
    { nutrient: 'Vitamina B3 (Niacina)', per100g: '30 mg', perServing: '6.0 mg' },
    { nutrient: 'Vitamina B6 (Piridoxina)', per100g: '2.0 mg', perServing: '0.40 mg' },
    { nutrient: 'Vitamina B8 (Biotina)', per100g: '500 µg', perServing: '100 µg' },
    { nutrient: 'Vitamina B12 (Cobalamina)', per100g: '5.0 µg', perServing: '1.0 µg' },
    { nutrient: 'Magnesio (cloruro de magnesio)', per100g: '99 mg', perServing: '20 mg' },
    { nutrient: 'Zinc (sulfato de zinc)', per100g: '22 mg', perServing: '7.0 mg' },
    { nutrient: 'Selenio (selenito de sodio)', per100g: '17 µg', perServing: '3.4 µg' },
  ]
};

export const SUPERFOOD_INGREDIENTS = [
  {
    name: 'Yodo Orgánico + Selenio',
    role: 'Soporte Tiroideo & Metabolismo',
    description: 'Nutrientes cofactores esenciales que estimulan a la tiroides a convertir la hormona T4 en la activa T3, encendiendo el metabolismo basal.',
    badge: 'Tiroides'
  },
  {
    name: 'Espirulina + Chlorella',
    role: 'Superalimentos Verdes & Detox',
    description: 'Microalgas ricas en clorofila y proteínas vegetales que capturan metales pesados, reducen inflamación y oxigenan la sangre.',
    badge: 'Detox'
  },
  {
    name: 'Crema de Coco & Omega 3',
    role: 'Grasas Saludables & Hormonas',
    description: 'Grasas de cadena media (MCT) que dan energía inmediata y ácidos grasos esenciales que amortiguan sofocos y modulan estrógenos.',
    badge: 'Hormonas'
  },
  {
    name: 'Linaza Molida + Harina de Avena',
    role: 'Fibra Dietaria & Microbiota',
    description: 'Aporta 6g de fibra por porción, combatiendo el estreñimiento suavemente y saciando el apetito sin hinchazón.',
    badge: 'Digestión'
  },
  {
    name: 'Proteína de Arveja + Colágeno Hidrolizado',
    role: 'Masa Muscular & Piel Firme',
    description: 'Favorece la tonificación corporal femenina, fortalece uñas, cabello y regenera la mucosa intestinal.',
    badge: 'Vitalidad'
  },
  {
    name: 'Espinaca, Banano, Aguacate & Piña',
    role: 'Frutas & Vegetales Funcionales',
    description: 'Aporte natural de potasio, enzimas digestivas como bromelina y antioxidantes protectores de la célula.',
    badge: 'Nutrición'
  }
];

export const FREE_GIFT_INFO = {
  name: 'Loción Termoactiva Refrescante & Relajante 🌿🔥',
  tagline: 'Obsequio 100% GRATIS con cada pedido de Tyruss Full',
  description: 'Un complemento de bienestar corporal de uso tópico diseñado para aliviar molestias musculares, pesadez en piernas, tensión en cuello/hombros y cansancio acumulado tras jornadas intensas.',
  ingredients: [
    'Árnica: Tradicional para alivio muscular y desinflamación.',
    'Hamamelis: Promueve la microcirculación y descanso de piernas.',
    'Castaño de Indias: Favorece el retorno venoso y sensación de ligereza.',
    'Uña de Gato: Reconocida planta amazónica anti-tensión.',
    'Chuchuguaza: Aliada ancestral para la relajación articular y muscular.'
  ],
  usage: 'Pulverizar a 20 cm del área con tensión (piernas, espalda, cuello). No requiere frotar ni masajear. Usar hasta 4 veces al día.'
};

export const BATIDO_VERDE_INFO = {
  name: 'Batido Verde Detox Pre-Tratamiento 🌱',
  regularPrice: 25000,
  promoPrice: 15000,
  description: 'Sobre concentrado de 20g con espirulina, avena, espinaca, jengibre, cúrcuma, apio y vitamina C para una limpieza digestiva inicial que multiplica la absorción de Tyruss Full.',
  usage: 'Mezclar el sobre en 200 ml de agua y tomar en la noche antes de iniciar el reto de 30 días.'
};

export const OFFICIAL_PACKAGES: ProductPackage[] = [
  {
    id: 'pack-1',
    title: '1 Tarro Tyruss Full (500g)',
    jars: 1,
    price: 89900,
    regularPrice: 115000,
    tag: 'Fase Inicial (25 Días)',
    freeGift: 'Loción Termoactiva GRATIS 🎁',
    shipping: 'Envío GRATIS a toda Colombia 🚚',
    features: [
      '1 Tarro de 500g (25 porciones completas)',
      'Loción Termoactiva Herbal de REGALO 🎁',
      'Acceso vitalicio a la App TyroFem 30D',
      'Envío GRATIS y Pago Contra Entrega',
      'Acompañamiento por WhatsApp con Marié'
    ]
  },
  {
    id: 'pack-2',
    title: '2 Tarros Tyruss Full (1000g)',
    jars: 2,
    price: 134850,
    regularPrice: 230000,
    tag: '🔥 Más Recomendado por Marié',
    isPopular: true,
    freeGift: 'Loción Termoactiva GRATIS 🎁',
    shipping: 'Envío GRATIS a toda Colombia 🚚',
    features: [
      '2 Tarros de 500g (50 días de tratamiento continuo)',
      'Ahorras $95.150 con precio especial',
      'Loción Termoactiva Herbal de REGALO 🎁',
      'Garantiza completar los 30 días y fijar metabolismo',
      'Envío GRATIS y Pago Contra Entrega',
      'Acompañamiento prioritario con Marié – Guía de Bienestar'
    ]
  },
  {
    id: 'pack-3',
    title: 'Pagas 2 y Llevas 3 Tarros',
    jars: 3,
    price: 179800,
    regularPrice: 345000,
    tag: '⭐ Tratamiento Completo 75 Días',
    isBestValue: true,
    freeGift: 'Loción Termoactiva GRATIS 🎁',
    shipping: 'Envío GRATIS a toda Colombia 🚚',
    features: [
      '3 Tarros de 500g (75 días de bienestar)',
      'Pagas solo 2 tarros y el 3ro es GRATIS',
      'Loción Termoactiva Herbal de REGALO 🎁',
      'Ideal para fijación metabólica profunda y menopausia',
      'Envío GRATIS y Pago Contra Entrega',
      'Asesoría continua por WhatsApp'
    ]
  },
  {
    id: 'pack-5',
    title: 'Pagas 3 y Llevas 5 Tarros (Familiar)',
    jars: 5,
    price: 269700,
    regularPrice: 575000,
    tag: '💎 Máximo Ahorro Familiar',
    freeGift: 'Loción Termoactiva GRATIS 🎁',
    shipping: 'Envío GRATIS a toda Colombia 🚚',
    features: [
      '5 Tarros de 500g (125 días de tratamiento)',
      '2 Tarros 100% GRATIS',
      'Loción Termoactiva Herbal de REGALO 🎁',
      'Para compartir con madre, hijas o amigas',
      'Envío GRATIS y Pago Contra Entrega'
    ]
  }
];

export const COLSHOPI_INFO = {
  storeName: 'ColShopi Tienda By Leps Digital',
  creatorName: 'Marié – Guía de Bienestar & Hábitos Saludables',
  phone: '3104007428',
  phoneInternational: '+573104007428',
  instagram: 'https://www.instagram.com/colshopitienda',
  city: 'Medellín, Colombia',
  deliveryTime: '2 a 5 días hábiles a nivel nacional (1 a 2 días en ciudades principales: Bogotá, Medellín, Cali, Barranquilla)',
  paymentMethod: 'Pago Contra Entrega en efectivo al recibir'
};

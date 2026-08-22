import { ChatMessage } from '../types';

export const INITIAL_MARIE_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome-1',
    sender: 'marie',
    text: '¡Hola hermosa! 🌿💚 ¿Cómo estás hoy?\n\nSoy **Marié**, experta en nutrición y bienestar integral de **ColShopi Tienda By Leps Digital** 💚. Esta aplicación es nuestro obsequio exclusivo para garantizar que tengas los mejores resultados en tu transformación.',
    timestamp: 'Ahora'
  },
  {
    id: 'msg-welcome-2',
    sender: 'marie',
    text: 'Cuéntame… ¿Cuál de estas situaciones se parece más a lo que estás viviendo actualmente? 👇\n\n1️⃣ **Tengo hipotiroidismo o siento que mi metabolismo está demasiado lento** 🦋\n2️⃣ **Tengo problemas hormonales, sofocos, ansiedad o cambios de humor** 🌸\n3️⃣ **Me siento cansada, agotada o sin energía la mayor parte del día** ⚡\n4️⃣ **Sufro de inflamación, digestión pesada o estreñimiento frecuente** 🌿\n\nToca una de las opciones rápidas o escríbeme lo que sientas.',
    timestamp: 'Ahora',
    quickReplies: [
      '1️⃣ Tiroides & Metabolismo Lento 🦋',
      '2️⃣ Sofocos & Desbalance Hormonal 🌸',
      '3️⃣ Fatiga & Falta de Energía ⚡',
      '4️⃣ Inflamación & Digestión Pesada 🌿',
      '🥤 ¿Cómo se toma y prepara?',
      '🛡️ ¿Tiene registro INVIMA?',
      '🎁 ¿Cuál es mi obsequio?',
      '📦 Ver Promociones y Precios'
    ]
  }
];

export interface FaqTopic {
  triggers: string[];
  response: string;
  quickReplies?: string[];
  actionLink?: ChatMessage['actionLink'];
  isVoiceNote?: boolean;
  voiceDuration?: string;
}

export const FAQ_KNOWLEDGE_BASE: FaqTopic[] = [
  {
    triggers: ['1', 'tiroides', 'hipotiroidismo', 'metabolismo', 'lento', 'peso', 'subir de peso', 'adelgazar'],
    response: '🦋 Te entiendo perfectamente… y debe ser muy frustrante sentir que haces de todo y aun así tu cuerpo no responde igual 💜\n\nMuchas mujeres con metabolismo o tiroides lenta sienten cansancio, inflamación, pesadez y acumulación de grasa.\n\n**Tyruss Full** aporta nutrientes esenciales como **Yodo orgánico y Selenio**, que ayudan a apoyar la función tiroidea mientras nutres tu cuerpo desde adentro con espirulina, chlorella y fibra 🌿.\n\nMuchas de nuestras clientas empiezan a sentirse más ligeras, más activas y con mejor bienestar desde los primeros días ✨.\n\n👉 *Cuéntame… ¿lo que más te afecta es el cansancio o la sensación de inflamación?*',
    quickReplies: [
      'Me afecta más el cansancio',
      'Me afecta más la inflamación',
      '¿Qué alimentos debo evitar?',
      '¿Cómo debo tomar Tyruss Full?'
    ],
    actionLink: {
      text: 'Ver cómo ayuda a la Tiroides en el Calendario 📅',
      type: 'recipe',
      targetId: 'smoothie-verde-tiroides'
    }
  },
  {
    triggers: ['2', 'hormonas', 'hormonal', 'sofocos', 'calores', 'menopausia', 'sudores', 'humor', 'ansiedad', 'ciclos', 'spm', 'colicos'],
    response: '🌸 Debe ser muy incómodo pasar por eso… muchas mujeres durante cambios hormonales o la etapa de menopausia sienten exactamente lo mismo 💜\n\nLos sofocos, la irritabilidad y el agotamiento suelen aparecer cuando el cuerpo experimenta fluctuaciones estrogénicas y necesita más equilibrio y soporte nutricional.\n\n**Tyruss Full** aporta superalimentos como crema de coco, linaza molida, omega 3 y antioxidantes que ayudan a apoyar el bienestar hormonal y energético 🌿.\n\nMuchas mujeres nos cuentan que empiezan a sentirse más estables, más tranquilas y con menor frecuencia de calores.\n\n👉 *¿También estás sintiendo mucho cansancio durante el día o te cuesta dormir de noche?*',
    quickReplies: [
      'Me cuesta mucho dormir por los calores',
      'Tengo mucha ansiedad y cansancio',
      'Receta de Smoothie Hormonas en Calma',
      'Pedir Asesoría por WhatsApp'
    ],
    actionLink: {
      text: 'Ver Receta Hormonas en Calma 🌸',
      type: 'recipe',
      targetId: 'smoothie-hormonas-calma'
    }
  },
  {
    triggers: ['3', 'energia', 'cansancio', 'fatiga', 'agotada', 'sin energia', 'agotamiento', 'sueño', 'despertar cansada'],
    response: '💜 Te entiendo con el corazón… y muchas mujeres nos dicen exactamente lo mismo: "Despierto tan cansada como me acosté".\n\nA veces el cuerpo empieza a sentirse pesado, lento y sin chispa no por pereza, sino porque las mitocondrias celulares carecen de cofactores nutricionales como el complejo B, magnesio, hierro y proteínas limpias ✨.\n\nLa crema de coco, la proteína de arveja y el banano en polvo de **Tyruss Full** proporcionan energía limpia y sostenida sin picos de azúcar ni caídas por cafeína ⚡.\n\n👉 *¿Sueles depender del café en las tardes o te da bajón de energía a las 3:00 PM?*',
    quickReplies: [
      'Me da el bajón a las 3:00 PM',
      'Dependo del café',
      'Ver Bowl Energético Matutino ⚡',
      '¿Cómo tomarlo en la mañana?'
    ],
    actionLink: {
      text: 'Ver Bowl Energético Matutino ⚡',
      type: 'recipe',
      targetId: 'bowl-energetico'
    }
  },
  {
    triggers: ['4', 'digestion', 'estreñimiento', 'inflamacion', 'pesadez', 'hinchada', 'gases', 'colon', 'vientre'],
    response: '🌿 Uf… muchas mujeres nos escriben sintiéndose exactamente así y sé lo incómodo que puede llegar a ser tener el vientre hinchado después de cada comida.\n\nCuando la digestión no funciona bien, el cuerpo acumula toxinas, se siente pesado, con estreñimiento y sin energía.\n\n**Tyruss Full** combina 6 gramos de fibra natural (linaza molida y harina de avena) junto con **clorofila, espirulina y chlorella** que ayudan a limpiar suavemente el tránsito intestinal sin laxantes agresivos ✨.\n\n👉 *¿Lo que más te incomoda es el estreñimiento o la inflamación después de comer?*',
    quickReplies: [
      'El estreñimiento me incomoda más',
      'La inflamación después de comer',
      '¿Qué es el Batido Verde previo?',
      'Ver Bebida Digestiva Antiinflamatoria'
    ],
    actionLink: {
      text: 'Ver Bebida Digestiva Antiinflamatoria 🌿',
      type: 'recipe',
      targetId: 'smoothie-digestivo'
    }
  },
  {
    triggers: ['como tomar', 'como se toma', 'como preparo', 'preparacion', 'dosis', 'cucharada', 'horario', 'en ayunas'],
    response: '🥤 **¡Es súper fácil de preparar y delicioso!**\n\nSolo debes mezclar:\n✨ **1 cucharada + 1/4 dosificadora** de Tyruss Full (aprox. 20g) en un vaso de agua, leche vegetal o tu bebida favorita (200-250 ml).\n\nLuego:\n✔ Revuelves o licúas durante 1 minuto.\n✔ Puedes tomarlo frío o caliente (sabor natural a piña y manzana 🍏🍍).\n✔ *Tip de Marié:* Con unos cubitos de hielo queda como un batido refrescante delicioso 🌿💚.\n\n⏰ **Momento ideal:** En ayunas o con el desayuno para aprovechar sus nutrientes y arrancar con toda la energía.',
    quickReplies: [
      '¿Lo puedo tomar con leche de almendras?',
      '¿Cuántas porciones rinde el tarro?',
      'Ver Recetario de Batidos'
    ]
  },
  {
    triggers: ['invima', 'registro', 'seguro', 'seguridad', 'legal', 'daño', 'contraindicaciones', 'laboratorio'],
    response: '🛡️ **Puedes sentirte con total tranquilidad y seguridad 💚**\n\n**Tyruss Full** cuenta con **Registro Sanitario INVIMA Oficial: RSA-0021928-2022** ✅.\n\nEs un alimento funcional desarrollado en Colombia por laboratorio certificado, libre de soya, sin maltodextrina, sin azúcar añadida y sin fármacos químicos agresivos. Miles de mujeres en todo el país lo consumen a diario con excelente tolerancia digestiva.\n\n*(Nota médica: Como todo suplemento nutricional, si estás en embarazo, lactancia o bajo tratamiento específico, siempre es prudente comentarlo con tu médico de confianza).*',
    quickReplies: [
      'Ver Ficha Técnica y Tabla Nutricional',
      '¿Quién fabrica Tyruss Full?',
      'Quiero hacer un pedido'
    ]
  },
  {
    triggers: ['obsequio', 'regalo', 'locion', 'termoactiva', 'dolor', 'piernas cansadas', 'gratis'],
    response: '🎁 **¡Queremos consentirte como te lo mereces!** 💚\n\nPor la compra de tu Tyruss Full, recibes **100% GRATIS nuestra Loción Termoactiva Herbal 🌿🔥**.\n\nEs una loción de uso corporal formulada con extractos botánicos de **Árnica, Hamamelis, Castaño de Indias, Uña de Gato y Chuchuguaza**.\n\nEs maravillosa para pulverizar en piernas cansadas, cuello, hombros o zona lumbar tras un día pesado, brindando frescura, alivio y relajación muscular inmediata ✨.',
    quickReplies: [
      '¿Cómo se aplica la loción?',
      'Ver Promociones con Obsequio 🎁',
      'Pedir por WhatsApp'
    ]
  },
  {
    triggers: ['batido verde', 'detox previo', 'limpieza', 'sobre', '15000', 'promo batido'],
    response: '🌱 **El Batido Verde Detox es el complemento perfecto:**\n\nEs un sobre concentrado (20g) con espirulina, avena, espinaca, jengibre, cúrcuma, apio y vitamina C.\n\n💡 *¿Por qué lo recomendamos antes de empezar?*\nPorque un cuerpo desinflamado y limpio absorbe hasta el doble de rápido los nutrientes de Tyruss Full. Se toma una sola noche en 200 ml de agua antes de iniciar.\n\n💰 Precio regular: $25.000 → **Solo $15.000** al agregarlo a tu pedido de Tyruss Full 💚.',
    quickReplies: [
      'Quiero agregarlo a mi pedido',
      'Ver paquetes de Tyruss Full',
      'Hablar con Marié por WhatsApp'
    ]
  },
  {
    triggers: ['precio', 'cuanto vale', 'costo', 'promociones', 'oferta', 'comprar', 'tarros', 'pedido', 'pago', 'contra entrega'],
    response: '💰 **Estas son las Promociones Oficiales de Tyruss Full en ColShopi Tienda:**\n\n1️⃣ **1 Tarro (500g / 25 tomas):** $89.900 + Loción Termoactiva GRATIS 🎁\n\n🔥 **OFERTAS ESPECIALES DEL DÍA:**\n2️⃣ **2 Tarros (1000g / 50 tomas):** $134.850 + Obsequio 🎁 *(¡La opción más elegida!)*\n3️⃣ **Pagas 2 y Llevas 3 Tarros:** $179.800 + Obsequio 🎁 *(Ahorro máximo)*\n4️⃣ **Pagas 3 y Llevas 5 Tarros:** $269.700 + Obsequio 🎁 *(Pack Familiar)*\n\n🚚 **Envío 100% GRATIS a toda Colombia**\n💵 **Pago Contra Entrega** (Pagas en efectivo al recibir en tu casa)',
    quickReplies: [
      'Quiero 2 Tarros ($134.850)',
      'Quiero 3 Tarros ($179.800)',
      'Quiero 1 Tarro ($89.900)',
      'Pedir directamente por WhatsApp 📲'
    ],
    actionLink: {
      text: 'Abrir Formulario de Pedido Rápido 📦',
      type: 'order'
    }
  },
  {
    triggers: ['alimentos evitar', 'dieta', 'que no comer', 'prohibidos', 'tiroides dieta', 'inflaman'],
    response: '🥗 **Consejo Clave de la Nutricionista Marié:**\n\nSi sientes tu tiroides o metabolismo perezoso, procura reducir:\n\n❌ **Azúcares refinados y jarabes de alta fructosa** (provocan picos de insulina y fatiga).\n❌ **Grasas trans y aceites vegetales ultraprocesados** (soya, palma, maíz comercial).\n❌ **Harinas blancas refinadas** (inflaman la pared del intestino y bloquean la absorción de selenio).\n❌ **Golosinas con colorantes artificiales**.\n\n✅ **En cambio, prioriza:** Aguacate, aceite de oliva, frutos secos, espinacas, manzana verde, huevos, proteínas magras y tu porción diaria de Tyruss Full 🌿💚.',
    quickReplies: [
      '¿El gluten afecta la tiroides?',
      'Ver Recetario Saludable',
      '¿Cómo va mi progreso en el Calendario?'
    ]
  },
  {
    triggers: ['whatsapp', 'asesoria', 'contacto', 'telefono', 'hablar con marie', 'atencion'],
    response: '📲 **¡Claro que sí mi bella!**\n\nPuedes chatear directamente conmigo o con mi equipo en la línea oficial de ColShopi Tienda en Colombia: **310 400 7428** 💚.\n\nAtendemos de lunes a sábado con todo el cariño y resolvemos tus inquietudes para tomar tu pedido con envío gratis y pago contra entrega.',
    actionLink: {
      text: 'Chatear en WhatsApp Oficial (+57 310 400 7428) 💬',
      type: 'whatsapp',
      url: 'https://wa.me/573104007428?text=Hola%20Marié,%20estoy%20en%20la%20App%20TyroFem%2030D%20y%20quiero%20hacerte%20una%20consulta%20sobre%20Tyruss%20Full'
    }
  }
];

export function getMarieResponse(userText: string): {
  text: string;
  quickReplies?: string[];
  actionLink?: ChatMessage['actionLink'];
  isVoiceNote?: boolean;
  voiceDuration?: string;
} {
  const normalized = userText.toLowerCase().trim();

  // Check against knowledge base triggers
  for (const topic of FAQ_KNOWLEDGE_BASE) {
    if (topic.triggers.some(trigger => normalized.includes(trigger))) {
      return {
        text: topic.response,
        quickReplies: topic.quickReplies,
        actionLink: topic.actionLink,
        isVoiceNote: topic.isVoiceNote,
        voiceDuration: topic.voiceDuration
      };
    }
  }

  // Empathetic default response in Marié's voice
  return {
    text: `Te entiendo perfectamente 💜. Muchas mujeres pasan por situaciones similares cuando el cuerpo necesita un apoyo nutricional profundo 🌿.\n\nEn **ColShopi Tienda**, formulamos **Tyruss Full** precisamente con superalimentos (espirulina, chlorella, selenio, yodo orgánico y fibra) para ayudar a desinflamar, reactivar el metabolismo y devolverte tu vitalidad natural ✨.\n\n👉 *¿Te gustaría que revisemos el modo de uso, las promociones vigentes con la Loción Termoactiva de regalo, o prefieres consultar un síntoma en específico?*`,
    quickReplies: [
      '🥤 ¿Cómo se prepara y toma?',
      '📦 Ver Promociones y Precios',
      '🦋 ¿Cómo ayuda a la tiroides?',
      '📲 Chatear por WhatsApp con Marié'
    ],
    actionLink: {
      text: 'Pedir Asesoría Directa por WhatsApp 💬',
      type: 'whatsapp',
      url: `https://wa.me/573104007428?text=Hola%20Marié,%20tengo%20una%20pregunta%20sobre:%20${encodeURIComponent(userText)}`
    }
  };
}

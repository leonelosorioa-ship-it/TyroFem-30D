import { ChatMessage } from '../types';

export const INITIAL_MARIE_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome-1',
    sender: 'marie',
    text: '¡Hola hermosa! 🌿💚 ¿Cómo estás hoy?\n\nSoy **Marié**, tu **Asistente Virtual Inteligente y Guía de Bienestar de ColShopi Tienda** 💚🤖. Estoy aquí para acompañarte día a día durante tu "Reto de 30 Días de Hábitos Saludables y Bienestar" junto a **Tyruss Full** con certificación INVIMA.',
    timestamp: 'Ahora'
  },
  {
    id: 'msg-welcome-2',
    sender: 'marie',
    text: 'Cuéntame… ¿Cuál de estas situaciones se parece más a lo que estás viviendo actualmente? 👇\n\n1️⃣ **Quiero reactivar mi metabolismo y cuidar mi tiroides con buenos hábitos** 🦋\n2️⃣ **Tengo cambios hormonales, sofocos o fatiga frecuente** 🌸\n3️⃣ **Me siento cansada, sin energía o con sueño durante el día** ⚡\n4️⃣ **Sufro de inflamación, pesadez o digestión lenta** 🌿\n\nToca una de las opciones rápidas o escríbeme lo que sientas.',
    timestamp: 'Ahora',
    quickReplies: [
      '1️⃣ Tiroides & Metabolismo 🦋',
      '2️⃣ Sofocos & Bienestar Hormonal 🌸',
      '3️⃣ Energía & Vitalidad Diaria ⚡',
      '4️⃣ Digestión & Desinflamación 🌿',
      '🥤 ¿Cómo se toma y prepara?',
      '🛡️ ¿Tiene registro INVIMA?',
      '🤖 ¿Quién es Marié?',
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
    triggers: ['quien eres', 'eres nutricionista', 'eres medica', 'eres doctora', 'eres ia', 'eres real', 'eres robot', 'profesional de la salud', 'dietista'],
    response: '🤖 **¡Hola! Te cuento con total transparencia sobre mí:**\n\nSoy **Marié**, la **Asistente Virtual Inteligente y Guía de Bienestar de ColShopi Tienda** 🌿💚.\n\n✨ **¿Cuál es mi labor?**\nAcompañarte durante tu Reto de 30 Días con ideas de menús balanceados, recetas saludables, pautas de hidratación, motivación constante y resolver tus dudas sobre los beneficios e ingredientes de nuestros productos con certificación INVIMA (como **Tyruss Full**).\n\n📌 **Aclaración importante de salud:**\nNo soy médica, nutricionista ni dietista profesional. Mi objetivo es guiarte en hábitos saludables cotidianos. Si presentas condiciones médicas agudas, síntomas severos o patologías específicas, recuerda siempre consultar con tu médico especialista tratante 👩🏻‍⚕️💜.',
    quickReplies: [
      '🥤 ¿Cómo se toma Tyruss Full?',
      '🥗 Ideas de menús saludables',
      '🛡️ Certificación INVIMA',
      '💬 Hablar con el equipo ColShopi'
    ]
  },
  {
    triggers: ['1', 'tiroides', 'hipotiroidismo', 'metabolismo', 'lento', 'peso', 'subir de peso', 'adelgazar'],
    response: '🦋 Te entiendo perfectamente… y sé lo frustrante que puede ser sentir que el metabolismo va a un ritmo más lento 💜\n\nMuchas mujeres experimentan cansancio, pesadez o inflamación cuando sus hábitos y su tiroides necesitan un apoyo nutricional balanceado.\n\n**Tyruss Full** aporta nutrientes funcionales clave como **Yodo orgánico y Selenio**, además de espirulina, chlorella y fibra natural 🌿, que apoyan el bienestar metabólico general dentro de un estilo de vida activo y saludable.\n\n*(Recuerda: Si tienes un diagnóstico de hipotiroidismo severo u otra patología médica, es fundamental mantener los controles periódicos con tu médico tratante).* ✨\n\n👉 *Cuéntame… ¿lo que más te gustaría mejorar es tu nivel de energía o la ligereza digestiva?*',
    quickReplies: [
      'Mejorar mi energía diaria',
      'Mejorar mi digestión',
      'Ideas de alimentos balanceados',
      '¿Cómo tomar Tyruss Full?'
    ],
    actionLink: {
      text: 'Ver cómo apoya el Bienestar en el Calendario 📅',
      type: 'recipe',
      targetId: 'smoothie-verde-tiroides'
    }
  },
  {
    triggers: ['2', 'hormonas', 'hormonal', 'sofocos', 'calores', 'menopausia', 'sudores', 'humor', 'ansiedad', 'ciclos', 'spm', 'colicos'],
    response: '🌸 Comprendo lo incómodos que pueden ser los sofocos y los cambios en el estado de ánimo durante las distintas etapas hormonales 💜\n\nEl cuerpo suele beneficiarse enormemente de una alimentación antiinflamatoria, hidratación óptima y nutrientes con antioxidantes y ácidos grasos saludables.\n\n**Tyruss Full** incluye ingredientes naturales como crema de coco, linaza molida y antioxidantes que complementan tus hábitos diarios para favorecer una sensación de mayor calma, confort y estabilidad energética 🌿.\n\n*(Nota de bienestar: Ante cualquier síntoma agudo o cambio hormonal severo, siempre te aconsejo consultar con tu ginecólogo o médico tratante).* ✨\n\n👉 *¿Te cuesta conciliar el sueño por las noches o sientes más fatiga durante el día?*',
    quickReplies: [
      'Me cuesta dormir bien',
      'Siento mucha fatiga en el día',
      'Receta de Smoothie Hormonas en Calma',
      'Pedir Asistencia por WhatsApp'
    ],
    actionLink: {
      text: 'Ver Receta Hormonas en Calma 🌸',
      type: 'recipe',
      targetId: 'smoothie-hormonas-calma'
    }
  },
  {
    triggers: ['3', 'energia', 'cansancio', 'fatiga', 'agotada', 'sin energia', 'agotamiento', 'sueño', 'despertar cansada'],
    response: '💜 Te comprendo totalmente… muchas mujeres sienten que despiertan sin la energía suficiente para rendir en el día.\n\nPara que nuestras células funcionen con vitalidad, es clave mantener una buena hidratación, descanso reparador y nutrientes limpios sin depender de estimulantes artificiales ✨.\n\nLa combinación de proteína vegetal, crema de coco y micronutrientes en **Tyruss Full** aporta una fuente de nutrición limpia y sostenida sin provocar picos bruscos de azúcar ⚡.\n\n👉 *¿Sueles tomar café en las tardes o sientes el bajón de energía después del almuerzo?*',
    quickReplies: [
      'Siento el bajón en la tarde',
      'Tomo mucho café',
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
    response: '🌿 Sé lo molesto que resulta tener pesadez e inflamación después de comer.\n\nUn tránsito digestivo ligero depende de tres pilares: consumir suficiente fibra saludable, tomar al menos 2 litros de agua al día y realizar pausas conscientes de movimiento.\n\n**Tyruss Full** aporta fibra natural de linaza y avena, junto con **espirulina y chlorella**, que ayudan a promover la regularidad digestiva y una sensación de ligereza sin acudir a laxantes agresivos ✨.\n\n*(Si experimentas dolor abdominal agudo o persistente, recuerda acudir a valoración médica).* 🩺\n\n👉 *¿Lo que más te inquieta es el estreñimiento o la pesadez estomacal?*',
    quickReplies: [
      'El estreñimiento',
      'La pesadez después de comer',
      'Consejos de hidratación diaria',
      'Ver Bebida Digestiva Saludable'
    ],
    actionLink: {
      text: 'Ver Bebida Digestiva Saludable 🌿',
      type: 'recipe',
      targetId: 'smoothie-digestivo'
    }
  },
  {
    triggers: ['como tomar', 'como se toma', 'como preparo', 'preparacion', 'dosis', 'cucharada', 'horario', 'en ayunas'],
    response: '🥤 **¡Es muy fácil y práctico de preparar!**\n\n1. Agrega **1 cucharada + 1/4 dosificadora** de Tyruss Full (aprox. 20g) en un vaso de agua, bebida vegetal o tu jugo favorito (200 a 250 ml).\n2. Mezcla o licúa durante 1 minuto hasta lograr una textura homogénea.\n3. Disfruta de su agradable sabor natural a piña y manzana 🍏🍍.\n\n💡 *Tip de Marié:* Puedes tomarlo en ayunas o junto con tu desayuno para empezar tu día con nutrición e hidratación.\n\n*(Recuerda complementar con tus 2 litros de agua a lo largo del día para que la fibra actúe al máximo).* 💧',
    quickReplies: [
      '¿Lo puedo tomar con leche de almendras?',
      '¿Cuántas porciones rinde el tarro?',
      'Ver Recetario de Batidos'
    ]
  },
  {
    triggers: ['invima', 'registro', 'seguro', 'seguridad', 'legal', 'daño', 'contraindicaciones', 'laboratorio'],
    response: '🛡️ **Tranquilidad y respaldo oficial:**\n\n**Tyruss Full** cuenta con **Registro Sanitario INVIMA Oficial: RSA-0021928-2022** ✅ (Alimento en polvo para consumo humano).\n\nEs un alimento funcional formulado en Colombia por laboratorio certificado, libre de azúcar añadida, sin soya ni fármacos artificiales. Miles de mujeres lo incorporan diariamente en sus rutinas de bienestar.\n\n*(Recordatorio de seguridad: Si estás en periodo de embarazo, lactancia o bajo prescripción médica estricta, siempre es aconsejable mostrar la tabla nutricional a tu médico de cabecera).* 👩🏻‍⚕️',
    quickReplies: [
      'Ver Ficha Técnica e Ingredientes',
      '¿Quién elabora Tyruss Full?',
      'Quiero hacer un pedido'
    ]
  },
  {
    triggers: ['obsequio', 'regalo', 'locion', 'termoactiva', 'dolor', 'piernas cansadas', 'gratis'],
    response: '🎁 **¡Un regalo especial para tu bienestar!** 💚\n\nPor la compra de tu tarro de Tyruss Full en ColShopi Tienda, recibes **100% GRATIS nuestra Loción Termoactiva Herbal 🌿🔥**.\n\nFormulada con extractos botánicos de **Árnica, Hamamelis, Castaño de Indias, Uña de Gato y Chuchuguaza**, es perfecta para masajear piernas cansadas, hombros o zona lumbar tras una jornada intensa, brindando frescura y sensación de alivio ✨.',
    quickReplies: [
      '¿Cómo se aplica la loción?',
      'Ver Promociones con Obsequio 🎁',
      'Pedir por WhatsApp'
    ]
  },
  {
    triggers: ['batido verde', 'detox previo', 'limpieza', 'sobre', '15000', 'promo batido'],
    response: '🌱 **Sobre de Batido Verde Funcional:**\n\nEs una porción concentrada (20g) con espirulina, avena, espinaca, jengibre, cúrcuma, apio y vitamina C.\n\n💡 *¿Por qué es un excelente complemento?*\nAyuda a preparar el cuerpo y promover la hidratación celular antes de iniciar tus 30 días de hábitos. Se disuelve en 200 ml de agua.\n\n💰 Precio especial: **Solo $15.000** al incluirlo en tu pedido de Tyruss Full 💚.',
    quickReplies: [
      'Quiero agregarlo a mi pedido',
      'Ver paquetes de Tyruss Full',
      'Hablar con el equipo por WhatsApp'
    ]
  },
  {
    triggers: ['precio', 'cuanto vale', 'costo', 'promociones', 'oferta', 'comprar', 'tarros', 'pedido', 'pago', 'contra entrega'],
    response: '💰 **Promociones Oficiales de Tyruss Full en ColShopi Tienda:**\n\n1️⃣ **1 Tarro (500g / 25 tomas):** $89.900 + Loción Termoactiva GRATIS 🎁\n\n🔥 **PAQUETES CON MÁXIMO AHORRO:**\n2️⃣ **2 Tarros (1000g / 50 tomas):** $134.850 + Obsequio 🎁 *(El más solicitado)*\n3️⃣ **Pagas 2 y Llevas 3 Tarros:** $179.800 + Obsequio 🎁 *(Tratamiento continuo)*\n4️⃣ **Pagas 3 y Llevas 5 Tarros:** $269.700 + Obsequio 🎁 *(Pack Familiar)*\n\n🚚 **Envío GRATIS a toda Colombia**\n💵 **Pago Contra Entrega** (Pagas en efectivo al recibir en tu hogar)',
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
    response: '🥗 **Ideas y Pautas de Alimentación Saludable de Marié:**\n\nPara favorecer un metabolismo activo y una digestión ligera, te recomiendo priorizar opciones naturales y moderar:\n\n❌ **Bebidas y postres con azúcares añadidos en exceso**.\n❌ **Grasas ultraprocesadas o frituras recurrentes**.\n❌ **Harinas refinadas en exceso** (pueden generar pesadez digestiva).\n\n✅ **Prioriza alimentos reales y frescos:**\nAguacate, aceite de oliva, vegetales verdes, frutas frescas, frutos secos, proteínas limpias, buena hidratación y tu toma diaria de Tyruss Full 🌿💚.\n\n*(Recuerda que no formulo dietas clínicas restrictivas. Si requieres un plan médico por una patología severa, consulta con un profesional de la salud).*',
    quickReplies: [
      'Ver Recetario Saludable',
      'Ideas para el desayuno',
      '¿Cómo va mi progreso en el Calendario?'
    ]
  },
  {
    triggers: ['codigo', 'digitos', 'acceso', 'activacion', 'bloqueada', 'desbloquear'],
    response: '🔐 **Código de Acceso VIP de 6 Dígitos:**\n\nEsta App es un beneficio 100% gratuito exclusivo para clientas de **Tyruss Full (500g)** de ColShopi Tienda. Para ingresar, debes usar tu código de 6 dígitos numéricos.\n\nSi necesitas tu código o requieres asistencia, comunícate a la línea oficial de ColShopi: **+57 310 400 7428**:\n*"Hola Marié, ya recibí mi producto Tyruss Full y quiero activar mi acceso a la App TyroFem 30D, mi nombre es: [Tu Nombre]"*',
    actionLink: {
      text: 'Solicitar mi Código VIP al WhatsApp (+57 310 400 7428) 📲',
      type: 'whatsapp',
      url: 'https://wa.me/573104007428?text=Hola%20Mari%C3%A9,%20ya%20recib%C3%AD%20mi%20producto%20Tyruss%20Full%20y%20quiero%20el%20acceso%20gratis%20a%20la%20App%20TyroFem%2030D,%20mi%20nombre%20es:%20'
    }
  },
  {
    triggers: ['informe', 'reporte', 'bitacora', 'correo', 'resultado', '30 dias', 'evaluacion', 'pdf', 'descargar'],
    response: '📋 **Bitácora de Bienestar y Hábitos 30D (PDF Descargable):**\n\nPuedes generar y descargar tu bitácora en formato PDF directamente desde la pestaña **"Mi Registro Diario"**.\n\nTu bitácora consolida:\n✔ Registro de adherencia al reto y cumplimiento de tomas de Tyruss Full.\n✔ Curva y evolución de tus niveles de energía (Día 1 al 30).\n✔ Registro de confort y bienestar digestivo.\n✔ Resumen de hábitos saludables generado por Marié como tu guía de bienestar (no médico) y sello de ColShopi Tienda By Leps Digital.\n\nPuedes descargarlo con el botón **"Descargar Bitácora (PDF)"** o revisarlo en pantalla con **"Ver Bitácora Completa"**.',
    quickReplies: [
      '¿Cómo ver mi código registrado?',
      'Pautas de bienestar diario',
      'Ver Promociones de Tyruss Full'
    ]
  },
  {
    triggers: ['whatsapp', 'asesoria', 'contacto', 'telefono', 'hablar con marie', 'atencion'],
    response: '📲 **¡Con gusto mi bella!**\n\nPuedes comunicarte con nuestro equipo en la línea oficial de ColShopi Tienda en Colombia: **+57 310 400 7428** 💚.\n\nEstamos atentos para resolver tus dudas de pedidos, entregas con envío gratis y pago contra entrega.',
    actionLink: {
      text: 'Chatear en WhatsApp Oficial (+57 310 400 7428) 💬',
      type: 'whatsapp',
      url: 'https://wa.me/573104007428?text=Hola%20Marié,%20estoy%20en%20la%20App%20TyroFem%2030D%20y%20quiero%20hacerte%20una%20consulta%20sobre%20Tyruss%20Full'
    }
  }
];

export function getMarieResponse(userText: string, userName?: string): {
  text: string;
  quickReplies?: string[];
  actionLink?: ChatMessage['actionLink'];
  isVoiceNote?: boolean;
  voiceDuration?: string;
} {
  const normalized = userText.toLowerCase().trim();
  const firstName = userName ? userName.split(' ')[0] : '';
  const personalizedGreeting = firstName ? `¡Hola ${firstName}! 💜 ` : '';

  // Check against knowledge base triggers
  for (const topic of FAQ_KNOWLEDGE_BASE) {
    if (topic.triggers.some(trigger => normalized.includes(trigger))) {
      let respText = topic.response;
      if (firstName && !respText.includes(firstName)) {
        // Subtle personalization
        if (respText.startsWith('🦋')) {
          respText = `🦋 ${firstName}, te entiendo perfectamente… y sé lo importante que es cuidar tu metabolismo con buenos hábitos 💜\n` + respText.substring(respText.indexOf('\n\n') + 2);
        } else if (respText.startsWith('🌸')) {
          respText = `🌸 ${firstName}, comprendo cómo te sientes… los cambios en el bienestar hormonal requieren mucha empatía y cuidado 💜\n` + respText.substring(respText.indexOf('\n\n') + 2);
        }
      }

      return {
        text: respText,
        quickReplies: topic.quickReplies,
        actionLink: topic.actionLink,
        isVoiceNote: topic.isVoiceNote,
        voiceDuration: topic.voiceDuration
      };
    }
  }

  // Empathetic default response in Marié's updated persona
  return {
    text: `${personalizedGreeting}Te escucho con todo el cariño 💜. Como tu **Asistente Virtual y Guía de Bienestar de ColShopi Tienda**, estoy aquí para acompañarte paso a paso con ideas de hábitos saludables, menús balanceados e hidratación 🌿.\n\nEn **ColShopi Tienda**, vinculamos **Tyruss Full** (con certificación INVIMA) para complementar tu alimentación con espirulina, selenio y nutrientes de origen natural ✨.\n\n*(Recuerda que ante cualquier síntoma médico agudo o condición de salud específica, es fundamental acudir a tu médico tratante).* 🩺\n\n👉 *¿Te gustaría revisar el modo de preparación, ver ideas de recetas saludables o consultar las promociones de Tyruss Full?*`,
    quickReplies: [
      '🥤 ¿Cómo se prepara y toma?',
      '📦 Ver Promociones y Precios',
      '🦋 ¿Cómo apoya a la tiroides?',
      '🤖 ¿Quién es Marié?'
    ],
    actionLink: {
      text: 'Pedir Asistencia por WhatsApp 💬',
      type: 'whatsapp',
      url: `https://wa.me/573104007428?text=Hola%20Marié,%20soy%20${encodeURIComponent(firstName || 'usuaria')}%20y%20tengo%20una%20pregunta%20sobre:%20${encodeURIComponent(userText)}`
    }
  };
}

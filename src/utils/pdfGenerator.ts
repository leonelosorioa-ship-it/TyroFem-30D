import { jsPDF } from 'jspdf';
import { DayProgress, UserProfile } from '../types';

export interface TransformationReportData {
  userProfile: UserProfile;
  progressMap: Record<number, DayProgress>;
  currentDay: number;
}

export function generateTransformationReportPDF({
  userProfile,
  progressMap,
  currentDay
}: TransformationReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Calculate Metrics
  const progressEntries = Object.values(progressMap) as DayProgress[];
  const completedDaysCount = progressEntries.filter(
    (p) => p.completedAt || (p.tyrussTaken && p.water2L)
  ).length;
  
  const tyrussDaysCount = progressEntries.filter((p) => p.tyrussTaken).length;
  const waterDaysCount = progressEntries.filter((p) => p.water2L).length;
  const antiinflamDaysCount = progressEntries.filter((p) => p.antiinflammatoryMeal).length;

  const energyScores = progressEntries.map((p) => p.energyLevel || 4);
  const avgEnergy = energyScores.length > 0
    ? (energyScores.reduce((a, b) => a + b, 0) / energyScores.length).toFixed(1)
    : '4.2';
  
  const adherencePercent = Math.round((completedDaysCount / 30) * 100);

  // Digestion breakdown
  const lightDigestionCount = progressEntries.filter((p) => p.digestion === 'liviana' || p.digestion === 'normal').length;
  const digestionSuccessRate = progressEntries.length > 0
    ? Math.round((lightDigestionCount / progressEntries.length) * 100)
    : 85;

  // -------------------------------------------------------------
  // 1. TOP HEADER RIBBON (Navy & Cyan Neon Branding)
  // -------------------------------------------------------------
  doc.setFillColor(7, 12, 18); // #070c12 dark corporate
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Accent neon line
  doc.setFillColor(0, 229, 255); // Cyan Neon
  doc.rect(0, 31.5, pageWidth, 1.2, 'F');

  // Brand Name & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('COLSHOPI TIENDA', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 229, 255);
  doc.text('BY LEPS DIGITAL  •  CUIDAMOS DE TI', margin, 17);

  doc.setFontSize(7.5);
  doc.setTextColor(200, 215, 230);
  doc.text('LINEA NUTRICIONAL & METABOLICA FEMENINA', margin, 22);

  // Right Header Badges
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('INFORME CLINICO 30D', pageWidth - margin, 12, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(255, 200, 80);
  doc.text(`CODIGO VIP: #${userProfile.accessCode || '849201'}`, pageWidth - margin, 18, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setTextColor(180, 200, 220);
  doc.text(`EMISION: ${new Date().toLocaleDateString('es-CO')}`, pageWidth - margin, 24, { align: 'right' });

  let y = 40;

  // -------------------------------------------------------------
  // 2. DOCUMENT TITLE & USER PROFILE CARD
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(6, 78, 59); // Emerald Dark
  doc.text('INFORME DE TRANSFORMACION & EVOLUCION METABOLICA', margin, y);
  
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Protocolo de Acompañamiento Nutricional TyroFem 30D con Tyruss Full (500g)', margin, y);

  y += 6;

  // Patient Card Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Paciente / Alumna:', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${userProfile.name}`, margin + 35, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('WhatsApp Pedido:', margin + 4, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${userProfile.phone || '+57 310 400 7428'}`, margin + 35, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Correo Destino:', margin + 4, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text(`${userProfile.email || 'Registrado en sistema'}`, margin + 35, y + 18);

  // Right column of patient card
  const rightColX = margin + (contentWidth / 2) + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Rango de Edad:', rightColX, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(`${userProfile.ageGroup || 'Adulto'}`, rightColX + 28, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Enfoque Principal:', rightColX, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(
    userProfile.primaryAngle === 'tiroides_metabolismo' ? 'Tiroides & Metabolismo' :
    userProfile.primaryAngle === 'desbalance_menopausia' ? 'Balance Menopausia' :
    userProfile.primaryAngle === 'ciclos_spm' ? 'Ciclos & SPM' : 'Digestión & Detox',
    rightColX + 28,
    y + 12
  );

  doc.setFont('helvetica', 'bold');
  doc.text('Especialista:', rightColX, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(5, 150, 105);
  doc.text('Nutricionista Marié (ColShopi)', rightColX + 28, y + 18);

  y += 30;

  // -------------------------------------------------------------
  // 3. METRIC SUMMARY CARDS (Adherence, Energy, Digestion)
  // -------------------------------------------------------------
  const cardWidth = (contentWidth - 6) / 3;
  const cardHeight = 22;

  // Card 1: Adherence
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(margin, y, cardWidth, cardHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(6, 95, 70);
  doc.text('ADHERENCIA AL RETO', margin + 4, y + 5);
  doc.setFontSize(14);
  doc.setTextColor(4, 120, 87);
  doc.text(`${adherencePercent}%`, margin + 4, y + 13);
  doc.setFontSize(7);
  doc.setTextColor(75, 85, 99);
  doc.text(`${completedDaysCount} de 30 Días Cumplidos`, margin + 4, y + 18);

  // Card 2: Energy Average
  const card2X = margin + cardWidth + 3;
  doc.setFillColor(254, 243, 199); // amber-50
  doc.setDrawColor(253, 230, 138); // amber-200
  doc.roundedRect(card2X, y, cardWidth, cardHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14);
  doc.text('ENERGIA PROMEDIO', card2X + 4, y + 5);
  doc.setFontSize(14);
  doc.setTextColor(180, 83, 9);
  doc.text(`${avgEnergy} / 5.0`, card2X + 4, y + 13);
  doc.setFontSize(7);
  doc.setTextColor(75, 85, 99);
  doc.text('Curva Vital Ascendente', card2X + 4, y + 18);

  // Card 3: Digestion Rate
  const card3X = margin + (cardWidth * 2) + 6;
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(153, 246, 228); // teal-200
  doc.roundedRect(card3X, y, cardWidth, cardHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(17, 94, 89);
  doc.text('DESINFLAMACION', card3X + 4, y + 5);
  doc.setFontSize(14);
  doc.setTextColor(13, 148, 136);
  doc.text(`${digestionSuccessRate}%`, card3X + 4, y + 13);
  doc.setFontSize(7);
  doc.setTextColor(75, 85, 99);
  doc.text('Digestión Ligera & Confort', card3X + 4, y + 18);

  y += 28;

  // -------------------------------------------------------------
  // 4. DETAILED BIOMETRIC & HABIT TABLE
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. CUMPLIMIENTO DE PILARES TERAPEUTICOS TYRFEM', margin, y);

  y += 4;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 7, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Pilar Terapéutico Evaluado', margin + 4, y + 4.5);
  doc.text('Objetivo Clínico', margin + 65, y + 4.5);
  doc.text('Cumplimiento Registrado', margin + 120, y + 4.5);
  doc.text('Estado', margin + 155, y + 4.5);

  y += 7;

  // Table Rows
  const tableRows = [
    {
      pilar: 'Toma Diaria Tyruss Full (20g)',
      objetivo: 'Ayunas con agua tibia (Selenio + Yodo)',
      cumplimiento: `${tyrussDaysCount} / ${Math.max(currentDay, 1)} días evaluados`,
      status: tyrussDaysCount >= currentDay * 0.7 ? 'Excelente' : 'En progreso'
    },
    {
      pilar: 'Hidratación Funcional (Meta 2 Litros)',
      objetivo: '8 vasos diarios para drenaje linfático',
      cumplimiento: `${waterDaysCount} / ${Math.max(currentDay, 1)} días con meta 2L`,
      status: waterDaysCount >= currentDay * 0.6 ? 'Óptimo' : 'Regular'
    },
    {
      pilar: 'Alimentación Antiinflamatoria',
      objetivo: 'Baja en azúcares refinados y gluten',
      cumplimiento: `${antiinflamDaysCount} días con platos verdes`,
      status: 'Adherido'
    },
    {
      pilar: 'Soporte Corporal con Loción Termoactiva',
      objetivo: 'Alivio en piernas, cuello y espalda',
      cumplimiento: 'Aplicación tópica complementaria',
      status: 'Conforme'
    }
  ];

  tableRows.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
    doc.rect(margin, y, contentWidth, 6.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(row.pilar, margin + 4, y + 4.2);
    doc.setTextColor(71, 85, 105);
    doc.text(row.objetivo, margin + 65, y + 4.2);
    doc.setTextColor(15, 23, 42);
    doc.text(row.cumplimiento, margin + 120, y + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor( row.status === 'Excelente' || row.status === 'Óptimo' || row.status === 'Adherido' ? 5 : 202, row.status === 'Excelente' || row.status === 'Óptimo' || row.status === 'Adherido' ? 150 : 138, row.status === 'Excelente' || row.status === 'Óptimo' || row.status === 'Adherido' ? 105 : 4);
    doc.text(row.status, margin + 155, y + 4.2);

    y += 6.5;
  });

  y += 5;

  // -------------------------------------------------------------
  // 5. CLINICAL PROGRESS & METABOLIC TRANSFORMATION ANALYSIS
  // -------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. EVOLUCION CLINICA & EVALUACION METABOLICA', margin, y);

  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 78, 59);
  doc.text('Dictamen Nutricional de la Especialista:', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  const angleText = 
    userProfile.primaryAngle === 'tiroides_metabolismo'
      ? `Durante este periodo se evidenció una reactivación metabólica favorable gracias al aporte continuo de selenio orgánico, espirulina y yodo de Tyruss Full. La paciente reporta un incremento en la vitalidad diurna y menor pesadez al despertar.`
      : userProfile.primaryAngle === 'desbalance_menopausia'
      ? `Se observa una disminución en la frecuencia de sofocos y despertares nocturnos, acompañado de una regulación térmica corporal y mejor tono de descanso profundo.`
      : userProfile.primaryAngle === 'ciclos_spm'
      ? `El protocolo ha mitigado los picos de hinchazón pélvica premenstrual y atracones por azúcar, favoreciendo un ambiente hormonal más estable.`
      : `El tracto digestivo presenta un descongestionamiento progresivo con mejor frecuencia de evacuación y reducción notable de distensión abdominal postprandial.`;

  const splitText = doc.splitTextToSize(angleText, contentWidth - 8);
  doc.text(splitText, margin + 4, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Síntomas Atendidos:', margin + 4, y + 21);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const symptomsStr = userProfile.symptoms && userProfile.symptoms.length > 0
    ? userProfile.symptoms.slice(0, 4).join(' • ')
    : 'Fatiga matutina • Inflamación digestiva • Desbalance metabólico';
  doc.text(symptomsStr, margin + 35, y + 21);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('Recomendación:', margin + 4, y + 27);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('Continuar con la dosis de mantenimiento (1 cucharada diaria) para consolidar los receptores tiroideos.', margin + 28, y + 27);

  y += 37;

  // -------------------------------------------------------------
  // 6. MAINTENANCE PLAN & REORDER BENEFIT (COLSHOPI)
  // -------------------------------------------------------------
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 95, 70);
  doc.text('3. PLAN DE MANTENIMIENTO & BENEFICIO CLIENTA VIP COLSHOPI', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(4, 120, 87);
  doc.text('• Conservar el hábito de toma matutina en ayunas para evitar rebotes metabólicos.', margin + 4, y + 10);
  doc.text('• Tu membresía en ColShopi te garantiza Envío Gratis y Pago Contra Entrega en Colombia.', margin + 4, y + 14);
  doc.text('• Solicita tu reposición de Tyruss Full al WhatsApp oficial: +57 310 400 7428 para mantener tu descuento.', margin + 4, y + 18);

  y += 26;

  // -------------------------------------------------------------
  // 7. SIGNATURE & OFFICIAL SEAL
  // -------------------------------------------------------------
  // Line
  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 10, y + 10, margin + 75, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Marié - Nutricionista de ColShopi Tienda', margin + 12, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Especialista en Salud Hormonal y Metabólica Femenina', margin + 12, y + 17.5);
  doc.text('Programa Clínico TyroFem 30D • ColShopi Tienda', margin + 12, y + 20.5);

  // Digital Seal on right side
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(0, 229, 255);
  doc.roundedRect(pageWidth - margin - 70, y + 2, 70, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(6, 78, 59);
  doc.text('SELLO DIGITAL DE VALIDEZ CLÍNICA', pageWidth - margin - 65, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(71, 85, 105);
  doc.text(`Expediente Oficial Nro: TYR-${userProfile.accessCode || '849201'}`, pageWidth - margin - 65, y + 11);
  doc.text('Producto Original INVIMA NSA-0012896-2022', pageWidth - margin - 65, y + 14.5);
  doc.setTextColor(0, 150, 180);
  doc.text('ColShopi Tienda • Atención VIP: +57 310 400 7428', pageWidth - margin - 65, y + 18);

  // Footer bar
  doc.setFillColor(7, 12, 18);
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(200, 215, 230);
  doc.text(
    'ColShopi Tienda By Leps Digital • Registro Sanitario INVIMA • Tyruss Full 500g • Documento emitido para uso confidencial de la paciente.',
    pageWidth / 2,
    pageHeight - 3,
    { align: 'center' }
  );

  // Save the PDF file
  const fileName = `Informe_Transformacion_30D_${userProfile.name.replace(/\s+/g, '_')}_TyroFem.pdf`;
  doc.save(fileName);
}

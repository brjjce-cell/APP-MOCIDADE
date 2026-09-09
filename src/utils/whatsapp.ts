// Helper to sanitize and format phone numbers for wa.me links
export function formatPhoneNumber(phone: string): string {
  // strip non-digits
  const digits = phone.replace(/\D/g, '');
  // If already starts with 55 (Brazil country code) and has 12 or 13 digits
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }
  // If it's a Brazilian phone like (85) 98888-7777 (10 or 11 digits)
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
}

export function createWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = formatPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  if (!cleanPhone) {
    // If no phone provided, creates a generic share link for WhatsApp Web/App
    return `https://wa.me/?text=${encodedText}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export const WHATSAPP_TEMPLATES = {
  absenceWarning: (name: string) => 
    `Fala ${name}! Graça e paz, meu querido(a)! 💙 Sentimos muito a sua falta nos últimos encontros da nossa mocidade. Tá tudo bem com você e sua família? Qualquer coisa que precisar conversar ou orar, estamos aqui! Te esperamos no próximo sábado! 🙏`,

  meetingReminder: (name: string, dateStr: string, theme: string) =>
    `Fala ${name}! Passando pra te lembrar do nosso Encontro de Jovens neste sábado (${dateStr})! Vamos falar sobre "${theme}" e vai ser muito abençoado. Contamos com a sua presença! 🔥🙌`,

  birthdayPrivate: (name: string) =>
    `Parabéns, ${name}! 🎉🎂 Que Deus te abençoe grandemente nesse novo ano de vida! Que o Senhor continue guiando seus passos e realizando os planos do Seu coração em você. Somos gratos a Deus pela sua vida e amizade! Conta com a gente sempre! Abraço bem forte! 🎈✨`,

  birthdayGroup: (name: string, verse: string) =>
    `🎉 *PARABÉNS AO NOSSO QUERIDO(A) ${name.toUpperCase()}!* 🎂\n\nHoje celebramos com muita alegria a vida do(a) ${name}! Que a graça e a paz do Senhor transbordem sobre os seus dias!\n\n📖 _"${verse}"_\n\nDeixem suas mensagens de bênção aqui no grupo galera! 👏🙌`,

  serviceDutyReminder: (name: string, role: string, dateStr: string) =>
    `Graça e paz, ${name}! 🕊️ Só passando para confirmar que você está na escala deste sábado (${dateStr}) na área de *${role}*. Se precisar de algum alinhamento prévio, me dá um toque! Deus abençoe sua dedicação! 🌟`,

  fundraisingCall: (name: string, activity: string, dateStr: string) =>
    `Fala ${name}! Estamos organizando nossa arrecadação para o caixa da mocidade: *${activity}* neste ${dateStr}. Você topa somar com a gente na equipe? Vai ser divertido e muito produtivo! Confirma se podemos contar contigo! 🤝💵`,
};

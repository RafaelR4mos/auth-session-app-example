/**
 * Utilitários para manipulação de datas com timezone brasileiro
 */

// Timezone do Brasil (UTC-3)
const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Converte uma data para o timezone brasileiro
 */
export function toBrazilianDate(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Cria uma nova data ajustada para o timezone brasileiro
  const brazilianDate = new Date(dateObj.toLocaleString('en-US', { 
    timeZone: BRAZIL_TIMEZONE 
  }));
  
  return brazilianDate;
}

/**
 * Formata uma data para exibição no formato brasileiro
 */
export function formatBrazilianDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('pt-BR', {
    timeZone: BRAZIL_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * Obtém a data atual no timezone brasileiro
 */
export function getBrazilianNow(): Date {
  return new Date(new Date().toLocaleString('en-US', { 
    timeZone: BRAZIL_TIMEZONE 
  }));
}

/**
 * Converte timestamp Unix para data brasileira
 */
export function unixToBrazilianDate(timestamp: number): Date {
  return toBrazilianDate(new Date(timestamp * 1000));
}

/**
 * Converte data brasileira para timestamp Unix
 */
export function brazilianDateToUnix(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * Obtém o timestamp Unix atual no timezone brasileiro
 */
export function getBrazilianUnixNow(): number {
  return brazilianDateToUnix(getBrazilianNow());
}

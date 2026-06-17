import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `%${value}`;
}

const ROOM_STATUS: Record<string, string> = {
  available: 'Müsait',
  in_game: 'Oyunda',
  resetting: 'Sıfırlanıyor',
  maintenance: 'Bakımda',
  closed: 'Kapalı',
};

export function formatRoomStatus(status: string): string {
  return ROOM_STATUS[status] || status;
}

const ROOM_THEME: Record<string, string> = {
  horror: 'Korku',
  mystery: 'Gizem',
  sci_fi: 'Bilim Kurgu',
  historical: 'Tarih',
  fantasy: 'Fantastik',
  adventure: 'Macera',
};

export function formatRoomTheme(theme: string): string {
  return ROOM_THEME[theme] || theme;
}

const SESSION_STATUS: Record<string, string> = {
  recorded: 'Kayıtlı',
  verified: 'Doğrulandı',
  disputed: 'İtirazlı',
};

export function formatSessionStatus(status: string): string {
  return SESSION_STATUS[status] || status;
}

const GAME_TYPE: Record<string, string> = {
  private_group: 'Özel Grup',
  corporate: 'Kurumsal',
  birthday: 'Doğum Günü',
  date_night: 'Romantik Gece',
  team_building: 'Takım Etkinliği',
};

export function formatGameType(type: string): string {
  return GAME_TYPE[type] || type;
}

const PUZZLE_STATUS: Record<string, string> = {
  open: 'Açık',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

export function formatPuzzleMaintenanceStatus(status: string): string {
  return PUZZLE_STATUS[status] || status;
}

const PUZZLE_PRIORITY: Record<string, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  urgent: 'Acil',
};

export function formatPuzzleMaintenancePriority(priority: string): string {
  return PUZZLE_PRIORITY[priority] || priority;
}

const RESET_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  overdue: 'Gecikmiş',
};

export function formatResetChecklistStatus(status: string): string {
  return RESET_STATUS[status] || status;
}

const RESET_CATEGORY: Record<string, string> = {
  full_reset: 'Tam Sıfırlama',
  prop_check: 'Prop Kontrolü',
  clue_refresh: 'İpucu Yenileme',
  lock_repair: 'Kilit Onarımı',
  lighting: 'Aydınlatma',
  other: 'Diğer',
};

export function formatResetChecklistCategory(category: string): string {
  return RESET_CATEGORY[category] || category;
}

const PROP_ORDER_STATUS: Record<string, string> = {
  pending: 'Beklemede',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  delivered: 'Teslim Edildi',
};

export function formatPropOrderStatus(status: string): string {
  return PROP_ORDER_STATUS[status] || status;
}

const RATE_STATUS: Record<string, string> = {
  active: 'Aktif',
  upcoming: 'Yakında',
  archived: 'Arşiv',
};

export function formatRateStatus(status: string): string {
  return RATE_STATUS[status] || status;
}

const RATE_CATEGORY: Record<string, string> = {
  room_booking: 'Oda Kiralama',
  corporate_event: 'Kurumsal Etkinlik',
  birthday_package: 'Doğum Günü Paketi',
  team_building: 'Takım Etkinliği',
  peak_hour: 'Yoğun Saat',
  other: 'Diğer',
};

export function formatRateCategory(category: string): string {
  return RATE_CATEGORY[category] || category;
}

const MONTH_NAMES: Record<number, string> = {
  1: 'Ocak',
  2: 'Şubat',
  3: 'Mart',
  4: 'Nisan',
  5: 'Mayıs',
  6: 'Haziran',
  7: 'Temmuz',
  8: 'Ağustos',
  9: 'Eylül',
  10: 'Ekim',
  11: 'Kasım',
  12: 'Aralık',
};

export function formatMonth(month: number): string {
  return MONTH_NAMES[month] || String(month);
}

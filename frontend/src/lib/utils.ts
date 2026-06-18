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

const WORKSTATION_STATUS: Record<string, string> = {
  available: 'Müsait',
  pouring: 'Dökümde',
  curing: 'Kürlemede',
  maintenance: 'Bakımda',
  offline: 'Kapalı',
};

export function formatWorkstationStatus(status: string): string {
  return WORKSTATION_STATUS[status] || status;
}

const WORKSTATION_TYPE: Record<string, string> = {
  standard: 'Standart',
  premium: 'Premium',
  pressure_pot: 'Basınç Potu',
  vacuum_chamber: 'Vakum Odası',
  studio: 'Stüdyo',
};

export function formatWorkstationType(workstationType: string): string {
  return WORKSTATION_TYPE[workstationType] || workstationType;
}

const BATCH_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  failed: 'Başarısız',
};

export function formatBatchStatus(status: string): string {
  return BATCH_STATUS[status] || status;
}

const POUR_TYPE: Record<string, string> = {
  countertop: 'Tezgah Üstü',
  river_table: 'Nehir Masası',
  jewelry: 'Takı',
  coaster: 'Coaster',
  charcuterie: 'Sunum Tahtası',
  custom: 'Özel',
};

export function formatPourType(type: string): string {
  return POUR_TYPE[type] || type;
}

const MAINTENANCE_STATUS: Record<string, string> = {
  open: 'Açık',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

export function formatEquipmentRepairStatus(status: string): string {
  return MAINTENANCE_STATUS[status] || status;
}

const MAINTENANCE_PRIORITY: Record<string, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  urgent: 'Acil',
};

export function formatEquipmentRepairPriority(priority: string): string {
  return MAINTENANCE_PRIORITY[priority] || priority;
}

const CURING_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  overdue: 'Gecikmiş',
};

export function formatCuringStatus(status: string): string {
  return CURING_STATUS[status] || status;
}

const CURING_CATEGORY: Record<string, string> = {
  humidity_check: 'Nem Kontrolü',
  temperature_log: 'Sıcaklık Logu',
  mold_prep: 'Kalıp Hazırlığı',
  pigment_mix: 'Pigment Karışımı',
  inventory: 'Envanter',
  other: 'Diğer',
};

export function formatCuringCategory(category: string): string {
  return CURING_CATEGORY[category] || category;
}

const MOLD_ORDER_STATUS: Record<string, string> = {
  pending: 'Beklemede',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  delivered: 'Teslim Edildi',
};

export function formatMoldOrderStatus(status: string): string {
  return MOLD_ORDER_STATUS[status] || status;
}

const WORKSHOP_RATE_STATUS: Record<string, string> = {
  active: 'Aktif',
  upcoming: 'Yakında',
  archived: 'Arşiv',
};

export function formatWorkshopRateStatus(status: string): string {
  return WORKSHOP_RATE_STATUS[status] || status;
}

const WORKSHOP_CATEGORY: Record<string, string> = {
  pour_session: 'Döküm Seansı',
  class_rental: 'Atölye Sınıfı',
  custom_commission: 'Özel Sipariş',
  material_sale: 'Malzeme Satışı',
  custom_work: 'Özel İş',
  other: 'Diğer',
};

export function formatWorkshopCategory(category: string): string {
  return WORKSHOP_CATEGORY[category] || category;
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

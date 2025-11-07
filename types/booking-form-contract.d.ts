/**
 * Booking Form Contract (Global Declaration)
 *
 * - Register semua type ke namespace global agar bisa digunakan tanpa import.
 * - Implementasi runtime (onboarding, booking form, API) tinggal membaca struktur ini.
 */

declare global {
  type FieldType =
    | 'text'
    | 'textarea'
    | 'phone'
    | 'email'
    | 'date'
    | 'time'
    | 'slot-picker'
    | 'dropdown'
    | 'checkbox'
    | 'image-upload'
    | 'map-selector'
    | 'custom-component';

  type TimeMode = 'exact' | 'slot' | 'full_day' | 'unit';

  interface BookingFieldSettings<TSettings = Record<string, unknown>> {
    id: string;
    label: string;
    type: FieldType;
    required: boolean;
    visible: boolean;
    description?: string;
    settings?: TSettings;
  }

  interface SlotDefinition {
    id: string;
    label: string;
    startTime: string;
    endTime: string;
    capacity?: number;
  }

  interface BookingFormContract {
    version: string;
    businessType: string;
    timeMode: TimeMode;
    slotDefinitions?: SlotDefinition[];
    unitDefinition?: {
      unitName: string;
      minUnits: number;
      maxUnits: number;
    };
    fields: BookingFieldSettings[];
  }

  // Base contract (digunakan saat bisnis belum memilih template khusus)
  const BASE_CONTRACT: BookingFormContract;
  const BARBERSHOP_CONTRACT: BookingFormContract;
  const CAR_RENTAL_CONTRACT: BookingFormContract;
  const COWORKING_CONTRACT: BookingFormContract;
}

export {};

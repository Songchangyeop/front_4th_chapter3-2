export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export type RepeatIntervalType = 'same_month_last_day' | 'same_date' | 'same_month_nth_weekday';

export interface RepeatInfo {
  type: RepeatType;
  interval: RepeatIntervalType;
  endDate?: string;
}

export interface EventForm {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  repeat: RepeatInfo;
  notificationTime: number; // 분 단위로 저장
}

export interface Event extends EventForm {
  id: string;
}

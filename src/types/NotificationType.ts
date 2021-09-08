export enum NotificationLevel {
  Info,
  Warning,
  Error
}

export interface NotificationType {
  level?: NotificationLevel;
  message?: JSX.Element | string;
  error?: string | Error;
}

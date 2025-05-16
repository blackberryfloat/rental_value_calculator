import { v4 as uuidv4 } from 'uuid';

export enum AlertCode {
  UNKNOWN_ERROR,
}

export enum AlertLevel {
  ERROR,
  WARNING,
  INFO,
}

export class Alert {
  static fromCode(code: AlertCode): Alert {
    switch (code) {
      case AlertCode.UNKNOWN_ERROR:
        return new Alert(AlertLevel.ERROR, 'An unknown error occurred. Please try again.');
      default:
        return new Alert(AlertLevel.ERROR, 'An unknown error occurred. Please try again.');
    }
  }

  level: AlertLevel;
  message: string;
  uuid: string;

  constructor(level: AlertLevel, message: string) {
    this.uuid = uuidv4();
    this.level = level;
    this.message = message;
  }
}

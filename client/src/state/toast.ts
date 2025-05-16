import { v4 as uuidv4 } from 'uuid';

export enum ToastCode {
  UNKNOWN_EVENT,
  UNDO,
  REDO,
}

export class Toast {
  static fromCode(code: ToastCode): Toast {
    switch (code) {
      case ToastCode.UNDO:
        return new Toast('Undo action performed.');
      case ToastCode.REDO:
        return new Toast('Redo action performed.');
      case ToastCode.UNKNOWN_EVENT:
        return new Toast('An unknown error occurred. Please try again.');
      default:
        return new Toast('An unknown error occurred. Please try again.');
    }
  }

  message: string;
  uuid: string;
  createdAt: number;

  constructor(message: string) {
    this.uuid = uuidv4();
    this.message = message;
    this.createdAt = Date.now();
  }
}

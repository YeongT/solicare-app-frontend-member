// This file provides type declarations for Firebase modules

export interface MessagePayload {
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
    image?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
    silent?: boolean;
    timestamp?: number;
  };
  data?: Record<string, string>;
  from?: string;
  collapseKey?: string;
  messageId?: string;
  messageType?: string;
}

declare module 'firebase/app' {
  export function initializeApp(config: Record<string, unknown>): unknown;
}

declare module 'firebase/messaging' {
  export function getMessaging(app?: unknown): unknown;
  export function getToken(
    messaging: unknown,
    options?: unknown
  ): Promise<string>;
  export function onMessage(
    messaging: unknown,
    callback: (payload: MessagePayload) => void
  ): () => void;
  export { MessagePayload };
}

declare module 'firebase/messaging/sw' {
  export function getMessaging(app?: unknown): unknown;
  export function onBackgroundMessage(
    messaging: unknown,
    callback: (payload: MessagePayload) => void
  ): () => void;
  export { MessagePayload };
}

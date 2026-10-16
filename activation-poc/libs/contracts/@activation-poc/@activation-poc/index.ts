// libs/contracts/index.ts

// 1. Sobre común para todos los eventos
export interface BaseEvent<T> {
  eventId: string;           // Identificador único; base de la idempotencia
  eventType: string;         // Tipo de evento (ej: ActivationRequested)
  version: number;           // Versión del contrato
  occurredAt: string;        // Fecha ISO
  correlationId: string;     // activationId para agrupar en la timeline
  customerId: string;        // Clave de partición en Kafka
  source: string;            // Servicio que lo publicó
  payload: T;                // Los datos específicos del evento
}

// 2. Payload específico para la creación de activación
export interface ActivationRequestedPayload {
  planId: string;
  channel: string;
  simulateFailure: 'none' | 'billing' | 'provisioning';
}

// 3. Tipado fuerte del evento inicial
export type ActivationRequestedEvent = BaseEvent<ActivationRequestedPayload>;
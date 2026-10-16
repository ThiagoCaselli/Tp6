import { Controller, Post, Body, Inject, HttpCode, HttpStatus, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { ActivationRequestedEvent } from '../../../libs/contracts/index';

@Controller('activations')
export class AppController implements OnModuleInit {
  constructor(@Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    // Conectamos el productor de Kafka al iniciar la API
    await this.kafkaClient.connect();
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async createActivation(@Body() body: any) {
    const activationId = uuidv4();

    // Armamos el evento usando la estructura compartida del contrato
    const event: ActivationRequestedEvent = {
      eventId: uuidv4(),
      eventType: 'ActivationRequested',
      version: 1,
      occurredAt: new Date().toISOString(),
      correlationId: activationId,
      customerId: body.customerId,
      source: 'activation-api',
      payload: {
        planId: body.planId,
        channel: 'web',
        simulateFailure: body.simulateFailure || 'none',
      },
    };

    // Publicamos en Kafka (Topic: activation.requested)
    this.kafkaClient.emit('activation.requested', {
      key: body.customerId,
      value: event,
    });

    // Devolvemos PENDING sin esperar a los demás servicios
    return {
      activationId: activationId,
      status: 'PENDING',
    };
  }
}

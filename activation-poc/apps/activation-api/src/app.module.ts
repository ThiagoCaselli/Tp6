import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'activation-api',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true, // Por ahora solo publicamos
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
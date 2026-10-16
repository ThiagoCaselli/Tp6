#!/bin/bash

# Esperar a que Kafka esté listo
echo "Esperando a que Kafka inicie..."
/opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092 --list > /dev/null 2>&1
while [ $? -ne 0 ]; do
  sleep 2
  /opt/kafka/bin/kafka-topics.sh --bootstrap-server kafka:9092 --list > /dev/null 2>&1
done

echo "Kafka listo. Creando tópicos con 3 particiones..."

TOPICS=(
  "activation.requested"
  "activation.requested.dlq"
  "billing.events"
  "billing.events.dlq"
  "provisioning.events"
  "provisioning.events.dlq"
  "activation.events"
  "activation.events.dlq"
)

for topic in "${TOPICS[@]}"; do
  /opt/kafka/bin/kafka-topics.sh --create --if-not-exists --bootstrap-server kafka:9092 --partitions 3 --replication-factor 1 --topic $topic
done

echo "Tópicos creados exitosamente."
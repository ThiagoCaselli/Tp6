"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const uuid_1 = require("uuid");
let AppController = class AppController {
    kafkaClient;
    constructor(kafkaClient) {
        this.kafkaClient = kafkaClient;
    }
    async onModuleInit() {
        await this.kafkaClient.connect();
    }
    async createActivation(body) {
        const activationId = (0, uuid_1.v4)();
        const event = {
            eventId: (0, uuid_1.v4)(),
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
        this.kafkaClient.emit('activation.requested', {
            key: body.customerId,
            value: event,
        });
        return {
            activationId: activationId,
            status: 'PENDING',
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createActivation", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('activations'),
    __param(0, (0, common_1.Inject)('KAFKA_CLIENT')),
    __metadata("design:paramtypes", [microservices_1.ClientKafka])
], AppController);
//# sourceMappingURL=app.controller.js.map
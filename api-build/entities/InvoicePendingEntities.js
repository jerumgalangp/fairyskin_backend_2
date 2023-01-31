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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicePendingEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const CommonPendingEntities_1 = require("./CommonPendingEntities");
const OrderEntities_1 = require("./OrderEntities");
let InvoicePendingEntity = class InvoicePendingEntity extends CommonPendingEntities_1.CommonPendingEntity {
};
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], InvoicePendingEntity.prototype, "invoice_code", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], InvoicePendingEntity.prototype, "reference_value", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Date)
], InvoicePendingEntity.prototype, "invoice_date", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], InvoicePendingEntity.prototype, "est_weight", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], InvoicePendingEntity.prototype, "special_note", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], InvoicePendingEntity.prototype, "shipping_details", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], InvoicePendingEntity.prototype, "transportation", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], InvoicePendingEntity.prototype, "carrier", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvoicePendingEntity.prototype, "delivery_fee", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvoicePendingEntity.prototype, "down_payment", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvoicePendingEntity.prototype, "discount", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvoicePendingEntity.prototype, "total_order", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvoicePendingEntity.prototype, "amount_to_pay", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InvoicePendingEntity.prototype, "over_payment", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], InvoicePendingEntity.prototype, "invoice_order_id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], InvoicePendingEntity.prototype, "approval_ind", void 0);
__decorate([
    typeorm_1.OneToOne(() => OrderEntities_1.OrderEntity, ({ order_id }) => order_id),
    typeorm_1.JoinColumn({ name: 'invoice_order_id' }),
    __metadata("design:type", OrderEntities_1.OrderEntity)
], InvoicePendingEntity.prototype, "invoice_order", void 0);
InvoicePendingEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.INVOICE_PENDING, { schema: config_1.ORM_DB_SCHEMA })
], InvoicePendingEntity);
exports.InvoicePendingEntity = InvoicePendingEntity;
//# sourceMappingURL=InvoicePendingEntities.js.map
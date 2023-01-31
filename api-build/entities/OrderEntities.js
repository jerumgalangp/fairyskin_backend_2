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
exports.OrderEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const Common_1 = require("./Common");
const CustomerEntities_1 = require("./CustomerEntities");
const InvoiceEntities_1 = require("./InvoiceEntities");
const OrderDeliveredEntities_1 = require("./OrderDeliveredEntities");
const TrackingMainEntities_1 = require("./TrackingMainEntities");
const OrderProductEntities_1 = require("./OrderProductEntities");
let OrderEntity = class OrderEntity extends Common_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], OrderEntity.prototype, "si_number", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "reference_value", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "staggered", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "order_status", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "payment_status", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], OrderEntity.prototype, "order_date", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderEntity.prototype, "amount_to_pay", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "payment_remarks", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "order_remarks", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderEntity.prototype, "approval_ind", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], OrderEntity.prototype, "customer_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => CustomerEntities_1.CustomerEntity, ({ customer_orders }) => customer_orders),
    typeorm_1.JoinColumn({ name: 'customer_id' }),
    __metadata("design:type", CustomerEntities_1.CustomerEntity)
], OrderEntity.prototype, "order_customer", void 0);
__decorate([
    typeorm_1.OneToMany(() => OrderProductEntities_1.OrderProductEntity, (op) => op.order),
    __metadata("design:type", Array)
], OrderEntity.prototype, "order_products", void 0);
__decorate([
    typeorm_1.OneToOne(() => InvoiceEntities_1.InvoiceEntity, ({ invoice_order }) => invoice_order),
    __metadata("design:type", InvoiceEntities_1.InvoiceEntity)
], OrderEntity.prototype, "order_id", void 0);
__decorate([
    typeorm_1.OneToMany(() => OrderDeliveredEntities_1.OrderDeliveredEntity, (op) => op.order),
    __metadata("design:type", Array)
], OrderEntity.prototype, "order_delivered", void 0);
__decorate([
    typeorm_1.OneToMany(() => TrackingMainEntities_1.TrackingMainEntity, ({ tracking_main_order }) => tracking_main_order),
    __metadata("design:type", Array)
], OrderEntity.prototype, "tracking_main", void 0);
OrderEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.ORDER, { schema: config_1.ORM_DB_SCHEMA })
], OrderEntity);
exports.OrderEntity = OrderEntity;
//# sourceMappingURL=OrderEntities.js.map
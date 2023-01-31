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
exports.CustomerEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const AreaEntities_1 = require("./AreaEntities");
const Common_1 = require("./Common");
const OrderEntities_1 = require("./OrderEntities");
const UserEntities_1 = require("./UserEntities");
let CustomerEntity = class CustomerEntity extends Common_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "customer_email", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "customer_balance", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "customer_over_payment", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "fully_paid", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "customer_payment_status", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, default: '' }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "customer_status", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "customer_team", void 0);
__decorate([
    typeorm_1.OneToOne(() => UserEntities_1.UserEntity, ({ customer_id }) => customer_id),
    typeorm_1.JoinColumn({ name: 'user_id' }),
    __metadata("design:type", UserEntities_1.UserEntity)
], CustomerEntity.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(() => OrderEntities_1.OrderEntity, ({ order_customer }) => order_customer),
    __metadata("design:type", Array)
], CustomerEntity.prototype, "customer_orders", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "customer_area", void 0);
__decorate([
    typeorm_1.ManyToOne(() => AreaEntities_1.AreaEntity, ({ areas }) => areas),
    typeorm_1.JoinColumn({ name: 'customer_area' }),
    __metadata("design:type", AreaEntities_1.AreaEntity)
], CustomerEntity.prototype, "area", void 0);
CustomerEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.CUSTOMER, { schema: config_1.ORM_DB_SCHEMA })
], CustomerEntity);
exports.CustomerEntity = CustomerEntity;
//# sourceMappingURL=CustomerEntities.js.map
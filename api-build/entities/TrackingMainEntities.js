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
exports.TrackingMainEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const Common_1 = require("./Common");
const OrderEntities_1 = require("./OrderEntities");
const UserEntities_1 = require("./UserEntities");
let TrackingMainEntity = class TrackingMainEntity extends Common_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], TrackingMainEntity.prototype, "reference_value", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], TrackingMainEntity.prototype, "user_id", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Number)
], TrackingMainEntity.prototype, "distributed_quantity", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UserEntities_1.UserEntity, ({ tracking_main }) => tracking_main),
    typeorm_1.JoinColumn({ name: 'user_id' }),
    __metadata("design:type", UserEntities_1.UserEntity)
], TrackingMainEntity.prototype, "tracking_main_customer", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], TrackingMainEntity.prototype, "order_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => OrderEntities_1.OrderEntity, ({ tracking_main }) => tracking_main),
    typeorm_1.JoinColumn({ name: 'order_id' }),
    __metadata("design:type", OrderEntities_1.OrderEntity)
], TrackingMainEntity.prototype, "tracking_main_order", void 0);
TrackingMainEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.ORDER_DISTRIBUTED_MAIN, { schema: config_1.ORM_DB_SCHEMA })
], TrackingMainEntity);
exports.TrackingMainEntity = TrackingMainEntity;
//# sourceMappingURL=TrackingMainEntities.js.map
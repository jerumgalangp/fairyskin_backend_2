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
exports.TrackingEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const ProductEntities_1 = require("./ProductEntities");
const UserEntities_1 = require("./UserEntities");
let TrackingEntity = class TrackingEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], TrackingEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], TrackingEntity.prototype, "date_distributed", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], TrackingEntity.prototype, "quantity", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], TrackingEntity.prototype, "reference_value", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], TrackingEntity.prototype, "productId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], TrackingEntity.prototype, "customerId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ProductEntities_1.ProductsEntity, (p) => p.distributed_products),
    __metadata("design:type", ProductEntities_1.ProductsEntity)
], TrackingEntity.prototype, "product", void 0);
__decorate([
    typeorm_1.ManyToOne(() => UserEntities_1.UserEntity, (p) => p.distributed_products),
    __metadata("design:type", UserEntities_1.UserEntity)
], TrackingEntity.prototype, "customer", void 0);
TrackingEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.ORDER_DISTRIBUTED, { schema: config_1.ORM_DB_SCHEMA })
], TrackingEntity);
exports.TrackingEntity = TrackingEntity;
//# sourceMappingURL=TrackingEntities.js.map
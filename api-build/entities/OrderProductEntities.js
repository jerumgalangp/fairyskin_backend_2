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
exports.OrderProductEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const OrderEntities_1 = require("./OrderEntities");
const ProductEntities_1 = require("./ProductEntities");
let OrderProductEntity = class OrderProductEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], OrderProductEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], OrderProductEntity.prototype, "quantity", void 0);
__decorate([
    typeorm_1.Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true }),
    __metadata("design:type", Number)
], OrderProductEntity.prototype, "price", void 0);
__decorate([
    typeorm_1.Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true }),
    __metadata("design:type", Number)
], OrderProductEntity.prototype, "total", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], OrderProductEntity.prototype, "orderId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], OrderProductEntity.prototype, "productId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => OrderEntities_1.OrderEntity, (o) => o.order_products),
    __metadata("design:type", OrderEntities_1.OrderEntity)
], OrderProductEntity.prototype, "order", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ProductEntities_1.ProductsEntity, (p) => p.order_products),
    __metadata("design:type", ProductEntities_1.ProductsEntity)
], OrderProductEntity.prototype, "product", void 0);
OrderProductEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.ORDER_PRODUCTS, { schema: config_1.ORM_DB_SCHEMA })
], OrderProductEntity);
exports.OrderProductEntity = OrderProductEntity;
//# sourceMappingURL=OrderProductEntities.js.map
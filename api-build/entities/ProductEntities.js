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
exports.ProductsEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const Common_1 = require("./Common");
const OrderDeliveredEntities_1 = require("./OrderDeliveredEntities");
const OrderProductEntities_1 = require("./OrderProductEntities");
const TrackingEntities_1 = require("./TrackingEntities");
let ProductsEntity = class ProductsEntity extends Common_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], ProductsEntity.prototype, "product_code", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], ProductsEntity.prototype, "product_name", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Number)
], ProductsEntity.prototype, "quantity", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ProductsEntity.prototype, "ordered_quantity", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ProductsEntity.prototype, "forecasted_quantity", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ProductsEntity.prototype, "approval_ind", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ProductsEntity.prototype, "reference_value", void 0);
__decorate([
    typeorm_1.OneToMany(() => OrderProductEntities_1.OrderProductEntity, (op) => op.product),
    __metadata("design:type", Array)
], ProductsEntity.prototype, "order_products", void 0);
__decorate([
    typeorm_1.OneToMany(() => OrderDeliveredEntities_1.OrderDeliveredEntity, (op) => op.product),
    __metadata("design:type", Array)
], ProductsEntity.prototype, "order_delivered", void 0);
__decorate([
    typeorm_1.OneToMany(() => TrackingEntities_1.TrackingEntity, (op) => op.product),
    __metadata("design:type", Array)
], ProductsEntity.prototype, "distributed_products", void 0);
ProductsEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.PRODUCTS, { schema: config_1.ORM_DB_SCHEMA })
], ProductsEntity);
exports.ProductsEntity = ProductsEntity;
//# sourceMappingURL=ProductEntities.js.map
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
exports.ProductsPendingEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const CommonPendingEntities_1 = require("./CommonPendingEntities");
let ProductsPendingEntity = class ProductsPendingEntity extends CommonPendingEntities_1.CommonPendingEntity {
};
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], ProductsPendingEntity.prototype, "product_code", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], ProductsPendingEntity.prototype, "product_name", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", Number)
], ProductsPendingEntity.prototype, "quantity", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ProductsPendingEntity.prototype, "reference_value", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ProductsPendingEntity.prototype, "forecasted_quantity", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ProductsPendingEntity.prototype, "approval_ind", void 0);
ProductsPendingEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.PRODUCTS_PENDING, { schema: config_1.ORM_DB_SCHEMA })
], ProductsPendingEntity);
exports.ProductsPendingEntity = ProductsPendingEntity;
//# sourceMappingURL=ProductPendingEntities.js.map
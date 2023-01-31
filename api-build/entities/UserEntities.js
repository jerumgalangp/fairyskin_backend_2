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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const Common_1 = require("./Common");
const CustomerEntities_1 = require("./CustomerEntities");
const RoleEntities_1 = require("./RoleEntities");
const SessionEntites_1 = require("./SessionEntites");
const TrackingEntities_1 = require("./TrackingEntities");
const TrackingMainEntities_1 = require("./TrackingMainEntities");
let UserEntity = class UserEntity extends Common_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "contact_number", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "address", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "force_ind", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "role_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => RoleEntities_1.RoleEntity, ({ roles }) => roles),
    typeorm_1.JoinColumn({ name: 'role_id' }),
    __metadata("design:type", RoleEntities_1.RoleEntity)
], UserEntity.prototype, "role", void 0);
__decorate([
    typeorm_1.OneToOne(() => SessionEntites_1.SessionEntity, ({ user_id }) => user_id, { onDelete: 'CASCADE' }),
    __metadata("design:type", SessionEntites_1.SessionEntity)
], UserEntity.prototype, "session_id", void 0);
__decorate([
    typeorm_1.OneToOne(() => CustomerEntities_1.CustomerEntity, ({ user_id }) => user_id),
    __metadata("design:type", CustomerEntities_1.CustomerEntity)
], UserEntity.prototype, "customer_id", void 0);
__decorate([
    typeorm_1.OneToMany(() => TrackingEntities_1.TrackingEntity, (op) => op.customer),
    __metadata("design:type", Array)
], UserEntity.prototype, "distributed_products", void 0);
__decorate([
    typeorm_1.OneToMany(() => TrackingMainEntities_1.TrackingMainEntity, ({ tracking_main_customer }) => tracking_main_customer),
    __metadata("design:type", Array)
], UserEntity.prototype, "tracking_main", void 0);
UserEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.USER, { schema: config_1.ORM_DB_SCHEMA })
], UserEntity);
exports.UserEntity = UserEntity;
//# sourceMappingURL=UserEntities.js.map
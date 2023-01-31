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
exports.RoleEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const Common_1 = require("./Common");
const UserEntities_1 = require("./UserEntities");
let RoleEntity = class RoleEntity extends Common_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], RoleEntity.prototype, "role_name", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], RoleEntity.prototype, "role_description", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, default: 'N' }),
    __metadata("design:type", String)
], RoleEntity.prototype, "recipient", void 0);
__decorate([
    typeorm_1.OneToMany(() => UserEntities_1.UserEntity, ({ role }) => role),
    __metadata("design:type", Array)
], RoleEntity.prototype, "roles", void 0);
RoleEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.ROLES, { schema: config_1.ORM_DB_SCHEMA })
], RoleEntity);
exports.RoleEntity = RoleEntity;
//# sourceMappingURL=RoleEntities.js.map
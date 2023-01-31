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
exports.AccessEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const Common_1 = require("./Common");
const MenuEntities_1 = require("./MenuEntities");
const RoleEntities_1 = require("./RoleEntities");
let AccessEntity = class AccessEntity extends Common_1.CommonEntity {
};
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], AccessEntity.prototype, "role_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => RoleEntities_1.RoleEntity, ({ roles }) => roles),
    typeorm_1.JoinColumn({ name: 'role_id' }),
    __metadata("design:type", RoleEntities_1.RoleEntity)
], AccessEntity.prototype, "role", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], AccessEntity.prototype, "menu_id", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], AccessEntity.prototype, "status", void 0);
__decorate([
    typeorm_1.ManyToOne(() => MenuEntities_1.MenuEntity, ({ menus }) => menus),
    typeorm_1.JoinColumn({ name: 'menu_id' }),
    __metadata("design:type", MenuEntities_1.MenuEntity)
], AccessEntity.prototype, "menu", void 0);
AccessEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.ACCESS, { schema: config_1.ORM_DB_SCHEMA })
], AccessEntity);
exports.AccessEntity = AccessEntity;
//# sourceMappingURL=AccessEntities.js.map
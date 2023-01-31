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
exports.SessionEntity = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const UserEntities_1 = require("./UserEntities");
let SessionEntity = class SessionEntity extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], SessionEntity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], SessionEntity.prototype, "expiry_date", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], SessionEntity.prototype, "user_id", void 0);
__decorate([
    typeorm_1.OneToOne(() => UserEntities_1.UserEntity, ({ session_id }) => session_id, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn({ name: 'user_id' }),
    __metadata("design:type", UserEntities_1.UserEntity)
], SessionEntity.prototype, "user", void 0);
SessionEntity = __decorate([
    typeorm_1.Entity(Entities_1.Entities.SESSION, { schema: config_1.ORM_DB_SCHEMA })
], SessionEntity);
exports.SessionEntity = SessionEntity;
//# sourceMappingURL=SessionEntites.js.map
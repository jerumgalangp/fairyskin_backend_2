"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_RESPONSES = exports.HttpResponseType = exports.Code = void 0;
var Code;
(function (Code) {
    Code[Code["ServerError"] = 0] = "ServerError";
    Code[Code["Success"] = 1] = "Success";
    Code[Code["Created"] = 2] = "Created";
    Code[Code["Updated"] = 3] = "Updated";
    Code[Code["Deleted"] = 4] = "Deleted";
    Code[Code["Restored"] = 5] = "Restored";
    Code[Code["BadRequest"] = 6] = "BadRequest";
    Code[Code["Unauthorized"] = 7] = "Unauthorized";
    Code[Code["Conflict"] = 8] = "Conflict";
    Code[Code["Reset"] = 9] = "Reset";
})(Code = exports.Code || (exports.Code = {}));
var HttpResponseType;
(function (HttpResponseType) {
    HttpResponseType["ServerError"] = "server_error";
    HttpResponseType["Success"] = "success";
    HttpResponseType["Created"] = "created";
    HttpResponseType["Updated"] = "updated";
    HttpResponseType["Deleted"] = "deleted";
    HttpResponseType["Approval"] = "approval";
    HttpResponseType["Restored"] = "restored";
    HttpResponseType["BadRequest"] = "bad_request";
    HttpResponseType["Unauthorized"] = "unauthorized";
    HttpResponseType["Conflict"] = "conflict";
    HttpResponseType["Reset"] = "reset";
})(HttpResponseType = exports.HttpResponseType || (exports.HttpResponseType = {}));
exports.HTTP_RESPONSES = {
    server_error: {
        message: 'Server Error',
        statusCode: 500,
        code: 0
    },
    success: {
        message: 'Success',
        statusCode: 200,
        code: 1
    },
    created: {
        message: 'Created',
        statusCode: 201,
        code: 2
    },
    updated: {
        message: 'Updated',
        statusCode: 200,
        code: 3
    },
    deleted: {
        message: 'Deleted',
        statusCode: 200,
        code: 4
    },
    restored: {
        message: 'Deleted',
        statusCode: 200,
        code: 5
    },
    bad_request: {
        message: 'Bad Request',
        statusCode: 400,
        code: 6
    },
    unauthorized: {
        message: 'Unauthorized',
        statusCode: 401,
        code: 7
    },
    conflict: {
        message: 'Conflict',
        statusCode: 409,
        code: 8
    },
    reset: {
        message: 'Reset',
        statusCode: 200,
        code: 9
    },
    approval: {
        message: 'Approval',
        statusCode: 200,
        code: 10
    }
};
//# sourceMappingURL=HttpConstant.js.map
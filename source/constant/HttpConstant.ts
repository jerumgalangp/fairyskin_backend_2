/* Coding Scheme
  0 - Sever Error
  1 - Success
  2 - Created
  3 - Updated
  4 - Deleted
  5 - Restored
  6 - Bad Request
  7 - Unauthorized
  8 - Conflict
  9 - Reset Password
*/

export enum Code {
    ServerError = 0,
    Success = 1,
    Created = 2,
    Updated = 3,
    Deleted = 4,
    Restored = 5,
    BadRequest = 6,
    Unauthorized = 7,
    Conflict = 8,
    Reset = 9
}

export enum HttpResponseType {
    ServerError = 'server_error',
    Success = 'success',
    Created = 'created',
    Updated = 'updated',
    Deleted = 'deleted',
    Approval = 'approval',
    Restored = 'restored',
    BadRequest = 'bad_request',
    Unauthorized = 'unauthorized',
    Conflict = 'conflict',
    Reset = 'reset'
}

export const HTTP_RESPONSES = {
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

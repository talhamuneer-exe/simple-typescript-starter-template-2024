/**
 * ESLint Rule: Require Response Codes
 * Encourages use of route-specific response codes
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Encourage use of route-specific response codes',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: null,
    schema: [],
    messages: {
      successWithoutCode:
        'SuccessResponse should include a route-specific responseCode parameter (4th argument) when available',
      errorWithoutCode:
        'Error responses should include both errorCode (2nd/3rd arg) and responseCode (4th arg) when available',
    },
  },
  create(context) {
    return {
      // Check SuccessResponse usage - should have 4 args: (res, message, data?, responseCode?)
      NewExpression(node) {
        if (
          node.callee &&
          node.callee.name === 'SuccessResponse' &&
          node.arguments &&
          node.arguments.length === 2
        ) {
          const filename = context.getFilename();
          if (filename.includes('controller') || filename.includes('Controller')) {
            context.report({
              node,
              messageId: 'successWithoutCode',
            });
          }
        }
      },

      // Check error response usage
      NewExpression(node) {
        const errorResponseClasses = [
          'BadRequestResponse',
          'NotFoundResponse',
          'UnauthorizedResponse',
          'ForbiddenResponse',
          'ConflictResponse',
          'InternalErrorResponse',
        ];

        if (
          node.callee &&
          errorResponseClasses.includes(node.callee.name) &&
          node.arguments &&
          node.arguments.length === 2
        ) {
          const filename = context.getFilename();
          if (filename.includes('controller') || filename.includes('Controller')) {
            context.report({
              node,
              messageId: 'errorWithoutCode',
            });
          }
        }
      },
    };
  },
};

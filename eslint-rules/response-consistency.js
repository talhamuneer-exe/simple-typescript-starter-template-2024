/**
 * Custom ESLint Rule: Response Consistency
 * Ensures all responses use standardized response classes
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure responses use standardized response classes',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      directJsonResponse:
        'Avoid using res.json() directly. Use standardized response classes (SuccessResponse, BadRequestResponse, etc.) from utils',
      useSuccessResponse:
        'Use SuccessResponse class instead of manually constructing responses',
      useErrorResponse:
        'Use error response classes (BadRequestResponse, NotFoundResponse, etc.) instead of manually constructing responses',
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode();

    return {
      // Check for direct res.json() calls
      CallExpression(node) {
        // Check for res.json(...)
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property &&
          node.callee.property.name === 'json' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'res'
        ) {
          // Check if it's inside a controller file
          const filename = context.getFilename();
          if (filename.includes('controller') || filename.includes('Controller')) {
            context.report({
              node,
              messageId: 'directJsonResponse',
            });
          }
        }

        // Check for res.status().json(...)
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property &&
          node.callee.property.name === 'json' &&
          node.callee.object.type === 'CallExpression' &&
          node.callee.object.callee &&
          node.callee.object.callee.type === 'MemberExpression' &&
          node.callee.object.callee.property &&
          node.callee.object.callee.property.name === 'status' &&
          node.callee.object.callee.object &&
          node.callee.object.callee.object.type === 'Identifier' &&
          node.callee.object.callee.object.name === 'res'
        ) {
          const filename = context.getFilename();
          if (filename.includes('controller') || filename.includes('Controller')) {
            context.report({
              node,
              messageId: 'directJsonResponse',
            });
          }
        }
      },
    };
  },
};

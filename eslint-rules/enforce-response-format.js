/**
 * ESLint Rule: Enforce Response Format
 * Ensures responses follow the standardized format structure
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce standardized response format',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      missingSendCall:
        'Response objects must call .send() method to send the response. Use: new SuccessResponse(...).send() or response.send()',
    },
  },
  create(context) {
    const responseClasses = [
      'SuccessResponse',
      'BadRequestResponse',
      'NotFoundResponse',
      'UnauthorizedResponse',
      'ForbiddenResponse',
      'ConflictResponse',
      'InternalErrorResponse',
      'NoContentResponse',
    ];

    return {
      // Check VariableDeclarator - if response is stored in variable, ensure .send() is called
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === 'NewExpression' &&
          node.init.callee &&
          responseClasses.includes(node.init.callee.name)
        ) {
          const filename = context.getFilename();
          if (!filename.includes('controller') && !filename.includes('Controller')) {
            return; // Only check controller files
          }

          const variableName = node.id.name;
          const parent = node.parent.parent;

          // Check if this is in a function/block where .send() might be called
          let foundSendCall = false;

          // Look for .send() call in the same scope
          function checkForSendCall(nodeToCheck, depth = 0) {
            if (depth > 10) return false; // Prevent infinite recursion

            if (!nodeToCheck || !nodeToCheck.body) return false;

            const body = Array.isArray(nodeToCheck.body)
              ? nodeToCheck.body
              : [nodeToCheck.body];

            for (const statement of body) {
              // Check for direct .send() call
              if (
                statement.type === 'ExpressionStatement' &&
                statement.expression &&
                statement.expression.type === 'CallExpression' &&
                statement.expression.callee &&
                statement.expression.callee.type === 'MemberExpression' &&
                statement.expression.callee.property &&
                statement.expression.callee.property.name === 'send' &&
                statement.expression.callee.object &&
                statement.expression.callee.object.type === 'Identifier' &&
                statement.expression.callee.object.name === variableName
              ) {
                return true;
              }

              // Check for return with .send()
              if (
                statement.type === 'ReturnStatement' &&
                statement.argument &&
                statement.argument.type === 'CallExpression' &&
                statement.argument.callee &&
                statement.argument.callee.type === 'MemberExpression' &&
                statement.argument.callee.property &&
                statement.argument.callee.property.name === 'send' &&
                statement.argument.callee.object &&
                statement.argument.callee.object.type === 'Identifier' &&
                statement.argument.callee.object.name === variableName
              ) {
                return true;
              }

              // Recursively check nested blocks
              if (statement.type === 'BlockStatement') {
                if (checkForSendCall(statement, depth + 1)) {
                  return true;
                }
              }
            }

            return false;
          }

          // Check parent function/block
          let currentParent = parent;
          while (currentParent) {
            if (
              currentParent.type === 'FunctionDeclaration' ||
              currentParent.type === 'FunctionExpression' ||
              currentParent.type === 'ArrowFunctionExpression' ||
              currentParent.type === 'BlockStatement'
            ) {
              foundSendCall = checkForSendCall(currentParent);
              if (foundSendCall) break;
            }
            currentParent = currentParent.parent;
          }

          // Also check if it's immediately followed by .send()
          if (
            parent &&
            parent.type === 'VariableDeclaration' &&
            parent.parent &&
            parent.parent.body &&
            Array.isArray(parent.parent.body)
          ) {
            const index = parent.parent.body.indexOf(parent);
            if (index >= 0 && index < parent.parent.body.length - 1) {
              const nextStatement = parent.parent.body[index + 1];
              if (
                nextStatement.type === 'ExpressionStatement' &&
                nextStatement.expression &&
                nextStatement.expression.type === 'CallExpression' &&
                nextStatement.expression.callee &&
                nextStatement.expression.callee.type === 'MemberExpression' &&
                nextStatement.expression.callee.property &&
                nextStatement.expression.callee.property.name === 'send' &&
                nextStatement.expression.callee.object &&
                nextStatement.expression.callee.object.type === 'Identifier' &&
                nextStatement.expression.callee.object.name === variableName
              ) {
                foundSendCall = true;
              }
            }
          }

          if (!foundSendCall) {
            context.report({
              node,
              messageId: 'missingSendCall',
            });
          }
        }
      },
    };
  },
};

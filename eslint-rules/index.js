/**
 * Custom ESLint Rules Index
 * Exports all custom rules for response consistency
 */

module.exports = {
  'response-consistency': require('./response-consistency'),
  'require-response-code': require('./require-response-code'),
  'enforce-response-format': require('./enforce-response-format'),
};

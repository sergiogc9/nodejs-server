import sergio from '@sergiogc9/eslint-config';

export default [{ ignores: ['**/dist/**'] }, ...sergio.base, ...sergio.vitest];

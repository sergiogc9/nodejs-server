/**
 * Makes sure the class or instance passed is a unique singleton. This is needed for singleton elements exported in different packages
 * @param a The class or instance to make global
 * @returns The global instance or class
 */
const getGlobalSingleton = <T extends any>(key: string, item: T): T => {
	const globalKey = `@sergiogc9/nodejs.utils/${key}`;
	if (!(global as any)[globalKey]) (global as any)[globalKey] = item;

	return (global as any)[globalKey];
};

export { getGlobalSingleton };

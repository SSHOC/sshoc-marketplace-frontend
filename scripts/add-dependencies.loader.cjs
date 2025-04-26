// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/** @type {import('webpack').PitchLoaderDefinitionFunction<{ dependencies?: Array<string> }>} */
module.exports.pitch = function pitch() {
	const options = this.getOptions();
	const dependencies = options.dependencies ?? [];
	for (const dependency of dependencies) {
		this.addDependency(dependency);
	}
};

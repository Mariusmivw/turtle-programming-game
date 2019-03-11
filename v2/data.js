! function(root, factory) {
	const deps = [];
	const placeOnRoot = true;
	const nameOnRoot = 'data';

	if (typeof define === 'function' && define.amd) {
		// AMD
		define(deps, factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		const args = [];
		for (const dep in deps) {
			args.push(require(dep));
		}
		module.exports = factory.apply(this, args);
	} else {
		// Browser globals (Note: root is not always window)
		const ret = factory();
		placeOnRoot && (root[nameOnRoot] = ret);
	}
}('undefined' != typeof window ? window : this, function(...deps) {
	return {
		grid: false,
		hoverCell: [],
		color: 1
	};
});
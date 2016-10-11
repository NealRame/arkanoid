module.exports = {
	get isProduction() {
		return process.env.NODE_ENV === 'production';
	},
	get isDevelopment() {
		return !this.isProduction;
	}
}

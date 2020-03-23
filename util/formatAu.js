export default auBalance =>
	auBalance < 1000
		? auBalance.toString()
		: auBalance < 100000
		? Math.floor(auBalance / 100) / 10 + "k"
		: Math.floor(auBalance / 1000) + "k";

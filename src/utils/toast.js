var cache = [];

const clearCache = (item) => {
	cache = cache.filter((el) => el != item);
}

export default function toast({ html, classes }) {
	if(cache.find((el) => el == html)) return;
	cache.push(html);
	M.toast({
		html,
		classes,
		completeCallback: () => clearCache(html)
	});
}
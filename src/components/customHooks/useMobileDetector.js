import { useState, useEffect } from 'react';

export function useMobileDetector(breakpoint = 993) {
	const isClient = typeof window === 'object';

	function getWidth() {
		return isClient ? window.innerWidth : undefined
	}

	const [mobileActive, setMobileActive] = useState(getWidth() < breakpoint);

	useEffect(() => {

		if (!isClient) {
			return false;
		}
		
		function handleResize() {
			setMobileActive(getWidth() < breakpoint);
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [mobileActive]);

	return mobileActive;
}
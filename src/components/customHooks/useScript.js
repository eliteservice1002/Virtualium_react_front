import { useState, useEffect } from 'react';

// Hook
let cachedScripts = [];
export function useScript(src) {
	// Realizar un seguimiento del script cargado y el estado de error
	const [state, setState] = useState({
		loaded: false,
		error: false
	});

	useEffect(() => {
			/*
			 * Si la matriz cachedScripts ya incluye src, eso significa otra instancia...
			 * ... de este gancho ya cargó este script, por lo que no es necesario cargarlo nuevamente.
			 */
			if (cachedScripts.includes(src)) {
				setState({
					loaded: true,
					error: false
				});
			} else {
				cachedScripts.push(src);

				// Crear script
				let script = document.createElement('script');
				script.src = src;
				script.async = true;

				// Script event listener callbacks for load and error
				const onScriptLoad = () => {
					setState({
						loaded: true,
						error: false
					});
				};

				const onScriptError = () => {
					// Eliminar de las secuencias de comandos en caché podemos intentar cargar de nuevo
					const index = cachedScripts.indexOf(src);
					if (index >= 0) cachedScripts.splice(index, 1);
					script.remove();

					setState({
						loaded: true,
						error: true
					});
				};

				script.addEventListener('load', onScriptLoad);
				script.addEventListener('error', onScriptError);

				// Add script to document body
				document.body.appendChild(script);
				// let firstScriptTag = document.getElementsByTagName('script')[0];
				// firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

				// Remove event listeners on cleanup
				return () => {
					script.removeEventListener('load', onScriptLoad);
					script.removeEventListener('error', onScriptError);
				};
			}
		},
		[src] // Only re-run effect if script src changes
	);

	return [state.loaded, state.error];
}
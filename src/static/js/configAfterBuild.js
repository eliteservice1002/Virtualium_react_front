/**
 * Configuraciones que pueden variar despues de compilar la APP
 * para sobreescribir cualquier constante declarada en el config.js
 * principal se debe agregar como una propiedad al objeto CONFIG_AFTER_BUILD
 * y se debe agregar como primera opción a evaluar en config.js Ejemplo:
 * const MI_VARIABLE = CONFIG_AFTER_BUILD.mi_variable || 'otro valor en caso de no existir';
 * @type {Object}
 */
const CONFIG_AFTER_BUILD = {
	api_py: null,
	camera_url: null,
	api_cakephp: null,
}
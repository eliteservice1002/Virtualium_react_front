import {
	GET_EVENTO,
	SET_EVENTO,
	RESET_EVENTO,
	UPDATE_EVENTO,
	SET_RESUMEN_COMPRA,
	RESET_RESUMEN_COMPRA,
	SET_ACCESS_CODE_DATA,
	RESET_ACCESS_CODE_DATA,
} from '../config.js';

const initAccessCodeData = {
	data: null,
	codValido: false,
}

const init = {
	isEmpty: true,
	isFetching: false,
	/**
	 * [resumenDeCompra description]
	 * Almacena la información de la compra realizada para mostrar
	 * un resumen en la página de compra exitosa
	 * @type {Object}
	 */
	resumenDeCompra: {},
	/**
	 * [accessCodeData description]
	 * Almacena la información de asociada a un código de acceso que fue correctamente
	 * verificado. Esta clave 'accessCodeData' es utilizada en caso de que el código de
	 * acceso no pertenezca al evento en el que está actualmente el usaurio, en ese caso 
	 * debe ser redirigido y se almacena temporalmente la info para ser seteada nuevamente
	 * @type {object}
	 */
	accessCodeData: initAccessCodeData,
};

const evento = (state = init, action) => {
	switch(action.type) {
		case SET_EVENTO:
		case GET_EVENTO:
		case UPDATE_EVENTO:
		case SET_RESUMEN_COMPRA:
		case SET_ACCESS_CODE_DATA:
			return { ...state, ...action.payload };
			break;
		case RESET_RESUMEN_COMPRA:
			return { ...state, resumenDeCompra: {} };
			break;
		case RESET_ACCESS_CODE_DATA:
			return { ...state, accessCodeData: initAccessCodeData };
			break;
		case RESET_EVENTO:
			return {
				...init,
				accessCodeData: state.accessCodeData,
				resumenDeCompra: state.resumenDeCompra
			};
			break;
		default:
			return state;
	}
};

export default evento;
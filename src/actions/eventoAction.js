import httpClient from '../utils/axios';
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

/*
 * @param {Object} payload | evento id 
 * @param {Function} dispatch
*/
export const setEvento = async ({ id, history }, dispatch) => {
	dispatch({
		type: GET_EVENTO,
		payload: {
			isFetching: true
		}
	})

	let { data } = await httpClient.apiGet(`eventos/ver/${id}`);

	if(!data) return history.replace('/404');

	dispatch({
		type: SET_EVENTO,
		payload: {
			isEmpty: false,
			isFetching: false,
			...data
		}
	})
}

export const updateEvento = (evento) => {
	return({
		type: UPDATE_EVENTO,
		payload: {
			isEmpty: false,
			isFetching: false,
			...evento
		}
	})
}

export const resetEvento =  () => {
	return {
		type: RESET_EVENTO,
	}
}

export const resetResumenCompra =  () => {
	return {
		type: RESET_RESUMEN_COMPRA,
	}
}

export const setResumenDeCompra  = (data) => {
	return {
		type: SET_RESUMEN_COMPRA,
		payload: {
			resumenDeCompra: { ...data },
		}
	}
}

export const resetAccessCodeData =  () => {
	return {
		type: RESET_ACCESS_CODE_DATA,
	}
}

export const setAccessCodeData  = (data) => {
	return {
		type: SET_ACCESS_CODE_DATA,
		payload: {
			accessCodeData: { ...data },
		}
	}
}
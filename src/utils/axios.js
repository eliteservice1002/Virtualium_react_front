const axios = require('axios');
// axios.defaults.withCredentials = true;
const { API_CAKEPHP } = require('../config.js');
const urlBase = API_CAKEPHP;

// 'Content-Type': 'application/json',
// 'Content-Type': 'multipart/form-data',
// 'Content-Type': 'application/x-www-form-encoded',

/**
 * @param {string} $url url a la cual consultar
 * esta funcion detecta si es una nueva url base (comienza con http:// o https://).
 * en caso de ser así, retorna la url. en caso contrario, se asume que es un fragmento
 * de path por lo que se concatena con la constante urlBase
 **/
const readUrl = (url = '') =>
	url.startsWith('http://') || url.startsWith('https://') ? url : `${urlBase}${url}`

const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
}

const get = (url = '', options = {}) => axios.get(readUrl(url), {
	headers: {
		...headers,
		...options.headers
	},
	...options
});

const apiGet = (url = '', options = {}) => get(`${API_CAKEPHP}${url}`, { ...options, withCredentials: true });

const post = (url = '', body = {}, options = {}) => axios.post(readUrl(url), body, {
	headers: {
		'Content-Type': 'multipart/form-data',
		...options.headers
	},
	...options
})

const apiPost = (url = '', body = {}, options = {}) => post(`${API_CAKEPHP}${url}`, body, { ...options, withCredentials: true });

const put = (url = '', body = {}, options = {}) => axios.put(readUrl(url), body, {
	headers: {
		...headers,
		...options.headers
	},
	...options
})

const del = (url = '', headers = {}) => axios.delete(readUrl(url), {
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...headers
	}
})

export default {
	apiPost,
	apiGet,
	get,
	post,
	put,
	delete: del,
}
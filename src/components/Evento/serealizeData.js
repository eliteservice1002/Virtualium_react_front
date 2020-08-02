const serealizeData = ({ state, user }, update) => {
	console.log(user);
	let formData = new FormData();
	formData.append('userId', user.id);
	formData.append('cantidad', state.cantidad);
	formData.append('tipoAcceso', state.acceso);
	formData.append('funcionId', state.funcion);
	formData.append('medioPago', state.medioPago);

	return formData;
}

export default serealizeData;
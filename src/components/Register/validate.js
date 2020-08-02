const empty = (value) => (value && value.trim()) ? false : true

const validate = (values, update = false) => {
	const errors = {};
	let totalErrors = 0;

	if(update) {
		// Validaciones para la actualización del perfil de usuario
		if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
			errors.email = 'Email invalido';
			totalErrors++;
		} else if(empty(values.email_confirmado)) {
			errors.email_confirmado = 'La confirmación del email es requerida';
			totalErrors++;
		} else if(values.email !== values.email_confirmado) {
			errors.email_confirmado = 'La confirmación del email no coincide';
			totalErrors++;
		}

		if(values.password !== values.passwordConfirmado) {
			errors.email_confirmado = 'La confirmación de la contraseña no coincide';
			totalErrors++;
		}
	} else {
		// Validaciones para el registro de un nuevo usuario
		if (empty(values.nombres)) {
			errors.nombres = 'El nombre es requerido';
			totalErrors++;
		}

		if (empty(values.apellidos)) {
			errors.apellidos = 'El apellido es requerido';
			totalErrors++;
		}

		if (empty(values.email)) {
			errors.email = 'El email es requerido';
			totalErrors++;
		} else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
			errors.email = 'Email invalido';
			totalErrors++;
		} else if(empty(values.email_confirmado)) {
			errors.email_confirmado = 'La confirmación del email es requerida';
			totalErrors++;
		} else if(values.email !== values.email_confirmado) {
			errors.email_confirmado = 'La confirmación del email no coincide';
			totalErrors++;
		}

		if(empty(values.password)) {
			errors.password = 'La contraseña es requerida';
			totalErrors++;
		} else if(values.password !== values.passwordConfirmado) {
			errors.email_confirmado = 'La confirmación de la contraseña no coincide';
			totalErrors++;
		}

		if(empty(values.nro_documento)) {
			errors.nro_documento = 'El N° de documento es requerido';
			totalErrors++;
		}

		// if(empty(values.tipoDoc)) {
		// 	errors.tipoDoc = 'El tipo de documento es requerido';
		// 	totalErrors++;
		// }
	}

	// Validaciones globales
	if(empty(values.recaptcha)) {
		errors.recaptcha = 'Complete el reto captcha';
		totalErrors++;
	}


	return [totalErrors, errors];
};

export default validate;

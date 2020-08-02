import React, {
	useRef,
	useState,
	Fragment,
	useEffect,
} from 'react';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';

/* Components */
import Select from '../Select';
import Checkbox from '../Checkbox';
import Modal from '../Modal/Modal';
import TextInput from '../TextInput';

/* Style */
import cx from 'classnames';
import style from './register.css';

/* CustomHooks */
import { useAsync } from '../customHooks';

/* context */
import connect from '../../context/connect';

/* utils */
import validate from './validate';
import paises from '../../utils/paises';
import httpClient from '../../utils/axios';
import serealizeData from './serealizeData';
import { SITE_KEY_RECAPTCHA, ASSETS_URL } from '../../config';


/* Actions */
import { verifySession } from '../../actions/loginAction';

const initialState = {
	email: '',
	genero: '',
	nacDia: '',
	nacMes: '',
	nacAnho: '',
	nombres: '',
	telefono: '',
	password: '',
	cod_pais: '',
	apellidos: '',
	domicilio: '',
	direccion: '',
	provincia: '',
	recaptcha: null,
	localidad: '',
	image_file: '',
	imagen_perfil: '',
	codigo_postal: '',
	aceptoTerminos: 0,
	nro_documento: '',
	acepta_noticias: 1,
	fecha_nacimiento: '',
	email_confirmado: '',
	passwordConfirmado: '',
}

const Register = ({handleToggleAccount, sidenav, user, verifySession, ...props}) => {
	const _form = useRef(null);
	const _recaptcha = useRef(null);
	const _imageFileRef = useRef(null);
	const modalInstanceRef = useRef(null);
	const _wrapperRegister = useRef(null);
	const [ avatars, setAvatars ] = useState([]);
	const [ state, setState ] = useState(initialState);
	const [ profileImg, setProfileImg ] = useState(null);
	const [ disablebRegistro, setDisablebRegistro ] = useState(true);
	const [ requiredCompletedCount, setRequiredCompletedCount ] = useState(0);
	const [ requiredCompletedTotal, setRequiredCompletedTotal ] = useState(6);
	const [ fieldRequired, setFieldRequired ] = useState({
		nombres: false,
		apellidos: false,
		email: false,
		nro_documento: false,
		password: false,
		recaptcha: false
	});

	useEffect(() => {
		httpClient.apiGet('avatars')
		.then(({ data }) => {
			setAvatars(data);
		})
	}, [])

	useEffect(() => {
		let count = 0;
		for(const field in fieldRequired) {
			if(fieldRequired[field]) count++;
		}

		setDisablebRegistro(count < requiredCompletedTotal || !state.aceptoTerminos)
		setRequiredCompletedCount(count);
	}, [fieldRequired])

	useEffect(() => {
		setState((prevState) => {
			let newState = { ...initialState };
			if(user) {
				for(const field in user) {
					if(user[field] && newState.hasOwnProperty(field)) {
						newState[field] = user[field];
					}
				}
				newState.genero = `${newState.genero}`;
				newState.email_confirmado = newState.email;
				if(newState.fecha_nacimiento) {
					const [ anho, mes, dia ] = newState.fecha_nacimiento.split('-');
					newState.nacMes = `${mes}`;
					newState.nacDia = `${dia}`;
					newState.nacAnho = `${anho}`;
				}
			} else {
				newState = { ...initialState };
			}
			return newState;
		})
	}, [user]);

	const onChangeRecaptcha = (e) => {
		setFieldRequired((prevState) => {
			const newState = { ...prevState };
			newState.recaptcha = e != '' && e != null;
			return newState;
		})

		setState((prevState) => {
			const newState = { ...prevState };
			newState.recaptcha = e;
			return newState;
		});

	}

	const handleInput = (e) => {
		var newState = {};
		const nameInput = e.target.name;
		let valueInput = e.target.value;
		switch(e.target.type) {
			case 'file':
				valueInput = e.target.files[0];
				if(valueInput) {
					_wrapperRegister.current.scrollTop = 0;
					setProfileImg(URL.createObjectURL(valueInput));
					newState.imagen_perfil = '';
				} else {
					setProfileImg(null);
				}
				break;
			case 'checkbox':
				valueInput = e.target.checked ? 1 : 0;
				break;
		}

		switch(nameInput) {
			case 'email':
			case 'nacDia':
			case 'nacMes':
			case 'nombres':
			case 'password':
			case 'apellidos':
			case 'recaptcha':
			case 'nro_documento':
				setFieldRequired((prevState) => {
					const newState = { ...prevState };
					newState[nameInput] = valueInput != '';
					return newState;
				})
				break;
			case 'aceptoTerminos':
				setDisablebRegistro(requiredCompletedCount < requiredCompletedTotal || !valueInput)
				break;
			case 'imagen_perfil':
				newState.image_file = null;
				setProfileImg(ASSETS_URL+valueInput);
				break;
		}
		setState((prevState) => {
			newState = { ...prevState, ...newState };
			newState[nameInput] = valueInput
			return newState;
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if(disablebRegistro && !user) return;
		setDisablebRegistro(true);

		M.toast({
			html: `Se está procesando su ${(user) ? 'actualización' : 'registro'}...`,
			classes:'blue black-text'
		});

		const update = (user) ? true : false;
		const [totalErrors, errors] = validate(state, update);

		if(!totalErrors) {
			try {
				const URI = (update) ? 'actualizar/'+user.id : 'registrar';
				const { data } = await httpClient.apiPost(`clientes/${URI}`, serealizeData(state, update));

				if(data.cod == 400) {
					for(const field in data.errors) {
						for(const err in data.errors[field]) {
							M.toast({
								html: data.errors[field][err],
								classes:`black-text yellow`
							});
						}
					}
				} else if(data.cod == 200) {
					setState(initialState);
					setProfileImg(null);
					_imageFileRef.current.value = null;
					M.toast({
						html: `${(update) ? 'Actualización exitosa' : 'Registro exitoso'}`,
						classes:`black-text green`
					});

					if(!update) {
						M.toast({
							html: 'Revise su bandeja de mail y confirme su registro',
							classes:`black-text green`
						});
					} else {
						verifySession();
					}
					handleToggleAccount(null, true);
				}

				setDisablebRegistro(false);
			} catch(err) {
				console.error(err);
				M.toast({
						html: 'Ocurrió un error. Por favor intente nuevamente',
						classes:'red black-text'
					});
				setDisablebRegistro(false);
			}
		} else {
			for(const err in errors) {
				M.toast({
					html: errors[err],
					classes:'red black-text'
				});

			}
			setDisablebRegistro(false);
		}
	}

	const renderApellidos = () => (
		<TextInput
			s={12}
			type='text'
			name='apellidos'
			value={state.apellidos}
			onChange={handleInput}
			icon={(sidenav) ? null : 'account_circle'}
			globalClasses={cx(style.inputIcon, style.inputBottom)}
			label={
				<span>Apellidos {(user) ? '' : <span className="red-text">*</span>}</span>
			}
			// validate
			required={!user}
		/>
	);

	const renderEmailConfirmacion = () => (
		<TextInput
			s={12}
			validate
			type='email'
			required={!user}
			name='email_confirmado'
			onChange={handleInput}
			value={state.email_confirmado}
			icon={(sidenav) ? null : 'email'}
			globalClasses={cx(style.inputBottom, style.inputIcon)}
			label={
				<span>Confirme e-mail {(user) ? '' : <span className="red-text">*</span>}</span>
			}
		/>
	);

	const renderAvatarsSelect = () => {
		return( (avatars.length) ?
			<Select
				s={12}
				name='imagen_perfil'
				onChange={handleInput}
				value={state.imagen_perfil}
				selectClassName={style.selectM}
			>
			<option disabled value="" > Elegir un Avatar</option>
			{
				avatars.map((el) => (
					<option
						key={el.id}
						value={el.avatar_url}
						data-icon={ASSETS_URL+el.avatar_url}
					> { el.nombre } </option>
				))
			}
			</Select>
			: null
		)
	}

	return(
		<div
			ref={_wrapperRegister}
			className={cx(
				'z-depth-3',
				props.className, 
				style.wrapperRegister,
				{[`${style.mobile}`]: sidenav},
			)}
		>
			<div className={style.header} >
				<div className={cx(style.profileImg)} >
					<Modal
						className={style.modalUpload}
						modalInstanceRef={modalInstanceRef}
						trigger={ (profileImg) ?
							<span
								className={style.previewImg}
								style={{backgroundImage: `url(${profileImg})`}}
							></span>
							: (user && user.imagen_perfil) ? // else if
							<span
								className={style.previewImg}
								style={{backgroundImage: `url(${ASSETS_URL+user.imagen_perfil})`}}
							></span>
							: // else
							<span className={style.uploadAvatar} ><img src="/img/icons/camera.svg" alt=""/></span>
						}
					>
					{ renderAvatarsSelect() }
					<span
						className={cx('btn', style.btnUpload)}
						onClick={() => { _imageFileRef.current.click() }}
					>
						subir unir foto
					</span>

					<button
						className={cx('btn', 'red', style.btnUpload)}
						onClick={() => {
							setProfileImg(null);
							setState((prevState) => ({...prevState, imagen_perfil: '', image_file: ''}));
						}}
					>
						borrar
					</button>
					</Modal>
				</div>

				<div className={style.title} >
					<h2>
						{(user) ? 'Actualizar mi perfil' : 'Ingresa tus datos'}
					</h2>
					<div className={style.lineTitle} ></div>
				</div>
				<input
					type="file"
					accept='image/*'
					name='image_file'
					ref={_imageFileRef}
					onChange={handleInput}
					style={{ display: "none" }}
				/>
			</div>

			<form ref={_form} onSubmit={handleSubmit} >
				<div className="row">
					<div className="col s12 l4">
						<TextInput
							s={12}
							validate
							type='text'
							name='nombres'
							required={!user}
							value={state.nombres}
							onChange={handleInput}
							icon={(sidenav) ? null : 'account_circle'}
							globalClasses={cx(style.inputIcon, style.inputBottom)}
							label={
								<span>Nombre {(user) ? '' : <span className="red-text">*</span>}</span>
								}
						/>

						{sidenav && renderApellidos()}

						<TextInput
							s={12}
							name='email'
							value={state.email}
							type='email'
							globalClasses={style.inputIcon}
							icon={(sidenav) ? null : 'email'}
							onChange={handleInput}
							label={
								<span>e-mail {(user) ? '' : <span className="red-text">*</span>}</span>
							}
							validate
							required={!user}
						/>

						{sidenav && renderEmailConfirmacion()}

						<TextInput
							s={12}
							value={state.nro_documento}
							name='nro_documento'
							type='text'
							globalClasses={cx(style.inputIcon, style.inputBottom)}
							icon={(sidenav) ? null : 'fingerprint'}
							onChange={handleInput}
							label={
								<span>Nº documento {(user) ? '' : <span className="red-text">*</span>}</span>
							}
							validate
							required={!user}
						/>

						{sidenav && <div className="col s12"><p className={style.label} >Fecha de nacimiento</p></div>}

						<TextInput
							s={4}
							name='nacDia'
							value={state.nacDia}
							type='text'
							globalClasses={cx(style.inputIcon, style.inputBottom)}
							icon={(sidenav) ? null : 'cake'}
							onChange={handleInput}
							label='Día'
						/>

						<TextInput
							s={4}
							name='nacMes'
							value={state.nacMes}
							globalClasses={cx(style.inputBottom)}
							type='text'
							onChange={handleInput}
							label='Mes'
						/>

						<TextInput
							s={4}
							name='nacAnho'
							value={state.nacAnho}
							globalClasses={cx(style.inputBottom)}
							type='text'
							onChange={handleInput}
							label='Año'
						/>

						<Select
							s={12}
							name='genero'
							value={state.genero}
							onChange={handleInput}
							selectClassName={style.selectM}
						>
							<option disabled value="" >
								Genero
							</option>
							<option value="masculino">Masculino</option>
							<option value="femenino">Femenino</option>
							<option value="otro">Otro</option>
						</Select>
					</div>

					<div className="col s12 l4">
						{!sidenav && renderApellidos()}
						{!sidenav && renderEmailConfirmacion()}

						<TextInput
							s={12}
							type='text'
							name='telefono'
							value={state.telefono}
							onChange={handleInput}
							label='Teléfono/Celular'
							icon={(sidenav) ? null : 'local_phone'}
							globalClasses={cx(style.inputIcon, style.inputBottom)}
						/>

						{ (!user) ? null :
							<p className={style.texto} >Dejar en blanco si no desea cambiar su contraseña</p>
						}

						<TextInput
							s={12}
							name='password'
							value={state.password}
							type='password'
							onChange={handleInput}
							label={
								(user) ? <span>Nueva contraseña</span> :
								<span>Contraseña <span className="red-text">*</span></span>
							}
							validate
							required={!user}
						/>

						<TextInput
							s={12}
							validate
							type='password'
							required={!user}
							onChange={handleInput}
							name='passwordConfirmado'
							value={state.passwordConfirmado}
							globalClasses={cx(style.inputBottom)}
							label={
								<span>Confirmar contraseña {(user) ? '' : <span className="red-text">*</span>}</span>
							}
						/>
					</div>

					<div className="col s12 l4">
						<TextInput
							s={12}
							validate
							type='text'
							required={!user}
							name='domicilio'
							label='Dirección'
							onChange={handleInput}
							value={state.domicilio}
							globalClasses={cx(style.inputBottom)}
						/>

						<TextInput
							s={12}
							validate
							type='text'
							required={!user}
							name='codigo_postal'
							label='Código Postal'
							onChange={handleInput}
							value={state.codigo_postal}
							globalClasses={cx(style.inputBottom)}
						/>

						<Select
							selectClassName={style.selectM}
							label='País'
							s={12}
							name='cod_pais'
							onChange={handleInput}
							value={state.cod_pais}
						>
						{
							paises.map((pais, index) => (<option key={index} value={pais.code}>{pais.label}</option>))
						}
						</Select>

						<TextInput
							s={12}
							name='provincia'
							value={state.provincia}
							globalClasses={style.inputBottom}
							type='text'
							onChange={handleInput}
							label='Provincia'
						/>

						<TextInput
							s={12}
							name='localidad'
							value={state.localidad}
							globalClasses={style.inputBottom}
							type='text'
							onChange={handleInput}
							label='Localidad'
						/>
					</div>
				</div>
				
				<div className="row">
					<div className={cx('col', 's12', 'l8', style.checkboxWrapper)} >
					{ (user) ? null :
						<Fragment>
							<div className="col s12">
								<Checkbox
									name='aceptoTerminos'
									onChange={handleInput}
									value={state.aceptoTerminos}
									filledIn
									id='checkbox-aceptoTerminos'
									label={
										<Fragment>
											Si, he leído y acepto las{' '}
											<a href="#">políticas de privacidad</a>{' '}
											y los <a href="#">términos de uso.</a>
										</Fragment>
									}
								/>
							</div>
							<div className="col s12">
								<Checkbox
									name='acepta_noticias'
									onChange={handleInput}
									value={state.acepta_noticias}
									filledIn
									id='checkbox-acepta_noticias'
									label='Suscribirse a nuestro newsletter'
								/>
							</div>
						</Fragment>
					}
					</div>
					<div className="col s12 l4">
					{ props.open &&
						<ReCAPTCHA
							ref={_recaptcha}
							className={style.recaptcha}
							size={(sidenav) ? 'compact' : 'normal'}
							sitekey={SITE_KEY_RECAPTCHA}
							onChange={onChangeRecaptcha}
						/>
					}
						<button
							disabled={disablebRegistro && !user}
							className={cx('btn', 'btn-primary', 'right', style.btnRegister)}
							onClick={handleSubmit}
						>
							{ (user) ? 'Actualizar' : 'REGISTRARME' }
						</button>
					</div>
				</div>
			</form>
		</div>
	)
}

Register.propTypes = {
	/*
	 * Determina si el Resgister está abierto cuando es Utilizado en el Header
	 * para renderizar el CAPTCHA, por defecto siempre será 'true' para  que se
	 * muestre el CAPTCHA
	*/
	open: PropTypes.bool,
}

const mapStateToProps = (store) => ({
	user: store.login.user,
});

const mapDispathToProps = (dispath) => ({
	verifySession: () => verifySession(dispath)
});

export default connect(mapStateToProps, mapDispathToProps)(Register);
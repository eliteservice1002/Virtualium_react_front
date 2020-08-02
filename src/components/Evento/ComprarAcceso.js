import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import slugify from 'slugify';

/* style */
import cx from 'classnames';
import style from './evento.css';

/* Components */
import Select from '../Select';
import Preloader from '../Preloader';
import TextInput from '../TextInput';

/* context */
import connect from '../../context/connect';

/* utils */
import toast from '../../utils/toast';
import httpClient from '../../utils/axios';
import serealizeData from './serealizeData';

/* Actions */
import { handleOpenLogin, verifySession } from '../../actions/loginAction';
import { setResumenDeCompra, setAccessCodeData } from '../../actions/eventoAction';

const initState = {
	acceso: '',
	funcion: '',
	cantidad: '1',
	codAccess: '',
	medioPago: '',
	entradaId: null,
};

const ComprarAcceso = ({
	user,
	evento,
	isLogin,
	verifySession,
	accessCodeData,
	handleOpenLogin,
	setAccessCodeData,
	setResumenDeCompra,
}) => {
	const history = useHistory();
	const location = useLocation();
	const _switchRef = useRef(null);
	const [ state, setState ] = useState(initState);
	const [ tipoAccess, setTipoAccess ] = useState([]);
	const [ medioPagos, setMedioPagos ] = useState([]);
	const [ codValido, setCodValido ] = useState(false);
	const [ irSalaVirtual, setIrSalaVirtual ] = useState(false);
	const [ entradasUsuario, setEntradasUsuario ] = useState([]);
	const [ codAccessActive, setCodAccessActive ] = useState(false);
	const [ procesandoCompra, setProcesandoCompra ] = useState(false);
	const [ procesandoValidacion, setProcesandoValidacion ] = useState(false);

	useEffect(() => {
		const getAccesos = httpClient.apiGet('tipo-accesos');
		const getMedioPagos = httpClient.apiGet('medio-pagos');
		Promise.all([
			getAccesos,
			getMedioPagos,
		]).then(responses => {
			const {
				0: resAccesos,
				1: resMedioPagos,
			} = responses;

			setTipoAccess(resAccesos.data);
			setMedioPagos(resMedioPagos.data);
		})
		.catch((err) => {
			console.log(err);
			setIsLoading(false);
		})
	}, [])

	useEffect(() => {
		if(accessCodeData.codValido) {
			setCodValido(true);
			setCodAccessActive(true);
			setState(accessCodeData.data);
			_switchRef.current.checked = true;
		}
	}, [accessCodeData])

	useEffect(() => {
		if(user) {
			httpClient.apiGet(`entradas/usuario/${evento.id}`)
			.then(({ data }) => {
				setEntradasUsuario(data);
			})
		}
	}, [user])

	useEffect(() => {
		const entrada = entradasUsuario.find((entrada) => {
			return entrada.funcion_id == state.funcion;
		})
		setIrSalaVirtual((entrada) ? true : false);
	}, [state.funcion])

	const disabledBtnComprar = () => {
		const {
			acceso,
			funcion,
			cantidad,
			medioPago
		} = state;

		// Validación de compra con código de acceso
		if(codAccessActive) {
				return !codValido;
		}

		// Validación de compra común
		return (
			!acceso ||
			!funcion ||
			!cantidad ||
			!medioPago
		)
	}

	const handleCompra = async () => {
		setProcesandoCompra(true);
		if(!isLogin) {
			setProcesandoCompra(false);
			toast({
				classes: 'black-text yellow',
				html: 'Debe iniciar sesión para poder continuar',
			})
			setTimeout(handleOpenLogin, 300);
			return;
		}

		if(codAccessActive) {

			// verificar que el usuario no activo el código anteriormente
			if(entradaYaActivada()) return;

			const formData = new FormData();
			formData.append('userId', user.id);
			formData.append('entradaId', state.entradaId);
			httpClient.apiPost(`entradas/activar`, formData)
			.then(({ data }) => {
				toast({
					classes:`black-text ${(data.cod == 200) ? 'green' : 'yellow'}`,
					html: data.message
				});

				if(data.cod == 200) {
					setCodValido(false);
					setCodAccessActive(false);
					setState((prevState) => ({
						...prevState,
						cantidad: '1',
						codAccess: '',
						medioPago: '',
						entradaId: null,
					}));
					_switchRef.current.checked = false;
				}
				setProcesandoCompra(false);
			})
			return;
		}

		const formData = serealizeData({ state, user });
		const { data } = await httpClient.apiPost('oc', formData);
		console.log(data);
		setProcesandoCompra(false);

		setResumenDeCompra({
			eventoNombre: evento.nombre,
			recintoNombre: evento.nombre_recinto,
		})
		history.push('/evento/compra-exitoso');
	}

	const entradaYaActivada = () => {
		// verificar que el usuario no activo el código anteriormente
			const entrada = entradasUsuario.find((entrada) => {
				return entrada.id == state.entradaId || entrada.codigo_acceso == state.codAccess;
			})

			if(entrada) {
				toast({
					classes:`black-text blue`,
					html: 'La entrada ya fue activada anteriormente'
				});
				setCodValido(false);
				setCodAccessActive(false);
				_switchRef.current.checked = false;
				setState((prevState) => ({...prevState, funcion: `${entrada.funcion_id}`}))
				return true;
			} else {
				return false;
			}
	}

	const handleInput = (e) => {
		const nameInput = e.target.name;
		let valueInput = e.target.type !== 'checkbox' ? e.target.value : 
					e.target.checked ? 1 : 0;

		switch(nameInput) {
			case 'cantidad':
				const { maxVentaEntrada } = evento;
				if(maxVentaEntrada && parseInt(valueInput) > maxVentaEntrada) {
					toast({
						classes:`black-text yellow`,
						html: 'superó el máximo de ventas por sesión',
					});
					valueInput = maxVentaEntrada;
				}
				valueInput = (valueInput < 1) ? 1 : valueInput;
				break;
		}

		setState((prevState) => {
			const newState = { ...prevState };
			newState[nameInput] = valueInput
			return newState;
		});
	};

	const handleSwitch = (e) => {
		setCodAccessActive(e.target.checked);
	}

	const handleValidateCod = () => {
			// verificar que el usuario no activo el código anteriormente
			if(entradaYaActivada()) return;

		setProcesandoValidacion(true);
		const formData = new FormData();
		formData.append('eventoId', evento.id);
		formData.append('codigo', state.codAccess);
		httpClient.apiPost('entradas/validar', formData)
		.then(({ data }) => {
			toast({
				classes:`black-text ${(data.cod == 200 || data.cod == 202) ? 'green' : 'yellow'}`,
				html: data.message
			});

			var newState;
			if(data.cod == 202 || data.cod == 200) {
				newState = {
					cantidad: '1',
					medioPago: '',
					entradaId: data.infoEntrada.id,
					acceso: data.infoEntrada.tipo_acceso_id,
					codAccess: data.infoEntrada.codigo_acceso,
					funcion: `${data.infoEntrada.funcion_id}`,
				}
			}

			if(data.cod == 202) {
				toast({
					html: data.warning,
					classes:`black-text blue`,
				})
				setAccessCodeData({
					data: newState,
					codValido: true,
				})
				setTimeout(() => {
					history.push(`/evento/${data.infoEntrada.Eventos.id}/${slugify(data.infoEntrada.Eventos.nombre)}`);
				}, 1000);
			} else if(data.cod == 200) {
				setState(newState);
			} else {
				setState(initState);
			}
			setCodValido(data.cod == 200);
			setProcesandoValidacion(false);
		})
	}

	const renderFunciones = () => {
		const options = evento.funciones.map((el) => (
			<option value={el.id} key={el.id} > {el.nombre} </option>
		))
		return(
			<Select
				s={12}
				name='funcion'
				label='FUNCIONES'
				value={state.funcion}
				onChange={handleInput}
				disabled={codAccessActive}
				selectClassName={style.select}
			>
				<option value='' disabled >elija una función</option>
				{options}
			</Select>
		)
	}

	return( (evento.funciones.length) ?
		<div className={style.CA} >
			<section className={style.secFunciones} >
				<div className={style.header} >
					<h2>Elije una función</h2>
				</div>
				{ renderFunciones() }
				{ (irSalaVirtual) &&
					<Link className={cx('btn', style.irSalaVirtual)} to='/visor'>Ir a la sala virtual</Link>
				}
			</section>

			<section className={style.header} >
			 	<h2>Compra tu acceso</h2>
			</section>

			<section className={style.form} >
				<div className={cx('switch', style.switch)} >
					<label>
						<span>comprar con código de acceso:</span>
						<input ref={_switchRef} onClick={handleSwitch} type="checkbox" />
						<span className="lever"></span>
					</label>
				</div>

				{ codAccessActive &&
					<Fragment>
						<TextInput
							s={12}
							type='text'
							name='codAccess'
							disabled={codValido}
							onChange={handleInput}
							value={state.codAccess}
							label='código de acceso'
						/>
						{ (procesandoValidacion) ?
							<div className={style.wrapperPreloader} >
								<Preloader active />
							</div>
							: (codValido) ? // else if
							<span
								onClick={() => setCodValido(false)}
								className={cx('btn', style.validar)}
							> cambiar código </span>
							: //else
							<span
								onClick={handleValidateCod}
								className={cx('btn', style.validar)}
							> Validar código </span>
						}
					</Fragment>
				}

				<Select
					selectClassName={style.select}
					s={12}
					name='acceso'
					label='ACCESO'
					value={state.acceso}
					onChange={handleInput}
					disabled={codAccessActive}
				>
					<option value='' disabled >elija un acceso</option>
					{
						tipoAccess.map((el) => (
							<option value={el.id} key={el.id} >{ el.descripcion }</option>
						))
					}
				</Select>

				<TextInput
					s={12}
					type='number'
					name='cantidad'
					label='CANTIDAD'
					onChange={handleInput}
					value={state.cantidad}
					disabled={codAccessActive}
				/>

				{ (!codAccessActive) &&
					<Select
						s={12}
						name='medioPago'
						label='MEDIOS DE PAGO'
						onChange={handleInput}
						value={state.medioPago}
						selectClassName={style.select}
					>
						<option value='' disabled >Elija un medio de pago</option>
						{
							medioPagos.map((el) => (
								<option value={el.label} key={el.id} >{ el.label }</option>
							))
						}
					</Select>
				}

				{ (procesandoCompra) ?
					<div className={style.wrapperPreloader} >
						<Preloader active />
					</div>
					:
					<button
						disabled={disabledBtnComprar()}
						onClick={handleCompra}
						className={cx(style.btnSalaVirtual, 'btn')}
					>
						{ (codAccessActive) ? 'ACTIVAR ACCESO' : 'comprar' }
					</button>
				}
			</section>
		</div>
		: // else => no hay funciones disponibles o el evento está marcado como proximamente
		<div className={style.proximamente} >
			<h4>próximamente</h4>
		</div>
	);
}

const mapStateToProps = (store) => ({
	user: store.login.user,
	isLogin: store.login.isLogin,
	accessCodeData: store.evento.accessCodeData,
});

const mapDispatchToProps = (dispatch, store) => ({
	verifySession: () => dispatch(verifySession(dispatch)),
	handleOpenLogin: () => dispatch(handleOpenLogin(store)),
	setAccessCodeData: (data) => dispatch(setAccessCodeData(data)),
	setResumenDeCompra: (data) => dispatch(setResumenDeCompra(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComprarAcceso);	
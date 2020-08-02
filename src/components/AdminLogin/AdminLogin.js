import React, { useState, useEffect } from 'react';

/* style */
import cx from 'classnames';
import style from './adminLogin.css';

/* Context */
import connect from '../../context/connect';

/* actions */
import { setUserAdmin } from '../../actions/loginAction';

/* components */
import Tab from '../Tab';
import Icon from '../Icon';
import Tabs from '../Tabs';
import TextInput from '../TextInput';
import Preloader from '../Preloader';

const AdminLogin = ({ isLoginLoading, setUserAdmin }) => {
	const [ stateLogin, setStateLogin ] = useState({ username: '', password: '' });
	const [ stateRegister, setStateRegister ] = useState({ username: '', password: '', name: '' });

	const handleForm = (e) => {
		e.preventDefault();
		if(e.target.name == 'login') {
			console.log('handleForm del login');
			// validar que los datos sean validos
			setUserAdmin(stateLogin);
		} else {
			console.log('handleForm del register');
		}
	}

	const handleInputLogin = (e) => {
		const target = e.target;
		setStateLogin((prevState) => ({
			...prevState,
			[target.name]: target.value
		}))
	}

	const handleInputRegister = (e) => {
		const target = e.target;
		setStateRegister((prevState) => ({
			...prevState,
			[target.name]: target.value
		}))
	}

	return(
		<div className={style.main} >
		<div className={style.content} >
			<Tabs className={cx('z-depth-1', style.tabs)} >
					<Tab title="Iniciar sesión" active className='tab'>
						<div className={cx('card', 'center', style.card)} >
							<div className="card-header">
								<Icon>lock_open</Icon>
								<h3>Iniciar sesión</h3>
							</div>
							<form name='login' onSubmit={handleForm}>
								<TextInput
									value={stateLogin.username} type='text'
									onChange={handleInputLogin} label='Usuario'
									icon='email' name='username' validate required
								/>
								<TextInput
									value={stateLogin.password} type='password'
									onChange={handleInputLogin} label='Contraseña'
									icon='lock' name='password' validate required
								/>
								{
									(isLoginLoading) ? <Preloader active /> :
										<input className='center btn' type='submit' value='Entrar'/>
								}
							</form>
						</div>
					</Tab>
					{/*<Tab title="Registrarse" active className='tab'>
						<div className={cx('card', 'center', style.card)} >
							<div className="card-header">
								<Icon>account_circle</Icon>
								<h3>Crear cuenta</h3>
							</div>
							<form name='register' onSubmit={handleForm}>
								<TextInput
									name='name' validate required
									value={stateRegister.name} type='text'
									onChange={handleInputRegister} label='Nombre'
								/>
								<TextInput
									value={stateRegister.username} type='username'
									icon='email' name='username' validate required
									onChange={handleInputRegister} label='Email'
								/>
								<TextInput
									icon='lock' name='password' validate required
									value={stateRegister.password} type='password'
									onChange={handleInputRegister} label='Password'
								/>
								{
									(isLoginLoading) ? <Preloader active /> :
										<input className='center btn' type='submit' value='enviar'/>
								}
							</form>
						</div>
					</Tab>*/}
				</Tabs>
		</div>
		</div>
	);
}

const mapStateToProps = (store) => ({
	// incorrectPassword: store.login.incorrectPassword,
	isLoginLoading: store.login.isLoginLoading
});

const mapDispatchToProps = (dispatch) => ({
	setUserAdmin: (param) => dispatch(setUserAdmin(param, dispatch)),
	// restartErrorsetUserAdmin: () => dispatch(restartErrorsetUserAdmin())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AdminLogin);
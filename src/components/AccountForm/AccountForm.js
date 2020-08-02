import React, { useState, useEffect } from 'react';

/* style */
import cx from 'classnames';
import style from './accountForm.css';

/* Context */
import connect from '../../context/connect';

/* actions */
import { setUser } from '../../actions/loginAction';

/* components */
import Tab from '../Tab';
import Icon from '../Icon';
import Tabs from '../Tabs';
import TextInput from '../TextInput';
import Preloader from '../Preloader';

const AccountForm = ({ isLoginLoading, setUser }) => {
	const [ stateLogin, setStateLogin ] = useState({email: '', password: ''});
	const [ stateRegister, setStateRegister ] = useState({email: '', password: '', name: ''});

	const handleForm = (e) => {
		e.preventDefault();
		if(e.target.name == 'login') {
			console.log('handleForm del login');
			// validar que los datos sean validos
			setUser(stateLogin);
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
		<div>
			<Tabs className={cx('z-depth-1', style.tabs)} >
				<Tab title="Iniciar sesión" active className='tab'>
					<div className={cx('card', 'center', style.card)} >
						<div className="card-header">
							<Icon>lock_open</Icon>
							<h3>Iniciar sesión</h3>
						</div>
						<form name='login' onSubmit={handleForm}>
							<TextInput
								value={stateLogin.email} type='email'
								onChange={handleInputLogin} label='Email'
								icon='email' name='email' validate required
							/>
							<TextInput
								value={stateLogin.password} type='password'
								onChange={handleInputLogin} label='Password'
								icon='lock' name='password' validate required
							/>
							{
								(isLoginLoading) ? <Preloader active /> :
									<input className='center btn' type='submit' value='Entrar'/>
							}
						</form>
					</div>
				</Tab>
				<Tab title="Registrarse" active className='tab'>
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
								value={stateRegister.email} type='email'
								icon='email' name='email' validate required
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
				</Tab>
			</Tabs>
		</div>
	);
}

const mapStateToProps = (store) => ({
	// incorrectPassword: store.login.incorrectPassword,
	isLoginLoading: store.login.isLoginLoading
});

const mapDispathToProps = (dispath) => ({
	setUser: (param) => dispath(setUser(param, dispath)),
	// restartErrorSetUser: () => dispath(restartErrorSetUser())
});

export default connect(
	mapStateToProps,
	mapDispathToProps
)(AccountForm);
import React, { useRef, useState, useEffect } from 'react';
import { useLocation, Redirect, useHistory, NavLink, Link } from 'react-router-dom';

/* style */
import cx from 'classnames';
import style from './header.css';

/* constants */
import { ROLES, DASHBOARD_URL_ROOT } from '../../config';

/* context */
import connect from '../../context/connect';

/* components */
import Icon from '../Icon';
import Login from '../Login/Login';
import Navbar from '../Navbar/Navbar';
import NavItem from '../Navbar/NavItem';
import Buscador from '../Buscador/Buscador';
import Register from '../Register/Register';
import RedesSociales from './RedesSociales/RedesSociales';

/* Actions */
import { logout, handleOpenLogin, handleOpenRegister } from '../../actions/loginAction';

const Header = ({
	user,
	evento,
	logout,
	mobileActive,
	handleOpenLogin,
	triggerOpenLogin,
	handleOpenRegister,
	triggerOpenRegister,
	...props
}) => {
	const _navbar = useRef({});
	const history = useHistory();
	const location = useLocation();
	const [ scrollActive, setScrollActive ] = useState(false);

	/* Estados de los contenedores de furmularios */
	const [ openLogin, setOpenLogin ] = useState(false);
	const [ openSidenav, setOpenSidenav ] = useState(false);
	const [ openRegister, setOpenRegister ] = useState(false);
	const [ openBuscador, setOpenBuscador ] = useState(false);

	useEffect(() => {
		if(user) {
			/*
			 * Asegurar el cierre de todos los formularios cuando
			 * el usuario inicia sesión correctamente
			*/
			handleActionForm(null, true);
		}
	}, [user])

	useEffect(() => {
		handleActionForm(null, null, true);
	}, [location])

	useEffect(() => {
		/*
		 * una vez abierto el [login ó register] cambiar el estado de
		 * [triggerOpenLogin ó triggerOpenLogin] nuevamente a cerrado (false)
		 * para asegurar que si se llama nuevamente permita abrir los formularios
		 * [login ó register] según corresponda
		*/
		if(triggerOpenLogin) {
			handleActionForm('login');
			handleOpenLogin();
		}
		if(triggerOpenRegister) {
			handleActionForm('register');
			handleOpenRegister();
		}
	}, [triggerOpenLogin, triggerOpenRegister]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleScroll = () => {
		setScrollActive(window.scrollY > 100);
		setOpenRegister(false)
		setOpenLogin(false);
		setOpenBuscador(false);
	}

	/**
	 * Controla las acciones que abren o cierran los contenedores del
	 * buscador, login y registro.
	 * @param {Event} $e Objeto del evento
	 * @param {Boolean} $forceClose fuerza el cerrar del contenedor abierto
	 * @param {String} $action acción que se desea realizar
	 * las acciones permitidas son:
	 * --------------------------------------------------------------------------
	 * - dasboard: redirige a un usuario logeado a su panel de administración
	 * - logout: cierra la sesión de un usuario logueado
	 * - [register, login, buscar]: cambia al estado opuesto (abierto o cerrado)
	 * --------------------------------------------------------------------------
	 * Post condición: nunca estarán abiertos ambos formularios al mismo tiempo
	 */
	const handleActionForm = (action, forceClose = false) => {
		if(forceClose) {
			setOpenRegister(false);
			setOpenLogin(false);
			setOpenBuscador(false);
			return;
		}

		/*
		 * Cambiar el estado del triggerOpenLogin cuando
		 * es abierto desde otro lugar diferente al <Header/>
		*/
		// if(triggerOpenLogin) handleOpenLogin();

		if(action == 'dashboard') return history.push("/dashboard");
		if(action == 'logout') return logout();
		setOpenRegister((prevState) => action === 'register' && !prevState)
		setOpenLogin((prevState) => action === 'login' && !prevState)
		setOpenBuscador((prevState) => action === 'buscar' && !prevState)
	}

	/*
	 * Construir la navegación correspondiente para el usuario actual
	*/
	var navigation = [];
	var sidenavNavigation = [];

	const navItemBuscador = {
		title: 'Buscador',
		iconImg: '/img/icons/icono-buscar.svg',
		action: () => handleActionForm('buscar'),
	}

	const navItemProfile = {
		title: 'Perfil',
		iconImg: '/img/icons/icono-perfil.svg',
		action: () => handleActionForm((user) ? 'register' : 'login', openRegister),
	}

	const navItemLogout = {
		title: 'Logout',
		icon: 'exit_to_app',
		action: () => handleActionForm('logout'),
	}

	const classnamesBotonDefault = cx(
		style.navItemBotonDefault,
		{ [`${style.scrollActive}`]: scrollActive },
		{ [`${style.mobileActive}`]: mobileActive }
	);

	const navItemDashboad = {
		title: 'Dashboard',
		className: classnamesBotonDefault,
		action: () => history.push(DASHBOARD_URL_ROOT),
	}

	const navItemVisor = {
		title: 'Ir a sala virtual',
		className: classnamesBotonDefault,
		action: () => history.push('/visor'),
	}

	const navItemTicketera = {
		title: 'Ticketera',
		iconImg: '/img/icons/icono-mis-compras.svg',
		action: () => {},
	}

	const contentFormsSidenav = {
		node: (
			<div className={style.contentFormsSidenav} >
				{mobileActive && renderRegister()}
				{mobileActive && renderBuscador()}
				{mobileActive && renderContentLogin()}
			</div>
		)
	}

	sidenavNavigation.push(
		{
			node: <RedesSociales />,
			className: style.sidenavRedesSociales,
		}
	);

	/*
	 * Si el usuario está logueado se Agrega los items correspondientes a su rol.
	 * En caso contrario se muestra la navegación por defecto
	 */
	if(user) {
		const ROL = ROLES.find((el) => user && el === user.rol);
		const navItemUser = {
			node: (
				<span>
					{user.nombres}
				</span>
			),
			className: cx(style.noPointer, style.username)
		};

		navigation.push(navItemBuscador);
		// navigation.push(navItemTicketera);

		// sidenavNavigation.push(navItemTicketera);

		if(ROL === ROLES[4]) {
			navigation.push(navItemVisor);
			navigation.push(navItemDashboad);
			sidenavNavigation.push(navItemVisor);
			sidenavNavigation.push(navItemDashboad);
		}

		navigation.push(navItemProfile);
		navigation.push(navItemLogout);
		navigation.push(navItemUser);
	} else {
		navigation = [
			navItemBuscador,
			navItemProfile,
		];
	}
	
	sidenavNavigation.push(
		navItemBuscador,
		navItemProfile,
		navItemLogout,
		contentFormsSidenav,
	);

	const menu = navigation.map(prepareNavigation);
	const sidenavMenu = sidenavNavigation.map(prepareNavigation);

	function prepareNavigation(el, key) {
		var label;
		const { url, title, action, iconImg, icon, node, className } = el;

		if(node) {
			return(
				<li key={key} className={className} >
					{node}
				</li>
			)
		}

		if(iconImg) {
			label =(
				<img
					alt={title}
					src={iconImg}
					className={cx(
						style.iconImg,
						{ [`${style.scrollActive}`]: scrollActive },
					)}
				/>
			)
		} else if(icon) {
			label = <Icon >{ icon }</Icon>;
		} else {
			label = title;
		}

		return(
			<NavItem
				key={key}
				title={title}
				onClick={action}
				className={cx(
					className,
					style.link,
					{ [`${style.scrollActive}`]: scrollActive })
				}
			>
				{ label }
			</NavItem>
		);
	}

	function renderBuscador() {
		return(
			<div className={cx(
				style.buscadorContent,
				{ [`${style.open}`]: openBuscador },
				{ [`${style.mobileActive}`]: mobileActive },
				'z-depth-3'
			)}>
				<Buscador open={openBuscador} />
			</div>
		)
	}

	function renderContentLogin() {
		return(
			<div
				className={cx(
					style.tuTicketeraContent,
					{ [`${style.open}`]: openLogin },
					{ [`${style.mobileActive}`]: mobileActive },
					'z-depth-3'
				)}
			>
				<Login
					open={openLogin}
					handleCreateAccount={handleActionForm}
					recaptchaSize={(mobileActive) ? 'compact' : 'normal'}
				/>
			</div>
		)
	}

	function renderRegister() {
		return(
			<Register
				open={openRegister}
				sidenav={mobileActive}
				handleToggleAccount={handleActionForm}
				className={cx({'scale-1': openRegister})}
			/>
		)
	}

	return(
		<div
			className={cx(
				style.contentFixed,
				{ [`${style.scrollActive}`]: scrollActive },
				{ [`${style.home}`]: location.pathname === '/' }
			)}
		>
			<header
				ref={_navbar}
				className={cx(
					style.navbar,
					{ [`${style.scrollActive}`]: scrollActive },
				)}
			>
				<section className={style.contentLogo} >
					<Link to='/'>
						<img
							src={`/img/virtualium.png`}
							alt="Logo oficial VIRTUALIUM"
							className={cx({ [`${style.scrollActive}`]: scrollActive }, style.logo)}
						/>
					</Link>
				</section>

				<section className={style.contentRedesSociales} >
					{ !mobileActive && <RedesSociales scrollActive={scrollActive} /> }
				</section>

				<section>
					<Navbar sidenav={sidenavMenu} >
						{menu}
					</Navbar>
					{!mobileActive && renderBuscador()}
					{!mobileActive && renderRegister()}
					{!mobileActive && renderContentLogin()}
				</section>
			</header>
		</div>
	);
}

const mapStateToProps = (store) => ({
	evento: store.evento,
	user: store.login.user,
	triggerOpenLogin: store.login.triggerOpenLogin,
	triggerOpenRegister: store.login.triggerOpenRegister,
});

const mapDispathToProps = (dispath, store) => ({
	logout: () => dispath(logout()),
	handleOpenLogin: () => dispath(handleOpenLogin(store)),
	handleOpenRegister: () => dispath(handleOpenRegister(store)),
});

export default connect(mapStateToProps, mapDispathToProps)(Header);
import React from 'react';
import { NavLink, Link } from 'react-router-dom';

/* Style */
import cx from 'classnames';
import style from './footer.css';

/* context */
import connect from '../../context/connect';

/* constants */
import { ROLES, DASHBOARD_URL_ROOT } from '../../config';

/* Actions */
import { handleOpenLogin, handleOpenRegister } from '../../actions/loginAction';


const Footer = ({ handleOpenLogin, handleOpenRegister, user }) => {
	return(
		<section className={style.mainContent}>
			<footer className={style.footer} >
				<div className={style.contentLogo} >
					<Link to='/'>
						<img src="/img/logo-virtualium-footer.png" alt=""/>
					</Link>
				</div>

				<div className={style.contentLinks} >
					<Link to='/ayuda' >Centro de ayuda</Link>
					<Link to='/cuenta' >Cuenta</Link>
					<Link to='/prensa' >Prensa</Link>
					<Link to='/terminos-condiciones' >Términos de uso</Link>
					<Link to='/politicas-privacidad' >Privacidad</Link>
				</div>

				<div className={style.contentLinks} >
					<Link to='/puntos-de-venta' >Información corporativa</Link>
					<Link to='/beneficios' >Contáctanos</Link>
					<Link to='/productores' >Prueba de velocidad</Link>
					<Link to='/terminos-condiciones' >Avisos legales</Link>
				</div>


				{ (user && user.rol == ROLES[4]) ?
					<div className={style.botonera} >
						<span onClick={handleOpenRegister} className={cx('btn', style.btnDemo)} >Mi perfil</span>
						<Link to='/dashboard' className={cx('btn', style.btnDemo)} >Dashboard</Link>
						<Link to='/visor' className={cx('btn', style.btnDemo)} >Ir a sala virtual</Link>
					</div>
					:
					<div className={style.botonera} >
						<span
							className={cx('btn', style.btnDemo)}
							onClick={() => (user) ? handleOpenRegister() : handleOpenLogin()}
						>
						{(user) ? 'Mi perfil' : 'Login'}
						</span>
					</div>
				}
			</footer>
		</section>
	)
}


const mapStateToProps = (store) => ({
	user: store.login.user,
});

const mapDispathToProps = (dispath, store) => ({
	handleOpenLogin: () => dispath(handleOpenLogin(store)),
	handleOpenRegister: () => dispath(handleOpenRegister(store)),
});

export default connect(mapStateToProps, mapDispathToProps)(Footer);

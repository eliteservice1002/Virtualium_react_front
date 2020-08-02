import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Redirect, Switch, Route, Link } from 'react-router-dom';

/* style */
import style from './dashboard.css';
const clasessGlobales = {
	panelContent: style.panelContent
}

/* constants */
import MENU_SIDEBAR from './menuSidebar.js';
import { ROLES, DASHBOARD_INDEX, DASHBOARD_URL_ROOT } from '../../config';

/* context */
import connect from '../../context/connect';

/* Components */
import Overview from './Overview';
import Preloader  from '../Preloader';
import PrivateRoute from '../PrivateRoute';
import Navigation from './Navigation/Navigation';

/* Routes */
import dashboardRoutes from '../../routes/dashboardRoutes';

const Dashboard = ({ user, isLogin }) => {

	useEffect(() => {
		document.body.style.background = '#e1e8ef';
		return () => {
			document.body.style.background = '';
		}
	}, [])

	/**
	 * [menu description]
	 * Items para ser renderizados en el sidebar del dashboard
	 * van a depender de el rol del usuario logueado actualmente
	 * @type {Array}
	 */
	// FALTA IMPLEMENTAR LA LÓGICA DEL LADO DEL SERVIDOR PARA QUE DEVULVAS LOS ROLES
	const menu = MENU_SIDEBAR;

	const _privateRoutes = dashboardRoutes.map((route, index) => {
		let {
			path,
			name,
			exact,
			Component,
		} = route;

		return (Component) ? (
			<PrivateRoute
				key={index}
				path={path}
				name={name}
				exact={exact}
				isLogin={isLogin}
				component={Component}
				propsComponent={{
					layaout: clasessGlobales
				}}
			/>
		) : (null);
	});

	const loading = (
		<div className={style.loading}>
			<Preloader
				active
				size="big"
				color="blue"
			/>
		</div>
	);

	return(
		<div className={style.mainContent} >
			<Navigation className={style.sidenavContent} navContent={menu} />

			<Suspense fallback={loading} >
				<section className={style.panelContent} >
					<Switch>
						{_privateRoutes}
						<Route path="*">
							<Overview />
						</Route>
					</Switch>
				</section>
			</Suspense>
		</div>
	);
}

const mapStateToProps = (store) => ({
	user: store.login.user,
	isLogin: store.login.isLogin
});

export default connect(mapStateToProps)(Dashboard);
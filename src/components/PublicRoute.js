import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({component: Component, propsComponent, restricted, isLogin, redirectTo, ...rest}) => {
	return (
		// Will not show the component when the user is logged in and 'restricted' is true
		// Otherwise, show the component
		<Route {...rest} render={props => (
			isLogin && restricted ?
				<Redirect to={((redirectTo) ? redirectTo : '/')} />
			: <Component {...props} {...propsComponent} />
		)} />
	);
};

PublicRoute.propTypes = {
	/**
	 * componente para ser envuelto y renderizado por <Route/>
	 */
	component: PropTypes.oneOfType([PropTypes.node, PropTypes.object]).isRequired,
	/**
	 * Propiedades adicionales que quiera ser pasadas al componente
	 */
	propsComponent: PropTypes.object,
	/**
	 * Verifica si el usuario está o no logueado
	 */
	isLogin: PropTypes.bool,
	/**
	 * Si es true el componente no será renderisado si el usuario está logueado
	 */
	restricted: PropTypes.bool,
	/**
	 * Url a la que debe ser redirigido el componente si 'restricted' es true
	 */
	redirectTo: PropTypes.string,
}

export default PublicRoute;
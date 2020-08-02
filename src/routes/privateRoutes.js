import React, { lazy } from 'react';

/* conponents */
const Logs = lazy(() => import(/* webpackChunkName: 'Logs' */ '../views/Logs/Logs'));
const Visor = lazy(() => import(/* webpackChunkName: 'Visor' */ '../components/Visor/Visor'));
const Dashboard = lazy(() => import(/* webpackChunkName: 'Dashboard' */ '../components/Dashboard/Dashboard'));
const ModerationPage = lazy(() => import(/* webpackChunkName: 'Evento' */ '../components/ModerationPage/ModerationPage'));
const CompraExitosa = lazy(() => import(/* webpackChunkName: 'Evento' */ '../components/Evento/CompraExitosa/CompraExitosa'));

 /**
  * [privateRoutes description]
  * Routes para ser renderizados con <PrivateRoute/> lo que evita que los componentes
 	* sean renderizados sin que el cliente esté previamente logueado.
 	* Si es necesario un nivel más de restricción para el renderizado de los componentes
 	* privados es requerido utilizar la clave 'isAuthorized' marcado como true lo cual requerirá
 	* que el usuario se loguee con una cuenta administrador el cual le concederá los permisos
 	* necesarios en virtud del rol que tenga asignado en el sistema (backend CakePHP)
 	* EJEMPLO: 
 	* {
 	* 	path: '/',
 	* 	Component: MyComponent,
 	* 	isAuthorized: true
 	* }
 	* si la clave 'isAuthorized' no está presente no será tomada en cuenta
  * @type {Array}
  */
const privateRoutes = [
	{
		exact: false,
		name: 'Dashboard',
		path: '/dashboard*',
		Component: Dashboard,
		isAuthorized: true
	},
	{
		exact: true,
		name: 'logs',
		path: '/logs',
		Component: Logs,
	},
	{
		exact: true,
		name: 'Pago exitoso',
		path: '/evento/compra-exitoso',
		Component: CompraExitosa,
	},
	{
		exact: true,
		name: 'Visor',
		path: '/visor',
		Component: Visor
	},
	{
		exact: true,
		name: 'ModerationPage',
		path: '/selfies/moderate',
		Component: ModerationPage
	}
];

export default privateRoutes;
/**
 * Todos los componentes de este fichero serán renderizados
 * dentro del Dashboard. El acceso estará restringido
 * Dependiendo del rol del usuario logueado.
 */
import React from 'react';

/* constants */
import { DASHBOARD_URL_ROOT, DASHBOARD_INDEX } from '../config';

/* components */
const Overview = React.lazy(() => {
	return import(/* webpackChunkName: 'Overview' */ '../components/Dashboard/Overview')
});
const AddEvent = React.lazy(() => {
	return import(/* webpackChunkName: 'AddEvent' */ '../components/Dashboard/ManageEvents/AddEvent')
});

export default [
	{
		exact: true,
		name: 'overview',
		path: DASHBOARD_URL_ROOT + DASHBOARD_INDEX,
		Component: Overview,
	},
	{
		exact: true,
		name: 'Agregar un evento',
		path: DASHBOARD_URL_ROOT + 'eventos/agregar',
		Component: AddEvent
	}
]
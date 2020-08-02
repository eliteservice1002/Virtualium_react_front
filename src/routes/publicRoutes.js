import React, { lazy } from 'react';


const Portal = lazy(() => import(/* webpackChunkName: 'Portal' */ '../components/Portal/Portal'));
const Evento = lazy(() => import(/* webpackChunkName: 'Evento' */ '../components/Evento/Evento'));
const Messages = lazy(() => import(/* webpackChunkName: 'Messages' */ '../views/Messages/Messages'));
const ConfirmEmail = lazy(() => import(/* webpackChunkName: 'ConfirmEmail' */ '../components/ConfirmEmail'));
const AdminLogin = lazy(()=>import(/* webpackChunkName: 'AdminLogin' */ '../components/AdminLogin/AdminLogin'));
const MosaicVideo = lazy(() => import(/* webpackChunkName: 'MosaicVideo' */ '../components/MosaicVideo/MosaicVideo'));
const MosaicImages = lazy(() => import(/* webpackChunkName: 'MosaicImages' */ '../components/MosaicImages/MosaicImages'));
const ModerationPage = lazy(()=>import(/* webpackChunkName: 'ModerationPage' */ '../components/ModerationPage/ModerationPage'));

const PublicRoutes = [
	{
		path: '/',
		exact: true,
		name: 'Portal',
		Component: Portal,
		restricted: false,
	},
	{
		path: '/evento/:id/:slug',
		exact: true,
		name: 'Evento',
		restricted: false,
		Component: Evento
	},
	{
		path: '/confirmarcion/:hash',
		exact: true,
		name: 'ConfirmEmail',
		restricted: false,
		Component: ConfirmEmail
	},
	{
		exact: true,
		name: 'Messages',
		path: '/messages',
		Component: Messages,
	},
	{
		exact: true,
		name: 'Selfies',
		path: '/selfies',
		Component: MosaicImages,
	},
	{
		exact: true,
		name: 'MosaicVideo',
		path: '/videos',
		Component: MosaicVideo,
	},
	{
		exact: true,
		restricted: true,
		name: 'admin login',
		path: '/admin-login',
		Component: AdminLogin,
		redirectTo: '/dashboard'
	},
];

export default PublicRoutes;

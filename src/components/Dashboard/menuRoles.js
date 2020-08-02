/* constants */
import { DASHBOARD_URL_ROOT, DASHBOARD_INDEX, ROLES } from '../../config';

export default {
	// PRODUCTOR
	[ROLES[0]]: [
		{
			id: 'vision-general',
			title: 'visión general',
			type: 'item',
			url: DASHBOARD_URL_ROOT + DASHBOARD_INDEX,
		}
	],
	// ESPECTADOR
	[ROLES[1]]: [
		{
			id: 'vision-general',
			title: 'visión general',
			type: 'item',
			url: DASHBOARD_URL_ROOT + DASHBOARD_INDEX,
		}
	],
	// REPORTADOR
	[ROLES[2]]: [
		{
			id: 'vision-general',
			title: 'visión general',
			type: 'item',
			url: DASHBOARD_URL_ROOT + DASHBOARD_INDEX,
		}
	],
	// CONFIGURADOR
	[ROLES[3]]: [
		{
			id: 'vision-general',
			title: 'visión general',
			type: 'item',
			url: DASHBOARD_URL_ROOT + DASHBOARD_INDEX,
		}
	],
	// ADMINISTRADOR
	[ROLES[4]]: [
		{
			id: 'enlaces-generales',
			title: 'Enlaces generales',
			type: 'group',
			children: [
				{
					id: 'vision-general',
					title: 'visión general',
					type: 'item',
					url: DASHBOARD_URL_ROOT + DASHBOARD_INDEX,
				},
				{
					id: 'messages',
					title: 'messages',
					type: 'item',
					url: '/messages',
				},
				{
					id: 'logs',
					title: 'logs',
					type: 'item',
					url: '/logs',
				},
				{
					id: 'selfies',
					title: 'selfies',
					type: 'item',
					url: '/selfies',
				},
				{
					id: 'videos',
					title: 'videos',
					type: 'item',
					url: '/videos',
				}
			]
		},
		{
			id: 'gestor-eventos',
			title: 'eventos',
			type: 'group',
			children: [
				{
					id: 'ver-eventos',
					title: 'Ver todos',
					type: 'item',
					url: DASHBOARD_URL_ROOT + 'eventos',
				},
				{
					id: 'agregar-evento',
					title: 'Agregar',
					type: 'item',
					url: DASHBOARD_URL_ROOT + 'eventos/agregar',
				}
			]
		},
		{
			id: 'gestor-medios-de-pago',
			title: 'Medios de pago',
			type: 'group',
			children: [
				{
					id: 'ver-medios-de-pago',
					title: 'Ver todos',
					type: 'item',
					url: DASHBOARD_URL_ROOT + 'medios-de-pago',
				},
				{
					id: 'agregar-medio-de-pago',
					title: 'Agregar',
					type: 'item',
					url: DASHBOARD_URL_ROOT + 'medios-de-pago/agregar',
				}
			]
		}
	],
	// TECNICO MULTICANAL
	[ROLES[5]]: [
		{
			id: 'vision-general',
			title: 'visión general',
			type: 'item',
			url: DASHBOARD_URL_ROOT + DASHBOARD_INDEX,
		}
	]
}
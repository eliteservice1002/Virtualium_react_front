import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
const Categorias = () => {
	const categorias = [
		{
			title: 'Música',
			url: '/categoria/musica'
		},
		{
			title: 'Teatro',
			url: '/categoria/teatro'
		},
		{
			title: 'Cine',
			url: '/categoria/cine'
		},
		{
			title: 'Familia',
			url: '/categoria/familia'
		},
		{
			title: 'Especiales',
			url: '/categoria/especiales'
		}
	];

	return(
		categorias.map((cat, index) => (
			<li key={index}>
				<NavLink to={cat.url} >
					{cat.title}
				</NavLink>
			</li>
		))
	)
}

export default Categorias;
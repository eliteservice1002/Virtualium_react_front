import React from 'react';
import slugify from 'slugify';
import { Link } from 'react-router-dom';

/* Style */
import cx from 'classnames';
import style from './carousel.css';

/* config */
import { ASSETS_URL } from '../../config.js';

const ImageLeftTextRight = ({ item }) => {
	return(
		<div className={style.imageLeftTextRight} >
			<div className={style.itemImagen} >
				<img src={ASSETS_URL+item.imagenUrl} alt=""/>
			</div>
			<div className={style.itemContent} >
				<span className={style.fecha} >{ item.tituloFecha }</span>
				<section className={style.infoBanda}>
					<span className={style.titulo} >{ item.tituloEvento }</span>
					<span className={style.subtitulo} >{ item.nombreRecinto }</span>
				</section>

				<Link
					className={cx('btn', style.btn)}
					to={`/evento/${item.eventoId}/${slugify(item.tituloEvento)}`}
				>
					COMPRAR
				</Link>
			</div>
		</div>
	)
}

export default ImageLeftTextRight;
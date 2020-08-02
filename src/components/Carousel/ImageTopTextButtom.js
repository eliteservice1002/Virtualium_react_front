import React, { Fragment } from 'react';
import slugify from 'slugify';
import { Link } from 'react-router-dom';

/* Style */
import cx from 'classnames';
import style from './carousel.css';

/* config */
import { ASSETS_URL } from '../../config.js';

const ImageTopTextButtom = ({ item }) => {
	return(
		<Fragment>
			<div className={style.imageTopTextButtom} >
				<div className={style.itemImagen} >
					<img src={ASSETS_URL+item.imagenUrl} alt=""/>
				</div>
				<div className={style.itemContent} >
					{/*<span className={style.fecha} >{ item.tituloFecha }</span>*/}
					<section className={style.infoBanda} >
						<span className={style.titulo} >{ item.tituloEvento }</span>
						<span className={style.subtitulo} >{ item.nombreRecinto }</span>
					</section>

					<Link
						className={cx('btn', style.btn)}
						to={`/evento/${item.eventoId}/${slugify(item.tituloEvento)}`}
					>
						+ info
					</Link>
				</div>
			</div>
			<div className={style.fill} ></div>
		</Fragment>
	)
}

export default ImageTopTextButtom;
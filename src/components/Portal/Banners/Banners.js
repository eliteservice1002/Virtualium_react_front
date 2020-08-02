import React from 'react';
import slugify from 'slugify';
import { useHistory } from 'react-router-dom';

/* Components */
import Slide from '../../Slider/Slide';
import Slider from '../../Slider/Slider';
import Caption from '../../Slider/Caption';

/* config */
import { ASSETS_URL } from '../../../config.js';

/* Style */
import cx from 'classnames';
import style from './banners.css';

function Banners({ bannersData }) {

	const history = useHistory();

	const handleClick = (e, to) => {
		e.preventDefault();
		history.push(`/evento/${to.id}/${to.slug}`);
	}

	return( (!bannersData.length) ? null :
		<div className={cx('wrapper-banners', style.mainContent)} >
			<Slider
				className={cx('banners', style.slider)}
				fullscreen
				arrows
				options={{
					duration: 500,
					interval: 6000,
					indicators: bannersData.length > 1
				}}
			>
			{
				bannersData.map((banner) => {
					return(
						<Slide
							key={banner.clave}
							image={<img src={ASSETS_URL+banner.imagenUrl} alt=""/>}
						>
							<Caption className={style.caption} placement="left">
								<span className={style.date} > {banner.tituloFecha} </span>
								<h2 className={style.title} > {banner.tituloEvento} </h2>
								<h3 className={style.location} > {banner.nombreRecinto} </h3>
								<button
									onClick={(e) => handleClick(e, {
										id: banner.eventoId,
										slug: slugify(banner.tituloEvento)
									})}
									className={cx('waves-effect', 'waves-light', 'btn', style.btn)}
								>Comprar</button>
							</Caption>
						</Slide>
					)
				})
			}
			</Slider>
		</div>
	)
}

export default Banners;
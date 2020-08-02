import React, {
	lazy,
	Suspense,
	useEffect,
	useState,
	useRef,
	Fragment
} from 'react';
import { useParams, useHistory, useLocation, Link } from 'react-router-dom';

/* Components */
import Loading from '../Loading/Loading';
import ComprarAcceso from './ComprarAcceso';

/* Style */
import cx from 'classnames';
import style from './evento.css';

/* config | constants */
import { ASSETS_URL } from '../../config.js';

/* Actions */
import { setEvento, resetEvento, resetAccessCodeData } from '../../actions/eventoAction';

/* connect */
import connect from '../../context/connect';

const Evento = ({ evento, isFetching, resetEvento, setEvento, resetAccessCodeData }) => {
	const params = useParams();
	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
		if(!isFetching) {
			setEvento({...params, history});
		}
		return () => {
			resetEvento();
		}
	}, [location])

	useEffect(() => {
		return () => {
			resetAccessCodeData();
		}
	}, [])

	let descripcionEvento = [];
	if(evento.descripcion) {
		descripcionEvento = JSON.parse(evento.descripcion);
	}

	return( (evento.isEmpty) ? <Loading/> :
		<div className={style.mainContent} >
			<section>
				<img src={ASSETS_URL+evento.imagenPrincipal} alt=""/>
			</section>
			<section className={style.infoBanda} >
				{
					<h3 className={style.titulo} >{ evento.nombre }</h3>
				}
				{
					descripcionEvento.map((text, key) => {
						return(
							<p key={key} >{text}</p>
						)
					})
				}

				{/*<div className={style.botonera} >
					<div>
						<Link target='_blank' to='/selfies' className={cx('btn')} >Fotos</Link>
						<Link target='_blank' to='/videos' className={cx('btn')} >videos</Link>
						<Link target='_blank' to='/messages' className={cx('btn')} >sonido</Link>
						<Link target='_blank' to='/messages' className={cx('btn')} >mensajes</Link>
					</div>
					<div>
						<Link target='_blank' to='/visor' className={cx('btn', 'orange', 'darken-2')} >Ir a sala virtual</Link>
					</div>
				</div>*/}
			</section>
			<section>
				<ComprarAcceso evento={evento} />
			</section>
		</div>
	);
}

const mapStateToProps = (store) => ({
	evento: store.evento,
	isFetching: store.evento.isFetching,
});

const mapDispatchToProps = (dispatch) => ({
	resetEvento: () => dispatch(resetEvento()),
	resetAccessCodeData: () => dispatch(resetAccessCodeData()),
	setEvento: (param) => dispatch(setEvento(param, dispatch)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Evento);
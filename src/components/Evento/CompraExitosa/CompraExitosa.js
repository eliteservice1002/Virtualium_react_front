import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

/* style */
import cx from 'classnames';
import style from './compraExitosa.css';

/* context */
import connect from '../../../context/connect';

/* Actions */
import { resetResumenCompra } from '../../../actions/eventoAction';

const CompraExitosa = ({ volverAlEvento, resumenDeCompra, resetResumenCompra }) => {
	useEffect(() => {
		return () => resetResumenCompra();
	}, [])

	return(
		<div className={style.maincontent} >
			<div className={style.infoBanda} >
				<p>CONFIRMACIÓN DE COMPRA</p>
				<p className={style.nombreBanda} >{ resumenDeCompra.eventoNombre }</p>
				<p className={style.nombreRecinto} >{ resumenDeCompra.recintoNombre }</p>
			</div>
			<div className={style.content} >
				<h3>transacción exitosa</h3>
				<img src="/img/check-virtualium.png" alt=""/>
				<p className={style.felicitaciones} >¡FELICITACIONES, YA TENES TU ACCESO!</p>
				<p className={style.aviso}>Revisa tu mail, asegurate que no esté en la bandeja de Spam.</p>

				<Link to='/visor' className={cx('btn', style.irSalaVirtual)}>Ir a la sala virtual</Link>
			</div>
		</div>
	)
}

const mapStateToProps = (store) => ({
	resumenDeCompra: store.evento.resumenDeCompra,
});

const mapDispathToProps = (dispatch) => ({
	resetResumenCompra: () => dispatch(resetResumenCompra()),
});

export default connect(mapStateToProps, mapDispathToProps)(CompraExitosa);
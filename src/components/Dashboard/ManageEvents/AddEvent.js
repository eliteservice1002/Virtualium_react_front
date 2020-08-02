import React, { useRef, useState, useEffect, Fragment } from 'react';

/* style */
import cx from 'classnames';
import style from './manageEvents.css';

/*components */
import Select from '../../Select';
import Textarea from '../../Textarea';
import Checkbox from '../../Checkbox';
import TextInput from '../../TextInput';
import DatePicker from '../../DatePicker';
import TimePicker from '../../TimePicker';

/* constantes */
import { CATEGORIAS_EVENTO } from '../../../config';

const initialState = {
	nombre: '',
	estado: 1,
	cargoTTDE: '',
	valorNeto: '',
	categoria: '',
	descripcion: '',
	programable: 0,
	restricciones: '',
	imagen_evento: '',
	nombre_recinto: '',
}

const AddEvent = ({ layaout }) => {
	const _form = useRef(null);
	const [ state, setState ] = useState(initialState);

	useEffect(() => {
		console.log(state)
		return () => {}
	})

	const handleInput = (e) => {
		const nameInput = e.target.name;
		let valueInput = e.target.type !== 'checkbox' ? e.target.value : 
					e.target.checked ? 1 : 0;

		setState((prevState) => {
			const newState = { ...prevState };
			newState[nameInput] = valueInput
			return newState;
		});
	};

	const handleSubmit = () => {
		console.log('handleSubmit');
	}

	return(
		<div className={cx(style.addEvent, layaout.panelContent)} >
			<h3>Crear un nuevo evento</h3>
			<form ref={_form} onSubmit={handleSubmit} >
				<section className={cx(style.gridC2, style.grid, style.gridInputs)} >
					<TextInput
						s={12}
						validate
						required
						inputSolid
						type='text'
						name='nombre'
						value={state.nombre}
						onChange={handleInput}
						inputClassName={style.inputs}
						globalClasses={cx(style.wrapperInputs)}
						label={
							<span>Nombre del evento <span className="red-text">*</span></span>
							}
					/>

					<TextInput
						s={12}
						validate
						required
						inputSolid
						type='text'
						name='descripcion'
						onChange={handleInput}
						value={state.descripcion}
						inputClassName={style.inputs}
						globalClasses={cx(style.wrapperInputs)}
						label={
							<span>Descripción del evento <span className="red-text">*</span></span>
							}
					/>

					<TextInput
						s={12}
						validate
						required
						inputSolid
						type='text'
						name='nombre_recinto'
						value={state.nombre_recinto}
						inputClassName={style.inputs}
						onChange={handleInput}
						globalClasses={cx(style.wrapperInputs)}
						label={
							<span>Nombre del recinto <span className="red-text">*</span></span>
							}
					/>

					<Select
							s={12}
							inputSolid
							name='categoria'
							onChange={handleInput}
							value={state.categoria}
							selectClassName={style.selectM}
						>
							<option disabled value="" >
								Categoría del evento
							</option>
							{
								CATEGORIAS_EVENTO.map((el, key) => {
									return <option key={key} value={key} >{el}</option>;
								})
							}
						</Select>

						<TextInput
							s={12}
							inputSolid
							type='number'
							name='valorNeto'
							label='Valor neto: (0.00)'
							onChange={handleInput}
							value={state.valorNeto}
							inputClassName={style.inputs}
							globalClasses={cx(style.wrapperInputs)}
						/>

						<TextInput
							s={12}
							inputSolid
							type='number'
							name='cargoTTDE'
							label='Cargo VIRTUALIUM: (0.00)'
							onChange={handleInput}
							value={state.cargoTTDE}
							inputClassName={style.inputs}
							globalClasses={cx(style.wrapperInputs)}
						/>

						<TextInput
							s={12}
							validate
							required
							inputSolid
							type='file'
							name='imagen_evento'
							value={state.imagen_evento}
							inputClassName={style.inputs}
							onChange={handleInput}
							globalClasses={cx(style.wrapperInputs)}
							label={
								<span>Imagen del evento <span className="red-text">*</span></span>
								}
						/>

					<Textarea
						id="Textarea-12"
						s={12}
						inputSolid
						name='restricciones'
						onChange={handleInput}
						value={state.restricciones}
						label='Restricciones del evento'
					/>

					<Checkbox
						filledIn
						name='estado'
						value={state.estado}
						id='checkbox-estado'
						onChange={handleInput}
						label='Evento activo'
					/>

					<Checkbox
						filledIn
						name='programable'
						onChange={handleInput}
						value={state.programable}
						id='checkbox-programable'
						label='Evento programable'
					/>
					
					{ (!state.programable) ? null :
						<Fragment>
							<DatePicker
								inputSolid
								options={{
									format: 'yy-mm-dd'
								}}
								onClose={() => {
									console.log('close')
								}}
								s={12}
								label='Fecha de activación'
							/>

							<TimePicker
								inputSolid
								label='Hola de activación'
							/>
						</Fragment>
					}
				</section>
			</form>

			<section className={style.botonera} >
				<h4>Más opciones para el evento</h4>
				<span className='btn' >
					Agregar funciones
				</span>

				<span className='btn' >
					Agregar artistas
				</span>

				<span className='btn' >
					Agregar medios de pago
				</span>

				<span className='btn' >
					Agregar publicidad
				</span>

				<span className='btn' >
					Agregar banners en el portal web
				</span>
			</section>
		</div>
	);
}
export default AddEvent;
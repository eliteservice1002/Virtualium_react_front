import React, {
	useState,
	useEffect
} from 'react';
import slugify from 'slugify';
import { useHistory } from 'react-router-dom';

/* utils */
import httpClient from '../../utils/axios';

/* Components */
import TextInput from '../TextInput';

/* Style */
import style from './buscador.css';

const Buscador = ({ open }) => {
	const history = useHistory();
	const [ eventos, setEventos ] = useState([]);
	const [ busqueda, setBusqueda ] = useState('');
	const [ eventosFiltrados, setEventosFiltrados ] = useState([]);

	useEffect(() => {
		httpClient.apiGet('eventos')
		.then(({ data }) => {
			setEventos(data);
			setEventosFiltrados(data);
		})
	}, [open])

	useEffect(() => {
		setEventosFiltrados((prevState) => {
			return eventos.filter((evento) => {
				let regexp = new RegExp(busqueda, 'gi');
				return evento.nombre.match(regexp);
			})
		})
	}, [busqueda])

	const handleField = (e) => {
		setBusqueda(e.target.value);
	}

	const handleClick = (e, to) => {
		e.preventDefault();
		history.push(`/evento/${to.id}/${to.slug}`);
	}
	
	return(
		<div className={style.contentBuscador} >
			<TextInput
				s={12}
				value={busqueda}
				type='text'
				onChange={handleField}
				label='Buscar por artista y evento'
			/>
			<section className={style.resultCollection} >
			{
				(eventosFiltrados.length) ? 
				eventosFiltrados.map((evento) => {
					return(
						<span
							key={evento.id}
							className={style.collectionItem}
							onClick={(e) => handleClick(e, {
								id: evento.id,
								slug: slugify(evento.nombre)
							})}
						>
							{evento.nombre}
						</span>
					)
				})
				:
				<p>No se encontró resultado</p>
			}
			</section>
		</div>
	)
}

export default Buscador;
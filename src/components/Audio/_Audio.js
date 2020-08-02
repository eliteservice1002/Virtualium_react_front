import React, { useRef, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

/* style */
import style from './audio.css';

import httpClient from '../../utils/axios';

/* config */
import { API_PY } from '../../config.js';

const Audio = ({ type }) => {
	const audioRef = useRef();
	const [ url, setUrl ] = useState(null);
	const [ progress, setProgress ] = useState(null);
	const [ intervalId, setIntervalId ] = useState(null);
	const [ statusAudio, setStatusAudio ] = useState(false);

	/*
	 * Lista de audios devuelta por la API para ser descargados
	 * el formato esperado es el siguiente:
	 * audios:[{'audio_name': 'mix_5.mp3', 'timestamp':'4853439598347643986'}, ...]
	*/
	const [ audioList, setAudioList ] = useState(null);
	/*
	 * La lista de audio recibida por la API es procesada para descargar
	 * los audios y convertirlos en blob para ser reproduccidos.
	 * urlList = [
	 *		{
	 *			'audio_name': 'mix_5.mp3',
	 *			'timestamp': '4853439598347643986'
	 *			'blob': null | Blob // audio descargado en formato Blob
	 *			'isReproduced': true | false // Determine si el audio ya se ha reproducido
	 *		}
	 * ]
	*/
	const [ urlList, setUrlList ] = useState(null);

	useEffect(() => {
		getAudioList();

		setIntervalId(setInterval(() => {
			getAudioList();
		}, 2000))
		return () => {
		}
	}, [])

	useEffect(() => {
		return () => {
			clearInterval(intervalId);
		}
	}, [intervalId])

	useEffect(() => {
		if(audioList) {
			setUrlList((prevState) => {
				if(prevState) {
					let newState = audioList.map((elNew) => {
						// buscar si el nuevo audio 'elNew' existe en la lista vieja
						let audioOld = prevState.find((elOld) => elOld.audio_name == elNew.audio_name);

						/*
						 * Si el audio ya existe en la lista de audios descargados
						 * se devuelve igual => 'audioOld' si no existe se agrega uno nuevo 'elNew'
						*/
						return (audioOld) ? audioOld :
						{
							...elNew,
							blob: null,
							isReproduced: false
						}
					})
					console.log('#################');
					console.log({
						newState,
						prevState,
						audioList,
					})
					console.log('#################');
					return newState;
				} else {
					return audioList.map((el) => {
						return {
							...el,
							blob: null,
							isReproduced: false,
						}
					})
				}
			})
		}
		return () => {}
	}, [audioList])

	useEffect(() => {
		if(urlList) {
			// Cantidad de audios que deben ser descargados
			var updated = 0;
			const audiosPromise = urlList.map((el) => {
				if(el.blob === null) updated++;
				// obtener el audio si aún no a sido descargado
				return (el.blob === null) ? getAudio(el) : el.blob;
			});

			if(updated) {
				// descargar lo nuevos audios
				Promise.all(audiosPromise).then((response) => {
					setUrlList((prevState) => {
						return prevState.map((elOld) => {
							// buscar en 'response' si el audio viejo 'elOld' se descargo nuevamente
							let audioNew = response.find((elNew) => elNew.audio_name == elOld.audio_name);
							/*
							 * Si el audio 'elOld' fue descargado nuevamente lo actualizamos
							 *  en caso contrario se devuelve el audio viejo 'elOld'
							*/
							return (audioNew) ? audioNew : elOld;
						})
					})
				})
			}
		}
		return () => {}
	}, [urlList])

	useEffect(() => {
		if(url && statusAudio) {
			audioRef.current.play();
		}
		return () => {}
	}, [url, statusAudio])

	useEffect(() => {
		if(statusAudio && urlList) {
			setUrl((prevState) => {
				/*
				 * Buscar el siguiente audio que aún no ha sido reproducido
				 * si no existe retorna undefined y se detiene la reproducción
				*/
				console.log('$$$$$$$$$$$$$$$$$$$$$$$$$');
				let newData = urlList.find((el) => (!el.isReproduced && el.blob));
				console.log({urlList, newData});
				console.log('$$$$$$$$$$$$$$$$$$$$$$$$$');
				return newData;
			})
		}
		return () => {}
	}, [statusAudio, urlList])

	const getAudioList = () => {
		httpClient.get(`${API_PY}get_audios`)
		.then(({ data }) => {
			console.log(`data.audios: ${data.audios.length}`, data.audios)
			setAudioList(data.audios);
		})
	}

	const getAudio = (dataAudio) => {
		return httpClient.get(`${API_PY}get_audio?filename=${dataAudio.audio_name}`, {
			responseType: 'blob'
		})
		.then(({ data }) => {
			return {
				...dataAudio,
				blob: window.URL.createObjectURL(data)
			}
		})
	}

	const handledUpdateAudio = () => {
		setProgress(0);
		audioRef.current.currentTime = 0;

		setUrl((prevState) => {
			if(prevState) {
				var audio_name = prevState.audio_name;
				setUrlList((prevState) => {
					const newState = prevState.map((el, index) => {
						if(el.audio_name == audio_name) {
							el.isReproduced = true;
						}
						return el;
					})
					return newState;
				})
			}
			return prevState;
		})
	}

	const timeHandler = () => {
		const { currentTime, duration } = audioRef.current;
		setProgress(Math.round((currentTime / duration) * 100).toString() + "%");
	}

	const handleStatusAudio = () => {
		setStatusAudio((prevState) => {
			const newState = !prevState;
			audioRef.current[(newState) ? 'play' : 'pause']();
			return newState;
		});
	}

	return (
		<div>
			<div className={style.progressBar_container}>
				<div className={style.progressBar} style={{ width: progress }}></div>
			</div>
			{ /*(!url) ? null :*/
				<Fragment>
					<img
						className={style.controls}
						onClick={handleStatusAudio}
						src={`/img/icons/${(!statusAudio) ? 'play' : 'pause'}.svg`}
					/>
					<audio
						// autoPlay
						// src={url.blob}
						src={url && url.blob}
						ref={audioRef}
						onTimeUpdate={timeHandler}
						onEnded={handledUpdateAudio}
					/>
				</Fragment>
			}
		</div>
	)
}

Audio.propTypes = {
	/*
	 * audio format type
	*/
	type: PropTypes.string,
}

Audio.defaultProps = {
	type: 'audio/mpeg'
}

export default Audio;
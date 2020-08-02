import React, { useState, useEffect, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';

/* style */
import './slider.scss';
import cx from 'classnames';
import style from './slider.css';

/* components */
import Progressbar from './Progressbar';

const Slider = ({ children, className, options, fullscreen, arrows, ...props }) => {
	const _slider = useRef(null);
	const sliderInstance = useRef(null);
	const [ activeIndex, setActiveIndex ] = useState(null);
	const [ widthProgress, setWidthProgress ] = useState(0);
	const [ widthWindow, setWidthWindow ] = useState(window.innerWidth);
	const [ progressbarIntervalId, setProgressbarIntervalId ] = useState(null);

	useEffect(() => {
		window.addEventListener("resize", updateWidthWindow);
		return () => {
			window.removeEventListener("resize", updateWidthWindow);
		}
	}, []);

	useEffect(() => {
		sliderInstance.current = M.Slider.init(_slider.current, {...options, interval: Math.pow(100,10)});

		/*
		 * Asegurar que al cambiar de slider mediante los indicators
		 * el progressbar se actualice (regrese a su valor inicial = 0)
		*/
		const indicators = sliderInstance.current['$indicators'] || [];
		for (let i = 0; i < indicators.length; i++) {
			indicators[i].addEventListener('click', resetWidthProgress);
		}

		return () => {
			if (sliderInstance.current) {
				const indicators = sliderInstance.current['$indicators'] || [];
				for (let i = 0; i < indicators.length; i++) {
					indicators[i].removeEventListener('click', resetWidthProgress);
				}

				setActiveIndex(sliderInstance.current.activeIndex);
				sliderInstance.current.destroy();
			}
		};
	}, [_slider, options, fullscreen, children]);

	useEffect(() => {
		if (activeIndex) {
			if (typeof indicators === 'undefined' || options.indicators) {
				sliderInstance.current['$indicators'][activeIndex].className =
					'indicator-item active';
			}
		}
	}, [activeIndex, options.indicators, fullscreen]);

	/**
	 * Si el slider no estaba a fullscreen, la altura se establece como
	 * un atributo de estilo en el elemento slider. Cuando se llama a
	 * `.destroy()`, este atributo no se elimina, lo que da como resultado
	 * una pantalla completa que se muestra incorrectamente.
	 */
	useEffect(() => {
		if (fullscreen) {
			_slider.current.removeAttribute('style');
			_slider.current.childNodes[0].removeAttribute('style');
		}
	}, [fullscreen]);

	useEffect(() => {
		return () => {
			clearInterval(progressbarIntervalId);
		}
	}, [progressbarIntervalId]);

	useEffect(() => {
		startProgressbar();
		return () => {
			clearInterval(progressbarIntervalId);
		}
	}, [options, widthWindow]);

	useEffect(() => {
		if(widthProgress >= widthWindow) {
			handleMoveSlider('next');
		}
	}, [ widthProgress, widthWindow ]);

	const startProgressbar = () => {
		resetProgressbar();
		const interval = 100;
		const crecimiento = (widthWindow / (options.interval / interval));
		setProgressbarIntervalId(setInterval(() => {
			setWidthProgress((prevState) => prevState + crecimiento);
		}, interval));
	}

	const resetProgressbar = () => {
		resetWidthProgress();
		clearInterval(progressbarIntervalId);
		setProgressbarIntervalId(null);
	}

	const resetWidthProgress = () => {
		setWidthProgress(0);
	}

	const handleMoveSlider = (action) => {
		resetWidthProgress();
		sliderInstance.current && sliderInstance.current[action]()
	}

	const updateWidthWindow = () => {
		setWidthWindow(window.innerWidth);
	};

	return (
		<div
			ref={_slider}
			className={cx(
				'slider',
				className,
				style.slider,
				{fullscreen},
				{ [`${style.fullscreen}`] : fullscreen },
				{ [`${style.whithProgressBar}`] : fullscreen }
			)}
			{...props}
		>
		{
			(arrows && children.length > 1) ?
				<Fragment>
					<span onClick={() => handleMoveSlider('prev')} className={style.arrowLeft} ></span>
					<span onClick={() => handleMoveSlider('next')} className={style.arrowRight} ></span>
				</Fragment>
			: null
		}
			<ul className={cx('slides', style.slides)} >{children}</ul>
		{
			fullscreen && children.length > 1 &&
			<Progressbar
				width={widthProgress}
				duration={options.interval}
			/>
		}
		</div>
	);
};

Slider.propTypes = {
	arrows: PropTypes.bool,
	children: PropTypes.node,
	className: PropTypes.string,
	/**
	 * Whether or not the Slider should be fullscreen
	 * @default false
	 */
	fullscreen: PropTypes.bool,
	options: PropTypes.shape({
		/**
		 * Set to false to hide slide indicators
		 * @default true
		 */
		indicators: PropTypes.bool,
		/**
		 * The interval between transitions in ms
		 * @default 6000
		 */
		interval: PropTypes.number,
		/**
		 * The duration of the transation animation in ms
		 * @default 500
		 */
		duration: PropTypes.number,
		/**
		 * The height of the Slider window
		 * @default 400
		 */
		height: PropTypes.number
	})
};

Slider.defaultProps = {
	fullscreen: false,
	options: {
		indicators: true,
		interval: 6000,
		duration: 500,
		height: 400
	}
};

export default Slider;
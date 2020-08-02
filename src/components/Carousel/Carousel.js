import React, {
	useRef,
	useState,
	Fragment,
	useEffect,
} from 'react';
import PropTypes from 'prop-types';

/* Style */
import cx from 'classnames';
import style from './carousel.css';

/* components */
import ImageLeftTextRight from './ImageLeftTextRight';
import ImageTopTextButtom from './ImageTopTextButtom';

/* CustomHooks */
import { useMobileDetector } from '../customHooks/';

const Carousel = ({ items, layout }) => {
	const _carousel = useRef(null);
	const [ moveTo, setMoveTo ] = useState(null);
	const [ startLoop, setStartLoop ] = useState(false);
	const [ intervalId, setIntervalId ] = useState(null);
	const [ translationX, setTranslationX ] = useState(0);
	const [ showArrowRight, setShowArrowRight ] = useState(true);

	// Breakpoint
	// los breakpoints son definidos en carousel.css
	const tableActive = useMobileDetector(1100);
	const mobileActive = useMobileDetector(768);

	useEffect(() => {
		window.addEventListener("resize", resetCarousel);
		return () => {
			clearInterval(intervalId)
			window.removeEventListener("resize", resetCarousel);
		}
	}, [])

	useEffect(() => {
		if(!startLoop) {
			setIntervalId(null);
		}
	}, [startLoop])

	useEffect(() => {
		if(startLoop && !intervalId) {
			startMoveCarouselLoop(moveTo);
		}

		if(!startLoop) {
			clearInterval(intervalId)
		}
	}, [startLoop, intervalId, translationX, moveTo])

	const resetCarousel = () => {
		setTranslationX(0);
		setShowArrowRight(true);
		_carousel.current.style.transform = '';
	};

	const handleMouseEnter = (direction) => {
		setStartLoop(true);
		setMoveTo(direction);
	}

	const handleMouseLeave = () => {
		setStartLoop(false);
	}

	const startMoveCarouselLoop = (to) => {
		let contador = translationX;
		setIntervalId(setInterval(() => {
			contador += (moveTo == 'left') ? 30 : -30;
			const C = _carousel.current;
			let totalWidthNode = 0;
			C.childNodes.forEach((el) => { totalWidthNode += el.clientWidth });
			const limitLeft = -(totalWidthNode - C.clientWidth);
			if(contador >= 0) {
				// Llego al límite de traslación hacia la derecha
				contador = 0;
				setStartLoop(false);
			}

			if(contador <= limitLeft) {
				setStartLoop(false);
				contador = limitLeft;
				setShowArrowRight(false);
			} else {
				setShowArrowRight(true);
			}

			setTranslationX(contador);
			_carousel.current.style.transform = `translateX(${contador}px)`;
		}, 100))
	}

	const renderArrowRigth = () => {
		let arrowRight = (
			<span
				onMouseEnter={() => handleMouseEnter('right')}
				onMouseLeave={() => handleMouseLeave()}
				className={cx(style.arrow, style.right)}
			></span>
		);

		const length = items.length;
		switch (layout) {
			// los breakpoints son definidos en carousel.css
			case 1:
				// Breakpoint mobile and table
				if(tableActive && length <= 2) {
						return null;
				}

				// Breakpoint destock
				if(!tableActive && length <= 3) {
					return null;
				}

				return (showArrowRight) ? arrowRight : null;
			case 2:
				// Breakpoint mobile
				if(mobileActive && length <= 1) {
						return null;
				}

				// Breakpoint table
				if(!mobileActive && tableActive && length <= 3) {
						return null;
				}

				// Breakpoint destock
				if(!mobileActive && !tableActive && length <= 5) {
					return null;
				}

				return (showArrowRight) ? arrowRight : null;
			default: return null;
		}
	}

	return(
		<div
			className={cx(
				style.mainContent,
				{[`${style.layout1}`]: layout == 1},
				{[`${style.layout2}`]: layout == 2},
			)}
		>
			<div ref={_carousel} className={style.carousel} >
			{
				items.map((el, key) => {
					return((layout == 1) ?
						<ImageLeftTextRight key={key} item={el} />
						:
						<ImageTopTextButtom key={key} item={el} />
					)
				})
			}
			</div>

			{ translationX < 0 &&
				<span
					onMouseEnter={() => handleMouseEnter('left')}
					onMouseLeave={() => handleMouseLeave()}
					className={cx(style.arrow, style.left)}
				></span>
			}

			{renderArrowRigth()}
		</div>
	)
}

Carousel.propTypes = {
	/*
	 * items a renderizar en el carousel
	*/
	items: PropTypes.array.isRequired,
	/*
	 * Tipo de formato que se va a renderizar, las opciones son:
	 * 1 => imagen a la izquierda y el texto a la derecha
	 * 2 => imagen a full width en la parte superior y el texto en la parte inferior
	*/
	layout: PropTypes.oneOf([1, 2]).isRequired,
}

Carousel.defaultProps = {}

export default Carousel;
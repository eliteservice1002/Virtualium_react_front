import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

/* components */
import TextInput from './TextInput';

/* utils */
import idgen from '../utils/idgen';

const TimePicker = ({ options, onCloseEnd, onSelect, inputSolid, className, ...props }) => {
	const timeEl = React.createRef();

	useEffect(() => {
		// const _options = onSelect ? { ...options, onSelect: onSelect } : options;

		const handlers = {
			onCloseEnd: handleonCloseEnd,
			onSelect: handleOnSelect
		};
		const _options = Object.assign({}, TimePicker.defaultProps.options, options, handlers);
		console.log(_options);
		const instance = M.Timepicker.init(timeEl.current._inputRef, _options);

		return () => {
			instance && instance.destroy();
		};
	}, [options, onSelect]);

	const handleOnSelect = () => {
		onSelect();
		timeEl.current._labelRef.classList.add('active');
	}

	const handleonCloseEnd = () => {
		onCloseEnd();
	}

	return(
		<TextInput
			{...props}
			ref={timeEl}
			inputSolid={inputSolid}
			inputClassName={cx('timepicker', className)}
		/>
	)
};

TimePicker.propTypes = {
	/**
	 * id passed to Timepicker, also used for init method
	 * @default idgen()
	 */
	id: PropTypes.string,
	/**
	 * options passed to init method
	 * more info: https://materializecss.com/pickers.html#time-picker
	 */
	options: PropTypes.shape({
		/**
		 * Duration of the transition from/to the hours/minutes view.
		 * @default 350
		 */
		duration: PropTypes.number,
		/**
		 * Specify a selector for a DOM element to render the calendar in, by default it will be placed before the input.
		 * @default null
		 */
		container: PropTypes.string,
		/**
		 * Show the clear button in the Timepicker.
		 * @default false
		 */
		showClearBtn: PropTypes.bool,
		/**
		 * Default time to set on the timepicker 'now' or '13:14'
		 * @default 'now'
		 */
		defaultTime: PropTypes.string,
		/**
		 * Millisecond offset from the defaultTime.
		 * @default 0
		 */
		fromNow: PropTypes.number,
		/**
		 * Internationalization options.
		 * @default See i18n documentation.
		 */
		i18n: PropTypes.shape({
			cancel: PropTypes.string,
			clear: PropTypes.string,
			done: PropTypes.string
		}),
		/**
		 * Automatically close picker when minute is selected.
		 * @default false
		 */
		autoClose: PropTypes.bool,
		/**
		 * Use 12 hour AM/PM clock instead of 24 hour clock.
		 * @default true
		 */
		twelveHour: PropTypes.bool,
		/**
		 * Vibrate device when dragging clock hand.
		 * @default true
		 */
		vibrate: PropTypes.bool,
		/**
		 * Callback function called after modal is opened.
		 * @default null
		 */
		onOpenEnd: PropTypes.func,
		/**
		 * Callback function called before modal is opened.
		 * @default null
		 */
		onOpenStart: PropTypes.func,
		/**
		 * Callback function called before modal is closed.
		 * @default null
		 */
		onCloseStart: PropTypes.func,
	}),
	/**
	 * Callback function when a time is selected, first parameter is the hour and the second is the minute.
	 * @default null
	 */
	onSelect: PropTypes.func,
	/**
	 * Callback function called after modal is closed.
	 * @default null
	 */
	onCloseEnd: PropTypes.func,
};

TimePicker.defaultProps = {
	id: `TimePicker-${idgen()}`,
	options: {
		duration: 350,
		container: null,
		showClearBtn: false,
		defaultTime: 'now',
		fromNow: 0,
		i18n: {
			done: 'Ok',
			clear: 'Clear',
			cancel: 'Cancelar',
		},
		vibrate: true,
		onOpenEnd: null,
		autoClose: false,
		twelveHour: true,
		onOpenStart: null,
		onCloseStart: null,
	},
	onSelect: () => {},
	onCloseEnd: () => {},
};

export default TimePicker;

import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';

/* style */
import style from './messageDisplay.css';

class MessageDisplay extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			messageRetriever: {
				messages: undefined
			}
		}
	}

	componentDidMount() {
		this.getMessages();
		this.messagesInterval = setInterval(() => this.getMessages(), 2000);
	}

	componentWillUnmount() {
		clearInterval(this.messagesInterval);
	}

	// this method fetch the messages from the URL
	async getMessages() {
		// console.log("fetching data...");
		let response = await fetch(this.props.fetchMessage);

		try{
			let jsonData = await response.json();

			if(response.ok) {
				this.setState({
					messageRetriever: {
						messages: jsonData.messages.map((message) => { // for each message in the jsonData
							let localTime;

							try {
								let GMTTimeString = message.timestamp + " GMT";
								let date = new Date(GMTTimeString);
								localTime = {
									hours: date.getHours(),
									minutes: (date.getMinutes().toString().length < 2 ? '0' + date.getMinutes().toString() : date.getMinutes())
								}
							} catch (error) {
								console.log("Date couldn't be fetched somehow, from the json (maybe the date wasn't sent), details: ", error);
							}

							return {
								"user_nick": (message.user_nick === undefined ? '' : message.user_nick),
								"text": message.text === undefined ? '' : message.text,
								"time": localTime
							};
						})
					}
				});
			}
		} catch (error) {
			console.log("Error... ", error);

		}
	}

	render() {
		const { alert } = this.props;
		return (
			<div>
				<div className={style.main_box}>
				{ (this.state.messageRetriever.messages === undefined) ?
					<h3>
						{alert}
					</h3>
					:
					// for each message received in the fetching
					this.state.messageRetriever.messages.reverse().map((message, index) => {
						// first, is going to define the default classes for it
						let className = style.message_box + " " + style.text + " ";
						let time;
						if (message.time !== undefined) {
							time = message.time.hours + ":" + message.time.minutes
						}
						return (
							<div key={index}
								className={className}>
								<img className={
										style.user_image
									}
									src={
										message.user_image_URL
									}/>
								<p className={
									style.user_nick
								}>
									{
									message.user_nick === undefined ? "" : message.user_nick + " "
								}at{
									" " + time
								} </p>
								<p className={
									message.error !== true ? style.text : style.text_error
								}>
									{
									message.text
								}</p>
							</div>
						)
						// returns the message with all the classes
						// and content setup.
					})
				}
				</div>
			</div>
		)
	}
}

MessageDisplay.propTypes = {
	/*
	 * Notice to show user while messages are loading
	*/
	alert: PropTypes.string,
	/*
	 * Url to search messages
	*/
	fetchMessage: PropTypes.string.isRequired,
}

MessageDisplay.defaultProps = {
	alert: 'Cargando mensajes...'
}

export default MessageDisplay;
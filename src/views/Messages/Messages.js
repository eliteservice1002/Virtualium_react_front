import React, { useRef, useState, useEffect } from 'react';

/* config */
import { API_PY } from '../../config.js';

/* components */
import Audio from '../../components/Audio/Audio';
import MessageDisplay from '../../components/MessageDisplay/MessageDisplay';

/* style */
// import style from './componentname.css';

const Messages = () => {
	return(
		<div>
			<Audio/>
			<MessageDisplay
				fetchMessage={`${API_PY}message/topic`}
				alert='No se encontró ningún mensaje... Pero no te preocupes, llegarán pronto!!!'
			/>
		</div>
	);
}
export default Messages;
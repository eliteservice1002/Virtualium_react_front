import React, { useRef, useState, useEffect } from 'react';

/* config */
import { API_PY } from '../../config.js';

/* style */
import style from './mosaic-video.css';
/*
	MosaicImages component, it shows a mosaic of images using a canvas HTML5.
	
	Properties:
		Width and Height: size of the component.
		Src: An array containing the source of each image.
*/

class MosaicImages extends React.Component{
	constructor(props){
		super(props);

		// this variable is the input for the Images, an array of one or more images named source
		// it's not intended to receive images as an input if not, the source of the images as an input
		// example: <MosaicImages Src= {["selfie1.jpg", "selfie2.jpg", "selfie3.jpg"]} />
		this.state = {
			Mosaic: "Not found"
		};
	}

	//it generates the mosaic only when the mosaic is going to be animated
	//TODO: Animated feature isn't developed yet, please don't use Animated property while declaring this react component
	componentDidMount(){
		this.getData();
		this.imageUpdateInterval = setInterval(()=>this.getData(), 60000);
	}

	componentWillUnmount(){
		clearInterval(this.imageUpdateInterval);
	}

	getData() {
		console.log("fetching new image...");
		// fetch('https://backend.virtualium.ethernity.live/get_video?w='+new Date().getTime().toString())
		fetch(`${API_PY}get_video?w=${new Date().getTime().toString()}`)
		.then(res => res.blob())
		.then((data)=>{
			this.setState({Mosaic: URL.createObjectURL(data)}, ()=>{console.log(this.state.Mosaic)});
		});
	}

	componentDidUpdate(){

	}
	// Method that generates the mosaic from the input images
	generateMosaic(){
		// Get the 2d context from the referencing of the canvas
		
	}
 
	// Rendering part, while rendering this canvas is going to receive all of the images from the server in an API
	render(){
		return(
			<div className={style.mosaic}>
				<video src = {this.state.Mosaic} type = "video/mp4" autoPlay loop>
				</video>
			</div>
		)
	}

}
export default MosaicImages;
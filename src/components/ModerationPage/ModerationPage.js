import React, {useState, useEffect, useCallback} from 'react';
import style from './ModerationPage.module.css'
import axios from 'axios';

import SelectableImage from './components/SelectableImage';

/* config */
import { API_PY } from '../../config.js';






function ModerationPage(props){
    /* The info of this state was recovered via api ENDPOINT GET*/
    let [imagesCollection, setImagesCollection] = useState({files:[]});

    let [previewImage, setPreviewImage] = useState("");

    /* This variable will be sent to a POST request,
    JSON format example:

    {
        images:>>[
            {
                image_name: "1",
                status: "approved"
            }
        ]<< internalBlock
    }
    */
    let [selectableImages, setSelectableImages] = useState([]);


    useEffect(()=>{
        console.log("veamos...");
        axios.get(API_PY + "filter/images")
        .then(function (response){
            setImagesCollection(response.data);
        });
    },[])

    const handleStatus = useCallback(image =>{
        let newData =  {
            "image_name":image.image_name,
            "status":image.status
        };

        let objectToModifyId = selectableImages.findIndex(obj => obj.image_name == newData.image_name);
        console.log(objectToModifyId);
        let newArray

        if(objectToModifyId === -1){
            newArray = []

            imagesCollection.files.map(image=>newArray.push({"image_name": image, "status":"pending"}));
        }else{
            
            console.log("id to modify: ", objectToModifyId);
            newArray = [...selectableImages];

            newArray[objectToModifyId] = newData;

        }
        setSelectableImages(newArray);
        console.log("inside of the parent", image.image_name , image.status);
        console.log("new array: ",newArray);

        setPreviewImage(image.image_name);


    },[selectableImages]);

    useEffect(()=>{

        console.log("changes: ", selectableImages);

    },[selectableImages])


    const acceptChanges = ()=>{
        let imagesToUpload = selectableImages.filter(matching=>{
            console.log("El status de ", matching.image_name, "es ",matching.status);
            return (matching.status === "approved"  || matching.status ==="rejected")});
        let imagesToReject = selectableImages.filter(matching=>matching.status === "pending");

        let answer = confirm("¿Estás seguro de que quieres subir estos cambios al servidor?");

        if(answer === true){
            axios.post(API_PY +"filter/images",
            {'data':imagesToUpload})
            .then(response=>console.log(response))
            .catch(error=>console.log(error));


            console.log("uploading: ",imagesToUpload);
            console.log("rejecting: ",imagesToReject);
        }else{
            console.log("rejecting all: ", selectableImages);
        }
    }








    return(
        <div className={style.grid}>
            <div className={style.options}>
                <button onClick={acceptChanges}>Aceptar cambios</button>
            </div>
            <div className={style.gridArea_images +" "+ style.thumbnails_preview}>
                {/* Aquí se colocan los objetos del tipo SelectableImage */}
                {
                    imagesCollection.files.map((image, index)=>
                    <SelectableImage name = {image} onStatus = {handleStatus} src = {API_PY + "filter/image/"+image+"?w="+Date.now()} />
                    )
                }
            </div>

            <div className={style.gridArea_preview}>
                <img className={style.selected_preview} src={API_PY + "filter/image/"+previewImage}></img>
            </div>
        </div>
    );
}

export default ModerationPage;
import React, {useState, useEffect} from 'react';
import style from './SelectableImage.module.css';

function SelectableImage(props){
    let [status, setStatus] = useState("pending");

    const onSelected = props.onSelected;
    const onStatus = props.onStatus;




    useEffect(()=>{
        onStatus(
            {
                "image_name": props.name,
                "status": status
            }
        );
    }, [status]);






    const changeStatus = ()=>{
        let newStatus;

        if(status == "approved") newStatus = "rejected"
        else if (status == "rejected") newStatus = "pending"
        else if (status == "pending") newStatus = "approved"

        setStatus(newStatus);
    }






    return(
        <div className={
            style.container +" "+
            style[status]
        }  onClick={changeStatus}>
            <img className={style.image} src={props.src}/>
        </div>
    );
}

export default SelectableImage;
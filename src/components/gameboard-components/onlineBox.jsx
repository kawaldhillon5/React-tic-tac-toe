import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const OnlineBox = forwardRef((props,ref)=>{
    const [value, setValue] = useState('');
    const [classname, setClassname] = useState('');
    const id = useRef(props.id);

    useImperativeHandle(ref, ()=>({
        setBoxValue : (val) => setValue(val),
        setBoxClass: (val)=> setClassname(val),
        getBoxValue: ()=> {return value}, 
        getBoxId: ()=> {return id.current}, 

    }));


    return (
        <div onClick={()=>{props.handleClick(ref)}} id={id.current} className={`gameboard-box ${classname}`}>{value}</div>
    )
});

export default OnlineBox;
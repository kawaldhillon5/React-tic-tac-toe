import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const Box = forwardRef((props,ref,)=>{
    const [value, setValue] = useState('');
    const [classname, setClassname] = useState('');
    useImperativeHandle(ref, ()=>({
        setBoxValue : (val) => setValue(val),
        setBoxClass: (val)=> setClassname(val),
        getBoxValue: ()=> {return value}, 
    }));

    useEffect(()=>{props.checkWinner()},[value])

    return (
        <div onClick={()=>{props.handleClick(ref)}} className={`gameboard-box ${classname}`}>{value}</div>
    )
});

export default Box;
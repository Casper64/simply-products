import React, { useEffect, useRef, useState } from 'react'

interface DangerZoneProps<T> {
    model?: T;
    rename: Function;
    delete: Function;
}

interface anyObject {
    [key:string]: any
}

function DangerZone<T extends anyObject>(props: DangerZoneProps<T>) {
    const { model } = props;
    const [inputState, setInputState] = useState('');
    const [remove, setRemove] = useState({
        on: false,
        type: '',
        id: ''
    });

    const inputDanger = useRef(null) as React.MutableRefObject<null | HTMLInputElement>
    
    

    const keyUp: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key == "Escape") {
            inputDanger.current?.blur();
        }
        else if (event.key == "Enter") {
            if (remove.type === 'model' && inputDanger.current?.value === model?.name) {
                props.delete(inputState);
            }
            else if (remove.type === "rename") {
                props.rename(inputState);
                inputDanger.current?.blur();
            }
        }
    }

    useEffect(() => {
        if (remove.on) {
            inputDanger.current?.focus();
        }
    }, [remove])

    return (
        <div className="card danger-zone">
            <div className="header">
                <p>Danger zone</p>
            </div>
            <div className="danger-container">
                { remove.on && remove.type === "rename" && (
                    <p className="label">Hit enter to rename</p>
                ) }
                { remove.on &&  remove.type === "model" && (
                    <p className="verify">Type &#34;
                        <span className={inputState === model?.name ? 'correct' : 'not-correct'}>
                            { model?.name }
                        </span>
                        &#34; and press enter to delete
                    </p>
                ) }
                { remove.on && <input 
                    ref={inputDanger} 
                    value={inputState}
                    onChange={(e) => setInputState(e.target.value)}
                    onKeyUp={keyUp} 
                    onBlur={() => {
                        setInputState('');
                        setRemove({
                            ...remove,
                            on: false
                        })
                    }}
                /> }
                <button 
                    className="btn danger"
                    onClick={() => setRemove({
                        id: model?._id,
                        on: true,
                        type: 'rename'
                    })}
                >Rename</button>
                <button 
                    className="btn danger"
                    onClick={() => setRemove({
                        id: model?._id,
                        on: true,
                        type: 'model'
                    })}
                >Delete { model?.name}</button>
            </div>
        </div>
    )
}

export default DangerZone
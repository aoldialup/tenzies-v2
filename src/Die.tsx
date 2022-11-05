import {nanoid} from 'nanoid'

export function Die(props: { value: number, isHeld: boolean, holdDice: any }) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    };

    let dots = [];

    for (let i = 0; i < props.value; i++) {
        dots.push(<div className="dot" key={nanoid()} />)
    }
    //<h2 className="die-num">{props.value}</h2>

    return (
        <div className="die-face" style={styles} onClick={props.holdDice}>
            <div className={props.value === 6 ? "six-dot-container" : "dot-container"} >
                {dots}
            </div>
        </div>
    );
}
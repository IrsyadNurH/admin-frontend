import Form from "./FormLogin";
import CardCover from './CardCoverLogin';
import './styles/App.css'

function CardLogin () {
    return (
        <div className="card-container">
            <div className="card__body">
                <CardCover/>
                <Form/>
            </div>
        </div>
    )
}

export default CardLogin;
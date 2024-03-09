import img from './error.gif';

const ErrorMessage = () => {
    return(
        <img style={{display: 'block', width: '250px', height: '250px', onjectFit: 'contain', margin: '0 auto'}}
         src={img} alt=''/>
    )
}

export default ErrorMessage;
import {Link} from 'react-router-dom';
import '../style.css'
const EmptyPage = () =>{

    return(
        <>
            <center>
                <h1 style={{color: '#ADEFD1FF'}}> 404! This is an empty page</h1>
                <Link to={'/'} className='backButton'>Go Home</Link>
            </center>
            
        </>
    );
};
export default EmptyPage;
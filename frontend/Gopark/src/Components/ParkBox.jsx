import { Autocomplete } from "@react-google-maps/api";
import { useEffect, useRef, useState } from 'react';
import '../style.css';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";

const statusColorMaper = {
    'OCCUPOID': 'red',
    'AVAILABLE': '#44ea3b',
    'RESERVED': '#ea3b98',
    'NULL': 'white'
};
const ParkBox = ({ lot, person, getRout, loadSpots }) =>{
    const [firstHalfSpots, setFirstHalfSpots] = useState([]);
    const [secondHalfSpots, setSecondHalfSpots] = useState([]);
    const [parkSpots, setParkSpots] = useState([{number: 1, status: 'OCCUPOID', freeAt:"3PM"}, {number: 2, status: 'RESERVED', freeAt:"4PM"}, {number: 3, status: 'AVAILABLE', freeAt:"now"}, {number: 4, status: 'OCCUPOID', freeAt:"5PM"}]);
    const [isHoverd, setIsHoverd] = useState(false);
    const [hoverdObj, setHoverdObj] = useState(NaN);
    const [showOriginInput, setShowOriginInput] = useState(false);
    const [counter, setCounter] = useState(0);
    const origin = useRef();
    const targetRef = useRef(null);

    // useEffect refreshes the spots every second
    useEffect(()=>{
        let interval = setInterval(()=>{
            getSpots();
        }, 1000);

        setFirstHalfSpots(()=>parkSpots.slice(0, Math.ceil(parkSpots.length / 2)));
        setSecondHalfSpots(()=>parkSpots.slice(Math.ceil(parkSpots.length / 2), parkSpots.length));

        return ()=>clearInterval(interval);
    }, [parkSpots]);

    const notifySuccessReserving = () => {
        toast.success(`Spot Reserved successfully`);
    };

    const notifyFaildReserving = () => {
        toast.error(`Faild to reserve spot`);
    };

    const handleScroll = () => {
        if (targetRef.current) {
            console.log(targetRef);
          targetRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    const getSpots = async()=>{
        await fetch(`http://localhost:8081/api/v1/getSpots?parkID=${lot.ID}`)
        .then(response=>response.status==200 || response.status==201? (()=>{return response.json()})(): (()=>{throw Error("Error reserving spot")})())
        .then(spots=>{setParkSpots(()=>spots); loadSpots(()=>spots);})
        .catch(e=>console.error(e));
    }    

    const reserveSpot = async(spot)=>{
        if (spot.status == 'AVAILABLE'){
            const reservationTime = window.prompt("Please enter amount of time you whant to reserve your spot in hours");
            if (reservationTime===null || reservationTime.valueOf() > 5 || reservationTime.valueOf() <= 0){
                alert(`Sorry allowed time for reservation is from 1 to 5 hours`);
                return;
            }
            const confermatoin = window.confirm(`You are now about to reserve spot number: ${spot.number} in ${lot.name} lot\nPress confirm to conferm your reservation.`);
            if (confermatoin){
                const regester = await fetch(`http://localhost:8081/api/v1/users/reserveSpot?parkID=${lot.ID}&spotNumber=${spot.number}`, {
                    method: 'PUT',
                })
                .then(response=>response.status==200 || response.status==201? notifySuccessReserving(): (()=>{throw Error("Error reserving spot")})())
                .catch(e=>{console.log(e); notifyFaildReserving()});
                
            }
        }
        else{
            alert(`Sorry this spot is ${spot.status}`);
        }
    }
    return(
        <div className="parkContainerStyle">
            <center style={{fontSize: "2rem"}}>{lot.name} lot</center>
            {/* <p>Location: {lot.locationString}</p> */}
            <p>Capacity: {lot.capacity}</p>
            <p>Type: {lot.type}</p>
            <p>Pricing structure: {lot.pricingStruct}</p>
            <div className='parkingLots'>
                <div className='leftLots'>
                    {firstHalfSpots.map((l, i)=>(
                        <div className='lot' key={i} style={{color:"white" ,border:`2px solid ${statusColorMaper[l.status]}`, backgroundColor:isHoverd && hoverdObj==i ?statusColorMaper[l.status]:'transparent'}} onMouseEnter={(e)=>{setIsHoverd(()=>true); setHoverdObj(e._targetInst.key);}} onMouseLeave={()=>setIsHoverd(()=>false)} onClick={()=>reserveSpot(l)}>
                            <p>{l.number}</p>
                        </div>)
                    )}
                </div>
                <div className='rightLots'>
                    {secondHalfSpots.map((l, i)=>(
                        <div className='lot' key={i+firstHalfSpots.length} style={{color: "white", border:`2px solid ${statusColorMaper[l.status]}`, backgroundColor:isHoverd && hoverdObj==i+firstHalfSpots.length ?statusColorMaper[l.status]:'transparent'}} onMouseEnter={(e)=>{setIsHoverd(()=>true); setHoverdObj(e._targetInst.key);}} onMouseLeave={()=>setIsHoverd(()=>false)} onClick={()=>reserveSpot(l)}>
                            <p>{l.number}</p>
                        </div>)
                    )}
                </div>
            </div>
            {person == "user" && <center><button className='backButton' onClick={()=>{setShowOriginInput(true); setTimeout(()=>{handleScroll()}, 100)}}>Get directions</button></center>}
            {showOriginInput && <center style={{display:"flex", justifyContent:"center"}}><Autocomplete options={{componentRestrictions: { country: "br" }}}>
                                            <input type="text" placeholder="Origin"  ref={origin}/>
                                        </Autocomplete>
                                        <button className="backButton" style={{marginLeft:"2rem"}} onClick={()=>getRout(origin.current.value, lot.locationCoor)}>Go</button>
                                        </center>}
            {person == "admin" && 
            <div className='analysisArea'>
                <hr style={{color:"black"}}/>
                <p>
                Occupancy rates: {}<br/>
                Revenue: {}<br/>
                Violations/Overstayings: {}
                
                </p>
            </div>}
            <div ref={targetRef}/>
        </div>
    );
};
export default ParkBox;

ParkBox.propTypes = {
    lot: PropTypes.object,
    person: PropTypes.string,
    getRout: PropTypes.func
}
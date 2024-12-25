import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
import { useRef, useState } from 'react';
import '../style.css';
const statusColorMaper = {
    'OCCUPOID': 'red',
    'AVAILABLE': '#44ea3b',
    'RESERVED': '#ea3b98'
};
const ParkBox = ({ park, person, getRout }) =>{
    const firstHalfLots = park.lots.slice(0, Math.ceil(park.lots.length / 2));
    const secondHalfLots = park.lots.slice(Math.ceil(park.lots.length / 2), park.lots.length);
    const [isHoverd, setIsHoverd] = useState(false);
    const [hoverdObj, setHoverdObj] = useState(NaN);
    const [showOriginInput, setShowOriginInput] = useState(false);
    const [directions, setDirections] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    const origin = useRef();
    const targetRef = useRef(null);

    const handleScroll = () => {
        if (targetRef.current) {
            console.log(targetRef);
          targetRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    const go = async ()=>{
        if(origin.current.value === '' || destination.current.value === '')
            return
        const destinationService = new google.maps.DirectionsService();
        const result = await destinationService.route({
            origin: origin.current.value,
            destination: destination.current.value,
            travelMode: google.maps.TravelMode.DRIVING
        });
        setDirections(result);
        setDistance(result.routes[0].legs[0].distance.text);
        setDuration(result.routes[0].legs[0].duration.text);
    }

    const reserveLot = async(lot)=>{
        if (lot.status == 'AVAILABLE'){
            const reservationTime = window.prompt("Please enter amount of time you whant to reserve your lot in hours");
            if (reservationTime===null || reservationTime.valueOf() > 5 || reservationTime.valueOf() <= 0){
                alert(`Sorry allowed time for reservation is from 1 to 5 hours`);
                return;
            }
            const confermatoin = window.confirm(`You are now about to reserve lot number: ${lot.number} in ${park.name} park\nPress confirm to conferm your reservation.`);
            if (confermatoin){
                // const regester = await fetch(`http://localhost:8081/reserveLot`, {
                //     method: 'PUT',
                //     headers: {
                //         'User': person.ID,
                //         'ParkID': park.ID,
                //         'LotNum': lot.number
                //     }
                // })
                // .catch(e=>{console.log(e); alert("Error reserving the lot")});
                alert("Your slot is reserved");
            }
        }
        else{
            alert(`Sorry this lot is ${lot.status}`);
        }
    }
    return(
        <div className="parkContainerStyle">
            <center style={{fontSize: "2rem"}}>{park.name} Park</center>
            <p>Location: {park.locationString}</p>
            <p>Capacity: {park.capacity}</p>
            <p>Type: {park.type}</p>
            <p>Pricing structure: {park.pricingStruct}</p>
            <div className='parkingLots'>
                <div className='leftLots'>
                    {firstHalfLots.map((l, i)=>(
                        <div className='lot' key={i} style={{color:"white" ,border:`2px solid ${statusColorMaper[l.status]}`, backgroundColor:isHoverd && hoverdObj==i ?statusColorMaper[l.status]:'transparent'}} onMouseEnter={(e)=>{setIsHoverd(()=>true); setHoverdObj(e._targetInst.key);}} onMouseLeave={()=>setIsHoverd(()=>false)} onClick={()=>reserveLot(l)}>
                            <p>{l.number}</p>
                        </div>)
                    )}
                </div>
                <div className='rightLots'>
                    {secondHalfLots.map((l, i)=>(
                        <div className='lot' key={i+firstHalfLots.length} style={{color: "white", border:`2px solid ${statusColorMaper[l.status]}`, backgroundColor:isHoverd && hoverdObj==i+firstHalfLots.length ?statusColorMaper[l.status]:'transparent'}} onMouseEnter={(e)=>{setIsHoverd(()=>true); setHoverdObj(e._targetInst.key);}} onMouseLeave={()=>setIsHoverd(()=>false)} onClick={()=>reserveLot(l)}>
                            <p>{l.number}</p>
                        </div>)
                    )}
                </div>
            </div>
            {person == "user" && <center><button className='backButton' onClick={()=>{setShowOriginInput(true); setTimeout(()=>{handleScroll()}, 100)}}>Get directions</button></center>}
            {showOriginInput && <center style={{display:"flex", justifyContent:"center"}}><Autocomplete options={{componentRestrictions: { country: "br" }}}>
                                            <input type="text" placeholder="Origin"  ref={origin}/>
                                        </Autocomplete>
                                        <button className="backButton" style={{marginLeft:"2rem"}} onClick={()=>getRout(origin.current.value, park.locationCoor)}>Go</button>
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
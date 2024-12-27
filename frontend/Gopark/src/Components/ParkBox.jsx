import { Autocomplete } from "@react-google-maps/api";
import { useEffect, useRef, useState } from 'react';
import '../style.css';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";

const statusColorMaper = {
    'OCCUPOID': 'red',
    'AVAILABLE': '#44ea3b',
    'NULL': 'white'
};

const spotTypeMaper = {
    'REGULAR': 0,
    'DISABLED': 1,
    'EVCHARGING': 2
}

const ParkBox = ({ lot, person, getRout, loadSpots }) =>{
    const [firstHalfSpots, setFirstHalfSpots] = useState([]);
    const [secondHalfSpots, setSecondHalfSpots] = useState([]);
    const [parkSpots, setParkSpots] = useState([{number: 1, RealTimeState: 'OCCUPOID'}, {number: 3, RealTimeState: 'AVAILABLE'}, {number: 4, RealTimeState: 'OCCUPOID'}, {number: 5, RealTimeState: 'OCCUPOID'}, {number: 6, RealTimeState: 'AVAILABLE'}]);
    const [isHoverd, setIsHoverd] = useState(false);
    const [hoverdObj, setHoverdObj] = useState(NaN);
    const [showOriginInput, setShowOriginInput] = useState(false);
    const [showReservationForm, setShowReservationForm] = useState(false);
    const [spotsReservations, setSpotsReservations] = useState([]);
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [fromDay, setFromDay] = useState('');
    const [toDay, setToDay] = useState('');
    const [type, setType] = useState('');
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
        await fetch(`http://localhost:8081/getLot/${lot.id}`)
        .then(response=>response.status==200 || response.status==201? (()=>{return response.json()})(): (()=>{throw Error("Error reserving spot")})())
        .then(spots=>{setParkSpots(()=>spots); loadSpots(()=>spots);})
        .catch(e=>console.error(e));
    }    

    const getSpotsReservations = async()=>{
        await fetch(`http://localhost:8081/users/getActiveReservationByLot?parkID=${lot.id}`)
        .then(response=>response.status==200 || response.status==201?(()=>{return response.json()})(): (()=>{throw Error("Error fetching reservations")})())
        .then(reservationsData=>{
            setSpotsReservations(reservationsData);
        })
        .catch(e=>console.error(e));
    }

    const getSpotByNumber = (number)=>{
        for (spot in parkSpots){
            if (spot.number == number) return spot
        }
    }

    const getSpotsByType = (spotType)=>{
        let buffer = [];
        for (spot in parkSpots){
            if (spot.type == spotType) buffer.add(spot);
        }
        return buffer;
    }
    const reserveSpot = async(e)=>{
        e.preventDefault();
        getSpotsReservations();
        const availableSpot = null;
        let spotsByGivenType = getSpotsByType(type);

        for (let spot in spotsByGivenType){
            for (let reservation in spotsReservations){
                if (spot.number == reservation.spotNumber 
                    && ((fromDay < reservation.startTime && toDay <= reservation.startTime)
                    ||(fromDay >= reservation.endTime && toDay > reservation.endTime)) 
                    && ((fromTime < reservation.startTime && toTime <= reservation.startTime)
                    ||(fromTime >= reservation.endTime && toTime > reservation.endTime))){
                    availableSpot = spot;
                    break;
                }
            }
            if (availableSpot) break
        }
        if (availableSpot){
            const confermation = window.confirm(`You are now about to reserve spot number: ${availableSpot.number} in ${lot.name} lot\nPress confirm to conferm your reservation.`);
            if (confermation){
                const regester = await fetch(`http://localhost:8081/api/v1/users/reserveSpot?parkID=${lot.id}&spotNumber=${availableSpot.number}`, {
                    method: 'PUT',
                })
                .then(response=>response.status==200 || response.status==201? notifySuccessReserving(): (()=>{throw Error("Error reserving spot")})())
                .catch(e=>{console.log(e); notifyFaildReserving()});
                
            }
        }
        else{
            alert(`Sorry this spot is ${spot.RealTimeState}`);
        }
    }
    return(
        <div className="parkContainerStyle">
            <center style={{fontSize: "2rem"}}>{lot.name} lot</center>
            {/* <p>Location: {lot.locationString}</p> */}
            <p>Capacity: {lot.totalSpots} spots</p>
            <p>Type: {lot.type}</p>
            <p>Pricing structure: {lot.currentPrice} LE</p>
            <div className='parkingLots'>
                <div className='leftLots'>
                    {firstHalfSpots.map((l, i)=>(
                        <div className='lot' key={i} style={{color:"white" ,border:`2px solid ${statusColorMaper[l.RealTimeState]}`, backgroundColor:isHoverd && hoverdObj==i ?statusColorMaper[l.RealTimeState]:'transparent'}} onMouseEnter={(e)=>{setIsHoverd(()=>true); setHoverdObj(e._targetInst.key);}} onMouseLeave={()=>setIsHoverd(()=>false)}>
                            <p>{l.number}</p>
                        </div>)
                    )}
                </div>
                <div className='rightLots'>
                    {secondHalfSpots.map((l, i)=>(
                        <div className='lot' key={i+firstHalfSpots.length} style={{color: "white", border:`2px solid ${statusColorMaper[l.RealTimeState]}`, backgroundColor:isHoverd && hoverdObj==i+firstHalfSpots.length ?statusColorMaper[l.RealTimeState]:'transparent'}} onMouseEnter={(e)=>{setIsHoverd(()=>true); setHoverdObj(e._targetInst.key);}} onMouseLeave={()=>setIsHoverd(()=>false)}>
                            <p>{l.number}</p>
                        </div>)
                    )}
                </div>
            </div>
            {person == "user" && <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <button className='backButton' style={{marginRight:"1rem"}} onClick={()=>{setShowOriginInput((prev)=>!prev); setTimeout(()=>{handleScroll()}, 100)}}>Get directions</button>
                <button className='backButton' onClick={()=>{setShowReservationForm((prev)=>!prev); setTimeout(()=>{handleScroll()}, 100)}}>Reserve</button>
                </div>}
            {showOriginInput && <center style={{display:"flex", justifyContent:"center"}}><Autocomplete options={{componentRestrictions: { country: "br" }}}>
                                            <input type="text" placeholder="Origin"  ref={origin}/>
                                        </Autocomplete>
                                        <button className="backButton" style={{marginLeft:"2rem"}} onClick={()=>getRout(origin.current.value, lot.location)}>Go</button>
                                        </center>}
            {showReservationForm && <center style={{display:"flex", justifyContent:"center"}}>
                                        <form onSubmit={reserveSpot} style={{display:"grid", border: "0.5px solid gray", padding:"1rem", borderRadius:"20px"}}>
                                            <label htmlFor="fromTime" style={{textAlign:"left"}}>From (time)</label>
                                            <input type="time" name="fromTime" placeholder="From Time" value={fromTime} onChange={(e)=>setFromTime(e.target.value)}/>
                                            <label htmlFor="fromDay" style={{textAlign:"left"}}>From (date)</label>
                                            <input type="date" name="fromDay" placeholder="from Day" style={{width:"fit-content"}} value={fromDay} onChange={(e)=>setFromDay(e.target.value)}/>
                                            <label htmlFor="toTime" style={{textAlign:"left"}}>To (time)</label>
                                            <input type="time" name="toTime" placeholder="ToTime" value={toTime} onChange={(e)=>setToTime(e.target.value)}/>
                                            <label htmlFor="toDay" style={{textAlign:"left"}}>Day (date)</label>
                                            <input type="date" name="toDay" placeholder="to Day" style={{width:"fit-content"}} value={toDay} onChange={(e)=>setToDay(e.target.value)}/>
                                            <label htmlFor="type" style={{textAlign:"left"}}>Spot Type</label>
                                            <select placeholder="Type" name="type" value={type} onChange={(e)=>setType(e.target.value)}>
                                                <option value="REGULAR">REGULAR</option>    
                                                <option value="DISABLED">DISABLED</option>    
                                                <option value="EVCHARGING">EVCHARGING</option>    
                                            </select>

                                        <button type="submit" className="backButton" style={{marginLeft:"0.5rem"}}>Search for spot</button>
                                        </form>
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
import { Autocomplete } from "@react-google-maps/api";
import { useEffect, useRef, useState } from 'react';
import '../style.css';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";
import RegularIcon from "../assets/Regular.png";
import DisabledIcon from "../assets/Disabled.png";
import EVChargingIcon from "../assets/EVCharging.png";

const statusColorMaper = {
    'occupied': 'red',
    'available': '#44ea3b',
    'reserved': 'pink',
    'null': 'white'
};

const spotTypeMaper = {
    'REGULAR': 0,
    'DISABLED': 1,
    'EVCHARGING': 2
}

const ParkBox = ({ lot, person, user, getRout, loadSpots }) =>{
    const [firstHalfSpots, setFirstHalfSpots] = useState([]);
    const [secondHalfSpots, setSecondHalfSpots] = useState([]);
    // const [parkSpots, setParkSpots] = useState([{number: 1, realTimeState: 'OCCUPOID', type: 'REGULAR'}]);
    const [parkSpots, setParkSpots] = useState([]);
    const [isHoverd, setIsHoverd] = useState(false);
    const [hoverdObj, setHoverdObj] = useState(NaN);
    const [showOriginInput, setShowOriginInput] = useState(false);
    const [showReservationForm, setShowReservationForm] = useState(false);
    const [spotsReservations, setSpotsReservations] = useState([{}]);
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [fromDay, setFromDay] = useState('');
    const [toDay, setToDay] = useState('');
    const [type, setType] = useState('regular');
    const [cost, setCost] = useState('');
    const origin = useRef();
    const targetRef = useRef(null);

    // useEffect refreshes the spots every second
    useEffect(()=>{
        let interval = setInterval(()=>{
            if (person == "user") getSpotsReservations();
            getSpots();
        }, 1000);

        setFirstHalfSpots(()=>parkSpots.slice(0, Math.ceil(parkSpots.length / 2)));
        setSecondHalfSpots(()=>parkSpots.slice(Math.ceil(parkSpots.length / 2), parkSpots.length));

        return ()=>clearInterval(interval);
    }, [parkSpots]);

    const notifySuccessReserving = (number) => {
        toast.success(`Spot reserved succeffully\nYour spote number is ${number}`);
    };

    const notifyFaildReserving = (message) => {
        toast.error(message);
    };

    const handleScroll = () => {
        if (targetRef.current) {
          targetRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    const getSpots = async()=>{
        await fetch(`http://localhost:8081/api/v1/getSpots/${lot.id}`)
        .then(response=>response.status==200 || response.status==201? (()=>{return response.json()})(): (()=>{throw Error("Error fetching spots")})())
        .then(spots=>{setParkSpots(()=>spots); loadSpots(()=>spots);})
        .catch(e=>console.error(e));
    }    

    const getSpotsReservations = async()=>{
        await fetch(`http://localhost:8081/users/getActiveReservationByLot?parkID=${lot.id}`)
        .then(response=>response.status==200 || response.status==201?(()=>{return response.json()})(): (()=>{throw Error("Error fetching reservations")})())
        .then(reservationsData=>{
            setSpotsReservations(()=>reservationsData);
        })
        .catch(e=>console.error(e));
    }

    const getSpotByNumber = (number)=>{
        for (let spot in parkSpots){
            if (spot.number == number) return spot
        }
    }

    const getSpotsByType = (spotType)=>{
        let buffer = [];
        for (let i=0; i<parkSpots.length; i++){
            if (parkSpots[i].type == spotType) buffer.push(parkSpots[i]);
        }
        return buffer;
    }

    const getCost = async(startTime, endTime, lotId)=>{
        console.log({
            startTime,
            endTime,
            lotId
        });
        await fetch(`http://localhost:8081/users/getCost`, {
            method:"GET", 
            headers:{
                startTime,
                endTime,
                lotId
            }
        })
        .then(response=>response.status==200||response.status==201?(()=>{return response.text()})():(()=>{throw Error("Error getting cost")})())
        .then(costData=>{setCost(costData); console.log("cost: ", costData)})
        .catch(e=>console.error(e));
    }

    const reserveSpot = async(e)=>{
        e.preventDefault();
        // getSpotsReservations();
        const startTimeAsTimeStamp = new Date(`${fromDay}T${fromTime}:00`).getTime();
        const endTimeAsTimeStamp = new Date(`${toDay}T${toTime}:00`).getTime();
        getCost(new Date(`${fromDay}T${fromTime}:00`).toISOString(), new Date(`${toDay}T${toTime}:00`).toISOString(), lot.id);
        let availableSpot = null;
        let spotsByGivenType = getSpotsByType(type);
        let violatedFlag = false;
        for (let i=0; i<spotsByGivenType.length; i++){
            violatedFlag = false;
            if (spotsReservations.length == 0) availableSpot = spotsByGivenType[i];
            for (let j=0; j<spotsReservations.length; j++){
                if (spotsByGivenType[i].number == spotsReservations[j].spotNumber 
                    && ((startTimeAsTimeStamp < new Date(spotsReservations[j].startTime).getTime() && endTimeAsTimeStamp <= new Date(spotsReservations[j].startTime).getTime())
                    ||(startTimeAsTimeStamp >= new Date(spotsReservations[j].endTime).getTime() && endTimeAsTimeStamp > new Date(spotsReservations[j].endTime).getTime()))){
                    availableSpot = spotsByGivenType[i];
                }
                else if (spotsByGivenType[i].number != spotsReservations[j].spotNumber){
                    availableSpot = spotsByGivenType[i];
                }
                else{
                    violatedFlag = true;
                    availableSpot = null;
                    break;
                }
            }
            if (!violatedFlag) break;
        }
        if (!violatedFlag){
            const confermation = window.confirm(`You are now about to reserve spot number: ${availableSpot.number} in ${lot.name} lot\nYour total cost will be ${cost}\nPress confirm to confirm your reservation.`);
            if (confermation){
                const regester = await fetch(`http://localhost:8081/users/reserveSpot`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:JSON.stringify({
                        'driverId': user.id,
                        'lotId': lot.id,
                        'spotNumber': availableSpot.number,
                        'startTime': startTimeAsTimeStamp,
                        'endTime': endTimeAsTimeStamp,
                        'cost': lot.currentPrice
                    })
                })
                .then(response=>response.status==200 || response.status==201? notifySuccessReserving(availableSpot.number): (()=>{throw Error("Error reserving spot")})())
                .catch(e=>{console.log(e); notifyFaildReserving("Error happend while reserving")});
                
            }
        }
        else{
            notifyFaildReserving(`Sorry no spot is availavle`);
        }
    }
    return(
        <div className="parkContainerStyle">
            <center style={{fontSize: "2rem"}}>{lot.name} lot</center>
            <p>Capacity: {lot.totalSpots} spots</p>
            <p>Base price: {lot.basePrice} LE</p>
            <p>Current price: {lot.currentPrice} LE</p>
            <div className='parkingLots'>
                <div className='leftLots'>
                    {firstHalfSpots.map((l, i)=>(
                        <div className='lot' key={i} style={{color:"white" ,border:`2px solid ${statusColorMaper[l.realTimeState]}`, backgroundColor:isHoverd && hoverdObj==i ?statusColorMaper[l.realTimeState]:'#cccccc8a'}} onMouseEnter={(e)=>{setIsHoverd(()=>true); setHoverdObj(e._targetInst.key);}} onMouseLeave={()=>setIsHoverd(()=>false)}>
                            <p>{l.number}</p>
                            <img src={(()=>{
                                if (l.type == 'regular') return RegularIcon;
                                else if (l.type == 'disabled') return DisabledIcon;
                                else return EVChargingIcon;
                            })()} style={{marginLeft:"0.5rem"}}/>
                        </div>)
                    )}
                </div>
                <div className='rightLots'>
                    {secondHalfSpots.map((l, i)=>(
                        <div className='lot' key={i+firstHalfSpots.length} style={{color: "white", border:`2px solid ${statusColorMaper[l.realTimeState]}`, backgroundColor:isHoverd && hoverdObj==i+firstHalfSpots.length ?statusColorMaper[l.realTimeState]:'#cccccc8a'}} onMouseEnter={(e)=>{setIsHoverd(()=>true); setHoverdObj(e._targetInst.key);}} onMouseLeave={()=>setIsHoverd(()=>false)}>
                            <img src={(()=>{
                                if (l.type == 'regular') return RegularIcon;
                                else if (l.type == 'disabled') return DisabledIcon;
                                else return EVChargingIcon;
                            })()} style={{marginRight:"0.5rem"}}/>
                            <p>{l.number}</p>
                            
                        </div>)
                    )}
                </div>
            </div>
            {person == "user" && <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <button className='backButton' style={{marginRight:"1rem"}} onClick={()=>{setShowOriginInput((prev)=>!prev); setTimeout(()=>{handleScroll()}, 100)}}>Get directions</button>
                <button className='backButton' onClick={()=>{setShowReservationForm((prev)=>!prev); setTimeout(()=>{handleScroll()}, 100)}}>Reserve</button>
                </div>}
            {showOriginInput && <center style={{display:"flex", justifyContent:"center"}}><Autocomplete>
                                            <input type="text" placeholder="Origin"  ref={origin}/>
                                        </Autocomplete>
                                        <button className="backButton" style={{marginLeft:"2rem"}} onClick={()=>getRout(origin.current.value, {lat: parseFloat(lot.latitude), lng: parseFloat(lot.longitude)})}>Go</button>
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
                                                <option value="regular">REGULAR</option>    
                                                <option value="disabled">DISABLED</option>    
                                                <option value="EV charging">EVCHARGING</option>    
                                            </select>

                                        <button type="submit" className="backButton" style={{marginLeft:"0.5rem"}}>Search for spot</button>
                                        </form>
                                        </center>}


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
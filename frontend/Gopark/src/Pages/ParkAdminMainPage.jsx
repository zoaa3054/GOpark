import { useEffect, useState } from "react";
import ParkBox from "../Components/ParkBox";

const ParkAdminMainPage = () =>{
    const [count, setCount] = useState(0);
    const [park, setPark] = useState({locationCoor: {lat: NaN, lng: NaN}, locationString: null, name: null, capacity: NaN, type: null, pricingStruct: null, lots: [{number: NaN, status: null}] });
    const parkData = {locationCoor: {lat: -3.745, lng: -38.523}, locationString: "Elsoyuf", name: "Layla", capacity: 4, type: 'RETULAR', 
    pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
    lots: [{number: 1, status: 'OCCUPOID'}, {number: 2, status: 'RESERVED'}, {number: 3, status: 'AVAILABLE'}, {number: 4, status: 'OCCUPOID'}]};
    useEffect(()=>{
        // fetchPark();
        setPark(parkData);
        setTimeout(()=>{
            setCount(prev=>prev+1);
        },1000)
        console.log("udated after 1 sec");
    },[count]);
    
    const fetchPark = async()=>{
        const fetchParkData = await fetch(`http://localhost:8081/`, {
            method: "GET"
        })
        .then(response=>response.status == 200 || response.status==201? (()=>{return response.json()})(): (()=>{throw Error("Error fetching park")})())
        .then(data=>{
            setPark(()=>data);
        })
        .catch(e=>console.error(e));
    }

    return(
    <>
        <ParkBox person="admin" park={park}/>
    </>
    );
};
export default ParkAdminMainPage;
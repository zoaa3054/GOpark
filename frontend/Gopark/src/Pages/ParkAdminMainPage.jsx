import { useEffect, useState } from "react";
import ParkBox from "../Components/ParkBox";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
const ParkAdminMainPage = () =>{
    const [loadedLot, setLoadedLot] = useState({id: 5, location: {lat: -7.745, lng: -38.523},  name: "Safaa", totalSpots: 4,
        currentPrice: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        });
    const [spots, setSpots] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formVariables, setFormVariables] = useState({});
    
    useEffect(()=>{
        loadPark();
        setFormVariables({name: loadedLot.name, totalSpots: loadedLot.totalSpots, type: loadedLot.type, pricingStruct: loadedLot.pricingStruct});
    }, []);
   
    // loading parks API
    const loadPark = async ()=>{
        await fetch(`http://localhost:8081/getLot/${1}`)
        .then(respond=>respond.status==200 || respond.status==201? (()=>{return respond.json()})(): (()=>{throw Error("Failed loading parks")})())
        .then((parksData)=>{
            setLoadedLot(parksData);
        })
        .catch(e=>console.log(e));
    }

    const notifySuccessEditing = () => {
        toast.success(`Changes saved successfully`);
    };

    const notifyFaildEditing = () => {
        toast.error(`Faild to save changes`);
    };

    const editLot = async()=>{
        await fetch(`http://localhost:8081/lot/admins/editLot?ID=${loadedLot.ID}`,{
            method:"PUT",
            body:JSON.stringify({
                ID: loadedLot.ID,
                locatoinCoor: loadedLot.locationCoor,
                name: formVariables.name,
                capacity: formVariables.capacity,
                type: formVariables.type,
                pricingStruct: formVariables.pricingStruct
            })
        })
        .then(response=>response.status==200 || response.status==201? (()=>{return response.json()})(): (()=>{throw Error("Error editing lot")})())
        .then(lotData=>{setLoadedLot(lotData); setIsEditing(false); notifySuccessEditing();})
        .catch(e=>{console.error(e); notifyFaildEditing();});
    }

    const reserveSpot = async(spotNumber)=>{
        await fetch(`http://localhost:8081/api/v1/users/reserveSpot?parkID=${loadedLot.ID}&spotNumber=${spotNumber}`,{
            method:"PUT"
        })
        .then(response=>response.status==200||response.status==201?(()=>{return true})():(()=>{throw Error(`Error resorving spot ${spotNumber}`)})())
        .catch(e=>console.error(e));
    }

    const generateReport = async()=>{

    }

    const reserveAll = ()=>{
        if (spots.length == 0) return;
        for(let spot in spots){
            if (spot.status == "AVAILABLE")
                reserveSpot(spot.number);
        }
    }

    const handleChange = (event)=>{
        const {name, value} = event.target;
        setFormVariables({...formVariables, [name]: value});
    }

    const handleCancel = ()=>{
        setFormVariables({name: loadedLot.name, capacity: loadedLot.capacity, type: loadedLot.type, pricingStruct: loadedLot.pricingStruct});
        setIsEditing(false);
    }
    return(
    <>
        {!isEditing &&<>
        <ParkBox lot={loadedLot} person="admin" loadSpots={setSpots}/>
        <div style={{display:"flex", justifyContent:"center"}}>
            <button style={{marginRight:"1rem"}} className="backButton" onClick={()=>setIsEditing(true)}>Edit</button>
            <button className="backButton" onClick={reserveAll}>Reserve All</button>
            <button className="backButton" onClick={generateReport}>Generate Report</button>
        </div></>
        }
        {isEditing && <div style={{margin:"1rem"}}>
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" onChange={handleChange} value={formVariables.name} placeholder="Name"/>
            <label htmlFor="capacity">Capacity:</label>
            <input type="number" name="capacity" onChange={handleChange} value={formVariables.capacity} placeholder="Capacity"/>
            <label htmlFor="type">Type:</label>
            <input type="text" name="type" onChange={handleChange} value={formVariables.type} placeholder="Type"/>
            <label htmlFor="pricingStruct">Pricing Structure:</label>
            <input type="text" name="pricingStruct" onChange={handleChange} value={formVariables.pricingStruct} placeholder="Pricing Structure"/>
            <div style={{display:"flex", justifyContent:"center"}}>
                <button style={{marginRight:"1rem"}} onClick={editLot} className="backButton">Save</button>
                <button onClick={handleCancel} className="backButton">Cancel</button>
            </div>
        </div>}
    </>
    );
};
export default ParkAdminMainPage;
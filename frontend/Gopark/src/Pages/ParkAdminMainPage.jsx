import { useEffect, useState } from "react";
import ParkBox from "../Components/ParkBox";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ParkAdminMainPage = () =>{
    const location = useLocation();
    const { admin } = location.state || {};
    // const [loadedLot, setLoadedLot] = useState({id: 5, location: {lat: -7.745, lng: -38.523},  name: "Safaa", totalSpots: 4, currentPrice: 30,});
    const [loadedLot, setLoadedLot] = useState({});
    const [spots, setSpots] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formVariables, setFormVariables] = useState({});
    const [parksLoaded, setParksLoaded] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        loadPark();
        setFormVariables({name: loadedLot.name, totalSpots: loadedLot.totalSpots, type: loadedLot.type, pricingStruct: loadedLot.pricingStruct});
    }, []);
   

    // loading parks API
    const loadPark = async ()=>{
        await fetch(`http://localhost:8081/api/v1/users/getLots`)
        .then(respond=>respond.status==200 || respond.status==201? (()=>{return respond.json()})(): (()=>{throw Error("Failed loading parks")})())
        .then((parksData)=>{
            console.log(parksData, admin.id);
            if (parksData.length != 0){
                for (let i=0; i<parksData.length; i++){
                    if (admin.id == parksData[i].managerId)
                        setLoadedLot(parksData[i]);
                }
            }
        })
        .catch(e=>console.log(e));
      }


    const notifySuccessEditing = () => {
        toast.success(`Changes saved successfully`);
    };

    const notifyFaildEditing = () => {
        toast.error(`Faild to save changes`);
    };

    const notifyFaild = (message) =>{
        toast.error(message);
    }

    const notifySucess = (message) =>{
        toast.success(message);
    }

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
        console.log(typeof(admin), admin.id);
        await fetch(`http://localhost:8081/manager/report/${admin.id}`)
        .then(response=>{if(response.status == 200 || response.status == 201) notifySucess("Report generated succeffully")})
        .catch(e=>{console.error(e); notifyFaild("Couldn't generate report");})
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
            <button style={{marginRight:"1rem"}} className="backButton" onClick={()=>navigate('/')} >logout</button>
            {/* <button className="backButton" style={{marginRight:"1rem"}} onClick={reserveAll}>Reserve All</button>
            <button className="backButton" onClick={generateReport}>Generate Report</button> */}
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
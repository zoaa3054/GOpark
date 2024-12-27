import { useEffect } from "react";
import { useState } from "react";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import ParkBox from "../Components/ParkBox";
import '../style.css'
import binIcon from '../assets/bin.png';
import addAdminIcon from '../assets/addAdmin.png';
import addLotIcon from '../assets/addLot.png';
import logoutIcon from '../assets/logout.png';
import { toast } from "react-toastify";
import AddParkAdminBox from '../Components/AddParkAdminBox';
import { Buffer } from 'buffer';

const SystemAdminMainPage = () =>{
    // const [parksLoaded, setParksLoaded] = useState([{id: 0, location: {lat: -3.745, lng: -38.523}, name: "Layla", totalSpots: 4,
    //     currentPrice: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
    //     },
    //     {id: 1, location: {lat: -4.939050898951398, lng: -37.97368359375001},  name: "Klara", totalSpots: 4, 
    //     currentPrice: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
    //     },
    //     {id: 2, location: {lat: -3.6792203336730043, lng: -40.35222363281251},  name: "Samia", totalSpots: 4,
    //     currentPrice: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
    //     },
    //     {id: 3, location: {lat: -5, lng: -38.523},  name: "Walaa", totalSpots: 4,
    //     currentPrice: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
    //     },
    //     {id: 4, location: {lat: -6.745, lng: -38.523},  name: "Hanaa", totalSpots: 4,
    //     currentPrice: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
    //     },
    //     {id: 5, location: {lat: -7.745, lng: -38.523},  name: "Safaa", totalSpots: 4,
    //     currentPrice: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
    //     }]);
    const [parksLoaded, setParksLoaded] = useState([]);
    const [formVariables, setFormVariables] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [selectedLot, setSelectedLot] = useState({});
    const [spots, setSpots] = useState([]);
    const [showLotSwitchAnimation, setShowLotSwitchAnimation] = useState(false);
    const [showLotSwitch, setShowLotSwitch] = useState(false);
    const [showAddAdminBoxSwitch, setShowAddAdminBoxSwitch] = useState(false);
    const [showAddAdminBoxSwitchAnimation, setShowAddAdminBoxSwitchAnimation] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        loadParks();
    }, []);


    // loading parks API
    const loadParks = async ()=>{
        await fetch(`http://localhost:8081/getLots`)
        .then(respond=>respond.status==200 || respond.status==201? (()=>{return respond.json()})(): (()=>{throw Error("Failed loading parks")})())
        .then((parksData)=>{
            setParksLoaded(parksData);
        })
        .catch(e=>console.log(e));
    }

    const notifySuccessDeleting=()=>{
        toast.success("Lot deleted succeffully");
    }

    const notifyFaildDeleting=()=>{
        toast.error("Faild to delete the lot");
    }

    const notifySuccessAdding=()=>{
        toast.success("Lot added succeffully");
    }

    const notifyFaildAdding=()=>{
        toast.error("Faild to add the lot");
    }
    const addLot = async()=>{
        console.log({ID:"", ...formVariables});
        await fetch(`http://localhost:8081/api/v1/system/admin/addLot`, {
            method:"POST",
            body:JSON.stringify({
                ID: "", 
                ...formVariables
            })
        })
        .then(response=>response.status==200 || response.status==201? (()=>{return response.json()})(): (()=>{throw Error("Error adding a lot")})())
        .then(newLots=>{setLoadedLots(newLots); notifySuccessAdding(); setIsEditing(false);})
        .catch(e=>{console.error(e); notifyFaildAdding()});
    }

    const deleteLot = async(lot)=>{
        const confirm = window.confirm(`Are you sure you wish to delete ${lot.name} lot?`);
        if (!confirm) return;
        await fetch(`http://localhost:8081/api/v1/system/admin/deleteLot?ID=${lot}`, {
            method:"DELETE"
        })
        .then(response=>response.status==200 || response.status==201? (()=>{return response.json()})(): (()=>{throw Error("Error adding a lot")})())
        .then(newLots=>{setLoadedLots(newLots); notifySuccessDeleting();})
        .catch(e=>{console.error(e); notifyFaildDeleting();});
    }

    const generateReport = async(lot)=>{

    }
    const hideLot = () =>{
        setShowLotSwitchAnimation(false); setTimeout(()=>{setShowLotSwitch(false)}, 500);
    }

    const showLot = (lot) =>{  
        setShowLotSwitchAnimation(()=>true);      
        setSelectedLot(()=>lot);
        setShowLotSwitch(()=>true);
    }

    const hideAddAdminBox = () =>{
        setShowAddAdminBoxSwitchAnimation(false); setTimeout(()=>{setShowAddAdminBoxSwitch(false)}, 500);
    }

    const showAddAdminBox = () =>{  
        setShowAddAdminBoxSwitchAnimation(()=>true);      
        setShowAddAdminBoxSwitch(()=>true);
    }

    const handleChange = (event) =>{
        const { name, value } = event.target;
        setFormVariables({...formVariables, [name]: value});
    }

    const handleCancel = ()=>{
        setFormVariables({});
        setIsEditing(false);
    }

    return(
        <>
            <div className="navigationBar">
                <div onClick={()=>setIsEditing(true)}>
                    <img src={addLotIcon} className="navBarButton" style={{width:"3rem", height:"3rem", cursor:"pointer"}} title="Add Lot"/>
                </div>
                <div style={{width: "75%", textAlign: "center", color: "#ADEFD1FF"}}><h1>GOpark System Admin</h1></div>
                <div onClick={showAddAdminBox}>
                    <img src={addAdminIcon} className="navBarButton" style={{width:"3.5rem", height:"3.5rem", cursor:"pointer"}} title="Add Admin"/>
                </div>
                <div onClick={()=>navigate('/')}>
                    <img src={logoutIcon} className="navBarButton" style={{width:"3rem", height:"3rem", cursor:"pointer"}} title="Add Admin"/>
                </div>
            </div>
            {!isEditing && parksLoaded.map((lot, i)=>(
                <div  key={i} className="parkCard">
                    <div style={{width:"100%"}} onClick={()=>showLot(lot)}>
                        <p>{lot.name}</p>
                        <p>{lot.type}</p>
                        <p>{lot.capacity}</p>
                    </div>
                    <button onClick={()=>deleteLot(lot)} className="backButton" >
                        <img src={binIcon} alt="binIcon" title="Delete Lot"/>
                    </button>
                </div>
            ))}
            {isEditing && <div style={{margin:"1rem"}}>
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" onChange={handleChange} value={formVariables.name} placeholder="Name"/>
            <label htmlFor="locationCoor">Location Coordinates (lat, lng):</label>
            <input type="text" name="locationCoor" onChange={handleChange} value={formVariables.locationCoor} placeholder="location Coordinates"/>
            <label htmlFor="capacity">Capacity:</label>
            <input type="number" name="capacity" onChange={handleChange} value={formVariables.capacity} placeholder="Capacity"/>
            <label htmlFor="type">Type:</label>
            <input type="text" name="type" onChange={handleChange} value={formVariables.type} placeholder="Type"/>
            <label htmlFor="pricingStruct">Pricing Structure:</label>
            <input type="text" name="pricingStruct" onChange={handleChange} value={formVariables.pricingStruct} placeholder="Pricing Structure"/>
            <label htmlFor="adminUserName">Lot Admin Username:</label>
            <input type="text" name="adminUserName" onChange={handleChange} value={formVariables.adminUserName} placeholder="Admin Username"/>
            <label htmlFor="adminPassword">Lot Admin Password:</label>
            <input type="text" name="adminPassword" onChange={handleChange} value={formVariables.adminPassword} placeholder="Admin Password"/>
            <div style={{display:"flex", justifyContent:"center"}}>
                <button style={{marginRight:"1rem"}} onClick={addLot} className="backButton">Save</button>
                <button onClick={handleCancel} className="backButton">Cancel</button>
            </div>
        </div>}
            <Modal 
                isOpen={showLotSwitch} 
                onRequestClose={hideLot}
                style={{content:{backgroundColor:"#00203FFF", animation: `${showLotSwitchAnimation?"fade-in":"fade-out"} 0.5s ease`}, overlay:{backgroundColor:"rgba(173, 239, 209, 0.5)"}}}
                >
                <button className="backButton" onClick={hideLot}>X</button>
                <ParkBox lot={selectedLot} person="admin" loadSpots={setSpots}/>
                <center><button className="backButton" onClick={()=>generateReport(selectedLot)}>Generate Report</button></center>

            </Modal>
            <Modal 
                isOpen={showAddAdminBoxSwitch} 
                onRequestClose={hideAddAdminBox}
                style={{content:{backgroundColor:"transparent", borderColor:"transparent", animation: `${showAddAdminBoxSwitchAnimation?"fade-in":"fade-out"} 0.5s ease`}, overlay:{backgroundColor:"rgba(173, 239, 209, 0.5)"}}}
                >
                <button className="closeButton" onClick={hideAddAdminBox}>X</button>
                <div style={{width:"100%", justifyContent:"center", display:"flex", alignItems:"center"}}><AddParkAdminBox hideAddAdminBox={hideAddAdminBox}/></div>
            </Modal>
        </>
    );
};
export default SystemAdminMainPage;
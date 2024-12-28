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
import downloadReportIcon from '../assets/downloadReport.png';
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
    const [newParkingLotManagerEmail, setNewParkingLotManagerEmail] = useState('');
    const [newParkingLotManagerPassword, setNewParkingLotManagerPassword] = useState('');
    const [newNumberOfRequlerSpots, setNewNumberOfRequlerSpots] = useState(0);
    const [newNumberOfDisapledSpots, setNewNumberOfDisapledSpots] = useState(0);
    const [newNumberOfEVChargingSpots, setNewNumberOfEVChargingSpots] = useState(0);
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
        await fetch(`http://localhost:8081/api/v1/users/getLots`)
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
        toast.error("Faild to add the lot: Check username/password of the given park admin that it exists");
    }

    const notifyFailiar=(message)=>{
        toast.error(message);
    }

    const notifySuccess=(message)=>{
        toast.success(message);
    }

    const addLot = async()=>{
        
        console.log({...formVariables,
            ['latitude']: parseFloat(formVariables.latitude),
            ['longitude']: parseFloat(formVariables.longitude),
            ['basePrice']: parseFloat(formVariables.basePrice),
            'ManagerEmail': newParkingLotManagerEmail,
            'ManagerPassword': newParkingLotManagerPassword,
            'numberOfRequlerSpots': parseInt(newNumberOfRequlerSpots),
            'numberOfDisapledSpots': parseInt(newNumberOfDisapledSpots),
            'numberOfEVChargingSpots': parseInt(newNumberOfEVChargingSpots)
        });
        await fetch(`http://localhost:8081/api/v1/system/admin/addLot`, {
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                'ManagerEmail': newParkingLotManagerEmail,
                'ManagerPassword': newParkingLotManagerPassword,
                'numberOfRequlerSpots': parseInt(newNumberOfRequlerSpots),
                'numberOfDisapledSpots': parseInt(newNumberOfDisapledSpots),
                'numberOfEVChargingSpots': parseInt(newNumberOfEVChargingSpots)
            },
            body:JSON.stringify({
                ...formVariables, 
                ['latitude']: parseFloat(formVariables.latitude),
                ['longitude']: parseFloat(formVariables.longitude),
                ['basePrice']: parseFloat(formVariables.basePrice),
                'totalSpots': parseInt(newNumberOfRequlerSpots)+parseInt(newNumberOfDisapledSpots)+parseInt(newNumberOfEVChargingSpots)
            })
        })
        .then(response=>response.status==200 || response.status==201? (()=>{return response.json()})(): (()=>{throw Error("Error adding a lot")})())
        .then(newLots=>{setParksLoaded(newLots); notifySuccessAdding(); setIsEditing(false);})
        .catch(e=>{console.error(e); notifyFaildAdding()});
    }

    const deleteLot = async(lot)=>{
        const confirm = window.confirm(`Are you sure you wish to delete ${lot.name} lot?`);
        if (!confirm) return;
        await fetch(`http://localhost:8081/api/v1/users/deleteLot/${lot.id}`, {
            method:"DELETE"
        })
        .then(response=>response.status==200 || response.status==201? (()=>{return response.json()})(): (()=>{throw Error("Error adding a lot")})())
        .then(newLots=>{setParksLoaded(newLots); notifySuccessDeleting();})
        .catch(e=>{console.error(e); notifyFaildDeleting();});
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

    const createReport = async()=>{
        await fetch(`http://localhost:8081/admin/report`)
        .then(response=>{if (response.status == 200 || response.status==201) notifySuccess("Report downloaded succeffully");})
        .catch(e=>{console.error(e); notifyFailiar("Couldn't create report");});
    }

    return(
        <>
            <div className="navigationBar">
                <div onClick={()=>setIsEditing(true)}>
                    <img src={addLotIcon} className="navBarButton" style={{width:"3rem", height:"3rem", cursor:"pointer"}} title="Add Lot"/>
                </div>
                <div onClick={createReport}>
                    <img src={downloadReportIcon} className="navBarButton" style={{width:"3rem", height:"3rem", cursor:"pointer"}} title="Download Report for all parks"/>
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
            <label htmlFor="latitude">Location Latitude:</label>
            <input type="text" name="latitude" onChange={handleChange} value={formVariables.locationLat} pattern="^-?\d+(\.\d+)?$" title="Enter a valid float number" placeholder="Location Latitude"/>
            <label htmlFor="longitude">Location Longtude:</label>
            <input type="text" name="longitude" onChange={handleChange} value={formVariables.locationLng} pattern="^-?\d+(\.\d+)?$" title="Enter a valid float number" placeholder="Location Longtude"/>
            <label htmlFor="numberOfRequlerSpots">Number of Regular Spots:</label>
            <input type="number" name="numberOfRequlerSpots" onChange={(e)=>setNewNumberOfRequlerSpots(e.target.value)} pattern="^[0-9]+$" title="Please enter a positive integer or zero" value={newNumberOfRequlerSpots} placeholder="Number of Regular Spots"/>
            <label htmlFor="numberOfDisapledSpots">Number of Spots for Disabled:</label>
            <input type="number" name="numberOfDisapledSpots" onChange={(e)=>setNewNumberOfDisapledSpots(e.target.value)} pattern="^[0-9]+$" title="Please enter a positive integer or zero" value={newNumberOfDisapledSpots} placeholder="Number of Spots for Disabled"/>
            <label htmlFor="numberOfEVChargingSpots">Number of EV charging supporting Spots:</label>
            <input type="number" name="numberOfEVChargingSpots" onChange={(e)=>setNewNumberOfEVChargingSpots(e.target.value)} pattern="^[0-9]+$" title="Please enter a positive integer or zero" value={newNumberOfEVChargingSpots} placeholder="Number of EV charging supporting Spots"/>
            <label htmlFor="basePrice">Base Price:</label>
            <input type="text" name="basePrice" onChange={handleChange} value={formVariables.pricingStruct} pattern="^\d*\.?\d+$" title="Please enter a positive number" placeholder="Base Price"/>
            <label htmlFor="adminEmail">Lot Admin Email:</label>
            <input type="email" name="adminEmail" onChange={(e)=>setNewParkingLotManagerEmail(e.target.value)} value={newParkingLotManagerEmail} placeholder="Admin Email"/>
            <label htmlFor="adminPassword">Lot Admin Password:</label>
            <input type="password" name="adminPassword" onChange={(e)=>setNewParkingLotManagerPassword(e.target.value)} value={newParkingLotManagerPassword} placeholder="Admin Password"/>
            <div style={{display:"flex", justifyContent:"center"}}>
                <button style={{marginRight:"1rem"}} onClick={addLot} className="backButton">Add</button>
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
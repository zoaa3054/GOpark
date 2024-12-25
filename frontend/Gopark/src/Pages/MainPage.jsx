import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
import {useState, useEffect, useRef} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import ParkBox from '../Components/ParkBox';
import profileIcon from '../assets/profile.png';
import Modal from 'react-modal';
const libraries = ['places'];
const MainPage = () => {
    const location = useLocation();
    // const { user } = location.state || {username: "Ibrahim", gender: "Male", email: "abc@example.com", phoneNumber: "01234567891", profilePhoto: ""};
    const user = {username: "Ibrahim", gender: "Male", email: "abc@example.com", phoneNumber: "01234567891", profilePhoto: ""};
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAIdfL3_H7BT6e2MNzGbMGM476QlijvZHs", // Replace with your API Key
        libraries
      });

    const [park, setPark] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(false);
    const [showParkSwitch, setShowParkSwitch] = useState(false);
    const [directions, setDirections] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');
    // const [parksLoaded, setParksLoaded] = useState(null);
    const [center, setCenter] = useState(null);
    const [destinationCoor, setDestinationCoor] = useState({lat:NaN, lng:NaN});
    const destination = useRef();
    const navigate = useNavigate();
    const [showParkSwitchAnimation, setShowParkSwitchAnimation] = useState(false);
   
    let parksLoaded = [
        {locationCoor: {lat: -3.745, lng: -38.523}, locationString: "Elsoyuf", name: "Layla", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        lots: [{number: 1, status: 'OCCUPOID'}, {number: 2, status: 'RESERVED'}, {number: 3, status: 'AVAILABLE'}, {number: 4, status: 'OCCUPOID'}]},
        {locationCoor: {lat: -4.939050898951398, lng: -37.97368359375001}, locationString: "Elsoyuf", name: "Klara", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        lots: [{number: 1, status: 'OCCUPOID'}, {number: 2, status: 'RESERVED'}, {number: 3, status: 'AVAILABLE'}, {number: 4, status: 'OCCUPOID'}]},
        {locationCoor: {lat: -3.6792203336730043, lng: -40.35222363281251}, locationString: "Elsoyuf", name: "Samia", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        lots: [{number: 1, status: 'OCCUPOID'}, {number: 2, status: 'RESERVED'}, {number: 3, status: 'AVAILABLE'}, {number: 4, status: 'OCCUPOID'}]},
        {locationCoor: {lat: -5, lng: -38.523}, locationString: "Elsoyuf", name: "Walaa", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        lots: [{number: 1, status: 'OCCUPOID'}, {number: 2, status: 'RESERVED'}, {number: 3, status: 'AVAILABLE'}, {number: 4, status: 'OCCUPOID'}]},
        {locationCoor: {lat: -6.745, lng: -38.523}, locationString: "Elsoyuf", name: "Hanaa", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        lots: [{number: 1, status: 'OCCUPOID'}, {number: 2, status: 'RESERVED'}, {number: 3, status: 'AVAILABLE'}, {number: 4, status: 'OCCUPOID'}]},
        {locationCoor: {lat: -7.745, lng: -38.523}, locationString: "Elsoyuf", name: "Safaa", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        lots: [{number: 1, status: 'OCCUPOID', price: 5}, {number: 2, status: 'RESERVED', price: 5}, {number: 3, status: 'AVAILABLE', price: 5}, {number: 4, status: 'OCCUPOID', price: 5}]}
    ];
    //   // loading parks API
    //   const loadParks = async ()=>{
    //     const parksLoader = await fetch(`http://localhost:8081/parks`, {
    //         method: 'GET',
    //     })
    //     .then(respond=>respond.status==200 || respond.status==201? (()=>{return respond.json()})(): (()=>{throw Error("Failed loading parks")})())
    //     .then((parksData)=>{
    //         setParksLoaded(parksData);
    //     })
    //     .catch(e=>console.log(e));
    //   }
    
    useEffect(() => {
      if (isLoaded) {
        setMarkerPosition(true); // Set marker position after map is loaded
      }

    //   const interval = setInterval(() => {
    //     loadParks(); // Update state every second
    //   }, 1000);
  
    //   // Cleanup the interval on component unmount
    //   return () => clearInterval(interval);



    if (center === null) setCenter(parksLoaded[0].locationCoor);
    }, [isLoaded]);
    

    const showPark = (p) =>{  
        setShowParkSwitchAnimation(()=>true);      
        setPark(()=>p);
        setShowParkSwitch(()=>true);
        setCenter(()=>p.locationCoor);
    }

    const getCoorOfPlace = async (placeName) => {
        const geocoder = new window.google.maps.Geocoder();
        const location = await geocoder.geocode({ address: placeName });
        return {lat: location.results[0].geometry.location.lat(), lng: location.results[0].geometry.location.lng()};
    }

    const getRout = async (origin, destination)=>{
        if(origin === '')
            return
        const destinationService = new google.maps.DirectionsService();
        const result = await destinationService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        });
        setDirections(result);
        setDistance(result.routes[0].legs[0].distance.text);
        setDuration(result.routes[0].legs[0].duration.text);
        hidePark();
    }

    // const go = async ()=>{
    //     if(origin.current.value === '' || destination.current.value === '')
    //         return
    //     const destinationService = new google.maps.DirectionsService();
    //     const result = await destinationService.route({
    //         origin: origin.current.value,
    //         destination: destination.current.value,
    //         travelMode: google.maps.TravelMode.DRIVING
    //     });
    //     setDirections(result);
    //     setDistance(result.routes[0].legs[0].distance.text);
    //     setDuration(result.routes[0].legs[0].duration.text);
    // }

    const visit = () =>{
        if (destination.current.value === '') return;
        getCoorOfPlace(destination.current.value).then(loc=>setCenter(()=>loc));
    }

    const clear = ()=>{
        setDirections(null);
        setDistance('');
        setDuration('');
    }

    const hidePark = () =>{
        setShowParkSwitchAnimation(false); setTimeout(()=>{setShowParkSwitch(false)}, 500);
    }

  if (!isLoaded) return <center style={{display:"flex", alignItems: "center", fontSize: "2rem"}}>Loading..</center>;

  return (
    <div className="mainPageContainer">
        <center className="navigationBox">
            <center className="routerBox">
                <Autocomplete
                options={{
                    componentRestrictions: { country: "br" }, // Restrict to United States
                  }}
                >
                    <input type="text" placeholder="Destination" style={{marginRight:"2rem"}} ref={destination}/>
                </Autocomplete>
                <button className="backButton" onClick={visit}>Go</button>
                {directions && <button className="backButton" style={{backgroundColor:"#0ca2bd"}} onClick={clear}>X</button>}
                <img
                src={profileIcon}
                alt="UserPhoto"
                className="profileIcon"
                onClick={()=>navigate('/profile', {state:{user: user}})}
                />
                {directions && <p style={{backgroundColor:"#ADEFD1FF", color:"#00203FFF", borderRadius:"20px", padding:"0.5rem"}}>Distance: {distance} | Duration: {duration}</p>}
            </center>
        </center>
    <GoogleMap
        mapContainerClassName='mapContainerStyle'
        center={center}
        zoom={10} >
        
        {markerPosition && <MarkerClusterer>
        {(clusterer) =>
            parksLoaded.map((p, i) => (
                <Marker 
                    key={i} 
                    position={p.locationCoor} 
                    clusterer={clusterer} 
                    label={{
                        text: `P${i}`,
                        color: "blue",
                        fontSize: "14px",
                        backgroundColor: "transparent"
                    }} 
                    onClick={()=>showPark(p)}
                />
            ))
        }
        </MarkerClusterer>}
        {directions && <DirectionsRenderer directions={directions}/>}
    </GoogleMap>
    <Modal 
    isOpen={showParkSwitch} 
    onRequestClose={hidePark} 
    style={{content:{backgroundColor:"#00203FFF", animation: `${showParkSwitchAnimation?"fade-in":"fade-out"} 0.5s ease`}, overlay:{backgroundColor:"rgba(173, 239, 209, 0.5)"}}}
    >
    <button className="backButton" onClick={hidePark}>X</button>
    <ParkBox park={park} person="user" getRout={getRout}/>

    </Modal>
    </div>

  );
};

export default MainPage;
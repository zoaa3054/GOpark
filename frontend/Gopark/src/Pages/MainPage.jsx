import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer, Autocomplete, DirectionsRenderer } from "@react-google-maps/api";
import {useState, useEffect, useRef} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import ParkBox from '../Components/ParkBox';
import profileIcon from '../assets/profile.png';
import Modal from 'react-modal';
const libraries = ['places'];
const MainPage = () => {
    const location = useLocation();
    const { user } = location.state || {'driverUserName': "",
                'emailAddress': "",
                'password': "",
                'phoneNumber': "",
                'carPlateNumber': ''};
    // const user = {username: "", email: "", phone: "", carID: "", visaCard: {cardNumber:"", cardHolder: "", expirationDate: "", CVV:""}};
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
    // const [parksLoaded, setParksLoaded] = useState([{ID: "", locationCoor: {lat: 0, lng:0}, name:"", capacity:"", type:"", pricingStruct:""}]);
    const [parksLoaded, setParksLoaded] = useState([{ID: 0, locationCoor: {lat: -3.745, lng: -38.523}, name: "Layla", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        },
        {ID: 1, locationCoor: {lat: -4.939050898951398, lng: -37.97368359375001},  name: "Klara", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        },
        {ID: 2, locationCoor: {lat: -3.6792203336730043, lng: -40.35222363281251},  name: "Samia", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        },
        {ID: 3, locationCoor: {lat: -5, lng: -38.523},  name: "Walaa", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        },
        {ID: 4, locationCoor: {lat: -6.745, lng: -38.523},  name: "Hanaa", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        },
        {ID: 5, locationCoor: {lat: -7.745, lng: -38.523},  name: "Safaa", capacity: 4, type: 'RETULAR', 
        pricingStruct: 'For all lots (per hour):\n12PM-3PM: 10LE\n3PM-9PM: 20LE\n9PM-11:59AM: 15LE\nMaximum Reservation time: 1 hr\nMaximum Occupacy time: 5 hr\n Any voilation worths 20 LE/hr',
        }]);
    const [center, setCenter] = useState(null);
    const destination = useRef();
    const navigate = useNavigate();
    const [showParkSwitchAnimation, setShowParkSwitchAnimation] = useState(false);
   
    useEffect(() => {
        console.log(user);
      if (isLoaded) {
        setMarkerPosition(true); // Set marker position after map is loaded
      }

      loadParks();
      console.log(parksLoaded);
      if (center === null) setCenter(parksLoaded[0].locationCoor);
    }, [isLoaded]);

    // loading parks API
    const loadParks = async ()=>{
      await fetch(`http://localhost:8081/api/v1/users/getLots`)
      .then(respond=>respond.status==200 || respond.status==201? (()=>{return respond.json()})(): (()=>{throw Error("Failed loading parks")})())
      .then((parksData)=>{
          setParksLoaded(parksData);
      })
      .catch(e=>console.log(e));
    }
    

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
                    onClick={()=>navigate('/profile', {state:{userLoaded: user}})}
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
    <ParkBox lot={park} person="user" getRout={getRout}/>

    </Modal>
    </div>

  );
};

export default MainPage;
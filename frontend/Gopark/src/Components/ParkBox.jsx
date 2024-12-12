import '../style.css';
const statusColorMaper = {
    'OCCUPOID': 'red',
    'AVAILABLE': '#44ea3b',
    'RESERVED': '#ea3b98'
};
const ParkBox = ({ park, person }) =>{
    const firstHalfLots = park.lots.slice(0, Math.ceil(park.lots.length / 2));
    const secondHalfLots = park.lots.slice(Math.ceil(park.lots.length / 2), park.lots.length);

    const reserveLot = async(lot)=>{
        if (lot.status == 'AVAILABLE'){
            const reservationTime = window.prompt("Please enter amount of time you whant to reserve your lot in hours");
            if (reservationTime.valueOf() > 5){
                alert(`Sorry maximum time for reservation is 5 hours`);
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
                        <div className='lot' key={i} style={{backgroundColor:statusColorMaper[l.status]}} onClick={()=>reserveLot(l)}>
                            <p>{l.number}</p>
                        </div>)
                    )}
                </div>
                <div className='rightLots'>
                    {secondHalfLots.map((l, i)=>(
                        <div className='lot' key={i} style={{backgroundColor:statusColorMaper[l.status]}} onClick={()=>reserveLot(l)}>
                            <p>{l.number}</p>
                        </div>)
                    )}
                </div>
            </div>
            {true && 
            <div className='analysisArea'>
                <hr style={{color:"black"}}/>
                <p>
                Occupancy rates: {}<br/>
                Revenue: {}<br/>
                Violations/Overstayings: {}
                
                </p>
            </div>}
        </div>
    );
};
export default ParkBox;
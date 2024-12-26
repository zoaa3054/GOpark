import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import unknownPhoto from '../assets/unknown.png'; // Adjust the path as necessary
import UploadPhoto from '../Components/UploadPhoto';
import ChangePassword from '../Components/ChangePassword';
import { useAsyncError, useLocation, useNavigate } from 'react-router-dom';
import edit from '../assets/edit.png'
import '../style.css';
import { toast } from 'react-toastify';

const DriverProfilePage = () => {
  const location = useLocation();
  const { userLoaded } = location.state || {'driverUserName': "",
                'emailAddress': "",
                'password': "",
                'phoneNumber': "",
                'carPlateNumber': ''};
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    setUser({
      username: userLoaded.driverUserName,
      email: userLoaded.emailAddress,
      phone: userLoaded.phoneNumber,
      carID: userLoaded.carPlateNumber,
      password: userLoaded.password,
      visaCard:{
        cardNumber: "",
        cardHolder: "", 
        expirationDate: "", 
        CCV: ""
      }
    });
    setFormData({
      cardNumber: "", 
      cardHolder: "", 
      expirationDate: "", 
      CVV: ""
    });
  }, []);

  const notifySuccessVisaAdding = () =>{
    toast.success("VISA card added successfully");
  }

  const notifyFaildVisaAdding = () =>{
    toast.error("Faild to add VISA card");
  }
  const validate = () =>{
    const newErrors = {};
    if (!/^\d{16}$/.test(formData.cardNumber)){
      newErrors.cardNumber = "Card number must be 16 digits."
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.cardHolder)){
      newErrors.cardHolder = "Cardholder name can only contain letters."
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expirationDate)){
      newErrors.expirationDate = "Expiration date must be in MM/YY format."
    }
    if (!/^\d{3}$/.test(formData.CVV)){
      newErrors.CVV = "CVV must be 3 digits."
    }
    setErrors(newErrors);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      cardNumber: user.visaCard.cardNumber, 
      cardHolder: user.visaCard.cardHolder, 
      expirationDate: user.visaCard.expirationDate, 
      CVV:user.visaCard.CCV
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validate();
    if (Object.keys(errors).length != 0) return;
    try {
      const response = await fetch('http://localhost:8081/api/v1/addVisaCard', {
        method: 'PUT',
        headers: {
          'Email': user.email,
          'Password': user.Password
        },
        body: JSON.stringify({
          'cardNumber': formData.cardNumber,
          'cardHolder': formData.cardHolder,
          'expirationDate': formData.expirationDate,
          'CVV': formData.CVV
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setUser({ ...user, ...formData });
        setIsEditing(false);
        notifySuccessVisaAdding();
      } else if (response.status === 400) {
        const error = await response.json();
        notifyFaildVisaAdding();
        console.error('Invalid input data:', error.error);
      } else if (response.status === 401) {
        console.error('Unauthorized');
        notifyFaildVisaAdding();
      } else {
        console.error('Failed to update user data');
        notifyFaildVisaAdding();
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      notifyFaildVisaAdding();
    }
  };


  const handleLogout = () =>{
    navigate('/');
  };

  if (!user) {
    return(
      <center>
        <h1>You are a Guest</h1>
        <button className='backButton' onClick={()=>navigate('/signup')}>Signup First</button>
      </center>);
  }

  return (
    <ProfileContainer>
      <ProfileImage>{user.username.charAt(0)+user.username.charAt(1)}</ProfileImage>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <ProfileDetails>
            <ProfileInput
              type="number"
              name="cardNumber"
              maxLength="16"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="Card Number"
              required
            />
            {errors.cardNumber && <small style={{color:"red"}}>{errors.cardNumber}</small>}
            <ProfileInput
              type="text"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleInputChange}
              placeholder="Card Holder"
              required
            />
            {errors.cardHolder && <small style={{color:"red"}}>{errors.cardHolder}</small>}
            <ProfileInput
              type="text"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleInputChange}
              placeholder="Expiration Date MM/YY"
            />
            {errors.expirationDate && <small style={{color:"red"}}>{errors.expirationDate}</small>}
            <ProfileInput
              type="number"
              name="CVV"
              maxLength="3"
              value={formData.CVV}
              onChange={handleInputChange}
              placeholder="CVV"
            />
            {errors.CVV && <small style={{color:"red"}}>{errors.CVV}</small>}
            <ButtonContainer>
              <ProfileButton type="submit">Save</ProfileButton>
              <ProfileButton type="button" onClick={handleCancelClick}>
                Cancel
              </ProfileButton>
            </ButtonContainer>
          </ProfileDetails>
        </form>
      ) : (
        <ProfileDetails>
          <ProfileName>{user.username}</ProfileName>
          <ProfileInfo>Email: {user.email}</ProfileInfo>
          <ProfileInfo>Phone Number: {user.phone}</ProfileInfo>
          <ProfileInfo>Car Plat Number: {user.carID}</ProfileInfo>
          <CardInfo>
            <div style={{display: "flex", color: '#ADEFD1FF'}}>
              <div style={{textAlign: "start"}}>
              <FieldTitle>Card Number</FieldTitle> 
              <FieldValue>{user.visaCard.cardNumber ? user.visaCard.cardNumber.slice(0, 4)+"   "+user.visaCard.cardNumber.slice(4, 8)+"   "+user.visaCard.cardNumber.slice(8, 12) + "   " + user.visaCard.cardNumber.slice(12, 16):"_"}</FieldValue>
            </div></div>
            <div style={{display: "flex", color: '#ADEFD1FF'}}>
              <div style={{marginRight: "1rem"}}>
                <FieldTitle>MM/YY</FieldTitle>
                <FieldValue>{user.visaCard.expirationDate?user.visaCard.expirationDate:"_"}</FieldValue>
              </div>
              <div>
                <FieldTitle>CVV</FieldTitle>
                <FieldValue>{user.visaCard.CVV?user.visaCard.CVV:"_"}</FieldValue>
              </div>
            </div>
            <FieldValue>{user.visaCard.cardHolder?user.visaCard.cardHolder:""}</FieldValue>

          </CardInfo>
          <ProfileButton onClick={handleEditClick}>Edit VISA Card</ProfileButton>
          <ProfileButton onClick={handleLogout}>Log out</ProfileButton>
        </ProfileDetails>
      )}
    </ProfileContainer>
  );
};

export default DriverProfilePage;

// Styled components
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #ADEFD1FF;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 3rem auto;
  color: #00203FFF;

`;

const ProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  font-size: 4rem;
  color: #ADEFD1FF;
  background-color: #00203FFF;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardInfo = styled.div`
  text-align: start-line;
  border: 1px solid black;
  border-radius: 20px;
  padding: 0.5rem;
  color: #ADEFD1FF;
  background-color: black;
  width: 100%;
`;
const ProfileDetails = styled.div`
  text-align: center;
  
`;

const FieldTitle = styled.div`
  margin: 0;
  font-size: 1rem;
`;

const FieldValue = styled.p`
  font-size: 16px;
  margin: 5px 0;
  color: #ADEFD1FF;
  font-family: Arial, Helvetica, sans-serif;
`;

const ProfileName = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const ProfileInfo = styled.p`
  font-size: 16px;
  margin: 5px 0;
  color: #00203FFF;

`;

const ProfileInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ProfileButton = styled.button`
  padding: 1rem;
  margin: 10px;
  border: none;
  border-radius: 20px;
  background-color: #00203FFF;
  color: #ADEFD1FF;
  cursor: pointer;
  &:hover {
    background-color: #ADEFD1FF;
    color: #00203FFF
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;
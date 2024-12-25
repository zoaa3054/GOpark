import React, { useState } from 'react';
import styled from 'styled-components';

const ChangePassword = ({ onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: null,
    newPassword: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem('drip_me_up_jwt');
    try {
      const response = await fetch('http://localhost:8081/users/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        onClose();
      } else if (response.status === 400) {
        const error = await response.json();
        console.error('Invalid input data:', error.error);
      } else if (response.status === 401) {
        console.error('Unauthorized');
      } else {
        console.error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <Modal>
      <ModalContent>
        <h2>Change Password</h2>
        <ProfileInput
          type="password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleInputChange}
          placeholder="Old Password"
        />
        <ProfileInput
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          placeholder="New Password"
        />
        <ButtonContainer>
          <ProfileButton onClick={handleChangePassword}>Change</ProfileButton>
          <ProfileButton onClick={onClose}>Cancel</ProfileButton>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

export default ChangePassword;

// Styled components
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ProfileInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ProfileButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;
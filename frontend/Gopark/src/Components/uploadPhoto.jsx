import React, { useState } from 'react';
import styled from 'styled-components';

const UploadPhoto = ({ onClose, onUpload }) => {
  const [photoFile, setPhotoFile] = useState(null);

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleUploadPhoto = async () => {
    const token = localStorage.getItem('drip_me_up_jwt');
    try {
      const response = await fetch('http://localhost:8081/users/photo', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: photoFile
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        onUpload(URL.createObjectURL(photoFile));
        onClose();
      } else if (response.status === 400) {
        const error = await response.json();
        console.error('Invalid input data:', error.error);
      } else if (response.status === 401) {
        console.error('Unauthorized');
      } else {
        console.error('Failed to upload profile photo');
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
    }
  };

  return (
    <Modal>
      <ModalContent>
        <h2>Upload Photo</h2>
        <input type="file" name="profilePhoto" onChange={handlePhotoChange} />
        <ButtonContainer>
          <ProfileButton onClick={handleUploadPhoto}>Upload</ProfileButton>
          <ProfileButton onClick={onClose}>Cancel</ProfileButton>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

export default UploadPhoto;

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
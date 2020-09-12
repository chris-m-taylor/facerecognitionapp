import React from 'react';

const FaceRecognition = ({imageURL}) => {
    return (
        <div className="center">
            <img src={imageURL} alt="face recognition pic" />
        </div>
    )
}

export default FaceRecognition;
'use client'
import React from 'react';

const BackgroundImage = ({ imageRef }) => {
  return (
    <div className="absolute inset-0">
      <div className="absolute right-0 top-0 w-full h-full">
        <img 
          ref={imageRef}
          src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
          alt="Woman applying face mask"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default BackgroundImage;
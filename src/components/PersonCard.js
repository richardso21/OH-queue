import React from "react";
import '../style/PersonCard.css';

const PersonCard = ({ ta, imageUrl, isRemote, onClick }) => {
  return (
    <div className={`person-card ${ta.busy ? 'busy' : ''}`} onClick={() => onClick(ta)}>
      <div className="person-image" style={{ backgroundImage: `url(${imageUrl})` }}/>
      <div className={`person-name ${isRemote ? 'remote' : ''}`}>
        {ta.name}
        {isRemote && <span> &nbsp;(Remote) </span>}
      </div>
    </div>
  );

};

export default PersonCard;


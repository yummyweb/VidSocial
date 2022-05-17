import React from 'react'

const MiniCard = ({ user, toggleFollow }) => {
  return (
    <div className="section minicard">
      <div className="section">
        <img className="user-profile" src="no" width={'100%'} />
        <div>
          <h3 className="bold">john.doe</h3>
          <p>John Doe</p>
      </div>
    </div>
        <div className="followed-button">
            Followed
        </div>
    </div>
  )
}
    
export default MiniCard
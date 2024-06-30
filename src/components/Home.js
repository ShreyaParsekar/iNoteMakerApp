import React, { useContext ,useEffect} from 'react'

import Notes from './Notes';



const Home = (props) => {
  
 const {showalert} = props

  return (
   
    <div className='container'>
      
    <Notes showalert={showalert}/>
    </div>
  )
}

export default Home

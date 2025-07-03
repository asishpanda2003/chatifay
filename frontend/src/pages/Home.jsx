import React from 'react'
import Sidebar from '../components/Sidebar'
import MessageArea from '../components/MessageArea'
import { useSelector } from 'react-redux'
import useMessage from '../hooks/getMessages'

function Home() {
  const {selectedUser} = useSelector(state => state.user)
  useMessage()
  return (
    <div className='w-full h-[100vh] flex overflow-hidden'>
    <Sidebar/>
    <MessageArea/>
    </div>
  )
}

export default Home
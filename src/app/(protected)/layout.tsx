import React from 'react'

const DashboardLayout = ({children} : {children : React.ReactNode}) => {
  return (
    <div>
        <div>Sidebar </div>
        {children}
    </div>
  )
}

export default DashboardLayout
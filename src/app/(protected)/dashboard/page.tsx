import React from 'react'
import DashboardPage from './DashboardPage'
import { getCommits } from '@/lib/github'
import { summeriseCommit } from '@/lib/gemini'

const page = async() => {

  const response = await getCommits("https://github.com/joschan21/pingpanda")
const response2 = await summeriseCommit(`diff --git a/src/components/shared/Popup.jsx b/src/components/shared/Popup.jsx
  index a546505..304d2fa 100644
  --- a/src/components/shared/Popup.jsx
  +++ b/src/components/shared/Popup.jsx
  @@ -2,7 +2,6 @@ import { Dialog, DialogBody } from '@material-tailwind/react'
   import React, { useState } from 'react'
   
   const Popup = ({open , handleClose , img}) => {
  -    console.log("img", img)
     return (
       <div>
           <Dialog open={open} handler={handleClose} size="lg" >
  diff --git a/src/pages/Home.jsx b/src/pages/Home.jsx
  index 38c03da..d80e5bf 100644
  --- a/src/pages/Home.jsx
  +++ b/src/pages/Home.jsx
  @@ -34,8 +34,6 @@ const Home = ({isOpened , setIsOpened}) => {
       }
     };
   
  -  console.log("Sks" , isOpened)
  -
     useEffect(() => {
       if (!isOpened) {
         setTimeout(() => {`)
    console.log(response2)
  
  return (
    <div>
        <DashboardPage />
    </div>
  )
}

export default page
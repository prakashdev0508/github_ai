import React from 'react'
import DashboardPage from './DashboardPage'
import { getCommits } from '@/lib/github'
import { summerizeCommits , pollcommits } from '@/lib/github'
import useProjects from '@/hooks/use-projects'

const page = async() => {
  
  return (
    <div>
        <DashboardPage />
    </div>
  )
}

export default page
import React, { useEffect, useState } from 'react';
import './App.css';
import { Protect } from './components/Protect';
import { Table } from './components/Table';

const App = () => {
  const [password, setPassword] = useState<any>(localStorage.getItem("password") || null)
  const [search, setSearch] = useState<any>(null)
  useEffect(() => {
    localStorage.setItem("password", password)
  }, [password])

  return (
    <div>
      {
        password === 'SMFadminHiphubMY' ? (
            <div className='bg-slate-700 p-10 min-h-screen min-w-screen'>
              <div className='flex justify-center my-5'>
                <input placeholder='Search' onChange={(v: any) => setSearch(v.target.value)} className='px-3 py-1 w-4/5 max-w-[500px] rounded bg-slate-800 border border-slate-500 text-slate-300'/>
              </div>
              <Table search={search}/>
            </div>
          ) : (
            <Protect setPassword={setPassword}/>
        )
      }
    </div>
  )
}

export default App;

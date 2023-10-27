import React, { useEffect, useState } from 'react';
import './App.css';
import { Protect } from './components/Protect';
import { Table } from './components/Table';

const App = () => {
  const [password, setPassword] = useState<any>(localStorage.getItem("password") || null)
  const [search, setSearch] = useState<any>(null)
  const [query, setQuery] = useState<any>()

  useEffect(() => {
    localStorage.setItem("password", password)
  }, [password])

  useEffect(() => {
    if (!search) {
      setQuery(search)
    }
  }, [search])

  return (
    <div>
      {
        password === 'SMFadminHiphubMY' ? (
            <div className='bg-slate-700 p-10 min-h-screen min-w-screen'>
              <div className='flex gap-2 justify-center my-5'>
                <input onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setQuery(search)
                  }
                }} onChange={(v: any) => setSearch(v.target.value)} className='px-3 py-1 w-4/5 max-w-[500px] rounded bg-slate-800 border border-slate-500 text-slate-300'/>
                <button onClick={() => setQuery(search)} className='text-slate-300 bg-slate-700 border border-slate-400 px-2 rounded-lg hover:bg-slate-800'>Search</button>
              </div>
              <Table query={query} search={search}/>
            </div>
          ) : (
            <Protect setPassword={setPassword}/>
        )
      }
    </div>
  )
}

export default App;

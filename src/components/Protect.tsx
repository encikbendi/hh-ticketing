import { useRef, useState } from "react"

export const Protect = ({setPassword} : {setPassword: (password:string) => void}) => {
    const inputRef = useRef<any>()
    const [buttonText, setButtonText] = useState<string>('show')

    const toggleVisibility = () => {
        if (!inputRef?.current) {
            return
        }

        const { type } = inputRef.current
        if (type === 'password') {
            inputRef.current.type = 'text'
            setButtonText('hide')
        } else if (type === 'text') {
            inputRef.current.type = 'password'
            setButtonText('show')
        }
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-slate-700">
            <div className="flex gap-2 bg-slate-600 p-6 rounded-xl">
                <p className="text-slate-100">Password:</p>
                <input ref={inputRef} type="password" onInput={(v: any) => setPassword(v.target.value)} className="bg-slate-700 border border-slate-400 rounded w-[50vw] max-w-[200px] text-slate-100 px-1"/>
                <button className="text-slate-100" onClick={toggleVisibility}>{buttonText}</button>
            </div>
        </div>
    )
}
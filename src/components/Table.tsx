import { useEffect, useMemo, useState } from "react"
import { config } from "../config"
import { getTicketFromVariationId } from "./helper"

export const Table = ({search, query}: any) => {
    const [orders, setOrders] = useState<any>()
    const [page, setPage] = useState<number>(1)

    const handleChangePage = (newPage: number) => {
        setOrders([])
        fetch(`${config.shop.apiURL}?consumer_key=${config.shop.consumer_key}&consumer_secret=${config.shop.consumer_secret}&product=1421&per_page=20&page=${newPage}&search=${query || ''}`, {
            method: "GET",
            cache: 'no-store'
        })
        .then((response) => response.json())
        .then((data) => {
            if (data?.length > 0) {
                const filtered = data.filter((d:any) => d.status !== 'pending' && d.status !== 'cancelled')
                setOrders(filtered)
                setPage(newPage)
            }
        })
    }

    useEffect(() => handleChangePage(page), [query])

    useEffect(() => handleChangePage(1), [])

    const pages = useMemo(() => {
        const arr = []
        const limit = orders?.length < 100 ? page : page + 1
        for (let i = 0; i < limit; i++) {
            arr.push(<p className={page === i + 1 ? 'text-slate-300' : 'text-slate-400' }>{i + 1}</p>)
        }
        return arr
    }, [page])

    // @ts-ignore
    const listing = useMemo(() => {
        if (!orders || !orders.length || !search) {
            return orders
        }

        const q = search.toLowerCase()
        const arr: any = orders.filter((order:any) => 
            order.billing?.first_name?.toLowerCase().includes(q) ||
            order.billing?.last_name?.toLowerCase().includes(q) ||
            order.billing?.company?.toLowerCase().includes(q) ||
            order.billing?.company?.toLowerCase().includes(q)
        )

        return arr
    }, [orders, search])

    const handleRedeem = (id: string) => {
        fetch(`${config.shop.apiURL}/${id}?consumer_key=${config.shop.consumer_key}&consumer_secret=${config.shop.consumer_secret}`, {
            method: "PUT",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({status: 'completed'})
        })
    }

    if (!orders || !orders?.length) {
        return <p className="text-slate-200 flex justify-center">Loading tickets list...</p>
    }

    return (
    <section className="container px-4 mx-auto">
    <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-x-3">
                                        <button className="flex items-center gap-x-2">
                                            <span >Order ID</span>
                                        </button>
                                    </div>
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Status
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Customer
                                </th>

                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Ticket
                                </th>
                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Quantity
                                </th>
                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Merch
                                </th>
                                <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    Quantity
                                </th>

                                <th scope="col" className="relative py-3.5 px-4">
                                    <span className="text-slate-300 font-light">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                            {
                                listing?.map((order:any) => {
                                    const items = order.line_items?.map((item:any) => ({
                                        ticket: getTicketFromVariationId(item?.variation_id || 0 ).ticket,
                                        merch: getTicketFromVariationId(item?.variation_id || 0 ).merch,
                                        quantity: item.quantity
                                    }))
                                    return (
                                        <tr>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-x-3">
                                                    <span>#{order.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
                                                    <h2 className="text-sm font-normal">{order.status}</h2>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                <div className="flex items-center gap-x-2">
                                                    <div>
                                                        <h2 className="text-sm font-medium text-gray-800 dark:text-white ">{order.billing?.first_name} {order.billing?.last_name}</h2>
                                                        <p className="text-xs font-normal text-gray-600 dark:text-gray-400">{order.billing?.company || order.billing?.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                {items.map((item: any) => <p>{item.ticket}</p>)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                {items.map((item: any) => <p>{item.quantity}</p>)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                {items.map((item: any) => <p>{item.merch || "-"}</p>)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                {items.map((item: any) => <p>{item.merch ? item.quantity : "-"}</p>)}
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex justify-center">
                                                    <button onClick={() => handleRedeem(order.id)} disabled={order.status === 'completed'} className={`text-slate-800 ${order.status === 'completed' ? 'text-slate-200 bg-slate-500 opacity-50' : 'bg-slate-400'} rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-slate-500 active:bg-slate-600 focus:outline-none`}>
                                                        {order.status === 'completed' ? 'Redeemed' : 'Redeem'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div className="flex items-center justify-between mt-6">
        <button onClick={() => handleChangePage(page - 1)} className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>

            <span>
                previous
            </span>
        </button>

        <div className="items-center hidden md:flex gap-x-3">
            {pages}
        </div>

        <button onClick={() => handleChangePage(page + 1)} className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
            <span>
                Next
            </span>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
        </button>
    </div>
</section>
    )
}
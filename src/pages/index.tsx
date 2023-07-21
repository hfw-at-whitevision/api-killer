import Image from 'next/image'
import {Inter} from 'next/font/google'
import {useState} from "react";

const throttledQueue = require('throttled-queue');

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const [url, setUrl] = useState('');
    const [interval, setInterval] = useState(1000);
    const [requestsPerInterval, setRequestsPerInterval] = useState(500);
    const [totalRequests, setTotalRequests] = useState(10000);
    const [isLoading, setIsLoading] = useState(false);

    const throttle = throttledQueue(requestsPerInterval, interval, true);

    const handleStart = async () => {
        setIsLoading(true);

        for (let i = 0; i < totalRequests; i++) {
            throttle(async () => {
                const res = await fetch('/api/ping', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        url
                    })
                });
            });
        }

        setIsLoading(false);
    }

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
            <div
                className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
                <div
                    className="dark:invert text-4xl font-black text-black"
                >
                    API Killer
                </div>
            </div>


            <form className={'flex items-center justify-center flex-col gap-2 w-full max-w-2xl'}>
                <input type='url' placeholder='URL' className='w-full' onChange={e => setUrl(e.target.value)}/>

                <div className='flex flex-col gap-2 w-full'>
                    Interval (in seconds):
                    <input name='interval' type='number' placeholder='Interval (in seconds)'
                           onChange={e => setInterval(parseInt(e.target.value) * 1000)}/>

                    Requests per interval:
                    <input name='requestsPerInterval' type='number' placeholder='Requests per interval'
                           onChange={e => setRequestsPerInterval(parseInt(e.target.value))}/>

                    Total requests:
                    <input name='totalRequests' type='number' placeholder='Total requests'
                           onChange={e => setTotalRequests(parseInt(e.target.value))}/>
                </div>

                <div className={'flex flex-row gap-2'}>
                    <button
                        type='button'
                        className={'px-4 py-2 bg-white text-black uppercase font-bold flex items-center justify-center flex-row gap-2'}
                        onClick={async () => await handleStart()}
                    >
                        {isLoading
                            ? <img src='./images/loading-spinner.svg' className='w-6 h-6'/>
                            : null
                        }
                        Start
                    </button>
                </div>
            </form>


            <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">

            </div>
        </main>
    )
}

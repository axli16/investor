import React from 'react';
import { useState} from 'react';
import StockChart from './StockChart';



const TradeContent = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    return (
        <div className="text-center py-16">
            <div className="flex flex-col items-start mb-4">
            </div >

            <div className="flex justify-center items-start w-full">
                <div className="w-full bg-gray-800 rounded-lg shadow-md">
                    <StockChart />
                </div>
            </div>
        </div>
    );
}
export default TradeContent;
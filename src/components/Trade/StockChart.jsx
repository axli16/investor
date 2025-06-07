import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, defaults, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from "chart.js/auto"
import {Line} from 'react-chartjs-2';
import { Pencil, Move, RotateCcw, X,  TrendingUp, TrendingDown, Shield, Target } from 'lucide-react';
import axios from 'axios';
import {addActivities} from '../ActivityFunctions'
import ActivityPanel from '../DashBoard/ActivityPanel'

defaults.maintainAspectRatio = false;
defaults.responsive = true;

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = () => {
  // State for chart data and interactions
  const [data, setData] = useState([]);
  // let index = 0;
  // let price = 0;
  const [yDomain, setYDomain] = useState({ min: 0, max: 0 });
  const [xDomain, setXDomain] = useState({ min: 0, max: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawings, setDrawings] = useState([]);
  const [currentDrawing, setCurrentDrawing] = useState([]);
  const [svgPos, setSvgPos] = useState({x: 0, y: 0});
  const chartRef = useRef(null);
  const svgRef = useRef(null);
  const priceRef = useRef(0); 
  const buyIn = useRef(0);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [numStocks, setNumStock] = useState(1);
  const [multiplier,setMultiplier] = useState(1);
  const [stopLoss, setStopLoss] = useState(5);
  const [takeProfit, setTakeProfit] = useState(10);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [startPrice, setStartPrice] = useState(150 + Math.random() * 50);
  const curStopLoss = useRef(0)
  const curTakeProfit = useRef(0)

  
  // Generate sample stock data
  useEffect(() => {
    const generateData = () => {
      const totalHours  = 0.05;
      const remainingPoints = totalHours * 60 * 60;
      const hours = 0.1; // Trading hours
      const points = hours * 60 * 60; // One point per second
      let price = startPrice;

      const stockData = [];
      const offset = hours * 60 * 60 * 1000;
      const startTime = new Date();
      
      startTime.setTime(startTime.getTime() - offset); 
      
      
      for (let index = 0; index < points; index++) {
        const time = new Date(startTime);
        time.setSeconds(startTime.getSeconds() + index);
        
        // Generate some realistic price movements
        const change = (Math.random() - 0.5) * 0.5;
        price = price + change;
        
        stockData.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          price: price,
          timestamp: time.getTime(),
        });
      }
      priceRef.current = parseFloat(stockData[points - 1].price);
      
      
      for(let index = points; index < points + remainingPoints; index++){
        const time = new Date(startTime);
        time.setSeconds(startTime.getSeconds() + index);

        stockData.push({
          time: time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'}),
          price: null,
          timestamp: time.getTime(),
        });
      }

      setData(stockData);
      
      // Set domain based on price range
      const prices = stockData
        .filter(d => d.price !== null)
        .map(d => parseFloat(d.price));

      return points
    };
    let point = generateData();

    const interval = setInterval(() => {
      setData((prevData) => {
        const time = new Date();
        const change = (Math.random() - 0.5) * 0.6;
        let price = priceRef.current + change; 
        priceRef.current = price;

        if (buyIn.current === 0){
          curStopLoss.current = (priceRef.current - (priceRef.current * (stopLoss / 100)));
          curTakeProfit.current = (priceRef.current + (priceRef.current * (takeProfit / 100)));
        }
        

        const newPoint = {
          time: time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          price: price,
          timestamp: time.getTime(),
        };

        if (buyIn.current !== 0 && (priceRef.current <= curStopLoss.current || priceRef.current >= curTakeProfit.current)){
          Sell()
        }
      
        // Find the index of the first padded (null) price
        const firstNullIndex = prevData.findIndex(d => d.price === null);
        // console.log(point);
        // point++;
        // Insert before padding
        if (firstNullIndex !== -1) {
          const before = prevData.slice(0, firstNullIndex);
          const after = prevData.slice(firstNullIndex);
          return [...before, newPoint, ...after];
        } else {
          // No padding left, just append
          return [...prevData, newPoint];
        }
      });
    }, 1000); // Add data every 1 second


    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  // Define the custom plugin for horizontal line
  const horizontalLinesPlugin = {
    id: 'horizontalLines',
    afterDraw(chart) {
      const { ctx, chartArea: { left, right }, scales: { y } } = chart;
      const lines = chart.options.plugins.horizontalLines?.lines || [];

      ctx.save();
      lines.forEach(({ yValue, color = 'red', lineWidth = 1 }) => {
        if (yValue === undefined) return;
        const yPixel = y.getPixelForValue(yValue);
        ctx.beginPath();
        ctx.moveTo(left, yPixel);
        ctx.lineTo(right, yPixel);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
      });
      ctx.restore();
    }
  };

  ChartJS.register(horizontalLinesPlugin); // Register it once
  
  const horizontalLineData = [
  { yValue: priceRef.current, color: 'blue', lineWidth: 2 },
  { yValue: startPrice, color: 'grey', lineWidth: 1 },
  { yValue: curStopLoss.current, color: 'red', lineWidth: 2 }, // could be dynamic too  priceRef.current * (1 + (stopLoss / 100))
  { yValue: curTakeProfit.current, color: 'green', lineWidth: 2 }, // could be dynamic toopriceRef.current * (1 + (takeProfit / 100))
];

  // const getSVGCoords = (e) => {
  //   const svg = svgRef.current;
  //   if (!svg) return { x: 0, y: 0 };

  //   const pt = svg.createSVGPoint();
  //   pt.x = e.clientX;
  //   pt.y = e.clientY;

  //   const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());

  //   return { x: svgPoint.x, y: svgPoint.y };
  // };


  // // Handle mouse events for zooming and panning
  // const handleWheel = (e) => {
  //   e.preventDefault();
    
  //   // Calculate zoom factor
  //   const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
  //   const newZoomLevel = Math.min(Math.max(zoomLevel * zoomFactor, 1), 20);
    
  //   if (newZoomLevel !== zoomLevel) {
  //     // Calculate mouse position relative to chart for zoom focus point
  //     const rect = chartRef.current.getBoundingClientRect();
  //     const mouseX = (e.clientX - rect.left) / rect.width;
      
  //     // Calculate current visible range
  //     const currentRange = xDomain.max - xDomain.min;
  //     const newRange = currentRange / zoomFactor;
      
  //     // Calculate new domain centered on mouse position
  //     const dataLength = data.length;
  //     const mousePosInDataIndex = xDomain.min + mouseX * currentRange;
      
  //     // Calculate new min/max keeping mouse position as focus point
  //     let newMin = mousePosInDataIndex - (mouseX * newRange);
  //     let newMax = mousePosInDataIndex + ((1 - mouseX) * newRange);
      
  //     // Ensure boundaries
  //     if (newMin < 0) {
  //       newMax += (0 - newMin);
  //       newMin = 0;
  //     }
      
  //     if (newMax > dataLength - 1) {
  //       newMin -= (newMax - (dataLength - 1));
  //       newMax = dataLength - 1;
  //     }
      
  //     // Apply boundaries again in case both were out of range
  //     newMin = Math.max(0, newMin);
  //     newMax = Math.min(dataLength - 1, newMax);
      
  //   }
  // };

  // const handleMouseDown = (e) => {
  //   if (drawingMode) {
  //     // Start drawing
  //     const { x, y } = getSVGCoords(e);
  //     setCurrentDrawing([{ x, y }]);
  //     setIsDrawing(true);
  //   } else {
  //     // Start panning
  //     setPanStart({ x: e.clientX, y: e.clientY });
  //     setIsPanning(true);
  //   }
  // };

  // const handleMouseMove = (e) => {
  //   if (isPanning && !drawingMode) {
  //     // Continue panning
  //     const dx = e.clientX - panStart.x;
  //     const dy = e.clientY - panStart.y;
      
  //     const rect = chartRef.current.getBoundingClientRect();
  //     const deltaXRatio = dx / rect.width;
  //     const deltaYRatio = dy / rect.height;
      
  //     // Calculate current ranges
  //     const xRange = xDomain.max - xDomain.min;
  //     const yRange = yDomain.max - yDomain.min;
      
  //     // Calculate movement in data units
  //     const xMove = -deltaXRatio * xRange;
  //     const yMove = deltaYRatio * yRange;

  //     // Apply to x domain
  //     const dataLength = data.length;
  //     let newMin = xDomain.min + xMove;
  //     let newMax = xDomain.max + xMove;

      
  //     // Prevent panning beyond data bounds
  //     if (newMin < 0) {
  //       newMax += (0 - newMin);
  //       newMin = 0;
  //     }
      
  //     if (newMax > dataLength - 1) {
  //       newMin -= (newMax - (dataLength - 1));
  //       newMax = dataLength - 1;
  //     }
      
  //     // Apply bounds again in case both were out of range
  //     newMin = Math.max(0, newMin);
  //     newMax = Math.min(dataLength - 1, newMax);
      
  //     setXDomain({ min: newMin, max: newMax });
  //     setVisibleStartIndex(Math.floor(newMin));
  //     setVisibleEndIndex(Math.ceil(newMax));
      
  //     // Apply to y domain
  //     setOffset({ x: offset.x, y: offset.y + yMove });
      
  //     // Reset start point
  //     setPanStart({ x: e.clientX, y: e.clientY });
  //   } else if (isDrawing && drawingMode) {
  //     // Continue drawing
  //     const { x, y } = getSVGCoords(e);
  //     setCurrentDrawing(prev => [...prev, { x, y }]);
  //   }
  // };

  // const handleMouseUp = () => {
  //   if (isDrawing) {
  //     // Finish drawing
  //     if (currentDrawing.length > 1) {
  //       setDrawings(prev => [...prev, currentDrawing]);
  //     }
  //     setCurrentDrawing([]);
  //     setIsDrawing(false);
  //   }
  //   setIsPanning(false);
  // };

  // const handleMouseLeave = handleMouseUp;

  // const toggleDrawingMode = () => {
  //   setDrawingMode(!drawingMode);
  // };

  // const clearDrawings = () => {
  //   setDrawings([]);
  //   setCurrentDrawing([]);
  // };

  // const resetView = () => {
  //   setZoomLevel(1);
  //   setOffset({ x: 0, y: 0 });
  //   setXDomain({ min: 0, max: data.length - 1 });
  //   setVisibleStartIndex(0);
  //   setVisibleEndIndex(data.length - 1);
  // };


  // // Adjust Y domain based on zoom and pan
  // const adjustedYDomain = [
  //   yDomain.min + (yDomain.max - yDomain.min) * (1 - zoomLevel) / 2 + offset.y,
  //   yDomain.max - (yDomain.max - yDomain.min) * (1 - zoomLevel) / 2 + offset.y
  // ];

  // // Custom tooltip styling
  // const CustomTooltip = ({ active, payload }) => {

  //   if (active && payload && payload.length && !isDrawing && !drawingMode) {
  //     return (
  //       <div className="bg-gray-800 border border-emerald-500 p-2 rounded shadow-lg text-white">
  //         <p className="text-emerald-400">{`Time: ${payload[0].payload.time}`}</p>
  //         <p className="text-white">{`Price: $${payload[0].value}`}</p>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  //Doesn't remember when you switch between dahsboard and Trade view
  const Buy = () =>{
    if(buyIn.current !== 0){
      setErrorMsg("You need to sell before buying again")
      return;
    }
    if (numStocks === 0){
      setErrorMsg("Specify number of shares")
      return
    }
    setStartPrice(priceRef.current);
    const bought = priceRef.current * numStocks;
    buyIn.current = bought
    setMultiplier(numStocks)
    // drawLineAt(priceRef.current)
    const time = new Date();
    
    addActivities(time.toLocaleString(), 'Buy', priceRef.current.toFixed(2), 0, numStocks);
    setMessage(`Bought at $${priceRef.current.toFixed(2)}`)
  }

  const Sell = () => {
    if(buyIn.current === 0){
      setErrorMsg('Need to buy in before selling')
      return;
    }
    // console.log(`sold at ${priceRef.current}`);
    // console.log( multiplier)
    const change = (priceRef.current * multiplier) - buyIn.current;
    buyIn.current = 0;
    
    const username = JSON.parse(localStorage.getItem('user'));
    // console.log(username)
    
    const apiUrl = import.meta.env.VITE_USER_DB_LINK;
    const requestConfig = {
        headers: {
            'x-api-key': import.meta.env.VITE_USER_DB_KEY
        }
    };
    const requestBody = {
        username: username.username,
        netChange: change,
    };

    axios.post(`${apiUrl}/balance`, requestBody, requestConfig).then(response => {
        setMessage(`Sold for $${change.toFixed(2)}`)
        console.log(response.data); // Handle successful login response here
        const time = new Date();
        addActivities(time.toLocaleString(), 'Sell', priceRef.current.toFixed(2), change.toFixed(2), multiplier)
    }).catch((error) => {
        console.log('error:', error)
        setErrorMsg('Something went wrong with updating your balance')
    });

  }

  const handleMultiplierChange = (e) => {
    e.preventDefault()
    const value = e.target.value;

    if(value === '' || /^\d+$/.test(value)){
      setNumStock(Number(value))
    }
  }

  const handleStopLossChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setStopLoss(value);
    }
  };

  const handleTakeProfitChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTakeProfit(value);
    }
  };

  // Render chart and controls
  return (
    <div className="h-1/2 w-full bg-gray-900 p-4 text-white rounded-md">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-emerald-400">Stock Price</h1>
        <h3 className="text-xl font-mono font-bold text-green-400 bg-black border-4 border-green-500 rounded-lg px-4 py-2 shadow-lg">
          Current Price: ${priceRef.current.toFixed(2)}
        </h3>
        <div className="flex space-x-4">
          {/* <button 
            className={`p-2 rounded-full ${drawingMode ? 'bg-emerald-600' : 'bg-gray-700'} hover:bg-emerald-500`}
            onClick={toggleDrawingMode} 
            title="Toggle Drawing Mode"
          >
            <Pencil size={20} />
          </button>
          <button 
            className="p-2 rounded-full bg-gray-700 hover:bg-emerald-500" 
            onClick={clearDrawings}
            title="Clear Drawings"
          >
            <X size={20} />
          </button>
          <button 
            className="p-2 rounded-full bg-gray-700 hover:bg-emerald-500" 
            onClick={resetView}
            title="Reset View"
          >
            <RotateCcw size={20} />
          </button> */}
        </div>
      </div>
      
      <div 
        ref={chartRef}
        className="h-96 w-full relative cursor-grab select-none"
        // onWheel={handleWheel}
        // onMouseDown={handleMouseDown}
        // onMouseMove={handleMouseMove}
        // onMouseUp={handleMouseUp}
        // onMouseLeave={handleMouseLeave}
        // style={{ cursor: drawingMode ? 'crosshair' : isPanning ? 'grabbing' : 'grab' }}
      >
        <Line 
        data={{
          labels: data.map((data) => data.time),
          datasets: [
            {
              label: "Price",
              data: data.map((data) => data.price),
              backgroundColor: "#374151",
              borderColor: '#10B981',
              pointRadius: 0
            },
          ],
        }}
        options={{
            responsive: true, 
            plugins: {
              horizontalLines: {
                lines: horizontalLineData
              }
            }
          }}
        />
      </div>
      
      <div className="mt-4 text-gray-400 text-sm">
        {/* <p>
          <span className="text-emerald-400 font-semibold">Instructions:</span> 
          {drawingMode ? 
            ' Click and drag to draw on chart' : 
            ' Click and drag to pan, use mouse wheel to zoom'
          }
        </p> */}
        {/* <p className="mt-1">Current mode: <span className="text-emerald-400">{drawingMode ? 'Drawing' : 'Navigation'}</span></p> */}
         <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl max-w-2xl mx-auto border border-gray-700">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Trading Terminal</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto rounded-full"></div>
      </div>

      {/* Main Trading Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 mb-4 border border-gray-600/50">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="relative">
            <input
              className="p-3 w-36 rounded-lg bg-gray-700/80 text-white placeholder-gray-400 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 text-center font-medium"
              placeholder="Quantity"
              value={numStocks}
              onChange={handleMultiplierChange}
            />
            <div className="absolute -top-2 left-3 px-2 bg-gray-800 text-xs text-gray-400 font-medium">
              Shares
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 font-semibold flex items-center gap-2 transform hover:scale-105"
              onClick={Buy}
            >
              <TrendingUp size={18} />
              Buy × {numStocks || '0'}
            </button>
            
            <button
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/25 font-semibold flex items-center gap-2 transform hover:scale-105"
              onClick={Sell}
            >
              <TrendingDown size={18} />
              Sell All
            </button>
          </div>
        </div>
      </div>

      {/* Risk Management Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-600/50 overflow-hidden">
        <div 
          className="p-4 cursor-pointer hover:bg-gray-700/30 transition-colors duration-200 flex items-center justify-between"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          <div className="flex items-center gap-2">
            <Shield className="text-blue-400" size={20} />
            <span className="text-white font-semibold">Risk Management</span>
          </div>
          <div className={`transform transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className={`transition-all duration-300 ease-in-out ${isAdvancedOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="p-5 pt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stop Loss */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="text-red-400" size={16} />
                  <label className="text-sm font-medium text-gray-300">Stop Loss = ${curStopLoss.current.toFixed(2)}</label>
                </div>
                <div className="relative">
                  <input
                    className="p-3 w-full rounded-lg bg-gray-700/80 text-white placeholder-gray-400 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 pr-8"
                    placeholder="5.0"
                    value={stopLoss}
                    onChange={handleStopLossChange}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Max loss before auto-sell</p>
              </div>

              {/* Take Profit */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="text-emerald-400" size={16} />
                  <label className="text-sm font-medium text-gray-300">Take Profit = ${curTakeProfit.current.toFixed(2)}</label>
                </div>
                <div className="relative">
                  <input
                    className="p-3 w-full rounded-lg bg-gray-700/80 text-white placeholder-gray-400 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 pr-8"
                    placeholder="10.0"
                    value={takeProfit}
                    onChange={handleTakeProfitChange}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Target profit for auto-sell</p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Risk/Reward Ratio:</span>
                <span className="text-white font-medium">
                  1:{stopLoss && takeProfit ? (parseFloat(takeProfit) / parseFloat(stopLoss || 1)).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 text-center">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border
            ${buyIn.current === 0
              ? "bg-emerald-500/20 border-emerald-500/30"
              : "bg-red-500/20 border-red-500/30"}`}
        >
          <div
            className={`w-2 h-2 rounded-full animate-pulse 
              ${buyIn.current === 0 ? "bg-emerald-400" : "bg-red-400"}`}
          ></div>
          <span
            className={`text-sm font-medium 
              ${buyIn.current === 0? "text-emerald-400" : "text-red-400"}`}
          >
            {buyIn.current === 0 ? "Ready to Trade" : "Bought In"}
          </span>
        </div>
      </div>


        </div>
        {message && (
            <p className="text-sm text-gray-300 mt-2 text-center w-full">{message}</p>
          )}
        {errorMsg && (
          <p className="text-sm text-red-300 mt-2 text-center w-full">{errorMsg}</p>
        )}
      </div>

    </div>
  );
};

export default StockChart;
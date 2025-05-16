import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, defaults} from "chart.js/auto"
import {Line} from 'react-chartjs-2';
import { Pencil, Move, RotateCcw, X } from 'lucide-react';
import axios from 'axios';
import {addActivities} from '../ActivityFunctions'
import ActivityPanel from '../DashBoard/ActivityPanel'

defaults.maintainAspectRatio = false;
defaults.responsive = true;

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
  const [buyIn, setBuyIn] = useState(0);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [numStocks, setNumStock] = useState(1);
  const [multiplier,setMultiplier] = useState(1);


  
  // Generate sample stock data
  useEffect(() => {
    const generateData = () => {
      const totalHours  = 0.05;
      const remainingPoints = totalHours * 60 * 60;
      const hours = 0.1; // Trading hours
      const points = hours * 60 * 60; // One point per second
      const startPrice = 150 + Math.random() * 50;
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
        const change = (Math.random() - 0.5) * 0.5;
        let price = priceRef.current + change;
        priceRef.current = price;
      
        const newPoint = {
          time: time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          price: price,
          timestamp: time.getTime(),
        };
      
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

  // Horizontal line plugin
  const horizontalLinePlugin = {
    id: "horizontalLine",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const yValue = pluginOptions.y;
      if (yValue === undefined) return;

      const {
        ctx,
        chartArea: { left, right },
        scales: { y }
      } = chart;

      const yPixel = y.getPixelForValue(yValue);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(left, yPixel);
      ctx.lineTo(right, yPixel);
      ctx.strokeStyle = pluginOptions.color || "red";
      ctx.lineWidth = pluginOptions.lineWidth || 2;
      ctx.stroke();
      ctx.restore();
    }
  };

  ChartJS.register(horizontalLinePlugin);
  
  const drawLineAt = () => {
    const chart = chartRef.current?.chart;
    if (!chartRef.current) return;
    console.log(typeof(priceRef.current))
    chartRef.current.chart.options.plugins.horizontalLine.y = priceRef.current;
    chartRef.current.update();
  };

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
    if(buyIn !== 0){
      setErrorMsg("You need to sell before buying again")
      return;
    }
    const bought = priceRef.current * numStocks;
    setBuyIn(bought);
    setMultiplier(numStocks)
    // drawLineAt(priceRef.current)
    const time = new Date();
    
    addActivities(time.toLocaleString(), 'Buy', priceRef.current.toFixed(2), 0, numStocks);
    setMessage(`Bought at $${priceRef.current.toFixed(2)}`)
  }

  const Sell = () => {
    if(buyIn === 0){
      setErrorMsg('Need to buy in before selling')
      return;
    }
    // console.log(`sold at ${priceRef.current}`);
    // console.log( multiplier)
    const change = (priceRef.current * multiplier) - buyIn;
    setBuyIn(0);
    
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
        setMessage(`Made $${change.toFixed(2)}`)
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
            horizontalLine: {
              y: undefined, //default no line 
              color: "blue",
              lineWidth: 2
            }
          }
        }}
        />
      </div>
      
      <div className="mt-4 text-gray-400 text-sm">
        <p>
          <span className="text-emerald-400 font-semibold">Instructions:</span> 
          {drawingMode ? 
            ' Click and drag to draw on chart' : 
            ' Click and drag to pan, use mouse wheel to zoom'
          }
        </p>
        {/* <p className="mt-1">Current mode: <span className="text-emerald-400">{drawingMode ? 'Drawing' : 'Navigation'}</span></p> */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-4 bg-gray-900 rounded-xl shadow-lg max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <input
              className="p-2 w-32 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Number of stock"
              value={numStocks}
              onChange={handleMultiplierChange}
            />
            <button
              className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition duration-200 shadow-sm"
              onClick={Buy}
            >
              Buy × {numStocks}
            </button>
            <button
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-200 shadow-sm"
              onClick={Sell}
            >
              Sell
            </button>
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
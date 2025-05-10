import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Pencil, Move, RotateCcw, X } from 'lucide-react';

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
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [visibleEndIndex, setVisibleEndIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawings, setDrawings] = useState([]);
  const [currentDrawing, setCurrentDrawing] = useState([]);
  const [svgPos, setSvgPos] = useState({x: 0, y: 0});
  const chartRef = useRef(null);
  const svgRef = useRef(null);

  // Generate sample stock data
  useEffect(() => {
    const generateData = () => {
      const totalHours  = 0.5;
      const remainingPoints = totalHours * 60 * 60;
      const hours = 1; // Trading hours
      const points = hours * 60 * 60; // One point per second
      const startPrice = 150 + Math.random() * 50;
      let price = startPrice

      const stockData = [];
      const offset = hours * 60 * 60 * 1000;
      const startTime = new Date();
      
      startTime.setTime(startTime.getTime() - offset); 
      
      
      for (let index = 0; index < points; index++) {
        const time = new Date(startTime);
        time.setSeconds(startTime.getSeconds() + index);
        
        // Generate some realistic price movements
        const change = (Math.random() - 0.48) * 0.5;
        price = Math.max(price + change, 0.01);
        
        stockData.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', seconds: '2-digits' }),
          price: price.toFixed(2),
          timestamp: time.getTime(),
          index: index,
        });
      }
      
      
      
      for(let index = points; index < points + remainingPoints; index++){
        const time = new Date(startTime);
        time.setSeconds(startTime.setSeconds() + index);

        stockData.push({
          time: time.toLocaleTimeString([], {hour: '2-digit', minutes: '2-digit', seconds: '2-digits'}),
          price: null,
          timestamp: time.getTime(),
          index: index,
        });
      }

      setData(stockData);
      
      // Set domain based on price range
      const prices = stockData.map(d => parseFloat(d.price));
      const min = Math.min(...prices) * 0.99;
      const max = Math.max(...prices) * 1.01;
      setYDomain({ min, max });
      
      // Set time domain
      setXDomain({ min: 0, max: stockData.length - 1 });
      setVisibleStartIndex(0);
      setVisibleEndIndex(stockData.length - 1);
    };
    
    generateData();


    // const interval = setInterval(() => {
    //   setData((prevData) => {

    //     const time = new Date();
    //     time.setSeconds(time.setSeconds() + index);

    //     // Generate some realistic price movements
    //     const change = (Math.random() - 0.48) * 0.5;
    //     price = Math.max(price + change, 0.01);

    //     const newPoint = {
    //       time: time.toLocaleTimeString([], {hour: '2-digit', minutes:'2-digit', seconds: '2-digit'}), 
    //       price: price.toFixed(2),
    //       timestamp: time.getTime(),
    //       index: index,
    //     };
    //     index++;
      
    //     return [...prevData, newPoint]; 
    //   });
    // }, 1000); // Add data every 1 second



  }, []);


  const getSVGCoords = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());

    return { x: svgPoint.x, y: svgPoint.y };
  };


  // Handle mouse events for zooming and panning
  const handleWheel = (e) => {
    e.preventDefault();
    
    // Calculate zoom factor
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoomLevel = Math.min(Math.max(zoomLevel * zoomFactor, 1), 20);
    
    if (newZoomLevel !== zoomLevel) {
      // Calculate mouse position relative to chart for zoom focus point
      const rect = chartRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width;
      
      // Calculate current visible range
      const currentRange = xDomain.max - xDomain.min;
      const newRange = currentRange / zoomFactor;
      
      // Calculate new domain centered on mouse position
      const dataLength = data.length;
      const mousePosInDataIndex = xDomain.min + mouseX * currentRange;
      
      // Calculate new min/max keeping mouse position as focus point
      let newMin = mousePosInDataIndex - (mouseX * newRange);
      let newMax = mousePosInDataIndex + ((1 - mouseX) * newRange);
      
      // Ensure boundaries
      if (newMin < 0) {
        newMax += (0 - newMin);
        newMin = 0;
      }
      
      if (newMax > dataLength - 1) {
        newMin -= (newMax - (dataLength - 1));
        newMax = dataLength - 1;
      }
      
      // Apply boundaries again in case both were out of range
      newMin = Math.max(0, newMin);
      newMax = Math.min(dataLength - 1, newMax);
      
      // Update x domain
      setXDomain({ min: newMin, max: newMax });
      
      // Update visible indices
      setVisibleStartIndex(Math.floor(newMin));
      setVisibleEndIndex(Math.ceil(newMax));
      
      // Update zoom level
      setZoomLevel(newZoomLevel);
    }
  };

  const handleMouseDown = (e) => {
    if (drawingMode) {
      // Start drawing
      const { x, y } = getSVGCoords(e);
      setCurrentDrawing([{ x, y }]);
      setIsDrawing(true);
    } else {
      // Start panning
      setPanStart({ x: e.clientX, y: e.clientY });
      setIsPanning(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning && !drawingMode) {
      // Continue panning
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      
      const rect = chartRef.current.getBoundingClientRect();
      const deltaXRatio = dx / rect.width;
      const deltaYRatio = dy / rect.height;
      
      // Calculate current ranges
      const xRange = xDomain.max - xDomain.min;
      const yRange = yDomain.max - yDomain.min;
      
      // Calculate movement in data units
      const xMove = -deltaXRatio * xRange;
      const yMove = deltaYRatio * yRange;

      // Apply to x domain
      const dataLength = data.length;
      let newMin = xDomain.min + xMove;
      let newMax = xDomain.max + xMove;

      if(newMin > 0 && newMax < dataLength - 1){
        setSvgPan(prev => ({
          x: prev.x + dx,
          y: prev.y + dy/2,
        }));
      }
      
      // Prevent panning beyond data bounds
      if (newMin < 0) {
        newMax += (0 - newMin);
        newMin = 0;
      }
      
      if (newMax > dataLength - 1) {
        newMin -= (newMax - (dataLength - 1));
        newMax = dataLength - 1;
      }
      
      // Apply bounds again in case both were out of range
      newMin = Math.max(0, newMin);
      newMax = Math.min(dataLength - 1, newMax);
      
      setXDomain({ min: newMin, max: newMax });
      setVisibleStartIndex(Math.floor(newMin));
      setVisibleEndIndex(Math.ceil(newMax));
      
      // Apply to y domain
      setOffset({ x: offset.x, y: offset.y + yMove });
      
      // Reset start point
      setPanStart({ x: e.clientX, y: e.clientY });
    } else if (isDrawing && drawingMode) {
      // Continue drawing
      const { x, y } = getSVGCoords(e);
      setCurrentDrawing(prev => [...prev, { x, y }]);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      // Finish drawing
      if (currentDrawing.length > 1) {
        setDrawings(prev => [...prev, currentDrawing]);
      }
      setCurrentDrawing([]);
      setIsDrawing(false);
    }
    setIsPanning(false);
  };

  const handleMouseLeave = handleMouseUp;

  const toggleDrawingMode = () => {
    setDrawingMode(!drawingMode);
  };

  const clearDrawings = () => {
    setDrawings([]);
    setCurrentDrawing([]);
  };

  const resetView = () => {
    setZoomLevel(1);
    setOffset({ x: 0, y: 0 });
    setXDomain({ min: 0, max: data.length - 1 });
    setVisibleStartIndex(0);
    setVisibleEndIndex(data.length - 1);
  };

  // Get visible data for the current view
  const visibleData = React.useMemo(() => {
    if (data.length === 0) return [];
    // Make sure we include a few extra points for smooth rendering at edges
    const buffer = 2;
    const start = Math.max(0, Math.floor(xDomain.min) - buffer);
    const end = Math.min(data.length - 1, Math.ceil(xDomain.max) + buffer );
    return data.slice(start, end + 1);
  }, [data, xDomain.min, xDomain.max]);

  // Adjust Y domain based on zoom and pan
  const adjustedYDomain = [
    yDomain.min + (yDomain.max - yDomain.min) * (1 - zoomLevel) / 2 + offset.y,
    yDomain.max - (yDomain.max - yDomain.min) * (1 - zoomLevel) / 2 + offset.y
  ];

  // Custom tooltip styling
  const CustomTooltip = ({ active, payload }) => {

    if (active && payload && payload.length && !isDrawing && !drawingMode) {
      return (
        <div className="bg-gray-800 border border-emerald-500 p-2 rounded shadow-lg text-white">
          <p className="text-emerald-400">{`Time: ${payload[0].payload.time}`}</p>
          <p className="text-white">{`Price: $${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Render chart and controls
  return (
    <div className="h-1/2 w-full bg-gray-900 p-4 text-white rounded-md">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-emerald-400">Stock Price</h2>
        <div className="flex space-x-4">
          <button 
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
          </button>
        </div>
      </div>
      
      <div 
        ref={chartRef}
        className="h-96 w-full relative cursor-grab select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: drawingMode ? 'crosshair' : isPanning ? 'grabbing' : 'grab' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={visibleData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#a0aec0' }} 
              stroke="#4a5568"
              interval={Math.max(1, Math.floor(visibleData.length / 8))}
              domain={['dataMin', 'dataMax + 100']}
              allowDataOverflow={true}
            />
            <YAxis 
              domain={adjustedYDomain}
              tick={{ fill: '#a0aec0' }} 
              stroke="#4a5568"
              tickFormatter={(value) => `${value}`}
              allowDataOverflow={true}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff' }}
              isAnimationActive={false}
            />
            {/* Reference line for starting price */}
            {data.length > 0 && (
              <ReferenceLine 
                y={data[0].price} 
                stroke="#6366f1" 
                strokeDasharray="3 3" 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        
        {/* Render drawings */}
        <svg ref = {svgRef} className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <g transform={`translate(${svgPos.x}, ${svgPos.y}) scale(${zoomLevel})`}> 
          {drawings.map((points, index) => (
            <polyline
              key={index}
              points={points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentDrawing.length > 1 && (
            <polyline
              points={currentDrawing.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          </g>
        </svg>
      </div>
      
      <div className="mt-4 text-gray-400 text-sm">
        <p>
          <span className="text-emerald-400 font-semibold">Instructions:</span> 
          {drawingMode ? 
            ' Click and drag to draw on chart' : 
            ' Click and drag to pan, use mouse wheel to zoom'
          }
        </p>
        <p className="mt-1">Current mode: <span className="text-emerald-400">{drawingMode ? 'Drawing' : 'Navigation'}</span></p>
      </div>
    </div>
  );
};

export default StockChart;
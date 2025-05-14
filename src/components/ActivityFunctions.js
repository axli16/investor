const recentActivities = []
let change = 0.0;
let perChange = 0;
let starting = -1;

export const getActivities = () => {
    console.log('got activities')
    return recentActivities;
}

export const addActivities = (date, type, amount, curChange, multiplier) => {
    if(recentActivities.length === 10){
        recentActivities.shift();
    }
    const data = {date: date, type: type, amount: amount, change: curChange, multiplier: multiplier};

    recentActivities.push(data);
    recentChange(curChange);
    percentChange();
    console.log(recentActivities);
}


export const resetActivities = () => {
    recentActivities = []
}

//broken for now 
const recentChange = (changeAmount) => {
    console.log(change + changeAmount);

    change =eval(change + changeAmount);
    
}

const percentChange = () => {
    perChange = change/ starting * 100;
}

export const getPercentChange = () => {
    return perChange.toFixed(0);
}
export const setChange = () => {
    change = 0;
}
export const getChange = () => {
    return change;
}

export const setStarting = (start) => {
    starting = start;
}
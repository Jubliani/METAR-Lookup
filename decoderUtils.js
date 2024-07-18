export function GetMonthAsString() {
    const months = ["January","February","March","April","May","June",
        "July","August","September","October","November","December"];
    return months[new Date().getMonth()];
    
}

export function GetTimeRange(timeRange, month) {
    return `${month} ${timeRange.slice(0, 2)} ${timeRange.slice(2, 4)}00Z to 
        ${month} ${timeRange.slice(5, 7)} ${timeRange.slice(7)}00Z`;
}
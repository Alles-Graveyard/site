const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default date => {
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};
export const daysLeft = (deadline) => {
  if (!deadline) return "N/A"; // Handle cases where deadline is undefined or null

  const deadlineInSeconds = Number(deadline); // If it's already in seconds. No need for the division
  // const deadlineInSeconds = Number(deadline) / 1000; // If it's in milliseconds, divide first

  const difference = new Date(deadlineInSeconds * 1000).getTime() - Date.now(); // Multiply by 1000 to get milliseconds
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const weiToEth = (wei) => {
  return (Number(wei) * 1e-18).toString();
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

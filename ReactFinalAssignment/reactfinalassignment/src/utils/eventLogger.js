const eventLog = [];

export const logEvent = (type, payload) => {
  const entry = {
    timestamp: new Date().toISOString(),
    type,
    payload,
    userAgent: navigator.userAgent
  };
  
  eventLog.push(entry);
  console.log('Event logged:', entry);
  
  
  if (process.env.NODE_ENV === 'production') {
    // fetch('/analytics', { method: 'POST', body: JSON.stringify(entry) })
  }
};


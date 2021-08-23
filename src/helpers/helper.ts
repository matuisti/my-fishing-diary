
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('currentUser') || '');
};

export const timeFormatter = (timestamp: number) => new Date(timestamp).toLocaleDateString();

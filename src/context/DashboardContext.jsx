// import { createContext, useContext, useState, useReducer } from 'react';

// // Default state for the dashboard
// const initialState = {
//   activeModule: 'overview',
// };

// // Reducer function to handle state updates
// const dashboardReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_ACTIVE_MODULE':
//       return { ...state, activeModule: action.payload };
//     default:
//       return state;
//   }
// };

// const DashboardContext = createContext();
// export const useDashboard = () => useContext(DashboardContext);

// export const DashboardProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(dashboardReducer, initialState);

//   const setActiveModule = (moduleKey) => {
//     dispatch({ type: 'SET_ACTIVE_MODULE', payload: moduleKey });
//   };

//   return (
//     <DashboardContext.Provider value={{ ...state, setActiveModule }}>
//       {children}
//     </DashboardContext.Provider>
//   );
// };
// DashboardContext.jsx
import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [activeModule, setActiveModule] = useState('overview'); // Default to 'overview'

  const changeModule = (module) => {
    setActiveModule(module);
  };

  return (
    <DashboardContext.Provider value={{ activeModule, changeModule }}>
      {children}
    </DashboardContext.Provider>
  );
};

import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from 'react';
const AppContext = createContext(null);
export function AppProvider({ children }) {
    const [selectedGame, setSelectedGame] = useState('Mobile Legends');
    const [selectedPackage, setSelectedPackage] = useState(514);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [userId, setUserId] = useState('');
    const [serverId, setServerId] = useState('');
    const [isValidated, setIsValidated] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const value = useMemo(() => ({
        selectedGame,
        setSelectedGame,
        selectedPackage,
        setSelectedPackage,
        paymentMethod,
        setPaymentMethod,
        userId,
        setUserId,
        serverId,
        setServerId,
        isValidated,
        setIsValidated,
        orderPlaced,
        setOrderPlaced,
        loading,
        setLoading,
        error,
        setError,
    }), [selectedGame, selectedPackage, paymentMethod, userId, serverId, isValidated, orderPlaced, loading, error]);
    return _jsx(AppContext.Provider, { value: value, children: children });
}
export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
}

import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
	isAdmin: boolean;
	setIsAdmin: (isAdmin: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	return (
		<AuthContext.Provider value={{ isAdmin, setIsAdmin }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

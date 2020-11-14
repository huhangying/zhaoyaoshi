import * as React from "react";
import { AppStoreService } from "./app-store.service";

export const AppContext = React.createContext(new AppStoreService());

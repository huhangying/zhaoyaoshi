import * as React from "react";
import { AppState } from "../../models/app.state";
import { AppStoreService } from "./app-store.service";



export const AppContext = React.createContext(new AppStoreService());

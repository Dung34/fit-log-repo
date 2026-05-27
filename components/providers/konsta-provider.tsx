'use client';

import { App } from "konsta/react";

function KonstaProvider({ children } : { children: React.ReactNode}){
    return <App 
    theme="ios"
    safeAreas={true}
    >{children}</App>
}

export default KonstaProvider;
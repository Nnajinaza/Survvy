import * as React from "react";

const Card = ({ children, className }) => {
    return <div className={`rounded-2xl border bg-white p-4 ${className}`}>{children}</div>;
}

export default Card
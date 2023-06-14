import { CircularProgress } from '@mui/material';
import React from 'react';
import './BlockLoader.css';


export default function BlockLoader() {
    return (
        <div className="blockLoader">
            <div className="circularProgressWrapper">
                <CircularProgress />
            </div>
        </div>
    )
}
import React from 'react'

import { Link } from 'react-router-dom';

export default function HomeIcon() {
    return (
        <div style={{width: 'fit-content'}}>
            <Link to="/" style={{height: '48px'}}>
                <div className="flex-row center homeIconContainer">
                    <h1 style={{cursor: 'pointer'}}>🍐</h1>

                    <div style={{width: '10px'}}></div>
                    <h1 style={{cursor: 'pointer'}}><span className="homeIcon">Pear</span>Code</h1>
                </div>
            </Link>
        </div>
    )
}

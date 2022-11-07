import React from 'react';
import './FormError.css'
export default function FormErrors({errors}) {
    return (
        <div className='form_errors'>
            {errors.length > 1 ? (
                <ul>
                    {errors.map((error, i) => (
                        <li key={i}>{error}</li>
                    ))}
                </ul>
            ): (
                <span>{errors[0]}</span>
            )}
        </div>
    );
}
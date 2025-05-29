import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const CustomCursor = () => {
    const mouseRef = useRef();
    useGSAP(() => {
        const moveCursor = (e) => {
            gsap.to(mouseRef.current, {
                x: e.x,
                y: e.y,
            });
        };
        document.addEventListener('mousemove', moveCursor);
        document.body.style.cursor = 'none'
    }, []);
    return (
        <div ref={mouseRef} className='h-5 w-5 bg-accent-primary rounded-full fixed -top-10 left-0 pointer-events-none z-50 transform translate-x-0 translate-y-0'>

        </div>
    )
}

export default CustomCursor

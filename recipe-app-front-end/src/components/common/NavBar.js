"use client"

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function NavBar() {

   const pathName = usePathname()
   const [isOpen, setIsOpen] = useState(false)

   const toggleMenu = () => setIsOpen(!isOpen)
   const hideMenu = () => setIsOpen(false)

   const router = useRouter()
   const navRef = useRef(null)

   const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
         setIsOpen(false)
      }
   }

   useEffect(() => {
      document.addEventListener('click', handleClickOutside)

      return () => {
         document.removeEventListener('click', handleClickOutside)
      }
   }, [])

   return (
      <nav data-test="nav-bar" ref={navRef}>
         <div className="logo" onClick={() => router.push('/')}>Recipe App</div>
         <button data-test="menu-button" className="menu-button" onClick={toggleMenu}>&#9776;</button>

         <ul data-test="nav-links-mobile" className={`nav-links ${isOpen ? 'open' : ''}`}>
            <li><Link href="/recipe" data-test="nav-link-recipes" className={pathName === '/recipe' ? 'active' : ''} onClick={hideMenu}>Recipes</Link></li>
            <li><Link href="/ingredients" data-test="nav-link-ingredients" className={pathName === '/ingredients' ? 'active' : ''} onClick={hideMenu}>Ingredients</Link></li>
         </ul>
      </nav>

   )
}
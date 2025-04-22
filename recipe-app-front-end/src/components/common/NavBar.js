"use client"

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavBar() {

   const pathName = usePathname()
   const [isOpen, setIsOpen] = useState(false)

   const toggleMenu = () => setIsOpen(!isOpen)
   const hideMenu = () => setIsOpen(false)

   return (
      <>
      <nav>

         <button className="menu-button" onClick={toggleMenu}>&#9776;</button>

         <div className="logo">Recipe App</div>

         <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li><Link href="/recipe"  className={pathName === '/recipe' ? 'active' : ''} onClick={hideMenu}>Recipes</Link></li>
          <li><Link href="/ingredients"  className={pathName === '/ingredients' ? 'active' : ''} onClick={hideMenu}>Ingredients</Link></li>
        </ul>
      </nav>
      </>
   )
}
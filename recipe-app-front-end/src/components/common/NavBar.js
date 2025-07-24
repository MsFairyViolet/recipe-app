"use client"

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function NavBar() {

   const pathName = usePathname()
   const [isOpen, setIsOpen] = useState(false)

   const toggleMenu = () => setIsOpen(!isOpen)
   const hideMenu = () => setIsOpen(false)

   const router = useRouter()

   return (
      <nav data-test="nav-bar">
         <div className="logo" onClick={() => router.push('/')}>Recipe App</div>
         <button data-test="menu-button" className="menu-button" onClick={toggleMenu}>&#9776;</button>

         <ul data-test="nav-links-mobile" className={`nav-links ${isOpen ? 'open' : ''}`}>
            <li><Link href="/recipe" data-test="nav-link-recipes" className={pathName === '/recipe' ? 'active' : ''} onClick={hideMenu}>Recipes</Link></li>
            <li><Link href="/ingredients" data-test="nav-link-ingredients" className={pathName === '/ingredients' ? 'active' : ''} onClick={hideMenu}>Ingredients</Link></li>
         </ul>
      </nav>

   )
}
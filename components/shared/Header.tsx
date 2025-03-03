import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedOut, UserButton } from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';
import { Button } from '../ui/button';
import Navitems from './Navitems';
import MobileNav from './MobileNav';

const Header = () => {
  return (
    <header className='w-full border-b'>
      <div className=' wrapper flex items-center justify-between' >
      <Link href={"/"} className='w-36'>
        
        <Image src= "/assets/images/logo.png" alt='MOST Logo' width={100} height={38}/>
        
       
      </Link>

      <SignedIn>
        <nav className='md:flex-between hidden w-full max-w-xs'>
        <Navitems/>
        </nav>
      </SignedIn>

      <div className='flex w-32 justify-end gap-3'>
        <SignedIn>
          <UserButton afterSwitchSessionUrl='/'/>
         <MobileNav/>
        </SignedIn>
      <SignedOut>
        <Button asChild className='rounded-full' size={'lg'}>
          <Link href={'/sign-in'}>
        Login
          </Link>
        </Button>
      </SignedOut>
      </div>
      </div>
    </header>
  )
}

export default Header

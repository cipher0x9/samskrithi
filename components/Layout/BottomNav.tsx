'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gamepad2, BookOpen, Sprout, User } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Today', icon: Home },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/garden', label: 'Garden', icon: Sprout },
  { href: '/temple', label: 'Temple', icon: BookOpen },
  { href: '/me', label: 'Me', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = pathname === t.href || (t.href === '/' && pathname === '/');
        return (
          <Link key={t.href} href={t.href} className={`nav-item ${active ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

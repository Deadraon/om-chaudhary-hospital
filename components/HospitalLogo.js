import Link from 'next/link';

/**
 * HospitalLogo - the official Om Chaudhary Hospital logo
 * 
 * @param {string} variant - 'dark' (white text, for dark backgrounds) | 'light' (dark text, for white backgrounds)
 * @param {string} size    - 'sm' | 'md' | 'lg'
 * @param {string} href    - link destination (default '/')
 * @param {string} className - extra wrapper classes
 */
export default function HospitalLogo({ variant = 'light', size = 'md', href = '/', className = '' }) {
  const sizeMap = {
    sm: { icon: 'w-8 h-8 text-xl p-1.5 rounded-xl', title: 'text-xs', sub: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 'w-11 h-11 text-2xl p-2 rounded-2xl', title: 'text-sm', sub: 'text-[10px]', gap: 'gap-3' },
    lg: { icon: 'w-14 h-14 text-3xl p-2.5 rounded-2xl', title: 'text-base', sub: 'text-[11px]', gap: 'gap-3' },
  };

  const s = sizeMap[size] || sizeMap.md;

  const iconBg   = 'bg-[#0f465c] border border-[#21738e]/40 shadow-inner';
  const titleCol = variant === 'dark' ? 'text-white'   : 'text-gray-900';
  const subCol   = variant === 'dark' ? 'text-cyan-300' : 'text-cyan-600';

  return (
    <Link href={href} className={`flex items-center ${s.gap} group flex-shrink-0 ${className}`}>
      {/* Icon Box — matches the teal rounded square from the login screen */}
      <div
        className={`${s.icon} ${iconBg} flex items-center justify-center shadow-lg
          group-hover:scale-105 transition-transform duration-200 flex-shrink-0 backdrop-blur-sm`}
      >
        🏥
      </div>

      {/* Text */}
      <div>
        <p className={`font-extrabold ${s.title} ${titleCol} tracking-wider leading-none uppercase`}>
          Om Chaudhary
        </p>
        <p className={`${s.sub} ${subCol} font-bold uppercase tracking-widest mt-0.5`}>
          Hospital &amp; Trauma Centre
        </p>
      </div>
    </Link>
  );
}

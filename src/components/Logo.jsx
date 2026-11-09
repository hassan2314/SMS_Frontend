const Logo = ({ width = 64, title = "School Management" }) => {
  const size = Number.parseInt(width, 10) || 64;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
    >
      <rect width="64" height="64" rx="14" fill="#1B4F72" />
      <path fill="#ffffff" d="M12 30.5 32 16l20 14.5V50H12V30.5z" />
      <path fill="#1B4F72" d="M28 38h8v12h-8z" />
      <path fill="#148F77" d="M16 31h32v3.2H16z" />
    </svg>
  );
};

export default Logo;

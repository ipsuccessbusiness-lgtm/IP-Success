'use client';

export default function PrintButton({ 
  className, 
  id, 
  children,
  closeAfterPrint
}: { 
  className?: string;
  id?: string;
  children: React.ReactNode;
  closeAfterPrint?: boolean;
}) {
  return (
    <button
      id={id}
      className={className}
      onClick={() => {
        window.print();
        if (closeAfterPrint) window.close();
      }}
    >
      {children}
    </button>
  );
}

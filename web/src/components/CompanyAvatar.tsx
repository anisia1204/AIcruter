interface CompanyAvatarProps {
  companyName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CompanyAvatar({ 
  companyName, 
  size = "md", 
  className = "" 
}: CompanyAvatarProps) {
  // Get the first letter of the company name
  const firstLetter = companyName.charAt(0).toUpperCase();
  
  // Generate a consistent color based on the company name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500", 
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
      "bg-emerald-500",
      "bg-violet-500",
    ];
    
    // Create a simple hash from the company name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use the hash to pick a color consistently
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  // Size classes
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm", 
    lg: "w-10 h-10 text-base"
  };

  const bgColor = getAvatarColor(companyName);
  const sizeClass = sizeClasses[size];

  return (
    <div 
      className={`
        ${bgColor} 
        ${sizeClass} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        text-white 
        font-semibold 
        shadow-sm
        ${className}
      `}
    >
      {firstLetter}
    </div>
  );
}

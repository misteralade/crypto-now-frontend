const CustomButton = ({
  buttonText,
  className,
}: {
  buttonText: string;
  className?: string;
}) => {
  return (
    <button
      className={`bg-[#03034D] cursor-pointer text-white px-6 py-3 rounded-full font-medium hover:bg-[#03034D]/90 transition-colors ${className}`}
    >
      {buttonText}
    </button>
  );
};

export default CustomButton;

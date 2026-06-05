import SignUp from "@/features/auth/components/forms/SignUpForm";

export default function SignUpPage() {
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
       <div className="hidden md:block md:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/food-app.png")' }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      <div className="flex-1 md:w-1/2 bg-gradient-to-b from-accent-orange from-[0.01%]
        via-accent-yellow via-[49.5%] to-accent-orange to-[99.99%]
        flex items-center justify-center p-4 md:p-8">
        <SignUp/>
      </div>
    </div>
  );
}
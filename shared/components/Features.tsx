import { Card } from "@/shared/ui/card";
import { Leaf, Calendar, BookOpen, Smartphone } from 'lucide-react';

export default function Features() {

    const features = [
    {
      icon: Leaf,
      title: "Extensive Plant List",
      description: "Browse through various plant species with detailed care requirements, growing conditions, and identification guides."
    },
    {
      icon: Calendar,
      title: "Task Scheduling and Reminders",
      description: "Never miss watering or fertilizing again with customizable schedules and timely notifications for all your plant care needs."
    },
    {
      icon: BookOpen,
      title: "Plant Care Journal and Logs",
      description: "Track your plants' growth, health changes, and care activities with detailed logs and photo documentation over time."
    },
    {
      icon: Smartphone,
      title: "Mobile Accessibility",
      description: "Access your plant care information anywhere with Gardemic's responsive mobile interface, perfect for caring for plants on the go."
    }
  ];

  return (
    <>
      <div className="flex items-center justify-center mx-auto text-4xl font-aclonica mt-60 mb-15">Features</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12 font-montserrat">
        {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
            <Card 
            key={index}
            className="p-8 hover:shadow-lg transition-shadow"
            >
            <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Icon className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
                {feature.description}
            </p>
            </Card>
        );
        })}
    </div>
      
    
    </>

  );
}
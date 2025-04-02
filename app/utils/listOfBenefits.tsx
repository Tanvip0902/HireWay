import { Briefcase,Users ,Zap,Eye,SmileIcon as Tooth,Heart,Umbrella,Clock,
    Calendar,GraduationCap,Dumbbell,Brain,Home,Bitcoin,UserCircle,PieChart,Coins,MonitorOff,Shield,UserPlus
 } from "lucide-react";
import React from "react";

 interface Benefit{
    id:string;
    label: string;
    icon: React.ReactNode;
 }

 export const benefits: Benefit[]=[
    {id:"401k",label:"401(k)",icon: <Briefcase  className="w-3 h-3"/>},
    {
        id: "distributed",
        label: "Distributed team",
        icon: <Users className="w-3 h-3"/>,
    },
    {id: "async", label: "Async", icon:<Zap className="w-3 h-3"/>},
    {
      id: "vision",
      label:"vision insurance",
      icon: <Eye className="w-3 h-3"/>
    },
    {
      id: "health-insurance",
      label: "Health Insurance",
      icon: <Heart className="w-3 h-3" />,
  },
    {
      id: "paid-time-off",
      label: "Paid Time Off",
      icon: <Umbrella className="w-3 h-3" />,
  },
  {
   id: "flexible-hours",
   label: "Flexible Hours",
   icon: <Clock className="w-3 h-3" />,
},
{
   id: "professional-development",
   label: "Professional Development",
   icon: <GraduationCap className="w-3 h-3" />,
},
{
   id: "company-retreats",
   label: "Company Retreats",
   icon: <Calendar className="w-3 h-3" />,
},
{
   id: "wellness-benefits",
   label: "Wellness Benefits",
   icon: <Dumbbell className="w-3 h-3" />,
},
{
   id: "mental-health-support",
   label: "Mental Health Support",
   icon: <Brain className="w-3 h-3" />,
},
{
   id: "remote-friendly",
   label: "Remote Friendly",
   icon: <Home className="w-3 h-3" />,
},
{
   id: "stock-options",
   label: "Stock Options",
   icon: <Bitcoin className="w-3 h-3" />,
},
{
   id: "employee-recognition",
   label: "Employee Recognition",
   icon: <UserCircle className="w-3 h-3" />,
},
{
   id: "performance-bonus",
   label: "Performance Bonus",
   icon: <PieChart className="w-3 h-3" />,
},
{
   id: "referral-bonus",
   label: "Referral Bonus",
   icon: <UserPlus className="w-3 h-3" />,
},
{
   id: "retirement-plan",
   label: "Retirement Plan",
   icon: <Coins className="w-3 h-3" />,
},
{
   id: "tech-stipend",
   label: "Tech Stipend",
   icon: <MonitorOff className="w-3 h-3" />,
},
{
   id: "insurance",
   label: "Insurance",
   icon: <Shield className="w-3 h-3" />,
},
{
   id: "dental-care",
   label: "Dental Care",
   icon: <Tooth className="w-3 h-3" />,
},
 ]
"use client";

import { useState } from 'react';
// import Image from "next/image";

// Define a type for Task based on the backend schema
interface Task {
  id: number;
  user_id: string;
  description: string;
  due_date: string | null; // Assuming date comes as string or null
  completed: boolean;
  created_at: string; // Assuming date comes as string
  updated_at: string; // Assuming date comes as string
}

interface MemoryItem {
  id: number;
  description: string;
  icon: string;
  time?: string; // Optional time for recent memory
}

interface DocumentItem {
  id: number;
  filename: string;
  icon: string;
}

interface StrategicPriority {
  id: number;
  description: string;
  progress: number;
  update: string;
}

// New interface for Decision History Item
interface DecisionHistoryItem {
  id: number;
  month: string;
  title: string;
  description: string;
}

export default function Home() {
  // --- Dummy Data --- //

  const initialCoFounderChecks: MemoryItem[] = [
    // Updated dummy data for relevant industries
    { id: 1, description: "Discussed Q2 sales targets and strategy\nNeed to focus on lead conversion", icon: "💬" },
    { id: 2, description: "Reviewing compliance requirements for new product\nEnsure alignment with regulations", icon: "📋" },
  ];

  const initialStrategicPriorities: StrategicPriority[] = [
    // Updated dummy data for relevant industries
    { id: 1, description: "Achieve profitability within 18 months", progress: 75, update: "2 days ago" },
    { id: 2, description: "Expand market share in target segment", progress: 60, update: "1 week ago" },
  ];

  const initialInvestorsSection: MemoryItem[] = [
    // Updated dummy data for relevant industries
    { id: 1, description: "Follow up with interested VC firms\nSend updated pitch deck", icon: "📧" },
    { id: 2, description: "Prepare monthly investor update\nHighlight key milestones", icon: "📊" },
  ];

  const initialRecentMemory: MemoryItem[] = [
    // Updated dummy data for relevant industries
    { id: 1, description: "Decision to pivot marketing strategy towards digital channels", icon: "✨" },
    { id: 2, description: "Discussion on optimizing claims processing workflow", icon: "⚙️" },
  ];

  const initialRecentDocuments: DocumentItem[] = [
    // Updated dummy data for relevant industries
    { id: 1, filename: "Q1 Financial Report", icon: "📄" },
    { id: 2, filename: "Investor Pitch Deck v3.0", icon: "📁" },
    { id: 3, filename: "Compliance Checklist - New Insurance Product", icon: "📋" },
  ];

  const initialTodaysTasks: Task[] = [
    // Updated dummy data for relevant industries
    { id: 1, user_id: "founder1", description: "Finalize termsheet with Bank X", completed: false, due_date: null, created_at: '', updated_at: '' },
    { id: 2, user_id: "founder1", description: "Meet with insurance underwriters", completed: true, due_date: null, created_at: '', updated_at: '' },
    { id: 3, user_id: "founder1", description: "Prepare agenda for broking team meeting", completed: false, due_date: null, created_at: '', updated_at: '' },
    { id: 4, user_id: "founder1", description: "Review Q1 sales performance", completed: false, due_date: null, created_at: '', updated_at: '' },
  ];

  // Dummy data for Decision History Timeline based on the new image
  const initialDecisionHistory: DecisionHistoryItem[] = [
    // Updated dummy data for relevant industries
    { id: 1, month: "January", title: "Implemented stricter lending criteria", description: "Saw an increase in defaults, decided to tighten criteria to manage risk." },
    { id: 2, month: "February", title: "Launched online insurance application portal", description: "Aimed to streamline the application process and improve customer experience." },
    { id: 3, month: "February", title: "Formed partnership with a new re-broker", description: "Expanded our network to offer clients a wider range of options." },
    { id: 4, month: "March", title: "Revised commission structure for sales team", description: "Incentivize higher value deals and improve sales performance." },
    // Add more dummy data as needed
  ];

  const fundraisingStageSample = {
    question: "How to optimize capital allocation for growth vs. risk mitigation in the current market?",
    icon: "💼"
  };

  const runwayAndBurnSample = {
    runway: "12 months", // Example for these industries
    burn: "$60k/mo",    // Example for these industries
    change: "-10 % mo", // Example
    runwayProgress: 60, // Example
  };

  const okrTrackerSample = {
    objective: "Increase loan application conversion rate by 15%", // Example
    progress: "8/15",
    progressValue: (8/15) * 100,
  };

  // --- State --- //

  const [tasks, setTasks] = useState<Task[]>(initialTodaysTasks); // Start with dummy tasks
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // --- Event Handlers --- //

  const addTask = async () => {
    if (!newTaskDescription.trim()) return; // Prevent adding empty tasks

    // For dummy data, simulate adding a task locally
    const newTask: Task = {
      id: tasks.length + 1, // Simple dummy ID
      user_id: "founder1",
      description: newTaskDescription,
      due_date: null,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setNewTaskDescription('');

    // Original backend call (commented out for dummy data)
    // const taskData = {
    //   user_id: "founder1",
    //   description: newTaskDescription,
    //   due_date: null,
    // };
    // try {
    //   const response = await fetch('/api/tasks/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(taskData),
    //   });
    //   if (response.ok) {
    //     const newTask: Task = await response.json();
    //     setTasks([...tasks, newTask]);
    //     setNewTaskDescription('');
    //   } else {
    //     console.error('Failed to add task:', response.statusText);
    //   }
    // } catch (error) {
    //   console.error('Error adding task:', error);
    // }
  };

  // Basic handler for checkbox - toggles completed status locally
  const toggleTaskCompleted = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Placeholder handler for button clicks
  const handleButtonClick = (buttonName: string) => {
    console.log(`${buttonName} button clicked`);
    // Implement specific actions later
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans antialiased">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm border-b border-gray-200">
        <div className="text-xl font-bold text-gray-900">FounderMate</div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Dashboard</a>
           <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Decisions</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Investors</a>
          <button 
            className="px-5 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold"
            onClick={() => handleButtonClick('Ask MCP')}
          >
            Ask MCP
          </button>
        </nav>
         {/* Mobile menu button - Placeholder */}
         <div className="md:hidden">
             <button className="text-gray-600 hover:text-gray-800" onClick={() => handleButtonClick('Mobile Menu')}>☰</button>
         </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto w-full">
        {/* Left Column */}
        <div className="md:col-span-2 flex flex-col gap-8">

          {/* Welcome Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Good morning, Sara</h1>
              <div className="mt-4 bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Custom AI co-founder for your startup</h3>
                  <p className="text-sm text-gray-600 mt-1">Remembers product decisions, founder tasks. Investor meetings, and more.</p>
                </div>
                <div className="ml-4 text-3xl text-purple-600">🧠</div> 
              </div>
            </div>
             <button 
                 className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center text-sm font-medium border border-gray-300"
                 onClick={() => handleButtonClick('Upload Documents')}
             >
                 <span className="mr-2 text-xl">⬆️</span>
                Upload documents
             </button>
          </div>

           {/* Decision History Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Decision history timeline</h2>
                <button className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium border border-gray-300"
                         onClick={() => handleButtonClick('View Report')}
                >View report</button>
            </div>
             <p className="text-sm text-gray-600 mb-6">Timeline of key company decisions with context behind each</p>

            <div className="relative pl-4">
                {/* Vertical timeline line */}
                 <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                {/* Map over months and decisions */}
                 {/* Group decisions by month */}
                {Object.entries(initialDecisionHistory.reduce((acc, decision) => {
                     acc[decision.month] = [...(acc[decision.month] || []), decision];
                     return acc;
                 }, {} as Record<string, DecisionHistoryItem[]>)).map(([month, decisions]) => (
                     <div key={month} className="mb-8">
                         <h3 className="text-lg font-semibold text-gray-800 mb-4 relative z-10 bg-white pr-4 inline-block -ml-4 pl-4">{month}</h3>
                         <div className="space-y-6">
                             {decisions.map(decision => (
                                 <div key={decision.id} className="flex items-start relative">
                                     {/* Numbered Circle */}
                                     <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 -ml-3 z-10">{decision.id}</div>
                                     {/* Decision Card */}
                                     <div className="flex-1 ml-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                                          <div className="flex items-center mb-2">
                                            {/* Icon Placeholder - replace with actual icon if available */}
                                             <span className="mr-2 text-xl text-gray-600">📄</span>
                                             <h4 className="font-semibold text-gray-800">{decision.title}</h4>
                                          </div>
                                          <p className="text-sm text-gray-700 leading-snug">{decision.description}</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 ))}
            </div>

          </div>

           {/* Co-Founder Checks */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Co-Founder Checks</h2>
             <div className="space-y-3">
               {initialCoFounderChecks.map(item => (
                  <div key={item.id} className="flex items-start text-gray-700">
                     <span className="mr-3 text-xl text-blue-500">{item.icon}</span>
                     <span className="leading-snug">{item.description}</span>
                 </div>
               ))}
             </div>
          </div>

           {/* Recent Memory */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Memory</h2>
            <div className="space-y-3">
              {initialRecentMemory.map(item => (
                <div key={item.id} className="flex items-center text-gray-700">
                  <span className="mr-3 text-xl text-green-600">{item.icon}</span>
                  <span>{item.description}</span>
                 </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="md:col-span-1 flex flex-col gap-8">
          {/* Today's Tasks */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Today&apos;s Tasks</h2>
            <div className="space-y-3">
              {/* Map over the tasks state */}
              {tasks.map(task => (
                <div key={task.id} className="flex items-start text-gray-700">
                  <input 
                    type="checkbox" 
                    className="mr-3 mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    checked={task.completed} 
                    onChange={() => toggleTaskCompleted(task.id)}
                   />
                  <span className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.description}
                   </span>
                </div>
              ))}
            </div>
            {/* Add Task Input */}
            <div className="mt-6 flex">
                <input
                    type="text"
                    className="flex-grow border border-gray-300 rounded-l-md p-2 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a new task"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            addTask();
                        }
                    }}
                />
                <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                    onClick={addTask}
                >
                    Add Task
                </button>
            </div>
          </div>

          {/* Fundraising Stage */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Fundraising Stage</h2>
             <div className="bg-gray-100 p-4 rounded-lg">
                 <div className="flex items-center text-gray-700">
                    <span className="mr-3 text-2xl text-purple-600">{fundraisingStageSample.icon}</span>
                    <span className="font-semibold">@mmyloryed emmary-...</span>
                </div>
                <p className="text-gray-700 mt-3 leading-snug">{fundraisingStageSample.question.split('\n')[0]}</p>
                 <p className="text-gray-600 text-sm mt-1 leading-snug">{fundraisingStageSample.question.split('\n')[1]}</p>
            </div>
          </div>

          {/* Runway & Burn */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Runway & Burn</h2>
            <div className="flex items-center justify-between">
                 <div className="flex items-center text-gray-700">
                    <span className="mr-3 text-2xl text-red-600">📊</span>
                     <div>
                         <p>Runway: <span className="font-semibold">{runwayAndBurnSample.runway}</span></p>
                         <p className="text-sm">Burn: <span className="font-semibold">{runwayAndBurnSample.burn}</span></p>
                     </div>
                 </div>
                 <div className="flex items-center">
                    <span className="text-green-600 font-semibold text-sm mr-2">{runwayAndBurnSample.change}</span>
                     <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${runwayAndBurnSample.runwayProgress}%` }}></div>
                    </div>
                 </div>
            </div>
          </div>

          {/* OKR Tracker */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">OKR Tracker</h2>
             <div className="flex items-center justify-between text-gray-700">
                 <div className="flex items-center">
                     <span className="mr-3 text-2xl text-green-600">✅</span>
                    <span>{okrTrackerSample.objective}</span>
                 </div>
                 <span className="text-gray-600 text-sm">{okrTrackerSample.progress}</span>
            </div>
             <div className="w-full bg-gray-200 rounded-full mt-3 overflow-hidden">
                 <div className="h-2 bg-green-500" style={{ width: `${okrTrackerSample.progressValue}%` }}></div>
            </div>
          </div>

           {/* Strategic Priorities */}
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Strategic Priorities</h2>
             <div className="space-y-3">
               {initialStrategicPriorities.map(item => (
                 <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                     <div className="flex items-center text-gray-700">
                        <span className="mr-3 text-xl text-yellow-500">⭐</span>
                       <span>{item.description}</span>
                     </div>
                     <div className="flex items-center">
                         <div className="w-16 h-2 bg-gray-200 rounded-full mr-3 overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${item.progress}%` }}></div>
                         </div>
                        <span className="text-sm text-gray-500">Last update: {item.update}</span>
                     </div>
                 </div>
               ))}
            </div>
          </div>

           {/* Investors */}
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Investors</h2>
             <div className="space-y-3">
               {initialInvestorsSection.map(item => (
                 <div key={item.id} className="flex items-start text-gray-700">
                     <span className="mr-3 text-xl text-blue-500">{item.icon}</span>
                    <span>{item.description.split('\n')[0]}<br/>{item.description.split('\n')[1]}</span>
                 </div>
               ))}
            </div>
             <div className="mt-4 text-sm text-blue-600 flex items-center">
                 <span className="mr-1">Memory-lin oxia</span>
                 <span>→</span>
            </div>
          </div>


          {/* Recent Documents */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Documents</h2>
            <div className="space-y-3">
              {initialRecentDocuments.map(doc => (
                 <div key={doc.id} className="flex items-center text-gray-700">
                    <span className="mr-3 text-xl text-orange-500">{doc.icon}</span>
                    <span>{doc.filename}</span>
                </div>
              ))}
            </div>
            <button 
                className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                 onClick={() => handleButtonClick('Upload Documents Footer')}
            >
                 <span className="mr-2 text-xl">⬆️</span>
                Upload documents
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

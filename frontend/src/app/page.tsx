"use client";

import { useState, useEffect } from 'react';
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

export default function Home() {
  // Sample data (will be replaced by fetched data)
  const initialTasks: Task[] = []; // Initialize as empty, will fetch from backend

  // Sample data based on the new image
  const decisionMemory = [
    { id: 1, description: "Dropped enterprise sales model\nFeb 17 Hor faster iterations", date: "Feb 17", progress: 80 },
    { id: 2, description: "Hired two engineers\nTo accelerate development speed", date: "Feb 1", progress: 90 },
    { id: 3, description: "Changed pricing model\nTo better sult startups", date: "Jon 19", progress: 70 },
  ];

  const coFounderChecks = [
    { id: 1, description: "QWhen are we launching v3?\nAjay suggested April 10", icon: "💬" }, // Using chat icon for conversation/question
  ];

   const strategicPriorities = [
    { id: 1, description: "1sl 0 Milestone", progress: 60, update: "3 days ago" },
  ];

  const investorsSection = [
    { id: 1, description: "Emailed:\nFinal numbers\nLast update 5d", icon: "📧" }, // Using email icon
  ];

  const recentMemory = [
    { id: 1, description: "Rebrand from Easyinvest to Pyneer", icon: "✨" }, // Using sparkle icon
  ];

  const recentDocuments = [
    { id: 1, filename: "Product Vision & Roadmap", icon: "📄" },
    { id: 2, filename: "Pitch Deck (v2.0)", icon: "📁" },
  ];

  const todaysTasksSample = [
    { id: 1, description: "Prep for YC application", completed: false },
    { id: 2, description: "@Michael add 2 factor login", completed: true },
    { id: 3, description: "Test the analytics dashboard", completed: false },
  ];

   const fundraisingStageSample = {
    question: "How far soon we will fail\ndeall fast? Next steps: flact ov",
    icon: "💼" // Briefcase icon for fundraising
  };

  const runwayAndBurnSample = {
    runway: "9 months",
    burn: "$40k/mo",
    change: "+27 % mo",
    runwayProgress: 75, // Placeholder for progress bar
  };

   const okrTrackerSample = {
    objective: "Onboard 1S NBFC clients",
    progress: "7/15",
    progressValue: 7/15 * 100 // Placeholder for progress bar
  };


  // State for tasks and new task input
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  // Fetch tasks from backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks/?user_id=founder1'); // Fetch tasks for a user
        if (response.ok) {
          const tasksData: Task[] = await response.json();
          setTasks(tasksData); // Update state with fetched tasks
        } else {
          console.error('Failed to fetch tasks:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to add a new task
  const addTask = async () => {
    if (!newTaskDescription.trim()) return; // Prevent adding empty tasks

    const taskData = {
      user_id: "founder1", // Placeholder user ID
      description: newTaskDescription,
      due_date: null, // Or set a default/selectable due date
    };

    try {
      const response = await fetch('/api/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask: Task = await response.json();
        setTasks([...tasks, newTask]); // Add the new task to the list
        setNewTaskDescription(''); // Clear the input field
      } else {
        console.error('Failed to add task:', response.statusText);
        // Handle errors, maybe show a notification to the user
      }
    } catch (error) {
      console.error('Error adding task:', error);
      // Handle network errors
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="text-xl font-bold">FounderMate</div>
        <nav className="hidden md:flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-gray-800">Dashboard</a>
           <a href="#" className="text-gray-600 hover:text-gray-800">Decisions</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Investors</a>
          <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Ask MCP</button>
        </nav>
         {/* Mobile menu button - Placeholder */}
         <div className="md:hidden">
             <button className="text-gray-600 hover:text-gray-800">☰</button>
         </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Welcome Section */}
          <div className="bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Good morning, Sara</h1>
            {/* Custom AI Co-founder Section */}
            <div className="bg-gray-200 p-4 rounded flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Custom AI co-founder for your startup</h3>
                <p className="text-sm text-gray-600">Remembers product decisions, founder tasks. Investor meetings, and more.</p>
              </div>
              <div className="ml-4 text-2xl">{/* Icon Placeholder */} 🧠</div>
            </div>
          </div>

           {/* Decision Memory Timeline */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Decision Memory Timeline</h2>
            <div className="space-y-4">
              {decisionMemory.map(decision => (
                 <div key={decision.id} className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-700 font-semibold">Q: {decision.description.split('\n')[0]}</p>
                        <p className="text-sm text-gray-600">{decision.description.split('\n')[1]}</p>
                    </div>
                     <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">{decision.date}</span>
                         {/* Placeholder for progress bar */}
                        <div className="w-12 h-3 bg-gray-300 rounded">
                            <div className="h-full bg-green-500 rounded" style={{ width: `${decision.progress}%` }}></div>
                         </div>
                     </div>
                 </div>
              ))}
            </div>
          </div>

           {/* Co-Founder Checks */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Co-Founder Checks</h2>
             <div className="space-y-2">
               {coFounderChecks.map(item => (
                  <div key={item.id} className="flex items-center">
                     <span className="mr-2 text-xl">{item.icon}</span>
                     <span>{item.description}</span>
                 </div>
               ))}
             </div>
          </div>

           {/* Recent Memory */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Recent Memory</h2>
            <div className="space-y-4">
              {recentMemory.map(item => (
                <div key={item.id} className="flex items-center">
                  <span className="mr-2 text-xl">{item.icon}</span>
                  <span>{item.description}</span>
                 </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Today's Tasks */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Today's Tasks</h2>
            <div className="space-y-2">
              {/* Map over the tasks state */}
              {tasks.map(task => (
                <div key={task.id} className="flex items-center">
                  <input type="checkbox" className="mr-2" checked={task.completed} readOnly/>
                  <span>{task.description}</span>
                </div>
              ))}
            </div>
            {/* Add Task Input */}
            <div className="mt-4 flex">
                <input
                    type="text"
                    className="flex-grow border rounded-l p-2 text-gray-800"
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
                    className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
                    onClick={addTask}
                >
                    Add Task
                </button>
            </div>
          </div>

          {/* Fundraising Stage */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Fundraising Stage</h2>
             <div className="bg-gray-100 p-4 rounded">
                 <div className="flex items-center">
                    <span className="mr-2 text-xl">{fundraisingStageSample.icon}</span> {/* Placeholder Icon */}
                    <span className="font-semibold">@mmyloryed emmary-...</span> {/* Placeholder text from image */}
                </div>
                <p className="text-gray-700 mt-2">{fundraisingStageSample.question.split('\n')[0]}</p>
                 <p className="text-sm text-gray-600">{fundraisingStageSample.question.split('\n')[1]}</p>
            </div>
          </div>

          {/* Runway & Burn */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Runway & Burn</h2>
            <div className="flex items-center justify-between">
                 <div className="flex items-center">
                    <span className="mr-2 text-xl">📊</span> {/* Placeholder Icon */}
                     <div>
                         <p className="text-gray-700">Runway: {runwayAndBurnSample.runway}</p>
                         <p className="text-gray-700 text-sm">Burn: {runwayAndBurnSample.burn}</p>
                     </div>
                 </div>
                 <div className="flex items-center">
                    <span className="text-green-600 font-semibold mr-2">{runwayAndBurnSample.change}</span>
                     {/* Placeholder for smaller progress bar/indicator */}
                    <div className="w-8 h-2 bg-gray-300 rounded">
                        <div className="h-full bg-green-500 rounded" style={{ width: `${runwayAndBurnSample.runwayProgress}%` }}></div>
                    </div>
                 </div>
            </div>
          </div>

          {/* OKR Tracker */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">OKR Tracker</h2>
             <div className="flex items-center justify-between">
                 <div className="flex items-center">
                     <span className="mr-2 text-xl">✅</span> {/* Placeholder Icon */}
                    <span className="text-gray-700">{okrTrackerSample.objective}</span>
                 </div>
                 <span className="text-gray-600">{okrTrackerSample.progress}</span>
            </div>
             {/* Placeholder for progress bar */}
            <div className="w-full bg-gray-300 rounded mt-2">
                 <div className="h-2 bg-green-500 rounded" style={{ width: `${okrTrackerSample.progressValue}%` }}></div>
            </div>
          </div>

           {/* Strategic Priorities */}
           <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Strategic Priorities</h2>
             <div className="space-y-2">
               {strategicPriorities.map(item => (
                 <div key={item.id} className="flex items-center justify-between">
                     <div className="flex items-center">
                        <span className="mr-2 text-xl">⭐</span> {/* Placeholder Icon */}
                       <span className="text-gray-700">{item.description}</span>
                     </div>
                     <div className="flex items-center">
                         <div className="w-12 h-3 bg-gray-300 rounded mr-2">
                            <div className="h-full bg-green-500 rounded" style={{ width: `${item.progress}%` }}></div>
                         </div>
                        <span className="text-sm text-gray-500">Last update: {item.update}</span>
                     </div>
                 </div>
               ))}
            </div>
          </div>

           {/* Investors */}
           <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Investors</h2>
             <div className="space-y-2">
               {investorsSection.map(item => (
                 <div key={item.id} className="flex items-center">
                     <span className="mr-2 text-xl">{item.icon}</span>
                    <span className="text-gray-700">{item.description.split('\n')[0]}<br/>{item.description.split('\n')[1]}</span>
                 </div>
               ))}
            </div>
             {/* Placeholder for Memory-lin text */}
            <div className="mt-2 text-sm text-gray-600">Memory-lin oxia &gt;</div>
          </div>


          {/* Recent Documents */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Recent Documents</h2>
            <div className="space-y-2">
              {recentDocuments.map(doc => (
                 <div key={doc.id} className="flex items-center">
                    <span className="mr-2 text-xl">{doc.icon}</span>
                    <span>{doc.filename}</span>
                </div>
              ))}
            </div>
             {/* Upload documents button - Moved from left column */}
            <button className="mt-4 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 flex items-center justify-center">
                {/* Icon */}
                 <span className="mr-2 text-xl">⬆️</span>
                Upload documents
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

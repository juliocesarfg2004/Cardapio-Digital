import { create } from 'zustand'

type Task = {
  id: Number | String;
  text: String;
};

type TaskStore = {
  tasks: Task[];
  addTask: (text: string) => void;
  removeTask: (id: Number | String) => void;
  editTask: (id: Number | String, text: String) => void
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (text) => set((state) => ({
    tasks: [...state.tasks, { id: Date.now(), text: text}]
  })),
  removeTask: (id) => set((state) => ({
    tasks: [...state.tasks.filter(task => task.id !== id)]
  })),
  editTask: (id, text) => set((state) => ({
    tasks: [...state.tasks.map(task => task.id === id ? {...task, text:text} : task)]
  }))
}))
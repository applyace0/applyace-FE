export interface CVData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }>;
  skills: string;
  certifications: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'cv_data';

export const storage = {
  saveCV: (cvData: Omit<CVData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const existingData = storage.getAllCVs();
    const newCV: CVData = {
      ...cvData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    existingData.push(newCV);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    return newCV;
  },

  updateCV: (id: string, cvData: Partial<CVData>) => {
    const existingData = storage.getAllCVs();
    const index = existingData.findIndex(cv => cv.id === id);
    
    if (index === -1) return null;
    
    const updatedCV = {
      ...existingData[index],
      ...cvData,
      updatedAt: new Date().toISOString(),
    };
    
    existingData[index] = updatedCV;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    return updatedCV;
  },

  getCV: (id: string) => {
    const existingData = storage.getAllCVs();
    return existingData.find(cv => cv.id === id) || null;
  },

  getAllCVs: (): CVData[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  deleteCV: (id: string) => {
    const existingData = storage.getAllCVs();
    const filteredData = existingData.filter(cv => cv.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
  },
}; 
// API service for connecting to JSON server
// In production, replace with your actual API endpoints

const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Students
  async getStudents() {
    return this.request('/students');
  }

  async getStudent(id: string) {
    return this.request(`/students/${id}`);
  }

  async updateStudent(id: string, data: any) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Teachers
  async getTeachers() {
    return this.request('/teachers');
  }

  async getTeacher(id: string) {
    return this.request(`/teachers/${id}`);
  }

  // Lessons
  async getLessons() {
    return this.request('/lessons');
  }

  async updateLesson(id: string, data: any) {
    return this.request(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async reorderLessons(lessons: any[]) {
    // Update lesson order after drag-and-drop
    return Promise.all(
      lessons.map((lesson, index) =>
        this.updateLesson(lesson.id, { ...lesson, order: index })
      )
    );
  }

  // Events
  async getEvents() {
    return this.request('/events');
  }

  async createEvent(data: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: any) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
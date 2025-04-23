export interface CoursePath {
  id: string;
  title: string;
  description: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
  imageUrl: string;
  completed: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  type: string;
  completed: boolean;
}

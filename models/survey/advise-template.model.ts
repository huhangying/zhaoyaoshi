export interface AdviseTemplate {
  _id?: string;
  name?: string; // advise name
  department?: string; // id

  questions?: Question[];
  order?: number;
  // apply?: boolean;
}

export interface Question {
  question: string;
  is_inline: boolean;
  weight: number;
  required: boolean;
  order?: number;
  answer_type: number; // 0: boolean; 1: radio; 2: multiple; 3: text
  options: QuestionOption[];
  // apply: boolean;
}

export interface QuestionOption {
  answer: string;
  input_required?: boolean;
  input?: string;
  hint?: string;
  weight?: number;
  selected?: boolean;
}


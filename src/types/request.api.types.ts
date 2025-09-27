export interface AuthRequestSchema {
    email: string;
    password: string;
    keepLoggedIn?: boolean;
}
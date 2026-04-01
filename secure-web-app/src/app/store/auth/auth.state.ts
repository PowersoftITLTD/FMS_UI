// export interface AuthState {
//   token: string | null;
//   userEncryptedDetails: string;
//   isLoggedIn: boolean;  // optional
// }

// export const initialAuthState: AuthState = {
//   token: null,
//   userEncryptedDetails: '',
//   isLoggedIn: true
// };



export interface AuthState {
    token: string | null;
    user:string;
    wareHouse:string;
    isLoggedIn:boolean;
}

export const initialAuthState: AuthState = {
    token:  null,
    user:'',
    wareHouse:'',
    isLoggedIn:false
};

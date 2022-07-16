import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
    id: string;
    name?: {
        first: string;
        middle?: string;
        last: string;
    };
    gender?: "M" | "F";
    dateOfBirth?: {
        date: number;
        month: number;
        year: number;
    };
    verifiedIdentifiers?: [
        {
            type: string;
            value: string;
        }
    ];
    healthId?: string;
    profilePhoto?: string;
}

export interface IUserSlice {
    profile: IUser;
}

const initialState: IUserSlice = {
    profile: {
        id: "",
    },
};

const userSlice = createSlice({
    name: "auth",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        updateProfile: (state, { payload }: PayloadAction<IUserSlice>) => {
            state.profile = {
                ...state.profile,
                ...payload.profile,
            };
        },
    },
});

// exposing actions
export const { updateProfile } = userSlice.actions;

// exporting the reducer
export default userSlice.reducer;

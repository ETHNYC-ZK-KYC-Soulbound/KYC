import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../store'

// Define a type for the slice state
//
// NOTE: Don't use Set or Map
// - Set and Map are optimized for mutability (https://github.com/reduxjs/redux/issues/1499)
// - Set can't be serialized

export interface PsbOutputLayer {
  path: string
  name: string
  width: number
  height: number
  buffer: string
}

// Redux State for Collection
interface ApplicationState {
  // PSB File Data
  psbFile: PsbOutputLayer[] | undefined,
}

// Define the initial state using that type
const initialState: ApplicationState = {
  psbFile: undefined,
}

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updatePsbFile: (state, action: PayloadAction<PsbOutputLayer[]>) => {
      state.psbFile = action.payload
    },
  },
})

export const { updatePsbFile } = applicationSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectPsbFile = (state: RootState): PsbOutputLayer[] | undefined => state.application.psbFile

export default applicationSlice.reducer

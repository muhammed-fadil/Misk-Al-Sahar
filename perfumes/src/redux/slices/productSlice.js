import {createSlice} from '@reduxjs/toolkit'

const initialState={
    products:[]
}

const productSlice=createSlice({
    name:'products',
    initialState,
    reducers:{
        setProducts:((state,action)=>{
            state.products=action.payload
        }),
        clearProducts:((state)=>{
            state.action=[]
        })
    }
})
export const{setProducts,clearProducts}=productSlice.actions
export default productSlice.reducer
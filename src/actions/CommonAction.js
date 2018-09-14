
export const getSimpleCommonAction=(type)=>{
    return{
        type:type
    };
};

export const getBaseCommonAction=(type,data)=>{
    return {
        type:type,
        data:data
    }
}